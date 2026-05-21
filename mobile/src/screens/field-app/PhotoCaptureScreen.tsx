import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  Card,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
} from "../../components/ui";
import { ImagePreviewGrid } from "../../components/ImagePreview";
import { useAuth } from "../../hooks/useAuth";
import { capturePhoto, pickImages, uploadPhoto } from "../../services/media";

type RouteParams = { milestoneId?: string; unitId?: string };

export function PhotoCaptureScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const { milestoneId, unitId } = route.params as RouteParams;

  const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ url: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { auth } = useAuth();

  const takePhoto = useCallback(async () => {
    setIsCapturing(true);
    setErrorMessage(null);
    try {
      const uri = await capturePhoto();
      if (uri) {
        setSelectedPhotoUris((prev) => [...new Set([...prev, uri])].slice(0, 5));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengambil foto");
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const pickFromGallery = useCallback(async () => {
    setErrorMessage(null);
    try {
      const uris = await pickImages({ selectionLimit: 5 });
      setSelectedPhotoUris((prev) => [...new Set([...prev, ...uris])].slice(0, 5));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memilih foto");
    }
  }, []);

  const removePhoto = useCallback((uriToRemove: string) => {
    setSelectedPhotoUris((prev) => prev.filter((uri) => uri !== uriToRemove));
  }, []);

  const handleUploadAndUse = useCallback(async () => {
    if (selectedPhotoUris.length === 0) {
      setErrorMessage("Belum ada foto yang dipilih.");
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const results = await Promise.all(
        selectedPhotoUris.map((uri) => uploadPhoto(uri, auth))
      );
      const successfulUploads = results.filter((r): r is { url: string } => r !== null);
      if (successfulUploads.length > 0) {
        setUploadResult(successfulUploads[0]);
        navigation.goBack();
      } else {
        setErrorMessage("Gagal mengunggah foto. Coba lagi nanti.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengunggah foto");
    } finally {
      setIsUploading(false);
    }
  }, [auth, navigation, selectedPhotoUris]);

  return (
    <ScreenShell title="Ambil Foto" subtitle="Kamera atau galeri untuk dokumentasi">
      <Card>
        <Text style={styles.sectionTitle}>Sumber Foto</Text>
        <View style={styles.buttonRow}>
          <SecondaryButton label="Kamera" onPress={() => void takePhoto()} disabled={isCapturing || isUploading} />
          <SecondaryButton label="Galeri" onPress={() => void pickFromGallery()} disabled={isCapturing || isUploading} />
        </View>
      </Card>

      {errorMessage ? (
        <Card>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : null}

<Card>
         <Text style={styles.sectionTitle}>Foto Terpilih ({selectedPhotoUris.length}/5)</Text>
         <ImagePreviewGrid uris={selectedPhotoUris} onRemove={removePhoto} />
       </Card>

      <View style={styles.actionRow}>
        <SecondaryButton label="Batal" onPress={() => navigation.goBack()} disabled={isUploading} />
        <PrimaryButton
          label={isUploading ? "Mengunggah..." : "Gunakan & Unggah"}
          onPress={handleUploadAndUse}
          disabled={selectedPhotoUris.length === 0}
          loading={isUploading}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    color: "#1b4a55",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  errorText: {
    color: "#c14953",
    fontSize: 13,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
});