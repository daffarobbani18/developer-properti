import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../hooks/useAuth";
import { API_URL } from "../../utils/config";

export function AddDefectScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { bookingId } = route.params;
  const { auth } = useAuth();

  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Maaf, butuh izin kamera untuk fitur ini.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Maaf, butuh izin galeri untuk fitur ini.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      "Pilih Sumber Foto",
      "Gunakan kamera langsung atau pilih dari galeri?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Kamera", onPress: openCamera },
        { text: "Galeri", onPress: openGallery }
      ]
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Deskripsi kerusakan wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("bookingId", bookingId);
      formData.append("description", description);

      if (imageUri) {
        const filename = imageUri.split('/').pop() || "photo.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("file", {
          uri: imageUri,
          name: filename,
          type
        } as any);
      }

      const response = await fetch(`${API_URL}/api/legal/defects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.token}`
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Berhasil", "Komplain kerusakan berhasil dicatat.", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else {
        const resData = await response.json();
        Alert.alert("Gagal", resData.error || "Gagal mencatat komplain.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.content}>
        <Text style={styles.label}>Foto Kerusakan</Text>
        
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.btnChangeImage} onPress={selectImageSource}>
              <Ionicons name="camera-reverse" size={20} color="#fff" />
              <Text style={styles.btnChangeImageText}>Ganti Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={selectImageSource}>
            <Ionicons name="camera" size={40} color="#94a3b8" />
            <Text style={styles.placeholderText}>Tap untuk pilih foto dari Kamera / Galeri</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>Lokasi & Deskripsi</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          placeholder="Misal: Plafon ruang tamu rembes air saat hujan deras..."
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={[styles.btnSubmit, isSubmitting && styles.btnDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSubmitText}>Kirim Laporan</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20 },
  label: { fontSize: 16, fontWeight: "600", color: "#334155", marginBottom: 8, marginTop: 12 },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#f8fafc",
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderStyle: "dashed",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  placeholderText: { color: "#64748b", marginTop: 8, fontSize: 14 },
  imagePreviewContainer: { width: "100%", height: 200, borderRadius: 12, overflow: "hidden", marginBottom: 16 },
  imagePreview: { width: "100%", height: "100%" },
  btnChangeImage: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  btnChangeImageText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  textInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#334155",
    backgroundColor: "#f8fafc",
    minHeight: 120,
    marginBottom: 24,
  },
  btnSubmit: {
    backgroundColor: "#f59e0b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  btnDisabled: { backgroundColor: "#fbbf24", opacity: 0.7 },
  btnSubmitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
