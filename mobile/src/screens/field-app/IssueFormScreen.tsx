import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  Card,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { createFieldIssue, getProjectOptions } from "../../services/api";
import { IssueItem } from "../../types";
import { formatIssueStatusLabel, formatIssueUrgencyLabel } from "../../utils/format";
import { capturePhoto, pickImages } from "../../services/media";

const ISSUE_CATEGORIES: IssueItem["category"][] = [
  "Kualitas Pekerjaan",
  "Jadwal Molor",
  "Cuaca",
  "Akses Lokasi",
  "Lainnya",
];

const ISSUE_URGENCY: IssueItem["urgency"][] = ["RENDAH", "SEDANG", "TINGGI", "KRITIS"];

export function IssueFormScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueItem["category"]>("Kualitas Pekerjaan");
  const [urgency, setUrgency] = useState<IssueItem["urgency"]>("SEDANG");
  const [recommendation, setRecommendation] = useState("");
  const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!auth || !projectId || !title.trim() || !description.trim()) {
      setErrorMessage("Proyek, judul, dan deskripsi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

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

      navigation.goBack();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal membuat kendala");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, category, description, projectId, recommendation, selectedPhotoUris, title, urgency, navigation]);

  const takePhoto = useCallback(async () => {
    try {
      const uri = await capturePhoto();
      if (uri) {
        setSelectedPhotoUris((prev) => [...new Set([...prev, uri])].slice(0, 3));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil foto");
    }
  }, []);

  const pickPhoto = useCallback(async () => {
    try {
      const uris = await pickImages({ selectionLimit: 3 });
      setSelectedPhotoUris((prev) => [...new Set([...prev, ...uris])].slice(0, 3));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memilih foto");
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      if (auth) {
        const data = await getProjectOptions(auth);
        setProjects(data);
        if (!projectId && data[0]) {
          setProjectId(data[0].id);
        }
      }
    })();
  }, [auth, projectId]);

  return (
    <ScreenShell title="Form Kendala" subtitle="Buat laporan kendala lapangan">
      <Card>
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
                {formatIssueUrgencyLabel(item)}
              </Text>
            </Pressable>
          ))}
        </View>

        <LabeledInput
          label="Rekomendasi (Opsional)"
          placeholder="Opsional untuk PM"
          value={recommendation}
          onChangeText={setRecommendation}
        />

        <Text style={styles.label}>Lampiran Foto ({selectedPhotoUris.length}/3)</Text>
        <View style={styles.photoActionRow}>
          <SecondaryButton label="Ambil Foto" onPress={() => void takePhoto()} />
          <SecondaryButton label="Pilih Galeri" onPress={() => void pickPhoto()} />
        </View>

        {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

        <PrimaryButton label={isSubmitting ? "Menyimpan..." : "Simpan Kendala"} onPress={handleSubmit} disabled={isSubmitting} />
        <SecondaryButton label="Batal" onPress={() => navigation.goBack()} disabled={isSubmitting} />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#1f4f5a",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
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
  photoActionRow: {
    gap: 8,
    marginTop: 8,
  },
});