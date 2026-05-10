import React from 'react';
import { useSliders } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { mergeStyles } from '../StyleEngine';
import { getImageUrl } from '../../lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

export default function HeroSliderSection({ section }: CMSSectionProps) {
  const { data: sliders, isLoading } = useSliders();
  const config = section.components || {};

  if (isLoading) {
    return <div className="h-[300px] md:h-[500px] bg-gray-100 animate-pulse rounded-2xl" />;
  }

  if (!sliders || sliders.length === 0) return null;

  const { className, style } = mergeStyles('relative overflow-hidden rounded-2xl', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={config.autoplay ? {
          delay: config.interval || 5000,
          disableOnInteraction: false,
        } : false}
        className="h-[300px] md:h-[500px] w-full"
      >
        {sliders.map((slider: any) => (
          <SwiperSlide key={slider.id}>
            <div className="relative w-full h-full group">
              <img
                src={getImageUrl(slider.image)}
                alt={slider.title || 'Hero Slider'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="container mx-auto px-6 md:px-12">
                  <div className="max-w-xl text-white space-y-4">
                    {slider.title && (
                      <h2 className="text-3xl md:text-5xl font-bold leading-tight animate-fade-in">
                        {slider.title}
                      </h2>
                    )}
                    {slider.subtitle && (
                      <p className="text-lg md:text-xl text-white/90">
                        {slider.subtitle}
                      </p>
                    )}
                    {slider.button_text && (
                      <a
                        href={slider.button_link || '#'}
                        className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105 active:scale-95"
                      >
                        {slider.button_text}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
