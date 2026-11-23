export interface Point2D {
  x: number;
  y: number;
}

export interface RectBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlyItemSpec {
  /** Whether this item acts as the central hero anchor (tall purple bottle) */
  isCenter?: boolean;
  /** Starting orbital angle in radians on the 3D hero turntable */
  orbitAngleOffset: number;
  /** Horizontal orbit radius at reference desktop stage (540px wide) */
  orbitRadiusX: number;
  /** Vertical orbit radius (ellipse tilt) at reference desktop stage */
  orbitRadiusY: number;
  /** Angular speed in radians/second (positive = smooth clockwise orbit) */
  orbitSpeed: number;
  /** Vertical center shift inside the hero stage */
  heroCenterOffsetY: number;
  /** Base scale relative to FLY_BASE_SIZE at neutral orbit depth */
  heroScale: number;
  /** Subtle horizontal arc during hero-to-grid flight */
  arcOffsetX: number;
  /** Subtle rotation peak during mid-flight */
  midFlightRotate: number;
  staggerStart: number;
  staggerEnd: number;
  floatAmpY: number;
  floatSpeed: number;
  floatPhase: number;
}

export interface FlyTransformResult {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  zIndex: number;
  depthOpacity: number;
  localProgress: number;
  landedOpacity: number;
  flyingOpacity: number;
}

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function easeInOutCubic(t: number): number {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
}

/**
 * Balanced scroll-tracking ease: blends linear 1:1 scroll lock with smoothstep
 * so bottles start and land softly without surging ahead of scroll in mid-flight.
 */
