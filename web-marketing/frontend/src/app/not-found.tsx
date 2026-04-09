import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Halaman Tidak Ditemukan',
};

/**
 * Custom 404 page
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §6.3
 */
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[96px] md:text-[120px] font-bold text-[#EEF1F4] leading-none mb-4">
          404
        </p>
        <h1 className="text-[24px] md:text-[32px] font-semibold text-[#111827] mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-[#64748B] text-sm md:text-base mb-8">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#1E3A5F] text-white px-6 py-3 rounded-[8px] font-semibold text-sm hover:bg-[#2D5F8B] transition-colors"
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
