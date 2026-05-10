import { Star, ShoppingCart, Heart, Share2, CheckCircle2, Copy, Check } from "lucide-react";
import { Product } from "../types";
import { formatPrice, cn, getImageUrl } from "../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ProductCardProps {
  product: Product | any;
  onAddToCart?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  isWishlisted?: boolean;
  layout?: 'grid' | 'list';
  onOrderNow?: (product: any) => void;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, onOrderNow, isWishlisted, layout = 'grid' }: ProductCardProps) {
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const slug = product.slug || product.name?.toLowerCase().replace(/ /g, '-');
  const productUrl = `/productdetails/${slug}`;

  const handleProductClick = () => {
    navigate(productUrl);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = product.slug || product.name.toLowerCase().replace(/ /g, '-');
    const url = `${window.location.origin}/productdetails/${slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on AmarShop!`,
          url: url,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const slug = product.slug || product.name.toLowerCase().replace(/ /g, '-');
    const url = `${window.location.origin}/productdetails/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
      setIsShareModalOpen(false);
    }, 2000);
  };

  if (layout === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        onClick={handleProductClick}
        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl shadow-sm cursor-pointer flex flex-col sm:flex-row h-auto sm:h-48"
      >
        <div className="relative w-full sm:w-48 h-48 sm:h-full overflow-hidden bg-gray-50 flex-shrink-0">
          <img
            src={getImageUrl(product.image || (product.images && product.images[0]))}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          {product.discount_price && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#ff4d4d] text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg">
                -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight line-clamp-1">
                {product.name}
              </h3>
              <div className="flex gap-2 ml-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    isWishlisted 
                      ? "bg-pink-50 text-pink-500" 
                      : "bg-gray-50 text-gray-400 hover:text-pink-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-50 text-gray-400 hover:text-emerald-600 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
               <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-gray-900">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <span className="text-xs text-gray-400 line-through font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-[10px] font-black text-gray-400 uppercase">({product.rating || "5.0"})</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 line-clamp-2 mb-4 hidden sm:block font-medium">
              {product.short_description || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 150) || 'Premium quality product available at AmarShop.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); navigate('/contact'); }}
              className="px-6 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all"
            >
              Inquire
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl shadow-sm h-full flex flex-col"
    >
      <div className="relative cursor-pointer" onClick={handleProductClick}>
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(product.image || (product.images && product.images[0]))}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        
        {product.discount_price && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#ff4d4d] text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg">
              -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
            className={cn(
              "p-2 rounded-full backdrop-blur-md shadow-lg transition-all",
              isWishlisted 
                ? "bg-pink-500 text-white" 
                : "bg-white/90 text-gray-600 hover:text-pink-500"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", isWishlisted && "fill-current")} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 backdrop-blur-md text-gray-600 hover:text-emerald-600 shadow-lg transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <h3 className="text-[11px] sm:text-[13px] font-black text-gray-900 leading-tight mb-2 line-clamp-2 h-7 sm:h-9 uppercase tracking-tight">
          {product.name}
        </h3>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-lg font-black text-gray-900">
                {formatPrice(product.discount_price || product.price)}
              </span>
              {product.discount_price && (
                <span className="text-[8px] sm:text-[10px] text-gray-400 line-through font-bold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 sm:w-3 h-3 text-yellow-400 fill-current" />
              <span>{product.rating || "5.0"}</span>
            </div>
            <span>{product.sold_count || "0"} Sold</span>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 text-gray-900 hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-gray-100"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (onOrderNow) {
                  onOrderNow(product);
                } else {
                  handleProductClick();
                }
              }}
              className="flex-1 rounded-xl bg-gray-900 text-white font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              Order Now
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Share Modal Backdrop */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
            >
              <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Share Product</h4>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-6">Copy link to share with friends</p>
              
              <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                <input 
                  readOnly 
                  value={`${window.location.origin}/productdetails/${product.slug || product.name.toLowerCase().replace(/ /g, '-')}`}
                  className="flex-1 bg-transparent px-3 text-[10px] font-bold text-gray-500 outline-none overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <button 
                  onClick={copyLink}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    copied ? "bg-emerald-500 text-white" : "bg-white text-gray-900 shadow-sm"
                  )}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="w-full mt-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
