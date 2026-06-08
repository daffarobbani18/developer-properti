import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, Dimensions, ScrollView, TextInput } from "react-native";
import { useFocusEffect, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import type { PengawasStackParamList } from "../../navigation/types";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
  SkeletonList,
  SlideInView,
  AnimatedProgressBar,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldUnits, getProjectOptions } from "../../services/api";
import { ProjectSummary, Unit } from "../../types";
import { formatUnitStatusLabel } from "../../utils/format";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function toneByStatus(status: Unit["status"]): "success" | "warning" | "neutral" {
  if (status === "DONE") {
    return "success";
  }
  if (status === "IN_PROGRESS") {
    return "warning";
  }
  return "neutral";
}

export function FieldUnitsScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<PengawasStackParamList>>();
  const route = useRoute<RouteProp<PengawasStackParamList, "FieldUnits">>();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(route.params?.projectId);
  const [search, setSearch] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!auth) {
      return;
    }

    const data = await getProjectOptions(auth);
    setProjects(data);
    if (!selectedProjectId && data[0]) {
      setSelectedProjectId(data[0].id);
    }
  }, [auth, selectedProjectId]);

  const loadUnits = useCallback(async () => {
    if (!auth) {
      return;
    }

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
          if (!cancelled) {
            await loadUnits();
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadProjects, loadUnits])
  );

  useEffect(() => {
    if (!auth) {
      return;
    }
    void loadUnits();
  }, [auth, loadUnits]);

  const stats = useMemo(() => {
    return {
      total: units.length,
      done: units.filter((item) => item.status === "DONE").length,
      active: units.filter((item) => item.status === "IN_PROGRESS").length,
      pending: units.filter((item) => item.status === "NOT_STARTED").length,
      completionRate:
        units.length > 0
          ? Math.round((units.filter((item) => item.status === "DONE").length / units.length) * 100)
          : 0,
    };
  }, [units]);

  return (
    <ScreenShell
      title="Monitoring Unit"
      subtitle="Filter unit berdasarkan proyek dan progres"
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
    >
      <SlideInView direction="up" delay={50} duration={400}>
        <View style={styles.minimalFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectScroll} contentContainerStyle={styles.projectScrollContent}>
            {projects.map((project) => (
              <Pressable
                key={project.id}
                onPress={() => setSelectedProjectId(project.id)}
                style={({ pressed }) => [
                  styles.minimalPill,
                  selectedProjectId === project.id && styles.minimalPillActive,
                  pressed && styles.choicePressed,
                ]}
              >
                <Text style={[styles.minimalPillText, selectedProjectId === project.id && styles.minimalPillTextActive]}>
                  {project.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari kode unit atau tipe..."
                placeholderTextColor="#94a3b8"
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={() => void loadUnits()}
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable onPress={() => { setSearch(""); setTimeout(() => loadUnits(), 100); }} style={styles.clearIcon}>
                  <Ionicons name="close-circle" size={18} color="#cbd5e1" />
                </Pressable>
              )}
            </View>
            <Pressable 
              onPress={() => void loadUnits()} 
              style={({ pressed }) => [
                styles.searchButton, 
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
              ]}
            >
              <Ionicons name="options" size={20} color="#ffffff" />
            </Pressable>
          </View>
        </View>
      </SlideInView>

      <SlideInView direction="up" delay={150} duration={400}>
        <SectionTitle title="Statistik Progres" caption="Ringkasan unit pada proyek terpilih" />
        <View style={styles.statsGrid}>
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: "#3b82f6", shadowColor: "#3b82f6", shadowOpacity: 0.5, shadowRadius: 6, elevation: 6 }]}>
              <Ionicons name="business" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Total Unit</Text>
              <Text style={styles.metricValue}>{stats.total}</Text>
            </View>
          </View>
          
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: "#10b981", shadowColor: "#10b981", shadowOpacity: 0.5, shadowRadius: 6, elevation: 6 }]}>
              <Ionicons name="checkmark-circle" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Selesai</Text>
              <Text style={styles.metricValue}>{stats.done}</Text>
            </View>
          </View>
          
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: "#f59e0b", shadowColor: "#f59e0b", shadowOpacity: 0.5, shadowRadius: 6, elevation: 6 }]}>
              <Ionicons name="sync" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Berjalan</Text>
              <Text style={styles.metricValue}>{stats.active}</Text>
            </View>
          </View>
          
          <View style={styles.metricCard}>
            <View style={[styles.iconBox, { backgroundColor: "#8b5cf6", shadowColor: "#8b5cf6", shadowOpacity: 0.5, shadowRadius: 6, elevation: 6 }]}>
              <Ionicons name="pie-chart" size={18} color="#ffffff" />
            </View>
            <View>
              <Text style={styles.metricLabel}>Penyelesaian</Text>
              <Text style={styles.metricValue}>{stats.completionRate}%</Text>
            </View>
          </View>
        </View>
      </SlideInView>

      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      <SlideInView direction="up" delay={250} duration={400}>
        <SectionTitle title="Daftar Unit" caption="Pilih unit untuk update milestone" />
        {isLoading ? (
          <SkeletonList count={4} />
        ) : units.length === 0 ? (
          <EmptyState message="Tidak ada unit yang sesuai dengan filter pencarian saat ini." />
        ) : (
          <View style={styles.listWrapGrid}>
            {units.map((unit) => {
              const isSiapHuni = unit.status === "Siap Huni";
              const isDone = unit.status === "DONE" || unit.progress === 100;
              const unitIconBgColor = isSiapHuni || isDone ? "#10b981" : "#0ea5e9";
              const iconName = isSiapHuni || isDone ? "home" : "construct";
              
              return (
                <Pressable
                  key={unit.id}
                  onPress={() => navigation.navigate("FieldMilestones", { projectId: selectedProjectId, unitId: unit.id })}
                  style={({ pressed }) => [
                    styles.unitGridCard,
                    isSiapHuni && styles.unitGridCardSiapHuni,
                    pressed && styles.unitGridCardPressed
                  ]}
                >
                  <View style={styles.unitGridHeader}>
                    <View style={[styles.iconBoxSmall, { backgroundColor: unitIconBgColor, shadowColor: unitIconBgColor, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 }]}>
                      <Ionicons name={iconName} size={16} color="#ffffff" />
                    </View>
                    <View style={[styles.statusDot, { backgroundColor: isSiapHuni ? "#10b981" : toneByStatus(unit.status) === "warning" ? "#f59e0b" : "#94a3b8" }]} />
                  </View>
                  
                  <View style={styles.unitGridBody}>
                    <Text style={styles.unitCode} numberOfLines={1}>{unit.code}</Text>
                    <Text style={styles.unitType} numberOfLines={1}>{unit.typeName}</Text>
                  </View>
                  
                  <View style={styles.unitGridFooter}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progres</Text>
                      <Text style={styles.progressPercentage}>{unit.progress}%</Text>
                    </View>
                    <AnimatedProgressBar 
                      progress={unit.progress} 
                      height={4} 
                      color={isSiapHuni ? "#10b981" : "#f59e0b"} 
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </SlideInView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  minimalFilterContainer: {
    marginBottom: 16,
    gap: 12,
  },
  projectScroll: {
    marginHorizontal: -16, // negative margin to allow scroll bleeding
  },
  projectScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  minimalPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  minimalPillActive: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  minimalPillText: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "600",
  },
  minimalPillTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  choicePressed: {
    opacity: 0.8,
  },
  searchRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#0f172a",
    marginLeft: 8,
  },
  clearIcon: {
    padding: 4,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  metricCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f8fafc",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricValue: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  listWrapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  unitGridCard: {
    width: (SCREEN_WIDTH - 44) / 2, // 16 padding each side, 12 gap
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#94a3b8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  unitGridCardSiapHuni: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  unitGridCardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: "#f8fafc",
  },
  unitGridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  iconBoxSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  unitGridBody: {
    marginBottom: 12,
  },
  unitCode: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 2,
  },
  unitType: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "500",
  },
  unitGridFooter: {
    backgroundColor: "#f8fafc",
    padding: 8,
    borderRadius: 10,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: "800",
    color: "#d97706",
  },
});
