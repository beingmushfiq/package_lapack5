// ============================================================
// Home Page — CMS-Driven
// Fetches homepage data from CMS and renders via PageRenderer.
// Falls back to default static sections if CMS is unavailable.
// ============================================================

import { useCMSHomepage } from "../lib/queries";
import PageRenderer from "../cms/PageRenderer";
import { Loader2 } from "lucide-react";

interface HomeProps {
  onCategorySeeMore: () => void;
  onAddToCart: (product: any) => void;
  onToggleWishlist: (product: any) => void;
  wishlistItems: any[];
}

export default function Home({ onCategorySeeMore, onAddToCart, onToggleWishlist, wishlistItems }: HomeProps) {
  const { data, isLoading } = useCMSHomepage();

  // Minimal loading state — the page renders fast via SectionRenderer suspense
  if (isLoading) {
    return (
      <main className="pb-[8px]">
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      </main>
    );
  }

  // Render via the CMS engine
  if (data?.page) {
    return (
      <PageRenderer
        page={data.page}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
        wishlistItems={wishlistItems}
        onCategorySeeMore={onCategorySeeMore}
      />
    );
  }

  // Hard fallback: should never reach here since the API returns defaults
  return (
    <main className="pb-[8px]">
      <div className="min-h-[40vh] flex items-center justify-center text-gray-400">
        <p>Unable to load page content.</p>
      </div>
    </main>
  );
}
