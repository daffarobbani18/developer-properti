import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  Card,
  EmptyState,
  SecondaryButton,
  ScreenShell,
  TextButton,
  SectionTitle,
  SkeletonList,
  StatusBanner,
  SlideInView,
  AnimatedProgressBar,
  CountUpNumber,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { getFieldProjects, getRoleNotifications } from "../../services/api";
import { ProjectSummary } from "../../types";
import { formatErrorMessage, inferBannerTone } from "../../utils/format";
import type { PengawasStackParamList } from "../../navigation/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function FieldHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<PengawasStackParamList>>();
  const { queueCount, isSyncing } = useOfflineQueue(auth);

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const [projectData, notifications] = await Promise.all([
      getFieldProjects(auth),
      getRoleNotifications(auth),
    ]);

    setProjects(projectData);
    setUnreadCount(notifications.filter((item) => !item.isRead).length);
  }, [auth]);

  const goToTab = useCallback(
    (tabName: "FieldMilestone" | "FieldUnit" | "FieldKendala" | "FieldNotifikasi" | "InspectionUnits") => {
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
          if (!cancelled) {
            setBanner(null);
          }
        } catch (error) {
          if (!cancelled) {
            setBanner(formatErrorMessage(error));
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadData])
  );

  return (
    <ScreenShell
      title="Dashboard Lapangan"
      subtitle={auth ? `${auth.user.fullName} • ${auth.user.role}` : ""}
      rightAction={<TextButton label="Keluar" onPress={() => void signOut()} />}
    >
      <SlideInView direction="up" delay={50} duration={400}>
        <View style={styles.highlightRow}>
          <View style={[styles.highlightCard, { backgroundColor: "#0f172a" }]}>
            <View style={[styles.highlightIconBg, { backgroundColor: "#f59e0b", shadowColor: "#f59e0b", shadowOpacity: 0.6, shadowRadius: 6, elevation: 6 }]}>
              <Ionicons name="sync" size={20} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.highlightLabelInverse}>Queue Offline</Text>
              <Text style={styles.highlightValueInverse}>{isSyncing ? "..." : queueCount}</Text>
            </View>
            <View style={styles.highlightBadge}>
              <Text style={styles.highlightBadgeText}>
                {isSyncing ? "Sinkron..." : queueCount > 0 ? "Pending" : "Aman"}
              </Text>
            </View>
          </View>

          <View style={[styles.highlightCard, { backgroundColor: "#ea580c" }]}>
            <View style={[styles.highlightIconBg, { backgroundColor: "#f97316", shadowColor: "#f97316", shadowOpacity: 0.6, shadowRadius: 6, elevation: 6 }]}>
              <Ionicons name="notifications" size={20} color="#ffffff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.highlightLabelInverse}>Notifikasi</Text>
              <Text style={styles.highlightValueInverse}>{unreadCount}</Text>
            </View>
            <View style={[styles.highlightBadge, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <Text style={styles.highlightBadgeText}>
                {unreadCount > 0 ? "Baru" : "Kosong"}
              </Text>
            </View>
          </View>
        </View>
      </SlideInView>

      <SlideInView direction="up" delay={150} duration={400}>
        <SectionTitle title="Aksi Cepat" caption="Akses fitur operasional utama" />
        <View style={styles.quickActionGrid}>
          <Pressable
            onPress={() => goToTab("FieldMilestone")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#0284c7", shadowColor: "#0284c7", shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 }]}>
              <Ionicons name="construct" size={22} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>Update Progres</Text>
            <Text style={styles.quickActionCaption}>Lapor milestone</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("InspectionUnits")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#10b981", shadowColor: "#10b981", shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 }]}>
              <Ionicons name="checkmark-done-circle" size={22} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>Inspeksi Pra-BAST</Text>
            <Text style={styles.quickActionCaption}>Cek & lapor defect</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("FieldUnit")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#9333ea", shadowColor: "#9333ea", shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 }]}>
              <Ionicons name="home" size={22} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>Daftar Unit</Text>
            <Text style={styles.quickActionCaption}>Lihat status unit</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("FieldKendala")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#ea580c", shadowColor: "#ea580c", shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 }]}>
              <Ionicons name="warning" size={22} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>Lapor Kendala</Text>
            <Text style={styles.quickActionCaption}>Buat isu baru</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("FieldNotifikasi")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#16a34a", shadowColor: "#16a34a", shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 }]}>
              <Ionicons name="mail-unread" size={22} color="#ffffff" />
            </View>
            <Text style={styles.quickActionTitle}>Notifikasi</Text>
            <Text style={styles.quickActionCaption}>Cek info terbaru</Text>
          </Pressable>
        </View>
      </SlideInView>

      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

      <SlideInView direction="up" delay={250} duration={400}>
        <View style={styles.projectSectionHeader}>
          <SectionTitle title="Proyek Aktif" caption="Pantau progres keseluruhan" />
          <Pressable
            onPress={() => {
              void (async () => {
                setIsLoading(true);
                setBanner(null);
                try {
                  await loadData();
                } catch (error) {
                  setBanner(formatErrorMessage(error));
                } finally {
                  setIsLoading(false);
                }
              })();
            }}
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="refresh" size={20} color="#64748b" style={{ padding: 4 }} />
          </Pressable>
        </View>

        {isLoading ? (
          <SkeletonList count={3} />
        ) : projects.length === 0 ? (
          <EmptyState message="Belum ada proyek yang terdaftar untuk akun ini." />
        ) : (
          <View style={styles.projectListWrap}>
            {projects.map((project) => (
              <Pressable
                key={project.id}
                onPress={() =>
                  (navigation as any).navigate("FieldUnits", {
                    projectId: project.id,
                  })
                }
                style={({ pressed }) => [
                  styles.projectCard,
                  pressed && styles.projectCardPressed,
                ]}
              >
                <View style={styles.projectCardHeader}>
                  <View style={[styles.projectIconWrap, { backgroundColor: "#0f172a", shadowColor: "#0f172a", shadowOpacity: 0.6, shadowRadius: 8, elevation: 6 }]}>
                    <Ionicons name="business" size={22} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectMeta}>{project.totalUnits} Unit Dipantau</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                </View>

                <View style={styles.projectProgressWrap}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progres Rata-rata</Text>
                    <Text style={styles.progressPercentage}>{project.progress}%</Text>
                  </View>
                  <AnimatedProgressBar 
                    progress={project.progress} 
                    height={6} 
                    color="#f59e0b" 
                  />
                </View>

                {project.milestoneDeadlineAlerts > 0 && (
                  <View style={styles.alertBanner}>
                    <Ionicons name="alert-circle" size={16} color="#dc2626" />
                    <Text style={styles.alertText}>
                      Terdapat {project.milestoneDeadlineAlerts} deadline mendesak!
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </SlideInView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  highlightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  highlightCard: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 44) / 2,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  highlightIconBg: {
    backgroundColor: "#ccfbf1",
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  highlightLabelInverse: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  highlightValueInverse: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
  },
  highlightBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highlightBadgeText: {
    color: "#ffffff",
    fontSize: 10,
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
    minHeight: 120,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 16,
    justifyContent: "flex-end",
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "auto",
  },
  quickActionTitle: {
    color: "#0f172a",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  quickActionCaption: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "500",
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
    borderRadius: 16,
    padding: 16,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  projectCardPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: "#f8fafc",
  },
  projectCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  projectIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f0fdfa",
    alignItems: "center",
    justifyContent: "center",
  },
  projectName: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  projectMeta: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "500",
  },
  projectProgressWrap: {
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
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
    color: "#475569",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "800",
    color: "#d97706",
  },
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  alertText: {
    color: "#b91c1c",
    fontSize: 12,
    fontWeight: "600",
  },
});
