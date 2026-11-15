import { useEffect, useState } from 'react';
import { Check, Minus, Plus, X } from 'lucide-react';
import { Product } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  if (!product) return null;

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
                <p className="text-xs text-[#626262] mb-1">
                  {product.category} · {product.duration} · {product.level}
                </p>
                <h2
                  id="pdp-title"
                  className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0D0D]"
                >
                  {product.title}
                </h2>
                <p className="mt-3 font-mono text-2xl font-medium text-[#0D0D0D] tabular-nums">
                  {product.formattedPrice}
                </p>
              </div>

              <p className="text-sm sm:text-[15px] text-[#626262] leading-relaxed">
                {product.fullDescription}
              </p>

              {/* Quantity & Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-[#626262]">
                    Quantity
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
                    onClick={() => {
                      onAddToCart(product, quantity);
                      onClose();
                    }}
                    className="w-full py-3 px-5 min-h-[44px] bg-[#0D0D0D] hover:bg-[#212121] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onBuyNow(product, quantity);
                      onClose();
                    }}
                    className="w-full py-3 px-5 min-h-[44px] bg-[#005EFF] hover:bg-[#0F2CCF] text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Buy Now
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
