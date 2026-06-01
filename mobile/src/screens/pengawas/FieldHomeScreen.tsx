import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { getFieldProjects, getRoleNotifications } from "../../services/api";
import { ProjectSummary } from "../../types";
import { formatErrorMessage, inferBannerTone } from "../../utils/format";
import type { PengawasStackParamList } from "../../navigation/types";

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
    (tabName: "Milestone" | "Unit" | "Kendala" | "Notifikasi") => {
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
rightAction={<TextButton label="Logout" onPress={() => void signOut()} />}
     >
<View style={styles.highlightRow}>
         <Card style={styles.highlightCard}>
           <Text style={styles.highlightLabel}>Queue Offline</Text>
           <Text style={styles.highlightValue}>{isSyncing ? "..." : queueCount}</Text>
           <Badge label={isSyncing ? "Sinkronisasi..." : queueCount > 0 ? "Perlu sinkron" : "Aman"} tone={isSyncing || queueCount > 0 ? "warning" : "success"} />
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
              setBanner(formatErrorMessage(error));
            } finally {
              setIsLoading(false);
            }
          })();
        }}
      />

{banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

       <Card>
        <Text style={styles.sectionTitle}>Ringkasan Proyek</Text>
      </Card>

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
                (navigation as any).navigate("ProjectDetail", {
                  projectId: project.id,
                  projectName: project.name,
                })
              }
              style={({ pressed }) => [pressed && { opacity: 0.85 }]}
            >
            <Card>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={styles.projectMetaRow}>
                <Text style={styles.projectMeta}>Unit aktif: {project.totalUnits}</Text>
                <Text style={styles.projectMeta}>Progres: {project.progress}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.max(4, project.progress)}%` }]} />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Badge
                  label={`Alert deadline: ${project.milestoneDeadlineAlerts}`}
                  tone={project.milestoneDeadlineAlerts > 0 ? "danger" : "success"}
                />
                <Text style={{ fontSize: 11, color: "#1a6d78", fontWeight: "700" }}>Lihat Detail →</Text>
              </View>
            </Card>
            </Pressable>
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
     gap: 12,
   },
   highlightCard: {
     flex: 1,
     minWidth: 148,
   },
highlightLabel: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
  },
   highlightValue: {
     color: "#0f172a",
     fontSize: 24,
     fontWeight: "800",
   },
   sectionTitle: {
     fontSize: 16,
     fontWeight: "700",
     color: "#1e293b",
   },
   loadingText: {
     color: "#64748b",
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
     borderRadius: 8,
     borderWidth: 1,
     borderColor: "#e2e8f0",
     backgroundColor: "#ffffff",
     paddingHorizontal: 10,
     paddingVertical: 9,
     justifyContent: "center",
     gap: 2,
   },
   quickActionBtnPressed: {
     opacity: 0.86,
   },
   quickActionTitle: {
     color: "#1e4459",
     fontSize: 13,
     fontWeight: "700",
   },
   quickActionCaption: {
     color: "#64748b",
     fontSize: 11,
     fontWeight: "500",
   },
   projectListWrap: {
     gap: 12,
   },
   projectName: {
     color: "#1e293b",
     fontSize: 16,
     fontWeight: "700",
   },
   projectMetaRow: {
     flexDirection: "row",
     justifyContent: "space-between",
   },
   projectMeta: {
     color: "#64748b",
     fontSize: 13,
   },
   progressTrack: {
     height: 10,
     borderRadius: 999,
     backgroundColor: "#e2e8f0",
     overflow: "hidden",
   },
progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#1a6d78",
  },
 });
