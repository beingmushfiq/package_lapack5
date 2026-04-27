import ProductGrid from "../components/ProductGrid";

export default function FlashDeal({ onAddToCart, onToggleWishlist, wishlistItems }: { onAddToCart?: (product: any) => void, onToggleWishlist?: (product: any) => void, wishlistItems?: any[] }) {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 sm:pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-red-500 rounded-2xl p-8 mb-8 text-center shadow-lg shadow-red-500/20 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-2 relative z-10">
            Flash <span className="text-red-200">Deals</span>
          </h1>
          <p className="text-sm font-bold text-red-100 uppercase tracking-widest relative z-10">
            Hurry Up! Offers end soon.
          </p>
        </div>
        
        <ProductGrid title="Ending" highlightWord="Soon" onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlistItems={wishlistItems} />
      </div>
    </div>
  );
}
