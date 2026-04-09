/**
 * Formatter utilities — format angka, mata uang, nomor HP
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.1
 */

/**
 * Format angka ke format Rupiah Indonesia
 * @example formatRupiah(350000000) → "Rp 350.000.000"
 */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format angka ke format Rupiah ringkas (juta)
 * @example formatRupiahRingkas(350000000) → "Rp 350 jt"
 */
export function formatRupiahRingkas(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)} jt`;
  }
  return formatRupiah(value);
}

/**
 * Format luas tanah/bangunan
 * @example formatLuas(45) → "45 m²"
 */
export function formatLuas(m2: number): string {
  return `${m2} m²`;
}

/**
 * Normalisasi nomor HP ke format internasional (tanpa +)
 * @example normalizePhone("081234567890") → "6281234567890"
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('08')) return `62${digits.slice(1)}`;
  if (digits.startsWith('628')) return digits;
  return digits;
}

/**
 * Format tanggal ke ID locale
 * @example formatTanggal(new Date()) → "26 Februari 2026"
 */
export function formatTanggal(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
