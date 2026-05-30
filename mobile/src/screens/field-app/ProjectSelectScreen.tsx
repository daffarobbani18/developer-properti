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
import { getProjectOptions } from "../../services/api";
import { colors } from "../../theme/colors";
import { ProjectSummary } from "../../types";
import { inferBannerTone } from "../../utils/format";

export function ProjectSelectScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      const data = await getProjectOptions(auth);
      setProjects(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data proyek");
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setErrorMessage(null);

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

  const handleSelectProject = useCallback(
    (projectId: string) => {
      (navigation as { navigate: (route: string, params?: object) => void }).navigate("UnitSelect", {
        projectId,
      });
    },
    [navigation]
  );

  const completedProjects = projects.filter(
    (project) => project.progress === 100
  ).length;

  return (
    <ScreenShell title="Pilih Proyek" subtitle="Daftar proyek yang dapat Anda akses">
      <Card>
        <SectionTitle title="Ringkasan" caption="Statistik progres semua proyek" />
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Total Proyek</Text>
            <Text style={styles.statValue}>{projects.length}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Selesai</Text>
            <Text style={styles.statValue}>{completedProjects}</Text>
          </View>
        </View>
        <SecondaryButton label="Muat Ulang" onPress={() => void loadData()} />
      </Card>

      {errorMessage ? <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat proyek...</Text>
        </Card>
      ) : projects.length === 0 ? (
        <EmptyState message="Tidak ada proyek yang tersedia untuk akun ini." />
      ) : (
        <View style={styles.listWrap}>
          {projects.map((project) => (
            <Card key={project.id}>
              <Pressable
                onPress={() => handleSelectProject(project.id)}
                style={({ pressed }) => [styles.projectCard, pressed && styles.projectCardPressed]}
              >
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  <Badge label={`${project.progress}%`} tone={project.progress === 100 ? "success" : "warning"} />
                </View>
                <Text style={styles.projectMeta}>Unit aktif: {project.totalUnits}</Text>
                <Text style={styles.projectMeta}>Deadline Alert: {project.milestoneDeadlineAlerts}</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${Math.max(4, project.progress)}%` }]} />
                </View>
              </Pressable>
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    minWidth: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  statLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statValue: {
    color: "#184b55",
    fontSize: 18,
    fontWeight: "800",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 9,
  },
  projectCard: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#f8fcfd",
  },
  projectCardPressed: {
    opacity: 0.8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectName: {
    flex: 1,
    color: "#123d47",
    fontSize: 16,
    fontWeight: "800",
  },
  projectMeta: {
    color: "#4a6870",
    fontSize: 13,
  },
  progressTrack: {
    marginTop: 6,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e0ecee",
    overflow: "hidden",
  },
progressFill: {
     height: "100%",
     backgroundColor: colors.primary,
     borderRadius: 999,
   },
});