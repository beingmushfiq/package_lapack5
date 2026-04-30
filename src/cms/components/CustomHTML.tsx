// ============================================================
// CustomHTML Component
// Renders CMS-provided custom HTML with optional CSS.
// Sandboxed with sanitization to prevent XSS.
// ============================================================

import { useMemo } from 'react';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

function sanitizeHTML(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript\s*:/gi, '');
}

export default function CustomHTML({ section }: CMSSectionProps) {
  const html = section.components?.html || section.content || '';
  const css = section.components?.css || '';

  const sanitized = useMemo(() => sanitizeHTML(html), [html]);

  const { className, style } = mergeStyles(
    'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6',
    section.styles
  );

  return (
    <section className={className} style={style}>
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      <div dangerouslySetInnerHTML={{ __html: sanitized }} />
    </section>
  );
}
