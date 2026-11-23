import { Check, Heart, Plus, Star, X } from 'lucide-react';
import type { ProductItem } from '../data/catalog';
import { formatToman, toPersianDigits } from '../lib/scrollMath';

interface ProductQuickViewModalProps {
  product: ProductItem | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: ProductItem) => void;
}

export function ProductQuickViewModal({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}: ProductQuickViewModalProps) {
  if (!product) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`جزئیات محصول ${product.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[2px]"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-[28px] bg-white shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن جزئیات محصول"
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 text-zinc-600 hover:text-zinc-900 flex items-center justify-center shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Image Showcase */}
        <div className="bg-[#F5F4F8] p-8 flex items-center justify-center min-h-[280px]">
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            className="w-56 h-56 object-contain product-blend"
          />
        </div>

        {/* Right Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between space-y-5 text-right">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span>{product.categoryTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 tabular-nums text-zinc-700 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {toPersianDigits(product.rating.toFixed(1))}
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-[#1E1B2E]">
              {product.title}
            </h2>

            <p className="text-sm text-zinc-600 leading-7">{product.subtitle}</p>

            <ul className="space-y-2 pt-2">
              {product.highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-xs text-zinc-700"
                >
                  <Check className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">حجم: {product.volume}</span>
              <span className="text-lg font-black text-[#5B21B6] tabular-nums">
                {formatToman(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2E1065] hover:bg-[#5B21B6] text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن به سبد خرید</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={
                  isWishlisted
                    ? 'حذف از علاقه‌مندی‌ها'
                    : 'افزودن به علاقه‌مندی‌ها'
                }
                aria-pressed={isWishlisted}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-[#6D28D9] bg-[#EDE9FE] text-[#5B21B6]'
                    : 'border-zinc-200 text-zinc-600 hover:border-[#6D28D9]/40'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? 'fill-[#5B21B6]' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
