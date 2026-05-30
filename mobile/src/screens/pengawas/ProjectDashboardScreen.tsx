import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
   Badge,
   Card,
   EmptyState,
   ScreenShell,
   Skeleton,
   SkeletonList,
   SlideInView,
   TextButton,
   SectionTitle,
   StatusBanner,
   CountUpNumber,
  } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldProjects } from "../../services/api";
import { IssueItem, Milestone, ProjectSummary } from "../../types";
import { inferBannerTone } from "../../utils/format";

export function ProjectDashboardScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [criticalIssues, setCriticalIssues] = useState<IssueItem[]>([]);
  const [pendingMilestones, setPendingMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const projectData = await getFieldProjects(auth);
    setProjects(projectData);

    const mockIssues: IssueItem[] = [
      { id: "1", projectId: "p1", title: "Keterlambatan material atap", description: "Butuh approval", category: "Kualitas Pekerjaan", urgency: "TINGGI", status: "BARU", reporterName: "Engineer 1", createdAt: new Date().toISOString() },
      { id: "2", projectId: "p2", title: "Cuaca tidak mendukung", description: "Pemotongan terpaksa", category: "Cuaca", urgency: "SEDANG", status: "SEDANG_DITANGANI", reporterName: "Engineer 2", createdAt: new Date().toISOString() },
    ];
    setCriticalIssues(mockIssues.filter((i) => i.urgency === "TINGGI" || i.urgency === "KRITIS"));

    const mockMilestones: Milestone[] = [
      { id: "m1", unitId: "u1", name: "Pekerjaan Pondasi", orderNo: 1, targetDate: "2026-06-01", status: "IN_PROGRESS", photos: [], checklist: [], checklistCompleted: 0, checklistTotal: 5 },
      { id: "m2", unitId: "u2", name: "Pekerjaan Batu Dasar", orderNo: 2, targetDate: "2026-06-15", status: "NOT_STARTED", photos: [], checklist: [], checklistCompleted: 0, checklistTotal: 3 },
    ];
    setPendingMilestones(mockMilestones.filter((m) => m.status !== "COMPLETED"));
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setBanner(null);
        try {
          await loadData();
        } catch (error) {
          if (!cancelled) {
            setBanner(error instanceof Error ? error.message : "Gagal memuat dashboard proyek");
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

  const goToApproval = useCallback(() => {
    (navigation as { navigate: (name: string) => void }).navigate("Approval");
  }, [navigation]);

  const goToIssues = useCallback(() => {
    (navigation as { navigate: (name: string) => void }).navigate("Kendala");
  }, [navigation]);

  const goToTeam = useCallback(() => {
    (navigation as { navigate: (name: string) => void }).navigate("Team");
  }, [navigation]);

  return (
    <ScreenShell
      title="Dashboard Proyek"
      subtitle={auth ? `${auth.user.fullName} • Project Manager` : ""}
rightAction={<TextButton label="Logout" onPress={() => void signOut()} />}
     >
<View style={styles.highlightRow}>
         <Card style={styles.highlightCard}>
           <Text style={styles.highlightLabel}>Total Proyek</Text>
           <CountUpNumber value={projects.length} duration={800} style={styles.highlightValue} />
         </Card>

         <Card style={styles.highlightCard}>
           <Text style={styles.highlightLabel}>Kendala Kritis</Text>
           <CountUpNumber value={criticalIssues.length} duration={800} style={styles.highlightValue} />
           <Badge label={criticalIssues.length > 0 ? "Perlu tindakan" : "Aman"} tone={criticalIssues.length > 0 ? "danger" : "success"} />
         </Card>

         <Card style={styles.highlightCard}>
           <Text style={styles.highlightLabel}>Menunggu Approval</Text>
           <CountUpNumber value={pendingMilestones.length} duration={800} style={styles.highlightValue} />
         </Card>
       </View>

      <Card>
        <SectionTitle title="Aksi Cepat" caption="Akses fitur manajemen proyek" />
        <View style={styles.quickActionGrid}>
          <Pressable
            onPress={goToApproval}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Approval</Text>
            <Text style={styles.quickActionCaption}>Review milestone & laporan</Text>
          </Pressable>

          <Pressable
            onPress={goToIssues}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Kendala</Text>
            <Text style={styles.quickActionCaption}>Kelola semua kendala</Text>
          </Pressable>

<Pressable
             onPress={goToTeam}
             style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
           >
             <Text style={styles.quickActionTitle}>Tim</Text>
             <Text style={styles.quickActionCaption}>Kelola engineer</Text>
           </Pressable>

           <Pressable
             onPress={() => (navigation as { navigate: (name: string) => void }).navigate("FieldUnits")}
             style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
           >
             <Text style={styles.quickActionTitle}>Unit</Text>
             <Text style={styles.quickActionCaption}>Lihat semua unit</Text>
           </Pressable>

           <Pressable
             onPress={() => (navigation as { navigate: (name: string) => void }).navigate("FieldMilestones")}
             style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
           >
             <Text style={styles.quickActionTitle}>Milestone</Text>
             <Text style={styles.quickActionCaption}>Pantau progres pekerjaan</Text>
           </Pressable>
         </View>
       </Card>

{banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

       <Card>
        <Text style={styles.sectionTitle}>Ringkasan Proyek</Text>
      </Card>

{isLoading ? (
        <>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
            <Skeleton width="48%" height={80} />
            <Skeleton width="48%" height={80} />
          </View>
          <Skeleton width="100%" height={40} style={{ marginBottom: 8 }} />
          <SkeletonList count={3} />
        </>
      ) : projects.length === 0 ? (
        <EmptyState message="Belum ada proyek yang terdaftar." />
      ) : (
        <View style={styles.projectListWrap}>
          {projects.map((project, index) => (
            <SlideInView
              key={project.id}
              direction="up"
              delay={Math.min(index * 100, 500)}
              duration={400}
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
                <Badge
                  label={`Alert deadline: ${project.milestoneDeadlineAlerts}`}
                  tone={project.milestoneDeadlineAlerts > 0 ? "danger" : "success"}
                />
              </Card>
            </SlideInView>
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
    minWidth: 100,
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
    backgroundColor: "#1a6d78",
  },
});