// ============================================================
// FallbackSection Component
// Renders when a CMS section type is unrecognized or a component errors.
// ============================================================

import { AlertTriangle } from 'lucide-react';
import type { CMSSectionProps } from '../types';

export default function FallbackSection({ section }: CMSSectionProps) {
  // In production, render nothing (graceful degradation).
  // In development, render a helpful warning.
  // @ts-ignore - Vite env
  const isDev = import.meta.env?.DEV;

  if (!isDev) return null;

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Unknown section type: <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">{section.type}</code>
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Section "{section.title || section.id}" could not be rendered. Register this type in ComponentRegistry.
          </p>
        </div>
      </div>
    </section>
  );
}
