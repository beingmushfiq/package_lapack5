// CMS Section Wrapper: Product Grid
// Reads CMS props (collection, title, highlightWord, limit) and passes to ProductGrid.

import ProductGrid from '../../components/ProductGrid';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function ProductGridSection({ section, onAddToCart, onToggleWishlist, wishlistItems }: CMSSectionProps) {
  const collection = section.components?.collection || 'trending';
  const title = section.components?.title || 'Products';
  const highlightWord = section.components?.highlightWord || '';

  const { className, style } = mergeStyles('', section.styles);

  return (
    <div className={className} style={style}>
      <ProductGrid
        title={title}
        highlightWord={highlightWord}
        collection={collection}
        onAddToCart={onAddToCart || (() => {})}
        onToggleWishlist={onToggleWishlist || (() => {})}
        wishlistItems={wishlistItems || []}
      />
    </div>
  );
}
