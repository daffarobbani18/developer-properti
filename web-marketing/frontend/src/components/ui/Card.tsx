import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Komponen Card reusable — dengan atau tanpa gambar.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.3
 */

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Tampilkan gambar thumbnail di bagian atas */
  image?: ReactNode;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  image,
  hoverEffect = true,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-[12px] overflow-hidden',
        'shadow-[0_1px_2px_rgba(0,0,0,0.05)]',
        hoverEffect &&
          'transition-all duration-200 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {image && <div className="overflow-hidden">{image}</div>}
      <div className="p-4 md:p-5">{children}</div>
    </div>
  );
}

/** Sub-komponen: judul kartu */
export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h4
      className={cn(
        'text-[18px] md:text-[20px] font-medium text-[#111827] leading-snug',
        className,
      )}
    >
      {children}
    </h4>
  );
}

/** Sub-komponen: body teks kartu */
export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-[#374151] leading-relaxed', className)}>
      {children}
    </p>
  );
}
