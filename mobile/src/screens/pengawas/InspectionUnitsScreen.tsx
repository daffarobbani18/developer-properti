import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, RefreshControl, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  // Referensi: CustomerHomeScreen.tsx:49
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);
  
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
    // withDefects dihapus: getInspectionBookings tidak mengembalikan data defects di payload booking.
    // b.defects selalu undefined sehingga stat ini selalu 0 — menyesatkan.
    // Defects per unit baru tersedia setelah masuk ke InspectionDetailScreen via getInspectionDefects.
    scheduled: bookings.filter((b) => b.status === "TERJADWAL").length,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* HERO HEADER */}
        <LinearGradient 
          colors={[c.primary600, c.primary, c.primaryDark]}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroHeader}
        >
          {/* Referensi: CustomerHomeScreen.tsx:247-251 */}
          <LinearGradient 
             colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']}
             style={StyleSheet.absoluteFillObject}
             pointerEvents="none"
          />
          {/* paddingTop: referensi CustomerHomeScreen.tsx:252 */}
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            {/* Referensi: CustomerProgressScreen.tsx:221-225 — height:24 spacer + kicker + title */}
            <View style={{ height: 8 }} />
            <View>
              <Text style={styles.heroKicker}>PEMERIKSAAN UNIT</Text>
              <Text style={styles.heroHeaderTitle}>Inspeksi & BAST</Text>
            </View>
          </View>
        </LinearGradient>

        {/* overlapContainer: referensi CustomerHomeScreen.tsx:347-351 */}
        <View style={styles.overlapContainer}>
          <SlideInView direction="up" delay={50} duration={500}>
            <View style={styles.glassCard}>
              {/* Primary stat: unit menunggu */}
              <View style={styles.statsMainCol}>
                <Text style={styles.heroStatValue}>{stats.total}</Text>
                <Text style={styles.heroStatLabel}>
                  {stats.total === 1 ? "unit menunggu" : "unit menunggu"} inspeksi
                </Text>
              </View>

              <View style={styles.heroStatDivider} />

              {/* Secondary stats */}
              <View style={styles.statsSubGroup}>
                <View style={styles.statsSubItem}>
                  <View style={styles.statsSubItemLeft}>
                    <View style={[styles.statsDot, { backgroundColor: c.accent }]} />
                    <Text style={styles.statsSubLabel}>Terjadwal</Text>
                  </View>
                  <Text style={styles.statsSubValue}>{stats.scheduled}</Text>
                </View>
                <View style={styles.statsSubItem}>
                  <View style={styles.statsSubItemLeft}>
                    <View style={[styles.statsDot, { backgroundColor: c.neutral400 }]} />
                    <Text style={styles.statsSubLabel}>Belum jadwal</Text>
                  </View>
                  <Text style={styles.statsSubValue}>{stats.total - stats.scheduled}</Text>
                </View>
              </View>
            </View>
          </SlideInView>
        </View>

        <View style={styles.contentPad}>
          {errorMessage && (
            <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
          )}

          <SlideInView direction="up" delay={50} duration={400} style={{ marginTop: errorMessage ? 16 : 0 }}>
             <View style={styles.sectionHeaderRow}>
               <Text style={styles.sectionTitle}>Daftar Unit Siap</Text>
               {!isLoading && bookings.length > 0 && (
                 <Text style={styles.sectionCount}>{bookings.length} unit</Text>
               )}
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
                              unitName: `${item.unit.code} (${item.unit.typeName})`,
                            });
                          }}
                          style={({ pressed }) => [styles.listItem, pressed && styles.pressedState]}
                        >
                          <View style={styles.listItemLeft}>
                            <Text style={styles.unitName}>
                              {item.unit.code}
                            </Text>
                            <View style={styles.metaRow}>
                              <Ionicons name="person-circle-outline" size={16} color={c.neutral500} />
                              <Text style={styles.customerName}>{item.customerName || "Tanpa Nama"}</Text>
                            </View>
                          </View>
                          
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
                        {/* Divider hanya ditampilkan jika bukan item terakhir */}
                        {index < bookings.length - 1 && <View style={styles.divider} />}
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
  // heroHeader: referensi CustomerHomeScreen.tsx:286-292
  heroHeader: {
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  // heroSafeArea: referensi CustomerHomeScreen.tsx:295-297
  heroSafeArea: {
    paddingHorizontal: 24,
  },
  // heroTopRow: nav row back+title, referensi CustomerProgressScreen — marginBottom spacer
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  // heroKicker: CustomerProgressScreen.tsx:300-306 — identik
  heroKicker: { color: "#FBBF24", fontSize: 12, fontWeight: "800", letterSpacing: 1.5, marginBottom: 4 },
  // heroHeaderTitle: judul layar utama, bukan kicker
  heroHeaderTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -1.2,
  },
  // overlapContainer: referensi CustomerHomeScreen.tsx:347-351
  overlapContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
    zIndex: 10,
    marginBottom: 24,
  },
  // glassCard: CustomerProgressScreen statsCard — borderRadius:24, padding:24
  // shadow: height:16, opacity:0.06, radius:24, elevation:8, borderWidth:1, borderColor:neutral100
  // CustomerProgressScreen statsCard shadow lebih moderat dari CustomerHomeScreen glassCard.
  // Menggunakan ProgressScreen sebagai referensi karena konteks data (statistik unit)
  // lebih mirip dengan statsCard Progress daripada glassCard Home.
  glassCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  statsMainCol: { flex: 1, alignItems: "flex-start" },
  statsSubGroup: { flex: 1, gap: 12 },
  statsSubItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statsSubItemLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  statsSubLabel: { fontSize: 13, fontWeight: "600", color: c.neutral500 },
  statsSubValue: { fontSize: 15, fontWeight: "800", color: c.neutral900 },
  heroStatValue: {
    fontSize: 42,
    fontWeight: "900",
    color: c.neutral900,
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  // heroStatLabel: CustomerProgressScreen statsSubLabel — fontSize:13, fontWeight:"600", color:c.neutral500
  heroStatLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
    marginTop: 4,
  },
  heroStatSubValue: { fontSize: 15, fontWeight: "800", color: c.neutral900 },
  heroStatDivider: {
    width: 1,
    height: 56,
    backgroundColor: c.neutral200,
    marginHorizontal: 24,
  },
  // statsDot: forward reference dari FieldHomeScreen pattern
  statsDot: { width: 8, height: 8, borderRadius: 4 },
  // contentPad: marginTop 24 (bukan 32) karena overlapContainer sudah punya marginBottom:24
  // Total gap antara glassCard dan sectionTitle menjadi 24px, bukan 56px
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -0.5,
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral400,
  },
  // cleanList: referensi CustomerBillingScreen.tsx cleanList
  cleanList: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  // listItem: referensi CustomerBillingScreen.tsx cleanListItem
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  listItemLeft: {
    flex: 1,
    marginRight: 12,
  },
  listItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitName: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 4,
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
    backgroundColor: c.neutral100,
  },
  pressedState: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});
