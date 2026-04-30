// ============================================================
// Spacer Component
// Configurable vertical spacing from CMS.
// ============================================================

import type { CMSSectionProps } from '../types';

export default function Spacer({ section }: CMSSectionProps) {
  const height = section.components?.height || '48px';
  const showDivider = section.components?.showDivider ?? false;

  return (
    <div style={{ height }} className="relative">
      {showDivider && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <hr className="border-gray-200" />
        </div>
      )}
    </div>
  );
}
