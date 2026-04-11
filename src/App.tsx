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
import { useState } from "react";
import { PRODUCTS } from "./data/mockData";

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOverlayOpen, setIsCategoryOverlayOpen] = useState(false);
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);
  const [purchaseItems, setPurchaseItems] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);

  const handleAddToCart = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      setCartItems(prev => {
        const existing = prev.find(item => item.id === productId);
        if (existing) {
          return prev.map(item => 
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { ...product, quantity: 1, variation: "Default" }];
      });
    }
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = () => {
    setPurchaseItems([...cartItems]);
    setIsCartOpen(false);
    setIsPurchaseOpen(true);
  };

  const handleOrderNow = (productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      // Include the selected product plus 2 other random products for demonstration
      const otherProducts = PRODUCTS
        .filter(p => p.id !== productId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image,
          quantity: 1,
          variation: "Default"
        }));

      setPurchaseItems([
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          variation: "Default"
        },
        ...otherProducts
      ]);
      setIsPurchaseOpen(true);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Navbar 
          onCartClick={() => setIsCartOpen(true)} 
          onWishlistClick={() => setIsWishlistOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
          cartCount={cartCount}
          cartTotal={cartTotal}
        />
        <SubNavbar onCategoriesClick={() => setIsCategoryOverlayOpen(true)} />
        
        <Routes>
          <Route path="/" element={<Home onCategorySeeMore={() => setIsCategoryOverlayOpen(true)} onAddToCart={handleAddToCart} />} />
          <Route path="/allproducts" element={<AllProducts onAddToCart={handleAddToCart} />} />
          <Route path="/productdetails/:productName" element={<ProductDetails onAddToCart={handleAddToCart} onOrderNow={handleOrderNow} />} />
          {/* Fallback for the old /products link if it exists */}
          <Route path="/products" element={<AllProducts onAddToCart={handleAddToCart} />} />
        </Routes>

        <Footer />
        <BottomNav 
          onCartClick={() => setIsCartOpen(true)} 
          onWishlistClick={() => setIsWishlistOpen(true)}
          onProfileClick={() => setIsProfileOpen(true)}
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
        <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        <ProfileDrawer isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        <CategoryOverlay isOpen={isCategoryOverlayOpen} onClose={() => setIsCategoryOverlayOpen(false)} />
        <PurchasePopup 
          isOpen={isPurchaseOpen} 
          onClose={() => setIsPurchaseOpen(false)} 
          cartItems={purchaseItems} 
        />
      </div>
    </BrowserRouter>
  );
}


