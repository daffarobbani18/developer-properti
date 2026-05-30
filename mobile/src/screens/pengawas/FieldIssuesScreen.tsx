import React, { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  Badge,
  Card,
  EmptyState,
  IconButton,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  SkeletonList,
  StatusBanner,
} from "../../components/ui";
import { UrgencyBadge } from "../../components/UrgencyBadge";
import { useAuth } from "../../hooks/useAuth";
import {
  changeIssueStatus,
  createFieldIssue,
  getFieldIssues,
  getProjectOptions,
} from "../../services/api";
import { capturePhoto, pickImages } from "../../services/media";
import { IssueItem } from "../../types";
import {
  formatErrorMessage,
  formatIssueStatusLabel,
  formatIssueUrgencyLabel,
  inferBannerTone,
} from "../../utils/format";
import { formatRelativeDate } from "../../utils/dateUtils";
import type { PengawasStackParamList } from "../../navigation/types";

const ISSUE_CATEGORIES: IssueItem["category"][] = [
  "Kualitas Pekerjaan",
  "Jadwal Molor",
  "Cuaca",
  "Akses Lokasi",
  "Lainnya",
];

const ISSUE_URGENCY: IssueItem["urgency"][] = ["RENDAH", "SEDANG", "TINGGI", "KRITIS"];
const ISSUE_FILTER_STATUS: Array<"SEMUA" | IssueItem["status"]> = ["SEMUA", "BARU", "SEDANG_DITANGANI", "SELESAI"];
const ISSUE_FILTER_URGENCY: Array<"SEMUA" | IssueItem["urgency"]> = ["SEMUA", "RENDAH", "SEDANG", "TINGGI", "KRITIS"];

function statusTone(level: IssueItem["status"]): "neutral" | "warning" | "success" {
  if (level === "SELESAI") {
    return "success";
  }
  if (level === "SEDANG_DITANGANI") {
    return "warning";
  }
  return "neutral";
}

