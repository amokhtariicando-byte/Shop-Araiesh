import { useEffect, useMemo, useState } from 'react';
import { FEATURED_PRODUCTS, type ProductItem } from './data/catalog';
import {
  addToCartList,
  computeCartTotals,
  filterCatalogProducts,
  removeFromCartList,
  updateCartQuantity,
  type CartItem,
} from './lib/cart';
import { Header } from './components/Header';
import { HeroToCategoryStage } from './components/HeroToCategoryStage';
import { StickyCategoryShowcase } from './components/StickyCategoryShowcase';
import { FeaturedProducts } from './components/FeaturedProducts';
import { EditorialBanners } from './components/EditorialBanners';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { Footer } from './components/Footer';

const CART_STORAGE_KEY = 'darimish_cart_v1';
const WISHLIST_STORAGE_KEY = 'darimish_wishlist_v1';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(
    null
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadStorage<CartItem[]>(CART_STORAGE_KEY, [])
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadStorage<string[]>(WISHLIST_STORAGE_KEY, [])
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(wishlistIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  const searchResults = useMemo(
    () => filterCatalogProducts(FEATURED_PRODUCTS, 'all', searchQuery),
    [searchQuery]
  );

  const visibleProducts = useMemo(() => {
    const base = filterCatalogProducts(
      FEATURED_PRODUCTS,
      activeCategory,
      searchQuery
    );
    if (showWishlistOnly) {
      return base.filter((p) => wishlistIds.includes(p.id));
    }
    return base;
  }, [activeCategory, searchQuery, showWishlistOnly, wishlistIds]);

  const cartTotals = useMemo(() => computeCartTotals(cartItems), [cartItems]);

  function handleAddToCart(product: ProductItem) {
    setCartItems((prev) =>
      addToCartList(prev, {
        productId: product.id,
        title: product.title,
        price: product.price,
        volume: product.volume,
        image: product.image,
      })
    );
    setCartOpen(true);
  }

  function handleUpdateQuantity(productId: string, delta: number) {
    setCartItems((prev) => updateCartQuantity(prev, productId, delta));
  }

  function handleRemoveFromCart(productId: string) {
    setCartItems((prev) => removeFromCartList(prev, productId));
  }

  function handleToggleWishlist(productId: string) {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  function handleSelectCategory(categoryId: string) {
    setShowWishlistOnly(false);
    setActiveCategory(categoryId);
  }

  function handleClearFilters() {
    setActiveCategory('all');
    setSearchQuery('');
    setShowWishlistOnly(false);
  }

  function handleExploreShop() {
    setShowWishlistOnly(false);
    document
      .getElementById('products')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div dir="rtl" className="min-h-screen bg-white text-[#18181B]">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResults={searchResults}
        onSelectCategory={handleSelectCategory}
        onSelectProduct={(p) => setQuickViewProduct(p)}
        cartCount={cartTotals.itemCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onToggleWishlistFilter={() => setShowWishlistOnly((v) => !v)}
        showWishlistOnly={showWishlistOnly}
      />

      <main>
        {/* Synchronized Hero + Scroll-Flying 7-Category Grid */}
        <HeroToCategoryStage
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onExploreShop={handleExploreShop}
        />

        {/* Sticky Scroll-Driven 7-Slide Showcase (01/07 - 07/07) */}
        <StickyCategoryShowcase onSelectCategory={handleSelectCategory} />

        {/* Featured Products Grid ("محصولات منتخب") */}
        <FeaturedProducts
          products={visibleProducts}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          showWishlistOnly={showWishlistOnly}
          onClearFilters={handleClearFilters}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onQuickView={(p) => setQuickViewProduct(p)}
        />

        {/* Two-Column Editorial Banners */}
        <EditorialBanners onSelectCategory={handleSelectCategory} />
      </main>

      <Footer onSelectCategory={handleSelectCategory} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCartItems([])}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={
          quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false
        }
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
