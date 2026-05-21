import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
  SkeletonList,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldAttendanceHistory } from "../../services/api";
import { AttendanceItem } from "../../types";
import { formatAttendanceStatusLabel } from "../../utils/format";

function getStatusTone(status: AttendanceItem["status"]): "success" | "warning" | "neutral" | "danger" {
  switch (status) {
    case "HADIR":
      return "success";
    case "TERLAMBAT":
      return "warning";
    case "IZIN":
      return "neutral";
    case "SAKIT":
      return "warning";
    case "ALPHA":
      return "danger";
  }
}

function getStatusLabel(status: AttendanceItem["status"]): string {
  return formatAttendanceStatusLabel(status);
}

export function AttendanceHistoryScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!auth) {
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await getFieldAttendanceHistory(auth, { month: "", limit: 100 });
      setHistory(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat riwayat absensi");
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      void loadHistory();
    }, [loadHistory])
  );

  const handleReload = useCallback(() => {
    void loadHistory();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [loadHistory]);

  if (isLoading) {
    return (
      <ScreenShell title="Riwayat Absensi" subtitle="Semua data kehadiran">
        <SkeletonList count={5} />
      </ScreenShell>
    );
  }

  if (history.length === 0) {
    return (
      <ScreenShell title="Riwayat Absensi" subtitle="Semua data kehadiran">
        <EmptyState message="Belum ada data riwayat absensi." />
      </ScreenShell>
    );
  }

  const renderItem = ({ item }: { item: AttendanceItem }) => (
    <Card style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Badge label={getStatusLabel(item.status)} tone={getStatusTone(item.status)} />
      </View>
      <View style={styles.historyTimes}>
        {item.checkInTime && (
          <Text style={styles.historyTime}>Masuk: {item.checkInTime}</Text>
        )}
        {item.checkOutTime && (
          <Text style={styles.historyTime}>Pulang: {item.checkOutTime}</Text>
        )}
        {!item.checkInTime && !item.checkOutTime && (
          <Text style={styles.historyTime}>Tidak ada catatan waktu</Text>
        )}
      </View>
      {item.notes && (
        <Text style={styles.historyNotes}>Catatan: {item.notes}</Text>
      )}
    </Card>
  );

  return (
    <ScreenShell title="Riwayat Absensi" subtitle={`Total: ${history.length} data`}>
      {errorMessage ? (
        <StatusBanner message={errorMessage} tone="danger" />
      ) : null}

      <SecondaryButton label="Muat Ulang" onPress={handleReload} disabled={isLoading} />

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 8,
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  historyCard: {
    gap: 6,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyDate: {
    color: "#123d47",
    fontSize: 14,
    fontWeight: "600",
  },
  historyTimes: {
    flexDirection: "row",
    gap: 12,
  },
  historyTime: {
    color: "#4a6f78",
    fontSize: 12,
  },
  historyNotes: {
    color: "#3a5f67",
    fontSize: 12,
    fontStyle: "italic",
  },
});