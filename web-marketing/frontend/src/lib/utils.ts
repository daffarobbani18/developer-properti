import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Menggabungkan class Tailwind dengan aman (dedup, override).
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.2
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
