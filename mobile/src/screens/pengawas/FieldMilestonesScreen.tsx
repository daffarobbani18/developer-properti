import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { useFocusEffect, useRoute, RouteProp } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import type { PengawasStackParamList } from "../../navigation/types";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
  SlideInView,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");
type MilestoneStatus = Milestone["status"];

export function FieldMilestonesScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const netInfo = useNetInfo();
  const { queueCount, enqueueMilestone, flushQueue, refreshQueueCount } = useOfflineQueue(auth);

  const route = useRoute<RouteProp<PengawasStackParamList, "FieldMilestones">>();
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
    if (!auth) {
      return;
    }

    const result = await getProjectOptions(auth);
    setProjects(result);

    if (!selectedProjectId && result.length > 0) {
      setSelectedProjectId(result[0].id);
    }
  }, [auth, selectedProjectId]);

  const loadUnits = useCallback(async () => {
    if (!auth || !selectedProjectId) {
      return;
    }

    const result = await getFieldUnits(auth, { projectId: selectedProjectId });
    setUnits(result);

    if (!result.find((item) => item.id === selectedUnitId)) {
      setSelectedUnitId(result[0]?.id ?? null);
    }
  }, [auth, selectedProjectId, selectedUnitId]);

  const loadMilestones = useCallback(async () => {
    if (!auth || !selectedUnitId) {
      setMilestones([]);
      setSelectedMilestoneId(null);
      return;
    }

    const result = await getUnitMilestones(auth, selectedUnitId);
    setMilestones(result);

    const existing = result.find((item) => item.id === selectedMilestoneId);
    const next = existing ?? result[0] ?? null;

    setSelectedMilestoneId(next?.id ?? null);
    setStatusDraft(next?.status ?? "IN_PROGRESS");
    setNoteDraft(next?.note ?? "");
    setPhotoUrlDraft("");
  }, [auth, selectedUnitId, selectedMilestoneId]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setBanner(null);

        try {
          await refreshQueueCount();
          await loadProjects();
          if (!cancelled) {
            setIsLoading(false);
          }
        } catch (error) {
          if (!cancelled) {
            setBanner(error instanceof Error ? error.message : "Gagal memuat data proyek");
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadProjects, refreshQueueCount])
  );

  useEffect(() => {
    if (!selectedProjectId) {
      return;
    }

    void (async () => {
      try {
        await loadUnits();
      } catch (error) {
        setBanner(error instanceof Error ? error.message : "Gagal memuat unit");
      }
    })();
  }, [loadUnits, selectedProjectId]);

  useEffect(() => {
    if (!selectedUnitId) {
      return;
    }

    void (async () => {
      try {
        await loadMilestones();
      } catch (error) {
        setBanner(error instanceof Error ? error.message : "Gagal memuat milestone");
      }
    })();
  }, [loadMilestones, selectedUnitId]);

  useEffect(() => {
    if (isNetworkOffline) {
      setIsOfflineMode(true);
      setBanner("Anda sedang offline. Update akan masuk ke antrian lokal.");
    }
  }, [isNetworkOffline]);

  useEffect(() => {
    if (!auth || netInfo.isConnected !== true || queueCount === 0 || isAutoSyncing) {
      return;
    }

    let cancelled = false;

    (async () => {
      setIsAutoSyncing(true);
      try {
        const result = await flushQueue(auth);
        if (!cancelled) {
          setBanner(`Sinkron otomatis selesai. Berhasil ${result.synced}, gagal ${result.failed}.`);
          await loadMilestones();
        }
      } catch {
        if (!cancelled) {
          setBanner("Sinkron otomatis gagal. Silakan coba sinkron manual.");
        }
      } finally {
        if (!cancelled) {
          setIsAutoSyncing(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth, flushQueue, isAutoSyncing, loadMilestones, netInfo.isConnected, queueCount]);

  const appendPhotoUris = useCallback((uris: string[]) => {
    if (uris.length === 0) {
      return;
    }

    setSelectedPhotoUris((prev) => {
      const merged = [...new Set([...prev, ...uris])].slice(0, 5);
      return merged;
    });
  }, []);

  const takeMilestonePhoto = useCallback(async () => {
    try {
      const uri = await capturePhoto();
      if (uri) {
        appendPhotoUris([uri]);
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengambil foto.");
    }
  }, [appendPhotoUris]);

  const pickMilestonePhotoFromGallery = useCallback(async () => {
    try {
      const uris = await pickImages({ selectionLimit: 5 });
      appendPhotoUris(uris);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memilih foto dari galeri.");
    }
  }, [appendPhotoUris]);

  const submitUpdate = useCallback(async () => {
    if (!auth || !selectedMilestone) {
      return;
    }

    const payload = {
      milestoneId: selectedMilestone.id,
      status: statusDraft,
      note: noteDraft,
      photoUrl: photoUrlDraft || selectedPhotoUris[0],
      photoUrls: selectedPhotoUris,
    };

    setIsSubmitting(true);
    setBanner(null);

    try {
      if (effectiveOfflineMode) {
        await enqueueMilestone(payload);
        setMilestones((prev) =>
          prev.map((item) =>
            item.id === selectedMilestone.id
              ? {
                  ...item,
                  status: statusDraft,
                  note: noteDraft,
                  photos:
                    photoUrlDraft || selectedPhotoUris.length > 0
                      ? [
                          ...item.photos,
                          ...[photoUrlDraft, ...selectedPhotoUris]
                            .filter((uri): uri is string => Boolean(uri))
                            .map((uri) => ({
                              id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                              url: uri,
                              caption: "Antrian offline",
                              createdAt: new Date().toISOString(),
                            })),
                        ]
                      : item.photos,
                }
              : item
          )
        );
        setBanner("Perubahan disimpan ke queue offline.");
      } else {
        await submitMilestoneUpdate(auth, payload);
        setBanner("Milestone berhasil diperbarui.");
      }

      await loadMilestones();
      setSelectedPhotoUris([]);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal menyimpan perubahan milestone");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    auth,
    enqueueMilestone,
    isOfflineMode,
    effectiveOfflineMode,
    loadMilestones,
    noteDraft,
    photoUrlDraft,
    selectedPhotoUris,
    selectedMilestone,
    statusDraft,
  ]);

  const syncQueueNow = useCallback(async () => {
    if (!auth) {
      return;
    }

    setBanner(null);
    setIsSubmitting(true);

    try {
      const result = await flushQueue(auth);
      await loadMilestones();
      setBanner(`Sinkron selesai. Berhasil ${result.synced}, gagal ${result.failed}.`);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Sinkron queue gagal");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, flushQueue, loadMilestones]);

  return (
    <ScreenShell
      title="Milestone & Foto"
      subtitle="Update progres konstruksi di lapangan"
    >
      <SlideInView direction="up" delay={50} duration={400}>
        <View style={styles.topActionRow}>
          <Pressable 
            style={[styles.offlineToggleBtn, effectiveOfflineMode && styles.offlineToggleBtnActive]}
            onPress={() => setIsOfflineMode((prev) => !prev)}
            disabled={isNetworkOffline}
          >
            <Ionicons name={effectiveOfflineMode ? "cloud-offline" : "cloud"} size={16} color={effectiveOfflineMode ? "#f59e0b" : "#64748b"} />
            <Text style={[styles.offlineToggleText, effectiveOfflineMode && styles.offlineToggleTextActive]}>
              {effectiveOfflineMode ? "Mode Offline" : "Mode Online"}
            </Text>
          </Pressable>

          {queueCount > 0 && (
            <Pressable 
              style={styles.syncBtn}
              onPress={() => void syncQueueNow()}
              disabled={isSubmitting || isNetworkOffline}
            >
              <Ionicons name="sync" size={14} color="#ffffff" />
              <Text style={styles.syncBtnText}>Sinkron ({queueCount})</Text>
            </Pressable>
          )}
        </View>

        {isAutoSyncing ? <StatusBanner message="Sinkron otomatis berjalan..." tone="warning" /> : null}
      </SlideInView>

      {!initialUnitId && (
        <SlideInView direction="up" delay={100} duration={400}>
          <View style={styles.minimalFilterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll} contentContainerStyle={styles.projectScrollContent}>
              {projects.map((project) => (
                <Pressable
                  key={project.id}
                  onPress={() => setSelectedProjectId(project.id)}
                  style={({ pressed }) => [
                    styles.minimalPill,
                    selectedProjectId === project.id && styles.minimalPillActive,
                    pressed && styles.pressedState,
                  ]}
                >
                  <Text style={[styles.minimalPillText, selectedProjectId === project.id && styles.minimalPillTextActive]}>
                    {project.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll} contentContainerStyle={styles.projectScrollContent}>
              {units.map((unit) => (
                <Pressable
                  key={unit.id}
                  onPress={() => setSelectedUnitId(unit.id)}
                  style={({ pressed }) => [
                    styles.minimalPill,
                    selectedUnitId === unit.id && styles.minimalPillActive,
                    pressed && styles.pressedState,
                  ]}
                >
                  <Text style={[styles.minimalPillText, selectedUnitId === unit.id && styles.minimalPillTextActive]}>
                    {unit.code}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </SlideInView>
      )}

      {selectedUnit && (
        <SlideInView direction="up" delay={150} duration={400}>
          <View style={styles.unitHeaderCard}>
            <View style={styles.unitHeaderIconWrap}>
              <Ionicons name="home" size={24} color="#f59e0b" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.unitCodeText}>{selectedUnit.code}</Text>
              <Text style={styles.unitTypeText}>{selectedUnit.typeName}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Badge 
                label={isSiapHuni ? "Siap Huni" : "Proses"} 
                tone={isSiapHuni ? "success" : "warning"} 
              />
              <Pressable onPress={() => void loadMilestones()} style={{ marginTop: 6 }}>
                <Ionicons name="refresh-circle" size={24} color="#cbd5e1" />
              </Pressable>
            </View>
          </View>
        </SlideInView>
      )}

      <SlideInView direction="up" delay={200} duration={400}>
        <View style={styles.statsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: "#0f172a", shadowColor: "#0f172a", shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 }]}>
              <Ionicons name="list" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Total Tahapan</Text>
              <Text style={styles.metricValue}>{milestones.length}</Text>
            </View>
          </View>
          
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: "#10b981", shadowColor: "#10b981", shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 }]}>
              <Ionicons name="checkmark-done" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Diselesaikan</Text>
              <Text style={styles.metricValue}>{completedMilestonesCount}</Text>
            </View>
          </View>
        </View>
      </SlideInView>

      {isLoading ? (
        <Card><Text style={{ color: "#64748b", padding: 12 }}>Memuat data milestone...</Text></Card>
      ) : milestones.length === 0 ? (
        <EmptyState message="Belum ada milestone untuk unit yang dipilih." />
      ) : (
        <>
          <SlideInView direction="up" delay={250} duration={400}>
            <SectionTitle title="Daftar Milestone" caption="Pilih tahapan untuk mengupdate progres" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.milestoneScroll} contentContainerStyle={styles.milestoneScrollContent}>
              {milestones.map((item) => {
                const isSelected = selectedMilestoneId === item.id;
                const isCompleted = item.status === "COMPLETED";
                
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => {
                      setSelectedMilestoneId(item.id);
                      setStatusDraft(item.status);
                      setNoteDraft(item.note ?? "");
                      setPhotoUrlDraft("");
                      setSelectedPhotoUris([]);
                    }}
                    style={({ pressed }) => [
                      styles.milestoneMiniCard,
                      isSelected && styles.milestoneMiniCardActive,
                      pressed && styles.pressedState,
                    ]}
                  >
                    <View style={styles.milestoneMiniHeader}>
                      <View style={[
                        styles.milestoneIconWrap, 
                        isSelected ? { backgroundColor: "#f59e0b" } : isCompleted ? { backgroundColor: "#10b981" } : { backgroundColor: "#f1f5f9" }
                      ]}>
                        <Ionicons 
                          name={isCompleted ? "checkmark" : "construct"} 
                          size={14} 
                          color={isSelected || isCompleted ? "#ffffff" : "#94a3b8"} 
                        />
                      </View>
                      <Text style={[styles.milestoneOrder, isSelected && { color: "#0f172a" }]}>
                        #{item.orderNo}
                      </Text>
                    </View>
                    <Text style={[styles.milestoneTitle, isSelected && { color: "#0f172a" }]} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </SlideInView>

          <SlideInView direction="up" delay={300} duration={400}>
            <Card style={styles.formCard}>
              <View style={styles.formHeader}>
                <Ionicons name="create" size={20} color="#0f172a" />
                <Text style={styles.formTitle}>{selectedMilestone?.name ?? "Pilih milestone"}</Text>
              </View>

              {isSiapHuni ? (
                <View style={styles.readonlyBanner}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  <Text style={styles.readonlyText}>
                    Unit Siap Huni. Semua tahapan telah selesai dan tidak dapat diubah (Read-Only).
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.inputLabel}>Status Pengerjaan</Text>
                  <View style={styles.statusRow}>
                    {(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as MilestoneStatus[]).map((status) => {
                      const isActive = statusDraft === status;
                      return (
                        <Pressable
                          key={status}
                          onPress={() => setStatusDraft(status)}
                          style={({ pressed }) => [
                            styles.statusPill,
                            isActive && styles.statusPillActive,
                            pressed && styles.pressedState,
                          ]}
                        >
                          <Text style={[styles.statusText, isActive && styles.statusTextActive]}>
                            {formatMilestoneStatusLabel(status)}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <LabeledInput
                      label="Catatan Lapangan"
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      placeholder="Ketikan catatan progres..."
                      value={noteDraft}
                      onChangeText={setNoteDraft}
                    />
                  </View>

                  <View style={styles.photoSection}>
                    <Text style={styles.inputLabel}>Lampiran Foto ({selectedPhotoUris.length}/5)</Text>
                    <View style={styles.photoActionRow}>
                      <Pressable style={styles.photoActionBtn} onPress={() => void takeMilestonePhoto()}>
                        <Ionicons name="camera" size={20} color="#0f172a" />
                        <Text style={styles.photoActionText}>Kamera</Text>
                      </Pressable>
                      <Pressable style={styles.photoActionBtn} onPress={() => void pickMilestonePhotoFromGallery()}>
                        <Ionicons name="images" size={20} color="#0f172a" />
                        <Text style={styles.photoActionText}>Galeri</Text>
                      </Pressable>
                    </View>

                    {selectedPhotoUris.length > 0 && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photoListWrap}>
                        {selectedPhotoUris.map((uri, index) => (
                          <View key={`${uri}-${index}`} style={styles.photoPreviewCard}>
                            <Image source={{ uri }} style={styles.photoPreviewImg} resizeMode="cover" />
                            <Pressable
                              onPress={() => setSelectedPhotoUris((prev) => prev.filter((_, idx) => idx !== index))}
                              style={styles.photoRemoveBtn}
                            >
                              <Ionicons name="close" size={14} color="#ffffff" />
                            </Pressable>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>

                  <View style={{ marginTop: 24 }}>
                    <PrimaryButton
                      label={isSubmitting ? "Menyimpan..." : "Simpan Update"}
                      onPress={() => void submitUpdate()}
                      disabled={!selectedMilestone || isSubmitting}
                    />
                  </View>
                </>
              )}
            </Card>
          </SlideInView>

          {/* Riwayat Laporan Section */}
          {selectedMilestone && selectedMilestone.logs && selectedMilestone.logs.length > 0 && (
            <SlideInView direction="up" delay={400} duration={400}>
              <View style={{ marginTop: 24, marginBottom: 12, paddingHorizontal: 4 }}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#0f172a" }}>Riwayat Laporan</Text>
                <Text style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>Log historis dari pembaruan milestone ini</Text>
              </View>
              <View style={{ gap: 12 }}>
                {selectedMilestone.logs.map((log) => (
                  <Card key={log.id} style={{ padding: 16, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <View style={{ 
                          width: 10, height: 10, borderRadius: 5, 
                          backgroundColor: log.status === "COMPLETED" ? "#10b981" : log.status === "IN_PROGRESS" ? "#f59e0b" : "#94a3b8",
                          shadowColor: log.status === "COMPLETED" ? "#10b981" : log.status === "IN_PROGRESS" ? "#f59e0b" : "#94a3b8",
                          shadowOffset: { width: 0, height: 0 },
                          shadowOpacity: 0.5,
                          shadowRadius: 4,
                          elevation: 2,
                        }} />
                        <Text style={{ fontSize: 13, fontWeight: "700", color: "#0f172a" }}>
                          {formatMilestoneStatusLabel(log.status)}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 11, color: "#64748b", fontWeight: "600" }}>
                        {formatDate(log.createdAt)}
                      </Text>
                    </View>
                    
                    {log.note ? (
                      <Text style={{ fontSize: 13, color: "#475569", lineHeight: 20, marginBottom: (log.photoUrls && log.photoUrls.length > 0) ? 12 : 0 }}>
                        {log.note}
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic", marginBottom: (log.photoUrls && log.photoUrls.length > 0) ? 12 : 0 }}>
                        Tidak ada catatan.
                      </Text>
                    )}

                    {log.photoUrls && log.photoUrls.length > 0 && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                        {log.photoUrls.map((url, i) => (
                          <Image key={i} source={{ uri: url }} style={{ width: 64, height: 64, borderRadius: 8, backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" }} />
                        ))}
                      </ScrollView>
                    )}
                  </Card>
                ))}
              </View>
            </SlideInView>
          )}
        </>
      )}

      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}
      
      {/* Spacer for scroll view bottom */}
      <View style={{ height: 40 }} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  offlineToggleBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  offlineToggleBtnActive: {
    backgroundColor: "#fef3c7",
    borderColor: "#fde68a",
  },
  offlineToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  offlineToggleTextActive: {
    color: "#b45309",
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  syncBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  minimalFilterContainer: {
    marginBottom: 16,
    gap: 8,
  },
  projectScroll: {
    marginHorizontal: -16,
  },
  projectScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  minimalPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  minimalPillActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  minimalPillText: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "600",
  },
  minimalPillTextActive: {
    color: "#ffffff",
  },
  pressedState: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  unitHeaderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unitHeaderIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fef3c7",
    alignItems: "center",
    justifyContent: "center",
  },
  unitCodeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 2,
  },
  unitTypeText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#f8fafc",
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricValue: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  milestoneScroll: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  milestoneScrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  milestoneMiniCard: {
    width: 140,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  milestoneMiniCardActive: {
    borderColor: "#f59e0b",
    backgroundColor: "#fffbeb",
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  milestoneMiniHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  milestoneIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneOrder: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
  },
  milestoneTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    lineHeight: 18,
  },
  formCard: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  formHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: "row",
    gap: 8,
  },
  statusPill: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statusPillActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  statusTextActive: {
    color: "#ffffff",
  },
  photoSection: {
    marginTop: 16,
  },
  photoActionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  photoActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  photoActionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  photoListWrap: {
    gap: 12,
    paddingVertical: 4,
  },
  photoPreviewCard: {
    position: "relative",
  },
  photoPreviewImg: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  photoRemoveBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  readonlyBanner: {
    backgroundColor: "#ecfdf5",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#a7f3d0",
    alignItems: "center",
    gap: 8,
  },
  readonlyText: {
    color: "#065f46",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
});
