import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import {
  computeCartTotals,
  validateCheckoutForm,
  type CartItem,
  type CheckoutFormValues,
} from '../lib/cart';
import { formatToman, toPersianDigits } from '../lib/scrollMath';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

const INITIAL_FORM: CheckoutFormValues = {
  fullName: '',
  phone: '',
  address: '',
  postalCode: '',
};

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [formValues, setFormValues] = useState<CheckoutFormValues>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CheckoutFormValues, string>>
  >({});
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderCode: string;
    total: number;
    customerName: string;
  } | null>(null);

  if (!open) return null;

  const totals = computeCartTotals(items);

  function handleCheckoutSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validation = validateCheckoutForm(formValues);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }

    setFormErrors({});
    setConfirmedOrder({
      orderCode: `DM-${toPersianDigits(14050 + Math.floor(Math.random() * 890))}`,
      total: totals.total,
      customerName: formValues.fullName.trim(),
    });
    onClearCart();
    setFormValues(INITIAL_FORM);
    setStep('confirmed');
  }

  function handleClose() {
    if (step === 'confirmed') {
      setStep('cart');
    }
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="سبد خرید و تکمیل سفارش"
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
    >
      <div
        aria-hidden="true"
        onClick={handleClose}
        className="flex-1"
      />

      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="بازگشت به سبد خرید"
                className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-600"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-base font-extrabold text-[#1E1B2E]">
              {step === 'cart' && `سبد خرید (${toPersianDigits(totals.itemCount)})`}
              {step === 'checkout' && 'اطلاعات ارسال و ثبت سفارش'}
              {step === 'confirmed' && 'تأیید سفارش'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="بستن سبد خرید"
            className="w-9 h-9 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-3.5 bg-[#F7F6FA] border-b border-zinc-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                <Truck className="w-3.5 h-3.5 text-[#6D28D9]" aria-hidden="true" />
                {totals.remainingForFreeShipping === 0 ? (
                  <span className="text-[#5B21B6] font-semibold">
                    ارسال این سفارش برای شما رایگان است
                  </span>
                ) : (
                  <span>
                    {formatToman(totals.remainingForFreeShipping)} تا ارسال رایگان
                  </span>
                )}
              </span>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {toPersianDigits(totals.freeShippingPercent)}٪
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-200 overflow-hidden">
              <div
                style={{ width: `${totals.freeShippingPercent}%` }}
                className="h-full bg-[#6D28D9] rounded-full transition-all duration-300"
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1E1B2E]">
                سفارش شما با موفقیت ثبت شد
              </h3>
              <p className="text-sm text-zinc-600 leading-7">
                {confirmedOrder.customerName} عزیز، سفارش شماره{' '}
                <strong className="text-[#5B21B6] font-bold">
                  {confirmedOrder.orderCode}
                </strong>{' '}
                در حال آماده‌سازی برای ارسال است.
              </p>
              <div className="rounded-2xl bg-[#F7F6FA] p-4 text-sm flex items-center justify-between">
                <span className="text-zinc-500">مبلغ پرداختی (پرداخت در محل):</span>
                <span className="font-extrabold text-[#1E1B2E] tabular-nums">
                  {formatToman(confirmedOrder.total)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-white text-sm font-semibold transition-colors"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F4F8] text-zinc-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#1E1B2E]">سبد خرید شما خالی است</p>
              <p className="text-xs text-zinc-500">
                محصولات بهداشتی و خانگی مورد نیاز خود را به سبد خرید اضافه کنید.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex px-5 py-2.5 rounded-xl bg-[#2E1065] text-white text-xs font-semibold hover:bg-[#4C1D95] transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          ) : step === 'cart' ? (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center gap-3.5 p-3 rounded-2xl border border-zinc-200/80"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#F5F4F8] p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain product-blend"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#1E1B2E] truncate">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-zinc-500">{item.volume}</p>
                    <p className="text-xs font-bold text-[#5B21B6] mt-1 tabular-nums">
                      {formatToman(item.price * item.quantity)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.productId)}
                      aria-label={`حذف ${item.title} از سبد خرید`}
                      className="text-zinc-400 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1 bg-[#F5F4F8] rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, 1)}
                        aria-label={`افزایش تعداد ${item.title}`}
                        className="w-6 h-6 rounded-md bg-white text-zinc-700 hover:text-[#5B21B6] flex items-center justify-center shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold tabular-nums">
                        {toPersianDigits(item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.productId, -1)}
                        aria-label={`کاهش تعداد ${item.title}`}
                        className="w-6 h-6 rounded-md bg-white text-zinc-700 hover:text-[#5B21B6] flex items-center justify-center shadow-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <form
              id="darimish-checkout-form"
              onSubmit={handleCheckoutSubmit}
              noValidate
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-zinc-700 mb-1.5"
                >
                  نام و نام خانوادگی
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={formValues.fullName}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, fullName: e.target.value }))
                  }
                  placeholder="مثلاً: سارا محمدی"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6D28D9]"
                />
                {formErrors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-phone"
                  className="block text-xs font-semibold text-zinc-700 mb-1.5"
                >
                  شماره موبایل
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  dir="ltr"
                  value={formValues.phone}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, phone: e.target.value }))
                  }
                  placeholder="09123456789"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-left focus:outline-none focus:border-[#6D28D9]"
                />
                {formErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-zinc-700 mb-1.5"
                >
                  نشانی تحویل سفارش
                </label>
                <textarea
                  id="checkout-address"
                  rows={3}
                  value={formValues.address}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, address: e.target.value }))
                  }
                  placeholder="شهر، خیابان، کوچه، پلاک و واحد"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#6D28D9]"
                />
                {formErrors.address && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="checkout-postal"
                  className="block text-xs font-semibold text-zinc-700 mb-1.5"
                >
                  کد پستی ۱۰ رقمی
                </label>
                <input
                  id="checkout-postal"
                  type="text"
                  dir="ltr"
                  value={formValues.postalCode}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, postalCode: e.target.value }))
                  }
                  placeholder="1456789012"
                  className="w-full rounded-xl border border-zinc-200 px-3.5 py-2.5 text-sm text-left focus:outline-none focus:border-[#6D28D9]"
                />
                {formErrors.postalCode && (
                  <p className="text-xs text-red-600 mt-1">
                    {formErrors.postalCode}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {step !== 'confirmed' && items.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>جمع کل کالاها</span>
                <span className="tabular-nums">{formatToman(totals.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>هزینه ارسال</span>
                <span className="tabular-nums">
                  {totals.shippingCost === 0
                    ? 'رایگان'
                    : formatToman(totals.shippingCost)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm font-extrabold text-[#1E1B2E] pt-2 border-t border-zinc-100">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-[#5B21B6] tabular-nums">
                  {formatToman(totals.total)}
                </span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 rounded-xl bg-[#2E1065] hover:bg-[#4C1D95] text-white text-sm font-semibold transition-colors"
              >
                ادامه و ثبت سفارش
              </button>
            ) : (
              <button
                type="submit"
                form="darimish-checkout-form"
                className="w-full py-3.5 rounded-xl bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-sm font-semibold transition-colors"
              >
                تأیید و ثبت نهایی سفارش
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
