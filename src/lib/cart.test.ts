import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addToCartList,
  computeCartTotals,
  filterCatalogProducts,
  FREE_SHIPPING_THRESHOLD,
  removeFromCartList,
  STANDARD_SHIPPING_COST,
  updateCartQuantity,
  validateCheckoutForm,
  type CartItem,
} from './cart';

const sampleProduct: Omit<CartItem, 'quantity'> = {
  productId: 'p-serum',
  title: 'سرم آبرسان پوست',
  price: 540_000,
  volume: '۳۰ میلی‌لیتر',
  image: '/img.jpg',
};

test('cart add, quantity increment/decrement, and removal update state properly', () => {
  let cart = addToCartList([], sampleProduct);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 1);

  cart = addToCartList(cart, sampleProduct);
  assert.equal(cart[0].quantity, 2);

  cart = updateCartQuantity(cart, 'p-serum', -1);
  assert.equal(cart[0].quantity, 1);

  cart = updateCartQuantity(cart, 'p-serum', -1);
  assert.equal(cart.length, 0);

  cart = addToCartList([], sampleProduct);
  cart = removeFromCartList(cart, 'p-serum');
  assert.equal(cart.length, 0);
});

test('computeCartTotals applies standard shipping below threshold and free shipping above', () => {
  const below = computeCartTotals([{ ...sampleProduct, quantity: 2 }]);
  assert.equal(below.subtotal, 1_080_000);
  assert.equal(below.shippingCost, STANDARD_SHIPPING_COST);
  assert.equal(below.total, 1_080_000 + STANDARD_SHIPPING_COST);
  assert.equal(below.remainingForFreeShipping, FREE_SHIPPING_THRESHOLD - 1_080_000);

  const above = computeCartTotals([{ ...sampleProduct, quantity: 4 }]);
  assert.equal(above.subtotal, 2_160_000);
  assert.equal(above.shippingCost, 0);
  assert.equal(above.total, 2_160_000);
  assert.equal(above.freeShippingPercent, 100);
});

test('filterCatalogProducts matches by category and Persian search text', () => {
  const items = [
    { id: '1', title: 'سرم آبرسان پوست', subtitle: 'درخشان‌کننده', categoryId: 'skincare', categoryTitle: 'مراقبت از پوست' },
    { id: '2', title: 'شامپو ترمیم‌کننده', subtitle: 'تقویت مو', categoryId: 'hair', categoryTitle: 'مراقبت از مو' },
  ];

  assert.equal(filterCatalogProducts(items, 'all', '').length, 2);
  assert.equal(filterCatalogProducts(items, 'hair', '').length, 1);
  assert.equal(filterCatalogProducts(items, 'all', 'سرم').length, 1);
  assert.equal(filterCatalogProducts(items, 'hair', 'سرم').length, 0);
});

test('validateCheckoutForm rejects empty/invalid inputs and accepts valid Persian/Latin digits', () => {
  const invalid = validateCheckoutForm({
    fullName: 'ع',
    phone: '123',
    address: 'تهران',
    postalCode: '1234',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.address);
  assert.ok(invalid.errors.postalCode);

  const valid = validateCheckoutForm({
    fullName: 'سارا محمدی',
    phone: '۰۹۱۲۳۴۵۶۷۸۹',
    address: 'تهران، خیابان ولیعصر، کوچه بهار، پلاک ۱۲',
    postalCode: '۱۴۵۶۷۸۹۰۱۲',
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});
