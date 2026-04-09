import { cn } from '@/lib/utils';
import type { UnitStatus } from '@/types';

/**
 * Komponen Badge — status unit dan label umum.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.3
 */

type BadgeVariant = UnitStatus | 'info' | 'warning' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  tersedia: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  indent:   'bg-yellow-100 text-yellow-700 border border-yellow-200',
  terjual:  'bg-red-100 text-red-600 border border-red-200',
  info:     'bg-blue-100 text-blue-700 border border-blue-200',
  warning:  'bg-orange-100 text-orange-700 border border-orange-200',
  default:  'bg-[#EEF1F4] text-[#374151] border border-[#E2E8F0]',
};

const statusLabel: Partial<Record<UnitStatus, string>> = {
  tersedia: 'Tersedia',
  indent:   'Indent',
  terjual:  'Terjual',
};

export default function Badge({
  variant = 'default',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Badge khusus status unit */
export function StatusBadge({ status }: { status: UnitStatus }) {
  return (
    <Badge variant={status}>
      {statusLabel[status] ?? status}
    </Badge>
  );
}
