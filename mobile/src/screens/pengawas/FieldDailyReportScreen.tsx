import React, { useCallback, useState, useEffect, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View, KeyboardAvoidingView, Platform, Modal , StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  StatusBanner,
  SkeletonList,
  SlideInView,
} from "../../components/ui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";
import { getFieldDailyReports, submitDailyReport } from "../../services/api";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { DailyReport } from "../../types";
import { c } from "../../theme/colors";
import type { FieldStackParamList } from "../../navigation/types";
import { formatDate, formatDateFull } from "../../utils/format";

const DRAFT_AUTOSAVE_KEY = "simdp-daily-report-draft";

export function FieldDailyReportScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const { enqueueAction } = useOfflineQueue(auth);
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? (StatusBar.currentHeight ?? 45) : 45) : (insets?.top || 20);

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
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autosave draft ke AsyncStorage dengan debounce 2 detik
  // Mencegah kehilangan input saat app crash atau OS kill
  const autosaveDraft = useCallback((s: string, a: string, w: DailyReport["weather"]) => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      void AsyncStorage.setItem(DRAFT_AUTOSAVE_KEY, JSON.stringify({
        date: todayDate,
        summary: s,
        activities: a,
        weather: w,
      }));
    }, 2000);
  }, [todayDate]);

  // Restore autosaved draft saat modal dibuka jika belum ada draft dari server
  const restoreAutosaveDraft = useCallback(async () => {
    // Jika server draft sudah ada, AsyncStorage tidak boleh menimpa — server adalah source of truth
    if (todayDraft) return;
    try {
      const raw = await AsyncStorage.getItem(DRAFT_AUTOSAVE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { date: string; summary: string; activities: string; weather: DailyReport["weather"] };
      if (saved.date !== todayDate) {
        // Draft dari hari lain — hapus dan abaikan
        void AsyncStorage.removeItem(DRAFT_AUTOSAVE_KEY);
        return;
      }
      if (summary === "" && saved.summary) setSummary(saved.summary);
      if (activities === "" && saved.activities) setActivities(saved.activities);
      setModalWeather(saved.weather);
    } catch { /* ignore parse errors */ }
  }, [todayDate, todayDraft, summary, activities]);

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
        setActivities(draft.activities.join("\n"));
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

  // Bersihkan autosave draft setelah submit berhasil
  const clearAutosaveDraft = useCallback(() => {
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    void AsyncStorage.removeItem(DRAFT_AUTOSAVE_KEY);
  }, []);

  const handleModalSubmit = useCallback(async () => {
    if (!auth || !summary.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        date: todayDate,
        summary,
        activities: activities.split("\n").filter((a) => a.trim()),
        issues: [],
        weather: modalWeather,
        photoUrls: [],
        isDraft: false,
      };
      
      let newReport: any;
      let isOfflineFallback = false;
      try {
        newReport = await submitDailyReport(auth, payload);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        await enqueueAction("DAILY_REPORT", payload);
        // Fallback optimistic update — mark as draft so UI reflects pending state
        newReport = { ...payload, id: "draft-" + Date.now(), isDraft: true };
        isOfflineFallback = true;
      }

      clearAutosaveDraft();
      setTodayDraft(newReport);
      setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
      setShowForm(false);
      if (isOfflineFallback) {
        setErrorMessage("Laporan tersimpan di antrean offline dan akan dikirim saat koneksi tersedia.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan laporan");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, todayDate, summary, activities, modalWeather, clearAutosaveDraft]);

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* HEADER */}
        <LinearGradient 
          colors={[c.primary600, c.primary, c.primaryDark]} 
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroHeader}
        >
          {/* Subtle Top Inner Shadow/Reflection */}
          <LinearGradient 
             colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} 
             style={StyleSheet.absoluteFillObject} 
             pointerEvents="none" 
          />
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            {/* Referensi: CustomerProgressScreen.tsx:221-225 — spacer + kicker + title
                Tanggal dipindahkan ke dalam header (di bawah heroTitle) untuk
                menghilangkan subHeaderRow sebagai layer terpisah.
                Struktur: kicker → title → tanggal — identik dengan Customer sub-screens */}
            <View style={{ height: 20 }} />
            <View>
              <Text style={styles.heroKicker}>CATATAN LAPANGAN</Text>
              <Text style={styles.heroTitle}>Laporan Harian</Text>
              <Text style={styles.heroDateInHeader}>{formatDateFull(todayDate)}</Text>
            </View>
          </View>
        </LinearGradient>

        
        <View style={styles.overlapContainer}>
          {/* TODAY REPORT PANEL */}
          <SlideInView direction="up" delay={50} duration={400}>
             {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}
             <View style={[styles.journalCard, errorMessage && { marginTop: 16 }]}>
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
                      <Text style={styles.weatherValue}>
                        {{ CERAH: "☀️ Cerah", MENDUNG: "⛅ Mendung", HUJAN: "🌧️ Hujan", BADAI: "⛈️ Badai" }[todayDraft.weather] ?? todayDraft.weather}
                      </Text>
                    </View>
                   <Text style={styles.summaryValue}>{todayDraft.summary}</Text>
                   {todayDraft.activities.length > 0 && (
                     <View style={styles.activitiesTag}>
                        <Text style={styles.activitiesTagText}>{todayDraft.activities.length} aktivitas tercatat</Text>
                     </View>
                   )}
                    {todayDraft.isDraft ? (
                       <Pressable style={({pressed}) => [styles.editBtn, pressed && styles.pressed]} onPress={() => setShowForm(true)}>
                         <Ionicons name="create-outline" size={18} color="#ffffff" />
                         <Text style={styles.editBtnText}>Edit Jurnal</Text>
                       </Pressable>
                    ) : (
                      <View style={styles.submittedRow}>
                        <Ionicons name="checkmark-circle" size={16} color={c.success.text} />
                        <Text style={styles.submittedText}>Laporan sudah terkirim dan tidak dapat diubah</Text>
                      </View>
                    )}
                 </View>
                ) : (
                  /* Empty state: pola CustomerSupportScreen — Referensi CustomerSupportScreen.tsx:308-317 */
                  <View style={styles.emptyJournal}>
                    <View style={styles.emptyJournalIconWrap}>
                      <Ionicons name="create-outline" size={28} color={c.warning.text} />
                    </View>
                    <Text style={styles.emptyJournalTitle}>Laporan belum dibuat</Text>
                    <Text style={styles.emptyJournalDesc}>Catat aktivitas lapangan hari ini agar perkembangan proyek dapat dipantau dengan akurat.</Text>
                    <Pressable style={({pressed}) => [styles.addBtn, pressed && styles.pressed]} onPress={() => setShowForm(true)}>
                       <Ionicons name="add" size={20} color="#ffffff" />
                       <Text style={styles.addBtnText}>Buat Laporan Sekarang</Text>
                    </Pressable>
                  </View>
                )}
             </View>
          </SlideInView>
        </View>

        <View style={styles.contentPad}>
          {/* RECENT REPORTS */}
          <SlideInView direction="up" delay={150} duration={400}>
            {(() => {
              const history = reports.filter((r) => r.date !== todayDate);
              return (
                <>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Riwayat Jurnal</Text>
                    {!isLoading && history.length > 0 && (
                      <Text style={styles.sectionCount}>{history.length} laporan</Text>
                    )}
                  </View>
                  {isLoading ? (
                    <SkeletonList count={3} />
                  ) : history.length === 0 ? (
                    <EmptyState message="Belum ada riwayat laporan bulan ini." />
                  ) : (
                    <View style={styles.historyList}>
                      {history.slice(0, 7).map((r, index, arr) => (
                        <View key={r.id}>
                          <View style={styles.historyItem}>
                            {/* Left: weather icon */}
                            <View style={styles.historyIconWrap}>
                              <Text style={styles.historyWeatherEmoji}>
                                {{ CERAH: "☀️", MENDUNG: "⛅", HUJAN: "🌧️", BADAI: "⛈️" }[r.weather] ?? "📋"}
                              </Text>
                            </View>
                            {/* Center */}
                            <View style={styles.historyCenter}>
                              <Text style={styles.historyDate}>{formatDate(r.date)}</Text>
                              <Text style={styles.historySummary} numberOfLines={2}>{r.summary}</Text>
                              {r.activities.length > 0 && (
                                <Text style={styles.historyActivitiesCount}>
                                  {r.activities.length} aktivitas
                                </Text>
                              )}
                            </View>
                            {/* Right: draft badge */}
                            {r.isDraft && (
                              <View style={styles.historyDraftBadge}>
                                <Text style={styles.historyDraftText}>Draft</Text>
                              </View>
                            )}
                          </View>
                          {index < arr.length - 1 && <View style={styles.historyDivider} />}
                        </View>
                      ))}
                    </View>
                  )}
                </>
              );
            })()}
          </SlideInView>
        </View>
      </ScrollView>

      {/* CREATE REPORT MODAL */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onShow={() => void restoreAutosaveDraft()}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>

            {/* ── MODAL HERO AREA ── */}
            <LinearGradient
              colors={[c.primary600, c.primary, c.primaryDark]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalHero}
            >
              {/* Close button di atas kiri */}
              <View style={[styles.modalHeroTopRow, { paddingTop: Math.max(safeTop, 16) }]}>
                <Pressable onPress={() => setShowForm(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color="#ffffff" />
                </Pressable>
                <Text style={styles.modalHeroKicker}>JURNAL HARIAN</Text>
                <View style={{ width: 44 }} />
              </View>

              {/* Tanggal sebagai hero element */}
              <Text style={styles.modalHeroDate}>
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
              </Text>

              {/* Weather chips — horizontal scrollable */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalHeroPillRow}
                style={styles.modalHeroPillScroll}
              >
                {(["CERAH", "MENDUNG", "HUJAN", "BADAI"] as const).map((w) => {
                  const icons = { CERAH: "☀️", MENDUNG: "⛅", HUJAN: "🌧️", BADAI: "⛈️" };
                  const isSelected = modalWeather === w;
                  return (
                    <Pressable
                      key={w}
                      onPress={() => {
                        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setModalWeather(w);
                        autosaveDraft(summary, activities, w);
                      }}
                      style={[
                        styles.modalHeroPill,
                        isSelected && styles.modalHeroPillSelected,
                      ]}
                    >
                      <Text style={styles.modalHeroPillEmoji}>{icons[w]}</Text>
                      <Text style={[styles.modalHeroPillText, isSelected && styles.modalHeroPillTextSelected]}>{w}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </LinearGradient>

            {/* ── FORM BODY ── */}
            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalBodyContent} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <LabeledInput
                  label="Ringkasan Pekerjaan *"
                  hint="Wajib diisi sebelum laporan dapat disimpan"
                  value={summary}
                  onChangeText={(text) => {
                    setSummary(text);
                    autosaveDraft(text, activities, modalWeather);
                  }}
                  placeholder="Apa yang dikerjakan hari ini?"
                  multiline
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <LabeledInput
                  label="Detail Aktivitas"
                  hint="Tulis satu aktivitas per baris"
                  value={activities}
                  onChangeText={(text) => {
                    setActivities(text);
                    autosaveDraft(summary, text, modalWeather);
                  }}
                  placeholder={"- Material pasir tiba\n- Pemasangan bata unit A1"}
                  multiline
                  returnKeyType="default"
                  blurOnSubmit={false}
                />
              </View>
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
  // heroHeader: referensi CustomerHomeScreen.tsx:286-292
  heroHeader: {
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  // heroSafeArea: referensi CustomerHomeScreen.tsx:295-297
  heroSafeArea: {
    paddingHorizontal: 24,
  },
  // heroKicker + heroTitle: CustomerProgressScreen.tsx:300-312 — identik
  heroKicker: { color: "#FBBF24", fontSize: 12, fontWeight: "800", letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { color: "#ffffff", fontSize: 34, fontWeight: "900", letterSpacing: -1.2 },
  // heroDateInHeader: tanggal di dalam hero, di bawah heroTitle
  // Warna rgba(255,255,255,0.75) mengikuti heroGreeting CustomerHomeScreen
  heroDateInHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    marginTop: 6,
    letterSpacing: 0.1,
  },
  // overlapContainer: sekarang dapat menggunakan marginTop:-40 karena subHeaderRow dihapus.
  // Referensi: CustomerHomeScreen.tsx:347-351 — marginTop:-40, paddingHorizontal:24, zIndex:10
  overlapContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
    zIndex: 10,
  },
  // contentPad: referensi CustomerHomeScreen.tsx:419-422
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  // journalCard: referensi CustomerHomeScreen activeTicketCard/invoiceCard — shadow identik
  journalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: c.neutral100,
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
  // editBtn: CustomerBillingScreen submitBtn pattern — backgroundColor:c.primary, borderRadius:16
  // c.primaryLight (#334155) sebagai background menghasilkan teks gelap di background gelap.
  // Customer menggunakan c.primary sebagai CTA background dengan teks putih — kontras jelas.
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: c.accent,
    borderRadius: 16,
    gap: 8,
    marginTop: 16,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },

  submittedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: c.neutral100,
  },
  submittedText: {
    fontSize: 13,
    fontWeight: "500",
    color: c.success.text,
    flex: 1,
  },
  // emptyJournal: CustomerSupportScreen.emptyStateWrap pattern
  // borderStyle dashed + padding generous + centered — Referensi: CustomerSupportScreen.tsx:773-781
  emptyJournal: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  // emptyJournalIconWrap: CustomerSupportScreen.emptyStateIconWrap
  // Warning bg karena kondisi ini memerlukan tindakan
  emptyJournalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: c.warning.bg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  // emptyJournalTitle: CustomerSupportScreen.emptyStateTitle
  emptyJournalTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    marginTop: 12,
    marginBottom: 6,
  },
  // emptyJournalDesc: CustomerSupportScreen.emptyStateDesc
  emptyJournalDesc: {
    fontSize: 13,
    color: c.neutral500,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  // addBtn: CustomerSupportScreen.emptyStateBtn — borderRadius:99, paddingH:28, paddingV:14
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.accent,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 99,
    gap: 8,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -0.5,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral400,
  },
  // historyList: single card container dengan divider — pola CustomerBillingScreen cleanList
  historyList: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  historyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: c.neutral50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  historyWeatherEmoji: { fontSize: 20 },
  historyCenter: { flex: 1 },
  historyDate: {
    fontSize: 11,
    fontWeight: "700",
    color: c.neutral400,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  historySummary: {
    fontSize: 14,
    fontWeight: "600",
    color: c.neutral900,
    lineHeight: 20,
  },
  historyActivitiesCount: {
    fontSize: 12,
    fontWeight: "500",
    color: c.neutral400,
    marginTop: 4,
  },
  historyDraftBadge: {
    backgroundColor: c.warning.bg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  historyDraftText: {
    fontSize: 11,
    fontWeight: "700",
    color: c.warning.text,
  },
  historyDivider: {
    height: 1,
    backgroundColor: c.neutral100,
    marginHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // ── Modal Hero Area ──
  modalHero: {
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  modalHeroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalHeroKicker: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.5,
  },
  modalHeroDate: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -0.8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  modalHeroPillScroll: {
    alignSelf: "flex-start",
  },
  modalHeroPillRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 8,
  },
  modalHeroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  modalHeroPillSelected: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: "#ffffff",
  },
  modalHeroPillEmoji: {
    fontSize: 14,
  },
  modalHeroPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
  },
  modalHeroPillTextSelected: {
    color: c.primaryDark,
  },

  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBodyContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
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
