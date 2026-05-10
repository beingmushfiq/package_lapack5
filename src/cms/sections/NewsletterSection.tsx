import React, { useState } from 'react';
import { CMSSectionProps } from '../types';
import { Send, CheckCircle2 } from 'lucide-react';
import { mergeStyles } from '../StyleEngine';

export default function NewsletterSection({ section }: CMSSectionProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Simulate API call
    console.log('Subscribing:', email);
    setIsSubmitted(true);
    setEmail('');
  };

  const { className, style } = mergeStyles('py-12', section.styles);

  return (
    <section 
      id={section.css_id}
      className={`${className} ${section.css_classes || ''}`}
      style={style}
    >
      <div className="bg-emerald-600 rounded-[2rem] p-8 md:p-16 text-center text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {section.title || 'Subscribe to our newsletter'}
          </h2>
          <p className="text-emerald-50 text-lg mb-8 opacity-90">
            Get the latest updates on new products and upcoming sales.
          </p>

          {isSubmitted ? (
            <div className="flex flex-col items-center animate-bounce-in">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Thank you for subscribing!</h3>
              <p className="text-emerald-100">Check your email for a special welcome offer.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-white/70 hover:text-white text-sm underline"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-6 py-4 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-lg shadow-xl"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2"
              >
                Subscribe
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
          
          <p className="mt-6 text-xs text-emerald-100/70">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </div>
    </section>
  );
}
