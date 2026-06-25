/**
 * Unified Design Tokens - Color System
 * Premium Clean Glass Enterprise Edition
 */
export const colors = {
  primary: '#0F172A', // Deep Slate
  primary600: '#1E293B',
  primaryLight: '#334155',
  primaryDark: '#020617',
  accent: '#2563EB', // Blue 600
  overdue: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', icon: '#DC2626' },
  semanticColors: {
    critical: { bg: "#fff0ee", text: "#8e3128", border: "#ffe2dd", outline: "#c0392b" },
    high: { bg: "#fff7e5", text: "#805f24", border: "#fff3d3", outline: "#e67e22" },
    medium: { bg: "#edf9f1", text: "#2f6a44", border: "#e6f5eb", outline: "#27ae60" },
    low: { bg: "#fffbeb", text: "#92400e", border: "#fef3c7", outline: "#f59e0b" },
  },
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  success: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
  warning: { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  danger: { bg: '#FEF2F2', text: '#BE123C', border: '#FECACA' },
  info: { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  overlay: 'rgba(15, 23, 42, 0.65)',
};

export const c = {
   primary: colors.primary,
   primary600: colors.primary600,
   primaryLight: colors.primaryLight,
   primaryDark: colors.primaryDark,
   accent: colors.accent,
   overdue: colors.overdue,
   neutral: colors.neutral,
   success: colors.success,
   warning: colors.warning,
   danger: colors.danger,
   info: colors.info,
   overlay: colors.overlay,
   semanticColors: colors.semanticColors,
   neutral50: colors.neutral[50],
   neutral100: colors.neutral[100],
   neutral200: colors.neutral[200],
   neutral300: colors.neutral[300],
   neutral400: colors.neutral[400],
   neutral500: colors.neutral[500],
   neutral600: colors.neutral[600],
   neutral700: colors.neutral[700],
   neutral800: colors.neutral[800],
   neutral900: colors.neutral[900],
} as const;
