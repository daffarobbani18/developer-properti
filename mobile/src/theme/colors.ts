/**
 * Unified Design Tokens - Color System
 * [UI-FIX-V2] Remediation based on design-spec + audit — SIMDP Mobile v1.1
 */
export const colors = {
  primary: '#f59e0b', // Amber 500
  primary600: '#d97706', // Amber 600
  primaryLight: '#fcd34d', // Amber 300
  primaryDark: '#0f172a', // Slate 900 (Black)
  overdue: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA', icon: '#DC2626' },
  semanticColors: {
    critical: { bg: "#fff0ee", text: "#8e3128", border: "#ffe2dd", outline: "#c0392b" },
    high: { bg: "#fff7e5", text: "#805f24", border: "#fff3d3", outline: "#e67e22" },
    medium: { bg: "#edf9f1", text: "#2f6a44", border: "#e6f5eb", outline: "#27ae60" },
    low: { bg: "#fffbeb", text: "#92400e", border: "#fef3c7", outline: "#f59e0b" },
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    bg: '#dcfce7',
    text: '#166534',
    border: '#bbf7d0',
  },
  warning: {
    bg: '#fef3c7',
    text: '#92400e',
    border: '#fde68a',
  },
  danger: {
    bg: '#fee2e2',
    text: '#991b1b',
    border: '#fecaca',
  },
  info: {
    bg: '#f0f9ff',
    text: '#0c4a6e',
    border: '#bae6fd',
  },
  overlay: 'rgba(0,0,0,0.50)',
};

export const c = {
   primary: colors.primary,
   primary600: colors.primary600,
   primaryLight: colors.primaryLight,
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
