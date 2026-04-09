'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildWaUrl } from '@/lib/constants';

/**
 * WhatsApp Floating Button — fixed bottom-right, pulse animation, tooltip.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.4
 */

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      <div
        className={cn(
          'bg-[#111827] text-white text-xs px-3 py-1.5 rounded-lg',
          'transition-all duration-200 pointer-events-none select-none',
          'whitespace-nowrap shadow-lg',
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
        )}
      >
        Chat via WhatsApp
        {/* Karet bawah */}
        <span className="absolute -bottom-1 right-5 w-2 h-2 bg-[#111827] rotate-45" />
      </div>

      {/* Button */}
      <a
        href={buildWaUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          'relative flex items-center justify-center',
          'w-14 h-14 rounded-full bg-[#25D366] text-white',
          'shadow-[0_4px_12px_rgba(37,211,102,0.4)]',
          'hover:bg-[#20bf5c] hover:scale-110',
          'active:scale-95 transition-all duration-200',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]',
        )}
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping"
          aria-hidden="true"
        />
        <MessageCircle size={26} className="relative z-10" />
      </a>
    </div>
  );
}
