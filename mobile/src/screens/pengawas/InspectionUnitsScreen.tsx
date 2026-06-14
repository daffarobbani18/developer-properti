import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FieldStackParamList } from "../../navigation/types";
import { API_URL } from "../../utils/config";

type NavigationProp = NativeStackNavigationProp<FieldStackParamList>;

export function InspectionUnitsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { auth } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnits = useCallback(async () => {
    try {
      if (!auth) return;
      const response = await fetch(`${API_URL}/api/legal/bookings`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const resData = await response.json();
      if (response.ok) {
        // Filter: Siap Huni OR progress == 100
        const siapInspeksi = resData.data.filter((b: any) => b.unit.progress === 100 || b.unit.statusPembangunan === "Siap Huni");
        setBookings(siapInspeksi);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      fetchUnits();
    }, [fetchUnits])
  );

  const renderItem = ({ item }: { item: any }) => {
    const activeDefects = item.defects?.filter((d: any) => d.status !== "Selesai").length || 0;
    const hasDefect = activeDefects > 0;

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate("InspectionDetail", { bookingId: item.id, unitName: `Blok ${item.unit.blok} No. ${item.unit.nomor}` })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.unitName}>Blok {item.unit.blok} No. {item.unit.nomor}</Text>
          <View style={[styles.badge, hasDefect ? styles.badgeRed : styles.badgeGreen]}>
            <Text style={[styles.badgeText, hasDefect ? styles.badgeTextRed : styles.badgeTextGreen]}>
              {hasDefect ? `⚠ Ada ${activeDefects} Cacat` : "✅ Siap BAST"}
            </Text>
          </View>
        </View>
        <Text style={styles.customerName}>Konsumen: {item.lead.name}</Text>
        <Text style={styles.progressText}>Progres: {item.unit.progress}% ({item.unit.statusPembangunan})</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchUnits} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada unit siap inspeksi.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  listContainer: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  unitName: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  customerName: { fontSize: 14, color: "#475569", marginBottom: 4 },
  progressText: { fontSize: 12, color: "#64748b" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeRed: { backgroundColor: "#fee2e2" },
  badgeGreen: { backgroundColor: "#dcfce3" },
  badgeText: { fontSize: 11, fontWeight: "700" },
  badgeTextRed: { color: "#b91c1c" },
  badgeTextGreen: { color: "#15803d" },
  emptyText: { textAlign: "center", color: "#94a3b8", marginTop: 40 },
});
