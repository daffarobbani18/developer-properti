const fs = require('fs');

const colorsContent = `/**
 * Unified Design Tokens - Color System
 * Premium Clean Glass Enterprise Edition
 */
export const colors = {
  primary: '#0A2540', 
  primary600: '#14416E',
  primaryLight: '#326B9C',
  primaryDark: '#030E19',
  accent: '#20C997',
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
`;

fs.writeFileSync('src/theme/colors.ts', colorsContent);
console.log('Updated colors.ts');

let uiContent = fs.readFileSync('src/components/ui.tsx', 'utf8');

// Add LinearGradient import if missing
if (!uiContent.includes('LinearGradient')) {
    uiContent = uiContent.replace(
        /import \{ Ionicons \} from "@expo\/vector-icons";/,
        'import { Ionicons } from "@expo/vector-icons";\nimport { LinearGradient } from "expo-linear-gradient";'
    );
}

// Modify ScreenShell Header to use LinearGradient
uiContent = uiContent.replace(
    /<View style=\{styles\.headerRow\}>/g,
    '<LinearGradient colors={[c.primary, c.primary600]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerRow}>'
);
uiContent = uiContent.replace(
    /<\/View>(\s*)<KeyboardAvoidingView/g,
    '</LinearGradient>$1<KeyboardAvoidingView'
);

// We must also update the header text colors since background is now dark blue
// We'll just do it in the stylesheet replacement below

// Update Card to have premium styling
uiContent = uiContent.replace(
    /card: \{[\s\S]*?\},/,
    `card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },`
);

// Update Header styles
uiContent = uiContent.replace(
    /headerRow: \{[\s\S]*?\},/,
    `headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingBottom: 24, // extra padding for overlap
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },`
);
uiContent = uiContent.replace(
    /headerTitle: \{[\s\S]*?\},/,
    `headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },`
);
uiContent = uiContent.replace(
    /headerSubtitle: \{[\s\S]*?\},/,
    `headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },`
);

// Update Primary Button to have a gradient or at least premium colors
uiContent = uiContent.replace(
    /export function PrimaryButton[\s\S]*?<\/Pressable>\s*\);\s*\}/,
    `export function PrimaryButton({ label, onPress, loading, disabled, style, icon }: { label: string; onPress: () => void; loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>; icon?: keyof typeof Ionicons.glyphMap }): React.JSX.Element {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading} style={({ pressed }) => [styles.primaryButton, (disabled || loading) && styles.buttonDisabled, pressed && styles.buttonPressed, style]}>
      <LinearGradient colors={[c.primary600, c.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFillObject} />
      {loading ? <ActivityIndicator color="#ffffff" style={{ marginRight: 8 }} /> : icon ? <Ionicons name={icon} size={18} color="#ffffff" style={{ marginRight: 8 }} /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}`
);

uiContent = uiContent.replace(
    /primaryButton: \{[\s\S]*?\},/,
    `primaryButton: {
    borderRadius: 14,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    overflow: 'hidden', // to contain the gradient
    shadowColor: c.primary600,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },`
);

uiContent = uiContent.replace(
    /secondaryButton: \{[\s\S]*?\},/,
    `secondaryButton: {
    borderRadius: 14,
    minHeight: 52,
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: c.neutral200,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },`
);

uiContent = uiContent.replace(
    /input: \{[\s\S]*?\},/,
    `input: {
    borderWidth: 1.5,
    borderColor: c.neutral200,
    borderRadius: 12,
    backgroundColor: c.neutral50,
    color: c.neutral900,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },`
);

uiContent = uiContent.replace(
    /inputFocused: \{[\s\S]*?\},/,
    `inputFocused: {
    borderColor: c.accent,
    backgroundColor: '#ffffff',
    shadowColor: c.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },`
);

fs.writeFileSync('src/components/ui.tsx', uiContent);
console.log('Updated ui.tsx');
