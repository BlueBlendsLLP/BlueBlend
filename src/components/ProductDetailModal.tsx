import { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { Product } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customPrice?: number) => void;
  onBuyNow: (product: Product, quantity: number, customPrice?: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [bidAmount, setBidAmount] = useState(499);
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    setQuantity(1);
    if (product?.isBiddable) {
      setBidAmount(product.minBid ? Math.max(product.minBid, 499) : 499);
      setBidError('');
    }
  }, [product?.id, product?.isBiddable, product?.minBid]);

  if (!product) return null;

  const minBid = product.minBid || 99;
  const effectivePrice = product.isBiddable ? bidAmount : product.price;
  const totalAmount = effectivePrice * quantity;

  const handleBidChange = (val: number) => {
    setBidAmount(val);
    if (val < minBid) {
      setBidError(`Minimum bid is ₹${minBid}`);
    } else {
      setBidError('');
    }
  };

  const handleAddAction = () => {
    if (product.isBiddable && bidAmount < minBid) {
      setBidError(`Please enter at least ₹${minBid} to place a bid.`);
      return;
    }
    onAddToCart(product, quantity, product.isBiddable ? bidAmount : undefined);
    onClose();
  };

  const handleBuyAction = () => {
    if (product.isBiddable && bidAmount < minBid) {
      setBidError(`Please enter at least ₹${minBid} to place a bid.`);
      return;
    }
    onBuyNow(product, quantity, product.isBiddable ? bidAmount : undefined);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-black/[0.08] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.08] shrink-0">
          <div className="text-xs text-[#626262]">
            <span>Shop</span>
            <span className="mx-1.5" aria-hidden="true">/</span>
            <span className="text-[#0D0D0D] font-medium">{product.title}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="w-10 h-10 inline-flex items-center justify-center rounded-lg text-[#626262] hover:text-[#0D0D0D] hover:bg-[#F3F3F3] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Product Visual & Syllabus */}
          <div className="lg:col-span-6 space-y-6">
            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F3F3F3] border border-black/[0.08]">
              <ResilientImage
                src={product.image}
                alt={product.imageAlt}
                fallbackLabel={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-sm font-semibold text-[#0D0D0D]">
                Curriculum Modules
              </h3>
              <ul className="divide-y divide-black/[0.06] border-y border-black/[0.06]">
                {product.modules.map((mod) => (
                  <li key={mod} className="py-2.5 text-sm text-[#626262]">
                    {mod}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs text-[#626262]">
                    {product.category} · {product.duration} · {product.level}
                  </span>
                  {product.isBiddable && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#005EFF]/10 text-[#005EFF] text-[11px] font-semibold">
                      ⚡ Community Bid Masterclass
                    </span>
                  )}
                </div>
                <h2
                  id="pdp-title"
                  className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0D0D]"
                >
                  {product.title}
                </h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-medium text-[#0D0D0D] tabular-nums">
                    ₹{totalAmount.toLocaleString('en-IN')}.00
                  </span>
                  {product.isBiddable && (
                    <span className="text-xs text-[#626262] font-mono">
                      (₹{bidAmount.toLocaleString('en-IN')} × {quantity})
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-[15px] text-[#626262] leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Special Bidding Box for Biddable Product */}
              {product.isBiddable && (
                <div className="p-4 rounded-xl bg-[#F0F5FF] border border-[#005EFF]/25 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-[#005EFF] tracking-wide uppercase">
                        Name Your Price / Place Your Bid
                      </h4>
                      <p className="text-xs text-[#626262] mt-0.5">
                        Minimum bid: ₹{minBid} · Enter any amount you want to contribute
                      </p>
                    </div>
                  </div>

                  {/* Preset Bid Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[minBid, 299, 499, 999, 1999].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleBidChange(amt)}
                        className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                          bidAmount === amt
                            ? 'bg-[#005EFF] text-white border-[#005EFF] font-semibold'
                            : 'bg-white text-[#0D0D0D] border-black/15 hover:border-[#005EFF]'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}{amt === minBid ? ' (Min)' : amt === 499 ? ' (Popular)' : ''}
                      </button>
                    ))}
                  </div>

                  {/* Custom Bid Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <label htmlFor="custom-bid-input" className="text-xs font-medium text-[#0D0D0D]">
                      Custom Amount:
                    </label>
                    <div className="relative inline-flex items-center">
                      <span className="absolute left-2.5 text-xs text-[#626262] font-mono">₹</span>
                      <input
                        id="custom-bid-input"
                        type="number"
                        min={minBid}
                        step="1"
                        value={bidAmount}
                        onChange={(e) => handleBidChange(parseInt(e.target.value) || 0)}
                        className="pl-6 pr-3 py-1.5 w-32 text-xs font-mono font-medium border border-black/20 rounded-md bg-white text-[#0D0D0D] focus:border-[#005EFF] focus:ring-1 focus:ring-[#005EFF] outline-none"
                      />
                    </div>
                  </div>

                  {bidError && (
                    <p className="text-xs text-[#DC2626] font-medium">{bidError}</p>
                  )}
                </div>
              )}

              {/* Quantity & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-[#626262]">
                    Seats / Quantity
                  </span>
                  <div className="inline-flex items-center border border-black/[0.14] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="w-10 h-10 inline-flex items-center justify-center text-[#0D0D0D] hover:bg-[#F3F3F3] rounded-l-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="w-10 text-center font-mono text-sm tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      aria-label="Increase quantity"
                      className="w-10 h-10 inline-flex items-center justify-center text-[#0D0D0D] hover:bg-[#F3F3F3] rounded-r-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAddAction}
                    className="w-full py-3 px-5 min-h-[44px] bg-[#0D0D0D] hover:bg-[#212121] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    {product.isBiddable ? 'Place Bid & Add to Cart' : 'Add to Cart'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyAction}
                    className="w-full py-3 px-5 min-h-[44px] bg-[#005EFF] hover:bg-[#0F2CCF] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    {product.isBiddable ? `Bid & Enroll (₹${totalAmount.toLocaleString('en-IN')})` : 'Buy Now'}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-black/[0.08] space-y-2.5">
                <h3 className="font-display text-sm font-semibold text-[#0D0D0D]">
                  Included with Enrollment
                </h3>
                <ul className="space-y-2">
                  {product.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-[#626262]"
                    >
                      <Check
                        className="w-4 h-4 text-[#005EFF] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-xs text-[#626262] pt-4 border-t border-black/[0.08]">
              Digital product fulfilled immediately by BlueBlends Digital Services LLP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
