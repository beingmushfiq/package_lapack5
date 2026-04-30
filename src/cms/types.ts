// ============================================================
// CMS Type Definitions
// Central type system for all CMS-driven data structures.
// ============================================================

/** CMS Page Meta (SEO) */
export interface CMSMeta {
  title: string;
  description?: string;
  og_image?: string;
  json_ld?: Record<string, any> | null;
}

/** CMS Layout configuration */
export interface CMSLayout {
  id: number;
  slug: string;
  show_header: boolean;
  show_footer: boolean;
  show_sub_navbar: boolean;
  container_width: string;
  global_styles?: Record<string, any>;
}

/** CMS Visibility Rule */
export interface CMSVisibilityRule {
  type: 'auth' | 'role' | 'device' | 'custom';
  condition: 'is_logged_in' | 'is_guest' | 'has_role' | 'is_mobile' | 'is_desktop' | string;
  value?: string;
}

/** CMS Section Styles */
export interface CMSSectionStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  maxWidth?: string;
  borderRadius?: string;
  boxShadow?: string;
  className?: string;
  darkMode?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

/** CMS API Data Source */
export interface CMSApiSource {
  endpoint: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  params?: Record<string, string>;
  mapping?: Record<string, string>;
}

/** CMS Section (the core rendering unit) */
export interface CMSSection {
  id: string | number;
  type: CMSSectionType;
  title?: string;
  content?: string;
  components: Record<string, any>;
  styles: CMSSectionStyles;
  visibility_rules: CMSVisibilityRule[];
  api_source?: CMSApiSource | null;
  order: number;
}

/** All supported CMS section types */
export type CMSSectionType =
  | 'hero_slider'
  | 'category_grid'
  | 'category_sidebar'
  | 'product_grid'
  | 'product_carousel'
  | 'blog_grid'
  | 'brands_carousel'
  | 'reviews'
  | 'faq_accordion'
  | 'newsletter'
  | 'promotional_banner'
  | 'dual_banner'
  | 'rich_text'
  | 'image_banner'
  | 'video_embed'
  | 'spacer'
  | 'custom_html'
  | 'contact_form';

/** Full CMS Page Response */
export interface CMSPage {
  id: number | null;
  title: string;
  slug: string;
  meta: CMSMeta;
  layout: CMSLayout | null;
  sections: CMSSection[];
}

/** CMS Page API Response wrapper */
export interface CMSPageResponse {
  page: CMSPage;
}

/** Props that every CMS section component receives */
export interface CMSSectionProps {
  section: CMSSection;
  /** Callback for cart actions */
  onAddToCart?: (product: any) => void;
  onOrderNow?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
  /** Callback for navigating */
  onNavigate?: (path: string) => void;
  /** Global callbacks */
  onCategorySeeMore?: () => void;
}
