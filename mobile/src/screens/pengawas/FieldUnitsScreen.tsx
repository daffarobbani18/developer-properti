import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { FieldStackParamList } from "../../navigation/types";

import {
  EmptyState,
  StatusBanner,
  SkeletonList,
  SlideInView,
  AnimatedProgressBar,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldUnits, getProjectOptions } from "../../services/api";
import { ProjectSummary, Unit } from "../../types";
import { c } from "../../theme/colors";

export function FieldUnitsScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const route = useRoute<RouteProp<FieldStackParamList, "FieldUnits">>();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(route.params?.projectId);
  const [search, setSearch] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === "android"
    ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45)
    : (insets?.top || 20);

  const loadProjects = useCallback(async () => {
    if (!auth) return;
    const data = await getProjectOptions(auth);
    setProjects(data);
    if (!selectedProjectId && data[0]) {
      setSelectedProjectId(data[0].id);
    }
  }, [auth, selectedProjectId]);

  const loadUnits = useCallback(async () => {
    if (!auth) return;
    setErrorMessage(null);
    try {
      const data = await getFieldUnits(auth, { projectId: selectedProjectId, search });
      setUnits(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data unit");
    }
  }, [auth, search, selectedProjectId]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setErrorMessage(null);
    try {
      await loadProjects();
      await loadUnits();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data");
    } finally {
      setIsRefreshing(false);
    }
  }, [loadProjects, loadUnits]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setIsLoading(true);
        try {
          await loadProjects();
          if (!cancelled) await loadUnits();
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadProjects, loadUnits])
  );

  useEffect(() => {
    if (!auth) return;
    void loadUnits();
  }, [auth, loadUnits]);

  const stats = useMemo(() => ({
    total: units.length,
    done: units.filter((u) => u.status === "DONE").length,
    active: units.filter((u) => u.status === "IN_PROGRESS").length,
    pending: units.filter((u) => u.status === "NOT_STARTED").length,
    completionRate: units.length > 0
      ? Math.round((units.filter((u) => u.status === "DONE").length / units.length) * 100)
      : 0,
  }), [units]);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#ffffff" />
        }
      >
        {/* ── IMMERSIVE HERO HEADER ── */}
        <LinearGradient
          colors={[c.primary600, c.primary, c.primaryDark]}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroHeader}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0)"]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents="none"
          />
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            {/* Nav row */}
            <View style={styles.heroTopRow}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              >
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <View style={{ width: 44 }} />
            </View>

            {/* Title block */}
            <View style={{ height: 8 }} />
            <Text style={styles.heroKicker}>MONITORING UNIT</Text>
            <Text style={styles.heroTitle}>
              {selectedProject ? selectedProject.name : "Pilih Proyek"}
            </Text>
          </View>
        </LinearGradient>

        {/* ── OVERLAP CARD: Stats Summary ── */}
        <View style={styles.overlapContainer}>
          <SlideInView direction="up" delay={50} duration={500}>
            <View style={styles.glassCard}>
              {/* Primary stat */}
              <View style={styles.statsMainRow}>
                <View style={styles.statsMainCol}>
                  <Text style={styles.statsMainValue}>{stats.completionRate}%</Text>
                  <Text style={styles.statsMainLabel}>Selesai</Text>
                </View>

                <View style={styles.statsDivider} />

                {/* Secondary stats */}
                <View style={styles.statsSubGroup}>
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
                      <Text style={styles.statsSubLabel}>Berjalan</Text>
                    </View>
                    <Text style={styles.statsSubValue}>{stats.active}</Text>
                  </View>
                  <View style={styles.statsSubItem}>
                    <View style={styles.statsSubItemLeft}>
                      <View style={[styles.statsDot, { backgroundColor: c.neutral300 }]} />
                      <Text style={styles.statsSubLabel}>Menunggu</Text>
                    </View>
                    <Text style={styles.statsSubValue}>{stats.pending}</Text>
                  </View>
                </View>
              </View>

              {/* Completion progress bar */}
              <View style={styles.overallProgressWrap}>
                <View style={styles.overallProgressTrack}>
                  <View style={[styles.overallProgressFill, { width: `${stats.completionRate}%` }]} />
                </View>
                <Text style={styles.overallProgressLabel}>{stats.total} unit total</Text>
              </View>
            </View>
          </SlideInView>
        </View>

        {/* ── FILTER SECTION ── */}
        <View style={styles.filterSection}>
          {/* Project chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipScrollContent}
          >
            {projects.map((project) => (
              <Pressable
                key={project.id}
                onPress={() => {
                  void Haptics.selectionAsync();
                  setSelectedProjectId(project.id);
                }}
                style={[
                  styles.chip,
                  selectedProjectId === project.id && styles.chipActive,
                ]}
              >
                <Text style={[styles.chipText, selectedProjectId === project.id && styles.chipTextActive]}>
                  {project.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Search bar */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={c.neutral400} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari kode atau tipe unit..."
                placeholderTextColor={c.neutral400}
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={() => void loadUnits()}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable
                  onPress={() => { setSearch(""); setTimeout(() => loadUnits(), 100); }}
                  style={styles.clearBtn}
                >
                  <Ionicons name="close-circle" size={18} color={c.neutral300} />
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* ── UNIT LIST ── */}
        <View style={styles.contentPad}>
          {errorMessage ? (
            <StatusBanner message={errorMessage} tone="danger" />
          ) : null}

          <SlideInView direction="up" delay={200} duration={400}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Daftar Unit</Text>
              {!isLoading && (
                <Text style={styles.sectionCount}>{units.length} unit</Text>
              )}
            </View>

            {isLoading ? (
              <SkeletonList count={5} />
            ) : units.length === 0 ? (
              <EmptyState message="Tidak ada unit yang sesuai dengan filter saat ini." />
            ) : (
              <View style={styles.unitList}>
                {units.map((unit, index) => {
                  const isDone = unit.status === "DONE" || unit.progress === 100;
                  const isActive = unit.status === "IN_PROGRESS";
                  const isSiapHuni = unit.status === "Siap Huni";

                  const dotColor = isDone || isSiapHuni
                    ? c.success.text
                    : isActive
                    ? c.warning.text
                    : c.neutral300;

                  const progressColor = isDone || isSiapHuni ? c.success.text : c.accent;

                  const statusLabel = isDone || isSiapHuni
                    ? "Selesai"
                    : isActive
                    ? "Berjalan"
                    : "Menunggu";

                  const statusBg = isDone || isSiapHuni
                    ? c.success.bg
                    : isActive
                    ? c.warning.bg
                    : c.neutral100;

                  const statusTextColor = isDone || isSiapHuni
                    ? c.success.text
                    : isActive
                    ? c.warning.text
                    : c.neutral500;

                  return (
                    <SlideInView key={unit.id} direction="up" delay={Math.min(index * 40, 300)} duration={350}>
                      <Pressable
                        onPress={() => {
                          void Haptics.selectionAsync();
                          navigation.navigate("Beranda", {
                            screen: "FieldMilestones",
                            params: {
                              projectId: selectedProjectId,
                              unitId: unit.id,
                            }
                          });
                        }}
                        style={({ pressed }) => [
                          styles.unitCard,
                          (isDone || isSiapHuni) && styles.unitCardDone,
                          pressed && styles.unitCardPressed,
                        ]}
                      >
                        {/* Left: icon */}
                        <View
                          style={[
                            styles.unitIconWrap,
                            { backgroundColor: isDone || isSiapHuni ? c.success.bg : c.info.bg },
                          ]}
                        >
                          <Ionicons
                            name={isDone || isSiapHuni ? "home" : "construct"}
                            size={20}
                            color={isDone || isSiapHuni ? c.success.text : c.info.text}
                          />
                        </View>

                        {/* Center: info */}
                        <View style={styles.unitCardCenter}>
                          <View style={styles.unitCardTopRow}>
                            <Text style={styles.unitCode} numberOfLines={1}>{unit.code}</Text>
                            {/* Status badge */}
                            <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                              <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                              <Text style={[styles.statusBadgeText, { color: statusTextColor }]}>
                                {statusLabel}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.unitTypeName} numberOfLines={1}>{unit.typeName}</Text>

                          {/* Progress bar */}
                          <View style={styles.progressRow}>
                            <AnimatedProgressBar
                              progress={unit.progress}
                              height={4}
                              color={progressColor}
                              style={{ flex: 1 }}
                            />
                            <Text style={[styles.progressPct, { color: progressColor }]}>
                              {unit.progress}%
                            </Text>
                          </View>
                        </View>

                        {/* Right: chevron */}
                        <Ionicons name="chevron-forward" size={18} color={c.neutral300} />
                      </Pressable>

                      {/* Divider */}
                      {index < units.length - 1 && <View style={styles.divider} />}
                    </SlideInView>
                  );
                })}
              </View>
            )}
          </SlideInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },

  // ── Hero ──
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
    marginBottom: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroKicker: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.8,
    lineHeight: 34,
  },

  // ── Overlap Card ──
  overlapContainer: {
    marginTop: -40,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
    gap: 16,
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
    marginTop: 2,
  },
  statsDivider: {
    width: 1,
    height: 56,
    backgroundColor: c.neutral200,
    marginHorizontal: 24,
  },
  statsSubGroup: {
    flex: 1,
    gap: 10,
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
  statsSubLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
  },
  statsSubValue: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
  },
  overallProgressWrap: {
    gap: 8,
  },
  overallProgressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: c.neutral100,
    overflow: "hidden",
  },
  overallProgressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: c.accent,
  },
  overallProgressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: c.neutral400,
    textAlign: "right",
  },

  // ── Filter ──
  filterSection: {
    paddingTop: 24,
    paddingBottom: 4,
    gap: 12,
  },
  chipScrollContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: c.neutral200,
  },
  chipActive: {
    backgroundColor: c.primary,
    borderColor: c.primary,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral600,
  },
  chipTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  searchRow: {
    paddingHorizontal: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: c.neutral200,
    shadowColor: c.neutral400,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: c.neutral900,
    height: "100%",
  },
  clearBtn: {
    padding: 4,
  },

  // ── Content ──
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -0.5,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral400,
  },

  // ── Unit List ──
  unitList: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  unitCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  unitCardDone: {
    backgroundColor: "#fafffe",
  },
  unitCardPressed: {
    backgroundColor: c.neutral50,
  },
  unitIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  unitCardCenter: {
    flex: 1,
    gap: 4,
  },
  unitCardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  unitCode: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  unitTypeName: {
    fontSize: 13,
    fontWeight: "500",
    color: c.neutral500,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  progressPct: {
    fontSize: 11,
    fontWeight: "800",
    minWidth: 30,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: c.neutral100,
    marginHorizontal: 20,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
