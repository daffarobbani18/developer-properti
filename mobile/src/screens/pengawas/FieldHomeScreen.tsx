import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { getFieldProjects, getRoleNotifications } from "../../services/api";
import { ProjectSummary } from "../../types";
import { inferBannerTone } from "../../utils/format";

export function FieldHomeScreen({ globalBanner }: { globalBanner?: string | null }): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation();
  const { queueCount, refreshQueueCount } = useOfflineQueue();

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
      refreshQueueCount(),
    ]);

    setProjects(projectData);
    setUnreadCount(notifications.filter((item) => !item.isRead).length);
  }, [auth, refreshQueueCount]);

  const goToTab = useCallback(
    (tabName: "Milestone" | "Unit" | "Kendala" | "Notifikasi") => {
      (navigation as { navigate: (routeName: string) => void }).navigate(tabName);
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
            setBanner(error instanceof Error ? error.message : "Gagal memuat dashboard lapangan");
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
      rightAction={<SecondaryButton label="Logout" onPress={() => void signOut()} />}
    >
      <View style={styles.highlightRow}>
        <Card style={styles.highlightCard}>
          <Text style={styles.highlightLabel}>Queue Offline</Text>
          <Text style={styles.highlightValue}>{queueCount}</Text>
          <Badge label={queueCount > 0 ? "Perlu sinkron" : "Aman"} tone={queueCount > 0 ? "warning" : "success"} />
        </Card>

        <Card style={styles.highlightCard}>
          <Text style={styles.highlightLabel}>Notifikasi Baru</Text>
          <Text style={styles.highlightValue}>{unreadCount}</Text>
          <Badge label={unreadCount > 0 ? "Butuh perhatian" : "Tidak ada"} tone={unreadCount > 0 ? "warning" : "success"} />
        </Card>
      </View>

      <Card>
        <SectionTitle title="Aksi Cepat" caption="Akses fitur utama dengan satu tap" />
        <View style={styles.quickActionGrid}>
          <Pressable
            onPress={() => goToTab("Milestone")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Update Milestone</Text>
            <Text style={styles.quickActionCaption}>Laporkan progres unit</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("Unit")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Daftar Unit</Text>
            <Text style={styles.quickActionCaption}>Lihat status semua unit</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("Kendala")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Laporan Kendala</Text>
            <Text style={styles.quickActionCaption}>Buat laporan baru</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("Notifikasi")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Notifikasi</Text>
            <Text style={styles.quickActionCaption}>Cek update terbaru</Text>
          </Pressable>
        </View>
      </Card>

      <SecondaryButton
        label="Muat Ulang Data"
        onPress={() => {
          void (async () => {
            setIsLoading(true);
            setBanner(null);

            try {
              await loadData();
            } catch (error) {
              setBanner(error instanceof Error ? error.message : "Gagal memuat dashboard lapangan");
            } finally {
              setIsLoading(false);
            }
          })();
        }}
      />

      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

      {globalBanner ? <StatusBanner message={globalBanner} tone={inferBannerTone(globalBanner)} /> : null}

      <Card>
        <Text style={styles.sectionTitle}>Ringkasan Proyek</Text>
      </Card>

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat ringkasan proyek...</Text>
        </Card>
      ) : projects.length === 0 ? (
        <EmptyState message="Belum ada proyek yang terdaftar untuk akun ini." />
      ) : (
        <View style={styles.projectListWrap}>
          {projects.map((project) => (
            <Card key={project.id}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={styles.projectMetaRow}>
                <Text style={styles.projectMeta}>Unit aktif: {project.totalUnits}</Text>
                <Text style={styles.projectMeta}>Progres: {project.progress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.max(4, project.progress)}%` }]} />
              </View>
              <Badge
                label={`Alert deadline: ${project.milestoneDeadlineAlerts}`}
                tone={project.milestoneDeadlineAlerts > 0 ? "danger" : "success"}
              />
            </Card>
          ))}
        </View>
      )}

    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  highlightRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  highlightCard: {
    flex: 1,
    minWidth: 148,
  },
  highlightLabel: {
    color: "#3a5f67",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  highlightValue: {
    color: "#123d47",
    fontSize: 26,
    fontWeight: "800",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#153f49",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  quickActionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActionBtn: {
    flexGrow: 1,
    flexBasis: "48%",
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cae1e5",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 9,
    justifyContent: "center",
    gap: 2,
  },
  quickActionBtnPressed: {
    opacity: 0.86,
  },
  quickActionTitle: {
    color: "#184a55",
    fontSize: 13,
    fontWeight: "800",
  },
  quickActionCaption: {
    color: "#4a7078",
    fontSize: 11,
    fontWeight: "600",
  },
  projectListWrap: {
    gap: 10,
  },
  projectName: {
    color: "#123b45",
    fontSize: 16,
    fontWeight: "800",
  },
  projectMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectMeta: {
    color: "#43616b",
    fontSize: 13,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e1ecec",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#20818c",
  },
});
