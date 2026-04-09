import Link from 'next/link';
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';
import { SITE_NAME, NAV_LINKS, KONTAK, JAM_OPERASIONAL } from '@/lib/constants';

/**
 * Footer — 4 kolom (desktop) → 2 kolom (tablet) → 1 kolom (mobile).
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.4
 */

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#111827] text-[#CBD5E1]">
      {/* Main footer */}
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Kolom 1 — Identitas */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[#D4A843] flex items-center justify-center flex-shrink-0">
                <span className="text-[#1E3A5F] text-sm font-bold">G</span>
              </div>
              <span className="text-white font-bold text-lg">{SITE_NAME}</span>
            </div>
            <p className="text-sm leading-relaxed text-[#94A3B8]">
              Hadirkan hunian nyaman di lokasi strategis dengan desain modern dan
              fasilitas lengkap untuk keluarga Indonesia.
            </p>
          </div>

          {/* Kolom 2 — Navigasi */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-[#D4A843] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3 — Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="flex flex-col gap-3">
              <li className="flex gap-2.5 text-sm text-[#94A3B8]">
                <MapPin size={16} className="text-[#D4A843] mt-0.5 flex-shrink-0" />
                <span>{KONTAK.alamat}</span>
              </li>
              <li>
                <a
                  href={`tel:${KONTAK.telepon}`}
                  className="flex gap-2.5 text-sm text-[#94A3B8] hover:text-[#D4A843] transition-colors"
                >
                  <Phone size={16} className="text-[#D4A843] flex-shrink-0" />
                  {KONTAK.telepon}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${KONTAK.email}`}
                  className="flex gap-2.5 text-sm text-[#94A3B8] hover:text-[#D4A843] transition-colors"
                >
                  <Mail size={16} className="text-[#D4A843] flex-shrink-0" />
                  {KONTAK.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4 — Jam Operasional & Sosmed */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Jam Operasional
            </h4>
            <ul className="flex flex-col gap-2 mb-6">
              {JAM_OPERASIONAL.map((item) => (
                <li key={item.hari} className="flex gap-2 text-sm text-[#94A3B8]">
                  <Clock size={14} className="text-[#D4A843] mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="text-[#CBD5E1]">{item.hari}:</span> {item.jam}
                  </span>
                </li>
              ))}
            </ul>

            {/* Social media */}
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Media Sosial
            </h4>
            <div className="flex gap-3">
              {KONTAK.instagram && (
                <a
                  href={KONTAK.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#D4A843] hover:bg-[#374151] transition-colors"
                >
                  <Instagram size={16} />
                </a>
              )}
              {KONTAK.facebook && (
                <a
                  href={KONTAK.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#D4A843] hover:bg-[#374151] transition-colors"
                >
                  <Facebook size={16} />
                </a>
              )}
              {KONTAK.youtube && (
                <a
                  href={KONTAK.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#94A3B8] hover:text-[#D4A843] hover:bg-[#374151] transition-colors"
                >
                  <Youtube size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-[#1E293B]">
        <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#475569]">
            © {year} {SITE_NAME}. Semua hak dilindungi.
          </p>
          <p className="text-xs text-[#475569]">
            Dikembangkan untuk SIMDP
          </p>
        </div>
      </div>
    </footer>
  );
}