export function FieldIssuesScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<PengawasStackParamList>>();

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [projectId, setProjectId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueItem["category"]>("Kualitas Pekerjaan");
  const [urgency, setUrgency] = useState<IssueItem["urgency"]>("SEDANG");
  const [recommendation, setRecommendation] = useState("");
  const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"SEMUA" | IssueItem["status"]>("SEMUA");
  const [filterUrgency, setFilterUrgency] = useState<"SEMUA" | IssueItem["urgency"]>("SEMUA");

  const activeIssues = issues.filter((issue) => issue.status !== "SELESAI").length;
  const criticalIssues = issues.filter(
    (issue) => issue.urgency === "KRITIS" || issue.urgency === "TINGGI"
  ).length;

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = searchQuery.trim() === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "SEMUA" || issue.status === filterStatus;
    const matchesUrgency = filterUrgency === "SEMUA" || issue.urgency === filterUrgency;
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const [projectData, issueData] = await Promise.all([
      getProjectOptions(auth),
      getFieldIssues(auth),
    ]);

    setProjects(projectData);
    setIssues(issueData);

    if (!projectId && projectData[0]) {
      setProjectId(projectData[0].id);
    }
  }, [auth, projectId]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setBanner(null);

        try {
          await loadData();
        } catch (error) {
          if (!cancelled) {
            setBanner(formatErrorMessage(error));
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadData])
  );

  const submitIssue = useCallback(async () => {
    if (!auth || !projectId || !title.trim() || !description.trim()) {
      setBanner("Proyek, judul, dan deskripsi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

try {
       await createFieldIssue(auth, {
         projectId,
         title: title.trim(),
         description: description.trim(),
         category,
         urgency,
         reporterName: auth.user.fullName,
         recommendation: recommendation.trim() || undefined,
         photoUrls: selectedPhotoUris,
       });

       setTitle("");
       setDescription("");
       setRecommendation("");
       setCategory("Kualitas Pekerjaan");
       setUrgency("SEDANG");
       setSelectedPhotoUris([]);

       await loadData();
       setBanner("Kendala berhasil dibuat.");
     } catch (error) {
       setBanner(formatErrorMessage(error));
     } finally {
       setIsSubmitting(false);
     }
  }, [
    auth,
    category,
    description,
    loadData,
    projectId,
    recommendation,
    selectedPhotoUris,
    title,
    urgency,
  ]);

  const takeIssuePhoto = useCallback(async () => {
    try {
      const uri = await capturePhoto();
      if (uri) {
        setSelectedPhotoUris((prev) => [...new Set([...prev, uri])].slice(0, 3));
      }
    } catch (error) {
      setBanner(formatErrorMessage(error));
    }
  }, []);

  const pickIssuePhotoFromGallery = useCallback(async () => {
    try {
      const uris = await pickImages({ selectionLimit: 3 });
      setSelectedPhotoUris((prev) => [...new Set([...prev, ...uris])].slice(0, 3));
    } catch (error) {
      setBanner(formatErrorMessage(error));
    }
  }, []);

const changeStatus = useCallback(
    async (issueId: string, status: IssueItem["status"]) => {
      if (!auth) {
        return;
      }

      try {
        await changeIssueStatus(auth, issueId, status);
        await loadData();
      } catch (error) {
        setBanner(formatErrorMessage(error));
      }
    },
    [auth, loadData]
  );

  const renderIssueItem = useCallback(
    ({ item }: { item: IssueItem }) => (
      <Card>
        <View style={styles.issueTopRow}>
          <Text style={styles.issueTitle}>{item.title}</Text>
          <UrgencyBadge level={item.urgency} />
        </View>
        <Text style={styles.issueMeta}>Kategori: {item.category}</Text>
        <Text style={styles.issueMeta}>Pelapor: {item.reporterName}</Text>
        <Text style={styles.issueMeta}>{formatRelativeDate(item.createdAt)}</Text>
        <Text style={styles.issueMeta}>Lampiran foto: {item.photoUrls?.length ?? 0}</Text>
        <Text style={styles.issueDescription}>{item.description}</Text>
        {item.recommendation ? (
          <Text style={styles.issueRecommendation}>Rekomendasi: {item.recommendation}</Text>
        ) : null}
        <View style={styles.issueBottomRow}>
          <Badge label={formatIssueStatusLabel(item.status)} tone={statusTone(item.status)} />
          {item.status !== "SELESAI" ? (
            <View style={styles.statusActions}>
              <Pressable
                onPress={() => void changeStatus(item.id, "SEDANG_DITANGANI")}
                style={({ pressed }) => [styles.statusActionBtn, pressed && styles.pillPressed]}
              >
                <Text style={styles.statusActionText}>Tangani</Text>
              </Pressable>
              <Pressable
                onPress={() => void changeStatus(item.id, "SELESAI")}
                style={({ pressed }) => [styles.statusActionBtn, pressed && styles.pillPressed]}
              >
                <Text style={styles.statusActionText}>Selesaikan</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Card>
    ),
    [changeStatus]
  );

  return (
    <ScreenShell title="Kendala Lapangan" subtitle="Catat hambatan dan tindak lanjut tim" noScroll>
      <Card>
        <SectionTitle title="Ringkasan Kendala" caption="Pantau isu aktif sebelum membuat laporan baru" />
        <View style={styles.metricRow}>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Total Kendala</Text>
            <Text style={styles.metricValue}>{issues.length}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Aktif</Text>
            <Text style={styles.metricValue}>{activeIssues}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Prioritas Tinggi</Text>
            <Text style={styles.metricValue}>{criticalIssues}</Text>
          </View>
        </View>
        <View style={styles.historyButtonRow}>
          <IconButton icon="refresh" onPress={() => void loadData()} />
          <SecondaryButton label="Riwayat Kendala" onPress={() => navigation.navigate({ name: "IssueHistory" } as never)} />
        </View>
      </Card>

      <Card>
        <SectionTitle
          title="Buat Kendala Baru"
          caption="Isi data inti dan lampirkan bukti foto bila diperlukan"
        />

        <Text style={styles.label}>Proyek</Text>
        <View style={styles.pillRow}>
          {projects.map((project) => (
            <Pressable
              key={project.id}
              onPress={() => setProjectId(project.id)}
              style={({ pressed }) => [
                styles.pill,
                project.id === projectId && styles.pillActive,
                pressed && styles.pillPressed,
              ]}
            >
              <Text style={[styles.pillText, project.id === projectId && styles.pillTextActive]}>
                {project.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <LabeledInput
          label="Judul Kendala"
          placeholder="Contoh: Keterlambatan material atap"
          value={title}
          onChangeText={setTitle}
        />

        <LabeledInput
          label="Deskripsi"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Jelaskan detail kendala yang ditemukan"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pillRow}>
          {ISSUE_CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={({ pressed }) => [
                styles.pill,
                category === item && styles.pillActive,
                pressed && styles.pillPressed,
              ]}
            >
              <Text style={[styles.pillText, category === item && styles.pillTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Urgensi</Text>
        <View style={styles.pillRow}>
          {ISSUE_URGENCY.map((item) => (
            <Pressable
              key={item}
              onPress={() => setUrgency(item)}
              style={({ pressed }) => [
                styles.pill,
                urgency === item && styles.pillActive,
                pressed && styles.pillPressed,
              ]}
            >
              <Text style={[styles.pillText, urgency === item && styles.pillTextActive]}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <LabeledInput
          label="Rekomendasi"
          placeholder="Opsional untuk PM"
          value={recommendation}
          onChangeText={setRecommendation}
        />

        <Text style={styles.label}>Lampiran Foto Kendala</Text>
        <Text style={styles.helperText}>Maksimal 3 foto agar proses upload tetap cepat.</Text>
        <View style={styles.photoActionRow}>
          <SecondaryButton label="Ambil Foto" onPress={() => void takeIssuePhoto()} />
          <SecondaryButton label="Pilih Galeri" onPress={() => void pickIssuePhotoFromGallery()} />
        </View>
        <Text style={styles.photoMetaText}>Foto dipilih: {selectedPhotoUris.length}/3</Text>
        {selectedPhotoUris.length > 0 ? (
          <View style={styles.photoListWrap}>
            {selectedPhotoUris.map((uri, index) => (
              <View key={`${uri}-${index}`} style={styles.photoItemRow}>
                <Text style={styles.photoItemText}>{uri}</Text>
                <Pressable
                  onPress={() => {
                    setSelectedPhotoUris((prev) => prev.filter((_, idx) => idx !== index));
                  }}
                  style={({ pressed }) => [styles.statusActionBtn, pressed && styles.pillPressed]}
                >
                  <Text style={styles.statusActionText}>Hapus</Text>
                </Pressable>
              </View>
            ))}
          </View>
        ) : null}

<PrimaryButton
           label={isSubmitting ? "Menyimpan..." : "Simpan Kendala"}
           onPress={() => void submitIssue()}
           disabled={isSubmitting}
         />
      </Card>

<Card>
          <SectionTitle title="Daftar Kendala" caption="Cari dan filter kendala yang ada" />
        </Card>

        <View style={styles.stickyFilterContainer}>
          <LabeledInput
            label="Cari Kendala"
            placeholder="Ketik judul, deskripsi, atau kategori..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ marginBottom: 8, flex: 1 }}
          />
          <IconButton icon="refresh" onPress={() => void loadData()} />
        </View>

        <View style={styles.stickyFilterRow}>
          <Text style={styles.filterLabel}>Status:</Text>
          <View style={styles.filterPillRow}>
            {ISSUE_FILTER_STATUS.map((item) => (
              <Pressable
                key={item}
                onPress={() => setFilterStatus(item)}
                style={({ pressed }) => [
                  styles.filterPill,
                  filterStatus === item && styles.filterPillActive,
                  pressed && styles.pillPressed,
                ]}
              >
                <Text style={[styles.filterPillText, filterStatus === item && styles.filterPillTextActive]}>
                  {item === "SEMUA" ? "Semua" : formatIssueStatusLabel(item as IssueItem["status"])}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.stickyFilterRow}>
          <Text style={styles.filterLabel}>Urgensi:</Text>
          <View style={styles.filterPillRow}>
            {ISSUE_FILTER_URGENCY.map((item) => (
              <Pressable
                key={item}
                onPress={() => setFilterUrgency(item)}
                style={({ pressed }) => [
                  styles.filterPill,
                  filterUrgency === item && styles.filterPillActive,
                  pressed && styles.pillPressed,
                ]}
              >
                <Text style={[styles.filterPillText, filterUrgency === item && styles.filterPillTextActive]}>
                  {item === "SEMUA" ? "Semua" : formatIssueUrgencyLabel(item as IssueItem["urgency"])}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

      {isLoading ? (
        <SkeletonList count={3} />
      ) : (
        <FlatList
          data={filteredIssues}
          keyExtractor={(item) => item.id}
          renderItem={renderIssueItem}
          contentContainerStyle={styles.issueList}
          ListEmptyComponent={
            searchQuery || filterStatus !== "SEMUA" || filterUrgency !== "SEMUA"
              ? <EmptyState message="Tidak ada kendala yang sesuai dengan filter." />
              : <EmptyState message="Belum ada kendala pada proyek ini." />
          }
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricPill: {
    flexGrow: 1,
    minWidth: 108,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  metricLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
  },
  metricValue: {
    color: "#184b55",
    fontSize: 18,
    fontWeight: "800",
  },
  label: {
    color: "#1f4f5a",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 6,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#97bbc0",
    backgroundColor: "#f8fcfc",
    paddingVertical: 8,
    paddingHorizontal: 11,
  },
  pillActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#dff3f5",
  },
  pillPressed: {
    opacity: 0.82,
  },
  pillText: {
    color: "#3a646d",
    fontSize: 12,
    fontWeight: "700",
  },
  pillTextActive: {
    color: "#114a53",
  },
  helperText: {
    color: "#486f78",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
  photoActionRow: {
    gap: 8,
  },
  photoMetaText: {
    color: "#355f68",
    fontSize: 12,
    fontWeight: "700",
  },
  photoListWrap: {
    gap: 6,
  },
  photoItemRow: {
    borderWidth: 1,
    borderColor: "#c6dbde",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#f7fcfd",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  photoItemText: {
    flex: 1,
    color: "#3a646d",
    fontSize: 12,
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  issueList: {
    gap: 9,
  },
  issueTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  issueTitle: {
    flex: 1,
    color: "#133f49",
    fontWeight: "800",
    fontSize: 15,
  },
  issueMeta: {
    color: "#4a6a72",
    fontSize: 12,
  },
  issueDescription: {
    color: "#234d57",
    fontSize: 13,
    lineHeight: 18,
  },
  issueRecommendation: {
    color: "#214a54",
    fontSize: 13,
    fontWeight: "600",
  },
  issueBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  statusActions: {
    flexDirection: "row",
    gap: 8,
  },
  statusActionBtn: {
    borderWidth: 1,
    borderColor: "#7fa6ab",
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 6,
    backgroundColor: "#f3fbfc",
  },
  statusActionText: {
    color: "#205660",
    fontWeight: "700",
    fontSize: 12,
  },
  historyButtonRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterRow: {
    marginTop: 8,
    gap: 6,
  },
  filterLabel: {
    color: "#3a5f67",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  filterPillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  filterPill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#97bbc0",
    backgroundColor: "#f8fcfc",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  filterPillActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#dff3f5",
  },
  filterPillText: {
    color: "#3a646d",
    fontSize: 11,
    fontWeight: "700",
  },
  filterPillTextActive: {
    color: "#114a53",
  },
  stickyFilterContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    zIndex: 10,
  },
  stickyFilterRow: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
});
