'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS, buildWaUrl } from '@/lib/constants';
import Button from '@/components/ui/Button';

/**
 * MobileMenu — drawer overlay full screen untuk navigasi mobile.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.4
 */

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeHref: string;
}

export default function MobileMenu({
  isOpen,
  onClose,
  activeHref,
}: MobileMenuProps) {
  // Lock body scroll saat menu terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-[280px] bg-white z-50 shadow-2xl',
          'flex flex-col transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEF1F4]">
          <span className="text-[#1E3A5F] font-bold text-lg">Menu</span>
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="p-2 rounded-lg text-[#374151] hover:bg-[#EEF1F4] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1 px-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'block px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    activeHref === link.href
                      ? 'bg-[#1E3A5F] text-white'
                      : 'text-[#374151] hover:bg-[#EEF1F4] hover:text-[#1E3A5F]',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA bawah */}
        <div className="px-5 py-5 border-t border-[#EEF1F4]">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              window.open(buildWaUrl(), '_blank');
              onClose();
            }}
          >
            Hubungi Kami
          </Button>
        </div>
      </div>
    </>
  );
}
