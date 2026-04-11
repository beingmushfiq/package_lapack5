import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../data/mockData";
import ProductCard from "../components/ProductCard";
import { 
  Star, ShoppingCart, Heart, Share2, ChevronLeft, ShieldCheck, Truck, RotateCcw, 
  Facebook, Twitter, Instagram, Linkedin, MessageCircle, Play, Info, HelpCircle, 
  MessageSquare, FileText, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "../lib/utils";
import { useEffect, useState, useRef } from "react";

export default function ProductDetails({ 
  onAddToCart, 
  onOrderNow 
}: { 
  onAddToCart?: (productId: string) => void,
  onOrderNow?: (productId: string) => void
}) {
  const { productName } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const sliderInterval = useRef<NodeJS.Timeout | null>(null);

  // Find product by slugified name or name
  const product = PRODUCTS.find(p => 
    p.name.toLowerCase().replace(/ /g, '-') === productName || 
    p.name === productName
  );

  const images = product ? [product.image, "https://picsum.photos/seed/p1/600/800", "https://picsum.photos/seed/p2/600/800", "https://picsum.photos/seed/p3/600/800"] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Automated Slider
    sliderInterval.current = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => {
      if (sliderInterval.current) clearInterval(sliderInterval.current);
    };
  }, [images.length]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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

              {product.discount && (
                <div className="absolute top-3 left-3 bg-[#ff4d4d] text-white text-[9px] font-black px-2 py-1 rounded-md shadow-lg">
                  -{product.discount}% OFF
                </div>
              )}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${activeImageIndex === i ? 'bg-emerald-600 w-4' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all ${activeImageIndex === i ? 'border-emerald-500 scale-95' : 'border-gray-100 opacity-60'}`}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                    {product.category}
                  </span>
                  {product.isNew && (
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest">
                      New
                    </span>
                  )}
                </div>
                <button className="p-1.5 text-gray-400 hover:text-pink-500 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <h1 className="text-lg sm:text-xl font-black text-gray-900 leading-tight mb-2 tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    ({product.rating}) {product.reviews} Reviews
                  </span>
                </div>
                <div className="h-3 w-[1px] bg-gray-200" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                  {product.soldCount} Sold
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-xl sm:text-2xl font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through font-bold">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed mb-5 font-medium">
                Premium quality {product.name} with elegant design and superior comfort. Perfect for any occasion.
              </p>
            </div>

            {/* Selection Options - Dropdowns */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Color</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option>Midnight Black</option>
                  <option>Ocean Blue</option>
                  <option>Forest Green</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Size</label>
                <select className="w-full bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[11px] font-bold outline-none focus:ring-2 focus:ring-emerald-500/20">
                  <option>Small (S)</option>
                  <option>Medium (M)</option>
                  <option>Large (L)</option>
                  <option>Extra Large (XL)</option>
                </select>
              </div>
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
                onClick={() => onAddToCart?.(product.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 text-gray-900 font-black text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 mb-6">
              <button 
                onClick={() => onOrderNow?.(product.id)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Order Now
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-emerald-200 hover:text-emerald-600 transition-all active:scale-95">
                <MessageCircle className="w-3.5 h-3.5" />
                Inquiry Now
              </button>

              {/* YouTube Video Preview */}
              <div className="mt-4 aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Product Preview Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </div>

            {/* Social Share Icons */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Share:</span>
              <div className="flex gap-2">
                {[Facebook, Twitter, Instagram, Linkedin, MessageCircle].map((Icon, i) => (
                  <button key={i} className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges - Smaller */}
            <div className="grid grid-cols-3 gap-1 py-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Secure</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center border-x border-gray-100">
                <Truck className="w-3 h-3 text-blue-600" />
                <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Fast</span>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                <RotateCcw className="w-3 h-3 text-orange-600" />
                <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tabs */}
        <div className="mt-10 border-t border-gray-100 pt-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-8 border-b border-gray-100 mb-6">
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
                className={`flex items-center gap-1.5 pb-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs sm:text-sm text-gray-500 leading-relaxed"
              >
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <p>Experience the ultimate in comfort and style with our premium {product.name}. This product is meticulously crafted from high-quality materials to ensure durability and a luxurious feel.</p>
                    <p>Whether you're looking for something for a special occasion or daily wear, this {product.category} item is designed to meet your needs. The attention to detail in the stitching and finish makes it a standout piece in any collection.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Premium grade materials for long-lasting use</li>
                      <li>Ergonomic design for maximum comfort</li>
                      <li>Versatile style that complements various outfits</li>
                      <li>Easy to maintain and clean</li>
                    </ul>
                  </div>
                )}
                {activeTab === 'specification' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Material', value: 'High-quality Synthetic/Cotton' },
                      { label: 'Weight', value: '450g' },
                      { label: 'Dimensions', value: '12 x 8 x 4 inches' },
                      { label: 'Warranty', value: '1 Year Manufacturer Warranty' },
                      { label: 'Origin', value: 'Imported' },
                      { label: 'Care', value: 'Hand wash recommended' },
                    ].map((spec, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-bold text-gray-900">{spec.label}</span>
                        <span>{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'questions' && (
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="font-bold text-gray-900 mb-2">Q: Is this product authentic?</p>
                      <p className="text-gray-500">A: Yes, all our products are 100% authentic and sourced directly from manufacturers.</p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-xl">
                      <p className="font-bold text-gray-900 mb-2">Q: What is the return period?</p>
                      <p className="text-gray-500">A: We offer a 7-day easy return policy for this item.</p>
                    </div>
                    <button className="w-full py-3 rounded-xl bg-gray-50 text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all">
                      Ask a Question
                    </button>
                  </div>
                )}
                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-gray-900 uppercase">User_123</p>
                        <p className="mt-1">Great product, really liked the quality!</p>
                      </div>
                    </div>
                    <textarea 
                      placeholder="Write a comment..."
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs outline-none focus:ring-2 focus:ring-emerald-500/20"
                      rows={3}
                    />
                    <button className="px-6 py-2 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg">
                      Post Comment
                    </button>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                      <div className="text-center">
                        <p className="text-3xl font-black text-emerald-600">{product.rating}</p>
                        <p className="text-[8px] font-black text-emerald-600/60 uppercase">Out of 5</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-[8px] font-bold w-2">{star}</span>
                            <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-400" style={{ width: `${star === 5 ? 80 : star === 4 ? 15 : 5}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="w-full py-3 rounded-xl bg-gray-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                      Write a Review
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16 sm:mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">Related Products</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">You might also like these items</p>
            </div>
            <div className="h-[1px] flex-1 bg-gray-100 mx-8 hidden sm:block" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            {PRODUCTS
              .filter(p => p.id !== product.id)
              .slice(0, 20)
              .map((relatedProduct, idx) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                >
                  <ProductCard product={relatedProduct} onAddToCart={onAddToCart} />
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
