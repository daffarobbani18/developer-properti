import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  PrimaryButton,
  ScreenShell,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getUnitMilestones } from "../../services/api";
import { Milestone } from "../../types";
import {
  formatDate,
  formatMilestoneStatusLabel,
  inferBannerTone,
} from "../../utils/format";

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

  return (
    <ScreenShell title="Riwayat Update Milestone" subtitle="Daftar pembaruan yang telah dilakukan">
      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

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

      <PrimaryButton label="Muat Ulang Data" onPress={() => void loadData()} />

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat riwayat update...</Text>
        </Card>
      ) : completedMilestones.length === 0 ? (
        <EmptyState message="Belum ada milestone yang selesai untuk ditampilkan." />
      ) : (
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
});