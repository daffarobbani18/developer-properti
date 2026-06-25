import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, Image , StatusBar, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_INNER_WIDTH = SCREEN_WIDTH - 48 - 48 - 40;
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

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
          const prevItem = index > 0 ? milestones[index - 1] : null;
          const isPrevCompleted = prevItem?.status === "COMPLETED";

          return (
            <SlideInView key={item.id} direction="up" delay={Math.min(index * 50, 400)} duration={350} style={styles.timelineRow}>
              
              {/* TIMELINE CONNECTOR */}
              <View style={styles.timelineGutter}>
                <View style={[styles.timelineLineFragmentTop, { backgroundColor: isFirst ? "transparent" : (isPrevCompleted ? c.primary : c.neutral200) }]} />
                
                <View style={[
                  styles.timelineDot,
                  isCompleted && styles.timelineDotCompleted,
                  isActive && styles.timelineDotActive,
                  isPending && styles.timelineDotPending
                ]}>
                  {isCompleted ? <Ionicons name="checkmark" size={12} color="#ffffff" /> : null}
                  {isActive ? <View style={styles.timelineDotInner} /> : null}
                </View>
                
                <View style={[styles.timelineLineFragmentBottom, { backgroundColor: isLast ? "transparent" : (isCompleted ? c.primary : c.neutral200) }]} />
              </View>

              {/* TIMELINE CONTENT */}
              <View style={[styles.timelineContent, isActive && styles.timelineContentActive]}>
                <View style={styles.timelineContentHeader}>
                  <Text style={styles.timelineTitle}>{item.name}</Text>
                  <Badge label={item.status === "COMPLETED" ? "Selesai" : item.status === "IN_PROGRESS" ? "Dikerjakan" : "Menunggu"} tone={toneByStatus(item.status)} />
                </View>

                <View style={styles.timelineMetaWrap}>
                  <Ionicons name="time-outline" size={14} color={c.neutral400} />
                  <Text style={styles.timelineMeta}>Target: {formatDate(item.targetDate)}</Text>
                  {item.actualDate && (
                     <>
                       <View style={styles.dotSeparator} />
                       <Text style={styles.timelineMeta}>Aktual: {formatDate(item.actualDate)}</Text>
                     </>
                  )}
                </View>

                {item.note ? (
                  <View style={styles.timelineNoteWrap}>
                    <Ionicons name="information-circle" size={18} color={c.neutral400} />
                    <Text style={styles.timelineNote}>{item.note}</Text>
                  </View>
                ) : null}

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
                            title: `Foto: ${item.name}`,
                            milestoneName: item.name,
                          });
                        }}
                        style={({pressed}) => [styles.photoThumbnailWrap, pressed && styles.pressed]}
                      >
                         {photo.url ? (
                           <Image source={{ uri: photo.url }} style={styles.photoThumbnailImage} />
                         ) : (
                           <View style={styles.photoPlaceholder}>
                             <Ionicons name="image" size={24} color={c.neutral400} />
                           </View>
                         )}
                         <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.photoOverlay}>
                            <Text style={styles.photoCaption} numberOfLines={2}>{photo.caption}</Text>
                         </LinearGradient>
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
        <LinearGradient 
          colors={[c.primary600, c.primary, c.primaryDark]} 
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroHeader}
        >
          {/* Subtle Top Inner Shadow/Reflection */}
          <LinearGradient 
             colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} 
             style={StyleSheet.absoluteFillObject} 
             pointerEvents="none" 
          />
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            <View style={{ height: 24 }} />
            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroKicker}>STATUS PEMBANGUNAN</Text>
              <Text style={styles.heroTitle}>Progres Fisik</Text>
            </View>
          </View>
        </LinearGradient>

        {/* PROGRESS METRICS PANEL (Overlapping) */}
        <View style={styles.overlapContainer}>
          <SlideInView direction="up" delay={0} duration={500}>
            <View style={styles.statsCard}>
               <View style={styles.statsMainRow}>
                 <View style={styles.statsMainCol}>
                   <Text style={styles.statsMainValue}>{overallProgress}%</Text>
                   <Text style={styles.statsMainLabel}>Penyelesaian Proyek</Text>
                 </View>
                 <View style={styles.statsDivider} />
                 <View style={styles.statsSubColGroup}>
                   <View style={styles.statsSubItem}>
                     <View style={styles.statsSubItemLeft}>
                       <View style={[styles.statsDot, { backgroundColor: c.success.text }]} />
                       <Text style={styles.statsSubLabel}>Selesai</Text>
                     </View>
                     <Text style={styles.statsSubValue}>{stats.done}</Text>
                   </View>
                   <View style={styles.statsSubItem}>
                     <View style={styles.statsSubItemLeft}>
                       <View style={[styles.statsDot, { backgroundColor: c.warning.text }]} />
                       <Text style={styles.statsSubLabel}>Dikerjakan</Text>
                     </View>
                     <Text style={styles.statsSubValue}>{stats.active}</Text>
                   </View>
                 </View>
               </View>

               <View style={styles.progressBarTrack}>
                 <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
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
    height: 24,
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
  },
  heroKicker: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.2,
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
    shadowOpacity: 0.06,
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
  statsSubItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsSubValue: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
  },
  statsSubLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: c.neutral100,
    borderRadius: 4,
    marginTop: 20,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: c.primary,
    borderRadius: 4,
  },
  contentPad: {
    paddingHorizontal: 24,
  },
  timelineContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  timelineRow: {
    flexDirection: "row",
    width: "100%",
  },
  timelineGutter: {
    width: 32,
    alignItems: "center",
    marginRight: 16,
  },
  timelineLineFragmentTop: {
    width: 2,
    height: 16,
  },
  timelineLineFragmentBottom: {
    width: 2,
    flex: 1,
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    borderWidth: 2,
    borderColor: c.neutral200,
  },
  timelineDotCompleted: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  timelineDotActive: {
    borderColor: c.warning.text,
    borderWidth: 4,
  },
  timelineDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.warning.text,
  },
  timelineDotPending: {
    backgroundColor: c.neutral100,
    borderColor: c.neutral200,
  },
  timelineContent: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
    overflow: "hidden",
  },
  timelineContentActive: {
    borderColor: c.warning.text,
    borderWidth: 2,
    shadowColor: c.warning.text,
    shadowOpacity: 0.08,
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
    flexShrink: 1,
    marginRight: 8,
    lineHeight: 22,
  },

  timelineMetaWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  timelineMeta: {
    fontSize: 12,
    color: c.neutral500,
    marginLeft: 6,
    fontWeight: "600",
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.neutral300,
    marginHorizontal: 8,
  },
  timelineNoteWrap: {
    flexDirection: "row",
    backgroundColor: c.neutral50,
    padding: 14,
    borderRadius: 16,
    gap: 10,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: c.primaryLight,
  },
  timelineNote: {
    flex: 1,
    fontSize: 13,
    color: c.neutral700,
    lineHeight: 20,
  },
  photoScroll: {
    marginTop: 16,
  },
  photoScrollContent: {
    gap: 12,
  },
  photoThumbnailWrap: {
    width: CARD_INNER_WIDTH,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: c.neutral100,
  },
  photoThumbnailImage: {
    width: "100%",
    height: "100%",
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
    paddingTop: 24,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  photoCaption: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
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
