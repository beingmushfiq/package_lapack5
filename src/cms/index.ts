// ============================================================
// CMS Module — Barrel Export
// Central export point for all CMS rendering engine modules.
// ============================================================

// Core Renderers
export { default as PageRenderer } from './PageRenderer';
export { default as SectionRenderer } from './SectionRenderer';

// Engines
export { resolveStyles, resolveClassName, mergeStyles } from './StyleEngine';
export { shouldRender, buildVisibilityContext } from './VisibilityEngine';

// Registry
export { getComponent, registerComponent, isRegistered, getRegisteredTypes } from './ComponentRegistry';

// Types
export type {
  CMSPage,
  CMSPageResponse,
  CMSSection,
  CMSSectionType,
  CMSSectionProps,
  CMSLayout,
  CMSMeta,
  CMSVisibilityRule,
  CMSSectionStyles,
  CMSApiSource,
} from './types';
