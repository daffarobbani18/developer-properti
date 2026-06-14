import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, Alert } from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FieldStackParamList } from "../../navigation/types";
import { API_URL } from "../../utils/config";

type NavigationProp = NativeStackNavigationProp<FieldStackParamList>;

export function InspectionDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { bookingId, unitName } = route.params;
  const { auth } = useAuth();
  
  const [defects, setDefects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDefects = useCallback(async () => {
    try {
      if (!auth) return;
      const response = await fetch(`${API_URL}/api/legal/defects`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      const resData = await response.json();
      if (response.ok) {
        // Filter by bookingId
        const unitDefects = resData.data.filter((d: any) => d.bookingId === bookingId);
        setDefects(unitDefects);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [auth, bookingId]);

  useFocusEffect(
    useCallback(() => {
      fetchDefects();
    }, [fetchDefects])
  );

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/api/legal/defects/${id}/status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth?.token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchDefects();
      } else {
        Alert.alert("Gagal", "Gagal memperbarui status komplain.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isCompleted = item.status === "Selesai";
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.dateText}>
            {new Date(item.reportedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </Text>
          <View style={[styles.badge, isCompleted ? styles.badgeGreen : styles.badgeRed]}>
            <Text style={[styles.badgeText, isCompleted ? styles.badgeTextGreen : styles.badgeTextRed]}>
              {item.status}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description}>{item.description}</Text>
        
        {item.photoUrl && (
          <Image source={{ uri: `${API_URL}${item.photoUrl}` }} style={styles.photo} />
        )}
        
        {!isCompleted && (
          <TouchableOpacity 
            style={styles.btnSelesai}
            onPress={() => {
              Alert.alert(
                "Konfirmasi", 
                "Apakah perbaikan sudah benar-benar selesai?", 
                [
                  { text: "Batal", style: "cancel" },
                  { text: "Ya, Selesai", onPress: () => handleUpdateStatus(item.id, "Selesai") }
                ]
              );
            }}
          >
            <Text style={styles.btnSelesaiText}>Tandai Selesai Diperbaiki</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>{unitName}</Text>
        <Text style={styles.headerSub}>Riwayat Inspeksi & Defect</Text>
      </View>

      <FlatList
        data={defects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDefects} />}
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>Tidak ada komplain tercatat untuk unit ini.</Text> : null
        }
      />

      {/* FAB - Tambah Komplain */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate("AddDefect", { bookingId })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  headerInfo: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  headerSub: { fontSize: 14, color: "#64748b", marginTop: 2 },
  listContainer: { padding: 16, gap: 16, paddingBottom: 100 },
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
  dateText: { fontSize: 13, color: "#64748b", fontWeight: "600" },
  description: { fontSize: 15, color: "#334155", marginBottom: 12, lineHeight: 22 },
  photo: { width: "100%", height: 180, borderRadius: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeRed: { backgroundColor: "#fee2e2" },
  badgeGreen: { backgroundColor: "#dcfce3" },
  badgeText: { fontSize: 11, fontWeight: "700" },
  badgeTextRed: { color: "#b91c1c" },
  badgeTextGreen: { color: "#15803d" },
  btnSelesai: {
    backgroundColor: "#10b981",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSelesaiText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  emptyText: { textAlign: "center", color: "#94a3b8", marginTop: 40 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f59e0b",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  }
});
