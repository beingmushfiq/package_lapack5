import { useSearchParams } from "react-router-dom";
import { useProducts } from "../lib/queries";
import { useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";

interface AllProductsProps {
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
}

export default function AllProducts({ onAddToCart, onToggleWishlist, wishlistItems = [] }: AllProductsProps) {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const collection = searchParams.get('collection') || undefined;

  const { data: productsResult, isLoading } = useProducts(categorySlug, search, collection);
  const products = productsResult?.data || [];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 sm:pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
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
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
