import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CMSSectionProps } from '../types';
import { mergeStyles } from '../StyleEngine';
import SectionRenderer from '../SectionRenderer';

export default function TabsSection({ 
  section, 
  onAddToCart, 
  onOrderNow, 
  onToggleWishlist, 
  wishlistItems, 
  onCategorySeeMore 
}: CMSSectionProps) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = section.components?.tabs || [];
  
  const { className, style } = mergeStyles('py-12', section.styles);

  if (tabs.length === 0) return null;

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <div className="container mx-auto px-4">
        {section.title && (
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              {section.title}
            </h2>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100 max-w-fit mx-auto">
          {tabs.map((tab: any, index: number) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === index 
                  ? 'text-emerald-600 bg-white shadow-sm shadow-emerald-500/5' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              {activeTab === index && (
                <motion.div 
                  layoutId="activeTabGlow" 
                  className="absolute inset-0 bg-emerald-500/5 rounded-xl -z-10"
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabs[activeTab]?.sections ? (
                <div className="space-y-0">
                  {tabs[activeTab].sections.map((subSection: any) => (
                    <SectionRenderer
                      key={subSection.id}
                      section={subSection}
                      onAddToCart={onAddToCart}
                      onOrderNow={onOrderNow}
                      onToggleWishlist={onToggleWishlist}
                      wishlistItems={wishlistItems}
                      onCategorySeeMore={onCategorySeeMore}
                    />
                  ))}
                </div>
              ) : tabs[activeTab]?.content ? (
                <div 
                  className="prose prose-emerald max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
                />
              ) : (
                <div className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">
                  No content for this tab.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
