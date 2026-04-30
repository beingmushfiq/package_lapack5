// ============================================================
// Style Engine
// Converts CMS style objects into React inline styles and CSS classes.
// ============================================================

import type { CMSSectionStyles } from './types';

/**
 * Convert CMS section styles to React CSSProperties object.
 */
export function resolveStyles(styles: CMSSectionStyles | undefined): Record<string, string> {
  if (!styles) return {};

  const css: Record<string, string> = {};

  if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor;
  if (styles.backgroundImage) css.backgroundImage = `url(${styles.backgroundImage})`;
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

  // If background image is set, add default cover properties
  if (styles.backgroundImage) {
    css.backgroundSize = 'cover';
    css.backgroundPosition = 'center';
    css.backgroundRepeat = 'no-repeat';
  }

  return css;
}

/**
 * Extract additional CSS class names from CMS styles.
 */
export function resolveClassName(styles: CMSSectionStyles | undefined): string {
  return styles?.className || '';
}

/**
 * Merge CMS styles with Tailwind class names safely.
 */
export function mergeStyles(
  baseClasses: string,
  cmsStyles: CMSSectionStyles | undefined
): { className: string; style: Record<string, string> } {
  const cmsClass = resolveClassName(cmsStyles);
  const className = [baseClasses, cmsClass].filter(Boolean).join(' ');
  const style = resolveStyles(cmsStyles);
  return { className, style };
}
