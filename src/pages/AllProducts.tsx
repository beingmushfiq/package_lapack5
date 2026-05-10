import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories, useBrands } from "../lib/queries";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { Filter, SlidersHorizontal, ChevronDown, X, Grid, List, Search as SearchIcon, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface AllProductsProps {
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
}

export default function AllProducts({ onAddToCart, onToggleWishlist, wishlistItems = [] }: AllProductsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const collection = searchParams.get('collection') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const sort = searchParams.get('sort') || 'newest';

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: productsResult, isLoading } = useProducts(categorySlug, search, collection);
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  
  const products = productsResult?.data || [];
  const topCategories = categories?.filter((c: any) => !c.parent_id) || [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const ActiveFilters = () => {
    const filters = [];
    if (categorySlug) filters.push({ key: 'category', value: categorySlug });
    if (search) filters.push({ key: 'search', value: search });
    if (collection) filters.push({ key: 'collection', value: collection });
    if (brand) filters.push({ key: 'brand', value: brand });

    if (filters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.delete(f.key);
              setSearchParams(params);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-all"
          >
            {f.key}: {f.value}
            <X className="w-3 h-3" />
          </button>
        ))}
        <button 
          onClick={clearFilters}
          className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors ml-2"
        >
          Clear All
        </button>
      </div>
    );
  };

  const Sidebar = () => (
    <aside className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-emerald-600" />
          Categories
        </h3>
        <div className="space-y-1.5">
          {topCategories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('category', cat.slug);
                setSearchParams(params);
                setIsFilterDrawerOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all",
                categorySlug === cat.slug ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-gray-500 hover:bg-gray-100"
              )}
            >
              {cat.name}
              <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md", categorySlug === cat.slug ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400")}>
                {cat.products_count || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands && brands.length > 0 && (
        <div>
          <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Brands</h3>
          <div className="grid grid-cols-2 gap-2">
            {brands.slice(0, 8).map((b: any) => (
              <button
                key={b.id}
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set('brand', b.slug);
                  setSearchParams(params);
                  setIsFilterDrawerOpen(false);
                }}
                className={cn(
                  "p-2 border rounded-xl flex items-center justify-center transition-all",
                  brand === b.slug ? "border-emerald-500 bg-emerald-50" : "border-gray-100 hover:border-emerald-200"
                )}
              >
                {b.logo ? (
                  <img src={b.logo} alt={b.name} className="h-6 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all" />
                ) : (
                  <span className="text-[10px] font-bold text-gray-500">{b.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Placeholder */}
      <div>
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-6">Price Range</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input type="number" placeholder="Min" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
            <div className="flex-1">
              <input type="number" placeholder="Max" className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" />
            </div>
          </div>
          <button className="w-full py-2 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
            Apply
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 sm:pb-12">
      {/* Header / Toolbar */}
      <div className="bg-white border-b border-gray-100 sticky top-[72px] sm:top-[80px] z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 border border-gray-100"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>
            <h1 className="hidden sm:block text-sm font-black text-gray-900 uppercase tracking-widest">
              {search ? `Results for "${search}"` : categorySlug ? categorySlug.replace(/-/g, ' ') : collection || 'All Products'}
              <span className="ml-2 text-gray-400 font-bold text-[10px]">({products.length} Items)</span>
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 p-1 bg-gray-50 rounded-lg border border-gray-100">
              <button 
                onClick={() => setViewMode('grid')}
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'grid' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={cn("p-1.5 rounded-md transition-all", viewMode === 'list' ? "bg-white text-emerald-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <div className="relative group">
              <select 
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-50 border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-[10px] font-black uppercase tracking-widest text-gray-600 outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="trending">Trending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform group-hover:translate-y-[-40%]" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </div>

          {/* Main Grid */}
          <div className="flex-1">
            <ActiveFilters />

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                "grid gap-4 sm:gap-6",
                viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              )}>
                {products.map((product: any, idx: number) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.4) }}
                  >
                    <ProductCard 
                      product={product} 
                      onAddToCart={onAddToCart} 
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlistItems.some((item: any) => item.id === product.id)}
                      layout={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <SearchIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">No Products Found</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Try adjusting your filters or search terms</p>
                <button 
                  onClick={clearFilters}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filters</h2>
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <Sidebar />
              </div>
              <div className="p-6 border-t border-gray-100">
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Show {products.length} Items
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
