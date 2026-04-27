import { useCategories } from "../lib/queries";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../lib/utils";

export default function CategorySidebar({ onViewAll }: { onViewAll?: () => void }) {
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const { data: apiCategories, isLoading } = useCategories();

  const displayedCategories = apiCategories || [];

  if (isLoading) {
    return (
      <div className="hidden lg:block w-64 h-[480px] bg-white border border-gray-100 rounded-2xl shadow-xl flex-shrink-0 animate-pulse">
        <div className="p-4 space-y-4">
          {[1,2,3,4,5,6,7].map(i => <div key={i} className="h-6 bg-gray-200 rounded"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div 
      onMouseLeave={() => {
        setActiveCategory(null);
        setHoverIndex(null);
      }}
      className="hidden lg:block w-64 h-[480px] relative group/sidebar flex-shrink-0"
    >
      {/* Sidebar Box */}
      <div className="w-full h-full bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/50 flex flex-col overflow-hidden">
        <div className="py-2 overflow-y-auto flex-1 min-h-0 relative custom-sidebar-scrollbar">
          {displayedCategories.map((category: any, idx: number) => {
            const IconComponent = LayoutGrid;
            return (
              <div 
                key={category.id}
                onMouseEnter={() => {
                  setActiveCategory(category);
                  setHoverIndex(idx);
                }}
                className="relative"
              >
                <button
                  onClick={() => navigate(`/allproducts?category=${category.slug}`)}
                  className={`w-full flex items-center justify-between px-6 py-2.5 hover:bg-emerald-50 group transition-colors text-left ${activeCategory?.id === category.id ? 'bg-emerald-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all border ${activeCategory?.id === category.id ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-transparent group-hover:bg-white group-hover:text-emerald-600 group-hover:border-emerald-100'}`}>
                      {category.icon_class ? <i className={category.icon_class}></i> : <IconComponent className="w-3.5 h-3.5" />}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${activeCategory?.id === category.id ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-700'}`}>
                      {category.name}
                    </span>
                  </div>
                  {category.children && category.children.length > 0 && (
                    <ChevronRight className={`w-3 h-3 transition-colors ${activeCategory?.id === category.id ? 'text-emerald-400' : 'text-gray-300 group-hover:text-emerald-400'}`} />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <button 
          onClick={onViewAll}
          className="w-full px-6 py-3 text-center text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 transition-colors border-t border-gray-50 bg-white"
        >
          View All Categories
        </button>
      </div>

      {/* Flyout Menu - Positioned outside the overflow-hidden box */}
      {activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
        <div 
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => {
            setActiveCategory(null);
            setHoverIndex(null);
          }}
          className="absolute left-full top-0 w-[550px] bg-white border border-gray-100 shadow-2xl rounded-r-2xl z-[150] p-8 grid grid-cols-2 gap-10 h-[480px] overflow-y-auto custom-sidebar-scrollbar"
        >
          {activeCategory.children.map((sub: any) => (
            <div key={sub.id} className="space-y-3">
              <h3 
                className="text-[11px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-2 cursor-pointer hover:text-emerald-600"
                onClick={() => navigate(`/allproducts?category=${sub.slug}`)}
              >
                {sub.name}
              </h3>
              <div className="flex flex-col gap-2">
                {sub.children && sub.children.map((child: any) => (
                  <button 
                    key={child.id}
                    onClick={() => navigate(`/allproducts?category=${child.slug}`)}
                    className="text-[10px] font-medium text-gray-500 hover:text-emerald-600 transition-colors text-left"
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
