// FlashDealBannerSection — CMS flash deal with countdown + products
import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import type { CMSSectionProps } from '../types';
import { useProducts } from '../../lib/queries';

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function FlashDealBannerSection({ section, onAddToCart, onToggleWishlist, wishlistItems }: CMSSectionProps) {
  const cfg = section.components ?? {};
  const title = cfg.title ?? 'Flash Deal';
  const targetDate = cfg.target_date ?? new Date(Date.now() + 8 * 3600000).toISOString();
  const collection = cfg.collection ?? 'daily_offer';
  const limit = parseInt(cfg.limit ?? '6', 10);

  const { data: productData } = useProducts(undefined, undefined, collection);
  const products = productData?.data?.slice(0, limit) ?? [];

  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return setTimeLeft({ h: 0, m: 0, s: 0 });
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">{title}</h2>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-900 px-4 py-2 rounded-xl">
            <span className="text-xs text-gray-400 mr-1">Ends in</span>
            {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((v, i) => (
              <span key={i} className="flex items-center">
                <span className="bg-red-500 text-white text-sm font-black px-2 py-1 rounded-lg tabular-nums">{v}</span>
                {i < 2 && <span className="text-gray-400 mx-0.5">:</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {products.map((product: any) => (
            <div key={product.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {product.discount_price && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-lg z-10">
                    -{Math.round((1 - product.discount_price / product.price) * 100)}%
                  </span>
                )}
                <img src={product.image || product.images?.[0]?.image_url || '/placeholder.png'}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-700 font-medium line-clamp-2 leading-snug">{product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm font-black text-emerald-600">৳{product.discount_price ?? product.price}</span>
                  {product.discount_price && (
                    <span className="text-xs text-gray-400 line-through">৳{product.price}</span>
                  )}
                </div>
                <button onClick={() => onAddToCart?.(product)}
                  className="mt-2 w-full py-1.5 bg-emerald-50 hover:bg-emerald-500 hover:text-white text-emerald-600 text-xs font-semibold rounded-lg transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
