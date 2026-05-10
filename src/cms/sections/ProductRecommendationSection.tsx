// ProductRecommendationSection — CMS-driven cross-sell/upsell block
import { useProducts } from '../../lib/queries';
import ProductCard from '../../components/ProductCard';
import type { CMSSectionProps } from '../types';
import { resolveStyles } from '../StyleEngine';

export default function ProductRecommendationSection({ 
  section, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistItems 
}: CMSSectionProps) {
  const logic = section.components?.logic || 'trending'; // trending, related, best_selling
  const limit = section.components?.limit || 4;
  const title = section.title || 'You May Also Like';
  
  // Reuse existing product query logic
  const { data: products, isLoading } = useProducts(undefined, undefined, logic);
  
  const styles = resolveStyles(section.styles);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) return null;

  return (
    <section className="py-8" style={styles}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, limit).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart || (() => {})}
              onToggleWishlist={onToggleWishlist || (() => {})}
              isWishlisted={wishlistItems?.some(item => item.id === product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
