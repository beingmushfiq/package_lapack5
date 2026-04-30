// ============================================================
// RichTextBlock Component
// Renders CMS-provided rich text (HTML/Markdown) content safely.
// ============================================================

import { useMemo } from 'react';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

/**
 * Sanitize HTML to prevent XSS attacks.
 * Strips dangerous tags and attributes.
 */
function sanitizeHTML(html: string): string {
  // Remove script tags and event handlers
  let clean = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  return clean;
}

export default function RichTextBlock({ section }: CMSSectionProps) {
  const content = section.content || section.components?.content || '';
  const alignment = section.components?.alignment || 'left';

  const sanitized = useMemo(() => sanitizeHTML(content), [content]);
  const { className, style } = mergeStyles(
    'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6',
    section.styles
  );

  return (
    <section className={className} style={style}>
      {section.title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
      )}
      <div
        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline"
        style={{ textAlign: alignment as any }}
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    </section>
  );
}
