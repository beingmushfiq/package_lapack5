// ============================================================
// Component Registry
// Maps CMS section type strings to React components.
// This is the central registration point for all renderable types.
// New section types can be added here without modifying any other code.
// ============================================================

import { lazy, type ComponentType } from 'react';
import type { CMSSectionProps, CMSSectionType } from './types';

// Lazy-loaded existing components (wrapped for CMS)
const HeroBannerSection = lazy(() => import('./sections/HeroBannerSection'));
const CategoryGridSection = lazy(() => import('./sections/CategoryGridSection'));
const CategorySidebarSection = lazy(() => import('./sections/CategorySidebarSection'));
const ProductGridSection = lazy(() => import('./sections/ProductGridSection'));
const BlogGridSection = lazy(() => import('./sections/BlogGridSection'));
const BrandsCarouselSection = lazy(() => import('./sections/BrandsCarouselSection'));
const ReviewsSection = lazy(() => import('./sections/ReviewsSection'));
const FAQAccordionSection = lazy(() => import('./sections/FAQAccordionSection'));
const NewsletterSection = lazy(() => import('./sections/NewsletterSection'));

// Lazy-loaded new CMS components
const RichTextBlock = lazy(() => import('./components/RichTextBlock'));
const ImageBanner = lazy(() => import('./components/ImageBanner'));
const VideoEmbed = lazy(() => import('./components/VideoEmbed'));
const Spacer = lazy(() => import('./components/Spacer'));
const CustomHTML = lazy(() => import('./components/CustomHTML'));
const DualBanner = lazy(() => import('./components/DualBanner'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const FallbackSection = lazy(() => import('./components/FallbackSection'));

/**
 * The Component Registry: maps CMS type strings → lazy-loaded React components.
 * 
 * To add a new section type:
 * 1. Create the component in src/cms/sections/ or src/cms/components/
 * 2. Add a lazy import above
 * 3. Register it in this map
 */
const registry: Record<string, ComponentType<CMSSectionProps>> = {
  // Existing feature sections (wrapped)
  hero_slider: HeroBannerSection,
  category_grid: CategoryGridSection,
  category_sidebar: CategorySidebarSection,
  product_grid: ProductGridSection,
  product_carousel: ProductGridSection, // reuses product grid with carousel mode
  blog_grid: BlogGridSection,
  brands_carousel: BrandsCarouselSection,
  reviews: ReviewsSection,
  faq_accordion: FAQAccordionSection,
  newsletter: NewsletterSection,

  // New generic CMS components
  promotional_banner: ImageBanner,
  dual_banner: DualBanner,
  rich_text: RichTextBlock,
  image_banner: ImageBanner,
  video_embed: VideoEmbed,
  spacer: Spacer,
  custom_html: CustomHTML,
  contact_form: ContactForm,
};

/**
 * Get the component for a given CMS section type.
 * Returns FallbackSection if the type is not registered.
 */
export function getComponent(type: CMSSectionType | string): ComponentType<CMSSectionProps> {
  return registry[type] || FallbackSection;
}

/**
 * Register a new component type at runtime.
 * Useful for plugins or A/B test variants.
 */
export function registerComponent(type: string, component: ComponentType<CMSSectionProps>): void {
  registry[type] = component;
}

/**
 * Check if a component type is registered.
 */
export function isRegistered(type: string): boolean {
  return type in registry;
}

/**
 * Get all registered section types.
 */
export function getRegisteredTypes(): string[] {
  return Object.keys(registry);
}

export default registry;
