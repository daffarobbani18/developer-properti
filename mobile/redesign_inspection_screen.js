const fs = require('fs');

const file = 'src/screens/pengawas/InspectionUnitsScreen.tsx';

const newContent = `import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "../../hooks/useAuth";
import type { FieldStackParamList } from "../../navigation/types";
import { getInspectionBookings } from "../../services/api";
import {
  EmptyState,
  SkeletonList,
  StatusBanner,
  SlideInView,
} from "../../components/ui";
import { inferBannerTone } from "../../utils/format";
import { c } from "../../theme/colors";

type NavigationProp = NativeStackNavigationProp<FieldStackParamList>;

export function InspectionUnitsScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const { auth } = useAuth();
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) return;

    try {
      const data = await getInspectionBookings(auth);
      // Filter: Siap Huni OR progress == 100
      const siapInspeksi = data.filter(
        (b: any) => b.unit.progress === 100 || b.unit.statusPembangunan === "Siap Huni"
      );
      setBookings(siapInspeksi);
    } catch (error) {
      throw error;
    }
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
            setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data inspeksi");
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();

      return () => { cancelled = true; };
    }, [loadData])
  );

  const stats = {
    total: bookings.length,
    withDefects: bookings.filter((b) => {
      const activeDefects = b.defects?.filter((d: any) => d.status !== "Selesai").length || 0;
      return activeDefects > 0;
    }).length,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* FIELD TASK HEADER */}
        <LinearGradient colors={[c.primaryDark, "#020617"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text style={styles.heroHeaderTitle}>Inspeksi & BAST</Text>
              <View style={{ width: 44 }} />
            </View>
            
            <View style={styles.heroStatsRow}>
               <View style={styles.heroStatItem}>
                 <Text style={styles.heroStatValue}>{stats.total}</Text>
                 <Text style={styles.heroStatLabel}>Antrean Inspeksi</Text>
               </View>
               <View style={styles.heroStatDivider} />
               <View style={styles.heroStatItem}>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                   <Text style={[styles.heroStatValue, { color: stats.withDefects > 0 ? c.danger.text : c.success.text }]}>{stats.withDefects}</Text>
                   {stats.withDefects > 0 && <Ionicons name="warning" size={16} color={c.danger.text} />}
                 </View>
                 <Text style={styles.heroStatLabel}>Mengandung Cacat</Text>
               </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.contentPad}>
          {errorMessage && (
            <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
          )}

          <SlideInView direction="up" delay={50} duration={400} style={{ marginTop: errorMessage ? 16 : 0 }}>
             <View style={styles.sectionHeaderRow}>
               <Text style={styles.sectionTitle}>Daftar Unit Siap</Text>
             </View>

             {isLoading ? (
                <SkeletonList count={4} />
              ) : bookings.length === 0 ? (
                <EmptyState message="Tidak ada antrean unit yang siap diinspeksi saat ini." />
              ) : (
                <View style={styles.cleanList}>
                  {bookings.map((item, index) => {
                    const activeDefects = item.defects?.filter((d: any) => d.status !== "Selesai").length || 0;
                    const hasDefect = activeDefects > 0;

                    return (
                      <SlideInView key={item.id} direction="up" delay={100 + index * 50} duration={350}>
                        <Pressable
                          onPress={() => {
                            void Haptics.selectionAsync();
                            navigation.navigate("InspectionDetail", {
                              bookingId: item.id,
                              unitName: \`Blok \${item.unit.blok} No. \${item.unit.nomor}\`,
                            });
                          }}
                          style={({ pressed }) => [styles.listItem, pressed && styles.pressedState]}
                        >
                          <View style={styles.listItemLeft}>
                            <Text style={styles.unitName}>
                              Blok {item.unit.blok} No. {item.unit.nomor}
                            </Text>
                            <View style={styles.metaRow}>
                              <Ionicons name="person-circle-outline" size={16} color={c.neutral500} />
                              <Text style={styles.customerName}>{item.lead.name}</Text>
                            </View>
                          </View>
                          
                          {/* Priority Right-Aligned Badging */}
                          <View style={styles.listItemRight}>
                             {hasDefect ? (
                               <View style={styles.defectBadge}>
                                  <Ionicons name="alert-circle" size={16} color={c.danger.text} />
                                  <Text style={styles.defectBadgeText}>{activeDefects} Defect</Text>
                               </View>
                             ) : (
                               <View style={styles.successBadge}>
                                  <Ionicons name="checkmark-circle" size={16} color={c.success.text} />
                                  <Text style={styles.successBadgeText}>Siap</Text>
                               </View>
                             )}
                             <Ionicons name="chevron-forward" size={18} color={c.neutral400} style={{ marginLeft: 8 }} />
                          </View>
                        </Pressable>
                        <View style={styles.divider} />
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
    backgroundColor: "#ffffff",
  },
  heroHeader: {
    paddingBottom: 32,
  },
  heroSafeArea: {
    paddingTop: Platform.OS === 'android' ? 20 : 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  heroStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
  },
  heroStatItem: {
    flex: 1,
    alignItems: "center",
  },
  heroStatValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -1,
  },
  heroStatLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  contentPad: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionHeaderRow: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: c.neutral900,
  },
  cleanList: {
    backgroundColor: "#ffffff",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  listItemLeft: {
    flex: 1,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitName: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "500",
    color: c.neutral600,
  },
  defectBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.danger.bg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  defectBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: c.danger.text,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.success.bg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  successBadgeText: {
    fontSize: 13,
    fontWeight: "800",
    color: c.success.text,
  },
  divider: {
    height: 1,
    backgroundColor: c.neutral200,
  },
  pressedState: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('InspectionUnitsScreen successfully redesigned.');
