import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldUnits } from "../../services/api";
import { colors } from "../../theme/colors";
import { Unit } from "../../types";
import { formatUnitStatusLabel } from "../../utils/format";
import type { FieldStackParamList } from "../../navigation/types";

type UnitSelectRouteParams = {
  projectId?: string;
};

function toneByStatus(status: Unit["status"]): "success" | "warning" | "neutral" {
  if (status === "DONE") {
    return "success";
  }
  if (status === "IN_PROGRESS") {
    return "warning";
  }
  return "neutral";
}

export function UnitSelectScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const route = useRoute();
  const projectId = (route.params as UnitSelectRouteParams | undefined)?.projectId ?? null;

  const [search, setSearch] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadUnits = useCallback(async () => {
    if (!auth) {
      return;
    }

    setErrorMessage(null);
    try {
      const data = await getFieldUnits(auth, { projectId: projectId ?? undefined, search });
      setUnits(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data unit");
    }
  }, [auth, projectId, search]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          await loadUnits();
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadUnits])
  );

  useEffect(() => {
    if (auth) {
      void loadUnits();
    }
  }, [auth, loadUnits]);

  const stats = useMemo(() => {
    return {
      total: units.length,
      done: units.filter((item) => item.status === "DONE").length,
      active: units.filter((item) => item.status === "IN_PROGRESS").length,
      pending: units.filter((item) => item.status === "NOT_STARTED").length,
    };
  }, [units]);

  const handleSelectUnit = useCallback(
    (unit: Unit) => {
      navigation.navigate("MilestoneList", {
        unitId: unit.id,
        unitCode: unit.code,
      });
    },
    [navigation]
  );

  const renderUnitItem = useCallback(
    ({ item }: { item: Unit }) => (
      <Card>
        <Pressable
          onPress={() => handleSelectUnit(item)}
          style={({ pressed }) => [styles.unitCard, pressed && styles.unitCardPressed]}
        >
          <View style={styles.rowTop}>
            <Text style={styles.unitCode}>{item.code}</Text>
            <Badge label={formatUnitStatusLabel(item.status)} tone={toneByStatus(item.status)} />
          </View>
          <Text style={styles.unitType}>{item.typeName}</Text>
          <Text style={styles.unitMeta}>Progres: {item.progress}%</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(4, item.progress)}%` }]} />
          </View>
        </Pressable>
      </Card>
    ),
    [handleSelectUnit]
  );

  return (
    <ScreenShell title="Pilih Unit" subtitle={projectId ? `Proyek ${projectId}` : "Semua Proyek"} noScroll>
      <Card>
        <SectionTitle title="Filter Unit" caption="Cari unit berdasarkan kode atau tipe" />
        <LabeledInput
          label="Cari Unit"
          placeholder="Kode unit / tipe"
          value={search}
          onChangeText={setSearch}
        />
        <SecondaryButton label="Muat Ulang" onPress={() => void loadUnits()} />
      </Card>

      <Card>
        <SectionTitle title="Statistik Unit" caption="Ringkasan progres di proyek ini" />
        <View style={styles.statsGrid}>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Total</Text>
            <Text style={styles.metricValue}>{stats.total}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Selesai</Text>
            <Text style={styles.metricValue}>{stats.done}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Aktif</Text>
            <Text style={styles.metricValue}>{stats.active}</Text>
          </View>
        </View>
      </Card>

      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat unit...</Text>
        </Card>
      ) : (
        <FlatList
          data={units}
          keyExtractor={(item) => item.id}
          renderItem={renderUnitItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<EmptyState message="Tidak ada unit di proyek ini." />}
        />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricPill: {
    minWidth: 110,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  metricLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricValue: {
    color: "#184b55",
    fontSize: 18,
    fontWeight: "800",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listContent: {
    gap: 9,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  unitCard: {
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#f8fcfd",
  },
  unitCardPressed: {
    opacity: 0.8,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitCode: {
    color: "#123d47",
    fontSize: 16,
    fontWeight: "800",
  },
  unitType: {
    color: "#2f5d67",
    fontSize: 13,
  },
  unitMeta: {
    color: "#3d6670",
    fontSize: 12,
  },
  progressTrack: {
    marginTop: 2,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#e0ecee",
    overflow: "hidden",
  },
progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
});