/**
 * Unified Design Tokens - Typography Scale
 *
 * Mobile base : 14 px  →  harmonized to 16 px for body
 * Web base    : 16 px
 * Ratio       : 1.5 (golden-ratio influence)
 * Reference   : docs/ui-design-analysis-report.md §2.3 & §9.3
 *
 * [UI-FIX-V2] Typography weight revised: 700→600 untuk mengurangi visual heaviness
 */

export const typography = {
  /** 48 px — display / hero (used sparingly); required lg screens */
  display: { fontSize: 48, fontWeight: '600', lineHeight: 52.8 },

  /** 36 px — H1 / page title screens */
  h1:  { fontSize: 36, fontWeight: '600', lineHeight: 43.2 },

  /** 24 px — H2 / section heading (Android font-size threshold for  large text) */
  h2:  { fontSize: 24, fontWeight: '600', lineHeight: 30  },

  /** 20 px — H3 / card title or subsection */
  h3:  { fontSize: 20, fontWeight: '600', lineHeight: 26  },

  /** 16 px — body / paragraph  ← unified mobile ↔ web base size */
  body:{ fontSize: 16, fontWeight: '400', lineHeight: 24  },

  /** 14 px — button label / secondary body */
  sm:  { fontSize: 14, fontWeight: '400', lineHeight: 20  },

  /** 12 px — caption / meta / form label */
  xs:  { fontSize: 12, fontWeight: '400', lineHeight: 16.8 },
} as const;

/** Helper: produce a Text style object from a token key */
export const T = (key: keyof typeof typography) => typography[key];
