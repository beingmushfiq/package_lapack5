// ============================================================
// ImageBanner Component
// Full-width or contained image banner from CMS data.
// ============================================================

import { getImageUrl } from '../../lib/utils';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function ImageBanner({ section, onNavigate }: CMSSectionProps) {
  const src = section.components?.src || section.components?.image || '';
  const alt = section.components?.alt || section.title || 'Banner';
  const link = section.components?.link || '';
  const height = section.components?.height || '320px';
  const fullWidth = section.components?.fullWidth ?? false;

  const { className, style } = mergeStyles(
    fullWidth ? '' : 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8',
    section.styles
  );

  const handleClick = () => {
    if (link && onNavigate) {
      onNavigate(link);
    }
  };

  return (
    <section className={className} style={style}>
      <div
        onClick={link ? handleClick : undefined}
        className={`relative overflow-hidden rounded-2xl group ${link ? 'cursor-pointer' : ''}`}
        style={{ height }}
      >
        <img
          src={getImageUrl(src)}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Hover overlay */}
        {link && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        )}
      </div>
    </section>
  );
}
