'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_NAME, NAV_LINKS, buildWaUrl } from '@/lib/constants';
import Button from '@/components/ui/Button';
import MobileMenu from './MobileMenu';

/**
 * Navbar — sticky, backdrop-blur saat scroll, active state per halaman.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.4
 */

export default function Navbar() {
  const pathname   = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Tambah shadow + backdrop-blur saat scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.08)]'
            : 'bg-white',
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16 md:h-[70px]">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-[#1E3A5F] font-bold text-lg hover:opacity-80 transition-opacity"
            >
              {/* Placeholder logo — ganti dengan <Image> saat aset tersedia */}
              <div className="w-8 h-8 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <span className="hidden sm:inline">{SITE_NAME}</span>
            </Link>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'text-[#1E3A5F] bg-[#EEF1F4]'
                      : 'text-[#374151] hover:text-[#1E3A5F] hover:bg-[#EEF1F4]',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="hidden lg:inline-flex"
                onClick={() => window.open(buildWaUrl(), '_blank')}
              >
                Hubungi Kami
              </Button>

              {/* Hamburger — hanya di mobile/tablet */}
              <button
                onClick={() => setMenuOpen(true)}
                aria-label="Buka menu navigasi"
                className="lg:hidden p-2 rounded-lg text-[#374151] hover:bg-[#EEF1F4] transition-colors"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer agar konten tidak tertutup navbar sticky */}
      <div className="h-16 md:h-[70px]" aria-hidden="true" />

      {/* Mobile drawer */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeHref={pathname}
      />
    </>
  );
}
