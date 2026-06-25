const fs = require('fs');

const file = 'src/screens/pengawas/InspectionDetailScreen.tsx';

const newContent = `import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert, ScrollView, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

import { useAuth } from "../../hooks/useAuth";
import type { FieldStackParamList } from "../../navigation/types";
import { getInspectionDefects, updateDefectStatus } from "../../services/api";
import {
  Badge,
  EmptyState,
  SkeletonList,
  StatusBanner,
  SlideInView,
  PrimaryButton,
} from "../../components/ui";
import { API_URL as API_BASE_URL } from "../../utils/config";
import { formatDateTime, inferBannerTone } from "../../utils/format";
import { c } from "../../theme/colors";

type NavigationProp = NativeStackNavigationProp<FieldStackParamList>;

export function InspectionDetailScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { bookingId, unitName } = route.params;
  const { auth } = useAuth();
  
  const [defects, setDefects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) return;

    try {
      const unitDefects = await getInspectionDefects(auth, bookingId);
      setDefects(unitDefects);
    } catch (error) {
      throw error;
    }
  }, [auth, bookingId]);

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
            setErrorMessage(error instanceof Error ? error.message : "Gagal memuat riwayat komplain");
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();

      return () => { cancelled = true; };
    }, [loadData])
  );

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!auth) return;

    try {
      await updateDefectStatus(auth, id, newStatus);
      await loadData();
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert("Gagal", error instanceof Error ? error.message : "Gagal memperbarui status komplain");
    }
  };

  const activeDefectsCount = defects.filter(d => d.status !== "Selesai").length;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={[c.primaryDark, "#020617"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
          <View style={styles.heroTopRow}>
            <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </Pressable>
            <Text style={styles.heroHeaderTitle}>Detail Inspeksi</Text>
            <Pressable 
              onPress={() => {
                void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate("AddDefect", { bookingId });
              }}
              style={({ pressed }) => [styles.iconBtnAction, pressed && styles.pressed]}
            >
              <Ionicons name="add" size={24} color="#ffffff" />
            </Pressable>
          </View>

          <View style={styles.heroCenter}>
             <Text style={styles.unitNameTitle}>{unitName}</Text>
             {isLoading ? null : (
                <View style={[styles.heroStatusPill, { backgroundColor: activeDefectsCount > 0 ? c.danger.bg : c.success.bg }]}>
                   <Ionicons name={activeDefectsCount > 0 ? "alert-circle" : "checkmark-circle"} size={16} color={activeDefectsCount > 0 ? c.danger.text : c.success.text} />
                   <Text style={[styles.heroStatusText, { color: activeDefectsCount > 0 ? c.danger.text : c.success.text }]}>
                      {activeDefectsCount > 0 ? \`\${activeDefectsCount} Defect Aktif\` : "Siap BAST"}
                   </Text>
                </View>
             )}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        <View style={styles.contentPad}>
           {errorMessage && <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />}

           <SlideInView direction="up" delay={50} duration={400} style={{ marginTop: errorMessage ? 16 : 0 }}>
             <Text style={styles.sectionTitle}>Riwayat Defect</Text>

             {isLoading ? (
                <SkeletonList count={3} />
              ) : defects.length === 0 ? (
                <View style={styles.emptyWrap}>
                   <Ionicons name="shield-checkmark-outline" size={64} color={c.success.text} style={{ opacity: 0.8, marginBottom: 16 }} />
                   <Text style={styles.emptyTitle}>Unit Sempurna</Text>
                   <Text style={styles.emptyDesc}>Tidak ada komplain atau defect yang dilaporkan. Unit siap untuk diserahterimakan.</Text>
                </View>
              ) : (
                <View style={styles.defectList}>
                  {defects.map((item, index) => {
                    const isCompleted = item.status === "Selesai";

                    return (
                      <SlideInView key={item.id} direction="up" delay={100 + index * 50} duration={350}>
                        <View style={styles.defectItem}>
                          <View style={styles.defectHeader}>
                            <View style={styles.defectDateWrap}>
                               <Ionicons name="calendar-outline" size={14} color={c.neutral500} />
                               <Text style={styles.dateText}>{formatDateTime(item.reportedAt)}</Text>
                            </View>
                            <Badge label={item.status} tone={isCompleted ? "success" : "danger"} />
                          </View>
                          
                          <Text style={styles.description}>{item.description}</Text>
                          
                          {item.photoUrl && (
                            <Image 
                              source={{ uri: \`\${API_BASE_URL}\${item.photoUrl}\` }} 
                              style={styles.photo} 
                              resizeMode="cover" 
                            />
                          )}
                          
                          {!isCompleted && (
                            <Pressable 
                               style={({pressed}) => [styles.resolveBtn, pressed && styles.pressed]}
                               onPress={() => {
                                 void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                 Alert.alert(
                                   "Konfirmasi Perbaikan",
                                   "Apakah perbaikan unit sudah benar-benar selesai dilakukan di lapangan?",
                                   [
                                     { text: "Batal", style: "cancel" },
                                     { text: "Ya, Selesai", style: "destructive", onPress: () => void handleUpdateStatus(item.id, "Selesai") }
                                   ]
                                 );
                               }}
                            >
                               <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                               <Text style={styles.resolveBtnText}>Tandai Selesai</Text>
                            </Pressable>
                          )}
                        </View>
                      </SlideInView>
                    );
                  })}
                </View>
              )}
           </SlideInView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  heroHeader: {
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroSafeArea: {
    paddingTop: Platform.OS === 'android' ? 20 : 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnAction: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  heroHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  heroCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  unitNameTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    marginBottom: 12,
  },
  heroStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  heroStatusText: {
    fontSize: 14,
    fontWeight: "800",
  },
  contentPad: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 16,
  },
  defectList: {
    gap: 16,
  },
  defectItem: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: c.neutral200,
  },
  defectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  defectDateWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: c.neutral500,
    fontWeight: "600",
  },
  description: {
    fontSize: 16,
    color: c.neutral900,
    marginBottom: 16,
    lineHeight: 24,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: c.neutral100,
  },
  resolveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.primary,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  resolveBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: c.neutral200,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: c.neutral500,
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('InspectionDetailScreen fully redesigned.');
