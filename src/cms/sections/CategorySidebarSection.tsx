import React from 'react';
import { useCategories } from '../../lib/queries';
import { CMSSectionProps } from '../types';
import { Link, useSearchParams } from 'react-router-dom';
import { mergeStyles } from '../StyleEngine';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CategorySidebarSection({ section }: CMSSectionProps) {
  const { data: categories, isLoading } = useCategories();
  const [searchParams] = useSearchParams();
  const activeSlug = searchParams.get('category');
  
  const { className, style } = mergeStyles('bg-white border border-gray-100 rounded-2xl p-6', section.styles);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-gray-100 rounded mb-6" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-50 rounded" />
        ))}
      </div>
    );
  }

  const topCategories = categories?.filter((c: any) => !c.parent_id) || [];

  return (
    <aside 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <div className="flex items-center gap-2 mb-6">
        <LayoutGrid className="w-4 h-4 text-emerald-600" />
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
          {section.title || 'Categories'}
        </h2>
      </div>

      <div className="space-y-1">
        <Link
          to="/allproducts"
          className={cn(
            "flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
            !activeSlug ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-gray-500 hover:bg-gray-50"
          )}
        >
          All Products
          <ChevronRight className={cn("w-3.5 h-3.5", !activeSlug ? "text-white/50" : "text-gray-300")} />
        </Link>

        {topCategories.map((category: any) => {
          const isActive = activeSlug === category.slug;
          return (
            <Link
              key={category.id}
              to={`/allproducts?category=${category.slug}`}
              className={cn(
                "flex items-center justify-between w-full py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                isActive ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-3">
                {category.image && (
                  <img src={category.image} alt="" className="w-4 h-4 object-cover rounded shadow-sm" />
                )}
                {category.name}
              </div>
              <ChevronRight className={cn("w-3.5 h-3.5", isActive ? "text-white/50" : "text-gray-300")} />
            </Link>
          );
        })}
      </div>

      {section.content && (
        <div className="mt-8 pt-6 border-t border-gray-50">
           <div 
            className="text-[10px] text-gray-400 font-bold leading-relaxed prose-sm"
            dangerouslySetInnerHTML={{ __html: section.content }}
           />
        </div>
      )}
    </aside>
  );
}
