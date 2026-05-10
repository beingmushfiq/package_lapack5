// ============================================================
// Component Registry v2
// Maps CMS section type strings to React components.
// All new section types are registered here.
// ============================================================

import { lazy, type ComponentType } from 'react';
import type { CMSSectionProps, CMSSectionType } from './types';

// ─── Existing Feature Sections (wrapped) ─────────────────────
const HeroBannerSection = lazy(() => import('./sections/HeroBannerSection'));
const CategoryGridSection = lazy(() => import('./sections/CategoryGridSection'));
const CategorySidebarSection = lazy(() => import('./sections/CategorySidebarSection'));
const ProductGridSection = lazy(() => import('./sections/ProductGridSection'));
const BlogGridSection = lazy(() => import('./sections/BlogGridSection'));
const BrandsCarouselSection = lazy(() => import('./sections/BrandsCarouselSection'));
const ReviewsSection = lazy(() => import('./sections/ReviewsSection'));
const FAQAccordionSection = lazy(() => import('./sections/FAQAccordionSection'));
const NewsletterSection = lazy(() => import('./sections/NewsletterSection'));

// ─── New CMS Sections ─────────────────────────────────────────
const CountdownTimerSection = lazy(() => import('./sections/CountdownTimerSection'));
const CTASection = lazy(() => import('./sections/CTASection'));
const TestimonialSliderSection = lazy(() => import('./sections/TestimonialSliderSection'));
const FlashDealBannerSection = lazy(() => import('./sections/FlashDealBannerSection'));
const ImageGallerySection = lazy(() => import('./sections/ImageGallerySection'));
const ProductRecommendationSection = lazy(() => import('./sections/ProductRecommendationSection'));

// ─── Generic CMS Components ───────────────────────────────────
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
 * 4. Add the type to CMSSectionType in types.ts
 * 5. Add it to PageSection::SECTION_TYPES in the backend
 */
const registry: Record<string, ComponentType<CMSSectionProps>> = {
  // ── Existing sections
  hero_slider: HeroBannerSection,
  category_grid: CategoryGridSection,
  category_sidebar: CategorySidebarSection,
  product_grid: ProductGridSection,
  product_carousel: ProductGridSection,   // reuses grid in carousel mode
  blog_grid: BlogGridSection,
  brands_carousel: BrandsCarouselSection,
  reviews: ReviewsSection,
  faq_accordion: FAQAccordionSection,
  newsletter: NewsletterSection,

  // ── Generic CMS components
  promotional_banner: ImageBanner,
  dual_banner: DualBanner,
  rich_text: RichTextBlock,
  image_banner: ImageBanner,
  video_embed: VideoEmbed,
  spacer: Spacer,
  custom_html: CustomHTML,
  contact_form: ContactForm,

  // ── New CMS sections
  countdown_timer: CountdownTimerSection,
  cta_section: CTASection,
  testimonial_slider: TestimonialSliderSection,
  flash_deal_banner: FlashDealBannerSection,
  image_gallery: ImageGallerySection,
  product_recommendation: ProductRecommendationSection,

  // ── Aliases (for flexibility)
  accordion_section: FAQAccordionSection,  // reuse FAQ accordion
  html_embed: CustomHTML,                  // alias for custom_html
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
 * Used by the CMS SDK and third-party plugins.
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
