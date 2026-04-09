import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};

type NotificationsScreenProps = {
  auth: AuthState;
};

export function NotificationsScreen({ auth }: NotificationsScreenProps) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const data = await authRequest<NotificationItem[]>(auth, "/notifications");
      setItems(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat notifikasi");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markAllRead() {
    try {
      await authRequest(auth, "/notifications/read-all", {
        method: "PATCH"
      });
      await loadData();
      setMessage("Semua notifikasi ditandai terbaca");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal update notifikasi");
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={markAllRead}>
        <Text style={styles.buttonText}>Mark All as Read</Text>
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.body}</Text>
            <Text style={styles.meta}>{new Date(item.createdAt).toLocaleString("id-ID")}</Text>
            {!item.isRead ? <Text style={styles.badge}>Baru</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f2f7fb"
  },
  button: {
    backgroundColor: "#0d7486",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  message: {
    marginVertical: 8,
    color: "#405a6d"
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e4ef",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  title: {
    fontWeight: "700",
    marginBottom: 4
  },
  meta: {
    color: "#5f7082",
    fontSize: 12,
    marginTop: 5
  },
  badge: {
    marginTop: 4,
    alignSelf: "flex-start",
    backgroundColor: "#ffe8a7",
    color: "#7b5901",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "700"
  }
});
