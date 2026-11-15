import { ArrowRight } from 'lucide-react';
import { Product } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface FeaturedProductsSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewAll: () => void;
}

export function FeaturedProductsSection({
  products,
  onSelectProduct,
  onAddToCart,
  onViewAll,
}: FeaturedProductsSectionProps) {
  return (
    <section
      id="featured-products"
      className="py-16 lg:py-24 bg-white border-b border-black/[0.08]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#0D0D0D]"
              style={{ textWrap: 'balance' }}
            >
              Featured Digital Products
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#626262]">
              Structured courses built for real-world design systems and software engineering.
            </p>
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#005EFF] hover:text-[#0F2CCF] transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] rounded-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <article
              key={product.id}
              className="group flex flex-col justify-between bg-white border border-black/[0.08] rounded-xl overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
            >
              <div>
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005EFF]"
                >
                  <div className="aspect-[4/3] w-full bg-[#F3F3F3] overflow-hidden">
                    <ResilientImage
                      src={product.image}
                      alt={product.imageAlt}
                      fallbackLabel={product.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                </button>

                <div className="p-5 pb-4">
                  <div className="text-xs text-[#626262] mb-1.5">
                    <span>{product.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{product.duration.split('·')[0].trim()}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] rounded-sm"
                  >
                    <h3 className="font-display text-base font-semibold text-[#0D0D0D] group-hover:text-[#005EFF] transition-colors">
                      {product.title}
                    </h3>
                  </button>
                  <p className="mt-2 text-sm text-[#626262] line-clamp-3 leading-relaxed">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-black/[0.06] flex items-center justify-between gap-3">
                <div>
                  <span className="block text-[11px] text-[#626262]">Price</span>
                  <span className="font-mono text-[15px] font-medium text-[#0D0D0D] tabular-nums">
                    {product.formattedPrice}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="px-3.5 py-2 min-h-[40px] text-xs font-medium text-[#0D0D0D] bg-[#F3F3F3] hover:bg-[#0D0D0D] hover:text-white rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
