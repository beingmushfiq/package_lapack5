// ============================================================
// Section Renderer v2
// Handles: lazy loading, error boundaries, visibility,
// animations (motion), responsive breakpoint visibility, styling.
// ============================================================

import React, { Suspense, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { getComponent } from './ComponentRegistry';
import { shouldRender } from './VisibilityEngine';
import { isVisibleOnBreakpoint } from './StyleEngine';
import { getSectionMotionProps } from '../lib/AnimationEngine';
import { useAuth } from '../lib/AuthContext';
import type { CMSSection, CMSSectionProps } from './types';

// ─── Error Boundary ──────────────────────────────────────────

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  sectionId: string | number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SectionErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(`[CMS] Section ${this.props.sectionId} failed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ─── Loading Skeleton ────────────────────────────────────────

function SectionSkeleton() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded-lg w-48" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Section Error Fallback ──────────────────────────────────

function SectionErrorFallback({ sectionId }: { sectionId: string | number }) {
  // @ts-ignore
  const isDev = import.meta.env?.DEV;
  if (!isDev) return null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
        ⚠️ Section <code className="bg-red-100 px-1 rounded">{sectionId}</code> failed to render.
      </div>
    </div>
  );
}

// ─── Main Section Renderer ───────────────────────────────────

export interface SectionRendererProps {
  section: CMSSection;
  onAddToCart?: (product: any) => void;
  onOrderNow?: (product: any) => void;
  onToggleWishlist?: (product: any) => void;
  wishlistItems?: any[];
  onCategorySeeMore?: () => void;
}

export default function SectionRenderer({
  section,
  onAddToCart,
  onOrderNow,
  onToggleWishlist,
  wishlistItems,
  onCategorySeeMore,
}: SectionRendererProps) {
  const { user } = useAuth();

  // ── Auth / role / device visibility check
  const isVisible = shouldRender(
    section.visibility_rules,
    !!user,
    // @ts-ignore
    user?.role
  );
  if (!isVisible) return null;

  // ── Responsive breakpoint visibility check (hideOnMobile etc.)
  if (!isVisibleOnBreakpoint(section.styles as any)) return null;

  // ── Resolve animation props
  const motionProps = getSectionMotionProps(section.animation_config);
  const hasAnimation = Object.keys(motionProps).length > 0;

  // ── Get the component from registry
  const SectionComponent = getComponent(section.type);

  const props: CMSSectionProps = {
    section,
    onAddToCart,
    onOrderNow,
    onToggleWishlist,
    wishlistItems,
    onCategorySeeMore,
  };

  // ── Wrapper attributes
  const wrapperAttrs: Record<string, any> = {};
  if (section.css_id) wrapperAttrs.id = section.css_id;

  const inner = (
    <SectionErrorBoundary
      sectionId={section.id}
      fallback={<SectionErrorFallback sectionId={section.id} />}
    >
      <Suspense fallback={<SectionSkeleton />}>
        <SectionComponent {...props} />
      </Suspense>
    </SectionErrorBoundary>
  );

  // ── Wrap with motion if animation config present
  if (hasAnimation) {
    return (
      <motion.div {...wrapperAttrs} {...motionProps}>
        {inner}
      </motion.div>
    );
  }

  if (Object.keys(wrapperAttrs).length > 0) {
    return <div {...wrapperAttrs}>{inner}</div>;
  }

  return inner;
}
