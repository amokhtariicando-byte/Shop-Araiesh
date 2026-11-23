import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Heart,
  LayoutGrid,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import { CATEGORIES, type ProductItem } from '../data/catalog';
import { formatToman, toPersianDigits } from '../lib/scrollMath';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchResults: ProductItem[];
  onSelectCategory: (categoryId: string) => void;
  onSelectProduct: (product: ProductItem) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onToggleWishlistFilter: () => void;
  showWishlistOnly: boolean;
}

export function Header({
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectCategory,
  onSelectProduct,
  cartCount,
  wishlistCount,
  onOpenCart,
  onToggleWishlistFilter,
  showWishlistOnly,
}: HeaderProps) {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setCategoryMenuOpen(false);
      }
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);
    setCategoryMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSearchFocused(false);
    scrollToSection('products');
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/70">
      {/* Slim Top Utility Strip */}
      <div className="bg-[#F5F4F8] border-b border-zinc-200/60 hidden md:block">
        <div className="max-w-[1320px] mx-auto px-6 h-8 flex items-center justify-between text-xs text-zinc-600">
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-[#6D28D9]" aria-hidden="true" />
            <span>ارسال رایگان برای سفارش‌های بالای ۲ میلیون تومان</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-zinc-500">ضمانت اصالت و سلامت فیزیکی کالا</span>
            <span aria-hidden="true" className="text-zinc-300">|</span>
            <a
              href="#footer"
              className="flex items-center gap-1.5 text-zinc-700 hover:text-[#6D28D9] transition-colors tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#6D28D9]" aria-hidden="true" />
              <span dir="ltr">۰۲۱-۹۱۰۰۱۴۵۶</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-[1320px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="flex flex-col items-start leading-none shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D28D9] rounded-md px-1 py-0.5"
          aria-label="فروشگاه اینترنتی داریمش - بازگشت به خانه"
        >
          <span className="text-2xl md:text-[26px] font-black tracking-tight text-[#5B21B6] group-hover:text-[#4C1D95] transition-colors">
            داریمش
          </span>
          <span className="font-latin text-[9px] font-bold tracking-[0.28em] text-[#7C3AED] mt-0.5">
            DARIMISH
          </span>
        </a>

        {/* Live Product Search Bar */}
        <div ref={searchBoxRef} className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} role="search" aria-label="جستجوی محصولات">
            <label htmlFor="header-search-input" className="sr-only">
              جستجو در بین محصولات
            </label>
            <div className="flex items-center bg-[#F4F3F7] rounded-xl border border-transparent focus-within:border-[#6D28D9]/40 focus-within:bg-white transition-all p-1">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="جستجو در بین محصولات..."
                className="flex-1 bg-transparent px-3.5 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="پاک کردن جستجو"
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                aria-label="انجام جستجو"
                className="w-9 h-9 rounded-lg bg-[#5B21B6] hover:bg-[#4C1D95] text-white flex items-center justify-center transition-colors shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Search Live Results Dropdown */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-zinc-200/80 overflow-hidden z-50">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-sm text-zinc-500">
                  محصولی با عبارت «{searchQuery}» یافت نشد.
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100 max-h-80 overflow-y-auto">
                  {searchResults.slice(0, 5).map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchFocused(false);
                          onSelectProduct(item);
                        }}
                        className="w-full flex items-center gap-3.5 p-3 hover:bg-[#F7F6FA] transition-colors text-right"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#F4F3F7] flex items-center justify-center p-1.5 shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain product-blend"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-zinc-500 truncate">
                            {item.categoryTitle}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#5B21B6] whitespace-nowrap tabular-nums">
                          {formatToman(item.price)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Utility Action Icons (Wishlist, Cart, Mobile Menu) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              onToggleWishlistFilter();
              scrollToSection('products');
            }}
            aria-label={
              showWishlistOnly
                ? 'نمایش همه محصولات'
                : `نمایش علاقه‌مندی‌ها (${toPersianDigits(wishlistCount)})`
            }
            aria-pressed={showWishlistOnly}
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              showWishlistOnly
                ? 'bg-[#EDE9FE] text-[#5B21B6]'
                : 'text-zinc-600 hover:bg-[#F4F3F7] hover:text-[#5B21B6]'
            }`}
          >
            <Heart
              className={`w-[19px] h-[19px] ${showWishlistOnly ? 'fill-[#5B21B6]' : ''}`}
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {toPersianDigits(wishlistCount)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`باز کردن سبد خرید (${toPersianDigits(cartCount)} کالا)`}
            className="relative h-10 px-3 rounded-xl bg-[#F4F3F7] hover:bg-[#EDE9FE] text-zinc-800 hover:text-[#4C1D95] flex items-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-[19px] h-[19px]" />
            <span className="text-xs font-semibold hidden sm:inline whitespace-nowrap">
              سبد خرید
            </span>
            <span
              data-testid="header-cart-count"
              className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#2E1065] text-white text-[11px] font-bold flex items-center justify-center tabular-nums"
            >
              {toPersianDigits(cartCount)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-10 h-10 rounded-xl bg-[#F4F3F7] text-zinc-700 flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Secondary Navigation Row matching video (دسته‌بندی کالاها + Nav Links) */}
      <div className="hidden md:block border-t border-zinc-100">
        <div className="max-w-[1320px] mx-auto px-6 h-11 flex items-center justify-between gap-8">
          <div className="flex items-center gap-7">
            {/* Categories Dropdown Trigger */}
            <div ref={categoryMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setCategoryMenuOpen((v) => !v)}
                aria-expanded={categoryMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[#5B21B6] hover:bg-[#4C1D95] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
                <span>دسته‌بندی کالاها</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    categoryMenuOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              {categoryMenuOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-2 z-50"
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setCategoryMenuOpen(false);
                        onSelectCategory(cat.id);
                        scrollToSection('products');
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5F3FF] text-right transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#F4F3F7] p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={cat.image}
                          alt={cat.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain product-blend"
                        />
                      </div>
                      <span className="flex-1 text-xs font-semibold text-zinc-800 group-hover:text-[#5B21B6]">
                        {cat.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 tabular-nums">
                        {toPersianDigits(cat.productCount)} کالا
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clean Single-Line Nav Links */}
            <nav aria-label="منوی اصلی" className="flex items-center gap-6 text-[13px] font-medium text-zinc-600">
              <button
                type="button"
                onClick={() => scrollToSection('hero')}
                className="text-[#5B21B6] font-semibold hover:text-[#4C1D95] transition-colors whitespace-nowrap shrink-0"
              >
                خانه
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('categories')}
                className="hover:text-[#5B21B6] transition-colors whitespace-nowrap shrink-0"
              >
                دسته‌بندی‌ها
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('showcase')}
                className="hover:text-[#5B21B6] transition-colors whitespace-nowrap shrink-0"
              >
                معرفی ویژه
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('products')}
                className="hover:text-[#5B21B6] transition-colors whitespace-nowrap shrink-0"
              >
                فروشگاه
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('footer')}
                className="hover:text-[#5B21B6] transition-colors whitespace-nowrap shrink-0"
              >
                درباره ما
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-4">
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="flex items-center bg-[#F4F3F7] rounded-xl p-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="جستجو در بین محصولات..."
                className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="submit"
                aria-label="جستجو"
                className="w-9 h-9 rounded-lg bg-[#5B21B6] text-white flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  scrollToSection('products');
                }}
                className="px-3 py-2.5 rounded-xl bg-[#F5F4F8] text-xs font-semibold text-zinc-800 text-right hover:bg-[#EDE9FE] hover:text-[#5B21B6] transition-colors"
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
