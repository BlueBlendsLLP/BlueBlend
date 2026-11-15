import { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Product, ProductCategory } from '../data/blueblendsData';
import { ResilientImage } from './ResilientImage';

interface ShopViewProps {
  products: Product[];
  onNavigateHome: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'name-asc';

const CATEGORIES: ProductCategory[] = [
  'All Products',
  'Courses',
  'E-Books',
  'Graphics',
];

export function ShopView({
  products,
  onNavigateHome,
  onSelectProduct,
  onAddToCart,
}: ShopViewProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All Products');
  const [maxPrice, setMaxPrice] = useState<number>(99999);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  const filteredProducts = useMemo(() => {
    const base = products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All Products' ||
        item.category === selectedCategory;
      const matchesPrice = item.price <= maxPrice;
      return matchesCategory && matchesPrice;
    });

    if (sortBy === 'price-asc') {
      return [...base].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...base].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'name-asc') {
      return [...base].sort((a, b) => a.title.localeCompare(b.title));
    }
    return base;
  }, [products, selectedCategory, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All Products');
    setMaxPrice(99999);
    setSortBy('recommended');
  };

  return (
    <section className="py-12 lg:py-16 bg-white min-h-[70vh]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#626262] mb-6">
          <button
            type="button"
            onClick={onNavigateHome}
            className="hover:text-[#0D0D0D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] rounded-sm"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-[#0D0D0D] font-medium">All Products</span>
        </nav>

        <div className="border-b border-black/[0.08] pb-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0D0D0D]">
              All Products
            </h1>
            <p className="mt-2 text-sm sm:text-base text-[#626262]">
              Browse self-paced technical courses and creative digital products.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#626262] tabular-nums">
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </span>
            <label className="flex items-center gap-2 text-sm text-[#626262]">
              <span className="whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white border border-black/[0.14] rounded-lg px-3 py-2 text-sm text-[#0D0D0D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price (low to high)</option>
                <option value="price-desc">Price (high to low)</option>
                <option value="name-asc">Name A–Z</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="font-display text-sm font-semibold text-[#0D0D0D] mb-3">
                Browse by
              </h2>
              <div className="flex flex-wrap lg:flex-col gap-1.5">
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF] ${
                        active
                          ? 'bg-[#D6E6FE]/60 text-[#005EFF] font-medium'
                          : 'text-[#626262] hover:text-[#0D0D0D] hover:bg-[#F3F3F3]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-black/[0.08]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-sm font-semibold text-[#0D0D0D]">
                  Filter by Price
                </h2>
                <span className="font-mono text-xs text-[#0D0D0D] tabular-nums">
                  Up to ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={9999}
                max={99999}
                step={1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                aria-label="Maximum price filter in Indian Rupees"
                className="w-full accent-[#005EFF] cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-[#626262] font-mono tabular-nums mt-1.5">
                <span>₹9,999</span>
                <span>₹99,999</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="border border-black/[0.08] rounded-xl bg-[#F3F3F3]/50 p-10 text-center">
                <p className="font-display text-lg font-semibold text-[#0D0D0D]">
                  No digital products match this filter yet
                </p>
                <p className="mt-2 text-sm text-[#626262] max-w-md mx-auto">
                  {selectedCategory !== 'All Products' && selectedCategory !== 'Courses'
                    ? `New ${selectedCategory} releases are currently in production. Explore our flagship courses in the meantime.`
                    : 'Adjust your price ceiling or reset filters to view the full Blueblends catalog.'}
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 px-5 py-2.5 min-h-[40px] bg-[#0D0D0D] hover:bg-[#005EFF] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                          <span>{product.level}</span>
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
                      <span className="font-mono text-[15px] font-medium text-[#0D0D0D] tabular-nums">
                        {product.formattedPrice}
                      </span>
                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="px-3.5 py-2 min-h-[40px] text-xs font-medium text-white bg-[#005EFF] hover:bg-[#0F2CCF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005EFF]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
