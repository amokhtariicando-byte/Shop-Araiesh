import { Eye, Heart, Plus, RotateCcw, ShoppingBag, Star } from 'lucide-react';
import { CATEGORIES, type ProductItem } from '../data/catalog';
import { formatToman, toPersianDigits } from '../lib/scrollMath';

interface FeaturedProductsProps {
  products: ProductItem[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  showWishlistOnly: boolean;
  onClearFilters: () => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: ProductItem) => void;
  onQuickView: (product: ProductItem) => void;
}

export function FeaturedProducts({
  products,
  activeCategory,
  onSelectCategory,
  searchQuery,
  showWishlistOnly,
  onClearFilters,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView,
}: FeaturedProductsProps) {
  const hasActiveFilter =
    activeCategory !== 'all' || searchQuery.trim().length > 0 || showWishlistOnly;

  return (
    <section
      id="products"
      className="scroll-mt-36 max-w-[1320px] mx-auto px-4 md:px-6 pt-16 md:pt-20 pb-12"
    >
      {/* Header Row matching Video 00:27 - 00:28 */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-zinc-200/70">
        <div className="space-y-2">
          <p className="text-xs font-medium text-[#6D28D9]">پیشنهاد داریمش</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B2E] tracking-tight">
            {showWishlistOnly ? 'محصولات مورد علاقه شما' : 'محصولات منتخب'}
          </h2>
        </div>

        <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
          از هر دسته، محصولات برتر با تنوع، کیفیت و کارایی بی‌نظیر را برای شما
          برگزیده‌ایم.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <div
          role="tablist"
          aria-label="فیلتر محصولات منتخب"
          className="flex items-center gap-2 overflow-x-auto pb-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all' && !showWishlistOnly}
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'all' && !showWishlistOnly
                ? 'bg-[#2E1065] text-white'
                : 'bg-[#F4F3F7] text-zinc-600 hover:text-[#5B21B6]'
            }`}
          >
            همه محصولات
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#2E1065] text-white font-semibold'
                  : 'bg-[#F4F3F7] text-zinc-600 hover:text-[#5B21B6]'
              }`}
            >
              {cat.shortTitle}
            </button>
          ))}
        </div>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B21B6] hover:text-[#2E1065] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>حذف فیلترها</span>
          </button>
        )}
      </div>

      {/* 4-Column Product Grid */}
      {products.length === 0 ? (
        <div className="mt-12 rounded-3xl bg-[#F7F6FA] py-16 px-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white mx-auto flex items-center justify-center text-[#6D28D9] shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1E1B2E]">
            محصولی مطابق با فیلتر انتخابی یافت نشد
          </h3>
          <p className="text-sm text-zinc-500 max-w-sm mx-auto">
            فیلتر دسته‌بندی یا عبارت جستجو را تغییر دهید تا همه محصولات داریمش
            نمایش داده شوند.
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E1065] text-white text-xs font-semibold hover:bg-[#4C1D95] transition-colors"
          >
            نمایش همه محصولات
          </button>
        </div>
      ) : (
        <div
          data-testid="featured-products-grid"
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {products.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            return (
              <article
                key={product.id}
                className="group flex flex-col rounded-[24px] bg-white border border-zinc-200/70 hover:border-[#6D28D9]/30 hover:shadow-xl hover:shadow-[#5B21B6]/5 transition-all duration-300 overflow-hidden"
              >
                {/* Studio Product Image Stage */}
                <div className="relative aspect-[4/4.2] bg-[#F5F4F8] flex items-center justify-center p-6 overflow-hidden">
                  {/* Top action icons */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                    {product.badge ? (
                      <span className="text-[11px] font-semibold text-[#5B21B6]">
                        {product.badge}
                      </span>
                    ) : (
                      <span />
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onQuickView(product)}
                        aria-label={`مشاهده جزئیات ${product.title}`}
                        className="w-8 h-8 rounded-full bg-white/90 text-zinc-600 hover:text-[#5B21B6] flex items-center justify-center shadow-sm transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleWishlist(product.id)}
                        aria-label={
                          isWishlisted
                            ? `حذف ${product.title} از علاقه‌مندی‌ها`
                            : `افزودن ${product.title} به علاقه‌مندی‌ها`
                        }
                        aria-pressed={isWishlisted}
                        className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-colors ${
                          isWishlisted
                            ? 'text-[#6D28D9]'
                            : 'text-zinc-500 hover:text-[#6D28D9]'
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#6D28D9]' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Clickable Product Image */}
                  <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    aria-label={`باز کردن نمای سریع ${product.title}`}
                    className="w-full h-full flex items-center justify-center focus-visible:outline-none"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-[82%] h-[82%] object-contain product-blend transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-1.5"
                    />
                  </button>
                </div>

                {/* Product Metadata & Add to Cart */}
                <div className="flex-1 flex flex-col justify-between p-5 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500">
                      <span>{product.categoryTitle}</span>
                      <span className="inline-flex items-center gap-1 tabular-nums text-zinc-600 font-medium">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {toPersianDigits(product.rating.toFixed(1))}
                      </span>
                    </div>

                    <h3 className="text-[15px] font-bold text-[#1E1B2E] leading-snug">
                      <button
                        type="button"
                        onClick={() => onQuickView(product)}
                        className="text-right hover:text-[#5B21B6] transition-colors"
                      >
                        {product.title}
                      </button>
                    </h3>

                    <p className="text-xs text-zinc-500 line-clamp-1">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-zinc-400">
                        {product.volume}
                      </span>
                      <span className="text-sm font-extrabold text-[#1E1B2E] tabular-nums">
                        {formatToman(product.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product)}
                      aria-label={`افزودن ${product.title} به سبد خرید`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2E1065] hover:bg-[#5B21B6] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>افزودن</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
