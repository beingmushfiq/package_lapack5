// CMS Section Wrapper: Hero Slider
// Wraps existing HeroBanner component for CMS rendering.

import HeroBanner from '../../components/HeroBanner';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function HeroBannerSection({ section, onCategorySeeMore }: CMSSectionProps) {
  const { className, style } = mergeStyles('', section.styles);

  return (
    <section className={className} style={style}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-start gap-4 lg:gap-6">
          <div className="flex-1 min-w-0">
            <HeroBanner />
          </div>
        </div>
      </div>
    </section>
  );
}
