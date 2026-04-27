import { Store } from "lucide-react";

export default function SellerShop() {
  return (
    <div className="min-h-screen bg-gray-50/30 pb-20 sm:pb-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center py-20">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest mb-2">Seller Shop</h1>
          <p className="text-gray-500 font-bold">Discover verified sellers and brands.</p>
        </div>
      </div>
    </div>
  );
}
