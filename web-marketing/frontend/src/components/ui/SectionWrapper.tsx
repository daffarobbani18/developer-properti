import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * SectionWrapper — container layout konsisten antar section.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.3
 */

type BgVariant = 'white' | 'light' | 'primary' | 'dark';
type SpacingVariant = 'sm' | 'md' | 'lg';

interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
  innerClassName?: string;
  background?: BgVariant;
  spacing?: SpacingVariant;
  /** Judul section (H2) */
  title?: string;
  /** Subtitle / deskripsi di bawah title */
  subtitle?: string;
  /** Warna teks judul ketika background gelap */
  titleLight?: boolean;
}

const bgClasses: Record<BgVariant, string> = {
  white:   'bg-white',
  light:   'bg-[#F8FAFB]',
  primary: 'bg-[#1E3A5F]',
  dark:    'bg-[#111827]',
};

const spacingClasses: Record<SpacingVariant, string> = {
  sm: 'py-8  md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
};

export default function SectionWrapper({
  children,
  id,
  className,
  innerClassName,
  background = 'white',
  spacing = 'md',
  title,
  subtitle,
  titleLight,
}: SectionWrapperProps) {
  const isLight = titleLight ?? (background === 'primary' || background === 'dark');

  return (
    <section
      id={id}
      className={cn(bgClasses[background], spacingClasses[spacing], className)}
    >
      <div className={cn('container-site', innerClassName)}>
        {(title || subtitle) && (
          <div className="text-center mb-10 md:mb-14">
            {title && (
              <h2
                className={cn(
                  'text-[24px] md:text-[36px] font-semibold leading-tight mb-3',
                  isLight ? 'text-white' : 'text-[#111827]',
                )}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={cn(
                  'text-sm md:text-base max-w-xl mx-auto',
                  isLight ? 'text-[#CBD5E1]' : 'text-[#64748B]',
                )}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
