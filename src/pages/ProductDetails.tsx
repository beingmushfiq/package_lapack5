import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { 
  Star, ShoppingCart, Heart, Share2, ChevronLeft, ShieldCheck, Truck, RotateCcw, 
  Facebook, Twitter, Instagram, Linkedin, MessageCircle, Play, Info, HelpCircle, 
  MessageSquare, FileText, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "../lib/utils";
import { useEffect, useState, useRef } from "react";
import { useProduct, useProducts } from "../lib/queries";
import { toast } from "react-hot-toast";
import { ProductSchema, BreadcrumbSchema } from "../components/StructuredData";
import { cn } from "../lib/utils";
import { trackFBEvent, trackGTMEvent } from "../lib/tracking";

export default function ProductDetails({ 
  onAddToCart, 
  onOrderNow,
  onToggleWishlist,
  wishlistItems
}: { 
  onAddToCart?: (product: any) => void,
  onOrderNow?: (product: any) => void,
  onToggleWishlist?: (product: any) => void,
  wishlistItems?: any[]
}) {
  const { productName } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const sliderInterval = useRef<any>(null);

  // Fetch product by slug
  const { data: productResponse, isLoading } = useProduct(productName || '');
  const product = productResponse;

  // Fetch related products
  const { data: relatedResponse } = useProducts(product?.category?.slug);
  const relatedProducts = relatedResponse?.data || [];

  const rawImages = product ? (product.images?.length > 0 ? product.images : [product.image]) : [];
  const images = rawImages.map((img: any) => {
    const path = typeof img === 'string' ? img : (img?.image_url || img);
    return getImageUrl(path);
  }).filter(Boolean);

  useEffect(() => {
    if (product) {
      trackFBEvent('ViewContent', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        value: product.discount_price || product.price,
        currency: 'BDT'
      });

      trackGTMEvent('view_item', {
        currency: 'BDT',
        value: product.discount_price || product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.discount_price || product.price,
            quantity: 1
          }
        ]
      });
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Automated Slider
    if (images.length > 1) {
      sliderInterval.current = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      }, 4000);
    }

    return () => {
      if (sliderInterval.current) clearInterval(sliderInterval.current);
    };
  }, [images.length]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-black text-gray-900 mb-4 uppercase tracking-tight">Product Not Found</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 sm:pb-10">
      {/* SEO Structured Data */}
      <ProductSchema product={product} />
      <BreadcrumbSchema items={[
        { name: "Home", url: window.location.origin },
        ...(product.category ? [{ name: product.category.name, url: `${window.location.origin}/allproducts?category=${product.category.slug}` }] : []),
        { name: product.name, url: `${window.location.origin}/productdetails/${product.slug}` },
      ]} />
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Left: Image Gallery & Slider */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>

              {product.discount_price && (
                <div className="absolute top-3 left-3 bg-[#ff4d4d] text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg">
                  -{Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_: any, i: number) => (
                    <button 
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${activeImageIndex === i ? 'bg-emerald-600 w-4' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${activeImageIndex === i ? 'border-emerald-500 scale-95' : 'border-gray-100 opacity-60'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                    {product.category?.name || product.category || 'Product'}
                  </span>
                  {product.is_featured && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest">
                      Featured
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => onToggleWishlist?.(product)}
                  className={cn(
                    "p-1.5 transition-colors",
                    wishlistItems?.some((item: any) => item.id === product.id)
                      ? "text-pink-500" 
                      : "text-gray-400 hover:text-pink-500"
                  )}
                >
                  <Heart className={cn("w-4 h-4", wishlistItems?.some((item: any) => item.id === product.id) && "fill-current")} />
                </button>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    (4.5) 24 Reviews
                  </span>
                </div>
                <div className="h-3 w-[1px] bg-gray-200" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  125 Sold
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xl sm:text-2xl font-black text-gray-900">
                  {formatPrice(product.discount_price || product.price)}
                </span>
                {product.discount_price && (
                  <span className="text-xs text-gray-400 line-through font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed mb-5 font-medium" dangerouslySetInnerHTML={{ __html: product.short_description || product.description || '' }}>
              </p>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  -
                </button>
                <span className="w-8 text-center text-[11px] font-black">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  +
                </button>
              </div>
              <button 
                onClick={() => {
                  if (onAddToCart) {
                    onAddToCart({
                      ...product,
                      image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
                      quantity
                    });
                    toast.success('Added to cart!');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mb-6">
              <button 
                onClick={() => {
                  if (onOrderNow) {
                    onOrderNow({
                      ...product,
                      image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
                      quantity
                    });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Order Now
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Inquiry Now
              </button>

              {/* YouTube Video Preview */}
              {product.youtube_url && (
                <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                  <iframe 
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${product.youtube_url.split('v=')[1]}`} 
                    title="Product Preview Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Social Share Icons */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Share:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out ${product.name} on AmarShop!`;
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out ${product.name} on AmarShop!`;
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    const url = window.location.href;
                    const text = `Check out ${product.name} on AmarShop!`;
                    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Trust Badges - Smaller */}
            <div className="grid grid-cols-3 gap-1 py-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Secure</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center border-x border-gray-100">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <RotateCcw className="w-3.5 h-3.5 text-orange-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">7 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="mt-12 border-t border-gray-100 pt-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-10 border-b border-gray-100 mb-8">
            {[
              { id: 'description', label: 'Description', icon: FileText },
              { id: 'specification', label: 'Specification', icon: Info },
              { id: 'questions', label: 'Questions', icon: HelpCircle },
              { id: 'comments', label: 'Comments', icon: MessageSquare },
              { id: 'reviews', label: 'Reviews', icon: Star },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <tab.icon className={cn("w-3.5 h-3.5", activeTab === tab.id ? "text-emerald-600" : "text-gray-400")} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-4xl"
              >
                {activeTab === 'description' && (
                  <div className="prose prose-sm sm:prose-base prose-emerald max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '' }}>
                  </div>
                )}
                {activeTab === 'specification' && (
                  <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                    {product.specifications && product.specifications.length > 0 ? (
                      <div className="grid grid-cols-1 divide-y divide-gray-200/50">
                        {product.specifications.map((spec: any, i: number) => (
                          <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{spec.key}</span>
                            <span className="text-xs sm:text-sm font-bold text-gray-900">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Info className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No specifications provided.</p>
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'questions' && (
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                    <HelpCircle className="w-12 h-12 text-emerald-100 mx-auto mb-6" />
                    <h4 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Have a question?</h4>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Our support team is here to help you 24/7</p>
                    <button 
                      onClick={() => navigate('/contact')}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Support
                    </button>
                  </div>
                )}
                {activeTab === 'comments' && (
                  <div className="space-y-8">
                    <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Leave a comment</h4>
                      <textarea 
                        placeholder="Write your thoughts here..."
                        className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/30 transition-all font-medium"
                        rows={4}
                      />
                      <button 
                        onClick={() => toast.success("Comment submitted for review!")}
                        className="mt-4 px-8 py-3 bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-black transition-all"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-10">
                    <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-50 rounded-3xl p-8 sm:p-10">
                      <div className="text-center sm:text-left">
                        <div className="text-5xl font-black text-gray-900 mb-2">4.5</div>
                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />)}
                        </div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Based on 24 reviews</div>
                      </div>
                      <div className="h-px w-full sm:h-16 sm:w-px bg-gray-200" />
                      <div className="flex-1 w-full space-y-2">
                        {[5, 4, 3, 2, 1].map(star => (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 w-3">{star}</span>
                            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${star === 5 ? 80 : star === 4 ? 15 : 2}%` }}
                                className="h-full bg-emerald-500" 
                              />
                            </div>
                            <span className="text-[10px] font-black text-gray-400 w-8">{star === 5 ? 80 : star === 4 ? 15 : 2}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <button 
                        onClick={() => toast.error("Please login to write a review.")}
                        className="px-10 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-900 font-black text-[10px] uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all"
                      >
                        Write a Review
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-24">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">Related Products</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">You might also like these items</p>
              </div>
              <div className="h-[1px] flex-1 bg-gray-100 mx-8 hidden sm:block" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
              {relatedProducts
                .filter((p: any) => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct: any, idx: number) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  >
                    <ProductCard 
                      product={relatedProduct} 
                      onAddToCart={onAddToCart} 
                      onToggleWishlist={onToggleWishlist}
                      isWishlisted={wishlistItems?.some((item: any) => item.id === relatedProduct.id)}
                    />
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
