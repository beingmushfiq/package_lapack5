import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../lib/utils";
import HeroBanner from "../components/HeroBanner";
import CategorySidebar from "../components/CategorySidebar";
import CategoryList from "../components/CategoryList";
import ProductGrid from "../components/ProductGrid";
import BlogSection from "../components/BlogSection";
import BrandsSection from "../components/BrandsSection";
import ClientReviews from "../components/ClientReviews";
import FAQSection from "../components/FAQSection";
import Newsletter from "../components/Newsletter";
import { useSiteSettings } from "../lib/queries";

interface HomeProps {
  onCategorySeeMore: () => void;
  onAddToCart: (product: any) => void;
  onToggleWishlist: (product: any) => void;
  wishlistItems: any[];
}

export default function Home({ onCategorySeeMore, onAddToCart, onToggleWishlist, wishlistItems }: HomeProps) {
  const navigate = useNavigate();
  const { data: settingsResult } = useSiteSettings();
  const settings = settingsResult?.data || {};
  
  const promo1 = settings.promo_banner_1 || "https://picsum.photos/seed/promo1/800/400";
  const promo2 = settings.promo_banner_2 || "https://picsum.photos/seed/promo2/800/400";
  const promoLink1 = settings.promo_link_1 || "/flash-deal";
  const promoLink2 = settings.promo_link_2 || "/flash-deal";

  return (
    <main className="pb-[8px]">
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-start gap-4 lg:gap-6">
          <CategorySidebar onViewAll={onCategorySeeMore} />
          <div className="flex-1 min-w-0">
            <HeroBanner />
          </div>
        </div>
      </section>
      
      <div className="space-y-2 sm:space-y-4">
        <CategoryList onSeeMoreClick={onCategorySeeMore} />

        {/* Dual Promotional Banners - Side by Side */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Banner 1 */}
            <div 
              onClick={() => navigate(promoLink1)}
              className="relative h-24 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
            >
              <img
                src={getImageUrl(promo1)}
                alt="Promotion 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Banner 2 */}
            <div 
              onClick={() => navigate(promoLink2)}
              className="relative h-24 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
            >
              <img
                src={getImageUrl(promo2)}
                alt="Promotion 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        <ProductGrid title="Trending" highlightWord="Now" collection="trending" onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlistItems={wishlistItems} />
        <ProductGrid title="Daily" highlightWord="Offer" collection="daily_offer" onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlistItems={wishlistItems} />
        <ProductGrid title="Best" highlightWord="Deals" collection="best_deals" onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlistItems={wishlistItems} />
        <ProductGrid title="Top" highlightWord="Sale" collection="top_sale" onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlistItems={wishlistItems} />
        <ProductGrid title="New" highlightWord="Arrivals" collection="new_arrivals" onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} wishlistItems={wishlistItems} />
        
        <BlogSection />
        <BrandsSection />
        <ClientReviews />
        <FAQSection />
        <Newsletter />
      </div>
    </main>
  );
}
