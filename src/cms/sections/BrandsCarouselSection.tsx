import React from 'react';
import { useBrands } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { mergeStyles } from '../StyleEngine';
import { getImageUrl } from '../../lib/utils';
import 'swiper/css';

export default function BrandsCarouselSection({ section }: CMSSectionProps) {
  const { data: brands, isLoading } = useBrands();

  if (isLoading) {
    return <div className="h-32 bg-gray-50 animate-pulse rounded-2xl" />;
  }

  if (!brands || brands.length === 0) return null;

  const { className, style } = mergeStyles('py-12 border-y border-gray-100', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <div className="container mx-auto px-4">
        {section.title && (
          <h2 className="text-center text-xl font-semibold text-gray-400 uppercase tracking-widest mb-10">
            {section.title}
          </h2>
        )}
        
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="brands-swiper"
        >
          {brands.map((brand: any) => (
            <SwiperSlide key={brand.id}>
              <a 
                href={brand.url || '#'} 
                className="flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 h-20"
                target={brand.url ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {brand.logo ? (
                  <img 
                    src={getImageUrl(brand.logo)} 
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-lg font-bold text-gray-300">{brand.name}</span>
                )}
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
