import { Mail, MapPin, Phone } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';

interface FooterProps {
  onSelectCategory: (categoryId: string) => void;
}

export function Footer({ onSelectCategory }: FooterProps) {
  function goToCategory(categoryId: string) {
    onSelectCategory(categoryId);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <footer
      id="footer"
      className="bg-[#F5F4F8] border-t border-zinc-200/80 text-zinc-600"
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="inline-flex flex-col leading-none">
            <span className="text-2xl font-black text-[#5B21B6]">داریمش</span>
            <span className="font-latin text-[10px] font-bold tracking-[0.28em] text-[#7C3AED] mt-1">
              DARIMISH
            </span>
          </div>
          <p className="text-sm leading-7 text-zinc-600 max-w-md">
            فروشگاه اینترنتی داریمش؛ مرجع تخصصی محصولات بهداشتی، مراقبت فردی و
            شوینده‌های خانگی با ضمانت اصالت و ارسال سریع در سراسر کشور.
          </p>
        </div>

        {/* Categories Links */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-sm font-bold text-[#1E1B2E]">دسته‌بندی محصولات</h3>
          <ul className="grid grid-cols-2 gap-2.5 text-xs">
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => goToCategory(cat.id)}
                  className="hover:text-[#5B21B6] transition-colors text-right"
                >
                  {cat.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-sm font-bold text-[#1E1B2E]">ارتباط با داریمش</h3>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" aria-hidden="true" />
              <span dir="ltr" className="tabular-nums">۰۲۱-۹۱۰۰۱۴۵۶</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" aria-hidden="true" />
              <span className="font-latin">support@darimish.ir</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#6D28D9] shrink-0" aria-hidden="true" />
              <span>تهران، بلوار نلسون ماندلا، پلاک ۴۲</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200/70">
        <div className="max-w-[1320px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <p>© ۱۴۰۵ فروشگاه اینترنتی داریمش. تمامی حقوق محفوظ است.</p>
          <p>تجربه خرید سریع، ساده و مطمئن</p>
        </div>
      </div>
    </footer>
  );
}
