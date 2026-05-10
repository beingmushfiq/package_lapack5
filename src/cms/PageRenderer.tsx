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
      setMetaTag('name', 'description', page.meta.description || '');

      // Robots
      setMetaTag('name', 'robots', page.meta.robots || 'index, follow');

      // Canonical
      setLinkTag('canonical', page.meta.canonical_url || window.location.href.split('?')[0]);

      // OG Tags
      setMetaTag('property', 'og:title', page.meta.title || page.title);
      setMetaTag('property', 'og:description', page.meta.description || '');
      if (page.meta.og_image) {
        setMetaTag('property', 'og:image', page.meta.og_image);
      }
      setMetaTag('property', 'og:type', 'website');
      setMetaTag('property', 'og:url', window.location.href);

      // Twitter Cards
      setMetaTag('name', 'twitter:card', 'summary_large_image');
      setMetaTag('name', 'twitter:title', page.meta.title || page.title);
      setMetaTag('name', 'twitter:description', page.meta.description || '');
      if (page.meta.og_image) {
        setMetaTag('name', 'twitter:image', page.meta.og_image);
      }

      // JSON-LD Structured Data
      if (page.meta.json_ld) {
        let existingLd = document.querySelector('#cms-page-jsonld');
        if (!existingLd) {
          existingLd = document.createElement('script');
          existingLd.id = 'cms-page-jsonld';
          existingLd.setAttribute('type', 'application/ld+json');
          document.head.appendChild(existingLd);
        }
        existingLd.textContent = typeof page.meta.json_ld === 'string' 
          ? page.meta.json_ld 
          : JSON.stringify(page.meta.json_ld);
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

// ─── Utilities: Meta/Link injection ─────────────────────────
function setMetaTag(attr: 'name' | 'property', value: string, content: string) {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}
