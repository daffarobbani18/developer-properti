import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert, StatusBar, Platform, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../hooks/useAuth";
import { createInspectionDefect } from "../../services/api";
import { LinearGradient } from "expo-linear-gradient";
import { Card, LabeledInput, PrimaryButton, SecondaryButton, SlideInView } from "../../components/ui";
import { c } from "../../theme/colors";

export function AddDefectScreen(): React.JSX.Element {
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

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Deskripsi kerusakan wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createInspectionDefect(auth, bookingId, description, imageUri);
      Alert.alert("Berhasil", "Komplain kerusakan berhasil dicatat.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* HERO HEADER */}
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
            <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text style={styles.heroHeaderTitle}>Tambah Komplain</Text>
              <View style={{ width: 44 }} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentPad}>
          <SlideInView direction="up" delay={50} duration={400}>
            <Card>
              <Text style={styles.label}>Foto Kerusakan</Text>
              
              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <View style={styles.photoActionRow}>
                    <SecondaryButton label="Buka Kamera" onPress={openCamera} />
                    <SecondaryButton label="Buka Galeri" onPress={openGallery} />
                  </View>
                </View>
              ) : (
                <View style={styles.imagePlaceholderWrap}>
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="camera" size={40} color="#94a3b8" />
                    <Text style={styles.placeholderText}>Belum ada foto</Text>
                  </View>
                  <View style={styles.photoActionRow}>
                    <SecondaryButton label="Buka Kamera" onPress={openCamera} />
                    <SecondaryButton label="Buka Galeri" onPress={openGallery} />
                  </View>
                </View>
              )}

              <View style={{ marginTop: 16 }}>
                <LabeledInput
                  label="Lokasi & Deskripsi"
                  placeholder="Misal: Plafon ruang tamu rembes air saat hujan deras..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  style={{ minHeight: 100, textAlignVertical: "top" }}
                />
              </View>

              <View style={{ marginTop: 24 }}>
                <PrimaryButton 
                  label={isSubmitting ? "Mengirim..." : "Kirim Laporan"} 
                  onPress={() => void handleSubmit()} 
                  disabled={isSubmitting} 
                />
              </View>
            </Card>
          </SlideInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: "700", color: "#64748b", marginBottom: 12, textTransform: "uppercase" },
  imagePlaceholderWrap: {
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: "100%",
    height: 180,
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
  imagePreviewContainer: { marginBottom: 8 },
  imagePreview: { width: "100%", height: 180, borderRadius: 12, marginBottom: 16 },
  photoActionRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center"
  },

  // Standard Header Styles
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  heroHeader: {
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroSafeArea: {
    paddingHorizontal: 24,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
