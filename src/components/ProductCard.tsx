import { Star, ShoppingCart, Heart, Share2, CheckCircle2 } from "lucide-react";
import { Product } from "../types";
import { formatPrice, cn, getImageUrl } from "../lib/utils";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product | any;
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const navigate = useNavigate();

  const handleProductClick = () => {
    const slug = product.slug || product.name.toLowerCase().replace(/ /g, '-');
    navigate(`/productdetails/${slug}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={handleProductClick}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#ff4d4d] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-lg">
              -{product.discount}%
            </span>
          </div>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
            className={cn(
              "p-2 rounded-full backdrop-blur-sm shadow-md transition-all",
              isWishlisted 
                ? "bg-pink-500 text-white hover:bg-pink-600" 
                : "bg-white/90 text-gray-600 hover:bg-white hover:text-pink-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); alert("Sharing coming soon!"); }}
            className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-emerald-600 shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3">
        <h3 className="text-[11px] sm:text-base font-bold text-gray-900 leading-tight line-clamp-2 h-7 sm:h-10">
          {product.name}
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span className="text-sm sm:text-xl font-extrabold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[9px] sm:text-sm text-gray-400 line-through font-medium">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-[9px] sm:text-xs font-semibold">
          <div className="flex items-center gap-0.5 sm:gap-1">
            <Star className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-yellow-400 fill-current" />
            <span className="text-gray-400">({product.rating})</span>
          </div>
          <span className="text-gray-500">{product.soldCount || "0"} Sold</span>
        </div>
        
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 pt-0.5 sm:pt-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="flex items-center justify-center py-1.5 sm:py-2.5 rounded-lg bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
            className="py-1.5 sm:py-2.5 rounded-lg bg-[#1a1a1a] text-white font-bold text-[9px] sm:text-sm hover:bg-black transition-all active:scale-95"
          >
            Order Now
          </button>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); navigate('/contact'); }}
          className="w-full py-1 sm:py-2 rounded-lg border-2 border-dashed border-gray-200 text-gray-500 font-bold text-[9px] sm:text-sm hover:border-emerald-600 hover:text-emerald-600 transition-all active:scale-95"
        >
          Inquire
        </button>
      </div>
    </motion.div>
  );
}
