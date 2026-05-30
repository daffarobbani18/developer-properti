import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { AttendanceItem } from "../../types";
import { formatDateTime } from "../../utils/format";

type TeamMember = {
  id: string;
  name: string;
  role: "SITE_ENGINEER";
  status: "ACTIVE" | "INACTIVE";
  lastActive?: string;
  attendanceToday?: AttendanceItem;
};

export function TeamManagementScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const loadTeamData = useCallback(async () => {
    if (!auth) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockTeam: TeamMember[] = [
      { id: "1", name: "Ahmad Engineer", role: "SITE_ENGINEER", status: "ACTIVE", lastActive: new Date().toISOString(), attendanceToday: { id: "a1", userId: "1", userName: "Ahmad Engineer", date: new Date().toISOString().split("T")[0], status: "HADIR", createdAt: new Date().toISOString() } },
      { id: "2", name: "Budi Engineer", role: "SITE_ENGINEER", status: "ACTIVE", lastActive: new Date(Date.now() - 3600000).toISOString(), attendanceToday: { id: "a2", userId: "2", userName: "Budi Engineer", date: new Date().toISOString().split("T")[0], status: "TERLAMBAT", createdAt: new Date().toISOString() } },
      { id: "3", name: "Citra Engineer", role: "SITE_ENGINEER", status: "INACTIVE", lastActive: new Date(Date.now() - 86400000).toISOString() },
    ];

    setTeam(mockTeam);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setBanner(null);
        try {
          await loadTeamData();
        } catch (error) {
          if (!cancelled) {
            setBanner(error instanceof Error ? error.message : "Gagal memuat data tim");
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
    }, [loadTeamData])
  );

  const presentCount = team.filter((m) => m.attendanceToday?.status === "HADIR").length;
  const lateCount = team.filter((m) => m.attendanceToday?.status === "TERLAMBAT").length;
  const activeCount = team.filter((m) => m.status === "ACTIVE").length;

  return (
    <ScreenShell title="Manajemen Tim" subtitle="Pantau kehadiran dan aktivitas engineer">
      <Card>
        <SectionTitle title="Statistik Tim" caption="Ringkasan kehadiran hari ini" />
        <View style={styles.statsGrid}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Total Engineer</Text>
            <Text style={styles.statValue}>{team.length}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Aktif</Text>
            <Text style={styles.statValue}>{activeCount}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Hadir</Text>
            <Text style={styles.statValue}>{presentCount}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Terlambat</Text>
            <Text style={styles.statValue}>{lateCount}</Text>
          </View>
        </View>
      </Card>

      {banner ? <StatusBanner message={banner} tone="danger" /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat data tim...</Text>
        </Card>
      ) : team.length === 0 ? (
        <EmptyState message="Belum ada anggota tim yang terdaftar." />
      ) : (
        <View style={styles.teamList}>
          {team.map((member) => (
            <Card key={member.id}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Badge label={member.status} tone={member.status === "ACTIVE" ? "success" : "neutral"} />
              </View>
              <Text style={styles.memberMeta}>Role: {member.role.replace("_", " ")}</Text>
              {member.attendanceToday && (
                <View style={styles.attendanceRow}>
                  <Text style={styles.attendanceLabel}>Kehadiran: </Text>
                  <Badge label={member.attendanceToday.status} tone={member.attendanceToday.status === "HADIR" ? "success" : "warning"} />
                </View>
              )}
              {member.lastActive && (
                <Text style={styles.memberMeta}>Terakhir aktif: {formatDateTime(member.lastActive)}</Text>
              )}
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flexGrow: 1,
    minWidth: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 8,
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
  teamList: {
    gap: 10,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  memberName: {
    color: "#123b45",
    fontSize: 15,
    fontWeight: "800",
  },
  memberMeta: {
    color: "#4a6a72",
    fontSize: 12,
  },
  attendanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  attendanceLabel: {
    color: "#4a6a72",
    fontSize: 12,
  },
});