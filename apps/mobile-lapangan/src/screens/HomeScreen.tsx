import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { authRequest } from "../lib/api";
import { getQueue } from "../lib/storage";
import type { AuthState } from "../types";

type HomeScreenProps = {
  auth: AuthState;
  onLogout: () => Promise<void>;
};

export function HomeScreen({ auth, onLogout }: HomeScreenProps) {
  const [projectCount, setProjectCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    setRefreshing(true);
    try {
      const [projects, queue] = await Promise.all([
        authRequest<Array<unknown>>(auth, "/field/projects"),
        getQueue()
      ]);
      setProjectCount(projects.length);
      setQueueCount(queue.length);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}
    >
      <Text style={styles.title}>Halo, {auth.user.fullName}</Text>
      <Text style={styles.subtitle}>Role: {auth.user.role}</Text>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Proyek Aktif</Text>
        <Text style={styles.statValue}>{projectCount}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>Queue Offline</Text>
        <Text style={styles.statValue}>{queueCount}</Text>
      </View>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Aksi Cepat</Text>
        <Text>1. Buka tab Milestone untuk update progres.</Text>
        <Text>2. Upload foto bukti ke milestone terkait.</Text>
        <Text>3. Laporkan kendala pada tab Kendala.</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: "#f3f8fb"
  },
  title: {
    fontSize: 20,
    fontWeight: "700"
  },
  subtitle: {
    color: "#4f6273"
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d6e4ef",
    padding: 12
  },
  statLabel: {
    color: "#5a7082"
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0c7385"
  },
  note: {
    backgroundColor: "#ecf8fa",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#c9e6ec",
    gap: 4
  },
  noteTitle: {
    fontWeight: "700"
  },
  logoutButton: {
    marginTop: 8,
    backgroundColor: "#1f2f3b",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 11
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700"
  }
});
