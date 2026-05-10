// ============================================================
// AnnouncementBar
// CMS-driven dismissible site-wide announcement banner.
// Reads from /api/v1/cms/announcement-bar
// ============================================================

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCMSAnnouncementBars } from '../lib/queries';
import type { CMSAnnouncementBar } from '../cms/types';

const DISMISS_KEY = 'cms_dismissed_bars';

function getDismissed(): number[] {
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) || '[]');
  } catch {
    return [];
  }
}

function markDismissed(id: number) {
  const dismissed = getDismissed();
  if (!dismissed.includes(id)) {
    localStorage.setItem(DISMISS_KEY, JSON.stringify([...dismissed, id]));
  }
}

interface BarProps {
  bar: CMSAnnouncementBar;
  onDismiss: (id: number) => void;
}

function BarItem({ bar, onDismiss }: BarProps) {
  return (
    <div
      className="relative flex items-center justify-center px-4 py-2.5 text-sm font-medium"
      style={{ backgroundColor: bar.background_color, color: bar.text_color }}
    >
      <span
        className="text-center"
        dangerouslySetInnerHTML={{ __html: bar.content }}
      />
      {bar.link_url && bar.link_text && (
        <a
          href={bar.link_url}
          className="ml-2 underline font-semibold hover:opacity-80 transition-opacity"
          style={{ color: bar.text_color }}
        >
          {bar.link_text} →
        </a>
      )}
      {bar.is_dismissible && (
        <button
          onClick={() => onDismiss(bar.id)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" style={{ color: bar.text_color }} />
        </button>
      )}
    </div>
  );
}

export default function AnnouncementBar() {
  const { data: bars } = useCMSAnnouncementBars();
  const [dismissed, setDismissed] = useState<number[]>(getDismissed);

  if (!bars || bars.length === 0) return null;

  const topBars = bars.filter((b: CMSAnnouncementBar) => b.position === 'top' && !dismissed.includes(b.id));
  if (topBars.length === 0) return null;

  const handleDismiss = (id: number) => {
    markDismissed(id);
    setDismissed(prev => [...prev, id]);
  };

  return (
    <div className="w-full z-50">
      {topBars.map((bar: CMSAnnouncementBar) => (
        <BarItem key={bar.id} bar={bar} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
