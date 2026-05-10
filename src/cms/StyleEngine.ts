// ============================================================
// Style Engine v2
// Converts CMS style objects into React inline styles and CSS classes.
// Now supports responsive breakpoints (mobile/tablet/desktop).
// ============================================================

import type { CMSSectionStyles } from '../cms/types';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Detect current device breakpoint.
 */
export function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Convert CMS section styles to React CSSProperties object.
 */
export function resolveStyles(styles: CMSSectionStyles | Record<string, any> | undefined): Record<string, string> {
  if (!styles) return {};

  const css: Record<string, string> = {};

  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;
  if (styles.backgroundImage) {
    css.backgroundImage = `url(${styles.backgroundImage})`;
    css.backgroundSize = 'cover';
    css.backgroundPosition = 'center';
    css.backgroundRepeat = 'no-repeat';
  }
  if (styles.textColor) css.color = styles.textColor;
  if (styles.padding) css.padding = styles.padding;
  if (styles.paddingTop) css.paddingTop = styles.paddingTop;
  if (styles.paddingBottom) css.paddingBottom = styles.paddingBottom;
  if (styles.paddingLeft) css.paddingLeft = styles.paddingLeft;
  if (styles.paddingRight) css.paddingRight = styles.paddingRight;
  if (styles.margin) css.margin = styles.margin;
  if (styles.marginTop) css.marginTop = styles.marginTop;
  if (styles.marginBottom) css.marginBottom = styles.marginBottom;
  if (styles.maxWidth) css.maxWidth = styles.maxWidth;
  if (styles.borderRadius) css.borderRadius = styles.borderRadius;
  if (styles.boxShadow) css.boxShadow = styles.boxShadow;
  if (styles.minHeight) css.minHeight = styles.minHeight;
  if (styles.height) css.height = styles.height;
  if (styles.gap) css.gap = styles.gap;
  if (styles.display) css.display = styles.display;
  if (styles.flexDirection) css.flexDirection = styles.flexDirection;
  if (styles.alignItems) css.alignItems = styles.alignItems;
  if (styles.justifyContent) css.justifyContent = styles.justifyContent;
  if (styles.gridTemplateColumns) css.gridTemplateColumns = styles.gridTemplateColumns;
  if (styles.overflow) css.overflow = styles.overflow;
  if (styles.opacity) css.opacity = styles.opacity;
  if (styles.zIndex) css.zIndex = styles.zIndex;
  if (styles.border) css.border = styles.border;
  if (styles.borderColor) css.borderColor = styles.borderColor;
  if (styles.color) css.color = styles.color;
  if (styles.fontFamily) css.fontFamily = styles.fontFamily;
  if (styles.fontSize) css.fontSize = styles.fontSize;
  if (styles.fontWeight) css.fontWeight = styles.fontWeight;
  if (styles.lineHeight) css.lineHeight = styles.lineHeight;
  if (styles.letterSpacing) css.letterSpacing = styles.letterSpacing;
  if (styles.textAlign) css.textAlign = styles.textAlign;

  return css;
}

/**
 * Resolve responsive styles for the current breakpoint.
 * Falls back to the base styles if no breakpoint-specific override exists.
 */
export function resolveResponsiveStyles(
  styles: CMSSectionStyles | Record<string, any> | undefined,
  breakpoint?: Breakpoint
): Record<string, string> {
  if (!styles) return {};

  const bp = breakpoint ?? getCurrentBreakpoint();
  const base = resolveStyles(styles);

  // Check for breakpoint-specific style overrides
  const bpKey = `${bp}Styles` as keyof CMSSectionStyles; // e.g. mobileStyles, tabletStyles, desktopStyles
  const override = (styles as any)[bpKey];

  if (override && typeof override === 'object') {
    return { ...base, ...resolveStyles(override) };
  }

  return base;
}

/**
 * Extract additional CSS class names from CMS styles.
 */
export function resolveClassName(styles: CMSSectionStyles | Record<string, any> | undefined): string {
  if (!styles) return '';
  return (styles as any).className || '';
}

/**
 * Merge CMS styles with base Tailwind class names.
 */
export function mergeStyles(
  baseClasses: string,
  cmsStyles: CMSSectionStyles | Record<string, any> | undefined
): { className: string; style: Record<string, string> } {
  const cmsClass = resolveClassName(cmsStyles);
  const className = [baseClasses, cmsClass].filter(Boolean).join(' ');
  const style = resolveStyles(cmsStyles);
  return { className, style };
}

/**
 * Resolve visibility for a breakpoint.
 * Supports: hideOnMobile, hideOnTablet, hideOnDesktop flags.
 */
export function isVisibleOnBreakpoint(
  styles: Record<string, any> | undefined,
  breakpoint?: Breakpoint
): boolean {
  if (!styles) return true;
  const bp = breakpoint ?? getCurrentBreakpoint();
  if (bp === 'mobile' && styles.hideOnMobile === true) return false;
  if (bp === 'tablet' && styles.hideOnTablet === true) return false;
  if (bp === 'desktop' && styles.hideOnDesktop === true) return false;
  return true;
}
