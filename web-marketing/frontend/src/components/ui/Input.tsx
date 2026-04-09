'use client';

import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

/**
 * Komponen Input & Textarea — style konsisten, label, error state.
 * Sesuai: docs/fase-pengembangan/website-marketing-frontend.md §1.3
 */

/* ===================== Base styles ===================== */

const baseInput = [
  'w-full rounded-[8px] border border-[#CBD5E1] bg-white px-3 py-2.5',
  'text-[#111827] text-sm placeholder:text-[#94A3B8]',
  'transition-colors duration-150',
  'focus:outline-none focus:border-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F]/20',
  'disabled:bg-[#F8FAFB] disabled:text-[#94A3B8] disabled:cursor-not-allowed',
].join(' ');

const errorBorder = 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20';

/* ===================== Wrapper & Label ===================== */

interface FieldWrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldWrapper({
  label,
  htmlFor,
  error,
  helperText,
  required,
  children,
  className,
}: FieldWrapperProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-[#374151]"
        >
          {label}
          {required && <span className="text-[#E74C3C] ml-0.5">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-[#E74C3C]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
}

/* ===================== Input ===================== */

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, required, id, ...props }, ref) => (
    <FieldWrapper
      label={label}
      htmlFor={id}
      error={error}
      helperText={helperText}
      required={required}
    >
      <input
        ref={ref}
        id={id}
        required={required}
        className={cn(baseInput, error && errorBorder, className)}
        {...props}
      />
    </FieldWrapper>
  ),
);
Input.displayName = 'Input';

/* ===================== Textarea ===================== */

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, required, id, ...props }, ref) => (
    <FieldWrapper
      label={label}
      htmlFor={id}
      error={error}
      helperText={helperText}
      required={required}
    >
      <textarea
        ref={ref}
        id={id}
        required={required}
        rows={4}
        className={cn(baseInput, 'resize-y', error && errorBorder, className)}
        {...props}
      />
    </FieldWrapper>
  ),
);
Textarea.displayName = 'Textarea';

/* ===================== Select ===================== */

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, required, id, ...props }, ref) => (
    <FieldWrapper
      label={label}
      htmlFor={id}
      error={error}
      helperText={helperText}
      required={required}
    >
      <select
        ref={ref}
        id={id}
        required={required}
        className={cn(baseInput, 'cursor-pointer', error && errorBorder, className)}
        {...props}
      >
        <option value="">-- Pilih --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  ),
);
Select.displayName = 'Select';

export { Input, Textarea, Select };
export default Input;
