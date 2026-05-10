import React from 'react';
import { useReviews } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';
import { mergeStyles } from '../StyleEngine';
import { getImageUrl } from '../../lib/utils';
import 'swiper/css';
import 'swiper/css/pagination';

export default function ReviewsSection({ section }: CMSSectionProps) {
  const { data: reviews, isLoading } = useReviews();
  const config = section.components || {};
  const limit = config.limit || 10;

  if (isLoading) {
    return <div className="h-64 bg-gray-50 animate-pulse rounded-2xl" />;
  }

  const displayReviews = reviews?.slice(0, limit) || [];
  const { className, style } = mergeStyles('py-16 bg-gray-50 rounded-3xl', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <div className="container mx-auto px-4">
        {section.title && (
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        )}

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {displayReviews.map((review: any) => (
            <SwiperSlide key={review.id}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
                <Quote className="w-10 h-10 text-emerald-100 mb-4" />
                <p className="text-gray-600 italic mb-6 flex-grow">
                  "{review.review}"
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={review.image ? getImageUrl(review.image) : `https://ui-avatars.com/api/?name=${review.client_name}&background=10b981&color=fff`} 
                    alt={review.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{review.client_name}</h4>
                    <p className="text-sm text-gray-500">{review.client_designation}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
