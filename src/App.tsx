/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SubNavbar from "./components/SubNavbar";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import CartDrawer from "./components/CartDrawer";
import CategoryOverlay from "./components/CategoryOverlay";
import WishlistDrawer from "./components/WishlistDrawer";
import ProfileDrawer from "./components/ProfileDrawer";
import PurchasePopup from "./components/PurchasePopup";
import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import TrackOrder from "./pages/TrackOrder";
import HelpCenter from "./pages/HelpCenter";
import FlashDeal from "./pages/FlashDeal";
import SellerShop from "./pages/SellerShop";
import Compare from "./pages/Compare";
import Blogs from "./pages/Blogs";
import ContactUs from "./pages/ContactUs";
import OrderHistory from "./pages/OrderHistory";
import DynamicPage from "./pages/DynamicPage";
import AuthModal from "./components/AuthModal";
import LoadingBar from 'react-top-loading-bar';
import { useState, useEffect } from "react";
import { useAuth } from "./lib/AuthContext";
import { useSiteSettings } from "./lib/queries";
import { Toaster, toast } from "react-hot-toast";
import { OrganizationSchema, WebSiteSchema } from "./components/StructuredData";
import { initTrackingScripts, trackFBEvent, trackGTMEvent } from "./lib/tracking";
import { initTrackingEngine } from "./lib/TrackingEngine";
import { useLayout } from "./lib/LayoutContext";
import { initThemeEngine } from "./lib/ThemeEngine";
import AnnouncementBar from "./components/AnnouncementBar";
import PopupManager from "./components/PopupManager";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const { data: settings } = useSiteSettings();
  const { layout } = useLayout();

  // Wishlist Sync with Local Storage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Engines — init on mount
  useEffect(() => {
    initThemeEngine();
    initTrackingEngine();
  }, []);

  // Tracking Scripts Injection
  useEffect(() => {
    if (settings) {
      initTrackingScripts(settings);
    }
  }, [settings]);

  // Listen for custom event to open category overlay from dropdown
  useEffect(() => {
    const handleOpenOverlay = () => setIsCategoryOverlayOpen(true);
    window.addEventListener('open-category-overlay', handleOpenOverlay);
    return () => window.removeEventListener('open-category-overlay', handleOpenOverlay);
  }, []);

  const handleAddToCart = (product: any) => {
    if (product) {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
          return prev.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1, variation: "Default" }];
      });

      // Track Event
      trackFBEvent('AddToCart', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'BDT'
      });

      trackGTMEvent('add_to_cart', {
        item_id: product.id,
        item_name: product.name,
        value: product.price,
        currency: 'BDT'
      });
    }
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string | number, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleRemoveFromCart = (productId: string | number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    setPurchaseItems([...cartItems]);
    setIsCartOpen(false);
    setIsPurchaseOpen(true);

    // Track InitiateCheckout
    trackFBEvent('InitiateCheckout', {
      num_items: cartItems.length,
      value: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      currency: 'BDT'
    });

    trackGTMEvent('begin_checkout', {
      value: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
      items: cartItems.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    });
  };

  const handleOrderNow = (product: any) => {
    if (product) {
      setPurchaseItems([
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image || product.images?.[0] || '',
          quantity: 1,
          variation: "Default"
        }
      ]);
      setIsPurchaseOpen(true);
    }
  };

  const handleToggleWishlist = (product: any) => {
    setWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        toast.success(`Removed from wishlist!`);
        return prev.filter(item => item.id !== product.id);
      }
      toast.success(`Added to wishlist!`);
      return [...prev, product];
    });
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
        {/* Site-wide Structured Data */}
        <OrganizationSchema
          name={settings?.site_name || "AmarShop"}
          url={window.location.origin}
          logo={settings?.site_logo}
          email={settings?.site_email}
          phone={settings?.site_phone}
          address={settings?.site_address}
        />
        <WebSiteSchema
          name={settings?.site_name || "AmarShop"}
          url={window.location.origin}
        />
        <LoadingBar
          color='#10b981'
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
          height={3}
          shadow={true}
        />
        
        {/* CMS Announcement Bar — above everything */}
        <AnnouncementBar />

        {layout.showHeader && (
          <Navbar 
            onCartClick={() => setIsCartOpen(true)} 
            onWishlistClick={() => setIsWishlistOpen(true)}
            onProfileClick={() => {
              if (user) {
                setIsProfileOpen(true);
              } else {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }
            }}
            cartCount={cartCount}
            cartTotal={cartTotal}
          />
        )}
        
        {layout.showSubNavbar && (
          <SubNavbar onCategoriesClick={() => setIsCategoryOverlayOpen(true)} />
        )}
        
        <Routes>
          <Route path="/" element={<Home onCategorySeeMore={() => setIsCategoryOverlayOpen(true)} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} />} />
          <Route path="/allproducts" element={<AllProducts onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} />} />
          <Route path="/productdetails/:productName" element={<ProductDetails onAddToCart={handleAddToCart} onOrderNow={handleOrderNow} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} />} />
          <Route path="/products" element={<AllProducts onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/flash-deal" element={<FlashDeal onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} />} />
          <Route path="/seller-shop" element={<SellerShop />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/order-history" element={<OrderHistory />} />
          {/* CMS Dynamic Pages — catch-all route for CMS-managed pages */}
          <Route path="/page/:slug" element={<DynamicPage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistItems={wishlistItems} onCategorySeeMore={() => setIsCategoryOverlayOpen(true)} />} />
        </Routes>

        {layout.showFooter && <Footer />}
        
        <BottomNav 
          onCartClick={() => setIsCartOpen(true)} 
          onWishlistClick={() => setIsWishlistOpen(true)}
          onProfileClick={() => {
            if (user) {
              setIsProfileOpen(true);
            } else {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }
          }}
          cartCount={cartCount}
        />
        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemove={handleRemoveFromCart}
          onCheckout={handleCheckout}
        />
        <WishlistDrawer 
          isOpen={isWishlistOpen} 
          onClose={() => setIsWishlistOpen(false)} 
          items={wishlistItems}
          onAddToCart={handleAddToCart}
          onRemove={(id) => setWishlistItems(prev => prev.filter(item => item.id !== id))}
        />
        <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <CategoryOverlay isOpen={isCategoryOverlayOpen} onClose={() => setIsCategoryOverlayOpen(false)} />
        <PurchasePopup 
          isOpen={isPurchaseOpen} 
          onClose={() => setIsPurchaseOpen(false)} 
          cartItems={purchaseItems} 
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authMode}
        />
        {/* CMS-driven popups */}
        <PopupManager />
        <Toaster position="top-right" />
      </div>
    </BrowserRouter>
  );
}


