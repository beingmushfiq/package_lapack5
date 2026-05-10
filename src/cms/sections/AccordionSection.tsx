import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export default function AccordionSection({ section }: CMSSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = section.components?.items || [];
  const variant = section.components?.variant || 'default'; // default, boxed, shadow
  
  const { className, style } = mergeStyles('py-12', section.styles);

  if (items.length === 0) return null;

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        {section.title && (
          <div className="mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              {section.title}
            </h2>
            {section.content && (
              <p className="mt-2 text-gray-500 font-bold text-sm" dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
          </div>
        )}

        <div className="space-y-4">
          {items.map((item: any, index: number) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`group overflow-hidden transition-all duration-300 ${
                  variant === 'boxed' ? 'border border-gray-100 rounded-2xl bg-white' :
                  variant === 'shadow' ? 'bg-white rounded-2xl shadow-sm hover:shadow-md' :
                  'border-b border-gray-100'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors"
                >
                  <span className={`text-sm sm:text-base font-black uppercase tracking-tight transition-colors ${isOpen ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {item.title}
                  </span>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-6 pt-0">
                        <div 
                          className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium prose prose-sm prose-emerald"
                          dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
