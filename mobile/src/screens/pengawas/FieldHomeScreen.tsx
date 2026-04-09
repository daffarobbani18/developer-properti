import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Badge, Card, EmptyState, ScreenShell, SecondaryButton } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { getFieldProjects, getRoleNotifications } from "../../services/api";
import { ProjectSummary } from "../../types";

export function FieldHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const { queueCount, refreshQueueCount } = useOfflineQueue();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          await loadData();
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

      <SecondaryButton label="Muat Ulang Data" onPress={() => void loadData()} />

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
    gap: 10,
  },
  highlightCard: {
    flex: 1,
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
