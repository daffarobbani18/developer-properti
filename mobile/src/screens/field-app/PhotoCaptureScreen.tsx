import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import {
  Card,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
} from "../../components/ui";
import { ImagePreviewGrid } from "../../components/ImagePreview";
import { capturePhoto, pickImages } from "../../services/media";

import { consumeCaptureCallback } from "../../utils/captureCallback";

export function PhotoCaptureScreen(): React.JSX.Element {
  const navigation = useNavigation();

  const [selectedPhotoUris, setSelectedPhotoUris] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const removePhoto = useCallback((indexToRemove: number) => {
    setSelectedPhotoUris((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleUsePhotos = useCallback(() => {
    if (selectedPhotoUris.length === 0) {
      setErrorMessage("Belum ada foto yang dipilih.");
      return;
    }

    const callback = consumeCaptureCallback();
    if (callback) {
      callback(selectedPhotoUris);
    }
    navigation.goBack();
  }, [navigation, selectedPhotoUris]);

  return (
    <ScreenShell title="Ambil Foto" subtitle="Kamera atau galeri untuk dokumentasi">
      <Card>
        <Text style={styles.sectionTitle}>Sumber Foto</Text>
        <View style={styles.buttonRow}>
<SecondaryButton label="Kamera" onPress={() => void takePhoto()} disabled={isCapturing} />
           <SecondaryButton label="Galeri" onPress={() => void pickFromGallery()} disabled={isCapturing} />
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
        <SecondaryButton label="Batal" onPress={() => navigation.goBack()} />
<PrimaryButton
           label="Gunakan Foto"
           onPress={handleUsePhotos}
           disabled={selectedPhotoUris.length === 0}
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