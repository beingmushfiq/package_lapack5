import React, { useState } from 'react';
import { useFaqs } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import { mergeStyles } from '../StyleEngine';

export default function FaqAccordionSection({ section }: CMSSectionProps) {
  const { data: faqs, isLoading } = useFaqs();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (isLoading) {
    return <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl" />
      ))}
    </div>;
  }

  if (!faqs || faqs.length === 0) return null;

  const { className, style } = mergeStyles('py-16 max-w-4xl mx-auto', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      {section.title && (
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{section.title}</h2>
      )}

      <div className="space-y-4">
        {faqs.map((faq: any, index: number) => (
          <div 
            key={faq.id}
            className={`border rounded-2xl transition-all ${
              openIndex === index 
                ? 'border-emerald-500 bg-emerald-50/30' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className={`font-bold text-lg ${openIndex === index ? 'text-emerald-700' : 'text-gray-900'}`}>
                {faq.question}
              </span>
              <div className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                <ChevronDown className={`w-6 h-6 ${openIndex === index ? 'text-emerald-500' : 'text-gray-400'}`} />
              </div>
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 pt-0 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
