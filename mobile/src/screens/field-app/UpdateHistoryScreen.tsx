import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getUnitMilestones } from "../../services/api";
import { Milestone } from "../../types";
import { formatDate, formatMilestoneStatusLabel } from "../../utils/format";

export function UpdateHistoryScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [updates, setUpdates] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      const data = await getUnitMilestones(auth, "unit-1");
      const completed = data.filter((m) => m.status === "COMPLETED" && m.note);
      setUpdates(completed);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat riwayat update");
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        await loadHistory();
        if (!cancelled) {
          setIsLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadHistory])
  );

  return (
    <ScreenShell title="Riwayat Update" subtitle="Catatan pembaruan milestone yang telah diselesaikan">
      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat riwayat update...</Text>
        </Card>
      ) : updates.length === 0 ? (
        <EmptyState message="Belum ada riwayat pembaruan milestone." />
      ) : (
        <View style={styles.listWrap}>
          {updates.map((update) => (
            <Card key={update.id}>
              <View style={styles.updateHeader}>
                <Text style={styles.updateName}>{update.name}</Text>
                <Badge label={formatMilestoneStatusLabel(update.status)} tone="success" />
              </View>
              <Text style={styles.updateMeta}>Unit: MG-A12</Text>
              <Text style={styles.updateMeta}>Selesai: {formatDate(update.actualDate ?? update.targetDate)}</Text>
              {update.note ? <Text style={styles.updateNote}>Catatan: {update.note}</Text> : null}
              {update.photos.length > 0 ? (
                <Text style={styles.updatePhotos}>Foto: {update.photos.length} file</Text>
              ) : null}
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  listWrap: {
    gap: 9,
  },
  updateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  updateName: {
    color: "#123d47",
    fontSize: 15,
    fontWeight: "700",
  },
  updateMeta: {
    color: "#4a6870",
    fontSize: 12,
    marginTop: 2,
  },
  updateNote: {
    color: "#5d6f77",
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  updatePhotos: {
    color: "#3d6670",
    fontSize: 12,
    marginTop: 4,
  },
});