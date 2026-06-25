const fs = require('fs');

const file = 'src/screens/pengawas/FieldDailyReportScreen.tsx';

const newContent = `import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  SecondaryButton,
  StatusBanner,
  SkeletonList,
  SlideInView,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldDailyReports, submitDailyReport } from "../../services/api";
import { DailyReport } from "../../types";
import { c } from "../../theme/colors";
import type { FieldStackParamList } from "../../navigation/types";

export function FieldDailyReportScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();

  const [reports, setReports] = useState<DailyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todayDraft, setTodayDraft] = useState<DailyReport | null>(null);

  const todayDate = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const [summary, setSummary] = useState("");
  const [activities, setActivities] = useState("");
  const [modalWeather, setModalWeather] = useState<DailyReport["weather"]>("CERAH");
  const [showForm, setShowForm] = useState(false);

  const loadReports = useCallback(async () => {
    if (!auth) return;
    setErrorMessage(null);
    try {
      const data = await getFieldDailyReports(auth, { month: currentMonth, includeDraft: true });
      setReports(data);

      const draft = data.find((r) => r.date === todayDate && r.isDraft);
      setTodayDraft(draft ?? null);

      if (draft) {
        setSummary(draft.summary);
        setActivities(draft.activities.join("\\n"));
        setModalWeather(draft.weather);
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
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadReports])
  );

  const handleModalSubmit = useCallback(async () => {
    if (!auth || !summary.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const newReport = await submitDailyReport(auth, {
        date: todayDate,
        summary,
        activities: activities.split("\\n").filter((a) => a.trim()),
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
  }, [auth, todayDate, summary, activities, modalWeather]);

  const renderWeatherSelector = (selected: DailyReport["weather"], onSelect: (w: DailyReport["weather"]) => void) => {
    const icons = { CERAH: "☀️", MENDUNG: "⛅", HUJAN: "🌧️", BADAI: "⛈️" };
    return (
      <View style={styles.weatherSection}>
        <Text style={styles.inputLabel}>Kondisi Cuaca Hari Ini</Text>
        <View style={styles.weatherOptionsRow}>
          {(["CERAH", "MENDUNG", "HUJAN", "BADAI"] as const).map((w) => {
            const isSelected = selected === w;
            return (
              <Pressable
                key={w}
                onPress={() => {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelect(w);
                }}
                style={[
                  styles.weatherBtn,
                  isSelected && styles.weatherBtnSelected
                ]}
              >
                <Text style={styles.weatherEmoji}>{icons[w]}</Text>
                <Text style={[styles.weatherText, isSelected && styles.weatherTextSelected]}>{w}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={[c.primaryDark, "#020617"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
          <View style={styles.heroTopRow}>
            <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text style={styles.heroHeaderTitle}>Laporan Harian</Text>
            <View style={{ width: 44 }} />
          </View>
          <View style={styles.heroDateRow}>
             <Text style={styles.heroDate}>{todayDate}</Text>
             <Text style={styles.heroSubtitle}>Catatan Aktivitas Lapangan</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.contentPad}>
          {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

          {/* TODAY REPORT PANEL */}
          <SlideInView direction="up" delay={50} duration={400} style={{ marginTop: errorMessage ? 16 : -24 }}>
             <View style={styles.journalCard}>
               <View style={styles.journalHeader}>
                  <Text style={styles.journalTitle}>Jurnal Hari Ini</Text>
                  {isLoading ? null : (
                     <Badge 
                       label={todayDraft ? (todayDraft.isDraft ? "Draft" : "Terkirim") : "Belum Ada"} 
                       tone={todayDraft ? (todayDraft.isDraft ? "warning" : "success") : "neutral"} 
                     />
                  )}
               </View>

               {isLoading ? (
                 <SkeletonList count={1} />
               ) : todayDraft ? (
                 <View style={styles.journalContent}>
                   <View style={styles.weatherRow}>
                     <Ionicons name="partly-sunny" size={16} color={c.neutral500} />
                     <Text style={styles.weatherValue}>{todayDraft.weather}</Text>
                   </View>
                   <Text style={styles.summaryValue}>{todayDraft.summary}</Text>
                   {todayDraft.activities.length > 0 && (
                     <View style={styles.activitiesTag}>
                        <Text style={styles.activitiesTagText}>{todayDraft.activities.length} aktivitas tercatat</Text>
                     </View>
                   )}
                   {todayDraft.isDraft && (
                     <Pressable style={({pressed}) => [styles.editBtn, pressed && styles.pressed]} onPress={() => setShowForm(true)}>
                       <Ionicons name="create-outline" size={18} color={c.primary} />
                       <Text style={styles.editBtnText}>Edit Jurnal</Text>
                     </Pressable>
                   )}
                 </View>
               ) : (
                 <View style={styles.emptyJournal}>
                   <Ionicons name="document-text-outline" size={42} color={c.neutral300} style={{ marginBottom: 12 }} />
                   <Text style={styles.emptyJournalText}>Belum ada catatan hari ini.</Text>
                   <Pressable style={({pressed}) => [styles.addBtn, pressed && styles.pressed]} onPress={() => setShowForm(true)}>
                      <Ionicons name="add" size={20} color="#ffffff" />
                      <Text style={styles.addBtnText}>Buat Laporan</Text>
                   </Pressable>
                 </View>
               )}
             </View>
          </SlideInView>

          {/* RECENT REPORTS */}
          <SlideInView direction="up" delay={150} duration={400} style={{ marginTop: 32 }}>
             <Text style={styles.sectionTitle}>Riwayat Jurnal</Text>
             {isLoading ? (
               <SkeletonList count={2} />
             ) : reports.filter(r => r.date !== todayDate).length === 0 ? (
               <EmptyState message="Belum ada riwayat laporan." />
             ) : (
               <View style={styles.historyList}>
                 {reports.filter(r => r.date !== todayDate).slice(0, 5).map((r, index) => (
                   <View key={r.id} style={styles.historyItem}>
                     <View style={styles.historyLeft}>
                       <Text style={styles.historyDate}>{r.date}</Text>
                       <Text style={styles.historySummary} numberOfLines={2}>{r.summary}</Text>
                     </View>
                     <View style={[styles.historyWeather, { backgroundColor: c.neutral100 }]}>
                        <Text style={styles.historyWeatherText}>{r.weather}</Text>
                     </View>
                   </View>
                 ))}
               </View>
             )}
          </SlideInView>

        </View>
      </ScrollView>

      {/* CREATE REPORT MODAL */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
          <SafeAreaView style={{ flex: 1 }} edges={['top']}>
             <View style={styles.modalHeader}>
               <Pressable onPress={() => setShowForm(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color={c.neutral900} />
               </Pressable>
               <Text style={styles.modalTitle}>Tulis Jurnal Harian</Text>
               <View style={{ width: 44 }} />
             </View>

             <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
               {renderWeatherSelector(modalWeather, setModalWeather)}

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Ringkasan Pekerjaan</Text>
                 <LabeledInput
                   value={summary}
                   onChangeText={setSummary}
                   placeholder="Contoh: Pengecoran fondasi blok A selesai..."
                   multiline
                 />
               </View>

               <View style={styles.inputGroup}>
                 <Text style={styles.inputLabel}>Detail Aktivitas (Pisahkan dengan baris baru)</Text>
                 <LabeledInput
                   value={activities}
                   onChangeText={setActivities}
                   placeholder="- Material pasir tiba\\n- Pemasangan bata unit A1"
                   multiline
                 />
               </View>
               
               <View style={{ height: 40 }} />
             </ScrollView>

             <View style={styles.modalFooter}>
                <PrimaryButton
                  label={isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
                  onPress={() => void handleModalSubmit()}
                  disabled={isSubmitting || summary.trim().length === 0}
                />
             </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  heroHeader: {
    paddingBottom: 48,
  },
  heroSafeArea: {
    paddingTop: Platform.OS === 'android' ? 20 : 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  heroDateRow: {
    paddingHorizontal: 24,
  },
  heroDate: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  contentPad: {
    paddingHorizontal: 24,
  },
  journalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
  },
  journalContent: {
    gap: 12,
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weatherValue: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral600,
  },
  summaryValue: {
    fontSize: 16,
    lineHeight: 24,
    color: c.neutral900,
  },
  activitiesTag: {
    alignSelf: "flex-start",
    backgroundColor: c.neutral100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  activitiesTagText: {
    fontSize: 12,
    fontWeight: "600",
    color: c.neutral600,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: c.primaryLight,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: c.primaryDark,
  },
  emptyJournal: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  emptyJournalText: {
    fontSize: 14,
    color: c.neutral500,
    marginBottom: 20,
    textAlign: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 16,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.neutral200,
  },
  historyLeft: {
    flex: 1,
    marginRight: 16,
  },
  historyDate: {
    fontSize: 12,
    fontWeight: "700",
    color: c.neutral500,
    marginBottom: 4,
  },
  historySummary: {
    fontSize: 15,
    fontWeight: "600",
    color: c.neutral900,
    lineHeight: 20,
  },
  historyWeather: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  historyWeatherText: {
    fontSize: 12,
    fontWeight: "800",
    color: c.neutral600,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: c.neutral100,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  weatherSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: c.neutral700,
    marginBottom: 12,
  },
  weatherOptionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  weatherBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: c.neutral50,
    borderWidth: 2,
    borderColor: "transparent",
  },
  weatherBtnSelected: {
    backgroundColor: c.primaryLight,
    borderColor: c.primary,
  },
  weatherEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 11,
    fontWeight: "700",
    color: c.neutral500,
  },
  weatherTextSelected: {
    color: c.primaryDark,
  },
  inputGroup: {
    marginBottom: 24,
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: c.neutral100,
    backgroundColor: "#ffffff",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('FieldDailyReportScreen fully redesigned.');
