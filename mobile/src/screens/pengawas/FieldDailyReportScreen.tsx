import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  SecondaryButton,
  ScreenShell,
  SectionTitle,
  StatusBanner,
  SkeletonList,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldDailyReports, submitDailyReport } from "../../services/api";
import { DailyReport } from "../../types";

export function FieldDailyReportScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todayDraft, setTodayDraft] = useState<DailyReport | null>(null);

  const todayDate = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [summary, setSummary] = useState("");
  const [activities, setActivities] = useState("");
  const [issues, setIssues] = useState("");
  const [weather, setWeather] = useState<DailyReport["weather"]>("CERAH");

  const loadReports = useCallback(async () => {
    if (!auth) {
      return;
    }

    setErrorMessage(null);
    try {
      const data = await getFieldDailyReports(auth, { month: currentMonth, includeDraft: true });
      setReports(data);

      const draft = data.find((r) => r.date === todayDate && r.isDraft);
      setTodayDraft(draft ?? null);

      if (draft) {
        setSummary(draft.summary);
        setActivities(draft.activities.join("\n"));
        setIssues(draft.issues.join("\n"));
        setWeather(draft.weather);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat laporan harian");
    }
  }, [auth, currentMonth, todayDate]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          await loadReports();
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadReports])
  );

  const handleSaveDraft = useCallback(async () => {
    if (!auth) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newReport = await submitDailyReport(auth, {
        date: todayDate,
        summary,
        activities: activities.split("\n").filter((a) => a.trim()),
        issues: issues.split("\n").filter((i) => i.trim()),
        weather,
        photoUrls: todayDraft?.photoUrls ?? [],
        isDraft: true,
      });

      setTodayDraft(newReport);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan draft");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, todayDate, summary, activities, issues, weather, todayDraft]);

  const handleSubmitReport = useCallback(async () => {
    if (!auth) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newReport = await submitDailyReport(auth, {
        date: todayDate,
        summary,
        activities: activities.split("\n").filter((a) => a.trim()),
        issues: issues.split("\n").filter((i) => i.trim()),
        weather,
        photoUrls: todayDraft?.photoUrls ?? [],
        isDraft: false,
      });

      setTodayDraft(newReport);
      setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengirim laporan");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, todayDate, summary, activities, issues, weather, todayDraft]);

  const weatherOptions: DailyReport["weather"][] = ["CERAH", "MENDUNG", "HUJAN", "BADAI"];

  return (
    <ScreenShell title="Laporan Harian" subtitle="Catat aktivitas kerja di lokasi proyek">
      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      <Card>
        <SectionTitle title="Laporan Hari Ini" caption={todayDate} />

        {isLoading ? (
          <SkeletonList count={3} />
        ) : (
          <View style={styles.formWrap}>
            <LabeledInput
              label="Ringkasan Pekerjaan"
              placeholder="Contoh: Progres pondasi mencapai 50%"
              value={summary}
              onChangeText={setSummary}
              multiline
              numberOfLines={3}
            />

            <LabeledInput
              label="Aktivitas (pisahkan baris baru)"
              placeholder="1. Pemeriksaan pondasi&#10;2. Quality check beton"
              value={activities}
              onChangeText={setActivities}
              multiline
              numberOfLines={4}
            />

            <LabeledInput
              label="Masalah/Kendala (opsional)"
              placeholder="Contoh: Material terlambat"
              value={issues}
              onChangeText={setIssues}
              multiline
              numberOfLines={3}
            />

            <View style={styles.weatherSection}>
              <Text style={styles.weatherLabel}>Cuaca Hari Ini</Text>
              <View style={styles.weatherOptions}>
                {weatherOptions.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setWeather(option)}
                    style={({ pressed }) => [
                      styles.weatherOption,
                      weather === option && styles.weatherOptionActive,
                      pressed && styles.weatherOptionPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.weatherText,
                        weather === option && styles.weatherTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.buttonRow}>
              <SecondaryButton
                label="Simpan Draft"
                onPress={() => void handleSaveDraft()}
                disabled={isSubmitting || !summary.trim()}
              />
              <PrimaryButton
                label={todayDraft && !todayDraft.isDraft ? "Laporan Terkirim" : "Kirim Laporan"}
                onPress={() => void handleSubmitReport()}
                disabled={isSubmitting || !summary.trim() || Boolean(todayDraft && !todayDraft.isDraft)}
              />
            </View>
          </View>
        )}
      </Card>

      <Card>
        <SectionTitle title="Riwayat Laporan" caption="3 laporan terakhir" />

        {isLoading ? (
          <SkeletonList count={2} />
        ) : reports.length === 0 ? (
          <EmptyState message="Belum ada laporan harian" />
        ) : (
          <View style={styles.reportsList}>
            {reports.slice(0, 3).map((report) => (
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
          </View>
        )}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  formWrap: {
    gap: 12,
  },
  weatherSection: {
    gap: 8,
  },
  weatherLabel: {
    color: "#1b4a55",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  weatherOptions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  weatherOption: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#97bbc0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f8fcfc",
  },
  weatherOptionActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#ddf2f4",
  },
  weatherOptionPressed: {
    opacity: 0.8,
  },
  weatherText: {
    color: "#36606a",
    fontSize: 12,
    fontWeight: "600",
  },
  weatherTextActive: {
    color: "#134d57",
    fontWeight: "800",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  reportsList: {
    gap: 12,
  },
  reportItem: {
    paddingVertical: 8,
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
});