import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getImageUrl } from "../lib/utils";
import { useSliders } from "../lib/queries";

const FALLBACK_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop",
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: apiSliders, isLoading } = useSliders();

  const slides = apiSliders && apiSliders.length > 0 ? apiSliders : FALLBACK_SLIDES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (isLoading) {
    return <div className="w-full h-[250px] sm:h-[350px] md:h-[420px] lg:h-[480px] bg-gray-200 animate-pulse rounded-2xl shadow-xl shadow-gray-200/50"></div>;
  }

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[420px] lg:h-[480px] overflow-hidden group touch-none rounded-2xl shadow-xl shadow-gray-200/50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            src={getImageUrl(slides[currentSlide].image)}
            alt={slides[currentSlide].title || `Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Overlay for better text/dot visibility - subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
          
          {slides[currentSlide].title && (
             <div className="absolute bottom-12 left-8 md:left-16 text-white max-w-xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-2">{slides[currentSlide].title}</h2>
                {slides[currentSlide].subtitle && <p className="text-sm md:text-lg opacity-90">{slides[currentSlide].subtitle}</p>}
                {slides[currentSlide].button_text && slides[currentSlide].button_link && (
                  <a href={slides[currentSlide].button_link} className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
                    {slides[currentSlide].button_text}
                  </a>
                )}
             </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Subtle on hover */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20 z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/20 z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination Dots - Matching the image style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {slides.map((_: any, idx: number) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              currentSlide === idx ? "bg-white w-6" : "bg-white/40 w-1.5"
            )}
          />
        ))}
      </div>
    </div>
  );
}



