import React, { useCallback, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

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
import { formatDate, formatMilestoneStatusLabel } from "../../utils/format";

type RouteParams = { unitId: string; unitCode?: string };

function toneByMilestoneStatus(status: Milestone["status"]): "success" | "warning" | "neutral" {
  if (status === "COMPLETED") {
    return "success";
  }
  if (status === "IN_PROGRESS") {
    return "warning";
  }
  return "neutral";
}

export function UnitDetailScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { unitId, unitCode } = route.params as RouteParams;

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMilestones = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      const data = await getUnitMilestones(auth, unitId);
      setMilestones(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat milestone");
    }
  }, [auth, unitId]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        await loadMilestones();
        if (!cancelled) {
          setIsLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadMilestones])
  );

  const handleMilestonePress = useCallback(
    (milestone: Milestone) => {
      (navigation as { navigate: (route: string, params?: object) => void }).navigate("MilestoneUpdate", {
        milestoneId: milestone.id,
        unitId,
      });
    },
    [navigation, unitId]
  );

  const completedCount = milestones.filter((m) => m.status === "COMPLETED").length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <ScreenShell title={unitCode ?? "Detail Unit"} subtitle="Progres pekerjaan konstruksi">
      <Card>
        <SectionTitle title="Progres Keseluruhan" caption="Persentase penyelesaian semua milestone" />
        <View style={styles.progressRow}>
          <Text style={styles.progressPercent}>{progress}%</Text>
          <View style={styles.progressTrackLarge}>
            <View style={[styles.progressFillLarge, { width: `${progress}%` }]} />
          </View>
        </View>
        <Text style={styles.progressMeta}>
          {completedCount} dari {milestones.length} milestone selesai
        </Text>
      </Card>

      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat detail unit...</Text>
        </Card>
      ) : milestones.length === 0 ? (
        <EmptyState message="Belum ada milestone untuk unit ini." />
      ) : (
        <View style={styles.listWrap}>
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <Pressable
                onPress={() => handleMilestonePress(milestone)}
                style={({ pressed }) => [styles.milestoneCard, pressed && styles.milestoneCardPressed]}
              >
                <View style={styles.milestoneHeader}>
                  <Text style={styles.milestoneName}>{milestone.name}</Text>
                  <Badge label={formatMilestoneStatusLabel(milestone.status)} tone={toneByMilestoneStatus(milestone.status)} />
                </View>
                <Text style={styles.milestoneMeta}>Target: {formatDate(milestone.targetDate)}</Text>
                {milestone.actualDate ? (
                  <Text style={styles.milestoneMeta}>Selesai: {formatDate(milestone.actualDate)}</Text>
                ) : null}
                {milestone.note ? <Text style={styles.milestoneNote}>Catatan: {milestone.note}</Text> : null}
                {milestone.photos.length > 0 ? (
                  <View style={styles.photoPreview}>
                    {milestone.photos.slice(0, 3).map((photo) => (
                      <Image key={photo.id} source={{ uri: photo.url }} style={styles.thumbnail} />
                    ))}
                  </View>
                ) : null}
              </Pressable>
            </Card>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <PrimaryButton label="Update Milestone" onPress={() => (navigation as { navigate: (route: string, params?: object) => void }).navigate("MilestoneUpdate", { unitId })} />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    alignItems: "center",
    gap: 10,
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: "800",
    color: "#123d47",
  },
  progressTrackLarge: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#e0ecee",
    overflow: "hidden",
  },
  progressFillLarge: {
    height: "100%",
    backgroundColor: "#1f7f8a",
    borderRadius: 999,
  },
  progressMeta: {
    fontSize: 13,
    color: "#4a6870",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 9,
  },
  milestoneCard: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#f8fcfd",
  },
  milestoneCardPressed: {
    opacity: 0.8,
  },
  milestoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  milestoneName: {
    color: "#123d47",
    fontSize: 15,
    fontWeight: "700",
  },
  milestoneMeta: {
    color: "#4a6870",
    fontSize: 12,
    marginTop: 2,
  },
  milestoneNote: {
    color: "#5d6f77",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  photoPreview: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  buttonContainer: {
    marginTop: 8,
  },
});