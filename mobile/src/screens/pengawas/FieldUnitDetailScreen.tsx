import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { colors } from "../../theme/colors";
import { getFieldUnits, getUnitMilestones } from "../../services/api";
import { Milestone, Unit } from "../../types";
import { formatDate, formatMilestoneStatusLabel, formatUnitStatusLabel, inferBannerTone } from "../../utils/format";

type UnitDetailParams = {
  unitId?: string;
};

export function FieldUnitDetailScreen({ unitId: routeUnitId }: UnitDetailParams): React.JSX.Element {
  const { auth } = useAuth();

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

  return (
    <ScreenShell title="Detail Unit" subtitle={unit ? `${unit.code} • ${unit.typeName}` : ""}>
      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

      <SecondaryButton label="Muat Ulang" onPress={() => void loadData()} />

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat detail unit...</Text>
        </Card>
      ) : !unit ? (
        <EmptyState message="Unit tidak ditemukan." />
      ) : (
        <>
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
        </>
      )}
    </ScreenShell>
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
});