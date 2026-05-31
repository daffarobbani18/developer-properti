/**
 * Unified Design Tokens - Spacing System
 *
 * Base unit : 4 px
 * Rationale: React Native default + matches Tailwind spacing scale
 * Reference : docs/ui-design-analysis-report.md §4
 */

export const spacing = {
  /** 4 px  — xs: icon-to-label tight gap */
  xs: 4,
  /** 8 px  — sm: element-to-element gap inside card */
  sm: 8,
  /** 12 px — md: section gap / beneath label */
  md: 12,
  /** 16 px — lg: screen edge padding / component internal padding */
  lg: 16,
  /** 20 px — xl: between unrelated sections */
  xl: 20,
  /** 24 px — xxl: card-to-card vertical rhythm */
  xxl: 24,
  /** 32 px */
  xxxl: 32,
  /** 64 px */
  huge: 64,
} as const;

/** Helpers that map directly to StyleSheet values  */
export const gap   = (n: number)    => ({ gap:   n })   as const;
export const padV  = (n: number)    => ({ paddingVertical:   n }) as const;
export const padH  = (n: number)    => ({ paddingHorizontal: n }) as const;
export const marV  = (n: number)    => ({ marginVertical:   n })   as const;
export const marH  = (n: number)    => ({ marginHorizontal: n })   as const;
