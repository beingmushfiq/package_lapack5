// CountdownTimerSection — CMS-driven countdown timer with promo messaging
import { useState, useEffect } from 'react';
import type { CMSSectionProps } from '../types';
import { resolveStyles } from '../StyleEngine';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-2xl sm:text-4xl font-black text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-1.5 text-xs font-semibold text-white/80 uppercase tracking-widest">{label}</span>
    </div>
  );
}

export default function CountdownTimerSection({ section }: CMSSectionProps) {
  const cfg = section.components ?? {};
  const targetDate = cfg.target_date ?? new Date(Date.now() + 24 * 3600000).toISOString();
  const title = cfg.title ?? 'Limited Time Offer';
  const subtitle = cfg.subtitle ?? 'Hurry up before the deal ends!';
  const buttonText = cfg.button_text ?? 'Shop Now';
  const buttonUrl = cfg.button_url ?? '/allproducts';
  const bgColor = cfg.bg_color ?? '#ef4444';

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(targetDate));
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = calculateTimeLeft(targetDate);
      setTimeLeft(tl);
      if (tl.days === 0 && tl.hours === 0 && tl.minutes === 0 && tl.seconds === 0) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const containerStyle = resolveStyles(section.styles);

  return (
    <section
      className="py-12 px-4"
      style={{ background: bgColor, ...containerStyle }}
    >
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">{title}</h2>
          <p className="mt-2 text-white/80 text-sm sm:text-base">{subtitle}</p>
        </div>

        {expired ? (
          <p className="text-white font-bold text-xl">⏰ Offer has ended!</p>
        ) : (
          <div className="flex items-start justify-center gap-3 sm:gap-6">
            <Digit value={timeLeft.days} label="Days" />
            <span className="text-3xl font-black text-white/60 mt-3">:</span>
            <Digit value={timeLeft.hours} label="Hours" />
            <span className="text-3xl font-black text-white/60 mt-3">:</span>
            <Digit value={timeLeft.minutes} label="Mins" />
            <span className="text-3xl font-black text-white/60 mt-3">:</span>
            <Digit value={timeLeft.seconds} label="Secs" />
          </div>
        )}

        {buttonText && (
          <a
            href={buttonUrl}
            className="inline-block px-8 py-3 bg-white text-gray-900 font-bold rounded-full text-sm hover:scale-105 transition-transform shadow-xl"
          >
            {buttonText} →
          </a>
        )}
      </div>
    </section>
  );
}
