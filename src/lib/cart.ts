export interface CartItem {
  productId: string;
  title: string;
  price: number;
  volume: string;
  image: string;
  quantity: number;
}

export interface ProductFilterInput {
  id: string;
  title: string;
  subtitle: string;
  categoryId: string;
  categoryTitle: string;
}

export interface CheckoutFormValues {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
}

export interface CheckoutValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof CheckoutFormValues, string>>;
}

export const FREE_SHIPPING_THRESHOLD = 2_000_000;
export const STANDARD_SHIPPING_COST = 65_000;

export function addToCartList(
  items: CartItem[],
  product: Omit<CartItem, 'quantity'>
): CartItem[] {
  const existing = items.find((item) => item.productId === product.productId);
  if (existing) {
    return items.map((item) =>
      item.productId === product.productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  }
  return [...items, { ...product, quantity: 1 }];
}

export function updateCartQuantity(
  items: CartItem[],
  productId: string,
  delta: number
): CartItem[] {
  return items
    .map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + delta }
        : item
    )
    .filter((item) => item.quantity > 0);
}

export function removeFromCartList(items: CartItem[], productId: string): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

export function computeCartTotals(items: CartItem[]): {
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  total: number;
  remainingForFreeShipping: number;
  freeShippingPercent: number;
} {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost =
    subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_COST;
  const total = subtotal + shippingCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingPercent = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  return {
    itemCount,
    subtotal,
    shippingCost,
    total,
    remainingForFreeShipping,
    freeShippingPercent,
  };
}

export function filterCatalogProducts<T extends ProductFilterInput>(
  products: T[],
  activeCategory: string,
  searchQuery: string
): T[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory =
      activeCategory === 'all' || product.categoryId === activeCategory;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    const haystack =
      `${product.title} ${product.subtitle} ${product.categoryTitle}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

function normalizeDigits(raw: string): string {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return raw
    .replace(/[۰-۹]/g, (ch) => String(persian.indexOf(ch)))
    .replace(/[٠-٩]/g, (ch) => String(arabic.indexOf(ch)));
}

export function validateCheckoutForm(
  values: CheckoutFormValues
): CheckoutValidationResult {
  const errors: Partial<Record<keyof CheckoutFormValues, string>> = {};

  if (values.fullName.trim().length < 3) {
    errors.fullName = 'لطفاً نام و نام خانوادگی معتبر وارد کنید.';
  }

  const cleanPhone = normalizeDigits(values.phone).replace(/[\s-]/g, '');
  if (!/^09\d{9}$/.test(cleanPhone)) {
    errors.phone = 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود.';
  }

  if (values.address.trim().length < 10) {
    errors.address = 'لطفاً نشانی دقیق تحویل (حداقل ۱۰ کاراکتر) را وارد کنید.';
  }

  const cleanPostal = normalizeDigits(values.postalCode).replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(cleanPostal)) {
    errors.postalCode = 'کد پستی باید دقیقاً ۱۰ رقم باشد.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
