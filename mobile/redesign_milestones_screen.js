const fs = require('fs');

const file = 'src/screens/pengawas/FieldMilestonesScreen.tsx';

// We rewrite the file replacing ScreenShell and Card
const newContent = `import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, Dimensions, Animated, Modal, KeyboardAvoidingView, Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { FieldStackParamList } from "../../navigation/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import {
  Badge,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  StatusBanner,
  SlideInView,
  SkeletonList,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import {
  getFieldUnits,
  getProjectOptions,
  getUnitMilestones,
  submitMilestoneUpdate,
} from "../../services/api";
import { capturePhoto, pickImages } from "../../services/media";
import { Milestone, Unit } from "../../types";
import {
  formatDate,
  formatMilestoneStatusLabel,
  inferBannerTone,
} from "../../utils/format";
import { c } from "../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
type MilestoneStatus = Milestone["status"];

export function FieldMilestonesScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const netInfo = useNetInfo();
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const { queueCount, enqueueMilestone, flushQueue, refreshQueueCount } = useOfflineQueue(auth);

  const route = useRoute<RouteProp<FieldStackParamList, "FieldMilestones">>();
  const initialProjectId = route.params?.projectId ?? null;
  const initialUnitId = route.params?.unitId ?? null;

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(initialUnitId);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<MilestoneStatus>("IN_PROGRESS");
  const [noteDraft, setNoteDraft] = useState("");
  const [photoUrlDraft, setPhotoUrlDraft] = useState("");
  const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const isNetworkOffline = netInfo.isConnected === false;
  const effectiveOfflineMode = isNetworkOffline || isOfflineMode;

  const selectedMilestone = useMemo(
    () => milestones.find((item) => item.id === selectedMilestoneId) ?? null,
    [milestones, selectedMilestoneId]
  );

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === selectedUnitId) ?? null,
    [units, selectedUnitId]
  );

  const isSiapHuni = selectedUnit?.status === "Siap Huni";

  const completedMilestonesCount = useMemo(
    () => milestones.filter((item) => item.status === "COMPLETED").length,
    [milestones]
  );

  const loadProjects = useCallback(async () => {
    if (!auth) return;
    const result = await getProjectOptions(auth);
    setProjects(result);
    if (!selectedProjectId && result.length > 0) {
      setSelectedProjectId(result[0].id);
    }
  }, [auth, selectedProjectId]);

  const loadUnits = useCallback(async () => {
    if (!auth || !selectedProjectId) return;
    const result = await getFieldUnits(auth, { projectId: selectedProjectId });
    setUnits(result);
    if (!result.find((item) => item.id === selectedUnitId)) {
      setSelectedUnitId(result[0]?.id ?? null);
    }
  }, [auth, selectedProjectId, selectedUnitId]);

  const loadMilestones = useCallback(async () => {
    if (!auth || !selectedUnitId) {
      setMilestones([]);
      return;
    }
    const result = await getUnitMilestones(auth, selectedUnitId);
    setMilestones(result);
  }, [auth, selectedUnitId]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setIsLoading(true);
        setBanner(null);
        try {
          await loadProjects();
        } catch (error) {
          if (!cancelled) setBanner(error instanceof Error ? error.message : "Gagal memuat proyek");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadProjects])
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (selectedProjectId) {
        setIsLoading(true);
        try {
          await loadUnits();
        } catch (error) {
          if (!cancelled) setBanner("Gagal memuat unit");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [selectedProjectId, loadUnits]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (selectedUnitId) {
        setIsLoading(true);
        try {
          await loadMilestones();
        } catch (error) {
          if (!cancelled) setBanner("Gagal memuat milestone");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [selectedUnitId, loadMilestones]);

  const openMilestoneModal = useCallback((milestone: Milestone) => {
    setSelectedMilestoneId(milestone.id);
    setStatusDraft(milestone.status);
    setNoteDraft(milestone.note || "");
    setPhotoUrlDraft("");
    setSelectedPhotoUris([]);
    setIsModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSelectedMilestoneId(null);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!auth || !selectedMilestoneId) return;

    if (effectiveOfflineMode) {
      await enqueueMilestone({
        milestoneId: selectedMilestoneId,
        status: statusDraft,
        note: noteDraft,
        photoUris: selectedPhotoUris,
        timestamp: new Date().toISOString(),
      });

      setMilestones((prev) =>
        prev.map((m) =>
          m.id === selectedMilestoneId
            ? { ...m, status: statusDraft, note: noteDraft, photos: selectedPhotoUris.map(uri => ({ id: uri, url: uri, caption: "Offline Queue" })) }
            : m
        )
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBanner(\`Disimpan offline. Antrean tersimpan.\`);
      closeModal();
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      await submitMilestoneUpdate(auth, {
        milestoneId: selectedMilestoneId,
        status: statusDraft,
        note: noteDraft,
        photoUrls: selectedPhotoUris,
      });

      await loadMilestones();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      closeModal();
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengupdate progres");
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    auth,
    selectedMilestoneId,
    statusDraft,
    noteDraft,
    selectedPhotoUris,
    effectiveOfflineMode,
    enqueueMilestone,
    loadMilestones,
    closeModal,
  ]);

  const takePhoto = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const uri = await capturePhoto();
      if (uri) {
        setSelectedPhotoUris((prev) => [...prev, uri]);
      }
    } catch (error) {
      setBanner("Gagal mengambil foto dari kamera.");
    }
  }, []);

  const pickPhotos = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const uris = await pickImages({ selectionLimit: 3 });
      if (uris.length > 0) {
        setSelectedPhotoUris((prev) => [...prev, ...uris]);
      }
    } catch (error) {
      setBanner("Gagal memilih foto dari galeri.");
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* IMMERSIVE HEADER */}
      <LinearGradient colors={[c.primaryDark, "#020617"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
          <View style={styles.heroTopRow}>
            <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text style={styles.heroHeaderTitle}>Update Progres</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* PROJECT / UNIT SELECTOR ROW */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
             {projects.map(p => (
               <Pressable 
                 key={p.id} 
                 onPress={() => setSelectedProjectId(p.id)}
                 style={[styles.chip, selectedProjectId === p.id && styles.chipActive]}
               >
                 <Text style={[styles.chipText, selectedProjectId === p.id && styles.chipTextActive]}>{p.name}</Text>
               </Pressable>
             ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.selectorScroll, { marginTop: 12 }]}>
             {units.map(u => (
               <Pressable 
                 key={u.id} 
                 onPress={() => setSelectedUnitId(u.id)}
                 style={[styles.chip, selectedUnitId === u.id && styles.chipActive]}
               >
                 <Text style={[styles.chipText, selectedUnitId === u.id && styles.chipTextActive]}>Blok {u.blok} No {u.nomor}</Text>
               </Pressable>
             ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* OFFLINE QUEUE BAR */}
      {effectiveOfflineMode && (
         <View style={styles.offlineBar}>
           <Ionicons name="cloud-offline" size={20} color="#ffffff" />
           <Text style={styles.offlineBarText}>Mode Offline Aktif - {queueCount} Antrean</Text>
         </View>
      )}

      {/* CONTENT */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isLoading && projects.length > 0} onRefresh={loadMilestones} tintColor="#ffffff" />}
      >
        <View style={styles.contentPad}>
           {banner && <StatusBanner message={banner} tone={inferBannerTone(banner)} />}

           {isLoading ? (
             <SkeletonList count={4} />
           ) : milestones.length === 0 ? (
             <EmptyState message="Pilih unit untuk melihat daftar progres pekerjaan." />
           ) : (
             <View style={styles.timelineContainer}>
                {milestones.map((item, index) => {
                  const isCompleted = item.status === "COMPLETED";
                  const isActive = item.status === "IN_PROGRESS";
                  const isPending = item.status === "PENDING";
                  const isFirst = index === 0;
                  const isLast = index === milestones.length - 1;

                  return (
                    <SlideInView key={item.id} direction="up" delay={Math.min(index * 50, 400)} duration={350} style={styles.timelineRow}>
                      {/* TIMELINE GUTTER */}
                      <View style={styles.timelineGutter}>
                        {!isFirst && <View style={[styles.timelineLine, styles.timelineLineTop, { backgroundColor: isCompleted || isActive ? c.primary600 : c.neutral200 }]} />}
                        <View style={[
                          styles.timelineDot,
                          isCompleted && styles.timelineDotCompleted,
                          isActive && styles.timelineDotActive,
                          isPending && styles.timelineDotPending
                        ]}>
                          {isCompleted ? <Ionicons name="checkmark" size={14} color="#ffffff" /> : null}
                          {isActive ? <View style={styles.timelineDotInner} /> : null}
                        </View>
                        {!isLast && <View style={[styles.timelineLine, styles.timelineLineBottom, { backgroundColor: isCompleted ? c.primary600 : c.neutral200 }]} />}
                      </View>

                      {/* WORKFLOW CARD */}
                      <Pressable 
                        onPress={() => {
                          void Haptics.selectionAsync();
                          openMilestoneModal(item);
                        }}
                        style={({pressed}) => [styles.workflowCard, pressed && styles.pressed, isActive && styles.workflowCardActive]}
                      >
                         <View style={styles.workflowHeader}>
                           <Text style={[styles.workflowTitle, isActive && { color: c.primaryDark }]}>{item.orderNo}. {item.name}</Text>
                           <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted, isActive && styles.statusBadgeActive]}>
                              <Text style={[styles.statusBadgeText, isCompleted && styles.statusBadgeTextCompleted, isActive && styles.statusBadgeTextActive]}>
                                {item.status === "COMPLETED" ? "Selesai" : item.status === "IN_PROGRESS" ? "Dikerjakan" : "Menunggu"}
                              </Text>
                           </View>
                         </View>
                         
                         {item.note ? <Text style={styles.workflowNote} numberOfLines={2}>{item.note}</Text> : null}
                         
                         <View style={styles.workflowFooter}>
                            <View style={styles.workflowMeta}>
                               <Ionicons name="calendar-outline" size={14} color={c.neutral500} />
                               <Text style={styles.workflowMetaText}>{formatDate(item.targetDate)}</Text>
                            </View>
                            <View style={styles.updateBtn}>
                               <Text style={styles.updateBtnText}>Update</Text>
                               <Ionicons name="arrow-forward" size={14} color={c.primary} />
                            </View>
                         </View>
                      </Pressable>
                    </SlideInView>
                  );
                })}
             </View>
           )}
        </View>
      </ScrollView>

      {/* UPDATE MODAL */}
      <Modal visible={isModalVisible} animationType="slide" presentationStyle="formSheet">
         <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
               <View style={styles.modalHeader}>
                 <Pressable onPress={closeModal} style={styles.iconBtnDark}>
                    <Ionicons name="close" size={24} color={c.neutral900} />
                 </Pressable>
                 <Text style={styles.modalTitle}>Update Progres</Text>
                 <View style={{ width: 44 }} />
               </View>

               <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {selectedMilestone && (
                     <View style={{ marginBottom: 24 }}>
                        <Text style={styles.modalSubTitle}>{selectedMilestone.orderNo}. {selectedMilestone.name}</Text>
                     </View>
                  )}

                  <Text style={styles.inputLabel}>Status Pengerjaan</Text>
                  <View style={styles.statusSelectRow}>
                     {(["PENDING", "IN_PROGRESS", "COMPLETED"] as MilestoneStatus[]).map(status => {
                       const isSelected = statusDraft === status;
                       const labels = { PENDING: "Menunggu", IN_PROGRESS: "Dikerjakan", COMPLETED: "Selesai" };
                       const colorsMap = { PENDING: c.neutral400, IN_PROGRESS: c.warning.text, COMPLETED: c.success.text };
                       const bgsMap = { PENDING: c.neutral100, IN_PROGRESS: c.warning.bg, COMPLETED: c.success.bg };
                       
                       return (
                         <Pressable 
                           key={status}
                           onPress={() => {
                             void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                             setStatusDraft(status);
                           }}
                           style={[
                             styles.statusSelectBtn, 
                             isSelected && { backgroundColor: bgsMap[status], borderColor: colorsMap[status] }
                           ]}
                         >
                           <Text style={[styles.statusSelectText, isSelected && { color: colorsMap[status], fontWeight: "800" }]}>{labels[status]}</Text>
                         </Pressable>
                       );
                     })}
                  </View>

                  <Text style={[styles.inputLabel, { marginTop: 24 }]}>Catatan Lapangan</Text>
                  <LabeledInput
                    value={noteDraft}
                    onChangeText={setNoteDraft}
                    placeholder="Contoh: Material terlambat datang, butuh tambahan pasir..."
                    multiline
                  />

                  <Text style={[styles.inputLabel, { marginTop: 24 }]}>Dokumentasi Foto</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 24 }}>
                     {selectedPhotoUris.map((uri, idx) => (
                       <View key={idx} style={styles.photoPreviewBox}>
                         <Image source={{ uri }} style={styles.photoPreviewImg} />
                       </View>
                     ))}
                     <Pressable style={styles.addPhotoBtn} onPress={takePhoto}>
                        <Ionicons name="camera" size={24} color={c.primary} />
                        <Text style={styles.addPhotoText}>Kamera</Text>
                     </Pressable>
                     <Pressable style={styles.addPhotoBtn} onPress={pickPhotos}>
                        <Ionicons name="images" size={24} color={c.primary} />
                        <Text style={styles.addPhotoText}>Galeri</Text>
                     </Pressable>
                  </ScrollView>
                  
                  <View style={{ height: 40 }} />
               </ScrollView>

               <View style={styles.modalFooter}>
                  <PrimaryButton
                    label={isSubmitting ? "Menyimpan..." : "Simpan Update"}
                    onPress={() => void handleUpdate()}
                    disabled={isSubmitting}
                  />
               </View>
            </SafeAreaView>
         </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.neutral50 },
  heroHeader: { paddingBottom: 24 },
  heroSafeArea: { paddingTop: Platform.OS === 'android' ? 20 : 8 },
  heroTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  iconBtnDark: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.neutral100, alignItems: "center", justifyContent: "center" },
  heroHeaderTitle: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  selectorScroll: { paddingHorizontal: 20, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.1)", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  chipActive: { backgroundColor: "#ffffff", borderColor: "#ffffff" },
  chipText: { fontSize: 14, fontWeight: "600", color: "#ffffff" },
  chipTextActive: { color: c.primaryDark, fontWeight: "800" },
  offlineBar: { backgroundColor: c.warning.text, paddingVertical: 8, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  offlineBarText: { color: "#ffffff", fontSize: 13, fontWeight: "700" },
  contentPad: { paddingHorizontal: 24, paddingTop: 24 },
  timelineContainer: { marginTop: 8 },
  timelineRow: { flexDirection: "row", minHeight: 110 },
  timelineGutter: { width: 32, alignItems: "center" },
  timelineLine: { width: 2, position: "absolute" },
  timelineLineTop: { top: 0, bottom: "85%" },
  timelineLineBottom: { top: "15%", bottom: -16 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: c.neutral200, marginTop: "10%", alignItems: "center", justifyContent: "center", zIndex: 2, borderWidth: 3, borderColor: c.neutral50 },
  timelineDotCompleted: { backgroundColor: c.primary600 },
  timelineDotActive: { backgroundColor: c.warning.text, borderColor: c.warning.bg, borderWidth: 2 },
  timelineDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: c.neutral50 },
  timelineDotPending: { backgroundColor: c.neutral100, borderWidth: 2, borderColor: c.neutral300 },
  workflowCard: { flex: 1, backgroundColor: "#ffffff", borderRadius: 20, padding: 16, marginLeft: 12, marginBottom: 16, borderWidth: 1, borderColor: c.neutral200 },
  workflowCardActive: { borderColor: c.primary, borderWidth: 2 },
  workflowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  workflowTitle: { fontSize: 16, fontWeight: "800", color: c.neutral900, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: c.neutral100 },
  statusBadgeCompleted: { backgroundColor: c.success.bg },
  statusBadgeActive: { backgroundColor: c.warning.bg },
  statusBadgeText: { fontSize: 10, fontWeight: "800", color: c.neutral500 },
  statusBadgeTextCompleted: { color: c.success.text },
  statusBadgeTextActive: { color: c.warning.text },
  workflowNote: { fontSize: 13, color: c.neutral600, marginBottom: 12, lineHeight: 18 },
  workflowFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 12, borderTopWidth: 1, borderTopColor: c.neutral100 },
  workflowMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  workflowMetaText: { fontSize: 12, color: c.neutral500, fontWeight: "600" },
  updateBtn: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: c.primaryLight, borderRadius: 12 },
  updateBtnText: { fontSize: 12, fontWeight: "800", color: c.primary },
  modalContainer: { flex: 1, backgroundColor: "#ffffff" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.neutral100 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: c.neutral900 },
  modalBody: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  modalSubTitle: { fontSize: 22, fontWeight: "900", color: c.neutral900, lineHeight: 28 },
  inputLabel: { fontSize: 14, fontWeight: "700", color: c.neutral700, marginBottom: 12 },
  statusSelectRow: { flexDirection: "row", gap: 8 },
  statusSelectBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 16, backgroundColor: c.neutral50, borderWidth: 2, borderColor: c.neutral200 },
  statusSelectText: { fontSize: 12, fontWeight: "700", color: c.neutral500 },
  photoPreviewBox: { width: 80, height: 80, borderRadius: 16, overflow: "hidden" },
  photoPreviewImg: { width: "100%", height: "100%", resizeMode: "cover" },
  addPhotoBtn: { width: 80, height: 80, borderRadius: 16, backgroundColor: c.primaryLight, alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: "dashed", borderColor: c.primary },
  addPhotoText: { fontSize: 11, fontWeight: "700", color: c.primary, marginTop: 4 },
  modalFooter: { padding: 24, borderTopWidth: 1, borderTopColor: c.neutral100, backgroundColor: "#ffffff" },
  pressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
});
`;

fs.writeFileSync(file, newContent);
console.log('FieldMilestonesScreen fully redesigned.');
