import React, { useCallback, useMemo, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Badge, Card, EmptyState, ScreenShell, SectionTitle } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerProgressData } from "../../services/api";
import { Milestone } from "../../types";
import { formatDate } from "../../utils/format";

function toneByStatus(status: Milestone["status"]): "neutral" | "warning" | "success" {
  if (status === "COMPLETED") {
    return "success";
  }
  if (status === "IN_PROGRESS") {
    return "warning";
  }
  return "neutral";
}

export function CustomerProgressScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const data = await getCustomerProgressData(auth);
    setMilestones(data);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          await loadData();
        } catch (error) {
          if (!cancelled) {
            setErrorMessage(error instanceof Error ? error.message : "Gagal memuat progres");
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
    }, [loadData])
  );

  const stats = useMemo(() => {
    const total = milestones.length;
    const done = milestones.filter((item) => item.status === "COMPLETED").length;
    const active = milestones.filter((item) => item.status === "IN_PROGRESS").length;
    return { total, done, active };
  }, [milestones]);

  return (
    <ScreenShell title="Progres Unit" subtitle="Pantau milestone pembangunan dan foto terbaru">
      <Card>
        <SectionTitle title="Ringkasan" />
        <Text style={styles.summaryText}>Total milestone: {stats.total}</Text>
        <Text style={styles.summaryText}>Selesai: {stats.done}</Text>
        <Text style={styles.summaryText}>Sedang berjalan: {stats.active}</Text>
      </Card>

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat data progres...</Text>
        </Card>
      ) : errorMessage ? (
        <Card>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : milestones.length === 0 ? (
        <EmptyState message="Belum ada data milestone untuk unit Anda." />
      ) : (
        <View style={styles.listWrap}>
          {milestones.map((item) => (
            <Card key={item.id}>
              <View style={styles.rowTop}>
                <Text style={styles.title}>{item.orderNo}. {item.name}</Text>
                <Badge label={item.status} tone={toneByStatus(item.status)} />
              </View>
              <Text style={styles.meta}>Target: {formatDate(item.targetDate)}</Text>
              <Text style={styles.meta}>Aktual: {item.actualDate ? formatDate(item.actualDate) : "-"}</Text>
              {item.note ? <Text style={styles.note}>Catatan: {item.note}</Text> : null}

              <SectionTitle title="Foto Progress" />
              {item.photos.length === 0 ? (
                <Text style={styles.meta}>Belum ada foto</Text>
              ) : (
                <View style={styles.photoList}>
                  {item.photos.map((photo) => (
                    <Pressable
                      key={photo.id}
                      onPress={() => {
                        void Linking.openURL(photo.url);
                      }}
                      style={({ pressed }) => [styles.photoLink, pressed && styles.photoLinkPressed]}
                    >
                      <Text style={styles.photoLabel}>{photo.caption}</Text>
                      <Text style={styles.photoUrl}>{photo.url}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    color: "#2f5a64",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  errorText: {
    color: "#a41f26",
    fontSize: 13,
    fontWeight: "700",
  },
  listWrap: {
    gap: 10,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    color: "#123d47",
    fontSize: 15,
    fontWeight: "800",
  },
  meta: {
    color: "#4a6870",
    fontSize: 12,
  },
  note: {
    color: "#2a555f",
    fontSize: 13,
    fontWeight: "600",
  },
  photoList: {
    gap: 8,
  },
  photoLink: {
    borderWidth: 1,
    borderColor: "#c0d7db",
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#f7fcfd",
  },
  photoLinkPressed: {
    opacity: 0.8,
  },
  photoLabel: {
    color: "#184753",
    fontSize: 12,
    fontWeight: "800",
  },
  photoUrl: {
    color: "#37626b",
    fontSize: 12,
    marginTop: 2,
  },
});
