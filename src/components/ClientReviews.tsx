import { useRef } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, Star, Quote } from "lucide-react";
import { getImageUrl } from "../lib/utils";
import { useReviews } from "../lib/queries";

export default function ClientReviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: reviews, isLoading } = useReviews();

  const displayReviews = reviews || [];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6"></div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="min-w-[350px] h-48 bg-gray-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayReviews.length === 0) return null;

  return (
    <section className="py-6 sm:py-10 bg-gray-50/50 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase">
              Client <span className="text-emerald-600">Reviews</span>
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              What our happy customers say
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => scroll("left")}
              className="p-2 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="p-2 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95 shadow-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6"
        >
          {displayReviews.map((review: any, idx: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="min-w-[280px] sm:min-w-[380px] snap-start group bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 relative"
            >
              <div className="absolute top-6 right-8 text-emerald-100 group-hover:text-emerald-200 transition-colors">
                <Quote className="w-12 h-12 fill-current" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                    <img
                      src={review.image ? getImageUrl(review.image) : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.client_name)}&background=10b981&color=fff&bold=true`}
                      alt={review.client_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-gray-900 leading-none mb-1.5">
                      {review.client_name}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-800 mb-3 line-clamp-1">
                    {review.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed italic font-medium">
                    "{review.review_text}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
