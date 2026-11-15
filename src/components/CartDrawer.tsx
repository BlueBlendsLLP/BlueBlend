import { FormEvent, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { Product } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';
import { API_BASE } from '../config/api.ts';

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_self' | '_blank' | '_modal' | HTMLElement;
      }) => Promise<{
        error?: { message: string; code?: string };
        paymentDetails?: unknown;
        redirect?: boolean;
      }>;
    };
  }
}

/**
 * Loads the official Cashfree JS SDK v3 from CDN if not already present
 */
async function ensureCashfreeLoaded(): Promise<any> {
  if (typeof window.Cashfree === 'function') {
    return window.Cashfree;
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="sdk.cashfree.com"]');
    if (existing) {
      if (typeof window.Cashfree === 'function') {
        return resolve(window.Cashfree);
      }
      existing.addEventListener('load', () => {
        if (typeof window.Cashfree === 'function') {
          resolve(window.Cashfree);
        } else {
          reject(new Error('Cashfree SDK loaded but window.Cashfree not found'));
        }
      });
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.Cashfree === 'function') {
        resolve(window.Cashfree);
      } else {
        reject(new Error('Cashfree SDK loaded but window.Cashfree is not a function'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Cashfree JS SDK script from CDN'));
    document.head.appendChild(script);
  });
}

export interface CartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}

