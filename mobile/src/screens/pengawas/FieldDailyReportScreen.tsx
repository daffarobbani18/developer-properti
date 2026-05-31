import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

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
  TextButton,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldDailyReports, submitDailyReport } from "../../services/api";
import { DailyReport } from "../../types";
import { colors } from "../../theme/colors";

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
  const [modalWeather, setModalWeather] = useState<DailyReport["weather"]>("CERAH");
  const [modalWorkerCount, setModalWorkerCount] = useState("");
  const [modalObstacles, setModalObstacles] = useState("");
  const [modalPlan, setModalPlan] = useState("");
  const [showForm, setShowForm] = useState(false);

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

  const handleModalSubmit = useCallback(async () => {
    if (!auth || !summary.trim()) {
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
        weather: modalWeather,
        photoUrls: [],
        isDraft: false,
      });

      setTodayDraft(newReport);
      setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
      setShowForm(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan laporan");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, todayDate, summary, activities, issues, modalWeather]);

  const renderWeatherSelector = (selected: DailyReport["weather"], onSelect: (w: DailyReport["weather"]) => void) => {
    const icons = { CERAH: "☀️", MENDUNG: "⛅", HUJAN: "🌧️", BADAI: "⛈️" };
    return (
      <View style={styles.weatherSection}>
        <Text style={styles.weatherLabel}>KONDISI CUACA</Text>
        <View style={styles.weatherOptions}>
          {(["CERAH", "MENDUNG", "HUJAN"] as const).map((w) => (
            <Pressable
              key={w}
              onPress={() => onSelect(w)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: selected === w ? colors.primary : "#97bbc0",
                backgroundColor: selected === w ? colors.primary + "15" : "transparent",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 20 }}>{icons[w]}</Text>
              <Text style={{ fontSize: 12, color: selected === w ? colors.primary : "#547078" }}>
                {w}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

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

      {/* Floating Action Button */}
      <Pressable
        onPress={() => setShowForm(true)}
        style={({ pressed }) => [
          styles.fab,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      {/* Modal Form */}
      {showForm && (
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setShowForm(false)}
          />
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Buat Laporan Harian</Text>

              <Text style={styles.modalDateLabel}>TANGGAL</Text>
              <Text style={styles.modalDateValue}>
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>

              {renderWeatherSelector(modalWeather, setModalWeather)}

              <LabeledInput
                label="Jumlah Pekerja"
                value={modalWorkerCount}
                onChangeText={setModalWorkerCount}
                keyboardType="number-pad"
                placeholder="Contoh: 12"
              />

              <LabeledInput
                label="Pekerjaan Hari Ini *"
                value={summary}
                onChangeText={setSummary}
                placeholder="Deskripsikan pekerjaan yang telah dilakukan..."
                multiline
                numberOfLines={4}
              />

              <LabeledInput
                label="Kendala (jika ada)"
                value={issues}
                onChangeText={setIssues}
                placeholder="Kendala yang dihadapi hari ini..."
                multiline
                numberOfLines={3}
              />

              <LabeledInput
                label="Rencana Besok"
                value={activities}
                onChangeText={setActivities}
                placeholder="Rencana pekerjaan untuk besok..."
                multiline
                numberOfLines={3}
              />

              <PrimaryButton
                label="Simpan Laporan"
                onPress={() => void handleModalSubmit()}
                loading={isSubmitting}
              />
              <View style={{ marginTop: 12 }}>
                <TextButton label="Batal" onPress={() => setShowForm(false)} />
              </View>
            </ScrollView>
          </View>
        </View>
      )}
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
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  fabIcon: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 32,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#123d47",
    marginBottom: 20,
  },
  modalDateLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#547078",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  modalDateValue: {
    fontSize: 15,
    color: "#123d47",
    marginBottom: 16,
  },
});