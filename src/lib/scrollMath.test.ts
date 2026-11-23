import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  computeFlyTransform,
  computeOrbitPose,
  computeScrollProgress,
  computeSlotScrollRange,
  computeStaggeredProgress,
  computeStickySlideState,
  easeInOutCubic,
  formatSlideCounter,
  formatToman,
  smoothScrollEase,
  toPersianDigits,
  type FlyItemSpec,
} from './scrollMath';

const orbitSatelliteSpec: FlyItemSpec = {
  isCenter: false,
  orbitAngleOffset: 0,
  orbitRadiusX: 200,
  orbitRadiusY: 75,
  orbitSpeed: Math.PI / 2, // 90 deg/sec for crisp test values
  heroCenterOffsetY: 20,
  heroScale: 1.0,
  arcOffsetX: 30,
  midFlightRotate: 10,
  staggerStart: 0.1,
  staggerEnd: 0.9,
  floatAmpY: 4,
  floatSpeed: 1.2,
  floatPhase: 0,
};

const centerHeroSpec: FlyItemSpec = {
  isCenter: true,
  orbitAngleOffset: 0,
  orbitRadiusX: 0,
  orbitRadiusY: 0,
  orbitSpeed: 0,
  heroCenterOffsetY: -36,
  heroScale: 1.68,
  arcOffsetX: 40,
  midFlightRotate: 6,
  staggerStart: 0.02,
  staggerEnd: 0.86,
  floatAmpY: 5,
  floatSpeed: 1.0,
  floatPhase: 0,
};

test('clamp constrains values inside bounds', () => {
  assert.equal(clamp(-5, 0, 1), 0);
  assert.equal(clamp(0.5, 0, 1), 0.5);
  assert.equal(clamp(5, 0, 1), 1);
});

test('easeInOutCubic satisfies boundary and midpoint properties', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutCubic(1), 1);
  assert.ok(easeInOutCubic(0.25) < 0.25);
  assert.ok(easeInOutCubic(0.75) > 0.75);
});

test('computeScrollProgress maps scroll positions cleanly', () => {
  assert.equal(computeScrollProgress(0, 0, 800), 0);
  assert.equal(computeScrollProgress(400, 0, 800), 0.5);
  assert.equal(computeScrollProgress(1200, 0, 800), 1);
  assert.equal(computeScrollProgress(100, 300, 300), 0);
});

test('computeStaggeredProgress respects stagger window', () => {
  assert.equal(computeStaggeredProgress(0.05, 0.1, 0.9), 0);
  assert.equal(computeStaggeredProgress(0.5, 0.1, 0.9), 0.5);
  assert.equal(computeStaggeredProgress(0.95, 0.1, 0.9), 1);
});

test('computeOrbitPose rotates satellites in front and behind center bottle with perspective depth', () => {
  const center = computeOrbitPose({
    spec: centerHeroSpec,
    timeSec: 0,
    stageScale: 1,
    reducedMotion: false,
  });
  assert.equal(center.zIndex, 25);
  assert.equal(center.offsetX, 0);

  // At t=1s, angle = PI/2 -> sin=1 (closest in front), cos=0
  const inFront = computeOrbitPose({
    spec: orbitSatelliteSpec,
    timeSec: 1,
    stageScale: 1,
    reducedMotion: false,
  });
  // At t=3s, angle = 3*PI/2 -> sin=-1 (farthest behind), cos=0
  const inBack = computeOrbitPose({
    spec: orbitSatelliteSpec,
    timeSec: 3,
    stageScale: 1,
    reducedMotion: false,
  });

  assert.ok(inFront.zIndex > center.zIndex, 'Front satellite must pass in front of center bottle');
  assert.ok(inBack.zIndex < center.zIndex, 'Back satellite must glide behind center bottle');
  assert.ok(inFront.scale > inBack.scale, 'Front satellite must scale larger than back satellite');
  assert.ok(inFront.depthOpacity > inBack.depthOpacity);

  // Mobile stageScale scales orbital radius proportionally
  const mobilePose = computeOrbitPose({
    spec: orbitSatelliteSpec,
    timeSec: 0,
    stageScale: 0.6,
    reducedMotion: false,
  });
  assert.equal(Math.round(mobilePose.offsetX), 120);
});

