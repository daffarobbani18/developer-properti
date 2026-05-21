import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRoute } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  OfflineBanner,
  ScreenShell,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getUnitMilestones } from "../../services/api";
import { Milestone } from "../../types";
import { formatDate, formatMilestoneStatusLabel } from "../../utils/format";

type MilestoneListRouteParams = {
  unitId?: string;
};

export function MilestoneListScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const route = useRoute();
  const { unitId } = (route.params ?? {}) as MilestoneListRouteParams;

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMilestones = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      const data = await getUnitMilestones(auth, unitId ?? "unit-1");
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

  const completedCount = milestones.filter((m) => m.status === "COMPLETED").length;
  const progress = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <ScreenShell title="Daftar Milestone" subtitle="Riwayat pembaruan progres pekerjaan">
      <Card>
        <SectionTitle title="Progress Keseluruhan" caption="Persentase penyelesaian milestone" />
        <View style={styles.progressRow}>
          <Text style={styles.progressPercent}>{progress}%</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>
      </Card>

      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat milestone...</Text>
        </Card>
      ) : milestones.length === 0 ? (
        <EmptyState message="Belum ada milestone untuk ditampilkan." />
      ) : (
        <View style={styles.listWrap}>
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <View style={styles.milestoneHeader}>
                <Text style={styles.milestoneName}>{milestone.name}</Text>
                <Badge label={formatMilestoneStatusLabel(milestone.status)} tone="success" />
              </View>
              <Text style={styles.milestoneMeta}>Target: {formatDate(milestone.targetDate)}</Text>
              {milestone.actualDate ? (
                <Text style={styles.milestoneMeta}>Selesai: {formatDate(milestone.actualDate)}</Text>
              ) : null}
              {milestone.note ? <Text style={styles.milestoneNote}>Catatan: {milestone.note}</Text> : null}
              
              {milestone.checklistTotal > 0 && (
                <View style={styles.checklistSection}>
                  <View style={styles.checklistHeader}>
                    <Text style={styles.checklistTitle}>Checklist Pekerjaan</Text>
                    <Text style={styles.checklistProgress}>
                      {milestone.checklistCompleted}/{milestone.checklistTotal} selesai
                    </Text>
                  </View>
                  <View style={styles.checklistTrack}>
                    <View 
                      style={[
                        styles.checklistFill, 
                        { width: `${(milestone.checklistCompleted / milestone.checklistTotal) * 100}%` }
                      ]} 
                    />
                  </View>
                  <View style={styles.checklistItems}>
                    {milestone.checklist.slice(0, 3).map((item) => (
                      <View key={item.id} style={styles.checklistItem}>
                        <View style={[styles.checkbox, item.isCompleted && styles.checkboxChecked]}>
                          {item.isCompleted && <Text style={styles.checkboxMark}>✓</Text>}
                        </View>
                        <Text style={[styles.checklistItemText, item.isCompleted && styles.checklistItemDone]}>
                          {item.name}
                        </Text>
                      </View>
                    ))}
                    {milestone.checklist.length > 3 && (
                      <Text style={styles.checklistMore}>
                        +{milestone.checklist.length - 3} item lainnya
                      </Text>
                    )}
                  </View>
                </View>
              )}
              
              <Text style={styles.milestonePhotos}>Foto: {milestone.photos.length} file</Text>
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  progressRow: {
    alignItems: "center",
    gap: 10,
  },
  progressPercent: {
    fontSize: 28,
    fontWeight: "800",
    color: "#123d47",
  },
  progressTrack: {
    width: "100%",
    height: 12,
    borderRadius: 999,
    backgroundColor: "#e0ecee",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1f7f8a",
    borderRadius: 999,
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  listWrap: {
    gap: 9,
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
  milestonePhotos: {
    color: "#3d6670",
    fontSize: 12,
    marginTop: 8,
  },
  checklistSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5ecee",
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3a5f67",
  },
  checklistProgress: {
    fontSize: 12,
    color: "#547078",
  },
  checklistTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e0ecee",
    marginBottom: 8,
  },
  checklistFill: {
    height: "100%",
    backgroundColor: "#1f7f8a",
    borderRadius: 999,
  },
  checklistItems: {
    gap: 4,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#97bbc0",
    backgroundColor: "#f8fcfc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1f7f8a",
    borderColor: "#1f7f8a",
  },
  checkboxMark: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "800",
  },
  checklistItemText: {
    fontSize: 12,
    color: "#4a6f78",
  },
  checklistItemDone: {
    textDecorationLine: "line-through",
    color: "#7a949e",
  },
  checklistMore: {
    fontSize: 11,
    color: "#547078",
    fontStyle: "italic",
    marginTop: 2,
  },
});