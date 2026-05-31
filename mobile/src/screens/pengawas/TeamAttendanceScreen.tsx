import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  SectionTitle,
  SkeletonList,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldAttendanceHistory } from "../../services/api";
import { AttendanceItem } from "../../types";

function getStatusTone(status: AttendanceItem["status"]): "success" | "warning" | "neutral" | "danger" {
  switch (status) {
    case "HADIR":
      return "success";
    case "TERLAMBAT":
      return "warning";
    case "IZIN":
      return "neutral";
    case "SAKIT":
      return "warning";
    case "ALPHA":
      return "danger";
  }
}

function getStatusLabel(status: AttendanceItem["status"]): string {
  const labels: Record<AttendanceItem["status"], string> = {
    HADIR: "Hadir",
    TERLAMBAT: "Terlambat",
    IZIN: "Izin",
    SAKIT: "Sakit",
    ALPHA: "Alpha",
  };
  return labels[status];
}

type TeamAttendanceProps = {
  memberId: string;
  memberName: string;
  attendanceToday?: AttendanceItem | null;
};

function TeamMemberAttendanceItem({ memberId, memberName, attendanceToday }: TeamAttendanceProps): React.JSX.Element {
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!auth) return;

      (async () => {
        setIsLoading(true);
        try {
          const data = await getFieldAttendanceHistory(auth, { month: new Date().toISOString().slice(0, 7), limit: 5 });
          const filtered = data.filter((item) => item.userId === memberId);
          setHistory(filtered.slice(0, 5));
        } catch {
          setHistory([]);
        } finally {
          setIsLoading(false);
        }
      })();
    }, [auth, memberId])
  );

  return (
    <Card>
      <View style={styles.memberHeader}>
        <Text style={styles.memberName}>{memberName}</Text>
        {attendanceToday && (
          <Badge label={getStatusLabel(attendanceToday.status)} tone={getStatusTone(attendanceToday.status)} />
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <SkeletonList count={2} />
        </View>
      ) : history.length === 0 ? (
        <Text style={styles.emptyText}>Belum ada data absensi</Text>
      ) : (
        <View style={styles.historyWrap}>
          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <Text style={styles.historyDate}>{item.date}</Text>
              <View style={styles.historyTimes}>
                {item.checkInTime && <Text style={styles.historyTime}>Masuk: {item.checkInTime}</Text>}
                {item.checkOutTime && <Text style={styles.historyTime}>Pulang: {item.checkOutTime}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

export function TeamAttendanceScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [team, setTeam] = useState<
    Array<{
      id: string;
      name: string;
      role: "SITE_ENGINEER";
      status: "ACTIVE" | "INACTIVE";
      lastActive?: string;
      attendanceToday?: AttendanceItem;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTeamData = useCallback(async () => {
    if (!auth) return;

    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockTeam = [
      {
        id: "1",
        name: "Ahmad Engineer",
        role: "SITE_ENGINEER" as const,
        status: "ACTIVE" as const,
        lastActive: new Date().toISOString(),
        attendanceToday: {
          id: "a1",
          userId: "1",
          userName: "Ahmad Engineer",
          date: new Date().toISOString().split("T")[0],
          status: "HADIR" as const,
          createdAt: new Date().toISOString(),
        },
      },
      {
        id: "2",
        name: "Budi Engineer",
        role: "SITE_ENGINEER" as const,
        status: "ACTIVE" as const,
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        attendanceToday: {
          id: "a2",
          userId: "2",
          userName: "Budi Engineer",
          date: new Date().toISOString().split("T")[0],
          status: "TERLAMBAT" as const,
          createdAt: new Date().toISOString(),
        },
      },
      {
        id: "3",
        name: "Citra Engineer",
        role: "SITE_ENGINEER" as const,
        status: "INACTIVE" as const,
        lastActive: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    setTeam(mockTeam);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          await loadTeamData();
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
    <ScreenShell title="Absensi Tim" subtitle="Pantau kehadiran engineer secara real-time">
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

      {isLoading ? (
        <Card>
          <SkeletonList count={3} />
        </Card>
      ) : team.length === 0 ? (
        <EmptyState message="Belum ada anggota tim yang terdaftar." />
      ) : (
        <View style={styles.teamList}>
          {team.map((member) => (
            <TeamMemberAttendanceItem
              key={member.id}
              memberId={member.id}
              memberName={member.name}
              attendanceToday={member.attendanceToday}
            />
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
  teamList: {
    gap: 10,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  memberName: {
    color: "#123b45",
    fontSize: 15,
    fontWeight: "800",
  },
  loadingWrap: {
    paddingVertical: 8,
  },
  emptyText: {
    color: "#4f6f77",
    fontSize: 13,
    fontStyle: "italic",
  },
  historyWrap: {
    gap: 6,
  },
  historyItem: {
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5ecee",
  },
  historyDate: {
    color: "#123d47",
    fontSize: 13,
    fontWeight: "600",
  },
  historyTimes: {
    flexDirection: "row",
    gap: 12,
  },
  historyTime: {
    color: "#4a6f78",
    fontSize: 12,
  },
});