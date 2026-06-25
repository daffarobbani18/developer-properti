import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, RefreshControl, StatusBar, Platform, ScrollView, Pressable } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  Card,
  EmptyState,
  PrimaryButton,
  SectionTitle,
  StatusBanner,
  SlideInView,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getUnitMilestones } from "../../services/api";
import { Milestone } from "../../types";
import {
  formatDate,
  formatMilestoneStatusLabel,
  inferBannerTone,
} from "../../utils/format";
import { c } from "../../theme/colors";

export function FieldUpdateHistoryScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    setIsLoading(true);
    setBanner(null);

    try {
      const data = await getUnitMilestones(auth, "unit-1");
      setMilestones(data);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memuat riwayat update");
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const completedMilestones = milestones.filter((m) => m.status === "COMPLETED");

  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
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
              <Text style={styles.heroHeaderTitle}>Riwayat Update Milestone</Text>
              <View style={{ width: 44 }} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentPad}>
          {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

          <SlideInView direction="up" delay={50} duration={400}>
            <Card>
              <SectionTitle title="Statistik" caption="Ringkasan milestone yang telah selesai" />
              <View style={styles.statsGrid}>
                <View style={styles.statsPill}>
                  <Text style={styles.statsLabel}>Total Selesai</Text>
                  <Text style={styles.statsValue}>{completedMilestones.length}</Text>
                </View>
                <View style={styles.statsPill}>
                  <Text style={styles.statsLabel}>Total Milestone</Text>
                  <Text style={styles.statsValue}>{milestones.length}</Text>
                </View>
              </View>
            </Card>
          </SlideInView>

          <SlideInView direction="up" delay={100} duration={400}>
            <PrimaryButton label="Muat Ulang Data" onPress={() => void loadData()} />
          </SlideInView>

          {isLoading ? (
            <SlideInView direction="up" delay={150} duration={400}>
              <Card>
                <Text style={styles.loadingText}>Memuat riwayat update...</Text>
              </Card>
            </SlideInView>
          ) : completedMilestones.length === 0 ? (
            <SlideInView direction="up" delay={150} duration={400}>
              <EmptyState message="Belum ada milestone yang selesai untuk ditampilkan." />
            </SlideInView>
          ) : (
            <SlideInView direction="up" delay={200} duration={400}>
              <View style={styles.listWrap}>
                {completedMilestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.milestoneTitle}>
                        {milestone.orderNo}. {milestone.name}
                      </Text>
                      <Badge label={formatMilestoneStatusLabel(milestone.status)} tone="success" />
                    </View>
                    <Text style={styles.milestoneMeta}>Target: {formatDate(milestone.targetDate)}</Text>
                    {milestone.actualDate ? (
                      <Text style={styles.milestoneMeta}>Selesai: {formatDate(milestone.actualDate)}</Text>
                    ) : null}
                    {milestone.note ? (
                      <Text style={styles.milestoneNote}>{milestone.note}</Text>
                    ) : null}
                    <Text style={styles.milestonePhotos}>
                      Foto lampiran: {milestone.photos.length} file
                    </Text>
                  </Card>
                ))}
              </View>
            </SlideInView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statsPill: {
    flexGrow: 1,
    minWidth: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 2,
  },
  statsLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statsValue: {
    color: "#184b55",
    fontSize: 20,
    fontWeight: "800",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 9,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  milestoneTitle: {
    flex: 1,
    color: "#133f49",
    fontSize: 15,
    fontWeight: "800",
  },
  milestoneMeta: {
    color: "#4a6a72",
    fontSize: 12,
  },
  milestoneNote: {
    color: "#234d57",
    fontSize: 13,
    lineHeight: 18,
  },
  milestonePhotos: {
    color: "#355f68",
    fontSize: 12,
    fontWeight: "600",
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