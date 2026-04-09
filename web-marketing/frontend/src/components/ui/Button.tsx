import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Komponen Button reusable — variants, sizes, ikon support.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.3
 */

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-[#1E3A5F] text-white hover:bg-[#2D5F8B] active:bg-[#163050] disabled:opacity-50',
  secondary:
    'bg-[#D4A843] text-[#1E3A5F] hover:bg-[#c49a38] active:bg-[#b38a2e] disabled:opacity-50',
  outline:
    'border-2 border-[#1E3A5F] text-[#1E3A5F] bg-transparent hover:bg-[#1E3A5F] hover:text-white active:bg-[#163050] disabled:opacity-50',
  ghost:
    'text-[#1E3A5F] bg-transparent hover:bg-[#EEF1F4] active:bg-[#e2e8f0] disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      fullWidth = false,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center font-semibold rounded-[8px]',
          'transition-all duration-200 cursor-pointer select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A5F]',
          // Variant & size
          variantClasses[variant],
          sizeClasses[size],
          // Full width: selalu di mobile, opsional di desktop
          fullWidth ? 'w-full' : 'w-full sm:w-auto',
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          iconLeft
        )}
        {children}
        {!loading && iconRight}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
