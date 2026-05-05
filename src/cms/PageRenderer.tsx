// ============================================================
// Page Renderer
// Fetches CMS page data and renders all sections dynamically.
// Handles: layout config, SEO injection, and section ordering.
// ============================================================

import { useEffect } from 'react';
import SectionRenderer from './SectionRenderer';
import type { CMSPage } from './types';
import { useLayout } from '../lib/LayoutContext';

interface PageRendererProps {
  page: CMSPage;
  onAddToCart?: (product: any) => void;
  onOrderNow?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
  onCategorySeeMore?: () => void;
}

export default function PageRenderer({
  page,
  onAddToCart,
  onOrderNow,
  onToggleWishlist,
  wishlistItems,
  onCategorySeeMore,
}: PageRendererProps) {

  // ─── SEO: Dynamic meta injection ──────────────────────────
  useEffect(() => {
    if (page.meta) {
      // Title
      document.title = page.meta.title || page.title || 'AmarShop';

      // Meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (page.meta.description) {
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', page.meta.description);
      }

      // OG Tags
      setOGTag('og:title', page.meta.title || page.title);
      setOGTag('og:description', page.meta.description || '');
      if (page.meta.og_image) {
        setOGTag('og:image', page.meta.og_image);
      }
      setOGTag('og:type', 'website');
      setOGTag('og:url', window.location.href);

      // JSON-LD Structured Data
      if (page.meta.json_ld) {
        let existingLd = document.querySelector('#cms-page-jsonld');
        if (!existingLd) {
          existingLd = document.createElement('script');
          existingLd.id = 'cms-page-jsonld';
          existingLd.setAttribute('type', 'application/ld+json');
          document.head.appendChild(existingLd);
        }
        existingLd.textContent = JSON.stringify(page.meta.json_ld);
      }
    }

    // Cleanup on unmount
    return () => {
      const ldScript = document.querySelector('#cms-page-jsonld');
      if (ldScript) ldScript.remove();
    };
  }, [page.meta, page.title]);

  // ─── Sync CMS Layout with Global App Shell ────────────────
  const { setLayout, resetLayout } = useLayout();

  useEffect(() => {
    if (page.layout) {
      setLayout({
        showHeader: page.layout.show_header ?? true,
        showFooter: page.layout.show_footer ?? true,
        showSubNavbar: page.layout.show_sub_navbar ?? true,
      });
    }

    return () => {
      resetLayout();
    };
  }, [page.layout, setLayout, resetLayout]);

  // ─── Layout-level styles ──────────────────────────────────
  const containerWidth = page.layout?.container_width || '1440px';
  const globalStyles = page.layout?.global_styles || {};

  // Sort sections by order
  const sortedSections = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <main
      className="pb-[8px]"
      style={{
        ...globalStyles,
      }}
    >
      <div className="space-y-2 sm:space-y-4">
        {sortedSections.map((section) => (
          <div key={section.id}>
            <SectionRenderer
              section={section}
              onAddToCart={onAddToCart}
              onOrderNow={onOrderNow}
              onToggleWishlist={onToggleWishlist}
              wishlistItems={wishlistItems}
              onCategorySeeMore={onCategorySeeMore}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

// ─── Utility: set/create OG meta tag ─────────────────────────
function setOGTag(property: string, content: string) {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
