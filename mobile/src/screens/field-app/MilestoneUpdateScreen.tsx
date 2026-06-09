import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import {
  Card,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
} from "../../components/ui";
import { c } from "../../theme/colors";
import { ImagePreviewGrid } from "../../components/ImagePreview";
import { useAuth } from "../../hooks/useAuth";
import { submitMilestoneUpdate } from "../../services/api";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { setCaptureCallback } from "../../utils/captureCallback";
import { uploadPhoto } from "../../services/media";
import type { MilestoneUpdateScreenProps } from "../../navigation/types";

export function MilestoneUpdateScreen({ route }: MilestoneUpdateScreenProps): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const { milestoneId, milestone } = route.params;

  const [note, setNote] = useState("");
  const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'REJECTED' | 'COMPLETED' | 'PENDING'>(
    milestone?.status ?? 'IN_PROGRESS'
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { enqueueMilestone } = useOfflineQueue(auth);

  const navigateToPhotoCapture = useCallback(() => {
    setCaptureCallback((uris: string[]) => {
      setSelectedPhotoUris(prev => [...prev, ...uris].slice(0, 5));
    });
    navigation.navigate({
      name: 'PhotoCapture',
      params: {} as never,
    } as never);
  }, [navigation]);

  const handleSubmit = useCallback(async () => {
    if (!auth) {
      return;
    }

    if (!milestoneId) {
      setErrorMessage("Milestone ID tidak ditemukan");
      return;
    }

    if (selectedPhotoUris.length === 0) {
      setErrorMessage('Minimal 1 foto bukti wajib diupload.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const photoUrls: string[] = [];
    try {
      for (const uri of selectedPhotoUris) {
        const result = await uploadPhoto(uri, auth);
        if (result?.url) {
          photoUrls.push(result.url);
        }
      }

      await submitMilestoneUpdate(auth, {
        milestoneId,
        status: selectedStatus,
        note: note.trim() || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Gagal menyimpan update";
      setErrorMessage(errorMsg);

      await enqueueMilestone({
        milestoneId,
        status: selectedStatus,
        note: note.trim() || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : selectedPhotoUris,
      });
      navigation.goBack();
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, enqueueMilestone, milestoneId, navigation, note, selectedPhotoUris, selectedStatus]);

  return (
    <ScreenShell title="Update Milestone" subtitle="Tandai milestone sebagai selesai">
      <Card>
        {/* Status Picker */}
        <Text style={styles.label}>Status Pekerjaan</Text>
        <View style={styles.pillRow}>
          {(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const).map((status) => {
            const labels: Record<string, string> = {
              NOT_STARTED: 'Belum Mulai',
              IN_PROGRESS: 'Sedang Berjalan',
              COMPLETED: 'Selesai',
              WAITING_APPROVAL: 'Menunggu',
              REJECTED: 'Ditolak',
              PENDING: 'Pending',
            };
            const isSelected = selectedStatus === status;
            return (
              <Pressable
                key={status}
                onPress={() => setSelectedStatus(status)}
                style={({ pressed }) => [
                  styles.pill,
                  isSelected && styles.pillActive,
                  pressed && styles.pillPressed,
                ]}
              >
                <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
                  {labels[status]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <LabeledInput
          label="Catatan (Opsional)"
          placeholder="Tambahkan catatan pekerjaan"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>
          Foto Bukti * <Text style={{ color: c.danger.bg }}>({selectedPhotoUris.length}/5)</Text>
        </Text>

        {selectedPhotoUris.length > 0 && (
          <ImagePreviewGrid
            uris={selectedPhotoUris}
            onRemove={(index) => setSelectedPhotoUris(prev => prev.filter((_, i) => i !== index))}
            style={{ marginBottom: 12 }}
          />
        )}

        {selectedPhotoUris.length < 5 && (
          <SecondaryButton
            label={selectedPhotoUris.length === 0 ? '📷  Ambil Foto Bukti' : '📷  Tambah Foto'}
            onPress={navigateToPhotoCapture}
            disabled={isSubmitting || isUploading}
          />
        )}

        <Text style={{ fontSize: 12, color: c.danger.bg, marginTop: 4 }}>
          * Minimal 1 foto bukti wajib diisi (maksimal 5 foto)
        </Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.buttonRow}>
          <SecondaryButton
            label="Batal"
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          />
          <PrimaryButton
            label="Simpan"
            onPress={() => void handleSubmit()}
            loading={isSubmitting || isUploading}
            disabled={isSubmitting || isUploading || selectedPhotoUris.length === 0}
          />
        </View>
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
  errorText: {
    color: "#c14953",
    fontSize: 13,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
});