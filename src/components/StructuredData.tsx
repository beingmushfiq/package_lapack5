import { useEffect } from "react";

/**
 * Injects a JSON-LD script tag into the document head.
 * Cleans up on unmount to avoid duplicate schema on navigation.
 */
function useJsonLd(id: string, data: Record<string, any> | null) {
  useEffect(() => {
    if (!data) return;

    // Remove any existing script with the same id
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [id, data]);
}

// ─── Organization Schema (site-wide) ───────────────────────
interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: string[];
}

export function OrganizationSchema({
  name,
  url,
  logo,
  email,
  phone,
  address,
  socialLinks,
}: OrganizationSchemaProps) {
  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    ...(logo && { logo }),
    ...(email && { email }),
    ...(phone && { telephone: phone }),
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
        addressCountry: "BD",
      },
    }),
    ...(socialLinks?.length && { sameAs: socialLinks }),
  };

  useJsonLd("org-schema", data);
  return null;
}

// ─── Product Schema (product detail pages) ─────────────────
interface ProductSchemaProps {
  product: {
    name: string;
    slug: string;
    description?: string;
    price: number;
    discount_price?: number;
    images?: string[];
    image?: string;
    brand?: { name: string };
    category?: { name: string };
    rating?: number;
    reviews_count?: number;
    in_stock?: boolean;
    sku?: string;
  };
  siteUrl?: string;
}

export function ProductSchema({ product, siteUrl = "http://localhost:5173" }: ProductSchemaProps) {
  if (!product) {
    useJsonLd("product-schema", null);
    return null;
  }

  const mainImage = product.images?.[0] || product.image || "";

  const data: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description?.replace(/<[^>]*>/g, "").slice(0, 500) || product.name,
    image: product.images?.length ? product.images : [mainImage],
    url: `${siteUrl}/productdetails/${product.slug}`,
    ...(product.sku && { sku: product.sku }),
    ...(product.brand && {
      brand: {
        "@type": "Brand",
        name: product.brand.name,
      },
    }),
    ...(product.category && {
      category: product.category.name,
    }),
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/productdetails/${product.slug}`,
      priceCurrency: "BDT",
      price: product.discount_price || product.price,
      ...(product.discount_price && {
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }),
      availability: product.in_stock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviews_count || 1,
        bestRating: 5,
      },
    }),
  };

  useJsonLd("product-schema", data);
  return null;
}

// ─── BreadcrumbList Schema ─────────────────────────────────
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  useJsonLd("breadcrumb-schema", data);
  return null;
}

// ─── WebSite Schema (for site-wide search) ─────────────────
export function WebSiteSchema({ name, url }: { name: string; url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/allproducts?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  useJsonLd("website-schema", data);
  return null;
}
