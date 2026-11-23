import { ArrowLeft } from 'lucide-react';
import { EDITORIAL_BANNERS } from '../data/catalog';

interface EditorialBannersProps {
  onSelectCategory: (categoryId: string) => void;
}

export function EditorialBanners({ onSelectCategory }: EditorialBannersProps) {
  return (
    <section
      aria-label="پیشنهادهای ویژه دسته‌بندی"
      className="max-w-[1320px] mx-auto px-4 md:px-6 pt-8 pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {EDITORIAL_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="group relative rounded-[28px] bg-[#F5F4F8] border border-zinc-200/60 overflow-hidden p-7 sm:p-9 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-lg hover:shadow-[#5B21B6]/5"
          >
            {/* Copy Column */}
            <div className="flex-1 text-right space-y-3 z-10">
              <p className="text-xs font-semibold text-[#6D28D9]">
                {banner.kicker}
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E1B2E] leading-snug text-balance">
                {banner.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-7 max-w-sm">
                {banner.description}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(banner.targetCategoryId);
                    document
                      .getElementById('products')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#2E1065] hover:text-[#6D28D9] transition-colors whitespace-nowrap"
                >
                  <span>{banner.ctaLabel}</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Studio Visual Column */}
            <div className="w-44 h-44 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center relative">
              <div
                aria-hidden="true"
                className="absolute inset-4 rounded-full bg-[#DDD6FE]/50 blur-2xl"
              />
              <img
                src={banner.image}
                alt={banner.title}
                referrerPolicy="no-referrer"
                className="relative z-10 w-full h-full object-contain product-blend transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
