import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Card, EmptyState, ScreenShell, SectionTitle } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerProgressData } from "../../services/api";
import { Milestone } from "../../types";

const { width } = Dimensions.get("window");

export function PhotoGalleryScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      const data = await getCustomerProgressData(auth);
      setMilestones(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat galeri foto");
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        await loadPhotos();
        if (!cancelled) {
          setIsLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadPhotos])
  );

const allPhotos = milestones.flatMap((m) =>
     m.photos.map((p) => ({
       ...p,
       milestoneName: m.name,
     }))
   );

   if (isLoading) {
     return (
       <ScreenShell title="Galeri Foto" subtitle="Dokumentasi progres pembangunan">
         <Card>
           <Text style={styles.loadingText}>Memuat foto progres...</Text>
         </Card>
       </ScreenShell>
     );
   }

   if (allPhotos.length === 0) {
     return (
       <ScreenShell title="Galeri Foto" subtitle="Dokumentasi progres pembangunan">
         <EmptyState message="Belum ada foto progres yang tersedia." />
       </ScreenShell>
     );
   }

   const renderPhotoItem = ({ item }: { item: typeof allPhotos[0] }) => (
     <TouchableOpacity style={styles.photoSlide} activeOpacity={0.9}>
       <Image source={{ uri: item.url }} style={styles.photoFull} resizeMode="contain" />
       <View style={styles.photoOverlay}>
         <Text style={styles.photoCaption}>{item.caption}</Text>
         <Text style={styles.photoMilestone}>{item.milestoneName}</Text>
       </View>
     </TouchableOpacity>
   );

   return (
     <ScreenShell title="Galeri Foto" subtitle="Dokumentasi progres pembangunan">
       {errorMessage ? (
         <Card>
           <Text style={styles.errorText}>{errorMessage}</Text>
         </Card>
       ) : null}

       <FlatList
         data={allPhotos}
         keyExtractor={(item) => item.id}
         renderItem={renderPhotoItem}
         horizontal
         pagingEnabled
         showsHorizontalScrollIndicator={false}
         style={styles.galleryList}
       />
     </ScreenShell>
   );
}

const styles = StyleSheet.create({
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  errorText: {
    color: "#c14953",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 12,
  },
  galleryList: {
    flex: 1,
  },
  photoSlide: {
    width,
    height: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  photoFull: {
    width: "90%",
    height: "80%",
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  photoCaption: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoMilestone: {
    color: "#e0f0f0",
    fontSize: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});