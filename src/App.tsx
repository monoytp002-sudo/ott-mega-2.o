import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomeView } from './components/HomeView.tsx';
import { PlansView } from './components/PlansView.tsx';
import { HowToWorkView } from './components/HowToWorkView.tsx';
import { TrackOrderView } from './components/TrackOrderView.tsx';
import { ContactUsView } from './components/ContactUsView.tsx';
import { AdminPanelView } from './components/AdminPanelView.tsx';
import { ProductDetailsView } from './components/ProductDetailsView.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { OTTPlan, Order } from './types.ts';
import { INITIAL_PLANS } from './data/mockData.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>('');
  const [plans, setPlans] = useState<OTTPlan[]>(INITIAL_PLANS);
  const [cart, setCart] = useState<OTTPlan[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  // Checkout Modal
  const [checkoutPlan, setCheckoutPlan] = useState<OTTPlan | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Deep-linked Order ID for Track Order page
  const [targetedOrderId, setTargetedOrderId] = useState<string>('');

  // Handle URL location & popstate for direct link /product/:slug routing
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/product/')) {
        const slug = decodeURIComponent(path.replace('/product/', '').trim());
        if (slug) {
          setSelectedProductSlug(slug);
          setCurrentPage('product');
          return;
        }
      }
      if (path === '/plans') {
        setCurrentPage('plans');
      } else if (path === '/track-order') {
        setCurrentPage('track-order');
      } else if (path === '/contact') {
        setCurrentPage('contact-us');
      } else if (path === '/admin') {
        setCurrentPage('admin');
      } else if (path === '/how-to-work') {
        setCurrentPage('how-to-work');
      } else if (path === '/' || path === '') {
        setCurrentPage('home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Fetch live plans from server on mount
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/plans');
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setPlans(data.data);
      }
    } catch (err) {
      console.log('Using local initial plans:', err);
    }
  };

  // Navigate to product with HTML5 history
  const handleNavigateToProduct = (slug: string) => {
    setSelectedProductSlug(slug);
    setCurrentPage('product');
    const targetUrl = `/product/${slug}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({}, '', targetUrl);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generic page navigation helper with browser history
  const handleSetCurrentPage = (page: string) => {
    setCurrentPage(page);
    let targetPath = '/';
    if (page === 'plans') targetPath = '/plans';
    else if (page === 'track-order') targetPath = '/track-order';
    else if (page === 'contact-us') targetPath = '/contact';
    else if (page === 'admin') targetPath = '/admin';
    else if (page === 'how-to-work') targetPath = '/how-to-work';
    else if (page === 'product' && selectedProductSlug) targetPath = `/product/${selectedProductSlug}`;

    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations with optional duration / price tier override
  const handleAddToCart = (plan: OTTPlan, selectedDuration?: string, selectedPrice?: number) => {
    const customizedPlan: OTTPlan = {
      ...plan,
      duration: (selectedDuration as any) || plan.duration,
      discountedPrice: selectedPrice !== undefined ? selectedPrice : plan.discountedPrice,
    };
    setCart((prev) => [...prev, customizedPlan]);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Direct checkout with optional duration / price tier override
  const handleSelectPlanForBuy = (plan: OTTPlan, selectedDuration?: string, selectedPrice?: number) => {
    const customizedPlan: OTTPlan = {
      ...plan,
      duration: (selectedDuration as any) || plan.duration,
      discountedPrice: selectedPrice !== undefined ? selectedPrice : plan.discountedPrice,
    };
    setCheckoutPlan(customizedPlan);
    setIsCheckoutOpen(true);
  };

  // When order is placed successfully in Checkout Modal
  const handleOrderSuccess = (order: Order) => {
    // Remove purchased plan from cart if present
    setCart((prev) => prev.filter((p) => p.id !== order.planId));
    // Navigate straight to Track Order with pre-filled Order ID
    setTargetedOrderId(order.orderNumber);
    handleSetCurrentPage('track-order');
  };

  // When admin clicks "View on Track Order"
  const handleViewOrderOnTrack = (orderNumber: string) => {
    setTargetedOrderId(orderNumber);
    handleSetCurrentPage('track-order');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-white selection:bg-pink-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleSetCurrentPage}
        cart={cart}
        openCart={() => setIsCartOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        openAdminModal={() => handleSetCurrentPage('admin')}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomeView
            plans={plans}
            onSelectPlan={handleSelectPlanForBuy}
            onAddToCart={handleAddToCart}
            setCurrentPage={handleSetCurrentPage}
            onNavigateToProduct={handleNavigateToProduct}
          />
        )}

        {currentPage === 'plans' && (
          <PlansView
            plans={plans}
            onSelectPlan={handleSelectPlanForBuy}
            onAddToCart={handleAddToCart}
            onNavigateToProduct={handleNavigateToProduct}
          />
        )}

        {currentPage === 'product' && (
          <ProductDetailsView
            slug={selectedProductSlug}
            plans={plans}
            onBackToPlans={() => handleSetCurrentPage('plans')}
            onSelectPlanForBuy={handleSelectPlanForBuy}
            onAddToCart={handleAddToCart}
            onSelectOtherProduct={handleNavigateToProduct}
          />
        )}

        {currentPage === 'how-to-work' && (
          <HowToWorkView setCurrentPage={handleSetCurrentPage} />
        )}

        {currentPage === 'track-order' && (
          <TrackOrderView initialOrderId={targetedOrderId} />
        )}

        {currentPage === 'contact-us' && (
          <ContactUsView />
        )}

        {currentPage === 'admin' && (
          <AdminPanelView
            plans={plans}
            setPlans={setPlans}
            isLoggedIn={isAdminLoggedIn}
            setIsLoggedIn={setIsAdminLoggedIn}
            onViewOrderOnTrack={handleViewOrderOnTrack}
            onNavigateToProduct={handleNavigateToProduct}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        setCurrentPage={handleSetCurrentPage}
        openAdminModal={() => handleSetCurrentPage('admin')}
      />

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={handleRemoveFromCart}
        onCheckout={handleSelectPlanForBuy}
        clearCart={handleClearCart}
      />

      {/* Instant Checkout Modal */}
      {isCheckoutOpen && checkoutPlan && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setCheckoutPlan(null);
          }}
          plan={checkoutPlan}
          onOrderSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
}

