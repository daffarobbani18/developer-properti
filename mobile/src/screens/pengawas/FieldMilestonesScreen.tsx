import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Card,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import {
  getFieldUnits,
  getProjectOptions,
  getUnitMilestones,
  submitMilestoneUpdate,
} from "../../services/api";
import { Milestone, Unit } from "../../types";
import { formatDate } from "../../utils/format";

type MilestoneStatus = Milestone["status"];

export function FieldMilestonesScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const { queueCount, enqueueMilestone, flushQueue, refreshQueueCount } = useOfflineQueue();

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<MilestoneStatus>("IN_PROGRESS");
  const [noteDraft, setNoteDraft] = useState("");
  const [photoUrlDraft, setPhotoUrlDraft] = useState("");

  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const selectedMilestone = useMemo(
    () => milestones.find((item) => item.id === selectedMilestoneId) ?? null,
    [milestones, selectedMilestoneId]
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

  const submitUpdate = useCallback(async () => {
    if (!auth || !selectedMilestone) {
      return;
    }

    const payload = {
      milestoneId: selectedMilestone.id,
      status: statusDraft,
      note: noteDraft,
      photoUrl: photoUrlDraft,
    };

    setIsSubmitting(true);
    setBanner(null);

    try {
      if (isOfflineMode) {
        await enqueueMilestone(payload);
        setMilestones((prev) =>
          prev.map((item) =>
            item.id === selectedMilestone.id
              ? {
                  ...item,
                  status: statusDraft,
                  note: noteDraft,
                  photos: photoUrlDraft
                    ? [
                        ...item.photos,
                        {
                          id: `offline-${Date.now()}`,
                          url: photoUrlDraft,
                          caption: "Antrian offline",
                          createdAt: new Date().toISOString(),
                        },
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
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal menyimpan perubahan milestone");
    } finally {
      setIsSubmitting(false);
    }
  }, [
    auth,
    enqueueMilestone,
    isOfflineMode,
    loadMilestones,
    noteDraft,
    photoUrlDraft,
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
      subtitle="Update progres unit dengan mode online/offline"
    >
      <Card>
        <SectionTitle title="Mode Operasi" caption="Queue offline berguna saat jaringan tidak stabil" />
        <View style={styles.modeRow}>
          <PrimaryButton
            label={isOfflineMode ? "Mode Offline Aktif" : "Aktifkan Mode Offline"}
            onPress={() => setIsOfflineMode((prev) => !prev)}
          />
          <SecondaryButton
            label={`Sinkron Queue (${queueCount})`}
            onPress={() => void syncQueueNow()}
            disabled={queueCount === 0 || isSubmitting}
          />
        </View>
      </Card>

      <Card>
        <SectionTitle title="Pilih Proyek" />
        <View style={styles.choiceWrap}>
          {projects.map((project) => (
            <Pressable
              key={project.id}
              onPress={() => setSelectedProjectId(project.id)}
              style={({ pressed }) => [
                styles.choicePill,
                selectedProjectId === project.id && styles.choicePillActive,
                pressed && styles.choicePillPressed,
              ]}
            >
              <Text
                style={[
                  styles.choiceText,
                  selectedProjectId === project.id && styles.choiceTextActive,
                ]}
              >
                {project.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <SectionTitle title="Pilih Unit" />
        <View style={styles.choiceWrap}>
          {units.map((unit) => (
            <Pressable
              key={unit.id}
              onPress={() => setSelectedUnitId(unit.id)}
              style={({ pressed }) => [
                styles.choicePill,
                selectedUnitId === unit.id && styles.choicePillActive,
                pressed && styles.choicePillPressed,
              ]}
            >
              <Text style={[styles.choiceText, selectedUnitId === unit.id && styles.choiceTextActive]}>
                {unit.code} • {unit.typeName}
              </Text>
            </Pressable>
          ))}
        </View>
      </Card>

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat data milestone...</Text>
        </Card>
      ) : milestones.length === 0 ? (
        <EmptyState message="Belum ada milestone untuk unit yang dipilih." />
      ) : (
        <>
          <Card>
            <SectionTitle title="Daftar Milestone" />
            <View style={styles.milestoneListWrap}>
              {milestones.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    setSelectedMilestoneId(item.id);
                    setStatusDraft(item.status);
                    setNoteDraft(item.note ?? "");
                    setPhotoUrlDraft("");
                  }}
                  style={({ pressed }) => [
                    styles.milestoneCard,
                    selectedMilestoneId === item.id && styles.milestoneCardActive,
                    pressed && styles.choicePillPressed,
                  ]}
                >
                  <Text style={styles.milestoneTitle}>
                    {item.orderNo}. {item.name}
                  </Text>
                  <Text style={styles.milestoneMeta}>Target: {formatDate(item.targetDate)}</Text>
                  <Text style={styles.milestoneMeta}>Status: {item.status}</Text>
                  <Text style={styles.milestoneMeta}>Foto: {item.photos.length} file</Text>
                </Pressable>
              ))}
            </View>
          </Card>

          <Card>
            <SectionTitle title="Form Update Milestone" caption={selectedMilestone?.name ?? "Pilih milestone"} />

            <View style={styles.statusRow}>
              {(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"] as MilestoneStatus[]).map((status) => (
                <Pressable
                  key={status}
                  onPress={() => setStatusDraft(status)}
                  style={({ pressed }) => [
                    styles.statusPill,
                    statusDraft === status && styles.statusPillActive,
                    pressed && styles.choicePillPressed,
                  ]}
                >
                  <Text style={[styles.statusText, statusDraft === status && styles.statusTextActive]}>
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>

            <LabeledInput
              label="Catatan Lapangan"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="Tambahkan catatan progres atau kendala"
              value={noteDraft}
              onChangeText={setNoteDraft}
            />

            <LabeledInput
              label="URL Foto"
              placeholder="https://..."
              value={photoUrlDraft}
              onChangeText={setPhotoUrlDraft}
              hint="Jika offline, URL akan masuk ke queue untuk dikirim saat sinkron"
            />

            <PrimaryButton
              label={isSubmitting ? "Menyimpan..." : "Simpan Update"}
              onPress={() => void submitUpdate()}
              disabled={!selectedMilestone || isSubmitting}
            />
          </Card>
        </>
      )}

      {banner ? (
        <Card>
          <Text style={styles.bannerText}>{banner}</Text>
        </Card>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  modeRow: {
    gap: 8,
  },
  choiceWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  choicePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#99bcc1",
    backgroundColor: "#f7fbfc",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  choicePillActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#dff3f5",
  },
  choicePillPressed: {
    opacity: 0.82,
  },
  choiceText: {
    color: "#335f68",
    fontSize: 13,
    fontWeight: "600",
  },
  choiceTextActive: {
    color: "#124a54",
    fontWeight: "800",
  },
  loadingText: {
    color: "#4b6972",
  },
  milestoneListWrap: {
    gap: 8,
  },
  milestoneCard: {
    borderWidth: 1,
    borderColor: "#c5dadd",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fefefe",
    gap: 2,
  },
  milestoneCardActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#eaf8f9",
  },
  milestoneTitle: {
    color: "#133f49",
    fontWeight: "800",
    fontSize: 14,
  },
  milestoneMeta: {
    color: "#4d6d75",
    fontSize: 12,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#95b8be",
    backgroundColor: "#f6fbfb",
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusPillActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#dff3f5",
  },
  statusText: {
    color: "#3a646d",
    fontSize: 12,
    fontWeight: "700",
  },
  statusTextActive: {
    color: "#0f4852",
  },
  bannerText: {
    color: "#1e5661",
    fontSize: 13,
    fontWeight: "700",
  },
});
