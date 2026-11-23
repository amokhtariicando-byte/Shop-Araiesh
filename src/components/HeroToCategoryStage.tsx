import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES, type CategoryItem } from '../data/catalog';
import {
  clamp,
  computeFlyTransform,
  computeScrollProgress,
  type Point2D,
  type RectBox,
} from '../lib/scrollMath';

interface HeroToCategoryStageProps {
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onExploreShop: () => void;
}

const FLY_BASE_SIZE = 188;

interface MeasuredLayout {
  heroCenter: Point2D;
  stageScale: number;
  slots: Record<string, RectBox>;
  scrollStart: number;
  scrollEnd: number;
  animationEnabled: boolean;
}

export function HeroToCategoryStage({
  activeCategory,
  onSelectCategory,
  onExploreShop,
}: HeroToCategoryStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);
  const categorySectionRef = useRef<HTMLElement>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const flyingNodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const staticImgRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const layoutRef = useRef<MeasuredLayout | null>(null);
  const pointerRef = useRef<Point2D>({ x: 0, y: 0 });
  const smoothProgressRef = useRef(0);

  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const [flyProgressAttr, setFlyProgressAttr] = useState('0.00');
  const [orbitActive, setOrbitActive] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = mediaQuery.matches;

    function measureLayout() {
      const stageEl = stageRef.current;
      const heroVisEl = heroVisualRef.current;
      const catSecEl = categorySectionRef.current;
      if (!stageEl || !heroVisEl || !catSecEl) return;

      const enabled = !reducedMotion;
      setOrbitActive(enabled);

      const stageRect = stageEl.getBoundingClientRect();
      const heroRect = heroVisEl.getBoundingClientRect();
      const catRect = catSecEl.getBoundingClientRect();
      const scrollY = window.scrollY;

      const heroCenter: Point2D = {
        x: heroRect.left - stageRect.left + heroRect.width / 2,
        y: heroRect.top - stageRect.top + heroRect.height / 2,
      };

      // Scale orbital radii proportionally so both 1440px desktop and 390px mobile fit cleanly without overflow
      const stageScale = clamp(heroRect.width / 540, 0.54, 1.05);

      const slots: Record<string, RectBox> = {};
      for (const cat of CATEGORIES) {
        const slotEl = slotRefs.current[cat.id];
        if (slotEl) {
          const r = slotEl.getBoundingClientRect();
          slots[cat.id] = {
            x: r.left - stageRect.left,
            y: r.top - stageRect.top,
            width: r.width,
            height: r.height,
          };
        }
      }

      const catTopDoc = catRect.top + scrollY;
      const isCompact = window.innerWidth < 900;
      const scrollStart = isCompact ? 80 : 12;
      const scrollEnd = Math.max(
        scrollStart + 320,
        catTopDoc - (isCompact ? 90 : 125)
      );

      layoutRef.current = {
        heroCenter,
        stageScale,
        slots,
        scrollStart,
        scrollEnd,
        animationEnabled: enabled,
      };
    }

    const onMotionPref = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      measureLayout();
    };
    mediaQuery.addEventListener('change', onMotionPref);

    measureLayout();
    const resizeObserver = new ResizeObserver(() => measureLayout());
    if (stageRef.current) resizeObserver.observe(stageRef.current);
    window.addEventListener('resize', measureLayout);

    function handleMouseMove(e: MouseEvent) {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      pointerRef.current = { x: nx, y: ny };
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let rafId = 0;
    let lastReportedProgress = -1;
    const startTime = performance.now();

    function tick(now: number) {
      const layout = layoutRef.current;
      if (layout && layout.animationEnabled) {
        const targetProgress = computeScrollProgress(
          window.scrollY,
          layout.scrollStart,
          layout.scrollEnd
        );

        const delta = targetProgress - smoothProgressRef.current;
        smoothProgressRef.current =
          Math.abs(delta) < 0.001
            ? targetProgress
            : smoothProgressRef.current + delta * 0.22;

        const p = smoothProgressRef.current;
        const timeSec = (now - startTime) / 1000;

        for (const cat of CATEGORIES) {
          const flyEl = flyingNodeRefs.current[cat.id];
          const staticEl = staticImgRefs.current[cat.id];
          const slot = layout.slots[cat.id];
          if (!flyEl || !slot) continue;

          const tf = computeFlyTransform({
            globalProgress: p,
            heroCenter: layout.heroCenter,
            targetSlot: slot,
            baseWidth: FLY_BASE_SIZE,
            stageScale: layout.stageScale,
            spec: cat.flySpec,
            timeSec,
            pointerOffset: pointerRef.current,
            reducedMotion,
          });

          flyEl.style.transform = `translate3d(${(tf.x - FLY_BASE_SIZE / 2).toFixed(2)}px, ${(tf.y - FLY_BASE_SIZE / 2).toFixed(2)}px, 0) scale(${tf.scale.toFixed(4)}) rotate(${tf.rotate.toFixed(2)}deg)`;
          flyEl.style.zIndex = String(tf.zIndex);
          flyEl.style.opacity = tf.flyingOpacity.toFixed(3);

          if (staticEl) {
            staticEl.style.opacity = String(tf.landedOpacity);
          }
        }

        const quantized = Math.round(p * 20) / 20;
        if (quantized !== lastReportedProgress) {
          lastReportedProgress = quantized;
          setFlyProgressAttr(p.toFixed(2));
        }
      } else {
        for (const cat of CATEGORIES) {
          const staticEl = staticImgRefs.current[cat.id];
          if (staticEl) staticEl.style.opacity = '1';
        }
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', measureLayout);
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', onMotionPref);
    };
  }, []);

  const row1Categories = CATEGORIES.filter((c) => c.row === 1);
  const row2Categories = CATEGORIES.filter((c) => c.row === 2);

  function scrollToCategories() {
    categorySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div
      ref={stageRef}
      data-testid="hero-to-category-stage"
      data-fly-progress={flyProgressAttr}
      data-orbit-active={orbitActive ? 'true' : 'false'}
      className="relative"
    >
      {/* ================================================================
          SECTION 1: FULL-BLEED STUDIO HERO ("پاکیزگی برای هر روز.")
      ================================================================ */}
      <section
        id="hero"
        className="relative bg-gradient-to-b from-[#F3F2F6] via-[#F1F0F5] to-[#ECEBF2] overflow-visible"
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-10 min-h-[calc(100svh-56px)] lg:min-h-[650px] flex items-center py-8 sm:py-12 lg:py-14 relative">
          {/* Subtle ambient studio backlight behind rotating product carousel */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-[62%] lg:top-1/2 left-1/2 lg:left-[28%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[420px] lg:w-[500px] h-[300px] sm:h-[420px] lg:h-[500px] rounded-full bg-[#DDD6FE]/45 blur-3xl"
          />

          <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-6 lg:gap-8 relative z-10">
            {/* RIGHT COLUMN (RTL Start): Editorial Typography & CTAs */}
            <div className="lg:col-span-5 text-right space-y-4 sm:space-y-5 lg:space-y-6">
              <div className="inline-flex items-center gap-2.5 text-xs font-medium text-zinc-500">
                <span className="w-6 h-[1.5px] bg-[#6D28D9]" aria-hidden="true" />
                <span>فروشگاه اینترنتی داریمش</span>
              </div>

              <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-black leading-[1.14] tracking-tight text-balance">
                <span className="block text-[#1E1B2E]">پاکیزگی</span>
                <span className="block text-[#6D28D9] mt-1">برای هر روز.</span>
              </h1>

              {/* 2-point feature strip matching video 00:00 - 00:05 */}
              <div className="flex flex-wrap items-center gap-5 text-[12.5px] sm:text-[13px] font-medium text-zinc-600">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" aria-hidden="true" />
                  هدفمند و انتخابی
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6D28D9]" aria-hidden="true" />
                  تنوع گسترده کالا
                </span>
              </div>

              <p className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] leading-[1.85] text-zinc-600 max-w-md">
                از شوینده و بهداشتی تا محصولات مراقبتی و خانگی؛ هر آنچه برای خانه
                و خانواده نیاز دارید، سریع، ساده و مطمئن بخرید.
              </p>

              {/* Hero CTAs matching video ("فروشگاه ←" + "دسته‌بندی‌ها") */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={onExploreShop}
                  className="inline-flex items-center gap-3 px-7 py-3 sm:py-3.5 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-white text-sm font-semibold shadow-lg shadow-[#2E1065]/20 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  <span>فروشگاه</span>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={scrollToCategories}
                  className="inline-flex items-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl text-sm font-semibold text-zinc-700 hover:text-[#5B21B6] hover:bg-white/70 transition-colors whitespace-nowrap"
                >
                  <span>دسته‌بندی‌ها</span>
                </button>
              </div>
            </div>

            {/* LEFT COLUMN (RTL End): Live 3D Orbital Turntable Product Stage (Desktop & Mobile!) */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div
                ref={heroVisualRef}
                data-testid="hero-product-stage"
                className="relative w-full max-w-[330px] sm:max-w-[460px] lg:max-w-[560px] h-[270px] sm:h-[380px] lg:h-[460px] flex items-center justify-center"
              >
                {/* Soft Studio Floor Shadow Ring under the rotating turntable */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 sm:h-10 rounded-full bg-[#2E1065]/12 blur-2xl"
                />

                {/* Static fallback ONLY when user explicitly prefers-reduced-motion */}
                {!orbitActive && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={CATEGORIES[0].image}
                      alt="محصولات مراقبت از مو داریمش"
                      referrerPolicy="no-referrer"
                      className="w-52 sm:w-64 h-52 sm:h-64 object-contain product-blend z-20"
                    />
                    <img
                      src={CATEGORIES[1].image}
                      alt="سرم و کرم مراقبت از پوست داریمش"
                      referrerPolicy="no-referrer"
                      className="w-36 sm:w-48 h-36 sm:h-48 object-contain product-blend absolute bottom-2 left-2 sm:left-8 z-30"
                    />
                    <img
                      src={CATEGORIES[3].image}
                      alt="شوینده لباس داریمش"
                      referrerPolicy="no-referrer"
                      className="w-36 sm:w-48 h-36 sm:h-48 object-contain product-blend absolute bottom-2 right-2 sm:right-8 z-30"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subtle scroll hint at bottom center */}
          <button
            type="button"
            onClick={scrollToCategories}
            aria-label="اسکرول به پایین برای مشاهده دسته‌بندی‌ها"
            className="flex items-center gap-2 absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-medium text-zinc-400 hover:text-[#6D28D9] transition-colors whitespace-nowrap"
          >
            <span>برای مشاهده چیدمان محصولات به پایین اسکرول کنید</span>
          </button>
        </div>
      </section>

      {/* ================================================================
          SECTION 2: CATEGORIES GRID ("هر آنچه خانه هر روز لازم دارد")
      ================================================================ */}
      <section
        id="categories"
        ref={categorySectionRef}
        className="scroll-mt-28 relative max-w-[1320px] mx-auto px-3 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-16 md:pb-20"
      >
        <div className="rounded-[28px] sm:rounded-[36px] bg-white border border-zinc-100 shadow-xs px-4 sm:px-8 md:px-12 py-10 sm:py-12 md:py-16">
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-medium text-zinc-500 mb-2">دسته‌بندی‌ها</p>
            <h2 className="text-xl sm:text-3xl md:text-[34px] font-extrabold text-[#1E1B2E] tracking-tight text-balance">
              هر آنچه خانه هر روز لازم دارد
            </h2>
          </div>

          {/* Interactive Category Filter Bar matching video (همه دسته‌ها + 7 categories) */}
          <div
            role="tablist"
            aria-label="فیلتر دسته‌بندی محصولات"
            className="mt-6 sm:mt-8 flex items-center sm:justify-center gap-2 overflow-x-auto sm:flex-wrap pb-2 sm:pb-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeCategory === 'all'
                  ? 'bg-[#2E1065] text-white shadow-sm'
                  : 'bg-[#F5F4F8] text-zinc-600 hover:text-[#5B21B6]'
              }`}
            >
              همه دسته‌ها
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#2E1065] text-white shadow-sm font-semibold'
                      : 'bg-[#F5F4F8] text-zinc-600 hover:text-[#5B21B6]'
                  }`}
                >
                  {cat.shortTitle}
                </button>
              );
            })}
          </div>

          {/* 4 + 3 Sculptural Category Grid on Desktop, Compact 2-Column + Centered 7th on Mobile */}
          <div className="mt-10 sm:mt-14 space-y-6 sm:space-y-10 md:space-y-12">
            {/* Row 1: 4 Categories (2x2 on mobile, 4x1 on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {row1Categories.map((cat) => (
                <CategorySlotCard
                  key={cat.id}
                  category={cat}
                  isSelected={activeCategory === cat.id}
                  isHovered={hoveredCatId === cat.id}
                  onHoverChange={(h) => setHoveredCatId(h ? cat.id : null)}
                  onSelect={() => {
                    onSelectCategory(cat.id);
                    const el = document.getElementById('products');
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  setSlotRef={(el) => {
                    slotRefs.current[cat.id] = el;
                  }}
                  setStaticImgRef={(el) => {
                    staticImgRefs.current[cat.id] = el;
                  }}
                  initialStaticOpacity={orbitActive ? 0 : 1}
                />
              ))}
            </div>

            {/* Row 2: 3 Centered Categories (2 + 1 centered on mobile, 3 centered on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8 lg:max-w-[78%] lg:mx-auto">
              {row2Categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className={
                    idx === 2
                      ? 'col-span-2 max-w-[200px] sm:max-w-[260px] lg:max-w-none lg:col-span-1 mx-auto w-full'
                      : ''
                  }
                >
                  <CategorySlotCard
                    category={cat}
                    isSelected={activeCategory === cat.id}
                    isHovered={hoveredCatId === cat.id}
                    onHoverChange={(h) => setHoveredCatId(h ? cat.id : null)}
                    onSelect={() => {
                      onSelectCategory(cat.id);
                      const el = document.getElementById('products');
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    setSlotRef={(el) => {
                      slotRefs.current[cat.id] = el;
                    }}
                    setStaticImgRef={(el) => {
                      staticImgRefs.current[cat.id] = el;
                    }}
                    initialStaticOpacity={orbitActive ? 0 : 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          UNIVERSAL SYNCHRONIZED 3D ORBIT + SCROLL-FLYING LAYER
          Runs smoothly on BOTH Desktop AND Mobile!
      ================================================================ */}
      {orbitActive && (
        <div
          aria-hidden="true"
          data-testid="flying-products-layer"
          className="pointer-events-none absolute inset-0 overflow-x-clip z-30"
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              ref={(el) => {
                flyingNodeRefs.current[cat.id] = el;
              }}
              style={{
                width: `${FLY_BASE_SIZE}px`,
                height: `${FLY_BASE_SIZE}px`,
                zIndex: cat.zIndex,
                willChange: 'transform, opacity',
              }}
              className="absolute top-0 left-0 flex items-center justify-center"
            >
              <img
                src={cat.image}
                alt=""
                referrerPolicy="no-referrer"
                draggable={false}
                className="w-full h-full object-contain product-blend select-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CategorySlotCardProps {
  category: CategoryItem;
  isSelected: boolean;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
  onSelect: () => void;
  setSlotRef: (el: HTMLDivElement | null) => void;
  setStaticImgRef: (el: HTMLDivElement | null) => void;
  initialStaticOpacity: number;
}

function CategorySlotCard({
  category,
  isSelected,
  isHovered,
  onHoverChange,
  onSelect,
  setSlotRef,
  setStaticImgRef,
  initialStaticOpacity,
}: CategorySlotCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      onFocus={() => onHoverChange(true)}
      onBlur={() => onHoverChange(false)}
      data-testid={`category-card-${category.id}`}
      className={`group relative w-full flex flex-col items-center text-center rounded-3xl px-2 sm:px-4 pt-4 sm:pt-6 pb-4 sm:pb-5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] ${
        isSelected
          ? 'bg-[#F8F7FC] shadow-md ring-1 ring-[#6D28D9]/30'
          : 'hover:bg-[#F9F8FC] hover:shadow-lg hover:shadow-[#5B21B6]/5'
      }`}
    >
      {/* Soft lavender hover glow behind docked bottle */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-28 sm:h-36 rounded-full bg-[#DDD6FE]/60 blur-2xl transition-opacity duration-300 ${
          isHovered || isSelected ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Exact Landing Slot Container measured by the Flying Layer */}
      <div className="relative w-full flex items-center justify-center">
        <div
          ref={setSlotRef}
          className="relative w-[124px] h-[124px] sm:w-[164px] sm:h-[164px] md:w-[176px] md:h-[176px] flex items-center justify-center"
        >
          {/* Landed interactive bottle (fades in seamlessly when flying bottle docks) */}
          <div
            ref={setStaticImgRef}
            style={{ opacity: initialStaticOpacity }}
            className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:scale-105"
          >
            <img
              src={category.image}
              alt={category.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain product-blend select-none"
            />
          </div>
        </div>

        {/* Video-faithful Hover Floating Sub-Category Chips (00:14 - 00:18) */}
        {category.hoverTags.map((tag, idx) => {
          const toneStyle =
            tag.tone === 'deep'
              ? 'bg-[#2E1065] text-white shadow-md shadow-[#2E1065]/20'
              : tag.tone === 'violet'
                ? 'bg-[#6D28D9] text-white shadow-md shadow-[#6D28D9]/20'
                : 'bg-white text-zinc-700 border border-zinc-200/80 shadow-sm';

          return (
            <span
              key={tag.label}
              aria-hidden={!isHovered}
              style={{ transitionDelay: `${idx * 45}ms` }}
              className={`pointer-events-none absolute ${tag.offsetClass} ${toneStyle} px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-semibold whitespace-nowrap transition-all duration-300 ease-out ${
                isHovered
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-75 translate-y-2'
              }`}
            >
              {tag.label}
            </span>
          );
        })}
      </div>

      {/* Category Label */}
      <span className="mt-3 sm:mt-4 text-xs sm:text-sm font-bold text-[#1E1B2E] group-hover:text-[#5B21B6] transition-colors leading-snug">
        {category.title}
      </span>
    </button>
  );
}
