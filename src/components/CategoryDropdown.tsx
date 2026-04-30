import { useCategories } from "../lib/queries";
import { ChevronRight, LayoutGrid, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

export default function CategoryDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState<any | null>(null);
  const navigate = useNavigate();
  const { data: apiCategories, isLoading } = useCategories();

  const categories = apiCategories || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          onMouseLeave={onClose}
          className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-2xl z-[100] flex flex-col"
          style={{ height: 'calc(100vh - 200px)', maxHeight: '500px' }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="flex h-full">
              {/* Main Categories */}
              <div className="w-full border-r border-gray-50 overflow-y-auto no-scrollbar py-2 flex flex-col">
                <div className="flex-1">
                  {categories.map((category: any) => (
                    <div
                      key={category.id}
                      onMouseEnter={() => setActiveCategory(category)}
                      className="relative"
                    >
                      <button
                        onClick={() => {
                          navigate(`/allproducts?category=${category.slug}`);
                          onClose();
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-6 py-2.5 transition-all text-left group",
                          activeCategory?.id === category.id ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                              "w-6 h-6 rounded flex items-center justify-center transition-all",
                              activeCategory?.id === category.id ? "bg-white text-emerald-600 shadow-sm" : "bg-gray-50 text-gray-400 group-hover:bg-white group-hover:text-emerald-600"
                          )}>
                            {category.icon_class ? <i className={cn(category.icon_class, "text-xs")}></i> : <LayoutGrid className="w-3 h-3" />}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            {category.name}
                          </span>
                        </div>
                        {category.children && category.children.length > 0 && (
                          <ChevronRight className={cn("w-3 h-3 opacity-50", activeCategory?.id === category.id && "opacity-100")} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => {
                    onClose();
                    // We'll need to trigger the global overlay. 
                    // I'll add an onViewAll prop to the dropdown.
                    (window as any).dispatchEvent(new CustomEvent('open-category-overlay'));
                  }}
                  className="w-full px-6 py-3 text-center text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:bg-emerald-50 transition-colors border-t border-gray-50 bg-white mt-auto sticky bottom-0"
                >
                  View All Categories
                </button>
              </div>

              {/* Sub Categories Flyout */}
              <AnimatePresence>
                {activeCategory && activeCategory.children && activeCategory.children.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-full top-0 w-[400px] h-full bg-white border-l border-gray-100 shadow-2xl p-6 overflow-y-auto no-scrollbar grid grid-cols-2 gap-x-8 gap-y-6"
                  >
                    {activeCategory.children.map((sub: any) => (
                      <div key={sub.id} className="space-y-3">
                        <h3
                          className="text-[10px] font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-1.5 cursor-pointer hover:text-emerald-600"
                          onClick={() => {
                            navigate(`/allproducts?category=${sub.slug}`);
                            onClose();
                          }}
                        >
                          {sub.name}
                        </h3>
                        <div className="flex flex-col gap-1.5">
                          {sub.children && sub.children.map((child: any) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                navigate(`/allproducts?category=${child.slug}`);
                                onClose();
                              }}
                              className="text-[9px] font-bold text-gray-500 hover:text-emerald-600 transition-colors text-left uppercase tracking-tight"
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
