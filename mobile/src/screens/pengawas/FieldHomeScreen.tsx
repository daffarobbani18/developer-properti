import { useNotifications } from "../../contexts/NotificationContext";
import React, { useCallback, useState } from "react";
import {
  Pressable, StyleSheet, Text, View, ScrollView,
  RefreshControl, Platform, StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { SkeletonList, StatusBanner, SlideInView } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { getFieldProjects, getFieldDailyReports, getInspectionBookings } from "../../services/api";
import { ProjectSummary, DailyReport } from "../../types";
import { formatErrorMessage, inferBannerTone } from "../../utils/format";
import type { FieldStackParamList } from "../../navigation/types";
import { c } from "../../theme/colors";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi,";
  if (hour < 15) return "Selamat siang,";
  if (hour < 18) return "Selamat sore,";
  return "Selamat malam,";
}

export function FieldHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === "android"
    ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45)
    : (insets?.top || 20);
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const { queueCount, isSyncing } = useOfflineQueue(auth);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todayReport, setTodayReport] = useState<DailyReport | null | undefined>(undefined);
  const [pendingInspections, setPendingInspections] = useState<number | null>(null);
  const { unreadCount, criticalCount, notifications } = useNotifications();
  const [banner, setBanner] = useState<string | null>(null);

  const actionableCount = notifications.filter((n) => !n.isResolved).length;
  const todayDate = new Date().toISOString().split("T")[0];

  const loadData = useCallback(async () => {
    if (!auth) return;
    const [projectData, reports, inspections] = await Promise.all([
      getFieldProjects(auth),
      getFieldDailyReports(auth, { includeDraft: true }),
      getInspectionBookings(auth).catch(() => []),
    ]);
    setProjects(projectData);
    const today = reports.find((r) => r.date === todayDate);
    setTodayReport(today ?? null);
    const siapInspeksi = inspections.filter(
      (b: any) => b.unit?.progress === 100 || b.unit?.statusPembangunan === "Siap Huni"
    );
    setPendingInspections(siapInspeksi.length);
  }, [auth, todayDate]);

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
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />
        }
      >
        {/* ── HERO HEADER ── */}
        <LinearGradient
          colors={[c.primary600, c.primary, c.primaryDark]}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0)"]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={styles.heroGreeting}>{getGreeting()}</Text>
                <Text style={styles.heroName} numberOfLines={1} adjustsFontSizeToFit>
                  {auth?.user.fullName}
                </Text>
              </View>
              <View style={styles.heroActions}>
                <Pressable
                  onPress={() => navigation.navigate("FieldNotifikasi" as never)}
                  style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                >
                  <Ionicons name="notifications-outline" size={22} color="#ffffff" />
                  {actionableCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {actionableCount > 99 ? "99+" : actionableCount}
                      </Text>
                    </View>
                  )}
                </Pressable>
                <Pressable
                  onPress={() => void signOut()}
                  style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
                >
                  <Ionicons name="log-out-outline" size={22} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── OVERLAP GLASS CARD ── */}
        <View style={styles.overlapContainer}>
          <SlideInView direction="up" delay={50} duration={500}>
            <View style={styles.glassCard}>
              {/* Primary: tugas aktif */}
              <Pressable
                onPress={() => navigation.navigate("FieldNotifikasi" as never)}
                style={styles.statsMainCol}
              >
                <Text style={styles.statsMainValue}>{actionableCount}</Text>
                <Text style={styles.statsMainLabel}>Tugas Aktif</Text>
              </Pressable>

              <View style={styles.statsDivider} />

              {/* Secondary: 2 baris */}
              <View style={styles.statsSubGroup}>
                <View style={styles.statsSubItem}>
                  <View style={styles.statsSubItemLeft}>
                    <View style={[styles.statsDot, {
                      backgroundColor: isSyncing
                        ? c.warning.text
                        : queueCount > 0 ? c.warning.text : c.success.text,
                    }]} />
                    <Text style={styles.statsSubLabel}>Antrean Offline</Text>
                  </View>
                  <Text style={styles.statsSubValue}>{isSyncing ? "..." : queueCount}</Text>
                </View>
                <View style={styles.statsSubItem}>
                  <View style={styles.statsSubItemLeft}>
                    <View style={[styles.statsDot, {
                      backgroundColor: pendingInspections !== null && pendingInspections > 0
                        ? c.info.text : c.neutral300,
                    }]} />
                    <Text style={styles.statsSubLabel}>Unit Inspeksi</Text>
                  </View>
                  <Text style={styles.statsSubValue}>
                    {pendingInspections === null ? "..." : pendingInspections}
                  </Text>
                </View>
              </View>
            </View>
          </SlideInView>
        </View>

        <View style={styles.contentPad}>
          {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

          {/* ── LAPORAN HARI INI ── */}
          {todayReport !== undefined && (
            <SlideInView direction="up" delay={80} duration={400}>
              <Pressable
                onPress={() => {
                  if (todayReport === null || todayReport.isDraft) {
                    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.navigate("FieldDailyReport" as never);
                  }
                }}
                style={({ pressed }) => [
                  styles.reportCard,
                  (todayReport === null || todayReport.isDraft) && { borderLeftWidth: 4, borderLeftColor: c.warning.text },
                  (todayReport === null || todayReport.isDraft) && pressed && styles.pressed,
                ]}
              >
                <View style={styles.reportCardHeader}>
                  <View
                    style={[
                      styles.reportIconWrap,
                      {
                        backgroundColor:
                          todayReport === null
                            ? c.warning.bg
                            : todayReport.isDraft
                            ? c.warning.bg
                            : c.success.bg,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        todayReport === null
                          ? "document-outline"
                          : todayReport.isDraft
                          ? "create-outline"
                          : "checkmark-circle"
                      }
                      size={22}
                      color={
                        todayReport === null
                          ? c.warning.text
                          : todayReport.isDraft
                          ? c.warning.text
                          : c.success.text
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reportCardLabel}>Laporan Harian</Text>
                    <Text style={styles.reportCardStatus}>
                      {todayReport === null
                        ? "Belum dibuat hari ini"
                        : todayReport.isDraft
                        ? "Draft — belum dikirim"
                        : "Sudah terkirim ✓"}
                    </Text>
                  </View>
                  {(todayReport === null || todayReport.isDraft) && (
                    <View style={styles.reportCtaBadge}>
                      <Text style={styles.reportCtaText}>
                        {todayReport === null ? "Buat" : "Edit"}
                      </Text>
                      <Ionicons name="arrow-forward" size={13} color={c.primaryDark} />
                    </View>
                  )}
                </View>
              </Pressable>
            </SlideInView>
          )}

          {/* ── PROYEK AKTIF ── */}
          <SlideInView direction="up" delay={150} duration={400} style={{ marginTop: 24 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Proyek Aktif</Text>
              {!isLoading && projects.length > 0 && (
                <Text style={styles.sectionCount}>{projects.length} proyek</Text>
              )}
            </View>

            {isLoading ? (
              <SkeletonList count={2} />
            ) : projects.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="business-outline" size={48} color={c.neutral300} style={{ marginBottom: 12 }} />
                <Text style={styles.emptyText}>Tidak ada proyek aktif</Text>
              </View>
            ) : (
              <View style={styles.projectList}>
                {projects.map((proj) => (
                  <Pressable
                    key={proj.id}
                    style={({ pressed }) => [styles.projectCard, pressed && styles.pressed]}
                    onPress={() => navigation.navigate("FieldUnits", { projectId: proj.id })}
                  >
                    <View style={styles.projectCardTop}>
                      <View
                        style={[
                          styles.projectIconWrap,
                          { backgroundColor: proj.milestoneDeadlineAlerts > 0 ? c.warning.bg : "rgba(56,189,248,0.1)" },
                        ]}
                      >
                        <Ionicons
                          name="business"
                          size={22}
                          color={proj.milestoneDeadlineAlerts > 0 ? c.warning.text : c.primaryDark}
                        />
                      </View>

                      <View style={{ flex: 1, marginLeft: 16, marginRight: 8 }}>
                        <Text style={styles.projectName}>{proj.name}</Text>
                        {proj.milestoneDeadlineAlerts > 0 ? (
                          <View style={styles.alertRow}>
                            <View style={[styles.statsDot, { backgroundColor: c.warning.text }]} />
                            <Text style={styles.alertText}>
                              {proj.milestoneDeadlineAlerts} milestone mendekati deadline
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.projectMeta}>{proj.totalUnits} Unit Total</Text>
                        )}
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={c.neutral400} />
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressWrap}>
                      <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Penyelesaian Fisik</Text>
                        <Text style={styles.progressPct}>{proj.progress}%</Text>
                      </View>
                      <View style={styles.progressTrack}>
                        <LinearGradient
                          colors={[c.primaryLight, c.primary]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={[styles.progressFill, { width: `${Math.max(4, proj.progress)}%` }]}
                        />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </SlideInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.neutral50 },

  // ── Hero ──
  heroHeader: {
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroSafeArea: { paddingHorizontal: 24 },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 24,
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginBottom: 6,
  },
  heroName: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 8,
    backgroundColor: c.danger.text,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#ffffff", fontSize: 9, fontWeight: "bold" },
  pressed: { opacity: 0.8, transform: [{ scale: 0.96 }] },

  // ── Glass Card ──
  overlapContainer: { marginTop: -40, paddingHorizontal: 24, zIndex: 10 },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
  statsMainCol: { flex: 1, alignItems: "flex-start" },
  statsMainValue: {
    fontSize: 34,
    fontWeight: "900",
    color: c.primary600,
    letterSpacing: -1.5,
    lineHeight: 38,
  },
  statsMainLabel: { fontSize: 14, fontWeight: "600", color: c.neutral500, marginTop: 4 },
  statsDivider: {
    width: 1,
    height: 44,
    backgroundColor: c.neutral200,
    marginHorizontal: 20,
  },
  statsSubGroup: { flex: 1, gap: 12 },
  statsSubItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statsSubItemLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  statsDot: { width: 8, height: 8, borderRadius: 4 },
  statsSubLabel: { fontSize: 13, fontWeight: "600", color: c.neutral500 },
  statsSubValue: { fontSize: 18, fontWeight: "800", color: c.neutral900 },

  // ── Content ──
  contentPad: { paddingHorizontal: 24, marginTop: 24 },

  // ── Report Card ──
  reportCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  reportCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  reportIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reportCardLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 3,
  },
  reportCardStatus: { fontSize: 13, fontWeight: "600", color: c.neutral500 },
  reportCtaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(14,165,233,0.12)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
  },
  reportCtaText: { fontSize: 13, fontWeight: "800", color: c.primaryDark },

  // ── Section ──
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: c.neutral900, letterSpacing: -1 },
  sectionCount: { fontSize: 13, fontWeight: "600", color: c.neutral400 },

  // ── Project Cards ──
  projectList: { gap: 14 },
  projectCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  projectCardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  projectIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 4,
  },
  alertRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  alertText: { fontSize: 12, fontWeight: "700", color: c.warning.text },
  projectMeta: { fontSize: 12, fontWeight: "500", color: c.neutral500 },
  progressWrap: {},
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, fontWeight: "600", color: c.neutral600 },
  progressPct: { fontSize: 15, fontWeight: "900", color: c.neutral900, letterSpacing: -0.3 },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: c.neutral100,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 4 },

  // ── Empty ──
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyText: { color: c.neutral400, fontSize: 15, fontWeight: "500" },
});
