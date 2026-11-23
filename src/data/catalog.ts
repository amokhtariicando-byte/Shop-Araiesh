import type { FlyItemSpec } from '../lib/scrollMath';

export interface ShowcaseTag {
  label: string;
  tone: 'light' | 'violet' | 'deep';
  /** Positioning inside the sticky showcase visual canvas */
  positionClass: string;
  rotateDeg: number;
}

export interface CategoryItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  image: string;
  productCount: number;
  row: 1 | 2;
  zIndex: number;
  flySpec: FlyItemSpec;
  hoverTags: {
    label: string;
    tone: 'light' | 'violet' | 'deep';
    offsetClass: string;
  }[];
  showcaseTags: ShowcaseTag[];
}

export interface ProductItem {
  id: string;
  title: string;
  subtitle: string;
  categoryId: string;
  categoryTitle: string;
  price: number;
  volume: string;
  rating: number;
  image: string;
  highlights: string[];
  badge?: string;
}

export interface EditorialBanner {
  id: string;
  kicker: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetCategoryId: string;
  image: string;
}

export const IMAGES = {
  hairCare: '/src/assets/images/cutouts/product_hair_care_1795428758808.png',
  skincareSerum: '/src/assets/images/cutouts/product_skincare_serum_1795428758572.png',
  oralCare: '/src/assets/images/cutouts/product_oral_care_1795428758310.png',
  laundryDetergent: '/src/assets/images/cutouts/product_laundry_detergent_1795428758570.png',
  homeCleaning: '/src/assets/images/cutouts/product_home_cleaning_1795428758100.png',
  airFreshener: '/src/assets/images/cutouts/product_air_freshener_1795428757223.png',
  babyCare: '/src/assets/images/cutouts/product_baby_care_1795428759684.png',
  faceWashTube: '/src/assets/images/cutouts/product_face_wash_tube_1795428759576.png',
} as const;

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'hair',
    title: 'مراقبت از مو',
    shortTitle: 'مراقبت از مو',
    description:
      'شامپوهای تقویتی، نرم‌کننده‌ها و سرم‌های تخصصی برای درخشش و سلامت روزانه مو.',
    image: IMAGES.hairCare,
    productCount: 24,
    row: 1,
    zIndex: 25,
    flySpec: {
      isCenter: true,
      orbitAngleOffset: 0,
      orbitRadiusX: 0,
      orbitRadiusY: 0,
      orbitSpeed: 0,
      heroCenterOffsetY: -34,
      heroScale: 1.66,
      arcOffsetX: 44,
      midFlightRotate: 7,
      staggerStart: 0.02,
      staggerEnd: 0.84,
      floatAmpY: 5,
      floatSpeed: 1.05,
      floatPhase: 0.2,
    },
    hoverTags: [
      { label: 'تغذیه و رشد مو', tone: 'light', offsetClass: '-top-2 right-2' },
      { label: 'شامپو', tone: 'violet', offsetClass: 'top-14 -left-1' },
      { label: 'ماسک و نرم‌کننده', tone: 'deep', offsetClass: 'bottom-6 -right-1' },
    ],
    showcaseTags: [
      {
        label: 'تغذیه و رشد مو',
        tone: 'light',
        positionClass: 'top-[10%] left-[22%]',
        rotateDeg: -2,
      },
      {
        label: 'شامپو',
        tone: 'violet',
        positionClass: 'top-[42%] left-[8%]',
        rotateDeg: -5,
      },
      {
        label: 'ماسک و نرم‌کننده',
        tone: 'deep',
        positionClass: 'bottom-[16%] left-[12%]',
        rotateDeg: 4,
      },
    ],
  },
  {
    id: 'skincare',
    title: 'مراقبت از پوست صورت و بدن',
    shortTitle: 'مراقبت از پوست صورت و بدن',
    description:
      'سرم‌های آبرسان، کرم‌های تغذیه‌کننده و ژل‌های شستشو برای پوستی شفاف و لطیف.',
    image: IMAGES.skincareSerum,
    productCount: 31,
    row: 1,
    zIndex: 38,
    flySpec: {
      orbitAngleOffset: 2.02, // front-left (amber serum + open purple jar)
      orbitRadiusX: 196,
      orbitRadiusY: 74,
      orbitSpeed: 0.34,
      heroCenterOffsetY: 22,
      heroScale: 1.06,
      arcOffsetX: 28,
      midFlightRotate: -9,
      staggerStart: 0.06,
      staggerEnd: 0.88,
      floatAmpY: 4,
      floatSpeed: 1.25,
      floatPhase: 1.2,
    },
    hoverTags: [
      { label: 'سرم صورت', tone: 'light', offsetClass: '-top-2 left-2' },
      { label: 'کرم آبرسان', tone: 'violet', offsetClass: 'top-16 -right-1' },
      { label: 'شوینده صورت', tone: 'deep', offsetClass: 'bottom-5 left-0' },
    ],
    showcaseTags: [
      {
        label: 'لوسیون بدن',
        tone: 'light',
        positionClass: 'top-[10%] left-[24%]',
        rotateDeg: 2,
      },
      {
        label: 'کرم مرطوب‌کننده',
        tone: 'violet',
        positionClass: 'top-[44%] left-[7%]',
        rotateDeg: -4,
      },
      {
        label: 'سرم آبرسان',
        tone: 'deep',
        positionClass: 'bottom-[16%] left-[14%]',
        rotateDeg: 5,
      },
    ],
  },
  {
    id: 'oral',
    title: 'بهداشت دهان و دندان',
    shortTitle: 'بهداشت دهان و دندان',
    description:
      'خمیر دندان‌های سفیدکننده، مسواک‌های ارگونومیک و دهان‌شویه‌های طراوت‌بخش.',
    image: IMAGES.oralCare,
    productCount: 16,
    row: 1,
    zIndex: 22,
    flySpec: {
      orbitAngleOffset: 3.06, // mid-left (toothpaste + toothbrush + mouthwash)
      orbitRadiusX: 204,
      orbitRadiusY: 74,
      orbitSpeed: 0.34,
      heroCenterOffsetY: 16,
      heroScale: 0.92,
      arcOffsetX: -22,
      midFlightRotate: 9,
      staggerStart: 0.1,
      staggerEnd: 0.92,
      floatAmpY: 4,
      floatSpeed: 1.35,
      floatPhase: 2.4,
    },
    hoverTags: [
      { label: 'خمیر دندان', tone: 'light', offsetClass: '-top-2 right-1' },
      { label: 'مسواک نرم', tone: 'violet', offsetClass: 'top-14 left-0' },
      { label: 'دهان‌شویه', tone: 'deep', offsetClass: 'bottom-5 right-0' },
    ],
    showcaseTags: [
      {
        label: 'خمیر دندان سفیدکننده',
        tone: 'light',
        positionClass: 'top-[12%] left-[20%]',
        rotateDeg: -3,
      },
      {
        label: 'مسواک ارگونومیک',
        tone: 'violet',
        positionClass: 'top-[45%] left-[6%]',
        rotateDeg: 4,
      },
      {
        label: 'دهان‌شویه طراوت‌بخش',
        tone: 'deep',
        positionClass: 'bottom-[15%] left-[13%]',
        rotateDeg: -4,
      },
    ],
  },
  {
    id: 'laundry',
    title: 'مواد شوینده لباس',
    shortTitle: 'مواد شوینده لباس',
    description:
      'مایع لباسشویی محافظ رنگ، نرم‌کننده‌های معطر و لکه‌برهای قدرتمند برای الیاف لباس.',
    image: IMAGES.laundryDetergent,
    productCount: 19,
    row: 1,
    zIndex: 34,
    flySpec: {
      orbitAngleOffset: 0.98, // front-right (purple laundry detergent jug)
      orbitRadiusX: 196,
      orbitRadiusY: 74,
      orbitSpeed: 0.34,
      heroCenterOffsetY: 24,
      heroScale: 1.08,
      arcOffsetX: -46,
      midFlightRotate: -8,
      staggerStart: 0.05,
      staggerEnd: 0.87,
      floatAmpY: 4,
      floatSpeed: 1.2,
      floatPhase: 3.3,
    },
    hoverTags: [
      { label: 'نرم‌کننده لباس', tone: 'light', offsetClass: '-top-2 left-1' },
      { label: 'شوینده لباس رنگی', tone: 'violet', offsetClass: 'top-14 -right-2' },
      { label: 'لکه‌بر', tone: 'deep', offsetClass: 'bottom-5 left-1' },
    ],
    showcaseTags: [
      {
        label: 'نرم‌کننده لباس',
        tone: 'light',
        positionClass: 'top-[10%] left-[22%]',
        rotateDeg: 1,
      },
      {
        label: 'شوینده لباس رنگی',
        tone: 'violet',
        positionClass: 'top-[42%] left-[6%]',
        rotateDeg: -5,
      },
      {
        label: 'لکه‌بر قوی',
        tone: 'deep',
        positionClass: 'bottom-[16%] left-[15%]',
        rotateDeg: 4,
      },
    ],
  },
  {
    id: 'home',
    title: 'شوینده و نظافت منزل',
    shortTitle: 'شوینده و نظافت منزل',
    description:
      'اسپری‌های چندمنظوره، شیشه‌پاک‌کن بدون رد و پاک‌کننده‌های ایمن برای تمام سطوح خانه.',
    image: IMAGES.homeCleaning,
    productCount: 22,
    row: 2,
    zIndex: 18,
    flySpec: {
      orbitAngleOffset: 6.2, // mid-right (purple trigger spray)
      orbitRadiusX: 204,
      orbitRadiusY: 74,
      orbitSpeed: 0.34,
      heroCenterOffsetY: 14,
      heroScale: 0.95,
      arcOffsetX: 40,
      midFlightRotate: 8,
      staggerStart: 0.12,
      staggerEnd: 0.96,
      floatAmpY: 4,
      floatSpeed: 1.3,
      floatPhase: 4.1,
    },
    hoverTags: [
      { label: 'شیشه‌پاک‌کن', tone: 'light', offsetClass: '-top-2 right-1' },
      { label: 'پاک‌کننده چندمنظوره', tone: 'violet', offsetClass: 'top-16 -left-2' },
      { label: 'تمیزکننده سطوح', tone: 'deep', offsetClass: 'bottom-5 right-1' },
    ],
    showcaseTags: [
      {
        label: 'شیشه‌پاک‌کن درخشان',
        tone: 'light',
        positionClass: 'top-[12%] left-[20%]',
        rotateDeg: -2,
      },
      {
        label: 'اسپری چندمنظوره',
        tone: 'violet',
        positionClass: 'top-[44%] left-[6%]',
        rotateDeg: -5,
      },
      {
        label: 'پاک‌کننده سطوح',
        tone: 'deep',
        positionClass: 'bottom-[15%] left-[12%]',
        rotateDeg: 4,
      },
    ],
  },
  {
    id: 'freshener',
    title: 'خوشبوکننده‌ها',
    shortTitle: 'خوشبوکننده‌ها',
    description:
      'خوشبوکننده‌های هوا با ماندگاری بالا و پخش‌کننده‌های عطر چوبی برای فضایی دلنشین.',
    image: IMAGES.airFreshener,
    productCount: 15,
    row: 2,
    zIndex: 14,
    flySpec: {
      orbitAngleOffset: 4.12, // back-left (reed diffuser + spray)
      orbitRadiusX: 196,
      orbitRadiusY: 74,
      orbitSpeed: 0.34,
      heroCenterOffsetY: 8,
      heroScale: 0.94,
      arcOffsetX: 18,
      midFlightRotate: -7,
      staggerStart: 0.14,
      staggerEnd: 0.98,
      floatAmpY: 3.5,
      floatSpeed: 1.15,
      floatPhase: 5.0,
    },
    hoverTags: [
      { label: 'خوشبوکننده منزل', tone: 'light', offsetClass: '-top-2 left-2' },
      { label: 'اسپری هوا', tone: 'violet', offsetClass: 'top-14 right-0' },
      { label: 'عود و دیفیوزر', tone: 'deep', offsetClass: 'bottom-5 left-0' },
    ],
    showcaseTags: [
      {
        label: 'خوشبوکننده منزل',
        tone: 'light',
        positionClass: 'top-[10%] left-[22%]',
        rotateDeg: 2,
      },
      {
        label: 'اسپری هوا',
        tone: 'violet',
        positionClass: 'top-[44%] left-[8%]',
        rotateDeg: -4,
      },
      {
        label: 'خوشبوکننده چوبی',
        tone: 'deep',
        positionClass: 'bottom-[16%] left-[11%]',
        rotateDeg: 5,
      },
    ],
  },
  {
    id: 'baby',
    title: 'محصولات کودک',
    shortTitle: 'محصولات کودک',
    description:
      'فرمولاسیون ملایم و ضدحساسیت برای شستشو و مراقبت از پوست لطیف نوزاد و کودک.',
    image: IMAGES.babyCare,
    productCount: 14,
    row: 2,
    zIndex: 12,
    flySpec: {
      orbitAngleOffset: 5.16, // back-right (baby pump + rolled towel)
      orbitRadiusX: 196,
      orbitRadiusY: 74,
      orbitSpeed: 0.34,
      heroCenterOffsetY: 8,
      heroScale: 0.92,
      arcOffsetX: -40,
      midFlightRotate: 7,
      staggerStart: 0.16,
      staggerEnd: 1.0,
      floatAmpY: 3.5,
      floatSpeed: 1.1,
      floatPhase: 0.9,
    },
    hoverTags: [
      { label: 'محصولات بهداشتی کودک', tone: 'light', offsetClass: '-top-2 right-1' },
      { label: 'لوسیون لطیف', tone: 'violet', offsetClass: 'top-14 -left-1' },
      { label: 'شوینده لباس کودک', tone: 'deep', offsetClass: 'bottom-5 right-0' },
    ],
    showcaseTags: [
      {
        label: 'محصولات بهداشتی کودک',
        tone: 'light',
        positionClass: 'top-[10%] left-[20%]',
        rotateDeg: -2,
      },
      {
        label: 'لوسیون مرطوب‌کننده',
        tone: 'violet',
        positionClass: 'top-[44%] left-[7%]',
        rotateDeg: -5,
      },
      {
        label: 'شوینده ضدحساسیت',
        tone: 'deep',
        positionClass: 'bottom-[16%] left-[12%]',
        rotateDeg: 4,
      },
    ],
  },
];

