import { Search, ShoppingCart, User, Menu, Heart, Phone, Globe, X, ChevronRight, ShoppingBag, Smartphone, Home, Utensils, Baby, Tv, Watch, Truck } from "lucide-react";
import { useState } from "react";
import { cn, formatPrice } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { useCategories, useMenus, useSiteSettings } from "../lib/queries";

export default function Navbar({ onCartClick, onWishlistClick, onProfileClick, cartCount = 0, cartTotal = 0 }: { onCartClick?: () => void, onWishlistClick?: () => void, onProfileClick?: () => void, cartCount?: number, cartTotal?: number }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState<string | null>(null);
    const navigate = useNavigate();
  const { data: apiCategories } = useCategories();
  const { data: menus } = useMenus();
  const { data: settings } = useSiteSettings();

  const categoryTree = apiCategories?.data || [];
  const topCategories = categoryTree.slice(0, 10);
  const categoriesList = ["All Categories", ...topCategories.map((c: any) => c.name)];

  const sitePhone = settings?.site_phone || "+880 1234 567890";

  const handleSearch = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      if (selectedCategory !== "All Categories") {
        const cat = topCategories.find((c: any) => c.name === selectedCategory);
        if (cat) params.set('category', cat.slug);
      }
      navigate(`/allproducts?${params.toString()}`);
      setIsSearchFocused(false);
    }
  };

  const mobileNavLinks = menus?.header || [
    { name: "Home", url: "/" },
    { name: "Flash Deal", url: "/flash-deal" },
    { name: "All Products", url: "/allproducts" },
    { name: "Seller Shop", url: "/seller-shop" },
    { name: "Compare", url: "/compare" },
    { name: "Blogs", url: "/blogs" },
    { name: "Contact Us", url: "/contact" },
  ];

  return (
    <>
      {/* Top Announcement Bar - Not sticky, hidden on mobile */}
      <div className="hidden md:block bg-gray-900 text-white py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-[9px] sm:text-[10px] font-black tracking-[0.1em] uppercase">
          <div className="flex items-center gap-3 sm:gap-6">
            <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <Phone className="w-2.5 h-2.5 text-emerald-400" />
              {sitePhone}
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <Globe className="w-2.5 h-2.5 text-emerald-400" />
              Free Shipping over ৳1000
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-4 text-gray-400">
              <Link to="/track-order" className="hover:text-white transition-colors">Track Order</Link>
              <Link to="/help-center" className="hover:text-white transition-colors">Help Center</Link>
            </div>
            <div className="hidden sm:block h-2.5 w-[1px] bg-white/10" />
            <button 
              onClick={() => navigate('/track-order')}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-black"
            >
              BN
            </button>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50">
        {/* Main Navbar */}
        <nav className="bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20 gap-4 sm:gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt={settings.site_name} className="h-8 sm:h-12 w-auto object-contain" />
              ) : (
                <span className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter">
                  {(settings?.site_name || "AmarShop").split(' ')[0]}<span className="text-emerald-600">{(settings?.site_name || "AmarShop").split(' ')[1] || ""}</span>
                </span>
              )}
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <form 
                onSubmit={handleSearch}
                className="flex items-center w-full bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-500/30 transition-all shadow-sm"
              >
                {/* Custom Category Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex items-center gap-2 px-6 border-r border-gray-200 bg-gray-50/50 h-12 text-[10px] font-black text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap uppercase tracking-widest"
                  >
                    {selectedCategory}
                    <ChevronRight className={cn("w-3 h-3 transition-transform", isCategoryDropdownOpen ? "rotate-90" : "rotate-0")} />
                  </button>
                  
                  <AnimatePresence>
                    {isCategoryDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-[60] overflow-hidden"
                      >
                        <div className="max-h-80 overflow-y-auto no-scrollbar">
                          {categoriesList.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(cat);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className={cn(
                                "w-full text-left px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors",
                                selectedCategory === cat ? "text-emerald-600 bg-emerald-50" : "text-gray-500 hover:bg-gray-50"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, categories..."
                    className="w-full bg-transparent py-3 pl-5 pr-10 text-sm outline-none text-gray-900 font-bold placeholder:text-gray-300"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button 
                  type="submit"
                  className="bg-gray-900 text-white px-8 h-12 hover:bg-black transition-all flex items-center gap-2 group shadow-lg shadow-gray-200"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden lg:inline text-[10px] font-black uppercase tracking-[0.2em]">Search</span>
                </button>
              </form>
              
              {/* Quick Search Suggestions */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 p-8 z-50"
                  >
                    <div className="grid grid-cols-2 gap-10">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Trending Searches</p>
                        <div className="flex flex-wrap gap-2">
                          {['Mustard Oil', 'Organic Honey', 'Premium Dates', 'Cashew Nuts', 'Saffron', 'Ghee'].map(tag => (
                            <button 
                              key={tag} 
                              onClick={() => {
                                setSearchQuery(tag);
                                navigate(`/allproducts?search=${tag}`);
                              }}
                              className="px-4 py-2 rounded-xl bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20 transition-all border border-gray-100"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="border-l border-gray-100 pl-10">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-5">Quick Categories</p>
                        <div className="grid grid-cols-1 gap-3">
                          {topCategories.slice(0, 4).map((cat: any) => (
                            <button 
                              key={cat.id}
                              onClick={() => navigate(`/allproducts?category=${cat.slug}`)}
                              className="flex items-center gap-3 group text-left"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                                {cat.image ? <img src={cat.image} className="w-6 h-6 object-contain" /> : <ShoppingBag className="w-4 h-4 text-gray-400" />}
                              </div>
                              <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-emerald-600 transition-colors">{cat.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={onWishlistClick}
                className="group flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-600 transition-all"
              >
                <div className="relative">
                  <Heart className="w-6 h-6 transition-transform group-hover:scale-110" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Wishlist</span>
              </button>
              
              <button 
                onClick={onProfileClick}
                className="group flex flex-col items-center gap-1 text-gray-500 hover:text-emerald-600 transition-all"
              >
                <User className="w-6 h-6 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Account</span>
              </button>
              
              <button 
                onClick={onCartClick}
                className="group relative flex flex-col items-center gap-1 text-gray-900 hover:text-emerald-600 transition-all"
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 transition-transform group-hover:scale-110" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{formatPrice(cartTotal)}</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1">
              <button 
                onClick={() => navigate('/track-order')}
                aria-label="Track Order"
                className="p-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Truck className="w-5 h-5" />
              </button>
              <a 
                href="tel:+8801234567890"
                aria-label="Call Us"
                className="p-2 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Toggle Menu"
                className="text-gray-900 p-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Dedicated Row */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-[#0056b3]/10 focus-within:border-[#0056b3]/30 transition-all shadow-sm">
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full bg-transparent py-2 pl-10 pr-10 text-sm outline-none text-gray-900 placeholder:text-gray-400"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button className="bg-[#0056b3] text-white px-4 py-2.5 hover:bg-[#004494] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <span className="text-lg font-black text-gray-900 tracking-tighter">
                  {(settings?.site_name || "AmarShop").split(' ')[0]}<span className="text-emerald-600">{(settings?.site_name || "AmarShop").split(' ')[1] || ""}</span>
                </span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs for Menu and Categories */}
              <div className="flex p-1.5 bg-gray-50/50 mx-4 mt-4 rounded-xl border border-gray-100">
                <button
                  onClick={() => setActiveTab('menu')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                    activeTab === 'menu' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Menu
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg",
                    activeTab === 'categories' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Categories
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                {activeTab === 'menu' ? (
                  <div className="space-y-0.5">
                    {mobileNavLinks.map((link: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => {
                          navigate(link.url || link.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all"
                      >
                        {link.name || link.title || link.label}
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      </button>
                    ))}
                    <div className="pt-4 mt-2 border-t border-gray-50">
                      <p className="px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Account</p>
                      {['Profile', 'Orders', 'Wishlist'].map(item => (
                        <button 
                          key={item} 
                          onClick={() => {
                            if (item === 'Wishlist') {
                              onWishlistClick?.();
                              setIsMobileMenuOpen(false);
                            } else if (item === 'Profile') {
                              onProfileClick?.();
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          className="flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold text-gray-700 hover:text-emerald-600 hover:bg-emerald-50/50 rounded-lg transition-all"
                        >
                          {item}
                          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {categoryTree.map((cat: any) => (
                      <div key={cat.id} className="space-y-0.5">
                        <button
                          onClick={() => setExpandedCategory(expandedCategory === cat.name ? null : cat.name)}
                          className={cn(
                            "flex items-center justify-between w-full py-2.5 px-2 text-xs font-bold rounded-lg transition-all",
                            expandedCategory === cat.name ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-50"
                          )}
                        >
                          <span className="flex items-center gap-2.5">
                            {cat.icon_class ? <i className={cat.icon_class}></i> : <ShoppingBag className={cn("w-3.5 h-3.5", expandedCategory === cat.name ? "text-emerald-600" : "text-gray-400")} />}
                            {cat.name}
                          </span>
                          {cat.children && cat.children.length > 0 && (
                            <ChevronRight className={cn("w-3.5 h-3.5 transition-transform duration-200", expandedCategory === cat.name && "rotate-90")} />
                          )}
                        </button>

                        {/* Sub Categories Accordion */}
                        <AnimatePresence>
                          {cat.children && cat.children.length > 0 && expandedCategory === cat.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-4 pl-2 border-l border-emerald-100 space-y-0.5"
                            >
                              {cat.children.map((sub: any) => (
                                <div key={sub.id}>
                                  <button
                                    onClick={(e) => {
                                      if (sub.children && sub.children.length > 0) {
                                        setExpandedSubCategory(expandedSubCategory === sub.name ? null : sub.name);
                                      } else {
                                        navigate(`/category/${sub.slug}`);
                                        setIsMobileMenuOpen(false);
                                      }
                                    }}
                                    className={cn(
                                      "flex items-center justify-between w-full py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                                      expandedSubCategory === sub.name ? "text-emerald-600" : "text-gray-500"
                                    )}
                                  >
                                    {sub.name}
                                    {sub.children && sub.children.length > 0 && (
                                      <ChevronRight className={cn("w-3 h-3 transition-transform duration-200", expandedSubCategory === sub.name && "rotate-90")} />
                                    )}
                                  </button>

                                  {/* Child Categories Accordion */}
                                  <AnimatePresence>
                                    {sub.children && sub.children.length > 0 && expandedSubCategory === sub.name && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden pb-2 space-y-0.5"
                                      >
                                        {sub.children.map((child: any) => (
                                          <button
                                            key={child.id}
                                            onClick={() => {
                                              navigate(`/category/${child.slug}`);
                                              setIsMobileMenuOpen(false);
                                            }}
                                            className="block py-1.5 pl-2 text-[11px] font-bold text-gray-400 hover:text-emerald-600 transition-colors w-full text-left"
                                          >
                                            {child.name}
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    onProfileClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg shadow-emerald-500/10 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
    </>
  );
}



