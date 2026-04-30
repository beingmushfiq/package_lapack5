// ============================================================
// VideoEmbed Component
// Renders embedded video (YouTube, Vimeo, or direct URL) from CMS.
// ============================================================

import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return url;
}

export default function VideoEmbed({ section }: CMSSectionProps) {
  const url = section.components?.url || '';
  const autoplay = section.components?.autoplay ?? false;
  const title = section.title || 'Embedded Video';

  const embedUrl = getEmbedUrl(url) + (autoplay ? '?autoplay=1&mute=1' : '');

  const { className, style } = mergeStyles(
    'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6',
    section.styles
  );

  if (!url) return null;

  return (
    <section className={className} style={style}>
      {section.title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
      )}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