test('computeFlyTransform starts at live Hero orbital pose and docks accurately into Category slot', () => {
  const heroCenter = { x: 320, y: 360 };
  const targetSlot = { x: 800, y: 1100, width: 180, height: 180 };

  const atHero = computeFlyTransform({
    globalProgress: 0,
    heroCenter,
    targetSlot,
    baseWidth: 180,
    stageScale: 1,
    spec: orbitSatelliteSpec,
    timeSec: 0,
    reducedMotion: true,
  });

  // At angle=0: offsetX = +200, offsetY = +20
  assert.equal(Math.round(atHero.x), 520);
  assert.equal(Math.round(atHero.y), 380);
  assert.equal(atHero.landedOpacity, 0);
  assert.ok(atHero.flyingOpacity > 0.8);

  const atLanded = computeFlyTransform({
    globalProgress: 1,
    heroCenter,
    targetSlot,
    baseWidth: 180,
    stageScale: 1,
    spec: orbitSatelliteSpec,
    timeSec: 2,
    reducedMotion: false,
  });

  assert.equal(Math.round(atLanded.x), 890);
  assert.equal(Math.round(atLanded.y), 1190);
  assert.equal(Number(atLanded.scale.toFixed(4)), 1);
  assert.equal(Number(atLanded.rotate.toFixed(4)), 0);
  assert.equal(atLanded.flyingOpacity, 0);
  assert.equal(atLanded.landedOpacity, 1);
});

test('computeStickySlideState transitions smoothly across all 7 slides', () => {
  const first = computeStickySlideState(0, 7);
  assert.equal(first.activeIndex, 0);
  assert.equal(first.slideProgress, 0);

  const middle = computeStickySlideState(0.5, 7);
  assert.equal(middle.activeIndex, 3);

  const last = computeStickySlideState(1, 7);
  assert.equal(last.activeIndex, 6);
  assert.equal(last.slideProgress, 1);
});

test('Persian digit and Toman currency formatters work properly', () => {
  assert.equal(toPersianDigits('2026'), '۲۰۲۶');
  assert.equal(formatToman(540000), '۵۴۰٬۰۰۰ تومان');
  assert.equal(formatSlideCounter(0, 7), '۰۱ / ۰۷');
  assert.equal(formatSlideCounter(6, 7), '۰۷ / ۰۷');
});

test('smoothScrollEase stays calm in mid-flight without aggressive surge', () => {
  assert.equal(smoothScrollEase(0), 0);
  assert.equal(smoothScrollEase(0.5), 0.5);
  assert.equal(smoothScrollEase(1), 1);
  // Derivative around midpoint (0.45 -> 0.55) must stay <= 1.3 (much calmer than cubic 1.5)
  const midSlope = (smoothScrollEase(0.55) - smoothScrollEase(0.45)) / 0.1;
  assert.ok(midSlope <= 1.3, `Expected calm midSlope <= 1.3, got ${midSlope}`);
});

test('computeSlotScrollRange keeps flying bottles centered inside viewport instead of racing ahead', () => {
  const heroCenterDocY = 445;
  const row1SlotDocY = 1220;
  const row2SlotDocY = 1500;
  const viewportHeight = 900;

  const row1Range = computeSlotScrollRange({
    heroCenterDocY,
    slotCenterDocY: row1SlotDocY,
    viewportHeight,
    dockViewportRatio: 0.5,
  });
  const row2Range = computeSlotScrollRange({
    heroCenterDocY,
    slotCenterDocY: row2SlotDocY,
    viewportHeight,
    dockViewportRatio: 0.62,
  });

  // Row 2 finishes docking after Row 1 (as Row 2 enters view)
  assert.ok(row2Range.scrollEnd > row1Range.scrollEnd);

  // Verify throughout the entire scroll from 0 to row1Range.scrollEnd, bottle screenY stays comfortably inside viewport
  for (let s = 0; s <= row1Range.scrollEnd; s += 80) {
    const p = computeScrollProgress(s, row1Range.scrollStart, row1Range.scrollEnd);
    const bottleDocY = heroCenterDocY + (row1SlotDocY - heroCenterDocY) * smoothScrollEase(p);
    const screenY = bottleDocY - s;
    assert.ok(
      screenY >= 240 && screenY <= 620,
      `At scrollY=${s}, Row 1 bottle screenY=${screenY} drifted out of comfortable viewport zone`
    );
  }
});
