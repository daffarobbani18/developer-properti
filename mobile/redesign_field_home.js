const fs = require('fs');

const file = 'src/screens/pengawas/FieldHomeScreen.tsx';

const newContent = `import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, Dimensions, ScrollView, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import {
  StatusBanner,
  SlideInView,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { getFieldProjects, getRoleNotifications } from "../../services/api";
import { ProjectSummary } from "../../types";
import { formatErrorMessage, inferBannerTone } from "../../utils/format";
import type { FieldStackParamList } from "../../navigation/types";
import { c } from "../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function FieldHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const { queueCount, isSyncing } = useOfflineQueue(auth);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) return;
    const [projectData, notifications] = await Promise.all([
      getFieldProjects(auth),
      getRoleNotifications(auth),
    ]);
    setProjects(projectData);
    setUnreadCount(notifications.filter((item) => !item.isRead).length);
  }, [auth]);

  const goToTab = useCallback(
    async (tabName: "FieldMilestone" | "FieldUnit" | "FieldDailyReport" | "FieldNotifikasi" | "InspectionUnits") => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(tabName as never);
    },
    [navigation]
  );

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setIsLoading(true);
        try {
          await loadData();
          if (!cancelled) setBanner(null);
        } catch (error) {
          if (!cancelled) setBanner(formatErrorMessage(error));
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadData])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* HERO HEADER */}
        <LinearGradient colors={[c.primaryDark, "#020617"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroGreeting}>Dashboard Pengawas,</Text>
                <Text style={styles.heroName}>{auth?.user.fullName}</Text>
              </View>
              <Pressable onPress={() => void signOut()} style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
                <Ionicons name="log-out-outline" size={22} color="#ffffff" />
              </Pressable>
            </View>

            {/* HIGHLIGHT NUMBERS (Integrated into Hero) */}
            <View style={styles.heroHighlightRow}>
              <View style={styles.heroMetricCol}>
                <Text style={styles.heroMetricLabel}>Queue Offline</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.heroMetricValue, { color: isSyncing ? c.warning.text : queueCount > 0 ? c.warning.text : c.success.text }]}>
                    {isSyncing ? "..." : queueCount}
                  </Text>
                  {isSyncing && <Ionicons name="sync" size={14} color={c.warning.text} />}
                </View>
              </View>
              <View style={styles.heroMetricDivider} />
              <View style={styles.heroMetricCol}>
                <Text style={styles.heroMetricLabel}>Notifikasi</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.heroMetricValue, { color: unreadCount > 0 ? c.danger.text : "#ffffff" }]}>
                    {unreadCount}
                  </Text>
                  {unreadCount > 0 && <View style={styles.redDot} />}
                </View>
              </View>
            </View>

          </SafeAreaView>
        </LinearGradient>

        <View style={styles.contentPad}>
          {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

          <SlideInView direction="up" delay={50} duration={400} style={{ marginTop: banner ? 16 : 0 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Aksi Operasional</Text>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
              <Pressable onPress={() => goToTab("FieldMilestone")} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
                <View style={[styles.actionIconWrap, { backgroundColor: c.info.bg }]}>
                  <Ionicons name="hammer" size={24} color={c.info.text} />
                </View>
                <Text style={styles.actionTitle}>Update Progres</Text>
                <Text style={styles.actionCaption}>Lapor milestone</Text>
              </Pressable>

              <Pressable onPress={() => goToTab("InspectionUnits")} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
                <View style={[styles.actionIconWrap, { backgroundColor: c.warning.bg }]}>
                  <Ionicons name="shield-checkmark" size={24} color={c.warning.text} />
                </View>
                <Text style={styles.actionTitle}>Inspeksi Unit</Text>
                <Text style={styles.actionCaption}>Pre-BAST / Defect</Text>
              </Pressable>

              <Pressable onPress={() => goToTab("FieldDailyReport")} style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
                <View style={[styles.actionIconWrap, { backgroundColor: c.success.bg }]}>
                  <Ionicons name="document-text" size={24} color={c.success.text} />
                </View>
                <Text style={styles.actionTitle}>Laporan Harian</Text>
                <Text style={styles.actionCaption}>Buat log harian</Text>
              </Pressable>
            </ScrollView>
          </SlideInView>

          <SlideInView direction="up" delay={150} duration={400} style={{ marginTop: 32 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Proyek Aktif</Text>
              <Text style={styles.sectionSubTitle}>{projects.length} Proyek</Text>
            </View>

            <View style={styles.projectList}>
              {projects.length === 0 && !isLoading ? (
                <View style={styles.emptyState}>
                  <Ionicons name="business-outline" size={48} color={c.neutral300} style={{ marginBottom: 12 }} />
                  <Text style={styles.emptyText}>Tidak ada proyek aktif</Text>
                </View>
              ) : (
                projects.map((proj) => (
                  <View key={proj.id} style={styles.projectItem}>
                    <View style={styles.projectHeader}>
                      <View style={[styles.projectIconWrap, { backgroundColor: c.neutral100 }]}>
                        <Ionicons name="business" size={20} color={c.neutral700} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.projectName}>{proj.name}</Text>
                        <Text style={styles.projectMeta}>{proj.activeUnits} Unit Aktif</Text>
                      </View>
                    </View>
                    
                    <View style={styles.projectProgressWrap}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Penyelesaian Fisik</Text>
                        <Text style={styles.progressPercentage}>{proj.overallProgress}%</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: \`\${Math.max(4, proj.overallProgress)}%\` }]} />
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          </SlideInView>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  heroHeader: {
    paddingBottom: 32,
  },
  heroSafeArea: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  heroName: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHighlightRow: {
    flexDirection: "row",
    marginTop: 32,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  heroMetricCol: {
    flex: 1,
  },
  heroMetricDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
  },
  heroMetricLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroMetricValue: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.danger.text,
  },
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -0.5,
  },
  sectionSubTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
    marginBottom: 2,
  },
  actionCard: {
    width: 140,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 4,
  },
  actionCaption: {
    fontSize: 12,
    fontWeight: "500",
    color: c.neutral500,
  },
  projectList: {
    gap: 16,
  },
  projectItem: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  projectIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 2,
  },
  projectMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
  },
  projectProgressWrap: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral600,
  },
  progressPercentage: {
    fontSize: 15,
    fontWeight: "900",
    color: c.primary600,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: c.neutral100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: c.accent,
    borderRadius: 999,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: c.neutral400,
    fontSize: 14,
    fontWeight: "500",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('FieldHomeScreen structure fully redesigned.');