export const FEATURED_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-air-spray',
    title: 'اسپری خوشبوکننده هوا',
    subtitle: 'رایحه اسطوخودوس و وانیل با ماندگاری ۲۴ ساعته',
    categoryId: 'freshener',
    categoryTitle: 'خوشبوکننده‌ها',
    price: 280_000,
    volume: '۳۰۰ میلی‌لیتر',
    rating: 4.9,
    image: IMAGES.airFreshener,
    highlights: ['پخش بوی یکنواخت و ملایم', 'بدون ایجاد لکه روی پارچه', 'رایحه طبیعی اسطوخودوس'],
    badge: 'پرفروش',
  },
  {
    id: 'prod-toothpaste',
    title: 'خمیر دندان سفیدکننده',
    subtitle: 'محافظت کامل از مینای دندان و طراوت طولانی‌مدت',
    categoryId: 'oral',
    categoryTitle: 'بهداشت دهان و دندان',
    price: 145_000,
    volume: '۱۰۰ میلی‌لیتر',
    rating: 4.8,
    image: IMAGES.oralCare,
    highlights: ['سفیدکنندگی ملایم روزانه', 'ضدپلاک و جرم', 'مناسب دندان‌های حساس'],
  },
  {
    id: 'prod-face-wash',
    title: 'ژل شستشوی صورت',
    subtitle: 'پاک‌کننده عمیق منافذ بدون ایجاد خشکی پوست',
    categoryId: 'skincare',
    categoryTitle: 'مراقبت از پوست صورت و بدن',
    price: 320_000,
    volume: '۲۰۰ میلی‌لیتر',
    rating: 4.9,
    image: IMAGES.faceWashTube,
    highlights: ['حاوی نیاسینامید و آلوئه‌ورا', 'تنظیم چربی پوست', 'فاقد پارابن و سولفات'],
    badge: 'محبوب',
  },
  {
    id: 'prod-serum',
    title: 'سرم آبرسان پوست',
    subtitle: 'ترکیب هیالورونیک اسید و ویتامین C برای شفافیت پوست',
    categoryId: 'skincare',
    categoryTitle: 'مراقبت از پوست صورت و بدن',
    price: 540_000,
    volume: '۳۰ میلی‌لیتر',
    rating: 5.0,
    image: IMAGES.skincareSerum,
    highlights: ['جذب سریع بدون چسبندگی', 'آبرسانی عمقی ۲۴ ساعته', 'روشن‌کننده و جوان‌ساز'],
    badge: 'منتخب سردبیر',
  },
  {
    id: 'prod-shampoo',
    title: 'شامپو ترمیم‌کننده مو',
    subtitle: 'حاوی کراتین گیاهی و روغن آرگان برای موهای آسیب‌دیده',
    categoryId: 'hair',
    categoryTitle: 'مراقبت از مو',
    price: 295_000,
    volume: '۵۰۰ میلی‌لیتر',
    rating: 4.9,
    image: IMAGES.hairCare,
    highlights: ['احیای تار مو و کاهش موخوره', 'درخشندگی و لطافت فوری', 'فاقد سولفات مضر'],
  },
  {
    id: 'prod-laundry',
    title: 'مایع لباسشویی محافظ رنگ',
    subtitle: 'شستشوی عمیق با حفظ درخشش و نرمی الیاف پارچه',
    categoryId: 'laundry',
    categoryTitle: 'مواد شوینده لباس',
    price: 410_000,
    volume: '۲ لیتر',
    rating: 4.8,
    image: IMAGES.laundryDetergent,
    highlights: ['قدرت لکه‌بری بالا در آب سرد', 'محافظت از بافت لباس‌های رنگی', 'رایحه ماندگار و لطیف'],
  },
  {
    id: 'prod-home-spray',
    title: 'اسپری چندمنظوره سطوح',
    subtitle: 'چربی‌زدایی سریع و درخشندگی بی‌نقص آشپزخانه و منزل',
    categoryId: 'home',
    categoryTitle: 'شوینده و نظافت منزل',
    price: 185_000,
    volume: '۷۵۰ میلی‌لیتر',
    rating: 4.7,
    image: IMAGES.homeCleaning,
    highlights: ['بدون باقی گذاشتن رد و لک', 'مناسب سطوح شیشه‌ای و سنگی', 'فرمولاسیون کم‌بو و ایمن'],
  },
  {
    id: 'prod-baby-lotion',
    title: 'ست شامپو و لوسیون کودک',
    subtitle: 'ضدحساسیت، فاقد اشک و مورد تایید متخصصین پوست',
    categoryId: 'baby',
    categoryTitle: 'محصولات کودک',
    price: 360_000,
    volume: '۴۰۰ میلی‌لیتر',
    rating: 4.9,
    image: IMAGES.babyCare,
    highlights: ['حاوی عصاره بابونه ارگانیک', 'pH خنثی و سازگار با پوست نوزاد', 'نرم‌کننده و محافظ پوست'],
  },
];

export const EDITORIAL_BANNERS: EditorialBanner[] = [
  {
    id: 'banner-hair',
    kicker: 'مراقبت روزانه',
    title: 'موهایی سالم‌تر و درخشان‌تر',
    description:
      'فرمولاسیون تخصصی برای تغذیه، نرمی و درخشش طبیعی موها در هر بار شستشو.',
    ctaLabel: 'مشاهده مراقبت از مو',
    targetCategoryId: 'hair',
    image: IMAGES.hairCare,
  },
  {
    id: 'banner-home',
    kicker: 'نظافت هوشمند',
    title: 'خانه‌ای تمیز بدون دردسر',
    description:
      'شوینده‌های مدرن با قدرت پاک‌کنندگی بالا و رایحه دلپذیر برای درخشندگی تمام سطوح.',
    ctaLabel: 'مشاهده شوینده‌های منزل',
    targetCategoryId: 'home',
    image: IMAGES.homeCleaning,
  },
];
