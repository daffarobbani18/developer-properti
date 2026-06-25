import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View, ScrollView, Dimensions, Animated, Modal, KeyboardAvoidingView, Platform, RefreshControl , StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  OfflineBanner,
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
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);
  const { queueCount, enqueueAction, flushQueue, refreshQueueCount } = useOfflineQueue(auth);

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

  // Ref untuk ScrollView utama — digunakan oleh progress summary bar untuk scroll ke milestone aktif
  const scrollViewRef = useRef<ScrollView>(null);
  // Ref per milestone row untuk mengukur posisi Y.
  // Direset setiap kali milestones list berubah agar posisi stale tidak digunakan.
  const milestoneRowRefs = useRef<Record<string, number>>({});

  // Reset posisi layout refs setiap kali unit berganti atau milestones di-reload
  // sehingga scroll ke milestone aktif selalu akurat setelah refresh/pergantian unit
  useEffect(() => {
    milestoneRowRefs.current = {};
  }, [selectedUnitId, milestones.length]);

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

  // loadAll: refresh chain lengkap dari project → unit → milestone.
  // Digunakan oleh pull-to-refresh agar data project/unit assignment terbaru ikut ter-reload.
  const loadAll = useCallback(async () => {
    if (!auth) return;
    setBanner(null);
    const projectResult = await getProjectOptions(auth);
    setProjects(projectResult);
    const firstProject = selectedProjectId ?? projectResult[0]?.id ?? null;
    if (!firstProject) return;
    setSelectedProjectId(firstProject);
    const unitResult = await getFieldUnits(auth, { projectId: firstProject });
    setUnits(unitResult);
    const firstUnit = selectedUnitId && unitResult.find(u => u.id === selectedUnitId)
      ? selectedUnitId
      : (unitResult[0]?.id ?? null);
    setSelectedUnitId(firstUnit);
    if (firstUnit) {
      const result = await getUnitMilestones(auth, firstUnit);
      setMilestones(result);
    } else {
      setMilestones([]);
    }
  }, [auth, selectedProjectId, selectedUnitId]);

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

  const hasUnsavedChanges = useCallback(() => {
    if (!selectedMilestone) return false;
    const statusChanged = statusDraft !== selectedMilestone.status;
    const noteChanged = noteDraft.trim() !== (selectedMilestone.note || "").trim();
    const hasPhotos = selectedPhotoUris.length > 0;
    return statusChanged || noteChanged || hasPhotos;
  }, [selectedMilestone, statusDraft, noteDraft, selectedPhotoUris]);

  const closeModal = useCallback(() => {
    if (hasUnsavedChanges()) {
      // Alert.alert digunakan agar tidak memerlukan komponen tambahan
      // dan berfungsi di kondisi lapangan dengan interaksi minimal
      Alert.alert(
        "Buang Perubahan?",
        "Catatan, status, dan foto yang sudah dimasukkan akan hilang.",
        [
          { text: "Lanjut Edit", style: "cancel" },
          {
            text: "Buang",
            style: "destructive",
            onPress: () => {
              setIsModalVisible(false);
              setSelectedMilestoneId(null);
            },
          },
        ]
      );
    } else {
      setIsModalVisible(false);
      setSelectedMilestoneId(null);
    }
  }, [hasUnsavedChanges]);

  const handleUpdate = useCallback(async () => {
    if (!auth || !selectedMilestoneId) return;

    if (effectiveOfflineMode) {
      await enqueueAction("MILESTONE_UPDATE", {
        milestoneId: selectedMilestoneId,
        status: statusDraft,
        note: noteDraft,
        photoUrls: selectedPhotoUris,
      });

      setMilestones((prev) =>
        prev.map((m) =>
          m.id === selectedMilestoneId
            ? { ...m, status: statusDraft, note: noteDraft, photos: selectedPhotoUris.map(uri => ({ id: uri, url: uri, caption: "Offline Queue", createdAt: new Date().toISOString() })) }
            : m
        )
      );

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setBanner(`Disimpan offline. Antrean tersimpan.`);
      setIsModalVisible(false);
      setSelectedMilestoneId(null);
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
      setIsModalVisible(false);
      setSelectedMilestoneId(null);
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
    enqueueAction,
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
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => {
          setIsLoading(true);
          loadAll().catch(e => setBanner(e instanceof Error ? e.message : "Gagal memuat ulang")).finally(() => setIsLoading(false));
        }} tintColor="#ffffff" />}
      >
      {/* IMMERSIVE HEADER */}
      <LinearGradient 
        colors={[c.primary600, c.primary, c.primaryDark]}
        locations={[0, 0.4, 1]}
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.heroHeader}
      >
        <LinearGradient 
           colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']}
           style={StyleSheet.absoluteFillObject}
           pointerEvents="none"
        />
        <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
          {/* Referensi: CustomerProgressScreen.tsx:221-225 — height:24 spacer + kicker + title */}
          <View style={{ height: 24 }} />
          <View style={styles.heroTitleWrap}>
            <Text style={styles.heroKicker}>
              {selectedUnitId && units.find(u => u.id === selectedUnitId)
                ? `UNIT ${units.find(u => u.id === selectedUnitId)!.code}`
                : "PROGRES PEMBANGUNAN"}
            </Text>
            <Text style={styles.heroTitle}>Update Progres</Text>
          </View>
        </View>
      </LinearGradient>

      {/* PROGRESS SUMMARY — tappable: scroll ke milestone IN_PROGRESS */}
      {!isLoading && milestones.length > 0 && (
        <Pressable
          style={({ pressed }) => [styles.progressSummaryBar, pressed && { opacity: 0.75 }]}
          onPress={() => {
            // Jika ada lebih dari satu IN_PROGRESS, scroll ke yang pertama (orderNo terendah)
            // karena urutan timeline berjalan dari atas ke bawah sesuai orderNo
            const activeMilestone = milestones
              .filter(m => m.status === "IN_PROGRESS")
              .sort((a, b) => a.orderNo - b.orderNo)[0];
            if (!activeMilestone) return;
            const yPos = milestoneRowRefs.current[activeMilestone.id];
            if (yPos == null) return;
            void Haptics.selectionAsync();
            scrollViewRef.current?.scrollTo({ y: yPos, animated: true });
          }}
          accessibilityLabel="Ketuk untuk menuju tahap aktif"
          accessibilityRole="button"
        >
          <Text style={styles.progressSummaryText}>
            {completedMilestonesCount} / {milestones.length} tahap selesai
          </Text>
          <View style={styles.progressSummaryTrack}>
            <View style={[styles.progressSummaryFill, { width: `${Math.round(completedMilestonesCount / milestones.length * 100)}%` }]} />
          </View>
          <Text style={styles.progressSummaryPct}>{Math.round(completedMilestonesCount / milestones.length * 100)}%</Text>
          {milestones.some(m => m.status === "IN_PROGRESS") && (
            <Ionicons name="chevron-down-circle-outline" size={18} color={c.primary} style={{ marginLeft: 4 }} />
          )}
        </Pressable>
      )}

      {/* PROJECT / UNIT SELECTOR — chip langsung tanpa label terpisah
          Referensi: Customer filter chip pattern — tidak menggunakan heading row sebelum chip
          Sebelumnya: 2 label + 2 chip rows = ~130px overhead
          Sesudah: 2 chip rows langsung = ~90px, hemat ~40px */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
           {projects.map(p => (
             <Pressable 
               key={p.id} 
               onPress={() => {
                 void Haptics.selectionAsync();
                 setSelectedProjectId(p.id);
               }}
               style={[styles.chip, selectedProjectId === p.id && styles.chipActive, isLoading && { opacity: 0.6 }]}
               disabled={isLoading}
             >
               <Text style={[styles.chipText, selectedProjectId === p.id && styles.chipTextActive]}>{p.name}</Text>
             </Pressable>
           ))}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.selectorScroll, { marginTop: 8 }]}>
           {units.map(u => (
             <Pressable 
               key={u.id} 
               onPress={() => {
                 void Haptics.selectionAsync();
                 setSelectedUnitId(u.id);
               }}
               style={[styles.chip, selectedUnitId === u.id && styles.chipActive, isLoading && { opacity: 0.6 }]}
               disabled={isLoading}
             >
               <Text style={[styles.chipText, selectedUnitId === u.id && styles.chipTextActive]}>{u.code}</Text>
             </Pressable>
           ))}
        </ScrollView>
      </View>

      {/* OFFLINE BANNER — shared component, semantically correct */}
      {effectiveOfflineMode && <OfflineBanner />}

      {/* CONTENT */}
        <View style={styles.contentPad}>
           {banner && <StatusBanner message={banner} tone={inferBannerTone(banner)} />}

           {isLoading ? (
             // SkeletonList ditampilkan untuk SEMUA kondisi loading:
             // stage 1 (projects), stage 2 (units), stage 3 (milestones)
             <SkeletonList count={5} />
           ) : milestones.length === 0 && !selectedUnitId ? (
             // Kondisi A: belum memilih unit — instruksi untuk melanjutkan
             <EmptyState message="Pilih proyek dan unit di atas untuk melihat progres pekerjaan." />
           ) : milestones.length === 0 && selectedUnitId ? (
             // Kondisi B: unit sudah dipilih tapi tidak memiliki milestone
             <EmptyState message="Belum ada milestone untuk unit ini." />
           ) : (
             <View style={styles.timelineContainer}>
                {milestones.map((item, index) => {
                  const isCompleted = item.status === "COMPLETED" || item.status === "WAITING_APPROVAL";
                  const isActive = item.status === "IN_PROGRESS";
                  const isPending = item.status === "PENDING";
                  const isFirst = index === 0;
                  const isLast = index === milestones.length - 1;

                  return (
                     <SlideInView key={item.id} direction="up" delay={Math.min(index * 50, 400)} duration={350} style={styles.timelineRow}>
                     <View
                       style={{ flex: 1, flexDirection: 'row', minHeight: 110 }}
                       onLayout={(e) => {
                         milestoneRowRefs.current[item.id] = e.nativeEvent.layout.y;
                       }}
                     >
                      {/* TIMELINE GUTTER */}
                      <View style={styles.timelineGutter}>
                        {!isFirst ? <View style={[styles.timelineLineFragmentTop, { backgroundColor: isCompleted || isActive ? c.primary : c.neutral200 }]} /> : <View style={[styles.timelineLineFragmentTop, { backgroundColor: 'transparent' }]} />}
                        <View style={[
                          styles.timelineDot,
                          isCompleted && styles.timelineDotCompleted,
                          isActive && styles.timelineDotActive,
                          isPending && styles.timelineDotPending
                        ]}>
                          {isCompleted ? <Ionicons name="checkmark" size={14} color="#ffffff" /> : null}
                          {isActive ? <View style={styles.timelineDotInner} /> : null}
                        </View>
                        {!isLast ? <View style={[styles.timelineLineFragmentBottom, { backgroundColor: isCompleted ? c.primary : c.neutral200 }]} /> : <View style={[styles.timelineLineFragmentBottom, { backgroundColor: 'transparent' }]} />}
                      </View>

                       {/* WORKFLOW CARD */}
                       <Pressable 
                         onPress={() => {
                           void Haptics.selectionAsync();
                           openMilestoneModal(item);
                         }}
                         disabled={isCompleted}
                         style={({pressed}) => [styles.workflowCard, pressed && styles.pressed, isActive && styles.workflowCardActive, isCompleted && { opacity: 0.85 }]}
                       >
                          {/* Badge SEDANG DIKERJAKAN: Referensi CustomerHomeScreen.ticketStatusText
                              Uppercase, warning color, langsung terlihat saat scanning list.
                              Hanya muncul pada milestone IN_PROGRESS */}
                          {isActive && (
                            <View style={styles.activeStatusBar}>
                              <View style={styles.activeStatusDot} />
                              <Text style={styles.activeStatusText}>SEDANG DIKERJAKAN</Text>
                            </View>
                          )}
                          <View style={styles.workflowHeader}>
                            <Text style={styles.workflowTitle}>{item.orderNo}. {item.name}</Text>
                            <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted, isActive && styles.statusBadgeActive]}>
                               <Text style={[styles.statusBadgeText, isCompleted && styles.statusBadgeTextCompleted, isActive && styles.statusBadgeTextActive]}>
                                 {formatMilestoneStatusLabel(item.status)}
                               </Text>
                            </View>
                          </View>
                         
                         {item.note ? (
                           <View style={styles.timelineNoteWrap}>
                             <Text style={styles.timelineNote} numberOfLines={2}>{item.note}</Text>
                           </View>
                         ) : null}
                         
                         <View style={styles.workflowFooter}>
                            <View style={styles.workflowMeta}>
                               <Ionicons name="calendar-outline" size={14} color={c.neutral500} />
                               <Text style={styles.workflowMetaText}>{formatDate(item.targetDate)}</Text>
                            </View>
                             <View style={styles.updateBtn}>
                                <Text style={styles.updateBtnText}>Update</Text>
                                <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                             </View>
                          </View>
                      </Pressable>
                    </View>
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
            <View style={{ flex: 1, paddingTop: (safeTop || 45) + 16 }}>
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
                        <Text style={{ fontSize: 13, fontWeight: "800", color: c.primary, marginBottom: 6, letterSpacing: 0.5 }}>TAHAP {selectedMilestone.orderNo} DARI {milestones.length}</Text>
                        <Text style={styles.modalSubTitle}>{selectedMilestone.name}</Text>
                     </View>
                  )}

                  <Text style={styles.inputLabel}>Status Pengerjaan</Text>
                  <View style={styles.statusSelectRow}>
                     {(["PENDING", "IN_PROGRESS", "COMPLETED"] as MilestoneStatus[]).map(status => {
                       const isSelected = statusDraft === status;
                       const labels: Record<string, string> = { PENDING: "Menunggu", IN_PROGRESS: "Dikerjakan", COMPLETED: "Selesai" };
                       const colorsMap: Record<string, string> = { PENDING: c.neutral400, IN_PROGRESS: c.warning.text, COMPLETED: c.success.text };
                       const bgsMap: Record<string, string> = { PENDING: c.neutral100, IN_PROGRESS: c.warning.bg, COMPLETED: c.success.bg };
                       
                       const labelStr = labels[status] || status;
                       const colorStr = colorsMap[status] || c.neutral500;
                       const bgStr = bgsMap[status] || c.neutral100;
                       
                       return (
                         <Pressable 
                           key={status}
                           onPress={() => {
                             void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                             setStatusDraft(status);
                           }}
                           style={[
                             styles.statusSelectBtn, 
                             isSelected ? { backgroundColor: bgStr, borderColor: colorStr } : { backgroundColor: "#ffffff" }
                           ]}
                         >
                           <Text style={[styles.statusSelectText, isSelected ? { color: colorStr, fontWeight: "800" } : { color: c.neutral700 }]}>{labelStr}</Text>
                         </Pressable>
                       );
                     })}
                  </View>

                  <View style={{ marginTop: 24 }}>
                    <LabeledInput
                      label="Catatan Lapangan"
                      value={noteDraft}
                      onChangeText={setNoteDraft}
                      placeholder="Contoh: Material terlambat datang, butuh tambahan pasir..."
                      multiline
                    />
                  </View>

                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24, marginBottom: 12 }}>
                     <Text style={[styles.inputLabel, { marginBottom: 0 }]}>Dokumentasi Foto</Text>
                     <Text style={{ fontSize: 12, color: c.neutral500, fontWeight: "600" }}>{selectedPhotoUris.length} / 3 Foto</Text>
                  </View>
                  
                  {selectedPhotoUris.length > 0 ? (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                      {selectedPhotoUris.map((uri, idx) => (
                        <View key={idx} style={styles.photoThumbnailContainer}>
                          <Image source={{ uri }} style={styles.photoThumbnailImg} />
                          <Pressable style={styles.photoRemoveBtn} onPress={() => {
                            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setSelectedPhotoUris(prev => prev.filter((_, i) => i !== idx));
                          }}>
                            <Ionicons name="close" size={14} color="#fff" />
                          </Pressable>
                        </View>
                      ))}
                      {selectedPhotoUris.length < 3 && (
                        <Pressable style={styles.photoThumbnailAdd} onPress={pickPhotos}>
                          <Ionicons name="add" size={24} color={c.neutral400} />
                        </Pressable>
                      )}
                    </View>
                  ) : (
                    <Pressable style={styles.dropzone} onPress={pickPhotos}>
                       <View style={styles.dropzoneIconWrapper}>
                          <Ionicons name="cloud-upload-outline" size={32} color={c.accent} />
                       </View>
                       <Text style={styles.dropzoneTitle}>Unggah Dokumentasi</Text>
                       <Text style={styles.dropzoneSub}>Ketuk untuk memilih dari Galeri</Text>
                       
                       <View style={styles.dropzoneOrContainer}>
                         <View style={styles.dropzoneDivider} />
                         <Text style={styles.dropzoneOrText}>atau</Text>
                         <View style={styles.dropzoneDivider} />
                       </View>
                       
                       <Pressable style={styles.dropzoneCameraBtn} onPress={takePhoto}>
                          <Ionicons name="camera" size={18} color={c.neutral700} />
                          <Text style={styles.dropzoneCameraText}>Buka Kamera</Text>
                       </Pressable>
                    </Pressable>
                  )}
                  
                  <View style={{ height: 40 }} />
               </ScrollView>

               <View style={styles.modalFooter}>
                  <PrimaryButton
                    label={isSubmitting ? "Menyimpan..." : "Simpan Update"}
                    onPress={() => void handleUpdate()}
                    disabled={isSubmitting}
                  />
               </View>
            </View>
         </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: c.neutral50 },
  // heroHeader: referensi CustomerHomeScreen.tsx:286-292
  heroHeader: {
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  // heroSafeArea: referensi CustomerProgressScreen.tsx:284-285
  heroSafeArea: { paddingHorizontal: 24 },
  // heroTitleWrap + heroKicker + heroTitle: CustomerProgressScreen.tsx:298-312
  heroTitleWrap: {},
  heroKicker: { color: "#FBBF24", fontSize: 12, fontWeight: "800", letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { color: "#ffffff", fontSize: 34, fontWeight: "900", letterSpacing: -1.2 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  iconBtnDark: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.neutral100, alignItems: "center", justifyContent: "center" },
  // selectorContainer berada di luar gradient (background neutral50), bukan di atas gradient biru.
  // Chip harus menggunakan warna yang terbaca di background terang, bukan warna transparan untuk gradient.
  progressSummaryBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: c.neutral50, borderBottomWidth: 1, borderBottomColor: c.neutral100 },
  progressSummaryText: { fontSize: 13, fontWeight: "600", color: c.neutral600, minWidth: 110 },
  // progressSummaryTrack: CustomerProgressScreen progressBarTrack height:8, borderRadius:4
  progressSummaryTrack: { flex: 1, height: 8, borderRadius: 4, backgroundColor: c.neutral100, overflow: "hidden" },
  // progressSummaryFill: CustomerProgressScreen progressBarFill menggunakan c.primary.
  // Di Customer, c.primary adalah warna brand utama dan digunakan untuk progress fill.
  // Untuk konteks lapangan, fill warna terang lebih terbaca. Gunakan c.accent (#2563EB)
  // yang digunakan CustomerBillingScreen untuk progress fill (progressFill: backgroundColor: c.accent)
  progressSummaryFill: { height: "100%", borderRadius: 3, backgroundColor: c.accent },
  progressSummaryPct: { fontSize: 13, fontWeight: "800", color: c.accent, minWidth: 38, textAlign: "right" },
  // selectorContainer: label dihapus, chip langsung tanpa heading
  selectorContainer: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8, backgroundColor: c.neutral50 },
  selectorScroll: { paddingHorizontal: 4, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#ffffff", borderWidth: 1, borderColor: c.neutral200 },
  chipActive: { backgroundColor: c.primary, borderColor: c.primary },
  chipText: { fontSize: 13, fontWeight: "600", color: c.neutral600 },
  chipTextActive: { color: "#ffffff", fontWeight: "700" },
  // offlineBar dan offlineBarText tidak lagi digunakan — diganti dengan <OfflineBanner />
  // contentPad: referensi CustomerProgressScreen timelineContainer — paddingHorizontal:24, paddingTop:8
  contentPad: { paddingHorizontal: 24, paddingTop: 16 },
  timelineContainer: { marginTop: 8 },
  timelineRow: { flexDirection: "row", minHeight: 110 },
  timelineGutter: { width: 32, alignItems: "center", marginRight: 16 },
  timelineLineFragmentTop: { width: 2, height: 16 },
  timelineLineFragmentBottom: { width: 2, flex: 1 },
  // timelineDot: referensi CustomerProgressScreen.tsx:422-433 — identik
  timelineDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#ffffff", alignItems: "center", justifyContent: "center", zIndex: 2, borderWidth: 2, borderColor: c.neutral200 },
  timelineDotCompleted: { backgroundColor: c.primary, borderColor: c.primary },
  timelineDotActive: { borderColor: c.warning.text, borderWidth: 4 },
  timelineDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.warning.text },
  timelineDotPending: { backgroundColor: c.neutral100, borderColor: c.neutral200 },
  // workflowCard: CustomerProgressScreen timelineContent — borderRadius:24, padding:20
  // shadow: height:4, opacity:0.04, radius:12, elevation:2, borderColor:neutral100
  workflowCard: { flex: 1, backgroundColor: "#ffffff", borderRadius: 24, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20, marginBottom: 20, shadowColor: c.neutral900, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: c.neutral100 },
  // activeStatusBar: Referensi CustomerHomeScreen.ticketStatusText + unreadDot pattern
  // Uppercase, warning color, visible di atas card sebelum judul milestone
  activeStatusBar: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  activeStatusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.warning.text },
  activeStatusText: { fontSize: 11, fontWeight: "800", color: c.warning.text, letterSpacing: 1, textTransform: "uppercase" },
  // workflowCardActive: CustomerProgressScreen timelineContentActive — menggunakan c.warning.text
  // Audit mencatat warning color semantically questionable untuk IN_PROGRESS, tapi Customer
  // menggunakan pola yang sama (c.warning.text untuk active/current step).
  // Mengikuti Customer karena konsistensi produk lebih penting dari interpretasi semantik baru.
  workflowCardActive: { borderColor: c.warning.text, borderWidth: 2, shadowColor: c.warning.text, shadowOpacity: 0.08 },
  workflowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  workflowTitle: { fontSize: 16, fontWeight: "800", color: c.neutral900, flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, backgroundColor: c.neutral100 },
  statusBadgeCompleted: { backgroundColor: c.success.bg },
  statusBadgeActive: { backgroundColor: c.warning.bg },
  statusBadgeText: { fontSize: 11, fontWeight: "800", color: c.neutral500 },
  statusBadgeTextCompleted: { color: c.success.text },
  statusBadgeTextActive: { color: c.warning.text },
  timelineNoteWrap: { borderLeftWidth: 3, borderLeftColor: c.primaryLight, paddingLeft: 12, marginBottom: 16 },
  timelineNote: { fontSize: 13, color: c.neutral600, lineHeight: 20 },
  workflowFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: 16, borderTopWidth: 1, borderTopColor: c.neutral100 },
  workflowMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  workflowMetaText: { fontSize: 12, color: c.neutral500, fontWeight: "600" },
  updateBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: c.neutral900, borderRadius: 20 },
  updateBtnText: { fontSize: 13, fontWeight: "700", color: "#ffffff" },
  modalContainer: { flex: 1, backgroundColor: "#ffffff" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.neutral100 },
  modalTitle: { fontSize: 18, fontWeight: "800", color: c.neutral900 },
  modalBody: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  modalSubTitle: { fontSize: 22, fontWeight: "900", color: c.neutral900, lineHeight: 28 },
  inputLabel: { fontSize: 14, fontWeight: "700", color: c.neutral700, marginBottom: 12 },
  statusSelectRow: { flexDirection: "row", gap: 8 },
  statusSelectBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 16, backgroundColor: c.neutral50, borderWidth: 2, borderColor: c.neutral200 },
  statusSelectText: { fontSize: 12, fontWeight: "700", color: c.neutral500 },
  dropzone: { backgroundColor: c.neutral50, borderRadius: 20, borderWidth: 2, borderColor: c.neutral200, borderStyle: "dashed", padding: 24, alignItems: "center", justifyContent: "center" },
  dropzoneIconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: c.info.bg, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  dropzoneTitle: { fontSize: 16, fontWeight: "700", color: c.neutral900, marginBottom: 8 },
  dropzoneSub: { fontSize: 13, color: c.neutral500, marginBottom: 16 },
  dropzoneOrContainer: { flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 32, marginBottom: 16 },
  dropzoneDivider: { flex: 1, height: 1, backgroundColor: c.neutral200 },
  dropzoneOrText: { paddingHorizontal: 12, fontSize: 12, color: c.neutral400, fontWeight: "600" },
  dropzoneCameraBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: "#ffffff", borderRadius: 12, borderWidth: 1, borderColor: c.neutral200, elevation: 1 },
  dropzoneCameraText: { fontSize: 14, fontWeight: "700", color: c.neutral700 },
  photoThumbnailContainer: { width: "31%", aspectRatio: 1, borderRadius: 16, overflow: "hidden", position: "relative" },
  photoThumbnailImg: { width: "100%", height: "100%", resizeMode: "cover" },
  photoRemoveBtn: { position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  photoThumbnailAdd: { width: "31%", aspectRatio: 1, borderRadius: 16, backgroundColor: c.neutral50, borderWidth: 1, borderColor: c.neutral300, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  modalFooter: { padding: 24, borderTopWidth: 1, borderTopColor: c.neutral100, backgroundColor: "#ffffff" },
  pressed: { transform: [{ scale: 0.96 }], opacity: 0.9 },
});
