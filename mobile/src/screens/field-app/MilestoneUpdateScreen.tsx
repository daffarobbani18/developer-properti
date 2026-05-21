import React, { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import {
  Card,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { submitMilestoneUpdate } from "../../services/api";
import { useOfflineQueue } from "../../hooks/useOfflineQueue";
import { capturePhoto, pickImages, uploadPhoto } from "../../services/media";

type RouteParams = { milestoneId?: string; unitId?: string };

export function MilestoneUpdateScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { milestoneId, unitId } = route.params as RouteParams;

  const [note, setNote] = useState("");
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { enqueueMilestone } = useOfflineQueue(auth);

  const handleTakePhoto = useCallback(async () => {
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const uri = await capturePhoto();
      if (uri) {
        setSelectedPhotoUri(uri);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil foto");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handlePickPhoto = useCallback(async () => {
    setIsUploading(true);
    setErrorMessage(null);
    try {
      const uris = await pickImages({ selectionLimit: 1 });
      if (uris[0]) {
        setSelectedPhotoUri(uris[0]);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memilih foto");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!auth) {
      return;
    }

    if (!milestoneId) {
      setErrorMessage("Milestone ID tidak ditemukan");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    let finalPhotoUrl = null;
    try {
      if (selectedPhotoUri) {
        const uploadResult = await uploadPhoto(selectedPhotoUri, auth);
        finalPhotoUrl = uploadResult?.url ?? null;
      }

      await submitMilestoneUpdate(auth, {
        milestoneId,
        status: "COMPLETED",
        note: note.trim() || undefined,
        photoUrl: finalPhotoUrl ?? undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Gagal menyimpan update";
      setErrorMessage(errorMsg);

      await enqueueMilestone({
        milestoneId,
        status: "COMPLETED",
        note: note.trim() || undefined,
        photoUrl: finalPhotoUrl ?? selectedPhotoUri ?? undefined,
      });
      navigation.goBack();
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, enqueueMilestone, milestoneId, navigation, note, selectedPhotoUri]);

  const handleRemovePhoto = useCallback(() => {
    setSelectedPhotoUri(null);
  }, []);

  return (
    <ScreenShell title="Update Milestone" subtitle="Tandai milestone sebagai selesai">
      <Card>
        <LabeledInput
          label="Catatan (Opsional)"
          placeholder="Tambahkan catatan pekerjaan"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Foto Bukti (Opsional)</Text>
        <View style={styles.photoActions}>
          <SecondaryButton
            label="Ambil Foto"
            onPress={() => void handleTakePhoto()}
            disabled={isUploading || isSubmitting}
          />
          <SecondaryButton
            label="Pilih Galeri"
            onPress={() => void handlePickPhoto()}
            disabled={isUploading || isSubmitting}
          />
        </View>

        {selectedPhotoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: selectedPhotoUri }} style={styles.photoPreview} />
            <SecondaryButton
              label="Hapus Foto"
              onPress={() => void handleRemovePhoto()}
              disabled={isSubmitting}
            />
          </View>
        ) : null}

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
  photoActions: {
    flexDirection: "row",
    gap: 8,
  },
  photoPreviewContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
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