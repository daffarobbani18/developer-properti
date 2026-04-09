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
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getRoleNotifications, markNotificationsAsRead } from "../../services/api";
import { NotificationItem } from "../../types";
import { formatDateTime } from "../../utils/format";

export function FieldNotificationsScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const data = await getRoleNotifications(auth);
    setNotifications(data);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setBanner(null);
        try {
          await loadData();
        } catch (error) {
          if (!cancelled) {
            setBanner(error instanceof Error ? error.message : "Gagal memuat notifikasi");
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

  const markAllRead = useCallback(async () => {
    if (!auth) {
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      const result = await markNotificationsAsRead(auth);
      setNotifications(result);
      setBanner("Semua notifikasi ditandai sudah dibaca.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal menandai notifikasi");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <ScreenShell title="Notifikasi" subtitle="Ringkasan pengingat dan update lapangan">
      <Card>
        <SectionTitle title="Status Notifikasi" />
        <View style={styles.topRow}>
          <Text style={styles.topInfo}>Total: {notifications.length}</Text>
          <Text style={styles.topInfo}>Belum dibaca: {unreadCount}</Text>
        </View>
        <PrimaryButton
          label={isSubmitting ? "Memproses..." : "Tandai Semua Dibaca"}
          onPress={() => void markAllRead()}
          disabled={unreadCount === 0 || isSubmitting}
        />
      </Card>

      {banner ? (
        <Card>
          <Text style={styles.bannerText}>{banner}</Text>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat notifikasi...</Text>
        </Card>
      ) : notifications.length === 0 ? (
        <EmptyState message="Belum ada notifikasi saat ini." />
      ) : (
        <View style={styles.listWrap}>
          {notifications.map((item) => (
            <Card key={item.id} style={!item.isRead ? styles.unreadCard : undefined}>
              <View style={styles.itemTopRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Badge label={item.isRead ? "Dibaca" : "Baru"} tone={item.isRead ? "neutral" : "warning"} />
              </View>
              <Text style={styles.itemBody}>{item.body}</Text>
              <Text style={styles.itemDate}>{formatDateTime(item.createdAt)}</Text>
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    gap: 3,
  },
  topInfo: {
    color: "#315b64",
    fontSize: 13,
    fontWeight: "700",
  },
  bannerText: {
    color: "#1f5661",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 9,
  },
  unreadCard: {
    borderColor: "#8bb6bc",
    backgroundColor: "#f4fbfc",
  },
  itemTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  itemTitle: {
    flex: 1,
    color: "#143f49",
    fontSize: 15,
    fontWeight: "800",
  },
  itemBody: {
    color: "#335e67",
    fontSize: 13,
    lineHeight: 18,
  },
  itemDate: {
    color: "#5a7980",
    fontSize: 12,
  },
});