export function smoothScrollEase(t: number): number {
  const c = clamp(t, 0, 1);
  const smoothstep = c * c * (3 - 2 * c);
  return lerp(c, smoothstep, 0.55);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Computes normalized 0..1 scroll progress between startY and endY.
 */
export function computeScrollProgress(
  scrollY: number,
  startY: number,
  endY: number
): number {
  if (endY <= startY) return scrollY >= endY ? 1 : 0;
  return clamp((scrollY - startY) / (endY - startY), 0, 1);
}

/**
 * Computes staggered local progress for an individual flying product bottle.
 */
export function computeStaggeredProgress(
  globalProgress: number,
  staggerStart: number,
  staggerEnd: number
): number {
  const span = Math.max(staggerEnd - staggerStart, 0.001);
  return clamp((globalProgress - staggerStart) / span, 0, 1);
}

/**
 * Computes a per-slot scroll range [scrollStart, scrollEnd] so each bottle rides
 * roughly 1:1 with the viewport center and docks right as its target card enters
 * comfortable view — never racing ahead off the bottom of the screen.
 */
export function computeSlotScrollRange(params: {
  heroCenterDocY: number;
  slotCenterDocY: number;
  viewportHeight: number;
  dockViewportRatio?: number;
  staggerPx?: number;
}): { scrollStart: number; scrollEnd: number } {
  const {
    heroCenterDocY,
    slotCenterDocY,
    viewportHeight,
    dockViewportRatio = 0.56,
    staggerPx = 0,
  } = params;

  const scrollStart = Math.max(0, staggerPx);
  const desiredDockScreenY = clamp(
    viewportHeight * dockViewportRatio,
    240,
    Math.max(240, viewportHeight - 160)
  );
  const travelDistance = Math.max(0, slotCenterDocY - heroCenterDocY);

  // Ideal scroll position where the target slot reaches desiredDockScreenY in viewport
  const naturalEnd = slotCenterDocY - desiredDockScreenY;
  // Guarantee average vertical bottle velocity never races ahead of scroll (> ~1.12x)
  const minSafeEnd = scrollStart + Math.max(240, travelDistance * 0.9);
  const scrollEnd = Math.max(naturalEnd, minSafeEnd);

  return { scrollStart, scrollEnd };
}

/**
 * Computes the live 3D elliptical turntable orbital state for an item resting in the Hero.
 */
export function computeOrbitPose(params: {
  spec: FlyItemSpec;
  timeSec: number;
  stageScale: number;
  reducedMotion?: boolean;
}): {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotate: number;
  zIndex: number;
  depthOpacity: number;
} {
  const { spec, timeSec, stageScale, reducedMotion = false } = params;
  const effectiveTime = reducedMotion ? 0 : timeSec;

  if (spec.isCenter) {
    const breatheY = reducedMotion
      ? 0
      : Math.sin(effectiveTime * spec.floatSpeed + spec.floatPhase) *
        spec.floatAmpY *
        stageScale;
    const swayRot = reducedMotion
      ? 0
      : Math.sin(effectiveTime * 0.65 + spec.floatPhase) * 1.8;

    return {
      offsetX: 0,
      offsetY: spec.heroCenterOffsetY * stageScale + breatheY,
      scale: spec.heroScale * stageScale,
      rotate: swayRot,
      zIndex: 25,
      depthOpacity: 1,
    };
  }

  const angle = spec.orbitAngleOffset + effectiveTime * spec.orbitSpeed;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  // depth: 0 = farthest back behind center bottle, 1 = closest in front
  const depth = (sinA + 1) / 2;

  const offsetX = cosA * spec.orbitRadiusX * stageScale;
  const offsetY =
    (sinA * spec.orbitRadiusY + spec.heroCenterOffsetY) * stageScale +
    (reducedMotion
      ? 0
      : Math.sin(effectiveTime * spec.floatSpeed + spec.floatPhase) *
        spec.floatAmpY *
        stageScale);

  // Perspective scale: front items loom slightly larger, back items recede gracefully
  const perspectiveFactor = 0.72 + 0.42 * depth;
  const scale = spec.heroScale * perspectiveFactor * stageScale;
  const rotate = cosA * 5.5;

  // Dynamic z-index so orbiting bottles glide cleanly BEHIND (10..23) and IN FRONT (27..40) of center bottle (25)
  const zIndex = depth < 0.5 ? 10 + Math.round(depth * 26) : 27 + Math.round((depth - 0.5) * 26);
  const depthOpacity = 0.84 + 0.16 * depth;

  return {
    offsetX,
    offsetY,
    scale,
    rotate,
    zIndex,
    depthOpacity,
  };
}

/**
 * Computes exact compositor transform (x, y, scale, rotate, zIndex, opacity)
 * interpolating a product smoothly from its live 3D orbital Hero pose
 * directly into its target Category Card slot (works on desktop AND mobile).
 */
export function computeFlyTransform(params: {
  globalProgress: number;
  directProgress?: number;
  heroCenter: Point2D;
  targetSlot: RectBox;
  baseWidth: number;
  stageScale: number;
  spec: FlyItemSpec;
  timeSec: number;
  pointerOffset?: Point2D;
  reducedMotion?: boolean;
}): FlyTransformResult {
  const {
    globalProgress,
    directProgress,
    heroCenter,
    targetSlot,
    baseWidth,
    stageScale,
    spec,
    timeSec,
    pointerOffset = { x: 0, y: 0 },
    reducedMotion = false,
  } = params;

  const rawLocal =
    directProgress !== undefined
      ? clamp(directProgress, 0, 1)
      : computeStaggeredProgress(
          globalProgress,
          spec.staggerStart,
          spec.staggerEnd
        );
  const eased = smoothScrollEase(rawLocal);

  const orbit = computeOrbitPose({
    spec,
    timeSec,
    stageScale,
    reducedMotion,
  });

  // Subtle pointer parallax while resting on Hero (damps smoothly to 0 as scroll starts)
  const restWeight = clamp(1 - rawLocal * 2.4, 0, 1);
  const parallaxFactor = spec.isCenter ? 8 : 6 + (orbit.zIndex - 10) * 0.35;
  const parallaxX = pointerOffset.x * parallaxFactor * stageScale * restWeight;
  const parallaxY = pointerOffset.y * (parallaxFactor * 0.7) * stageScale * restWeight;

  // Start position from live orbital turntable
  const startCenterX = heroCenter.x + orbit.offsetX + parallaxX;
  const startCenterY = heroCenter.y + orbit.offsetY + parallaxY;

  // End position is exact center of the target Category Card image slot
  const endCenterX = targetSlot.x + targetSlot.width / 2;
  const endCenterY = targetSlot.y + targetSlot.height / 2;

  const safeBaseWidth = Math.max(baseWidth, 1);
  const targetScale = targetSlot.width / safeBaseWidth;

  // Parabolic arc during flight
  const flightBell = Math.sin(Math.PI * eased);
  const arcX = spec.arcOffsetX * stageScale * flightBell;
  const arcY = -24 * stageScale * flightBell;

  const x = lerp(startCenterX, endCenterX, eased) + arcX;
  const y = lerp(startCenterY, endCenterY, eased) + arcY;
  const scale = lerp(orbit.scale, targetScale, eased);
  const rotate = lerp(orbit.rotate, 0, eased) + spec.midFlightRotate * flightBell;
  const depthOpacity = lerp(orbit.depthOpacity, 1, eased);
  const zIndex = eased > 0.35 ? 30 + Math.round((1 - rawLocal) * 5) : orbit.zIndex;

  // Invisible seamless handoff at docking
  const isLanded = rawLocal >= 0.99;
  const flyingOpacity = isLanded ? 0 : depthOpacity;
  const landedOpacity = isLanded ? 1 : 0;

  return {
    x,
    y,
    scale,
    rotate,
    zIndex,
    depthOpacity,
    localProgress: rawLocal,
    landedOpacity,
    flyingOpacity,
  };
}

/**
 * Computes active slide index and intra-slide progress for the Sticky Showcase section.
 */
export function computeStickySlideState(
  progress: number,
  totalSlides: number
): { activeIndex: number; slideProgress: number; overallProgress: number } {
  const safeTotal = Math.max(totalSlides, 1);
  const clamped = clamp(progress, 0, 1);
  const scaled = clamped * safeTotal;
  const activeIndex = Math.min(Math.floor(scaled), safeTotal - 1);
  const slideProgress =
    activeIndex === safeTotal - 1 && clamped >= 1
      ? 1
      : clamp(scaled - activeIndex, 0, 1);

  return {
    activeIndex,
    slideProgress,
    overallProgress: clamped,
  };
}

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

export function formatToman(amount: number): string {
  const rounded = Math.max(0, Math.round(amount));
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '٬');
  return `${toPersianDigits(formatted)} تومان`;
}

export function formatSlideCounter(index: number, total: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${toPersianDigits(pad(index + 1))} / ${toPersianDigits(pad(total))}`;
}
