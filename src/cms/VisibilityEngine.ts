// ============================================================
// Visibility Engine
// Evaluates CMS visibility rules to determine if a section should render.
// ============================================================

import type { CMSVisibilityRule } from './types';

interface VisibilityContext {
  isLoggedIn: boolean;
  userRole?: string;
  isMobile: boolean;
  isDesktop: boolean;
}

/**
 * Build current visibility context from browser/auth state.
 */
export function buildVisibilityContext(isLoggedIn: boolean, userRole?: string): VisibilityContext {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  return {
    isLoggedIn,
    userRole,
    isMobile: width < 768,
    isDesktop: width >= 1024,
  };
}

/**
 * Evaluate a single visibility rule.
 */
function evaluateRule(rule: CMSVisibilityRule, ctx: VisibilityContext): boolean {
  switch (rule.type) {
    case 'auth':
      if (rule.condition === 'is_logged_in') return ctx.isLoggedIn;
      if (rule.condition === 'is_guest') return !ctx.isLoggedIn;
      return true;

    case 'role':
      if (rule.condition === 'has_role' && rule.value) {
        return ctx.userRole === rule.value;
      }
      return true;

    case 'device':
      if (rule.condition === 'is_mobile') return ctx.isMobile;
      if (rule.condition === 'is_desktop') return ctx.isDesktop;
      return true;

    case 'custom':
      // Custom conditions can be extended here
      return true;

    default:
      return true;
  }
}

/**
 * Evaluate all visibility rules for a section.
 * If no rules exist, section is always visible.
 * All rules must pass (AND logic).
 */
export function shouldRender(
  rules: CMSVisibilityRule[] | undefined,
  isLoggedIn: boolean,
  userRole?: string
): boolean {
  if (!rules || rules.length === 0) return true;

  const ctx = buildVisibilityContext(isLoggedIn, userRole);
  return rules.every(rule => evaluateRule(rule, ctx));
}
