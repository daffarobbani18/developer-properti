import React, { useCallback, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View, FlatList, TouchableOpacity , StatusBar } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import { Card, EmptyState, ScreenShell, StatusBanner } from "../../components/ui";
import { inferBannerTone } from "../../utils/format";
import ImageViewing from "react-native-image-viewing";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerProgressData } from "../../services/api";
import { Milestone, MilestonePhoto } from "../../types";

const { width } = Dimensions.get("window");

type RouteParams = {
  photos?: MilestonePhoto[];
  initialIndex?: number;
  title?: string;
  milestoneName?: string;
};

export function PhotoGalleryScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const route = useRoute();
  const { photos: passedPhotos, initialIndex = 0, title, milestoneName } = (route.params as RouteParams) || {};

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(!passedPhotos);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

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
      if (passedPhotos) {
        return;
      }

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
    }, [loadPhotos, passedPhotos])
  );

  const displayPhotos = passedPhotos || milestones.flatMap((m) => m.photos);

  if (isLoading) {
    return (
      <ScreenShell title={title || "Galeri Foto"} subtitle="Dokumentasi progres pembangunan">
        <Card>
          <Text style={styles.loadingText}>Memuat foto progres...</Text>
        </Card>
      </ScreenShell>
    );
  }

  if (displayPhotos.length === 0) {
    return (
      <ScreenShell title={title || "Galeri Foto"} subtitle="Dokumentasi progres pembangunan">
        <EmptyState message="Belum ada foto progres yang tersedia." />
      </ScreenShell>
    );
  }

  const renderPhotoItem = ({ item, index }: { item: MilestonePhoto; index: number }) => (
    <TouchableOpacity 
      style={styles.photoSlide} 
      activeOpacity={0.9} 
      onPress={() => {
        setViewerIndex(index);
        setIsViewerVisible(true);
      }}
    >
      <Image source={{ uri: item.url }} style={styles.photoFull} resizeMode="contain" />
      <View style={styles.photoOverlay}>
        <Text style={styles.photoCaption}>{item.caption}</Text>
        {milestoneName ? <Text style={styles.photoMilestone}>{milestoneName}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenShell title={title || "Galeri Foto"} subtitle="Dokumentasi progres pembangunan">
      {errorMessage ? (
        <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
      ) : null}

      <FlatList
        data={displayPhotos}
        keyExtractor={(item) => item.id}
        renderItem={renderPhotoItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.galleryList}
        initialScrollIndex={initialIndex}
      />

      <ImageViewing
        images={displayPhotos.map(p => ({ uri: p.url }))}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
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
    paddingHorizontal: 24,
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