// CTASection — Call-to-Action block
import type { CMSSectionProps } from '../types';
import { resolveStyles } from '../StyleEngine';

export default function CTASection({ section }: CMSSectionProps) {
  const cfg = section.components ?? {};
  const title = cfg.title ?? 'Ready to get started?';
  const subtitle = cfg.subtitle ?? 'Join thousands of happy customers.';
  const primaryText = cfg.primary_button_text ?? 'Shop Now';
  const primaryUrl = cfg.primary_button_url ?? '/allproducts';
  const secondaryText = cfg.secondary_button_text ?? '';
  const secondaryUrl = cfg.secondary_button_url ?? '';
  const layout = cfg.layout ?? 'center'; // center, left, right
  const bgStyle = cfg.bg_style ?? 'gradient'; // gradient, solid, image

  const bgClass = bgStyle === 'gradient'
    ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700'
    : bgStyle === 'dark'
    ? 'bg-gray-900'
    : 'bg-white';

  const textClass = bgStyle === 'solid-light' ? 'text-gray-900' : 'text-white';
  const alignClass = layout === 'left' ? 'text-left items-start' : layout === 'right' ? 'text-right items-end' : 'text-center items-center';

  const containerStyle = resolveStyles(section.styles);

  return (
    <section className={`py-16 px-4 ${bgClass}`} style={containerStyle}>
      <div className={`max-w-3xl mx-auto flex flex-col gap-6 ${alignClass}`}>
        <div>
          <h2 className={`text-3xl sm:text-5xl font-black ${textClass}`}>{title}</h2>
          {subtitle && (
            <p className={`mt-3 text-lg opacity-80 ${textClass}`}>{subtitle}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href={primaryUrl}
            className="px-8 py-3 bg-white text-gray-900 font-bold rounded-full hover:scale-105 transition-transform shadow-lg text-sm"
          >
            {primaryText}
          </a>
          {secondaryText && (
            <a
              href={secondaryUrl}
              className={`px-8 py-3 border-2 border-white/40 ${textClass} font-bold rounded-full hover:bg-white/10 transition-colors text-sm`}
            >
              {secondaryText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
