const fs = require('fs');

function refactorCustomerHome() {
    const file = 'src/screens/customer/CustomerHomeScreen.tsx';
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add missing imports if not there
    if (!content.includes('import { Ionicons } from "@expo/vector-icons"')) {
        content = content.replace(
            /import { colors } from "\.\.\/\.\.\/theme\/colors";/,
            'import { colors, c } from "../../theme/colors";\nimport { Ionicons } from "@expo/vector-icons";'
        );
    } else {
        content = content.replace(/import { colors } from "\.\.\/\.\.\/theme\/colors";/, 'import { colors, c } from "../../theme/colors";');
    }
    
    // 2. Replace Grid Buttons with Iconic versions
    const newGrid = `
        <View style={styles.quickActionGrid}>
          <Pressable
            onPress={() => goToTab("Progres")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: c.info.bg }]}>
              <Ionicons name="stats-chart" size={24} color={c.info.text} />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.quickActionTitle}>Lihat Progres</Text>
              <Text style={styles.quickActionCaption}>Pantau pembangunan</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={c.neutral400} />
          </Pressable>

          <Pressable
            onPress={() => goToTab("Tagihan")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: c.warning.bg }]}>
              <Ionicons name="receipt" size={24} color={c.warning.text} />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.quickActionTitle}>Tagihan</Text>
              <Text style={styles.quickActionCaption}>Cek invoice & bayar</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={c.neutral400} />
          </Pressable>

          <Pressable
            onPress={() => goToTab("Dokumen")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: c.success.bg }]}>
              <Ionicons name="document-text" size={24} color={c.success.text} />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.quickActionTitle}>Dokumen</Text>
              <Text style={styles.quickActionCaption}>Akses berkas legal</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={c.neutral400} />
          </Pressable>

          <Pressable
            onPress={() => goToTab("Bantuan")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: c.danger.bg }]}>
              <Ionicons name="headset" size={24} color={c.danger.text} />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text style={styles.quickActionTitle}>Bantuan</Text>
              <Text style={styles.quickActionCaption}>Buat tiket keluhan</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={c.neutral400} />
          </Pressable>
        </View>
`;
    // Find the old grid and replace it
    content = content.replace(/<View style=\{styles\.quickActionGrid\}>[\s\S]*?<\/View>/, newGrid.trim());

    // 3. Improve Unit Summary Section UI
    content = content.replace(
        /<FadeInView delay=\{0\} duration=\{500\}>[\s\S]*?<\/FadeInView>/,
        `<FadeInView delay={0} duration={500}>
              <View style={styles.unitRow}>
                <View>
                  <Text style={styles.unitCode}>{overview.unit.code}</Text>
                  <Text style={styles.unitType}>{overview.unit.typeName}</Text>
                </View>
                <Badge label={formatUnitStatusLabel(overview.unit.status)} tone={toneByUnitStatus(overview.unit.status)} />
              </View>
              <View style={{ marginTop: 16 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                  <Text style={styles.unitMeta}>Progress Pembangunan</Text>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: c.primary600 }}>{overview.unit.progress}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: \`\${Math.max(4, overview.unit.progress)}%\` }]} />
                </View>
              </View>
            </FadeInView>`
    );

    // 4. Update Styles
    content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, `const styles = StyleSheet.create({
  loadingText: {
    color: c.neutral500,
    fontSize: 14,
  },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  unitCode: {
    color: c.neutral900,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  unitType: {
    color: c.neutral500,
    fontSize: 14,
    marginTop: 2,
  },
  unitMeta: {
    color: c.neutral600,
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: c.neutral200,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: c.accent,
    borderRadius: 999,
  },
  summaryText: {
    color: c.neutral700,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  quickActionGrid: {
    flexDirection: "column",
    gap: 12,
  },
  quickActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 76,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: c.neutral200,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
  },
  quickActionBtnPressed: {
    borderColor: c.accent,
    backgroundColor: c.info.bg,
    transform: [{ scale: 0.99 }],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionTitle: {
    color: c.neutral900,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  quickActionCaption: {
    color: c.neutral500,
    fontSize: 13,
    fontWeight: "500",
  },
});`);

    fs.writeFileSync(file, content);
    console.log('CustomerHomeScreen Refactored!');
}

function refactorFieldHome() {
    const file = 'src/screens/pengawas/FieldHomeScreen.tsx';
    let content = fs.readFileSync(file, 'utf8');

    // Make sure 'c' is imported
    if (!content.includes('import { c } from "../../theme/colors"')) {
        content = content.replace(
            /import { formatErrorMessage, inferBannerTone } from "\.\.\/\.\.\/utils\/format";/,
            'import { formatErrorMessage, inferBannerTone } from "../../utils/format";\nimport { c } from "../../theme/colors";'
        );
    }
    
    // Change Highlight colors to Premium Tokens
    content = content.replace(/backgroundColor: "#0f172a"/g, 'backgroundColor: c.primaryDark');
    content = content.replace(/backgroundColor: "#f59e0b"/g, 'backgroundColor: c.primary600');
    content = content.replace(/shadowColor: "#f59e0b"/g, 'shadowColor: c.primary600');
    
    // Replace old grid with list-style premium grid
    const newStyles = `const styles = StyleSheet.create({
  highlightRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  highlightCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  highlightIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  highlightLabelInverse: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  highlightValueInverse: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
  },
  highlightBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highlightBadgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  quickActionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  quickActionBtn: {
    width: (SCREEN_WIDTH - 44) / 2,
    minHeight: 124,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: c.neutral200,
    padding: 16,
    justifyContent: "flex-end",
  },
  quickActionBtnPressed: {
    borderColor: c.accent,
    backgroundColor: c.info.bg,
    transform: [{ scale: 0.98 }],
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "auto",
  },
  quickActionTitle: {
    color: c.neutral900,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 2,
  },
  quickActionCaption: {
    color: c.neutral500,
    fontSize: 12,
    fontWeight: "600",
  },
  projectSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectListWrap: {
    gap: 16,
  },
  projectCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: c.neutral200,
  },
  projectCardPressed: {
    transform: [{ scale: 0.99 }],
    borderColor: c.accent,
    backgroundColor: c.info.bg,
  },
  projectCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  projectIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: c.info.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    color: c.neutral900,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  projectMeta: {
    color: c.neutral500,
    fontSize: 13,
    fontWeight: "600",
  },
  projectProgressWrap: {
    backgroundColor: c.neutral50,
    padding: 14,
    borderRadius: 14,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: c.neutral700,
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: "900",
    color: c.primary600,
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.danger.bg,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    gap: 8,
  },
  alertText: {
    color: c.danger.text,
    fontSize: 13,
    fontWeight: "700",
  },
});`;
    
    content = content.replace(/const styles = StyleSheet\.create\(\{[\s\S]*\}\);/, newStyles);

    fs.writeFileSync(file, content);
    console.log('FieldHomeScreen Refactored!');
}

try {
    refactorCustomerHome();
    refactorFieldHome();
} catch (e) {
    console.error(e);
    process.exit(1);
}
