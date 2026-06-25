const fs = require('fs');

const file = 'src/screens/customer/CustomerProgressScreen.tsx';

const newContent = `import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import {
   Badge,
   EmptyState,
   SecondaryButton,
   SlideInView,
   SkeletonList,
   StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerProgressData } from "../../services/api";
import { Milestone } from "../../types";
import { formatDate, inferBannerTone } from "../../utils/format";
import type { CustomerStackParamList } from "../../navigation/types";
import { c } from "../../theme/colors";

function toneByStatus(status: Milestone["status"]): "neutral" | "warning" | "success" {
  if (status === "COMPLETED") return "success";
  if (status === "IN_PROGRESS") return "warning";
  return "neutral";
}

export function CustomerProgressScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) return;
    const data = await getCustomerProgressData(auth);
    setMilestones(data);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          await loadData();
        } catch (error) {
          if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Gagal memuat progres");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadData])
  );

  const stats = useMemo(() => {
    const total = milestones.length;
    const done = milestones.filter((item) => item.status === "COMPLETED").length;
    const active = milestones.filter((item) => item.status === "IN_PROGRESS").length;
    return { total, done, active };
  }, [milestones]);

  const overallProgress = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const renderTimeline = () => {
    if (isLoading) {
      return (
        <View style={styles.contentPad}>
          <SkeletonList count={3} />
        </View>
      );
    }
    if (errorMessage) {
      return (
        <View style={styles.contentPad}>
          <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
        </View>
      );
    }
    if (milestones.length === 0) {
      return (
        <View style={styles.contentPad}>
          <View style={styles.emptyState}>
            <Ionicons name="stats-chart-outline" size={48} color={c.neutral300} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>Belum ada data progres unit Anda.</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.timelineContainer}>
        {milestones.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === milestones.length - 1;
          const isCompleted = item.status === "COMPLETED";
          const isActive = item.status === "IN_PROGRESS";
          const isPending = item.status === "PENDING";

          return (
            <SlideInView key={item.id} direction="up" delay={Math.min(index * 50, 400)} duration={350} style={styles.timelineRow}>
              
              {/* TIMELINE CONNECTOR */}
              <View style={styles.timelineGutter}>
                {!isFirst && (
                   <View style={[styles.timelineLine, styles.timelineLineTop, { backgroundColor: isCompleted || isActive ? c.primary600 : c.neutral200 }]} />
                )}
                <View style={[
                  styles.timelineDot,
                  isCompleted && styles.timelineDotCompleted,
                  isActive && styles.timelineDotActive,
                  isPending && styles.timelineDotPending
                ]}>
                  {isCompleted ? <Ionicons name="checkmark" size={14} color="#ffffff" /> : null}
                  {isActive ? <View style={styles.timelineDotInner} /> : null}
                </View>
                {!isLast && (
                  <View style={[styles.timelineLine, styles.timelineLineBottom, { backgroundColor: isCompleted ? c.primary600 : c.neutral200 }]} />
                )}
              </View>

              {/* TIMELINE CONTENT */}
              <View style={styles.timelineContent}>
                <View style={styles.timelineContentHeader}>
                  <Text style={[styles.timelineTitle, isActive && styles.timelineTitleActive]}>{item.name}</Text>
                  <View style={[styles.statusBadge, isCompleted && styles.statusBadgeCompleted, isActive && styles.statusBadgeActive]}>
                    <Text style={[styles.statusBadgeText, isCompleted && styles.statusBadgeTextCompleted, isActive && styles.statusBadgeTextActive]}>
                      {item.status === "COMPLETED" ? "Selesai" : item.status === "IN_PROGRESS" ? "Dikerjakan" : "Menunggu"}
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineMetaWrap}>
                  <Ionicons name="calendar-outline" size={14} color={c.neutral500} />
                  <Text style={styles.timelineMeta}>Target: {formatDate(item.targetDate)}</Text>
                  {item.actualDate && (
                     <>
                       <View style={styles.dotSeparator} />
                       <Text style={styles.timelineMeta}>Aktual: {formatDate(item.actualDate)}</Text>
                     </>
                  )}
                </View>

                {item.note ? <Text style={styles.timelineNote}>{item.note}</Text> : null}

                {/* PHOTO GALLERY */}
                {item.photos.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll} contentContainerStyle={styles.photoScrollContent}>
                    {item.photos.map((photo) => (
                      <Pressable
                        key={photo.id}
                        onPress={async () => {
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                          navigation.navigate("PhotoGallery", {
                            photos: item.photos,
                            initialIndex: 0,
                            title: \`Foto: \${item.name}\`,
                            milestoneName: item.name,
                          });
                        }}
                        style={({pressed}) => [styles.photoThumbnailWrap, pressed && styles.pressed]}
                      >
                         <View style={styles.photoPlaceholder}>
                           <Ionicons name="image" size={24} color={c.neutral400} />
                         </View>
                         {/* We fake the image load here since the mock uses raw URLs */}
                         <View style={styles.photoOverlay}>
                            <Text style={styles.photoCaption} numberOfLines={1}>{photo.caption}</Text>
                         </View>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>

            </SlideInView>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* HERO HEADER */}
        <LinearGradient colors={[c.primary, c.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
            </View>
            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroKicker}>TOWARDS COMPLETION</Text>
              <Text style={styles.heroTitle}>Progres Fisik</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* PROGRESS METRICS PANEL (Overlapping) */}
        <View style={styles.overlapContainer}>
          <SlideInView direction="up" delay={0} duration={500}>
            <View style={styles.statsCard}>
               <View style={styles.statsMainRow}>
                 <View style={styles.statsMainCol}>
                   <Text style={styles.statsMainValue}>{overallProgress}%</Text>
                   <Text style={styles.statsMainLabel}>Penyelesaian</Text>
                 </View>
                 <View style={styles.statsDivider} />
                 <View style={styles.statsSubColGroup}>
                   <View style={styles.statsSubItem}>
                     <Text style={styles.statsSubValue}>{stats.done}</Text>
                     <Text style={styles.statsSubLabel}>Selesai</Text>
                   </View>
                   <View style={styles.statsSubItem}>
                     <Text style={[styles.statsSubValue, { color: c.warning.text }]}>{stats.active}</Text>
                     <Text style={styles.statsSubLabel}>Aktif</Text>
                   </View>
                 </View>
               </View>
            </View>
          </SlideInView>
        </View>

        {/* TIMELINE SECTION */}
        {renderTimeline()}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  heroHeader: {
    paddingBottom: 70,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitleWrap: {
    paddingHorizontal: 4,
  },
  heroKicker: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  overlapContainer: {
    marginTop: -40,
    paddingHorizontal: 24,
    zIndex: 10,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  statsMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsMainCol: {
    flex: 1,
    alignItems: "flex-start",
  },
  statsMainValue: {
    fontSize: 42,
    fontWeight: "900",
    color: c.primary600,
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  statsMainLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: c.neutral200,
    marginHorizontal: 24,
  },
  statsSubColGroup: {
    flex: 1,
    gap: 12,
  },
  statsSubItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsSubValue: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
  },
  statsSubLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: c.neutral500,
  },
  contentPad: {
    paddingHorizontal: 24,
  },
  timelineContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 100,
  },
  timelineGutter: {
    width: 32,
    alignItems: "center",
  },
  timelineLine: {
    width: 2,
    position: "absolute",
  },
  timelineLineTop: {
    top: 0,
    bottom: "85%",
  },
  timelineLineBottom: {
    top: "15%",
    bottom: -16, // Connect to next item
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: c.neutral200,
    marginTop: "10%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  timelineDotCompleted: {
    backgroundColor: c.primary600,
  },
  timelineDotActive: {
    backgroundColor: c.warning.bg,
    borderColor: c.warning.text,
    borderWidth: 2,
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.warning.text,
  },
  timelineDotPending: {
    backgroundColor: c.neutral100,
    borderWidth: 2,
    borderColor: c.neutral300,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 32,
    paddingTop: "6%",
  },
  timelineContentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral800,
    flex: 1,
    marginRight: 8,
  },
  timelineTitleActive: {
    color: c.neutral900,
    fontSize: 17,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: c.neutral100,
  },
  statusBadgeCompleted: {
    backgroundColor: c.success.bg,
  },
  statusBadgeActive: {
    backgroundColor: c.warning.bg,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: c.neutral500,
  },
  statusBadgeTextCompleted: {
    color: c.success.text,
  },
  statusBadgeTextActive: {
    color: c.warning.text,
  },
  timelineMetaWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  timelineMeta: {
    fontSize: 12,
    color: c.neutral500,
    marginLeft: 6,
    fontWeight: "500",
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.neutral300,
    marginHorizontal: 8,
  },
  timelineNote: {
    fontSize: 13,
    color: c.neutral600,
    backgroundColor: c.neutral50,
    padding: 12,
    borderRadius: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  photoScroll: {
    marginTop: 16,
    marginHorizontal: -24, // Break out of container
  },
  photoScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  photoThumbnailWrap: {
    width: 140,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: c.neutral100,
  },
  photoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  photoCaption: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: c.neutral400,
    fontSize: 15,
    fontWeight: "500",
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('CustomerProgressScreen successfully redesigned.');
