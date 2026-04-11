import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop",
    bgColor: "bg-gray-100",
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1600&auto=format&fit=crop",
    bgColor: "bg-gray-100",
  },
  {
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1600&auto=format&fit=crop",
    bgColor: "bg-gray-100",
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="relative w-full h-[205px] sm:h-[305px] md:h-[385px] overflow-hidden group touch-none rounded-xl sm:rounded-2xl shadow-sm">
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
            src={SLIDES[currentSlide].image}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Overlay for better text/dot visibility if needed */}
          <div className="absolute inset-0 bg-black/10" />
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
        {SLIDES.map((_, idx) => (
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



