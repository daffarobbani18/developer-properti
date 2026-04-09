import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Komponen Typography — heading H1–H4 dengan size responsif bawaan.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §tipografi
 */

interface TypoProps {
  children: ReactNode;
  className?: string;
}

/** H1 — Hero: 32px (mobile) → 48px (desktop) */
export function H1({ children, className }: TypoProps) {
  return (
    <h1
      className={cn(
        'text-[32px] md:text-[48px] font-bold leading-tight text-[#111827]',
        className,
      )}
    >
      {children}
    </h1>
  );
}

/** H2 — Section Title: 24px (mobile) → 36px (desktop) */
export function H2({ children, className }: TypoProps) {
  return (
    <h2
      className={cn(
        'text-[24px] md:text-[36px] font-semibold leading-tight text-[#111827]',
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** H3 — Subsection: 20px (mobile) → 24px (desktop) */
export function H3({ children, className }: TypoProps) {
  return (
    <h3
      className={cn(
        'text-[20px] md:text-[24px] font-semibold leading-snug text-[#111827]',
        className,
      )}
    >
      {children}
    </h3>
  );
}

/** H4 — Card Title: 18px (mobile) → 20px (desktop) */
export function H4({ children, className }: TypoProps) {
  return (
    <h4
      className={cn(
        'text-[18px] md:text-[20px] font-medium leading-snug text-[#111827]',
        className,
      )}
    >
      {children}
    </h4>
  );
}

/** Paragraph body: 14px (mobile) → 16px (desktop) */
export function Paragraph({ children, className }: TypoProps) {
  return (
    <p
      className={cn(
        'text-[14px] md:text-[16px] font-normal leading-relaxed text-[#374151]',
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Caption / small text */
export function Caption({ children, className }: TypoProps) {
  return (
    <span
      className={cn(
        'text-[12px] md:text-[14px] font-normal leading-normal text-[#64748B]',
        className,
      )}
    >
      {children}
    </span>
  );
}
