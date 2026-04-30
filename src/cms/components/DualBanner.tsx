// ============================================================
// DualBanner Component
// Side-by-side promotional banners from CMS data.
// Falls back to API promotional banners if no CMS data provided.
// ============================================================

import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../lib/utils';
import { usePromotionalBanners, useSiteSettings } from '../../lib/queries';
import type { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';

export default function DualBanner({ section }: CMSSectionProps) {
  const navigate = useNavigate();
  const { data: banners } = usePromotionalBanners();
  const { data: settingsResult } = useSiteSettings();
  const settings = settingsResult?.data || settingsResult || {};

  // CMS-provided banners take priority
  const cmsBanners = section.components?.banners || [];

  // Fallback to API/settings
  const topBanners = (banners || []).slice(0, 2);
  const banner1 = cmsBanners[0] || {
    image: topBanners[0]?.image || settings.promo_banner_1 || 'https://picsum.photos/seed/promo1/800/400',
    link: topBanners[0]?.link || settings.promo_link_1 || '/flash-deal',
    alt: 'Promotion 1',
  };
  const banner2 = cmsBanners[1] || {
    image: topBanners[1]?.image || settings.promo_banner_2 || 'https://picsum.photos/seed/promo2/800/400',
    link: topBanners[1]?.link || settings.promo_link_2 || '/flash-deal',
    alt: 'Promotion 2',
  };

  const { className, style } = mergeStyles(
    'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8',
    section.styles
  );

  return (
    <section className={className} style={style}>
      <div className="grid grid-cols-2 gap-3 sm:gap-6">
        {[banner1, banner2].map((banner, idx) => (
          <div
            key={idx}
            onClick={() => navigate(banner.link)}
            className="relative h-24 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden group cursor-pointer shadow-sm"
          >
            <img
              src={getImageUrl(banner.image)}
              alt={banner.alt || `Promotion ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
