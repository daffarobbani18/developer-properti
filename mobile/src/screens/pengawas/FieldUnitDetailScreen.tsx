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
  SecondaryButton,
  SectionTitle,
  StatusBanner,
  SlideInView,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme/colors";
import { getFieldUnits, getUnitMilestones } from "../../services/api";
import { Milestone, Unit } from "../../types";
import { formatDate, formatMilestoneStatusLabel, formatUnitStatusLabel, inferBannerTone } from "../../utils/format";
import { c } from "../../theme/colors";

type UnitDetailParams = {
  unitId?: string;
};

export function FieldUnitDetailScreen({ unitId: routeUnitId }: UnitDetailParams): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();

  const [unit, setUnit] = useState<Unit | null>(null);
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
      const targetUnitId = routeUnitId ?? "unit-1";
      const [units, unitMilestones] = await Promise.all([
        getFieldUnits(auth),
        getUnitMilestones(auth, targetUnitId),
      ]);

      const foundUnit = units.find((u) => u.id === targetUnitId) ?? units[0];
      setUnit(foundUnit ?? null);
      setMilestones(unitMilestones);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memuat detail unit");
    } finally {
      setIsLoading(false);
    }
  }, [auth, routeUnitId]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const completedCount = milestones.filter((m) => m.status === "COMPLETED").length;
  const inProgressCount = milestones.filter((m) => m.status === "IN_PROGRESS").length;

  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

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
              <Text style={styles.heroHeaderTitle}>Detail Unit</Text>
              <View style={{ width: 44 }} />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentPad}>
          {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

          <SlideInView direction="up" delay={50} duration={400}>
            <SecondaryButton label="Muat Ulang" onPress={() => void loadData()} />
          </SlideInView>

          {isLoading ? (
            <SlideInView direction="up" delay={100} duration={400}>
              <Card>
                <Text style={styles.loadingText}>Memuat detail unit...</Text>
              </Card>
            </SlideInView>
          ) : !unit ? (
            <SlideInView direction="up" delay={100} duration={400}>
              <EmptyState message="Unit tidak ditemukan." />
            </SlideInView>
          ) : (
            <>
              <SlideInView direction="up" delay={100} duration={400}>
                <Card>
                  <SectionTitle title="Informasi Unit" />
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Kode Unit</Text>
                    <Text style={styles.infoValue}>{unit.code}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipe</Text>
                    <Text style={styles.infoValue}>{unit.typeName}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status</Text>
                    <Badge label={formatUnitStatusLabel(unit.status)} tone="success" />
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Progres</Text>
                    <Text style={styles.infoValue}>{unit.progress}%</Text>
                  </View>
                </Card>
              </SlideInView>

              <SlideInView direction="up" delay={150} duration={400}>
                <Card>
                  <SectionTitle
                    title="Progress Milestone"
                    caption={`${completedCount} selesai, ${inProgressCount} dalam proses`}
                  />
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <View style={[styles.progressFill, { width: `${Math.max(4, unit.progress)}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{unit.progress}%</Text>
                  </View>
                </Card>
              </SlideInView>

              <SlideInView direction="up" delay={200} duration={400}>
                <Card>
                  <SectionTitle title="Milestone Unit" />
                  {milestones.length === 0 ? (
                    <EmptyState message="Belum ada milestone untuk unit ini." />
                  ) : (
                    <View style={styles.milestoneList}>
                      {milestones.map((milestone) => (
                        <View key={milestone.id} style={styles.milestoneItem}>
                          <View style={styles.milestoneHeader}>
                            <Text style={styles.milestoneOrder}>{milestone.orderNo}.</Text>
                            <Text style={styles.milestoneName}>{milestone.name}</Text>
                          </View>
                          <View style={styles.milestoneDetails}>
                            <Text style={styles.milestoneDate}>Target: {formatDate(milestone.targetDate)}</Text>
                            {milestone.actualDate && (
                              <Text style={styles.milestoneDate}>Selesai: {formatDate(milestone.actualDate)}</Text>
                            )}
                            <Badge label={formatMilestoneStatusLabel(milestone.status)} tone="success" />
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </Card>
              </SlideInView>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoLabel: {
    color: "#4a6a72",
    fontSize: 14,
  },
  infoValue: {
    color: "#133f49",
    fontSize: 14,
    fontWeight: "700",
  },
  progressContainer: {
    gap: 8,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: "#e0ecee",
    overflow: "hidden",
  },
progressFill: {
     height: "100%",
     backgroundColor: colors.primary,
     borderRadius: 999,
   },
  progressText: {
    textAlign: "center",
    color: "#184b55",
    fontSize: 14,
    fontWeight: "700",
  },
  milestoneList: {
    gap: 10,
  },
  milestoneItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#d6e3e7",
    borderRadius: 10,
    backgroundColor: "#fafdfd",
    gap: 6,
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  milestoneOrder: {
    color: "#184b55",
    fontSize: 14,
    fontWeight: "700",
  },
  milestoneName: {
    color: "#133f49",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  milestoneDetails: {
    gap: 4,
  },
  milestoneDate: {
    color: "#4a6a72",
    fontSize: 12,
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