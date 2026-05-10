import React from 'react';
import { useCategories } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { Link } from 'react-router-dom';
import { mergeStyles } from '../StyleEngine';
import { getImageUrl } from '../../lib/utils';

export default function CategoryGridSection({ section }: CMSSectionProps) {
  const { data: categories, isLoading } = useCategories();
  const config = section.components || {};
  const columns = config.columns || 6;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // Filter top-level categories
  const topCategories = categories?.filter((c: any) => !c.parent_id) || [];
  const { className, style } = mergeStyles('py-8', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      {section.title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
          <Link to="/categories" className="text-emerald-500 font-medium hover:underline">
            View All
          </Link>
        </div>
      )}

      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${columns} gap-4 md:gap-6`}>
        {topCategories.map((category: any) => (
          <Link
            key={category.id}
            to={`/products?category=${category.slug}`}
            className="group flex flex-col items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:-translate-y-1"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden mb-3 group-hover:bg-emerald-50 transition-colors">
              {category.image ? (
                <img
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="text-gray-300">
                  {/* Fallback icon if no image */}
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
