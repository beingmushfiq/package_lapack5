// ============================================================
// PopupManager
// CMS-driven popup system. Reads from /api/v1/cms/popups.
// Supports: delay, exit_intent, scroll, and page_load triggers.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useCMSPopups } from '../lib/queries';
import type { CMSPopup } from '../cms/types';
import { shouldRender } from '../cms/VisibilityEngine';
import { useAuth } from '../lib/AuthContext';

const SHOWN_KEY = 'cms_popups_shown';

function getShownPopups(): number[] {
  try {
    return JSON.parse(sessionStorage.getItem(SHOWN_KEY) || '[]');
  } catch {
    return [];
  }
}

function markShown(id: number) {
  const shown = getShownPopups();
  if (!shown.includes(id)) {
    sessionStorage.setItem(SHOWN_KEY, JSON.stringify([...shown, id]));
  }
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-2xl',
};

const positionClasses: Record<string, string> = {
  center: 'items-center justify-center',
  'bottom-left': 'items-end justify-start p-4',
  'bottom-right': 'items-end justify-end p-4',
  top: 'items-start justify-center pt-10',
};

interface SinglePopupProps {
  popup: CMSPopup;
  onClose: () => void;
}

function SinglePopup({ popup, onClose }: SinglePopupProps) {
  const posClass = positionClasses[popup.position] ?? positionClasses.center;
  const sizeClass = sizeClasses[popup.size] ?? sizeClasses.md;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex bg-black/50 backdrop-blur-sm ${posClass}`}
      onClick={(e) => { if (e.target === e.currentTarget && popup.is_dismissible) onClose(); }}
    >
      <div className={`w-full ${sizeClass} bg-white rounded-2xl shadow-2xl overflow-hidden relative`}>
        {/* Close button */}
        {popup.is_dismissible && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Popup image */}
        {popup.image && (
          <img
            src={popup.image}
            alt={popup.title ?? 'Promotion'}
            className="w-full h-48 object-cover"
          />
        )}

        {/* Content */}
        <div className="p-6 text-center space-y-3">
          {!popup.image && (
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6 text-emerald-600" />
            </div>
          )}

          {popup.title && (
            <h3 className="text-xl font-black text-gray-900">{popup.title}</h3>
          )}

          {popup.content && (
            <div
              className="text-gray-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: popup.content }}
            />
          )}

          <div className="flex flex-col gap-2 pt-2">
            {popup.button_text && popup.button_url && (
              <a
                href={popup.button_url}
                onClick={onClose}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-sm"
              >
                {popup.button_text}
              </a>
            )}
            {popup.is_dismissible && (
              <button
                onClick={onClose}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                No thanks, maybe later
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PopupManager() {
  const { data: popups } = useCMSPopups();
  const { user } = useAuth();
  const [activePopup, setActivePopup] = useState<CMSPopup | null>(null);
  const currentPath = window.location.pathname;

  const tryShowPopup = useCallback((popup: CMSPopup) => {
    if (getShownPopups().includes(popup.id)) return;
    // Check if popup should show on this page
    if (popup.show_on_pages && popup.show_on_pages.length > 0) {
      const match = popup.show_on_pages.some(p => currentPath === p || currentPath.startsWith(p));
      if (!match) return;
    }
    // Check visibility rules
    // @ts-ignore
    if (!shouldRender(popup.visibility_rules, !!user, user?.role)) return;

    setActivePopup(popup);
    markShown(popup.id);
  }, [user, currentPath]);

  useEffect(() => {
    if (!popups || popups.length === 0) return;
    const shown = getShownPopups();
    const eligible = popups.filter((p: CMSPopup) => !shown.includes(p.id));

    eligible.forEach((popup: CMSPopup) => {
      if (popup.trigger === 'delay') {
        setTimeout(() => tryShowPopup(popup), (popup.trigger_delay ?? 3) * 1000);
      } else if (popup.trigger === 'page_load') {
        tryShowPopup(popup);
      } else if (popup.trigger === 'scroll') {
        const threshold = popup.trigger_scroll ?? 50;
        const handleScroll = () => {
          const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (scrollPct >= threshold) {
            tryShowPopup(popup);
            window.removeEventListener('scroll', handleScroll);
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
      } else if (popup.trigger === 'exit_intent') {
        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            tryShowPopup(popup);
            document.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
      }
    });
  }, [popups, tryShowPopup]);

  if (!activePopup) return null;

  return (
    <SinglePopup
      popup={activePopup}
      onClose={() => setActivePopup(null)}
    />
  );
}
