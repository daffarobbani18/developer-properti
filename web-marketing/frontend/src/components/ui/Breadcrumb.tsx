import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb — navigasi breadcrumb untuk halaman detail.
 * Struktur: Beranda > Kategori > [Current Page]
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={`flex items-center gap-1 text-sm text-[#64748B] ${className || ''}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={16} className="text-[#CBD5E1]" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-[#1E3A5F] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#111827] font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
