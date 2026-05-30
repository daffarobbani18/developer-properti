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
import { getFieldDailyReports } from "../../services/api";
import { DailyReport } from "../../types";

type EngineerReport = {
  id: string;
  name: string;
  role: "SITE_ENGINEER";
  reports: DailyReport[];
};

export function ProjectReportsScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [engineers, setEngineers] = useState<EngineerReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadReports = useCallback(async () => {
    if (!auth) return;

    setIsLoading(true);

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const reports = await getFieldDailyReports(auth, { month: currentMonth });

      const engineerNames = ["Rizky Wahyudi", "Budi Engineer", "Citra Engineer"];
      const engineerIds = ["u-engineer-1", "u-engineer-2", "u-engineer-3"];

      const groupedReports: EngineerReport[] = engineerIds.map((id, index) => ({
        id,
        name: engineerNames[index] ?? `Engineer ${index + 1}`,
        role: "SITE_ENGINEER" as const,
        reports: reports.filter((r) => r.userId === id || r.userName === engineerNames[index]),
      }));

      setEngineers(groupedReports);
    } catch {
      const mockReports: EngineerReport[] = [
        {
          id: "u-engineer-1",
          name: "Rizky Wahyudi",
          role: "SITE_ENGINEER",
          reports: [
            {
              id: "dr-1",
              userId: "u-engineer-1",
              userName: "Rizky Wahyudi",
              date: "2026-05-16",
              projectId: "project-1",
              summary: "Progres struktur lantai 2 Unit MG-A12 mencapai 75%",
              activities: ["Pemeriksaan pondasi blok A", "Quality check pengecoran balok"],
              issues: ["Material besi terlambat 1 hari"],
              weather: "CERAH",
              temperature: 32,
              photoUrls: [],
              isDraft: false,
              createdAt: "2026-05-16T17:30:00.000Z",
              updatedAt: "2026-05-16T17:30:00.000Z",
            },
          ],
        },
        {
          id: "u-engineer-2",
          name: "Budi Engineer",
          role: "SITE_ENGINEER",
          reports: [
            {
              id: "dr-2",
              userId: "u-engineer-2",
              userName: "Budi Engineer",
              date: "2026-05-15",
              projectId: "project-1",
              summary: "Pengerjaan struktur lantai 2 selesai 50%",
              activities: ["Pengawasan pengecoran kolom K-12"],
              issues: ["Butuh tambahan besi wf 100"],
              weather: "MENDUNG",
              temperature: 28,
              photoUrls: [],
              isDraft: false,
              createdAt: "2026-05-15T17:00:00.000Z",
              updatedAt: "2026-05-15T17:00:00.000Z",
            },
          ],
        },
        {
          id: "u-engineer-3",
          name: "Citra Engineer",
          role: "SITE_ENGINEER",
          reports: [],
        },
      ];

      setEngineers(mockReports);
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const totalReports = engineers.reduce((sum, e) => sum + e.reports.length, 0);
  const draftReports = engineers.reduce(
    (sum, e) => sum + e.reports.filter((r) => r.isDraft).length,
    0
  );
  const submittedReports = totalReports - draftReports;

  return (
    <ScreenShell title="Laporan Tim" subtitle="Review laporan harian engineer">
      <Card>
        <SectionTitle title="Statistik Laporan" caption="Ringkasan laporan harian bulan ini" />
        <View style={styles.statsGrid}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Total Engineer</Text>
            <Text style={styles.statValue}>{engineers.length}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Laporan Masuk</Text>
            <Text style={styles.statValue}>{submittedReports}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Draft</Text>
            <Text style={styles.statValue}>{draftReports}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Total Laporan</Text>
            <Text style={styles.statValue}>{totalReports}</Text>
          </View>
        </View>
      </Card>

      {isLoading ? (
        <Card>
          <SkeletonList count={3} />
        </Card>
      ) : engineers.length === 0 ? (
        <EmptyState message="Belum ada laporan dari engineer." />
      ) : (
        <View style={styles.engineersList}>
          {engineers.map((engineer) => (
            <Card key={engineer.id}>
              <View style={styles.engineerHeader}>
                <Text style={styles.engineerName}>{engineer.name}</Text>
                <Badge label={`${engineer.reports.length} laporan`} tone="neutral" />
              </View>

              {engineer.reports.length === 0 ? (
                <Text style={styles.emptyText}>Belum ada laporan</Text>
              ) : (
                <View style={styles.reportsList}>
                  {engineer.reports.slice(0, 3).map((report) => (
                    <View key={report.id} style={styles.reportItem}>
                      <View style={styles.reportHeader}>
                        <Text style={styles.reportDate}>{report.date}</Text>
                        {report.isDraft && <Badge label="Draft" tone="warning" />}
                      </View>
                      <Text style={styles.reportSummary} numberOfLines={2}>
                        {report.summary}
                      </Text>
                      <Text style={styles.reportMeta}>
                        {report.activities.length} aktivitas • Cuaca: {report.weather}
                      </Text>
                    </View>
                  ))}
                  {engineer.reports.length > 3 && (
                    <Text style={styles.moreText}>+{engineer.reports.length - 3} laporan lainnya</Text>
                  )}
                </View>
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
  engineersList: {
    gap: 10,
  },
  engineerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  engineerName: {
    color: "#123b45",
    fontSize: 15,
    fontWeight: "800",
  },
  emptyText: {
    color: "#4f6f77",
    fontSize: 13,
    fontStyle: "italic",
  },
  reportsList: {
    gap: 8,
  },
  reportItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5ecee",
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  reportDate: {
    color: "#123d47",
    fontSize: 13,
    fontWeight: "600",
  },
  reportSummary: {
    color: "#3a5f67",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
  },
  reportMeta: {
    color: "#547078",
    fontSize: 11,
  },
  moreText: {
    color: "#1a6d78",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});