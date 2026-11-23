import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import {
  computeScrollProgress,
  computeStickySlideState,
  formatSlideCounter,
} from '../lib/scrollMath';

interface StickyCategoryShowcaseProps {
  onSelectCategory: (categoryId: string) => void;
}

export function StickyCategoryShowcase({
  onSelectCategory,
}: StickyCategoryShowcaseProps) {
  const outerRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;

    function updateFromScroll() {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollableDistance = Math.max(el.offsetHeight - window.innerHeight, 1);
      const scrolled = -rect.top;
      const progress = computeScrollProgress(scrolled, 0, scrollableDistance);
      const state = computeStickySlideState(progress, CATEGORIES.length);
      setActiveIndex(state.activeIndex);
      setOverallProgress(state.overallProgress);
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateFromScroll);
    }

    updateFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  function jumpToSlide(targetIdx: number) {
    const clamped = Math.max(0, Math.min(CATEGORIES.length - 1, targetIdx));
    const el = outerRef.current;
    if (!el) {
      setActiveIndex(clamped);
      setOverallProgress(clamped / Math.max(CATEGORIES.length - 1, 1));
      return;
    }

    const rect = el.getBoundingClientRect();
    const topDoc = rect.top + window.scrollY;
    const scrollableDistance = Math.max(el.offsetHeight - window.innerHeight, 1);
    const targetProgress = (clamped + 0.15) / CATEGORIES.length;
    window.scrollTo({
      top: topDoc + scrollableDistance * Math.min(targetProgress, 0.99),
      behavior: 'smooth',
    });
  }

  const activeCategory = CATEGORIES[activeIndex];

  return (
    <section
      id="showcase"
      ref={outerRef}
      data-testid="sticky-category-showcase"
      data-active-slide={activeIndex}
      className="relative bg-[#F4F3F8] h-[340vh] lg:h-[420vh]"
    >
      {/* Sticky full-viewport showcase active on BOTH Mobile AND Desktop */}
      <div className="sticky top-0 h-[100svh] flex flex-col justify-between overflow-hidden">
        {/* Top Row: Subtle Section Kicker with clean clearance below sticky header */}
        <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 pt-18 sm:pt-20 lg:pt-36 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              document
                .getElementById('products')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-xs font-medium text-zinc-500 hover:text-[#5B21B6] transition-colors flex items-center gap-1.5"
          >
            <span>همه دسته‌ها را ببینید</span>
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>

          <span className="text-xs font-semibold text-[#5B21B6] tabular-nums">
            {formatSlideCounter(activeIndex, CATEGORIES.length)}
          </span>
        </div>

        {/* Main Center Showcase Stage (Horizontal Slide Parallax matching Video 00:19 - 00:26) */}
        <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 flex-1 flex items-center">
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-4 sm:gap-6">
            {/* RIGHT SIDE (RTL): Massive Category Title + Description + CTA */}
            <div className="lg:col-span-5 text-right space-y-3 sm:space-y-5 order-2 lg:order-1">
              <div className="min-h-[54px] sm:min-h-[96px] flex flex-col justify-center">
                <h2
                  key={activeCategory.id}
                  className="text-2xl sm:text-4xl lg:text-[46px] font-black text-[#1E1B2E] leading-[1.2] tracking-tight text-balance transition-all duration-500"
                >
                  {activeCategory.title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm md:text-[15px] leading-6 sm:leading-8 text-zinc-600 max-w-md">
                {activeCategory.description}
              </p>

              <div className="pt-1 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory(activeCategory.id);
                    document
                      .getElementById('products')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <span>مشاهده محصولات {activeCategory.shortTitle}</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* LEFT SIDE (RTL): Studio Product Visual + 3 Floating Tilted Persian Callout Chips */}
            <div className="lg:col-span-7 relative flex items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[330px] sm:max-w-[460px] lg:max-w-[540px] h-[240px] sm:h-[340px] lg:h-[430px] flex items-center justify-center">
                {/* Soft violet studio halo */}
                <div
                  aria-hidden="true"
                  className="absolute inset-8 sm:inset-12 rounded-full bg-[#DDD6FE]/45 blur-3xl pointer-events-none"
                />

                {/* Horizontal-Sliding Crossfading Category Slides (matching Video 00:20 - 00:26) */}
                {CATEGORIES.map((cat, idx) => {
                  const isActive = idx === activeIndex;
                  const direction = idx < activeIndex ? 1 : -1;

                  return (
                    <div
                      key={cat.id}
                      aria-hidden={!isActive}
                      style={{
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? 'translate3d(0, 0, 0) scale(1)'
                          : `translate3d(${direction * 76}px, 0, 0) scale(0.9)`,
                      }}
                      className="absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out pointer-events-none"
                    >
                      <img
                        src={cat.image}
                        alt={cat.title}
                        referrerPolicy="no-referrer"
                        className="w-[210px] h-[210px] sm:w-[310px] sm:h-[310px] lg:w-[390px] lg:h-[390px] object-contain product-blend select-none"
                      />

                      {/* 3 Floating Tilted Persian Tag Chips matching Video 00:20 - 00:26 */}
                      {cat.showcaseTags.map((tag, tagIdx) => {
                        const toneClass =
                          tag.tone === 'deep'
                            ? 'bg-[#2E1065] text-white shadow-lg shadow-[#2E1065]/25'
                            : tag.tone === 'violet'
                              ? 'bg-[#6D28D9] text-white shadow-lg shadow-[#6D28D9]/25'
                              : 'bg-white text-zinc-700 border border-zinc-200/80 shadow-md';

                        return (
                          <span
                            key={tag.label}
                            style={{
                              transform: isActive
                                ? `rotate(${tag.rotateDeg}deg) scale(1)`
                                : `rotate(${tag.rotateDeg * 2}deg) scale(0.76)`,
                              transitionDelay: `${tagIdx * 65 + 70}ms`,
                            }}
                            className={`absolute ${tag.positionClass} ${toneClass} px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all duration-500 ease-out`}
                          >
                            {tag.label}
                          </span>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Rail & Slide Controls */}
        <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 pb-5 sm:pb-8 lg:pb-10 space-y-3 sm:space-y-4">
          {/* Thin Violet Progress Track */}
          <div className="w-full h-[3px] bg-zinc-200 rounded-full overflow-hidden">
            <div
              style={{
                width: `${Math.max(100 / CATEGORIES.length, overallProgress * 100)}%`,
              }}
              className="h-full bg-[#5B21B6] rounded-full transition-all duration-200"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Active Category Name + Quick Jump Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto pb-1">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => jumpToSlide(idx)}
                  aria-label={`رفتن به اسلاید ${cat.title}`}
                  aria-current={idx === activeIndex ? 'step' : undefined}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs transition-all whitespace-nowrap shrink-0 ${
                    idx === activeIndex
                      ? 'bg-[#2E1065] text-white font-semibold'
                      : 'text-zinc-500 hover:text-[#5B21B6] hover:bg-white/70'
                  }`}
                >
                  {cat.shortTitle}
                </button>
              ))}
            </div>

            {/* Prev / Next Buttons + Counter */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="دسته قبلی"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 hover:text-[#5B21B6] hover:border-[#6D28D9]/40 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span
                data-testid="showcase-counter"
                className="text-[11px] sm:text-xs font-bold text-zinc-600 px-1.5 sm:px-2 tabular-nums whitespace-nowrap"
              >
                {formatSlideCounter(activeIndex, CATEGORIES.length)}
              </span>
              <button
                type="button"
                onClick={() => jumpToSlide(activeIndex + 1)}
                disabled={activeIndex === CATEGORIES.length - 1}
                aria-label="دسته بعدی"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-700 hover:text-[#5B21B6] hover:border-[#6D28D9]/40 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
