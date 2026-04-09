import { useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type HomeScreenProps = {
  auth: AuthState;
  onLogout: () => Promise<void>;
};

export function HomeScreen({ auth, onLogout }: HomeScreenProps) {
  const [overview, setOverview] = useState<{
    unit?: { code: string; progress: number; status: string } | null;
    nextInvoice?: { amount: number; dueDate: string } | null;
    unreadNotifications: number;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    setRefreshing(true);
    try {
      const data = await authRequest<{
        unit?: { code: string; progress: number; status: string } | null;
        nextInvoice?: { amount: number; dueDate: string } | null;
        unreadNotifications: number;
      }>(auth, "/portal/overview");
      setOverview(data);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} />}>
      <Text style={styles.title}>Halo, {auth.user.fullName}</Text>
      <Text style={styles.subtitle}>Selamat datang di portal customer</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Unit</Text>
        <Text style={styles.value}>{overview?.unit?.code ?? "-"}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Progress Konstruksi</Text>
        <Text style={styles.value}>{overview?.unit?.progress ?? 0}%</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Tagihan Terdekat</Text>
        <Text style={styles.value}>
          {overview?.nextInvoice ? `Rp${overview.nextInvoice.amount.toLocaleString("id-ID")}` : "Tidak ada"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Notifikasi Baru</Text>
        <Text style={styles.value}>{overview?.unreadNotifications ?? 0}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    gap: 10,
    backgroundColor: "#f4fbf9"
  },
  title: {
    fontSize: 20,
    fontWeight: "700"
  },
  subtitle: {
    color: "#56706d"
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6ebe7",
    borderRadius: 12,
    padding: 12
  },
  label: {
    color: "#55706d"
  },
  value: {
    marginTop: 2,
    fontWeight: "700",
    fontSize: 20,
    color: "#0d766f"
  },
  logoutButton: {
    marginTop: 6,
    backgroundColor: "#203836",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 11
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700"
  }
});
