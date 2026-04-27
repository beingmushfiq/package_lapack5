import { useRef } from "react";
import { useProducts } from "../lib/queries";
import ProductCard from "./ProductCard";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductGridProps {
  title: string;
  highlightWord: string;
  collection?: string;
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
}

export default function ProductGrid({ title, highlightWord, collection, onAddToCart, onToggleWishlist, wishlistItems = [] }: ProductGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { data: productsResult, isLoading } = useProducts(undefined, undefined, collection);
  
  // The API returns paginated data inside productsResult.data usually
  const products = productsResult?.data || [];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-4 sm:py-6 bg-gray-50/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
           <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="min-w-[calc(50%-0.5rem)] sm:min-w-[calc(33.33%-1rem)] lg:min-w-[calc(20%-1rem)] h-64 bg-gray-200 animate-pulse rounded-2xl"></div>
             ))}
           </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 sm:py-6 bg-gray-50/50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter">
            {title} <span className="text-emerald-600">{highlightWord}</span>
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button 
                onClick={() => scroll("left")}
                className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={() => scroll("right")}
                className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/allproducts')}
              className="group relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/10 overflow-hidden"
            >
              <span className="relative z-10">See More</span>
              <ChevronRight className="w-2.5 h-2.5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12"
              />
            </motion.button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 lg:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {products.map((product: any, idx: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="min-w-[calc(50%-0.5rem)] sm:min-w-[calc(33.33%-1rem)] lg:min-w-[calc(20%-1rem)] snap-start"
            >
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart} 
                onToggleWishlist={onToggleWishlist}
                isWishlisted={wishlistItems.some((item: any) => item.id === product.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

