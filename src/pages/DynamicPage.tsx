// ============================================================
// DynamicPage
// Route handler for CMS-driven pages.
// Fetches page data by slug and renders via the CMS PageRenderer.
// ============================================================

import { useParams } from 'react-router-dom';
import { useCMSPage } from '../lib/queries';
import PageRenderer from '../cms/PageRenderer';
import { Loader2, AlertCircle } from 'lucide-react';

interface DynamicPageProps {
  onAddToCart?: (product: any) => void;
  onOrderNow?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
  onCategorySeeMore?: () => void;
}

export default function DynamicPage({
  onAddToCart,
  onOrderNow,
  onToggleWishlist,
  wishlistItems,
  onCategorySeeMore,
}: DynamicPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useCMSPage(slug || '');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Loading page...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data?.page) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-500">
            The page you're looking for doesn't exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageRenderer
      page={data.page}
      onAddToCart={onAddToCart}
      onOrderNow={onOrderNow}
      onToggleWishlist={onToggleWishlist}
      wishlistItems={wishlistItems}
      onCategorySeeMore={onCategorySeeMore}
    />
  );
}