export interface ConfirmedOrderDetails {
  orderId: string;
  cfPaymentId?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  accessLinks?: {
    courseTitle: string;
    accessPortalUrl: string;
    licenseKey: string;
  }[];
  isSimulated?: boolean;
}

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateCustomPrice?: (productId: string, customPrice: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onBrowseShop: () => void;
  defaultEmail?: string | null;
  initialOrder?: ConfirmedOrderDetails | null;
  onClearInitialOrder?: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onUpdateCustomPrice,
  onRemoveItem,
  onClearCart,
  onBrowseShop,
  defaultEmail,
  initialOrder,
  onClearInitialOrder,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>(
    initialOrder ? 'confirmed' : 'cart'
  );
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(defaultEmail || '');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<'_self' | '_modal'>('_self');
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderDetails | null>(
    initialOrder || null
  );

  useEffect(() => {
    if (initialOrder) {
      setConfirmedOrder(initialOrder);
      setStep('confirmed');
    }
  }, [initialOrder]);

  useEffect(() => {
    if (defaultEmail && !email) {
      setEmail(defaultEmail);
    }
  }, [defaultEmail, email]);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + (item.customPrice ?? item.product.price) * item.quantity,
    0
  );

  const handleCheckoutSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Please enter a valid email address for digital delivery.');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }

    setFormError('');
    setIsProcessing(true);

    try {
      // 1. Create order on the backend
      // Ensure returnUrl is strictly https:// to satisfy Cashfree's URL validation
      const baseOrigin = window.location.origin.replace(/^http:\/\//i, 'https://');
      const returnUrl = `${baseOrigin}/?order_id={order_id}`;

      const response = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            customPrice: i.customPrice,
          })),
          customer: {
            name: fullName.trim(),
            email: email.trim(),
            phone: cleanPhone,
          },
          returnUrl,
        }),
      });

      const orderData = await response.json();

      if (!response.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment order');
      }

        const { orderId, paymentSessionId, environment } = orderData;

      // 2. Open Cashfree Gateway (Redirect or Modal)
      if (paymentSessionId) {
        const CashfreeSDK = await ensureCashfreeLoaded();
        const cashfree = CashfreeSDK({
          mode: environment === 'production' ? 'production' : 'sandbox',
        });

        // Trigger checkout (Redirect or Modal)
        const checkoutRes = await cashfree.checkout({
          paymentSessionId,
          redirectTarget: checkoutTarget,
        });

        if (checkoutRes && checkoutRes.error) {
          setIsProcessing(false);
          setFormError(checkoutRes.error.message || 'Payment redirection failed.');
          return;
        }

        // If _modal was chosen and payment completes inside modal:
        if (checkoutTarget === '_modal') {
          const verifyRes = await fetch(`${API_BASE}/api/payment/status/${orderId}`);
          const verifyData = await verifyRes.json();
          if (verifyData.success && verifyData.status === 'PAID') {
            setConfirmedOrder({
              orderId,
              cfPaymentId: verifyData.cfPaymentId,
              amount: verifyData.amount || subtotal,
              customerName: fullName.trim(),
              customerEmail: email.trim(),
              accessLinks: verifyData.accessLinks,
              isSimulated: false,
            });
            setStep('confirmed');
            onClearCart();
          }
        }
        return;
      }

      throw new Error('Cashfree payment session could not be established. Please check your network and try again.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFormError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
      if (onClearInitialOrder) {
        onClearInitialOrder();
      }
    }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-white h-full flex flex-col border-l border-black/[0.08]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-[#0D0D0D]">
              {step === 'cart'
                ? 'Your Cart'
                : step === 'checkout'
                ? 'Digital Checkout'
                : 'Order Confirmed'}
            </h2>
            {step === 'cart' && items.length > 0 && (
              <span className="text-xs font-mono text-[#626262]">
                ({items.reduce((s, i) => s + i.quantity, 0)})
              </span>
            )}
            {step === 'checkout' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EBF3FF] text-[#005EFF]">
                <ShieldCheck className="w-3 h-3" /> Cashfree Gateway
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {step === 'cart' && items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-[#8C8C8C] hover:text-[#DC2626] font-medium transition-colors px-2 py-1 rounded hover:bg-[#FEF2F2]"
                title="Remove all items from cart"
              >
                Clear all
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close cart"
              className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#626262] hover:text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-4 space-y-6">
              <div className="w-12 h-12 rounded-full bg-[#D6E6FE] text-[#005EFF] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#005EFF] bg-[#EBF3FF] px-2 py-1 rounded">
                    Order #{confirmedOrder.orderId}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-[#0D0D0D]">
                  Payment Successful & Verified
                </h3>
                <p className="text-sm text-[#626262] leading-relaxed">
                  Thank you,{' '}
                  <span className="text-[#0D0D0D] font-medium">
                    {confirmedOrder.customerName}
                  </span>
                  . Your payment of{' '}
                  <span className="text-[#0D0D0D] font-semibold">
                    ₹{confirmedOrder.amount.toLocaleString('en-IN')}.00
                  </span>{' '}
                  was processed securely via Cashfree PG.
                </p>
                {confirmedOrder.cfPaymentId && (
                  <p className="text-xs font-mono text-[#8C8C8C]">
                    Cashfree Reference: {confirmedOrder.cfPaymentId}
                  </p>
                )}
              </div>

              {/* Course Deliverables & License Keys */}
              {confirmedOrder.accessLinks && confirmedOrder.accessLinks.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0D0D0D]">
                    Your Course Access & Deliverables
                  </h4>
                  <div className="space-y-2.5">
                    {confirmedOrder.accessLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-black/[0.08] bg-[#FAFAFA] space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-[#0D0D0D] truncate">
                            {link.courseTitle}
                          </p>
                          <span className="text-[11px] font-mono font-medium text-[#005EFF] bg-[#EBF3FF] px-2 py-0.5 rounded">
                            {link.licenseKey}
                          </span>
                        </div>
                        <a
                          href={link.accessPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#005EFF] hover:text-[#0F2CCF] transition-colors"
                        >
                          <span>Launch Learning Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#F3F3F3] space-y-1 text-xs text-[#626262]">
                <p className="font-medium text-[#0D0D0D]">Digital Delivery Confirmation</p>
                <p>
                  Full access credentials, course tokens, and tax invoice have been queued for{' '}
                  <span className="font-medium text-[#0D0D0D]">{confirmedOrder.customerEmail}</span>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  handleClose();
                }}
                className="w-full py-3 px-5 min-h-[44px] bg-[#0D0D0D] hover:bg-[#005EFF] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Continue Exploring
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F3F3F3] text-[#626262] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-display text-base font-semibold text-[#0D0D0D]">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm text-[#626262]">
                  Add a course or digital resource to begin checkout.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onBrowseShop();
                }}
                className="px-5 py-2.5 min-h-[40px] bg-[#005EFF] hover:bg-[#0F2CCF] text-white text-sm font-medium rounded-lg transition-colors"
              >
                Browse Courses
              </button>
            </div>
          ) : step === 'cart' ? (
            <ul className="divide-y divide-black/[0.08]">
              {items.map(({ product, quantity, customPrice }) => {
                const itemPrice = customPrice ?? product.price;
                return (
                  <li key={product.id} className="py-4 flex gap-4">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-[#F3F3F3] shrink-0 border border-black/[0.06]">
                      <ResilientImage
                        src={product.image}
                        alt={product.imageAlt}
                        fallbackLabel={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-sm font-semibold text-[#0D0D0D] truncate">
                          {product.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          aria-label={`Remove ${product.title} from cart`}
                          className="inline-flex items-center gap-1 text-xs text-[#8C8C8C] hover:text-[#DC2626] transition-colors px-1.5 py-0.5 rounded hover:bg-[#FEF2F2] shrink-0"
                          title={`Remove ${product.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                      <p className="font-mono text-xs text-[#626262] tabular-nums mt-0.5">
                        {customPrice ? (
                          <span className="text-[#005EFF] font-medium">
                            Your Bid: ₹{customPrice.toLocaleString('en-IN')}.00
                          </span>
                        ) : (
                          product.formattedPrice
                        )}
                      </p>

                      {product.isBiddable && (
                        <div className="mt-2 p-2 bg-[#F0F5FF] border border-[#005EFF]/20 rounded-md">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-semibold text-[#005EFF]">⚡ Adjust Your Bid</span>
                            <span className="text-[#626262]">Min ₹{product.minBid || 99}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-medium text-[#0D0D0D]">₹</span>
                            <input
                              type="number"
                              min={product.minBid || 99}
                              step="1"
                              value={customPrice ?? product.minBid ?? 99}
                              onChange={(e) => {
                                const val = Math.max(product.minBid || 99, parseInt(e.target.value) || (product.minBid || 99));
                                onUpdateCustomPrice?.(product.id, val);
                              }}
                              className="w-24 px-2 py-0.5 text-xs font-mono border border-black/15 rounded bg-white text-[#0D0D0D] focus:border-[#005EFF] focus:outline-none"
                            />
                            <span className="text-[11px] text-[#626262]">per seat</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-black/[0.14] rounded-md">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(product.id, quantity - 1)
                            }
                            aria-label={
                              quantity === 1
                                ? `Remove ${product.title}`
                                : `Decrease quantity for ${product.title}`
                            }
                            className="w-7 h-7 inline-flex items-center justify-center hover:bg-[#F3F3F3] text-[#626262] hover:text-[#DC2626] transition-colors"
                            title={quantity === 1 ? 'Remove from cart' : 'Decrease'}
                          >
                            {quantity === 1 ? (
                              <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" aria-hidden="true" />
                            ) : (
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            )}
                          </button>
                          <span className="w-7 text-center font-mono text-xs tabular-nums">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(product.id, quantity + 1)
                            }
                            aria-label={`Increase quantity for ${product.title}`}
                            className="w-7 h-7 inline-flex items-center justify-center hover:bg-[#F3F3F3]"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                        <span className="font-mono text-sm font-medium text-[#0D0D0D] tabular-nums">
                          ₹{(itemPrice * quantity).toLocaleString('en-IN')}.00
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <form
              id="checkout-form"
              onSubmit={handleCheckoutSubmit}
              noValidate
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-[#F3F3F3] space-y-2.5">
                <div className="flex items-center justify-between text-xs text-[#626262]">
                  <span className="font-medium text-[#0D0D0D]">Order Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
                  <span className="font-mono text-[#0D0D0D] tabular-nums font-semibold">
                    ₹{subtotal.toLocaleString('en-IN')}.00
                  </span>
                </div>

                {/* Item List with Remove in Checkout */}
                <ul className="divide-y divide-black/[0.06] pt-1">
                  {items.map(({ product, quantity, customPrice }) => {
                    const itemPrice = customPrice ?? product.price;
                    return (
                      <li key={product.id} className="py-2 flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[#8C8C8C] font-mono tabular-nums shrink-0">{quantity}×</span>
                          <span className="truncate text-[#0D0D0D]">
                            {product.title}
                            {customPrice ? (
                              <span className="text-[#005EFF] font-mono ml-1 font-medium">
                                (Bid: ₹{customPrice.toLocaleString('en-IN')})
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[#0D0D0D] tabular-nums font-medium">
                            ₹{(itemPrice * quantity).toLocaleString('en-IN')}.00
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onRemoveItem(product.id);
                              if (items.length <= 1) {
                                setStep('cart');
                              }
                            }}
                            aria-label={`Remove ${product.title} from checkout`}
                            className="text-[#8C8C8C] hover:text-[#DC2626] p-1 rounded hover:bg-black/[0.05] transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <div className="pt-2 border-t border-black/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#626262]">
                    <span>Payment Gateway</span>
                    <span className="text-[#0D0D0D] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#005EFF]" /> Cashfree (UPI / Cards / NetBanking)
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#626262]">
                    <span>Digital Delivery</span>
                    <span className="text-[#0D0D0D]">Instant Lifetime Access</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#626262] bg-[#F9FAFB] p-3 rounded-xl border border-black/[0.08]">
                <span className="font-medium text-[#0D0D0D]">Checkout Flow:</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="checkoutTarget"
                      value="_self"
                      checked={checkoutTarget === '_self'}
                      onChange={() => setCheckoutTarget('_self')}
                      className="text-[#005EFF] focus:ring-[#005EFF]"
                    />
                    <span className="text-xs text-[#0D0D0D] font-medium">Gateway Redirect</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="checkoutTarget"
                      value="_modal"
                      checked={checkoutTarget === '_modal'}
                      onChange={() => setCheckoutTarget('_modal')}
                      className="text-[#005EFF] focus:ring-[#005EFF]"
                    />
                    <span className="text-xs text-[#0D0D0D] font-medium">Popup Modal</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-medium text-[#0D0D0D]"
                >
                  Full Name
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  disabled={isProcessing}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.16] text-sm text-[#0D0D0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-email"
                  className="block text-xs font-medium text-[#0D0D0D]"
                >
                  Email for Course Delivery
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  disabled={isProcessing}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.16] text-sm text-[#0D0D0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-medium text-[#0D0D0D]"
                >
                  Phone Number (for SMS & UPI updates)
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  disabled={isProcessing}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-black/[0.16] text-sm text-[#0D0D0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] disabled:opacity-50"
                />
              </div>

              {formError && (
                <div role="alert" className="p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl text-xs text-[#DC2626]">
                  <p className="leading-relaxed font-medium">{formError}</p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-6 border-t border-black/[0.08] space-y-4 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#626262]">Total Amount</span>
              <span className="font-mono text-lg font-medium text-[#0D0D0D] tabular-nums">
                ₹{subtotal.toLocaleString('en-IN')}.00
              </span>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-5 min-h-[44px] bg-[#005EFF] hover:bg-[#0F2CCF] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  disabled={isProcessing}
                  className="px-4 py-3 min-h-[44px] border border-black/[0.14] text-sm font-medium text-[#0D0D0D] rounded-lg hover:bg-[#F3F3F3] transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="flex-1 py-3 px-5 min-h-[44px] bg-[#005EFF] hover:bg-[#0F2CCF] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redirecting to Cashfree...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {checkoutTarget === '_self'
                          ? `Pay ₹${subtotal.toLocaleString('en-IN')}.00 (Redirect)`
                          : `Pay ₹${subtotal.toLocaleString('en-IN')}.00 (Modal)`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
