/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import {
  BLOG_POSTS,
  BlogPost,
  PRODUCTS,
  Product,
} from './data/blueblendsData';
import { ActiveRoute, Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeaturedProductsSection } from './components/FeaturedProductsSection';
import { AboutMissionSection } from './components/AboutMissionSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { JournalSection } from './components/JournalSection';
import { NewsletterHubSection } from './components/NewsletterHubSection';
import { Footer } from './components/Footer';
import { ShopView } from './components/ShopView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArticleReaderModal } from './components/ArticleReaderModal';
import { CartDrawer, CartItem, ConfirmedOrderDetails } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';

const CART_STORAGE_KEY = 'blueblends_cart_v1';
const USER_STORAGE_KEY = 'blueblends_user_v1';

export default function App() {
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [returnedOrder, setReturnedOrder] = useState<ConfirmedOrderDetails | null>(null);

  // Check if returning from Cashfree redirect with ?order_id=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnOrderId = params.get('order_id');
    if (returnOrderId) {
      window.history.replaceState({}, '', window.location.pathname);
      fetch(`/api/payment/status/${encodeURIComponent(returnOrderId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.status === 'PAID') {
            setReturnedOrder({
              orderId: data.orderId,
              cfPaymentId: data.cfPaymentId,
              amount: data.amount,
              customerName: data.customer?.name || 'Customer',
              customerEmail: data.customer?.email || '',
              accessLinks: data.accessLinks,
              isSimulated: false,
            });
            setCartOpen(true);
            setCartItems([]);
          } else {
            setToastMessage(`Payment status for #${returnOrderId}: ${data.status || 'Pending'}`);
          }
        })
        .catch((err) => {
          console.error('Failed to verify returned order:', err);
        });
    }
  }, []);

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(USER_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavigateHome = (sectionId?: string) => {
    setActiveRoute('home');
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateShop = () => {
    setActiveRoute('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setToastMessage(`Added ${product.title} to cart`);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.product.id === productId);
      if (item) {
        setToastMessage(`Removed ${item.product.title} from cart`);
      }
      return prev.filter((i) => i.product.id !== productId);
    });
  };

  const handleClearCart = () => {
    if (cartItems.length > 0) {
      setCartItems([]);
      setToastMessage('Cart cleared');
    }
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    try {
      localStorage.setItem(USER_STORAGE_KEY, email);
    } catch {
      // Ignore storage errors
    }
  };

  const handleLogout = () => {
    setUserEmail(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0D0D0D]">
      <Header
        activeRoute={activeRoute}
        onNavigateHome={handleNavigateHome}
        onNavigateShop={handleNavigateShop}
        onOpenAuth={() => setAuthOpen(true)}
        onOpenCart={() => setCartOpen(true)}
        cartCount={totalCartCount}
        userEmail={userEmail}
      />

      <main className="flex-1">
        {activeRoute === 'shop' ? (
          <ShopView
            products={PRODUCTS}
            onNavigateHome={() => handleNavigateHome()}
            onSelectProduct={setSelectedProduct}
            onAddToCart={(product) => handleAddToCart(product, 1)}
          />
        ) : (
          <>
            <HeroSection onShopProducts={handleNavigateShop} />
            <FeaturedProductsSection
              products={PRODUCTS}
              onSelectProduct={setSelectedProduct}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onViewAll={handleNavigateShop}
            />
            <AboutMissionSection />
            <TestimonialsSection />
            <JournalSection
              posts={BLOG_POSTS}
              onSelectPost={setSelectedPost}
            />
            <NewsletterHubSection />
          </>
        )}
      </main>

      <Footer
        onNavigateHome={handleNavigateHome}
        onNavigateShop={handleNavigateShop}
        onOpenAuth={() => setAuthOpen(true)}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <ArticleReaderModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onBrowseShop={handleNavigateShop}
        defaultEmail={userEmail}
        initialOrder={returnedOrder}
        onClearInitialOrder={() => setReturnedOrder(null)}
      />

      <AuthModal
        isOpen={authOpen}
        userEmail={userEmail}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-[#0D0D0D] text-white text-sm px-4 py-3 rounded-xl shadow-lg border border-white/10"
        >
          <Check className="w-4 h-4 text-[#60A5FA] shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setCartOpen(true);
            }}
            className="ml-2 text-xs font-medium text-[#93C5FD] hover:text-white underline underline-offset-4 whitespace-nowrap"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
