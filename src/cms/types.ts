// ============================================================
// CMS Type Definitions v2
// Central type system for all CMS-driven data structures.
// ============================================================

/** CMS Page Meta (SEO) */
export interface CMSMeta {
  title: string;
  description?: string;
  og_image?: string;
  json_ld?: Record<string, any> | null;
  twitter_card?: string;
  canonical_url?: string;
  robots?: string;
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
  type: 'auth' | 'role' | 'device' | 'country' | 'route' | 'custom';
  condition: 'is_logged_in' | 'is_guest' | 'has_role' | 'is_mobile' | 'is_desktop' | 'is_tablet' | string;
  value?: string;
}

/** CMS Section Styles (with responsive variants) */
export interface CMSSectionStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  textColor?: string;
  color?: string;
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  maxWidth?: string;
  minHeight?: string;
  height?: string;
  borderRadius?: string;
  boxShadow?: string;
  border?: string;
  borderColor?: string;
  gap?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  gridTemplateColumns?: string;
  overflow?: string;
  opacity?: string;
  zIndex?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  className?: string;
  // Responsive device visibility
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  // Breakpoint-specific overrides
  mobileStyles?: Partial<CMSSectionStyles>;
  tabletStyles?: Partial<CMSSectionStyles>;
  desktopStyles?: Partial<CMSSectionStyles>;
  // Dark mode overrides
  darkMode?: {
    backgroundColor?: string;
    textColor?: string;
  };
}

/** CMS Animation Configuration */
export interface CMSAnimationConfig {
  type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'bounce' | 'none';
  duration?: number;
  delay?: number;
  easing?: string;
  trigger?: 'always' | 'on-scroll' | 'on-hover';
  stagger?: number;
}

/** CMS Tracking Configuration */
export interface CMSTrackingConfig {
  eventName?: string;
  dataLayer?: Record<string, any>;
  fbPixelEvent?: string;
  gtmEvent?: string;
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
  animation_config?: CMSAnimationConfig;
  tracking_config?: CMSTrackingConfig;
  api_source?: CMSApiSource | null;
  order: number;
  css_id?: string;
  css_classes?: string;
  ab_variant?: string;
  locale?: string;
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
  | 'contact_form'
  // New section types
  | 'countdown_timer'
  | 'testimonial_slider'
  | 'image_gallery'
  | 'announcement_bar'
  | 'cta_section'
  | 'tabs_section'
  | 'accordion_section'
  | 'product_recommendation'
  | 'flash_deal_banner';

/** Full CMS Page Response */
export interface CMSPage {
  id: number | null;
  title: string;
  slug: string;
  meta: CMSMeta;
  layout: CMSLayout | null;
  sections: CMSSection[];
  template?: string;
  locale?: string;
}

/** CMS Page API Response wrapper */
export interface CMSPageResponse {
  page: CMSPage;
}

/** Props that every CMS section component receives */
export interface CMSSectionProps {
  section: CMSSection;
  onAddToCart?: (product: any) => void;
  onOrderNow?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
  onNavigate?: (path: string) => void;
  onCategorySeeMore?: () => void;
}

/** CMS Popup */
export interface CMSPopup {
  id: number;
  name: string;
  title?: string;
  content?: string;
  image?: string;
  button_text?: string;
  button_url?: string;
  trigger: 'delay' | 'exit_intent' | 'scroll' | 'page_load';
  trigger_delay: number;
  trigger_scroll: number;
  show_on_pages?: string[];
  visibility_rules: CMSVisibilityRule[];
  show_after_visits: number;
  is_dismissible: boolean;
  position: 'center' | 'bottom-left' | 'bottom-right' | 'top';
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  styles: CMSSectionStyles;
}

/** CMS Announcement Bar */
export interface CMSAnnouncementBar {
  id: number;
  content: string;
  background_color: string;
  text_color: string;
  link_url?: string;
  link_text?: string;
  is_dismissible: boolean;
  position: 'top' | 'bottom';
  visibility_rules: CMSVisibilityRule[];
}

/** CMS Navigation Item */
export interface CMSNavItem {
  id: number;
  label: string;
  url: string;
  icon?: string;
  badge_text?: string;
  badge_color?: string;
  is_mega_menu: boolean;
  mega_menu_config?: any;
  open_in_new_tab: boolean;
  description?: string;
  image?: string;
  css_classes?: string;
  children: CMSNavItem[];
}
