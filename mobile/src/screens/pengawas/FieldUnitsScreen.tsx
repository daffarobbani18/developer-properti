import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  ScreenShell,
  SectionTitle,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldUnits, getProjectOptions } from "../../services/api";
import { Unit } from "../../types";

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

  const [projects, setProjects] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    };
  }, [units]);

  return (
    <ScreenShell title="Monitoring Unit" subtitle="Filter unit berdasarkan proyek dan progres">
      <Card>
        <SectionTitle title="Filter" />
        <View style={styles.filterWrap}>
          <View style={styles.choiceWrap}>
            {projects.map((project) => (
              <Pressable
                key={project.id}
                onPress={() => setSelectedProjectId(project.id)}
                style={({ pressed }) => [
                  styles.choicePill,
                  selectedProjectId === project.id && styles.choicePillActive,
                  pressed && styles.choicePressed,
                ]}
              >
                <Text style={[styles.choiceText, selectedProjectId === project.id && styles.choiceTextActive]}>
                  {project.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <LabeledInput
            label="Cari Unit"
            placeholder="Kode unit / tipe"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </Card>

      <Card>
        <SectionTitle title="Statistik Unit" />
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Total: {stats.total}</Text>
          <Text style={styles.statsText}>Selesai: {stats.done}</Text>
          <Text style={styles.statsText}>Proses: {stats.active}</Text>
          <Text style={styles.statsText}>Belum mulai: {stats.pending}</Text>
        </View>
      </Card>

      {errorMessage ? (
        <Card>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat unit...</Text>
        </Card>
      ) : units.length === 0 ? (
        <EmptyState message="Tidak ada unit sesuai filter." />
      ) : (
        <View style={styles.listWrap}>
          {units.map((unit) => (
            <Card key={unit.id}>
              <View style={styles.rowTop}>
                <Text style={styles.unitCode}>{unit.code}</Text>
                <Badge label={unit.status} tone={toneByStatus(unit.status)} />
              </View>
              <Text style={styles.unitType}>{unit.typeName}</Text>
              <Text style={styles.unitMeta}>Progres konstruksi: {unit.progress}%</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${Math.max(4, unit.progress)}%` }]} />
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  filterWrap: {
    gap: 8,
  },
  choiceWrap: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  choicePill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#97bbc0",
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: "#f8fcfc",
  },
  choicePillActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#ddf2f4",
  },
  choicePressed: {
    opacity: 0.8,
  },
  choiceText: {
    color: "#36606a",
    fontSize: 13,
    fontWeight: "600",
  },
  choiceTextActive: {
    color: "#134d57",
    fontWeight: "800",
  },
  statsRow: {
    gap: 4,
  },
  statsText: {
    color: "#2f5963",
    fontSize: 13,
    fontWeight: "700",
  },
  errorText: {
    color: "#a41f26",
    fontWeight: "700",
    fontSize: 13,
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 9,
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
    backgroundColor: "#1f7f8a",
    borderRadius: 999,
  },
});
