// TestimonialSliderSection — CMS-driven testimonial carousel
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import type { CMSSectionProps } from '../types';
import { resolveStyles } from '../StyleEngine';

interface Testimonial {
  id?: number;
  name: string;
  role?: string;
  avatar?: string;
  content: string;
  rating?: number;
}

export default function TestimonialSliderSection({ section }: CMSSectionProps) {
  const cfg = section.components ?? {};
  const title = cfg.title ?? 'What Our Customers Say';
  const highlightWord = cfg.highlight_word ?? 'Customers';
  const items: Testimonial[] = cfg.items ?? [
    { name: 'Sarah Johnson', role: 'Verified Buyer', content: 'Absolutely love the quality! Fast delivery and great packaging.', rating: 5 },
    { name: 'Mike Chen', role: 'Regular Customer', content: 'Best prices and authentic products. Will definitely order again!', rating: 5 },
    { name: 'Fatema Begum', role: 'Happy Shopper', content: 'The customer service is top-notch. Very impressed with the entire experience.', rating: 5 },
  ];

  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent(i => (i - 1 + items.length) % items.length);
  const next = () => setCurrent(i => (i + 1) % items.length);
  const containerStyle = resolveStyles(section.styles);
  const titleParts = title.split(highlightWord);

  return (
    <section className="py-12 px-4 bg-gray-50" style={containerStyle}>
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            {titleParts[0]}
            <span className="text-emerald-500">{highlightWord}</span>
            {titleParts[1]}
          </h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center relative overflow-hidden">
            <Quote className="w-10 h-10 text-emerald-100 absolute top-4 left-4" />
            <div className="flex justify-center mb-4">
              {items[current].avatar ? (
                <img src={items[current].avatar} alt={items[current].name} className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-100" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">
                  {items[current].name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-0.5 mb-3">
              {Array.from({ length: items[current].rating ?? 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-700 text-base leading-relaxed mb-4">"{items[current].content}"</p>
            <p className="font-bold text-gray-900">{items[current].name}</p>
            {items[current].role && <p className="text-sm text-gray-500">{items[current].role}</p>}
          </div>

          {items.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          <div className="flex justify-center gap-1.5 mt-5">
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-emerald-500 w-6' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
