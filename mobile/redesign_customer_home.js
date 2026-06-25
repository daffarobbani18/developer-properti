const fs = require('fs');

const file = 'src/screens/customer/CustomerHomeScreen.tsx';

const newContent = `import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CustomerStackParamList } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  FadeInView,
  SkeletonList,
  StatusBanner,
} from "../../components/ui";
import { c } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerOverviewData } from "../../services/api";
import { CustomerOverview } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatUnitStatusLabel,
  inferBannerTone,
} from "../../utils/format";

function toneByUnitStatus(
  status: CustomerOverview["unit"]["status"]
): "neutral" | "warning" | "success" {
  if (status === "DONE") return "success";
  if (status === "IN_PROGRESS") return "warning";
  return "neutral";
}

export function CustomerHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();

  const [overview, setOverview] = useState<CustomerOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) return;
    const result = await getCustomerOverviewData(auth);
    setOverview(result);
  }, [auth]);

  const goToTab = useCallback(
    async (tabName: "Progres" | "Tagihan" | "Dokumen" | "Bantuan") => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(tabName);
    },
    [navigation]
  );

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
            setErrorMessage(error instanceof Error ? error.message : "Gagal memuat beranda customer");
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadData])
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.contentPad}>
          <SkeletonList count={3} />
        </View>
      );
    }
    
    if (errorMessage) {
      return (
        <View style={styles.contentPad}>
          <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
        </View>
      );
    }
    
    if (!overview) {
      return (
        <View style={styles.contentPad}>
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={48} color={c.neutral300} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyText}>Data unit customer belum tersedia.</Text>
          </View>
        </View>
      );
    }

    return (
      <>
        {/* OVERLAPPING PROGRESS PANEL */}
        <View style={styles.overlapContainer}>
          <FadeInView delay={0} duration={600}>
            <View style={styles.glassCard}>
              <View style={styles.unitHeaderRow}>
                <View>
                  <Text style={styles.unitKicker}>UNIT ANDA</Text>
                  <Text style={styles.unitCode}>{overview.unit.code}</Text>
                  <Text style={styles.unitType}>{overview.unit.typeName}</Text>
                </View>
                <Badge label={formatUnitStatusLabel(overview.unit.status)} tone={toneByUnitStatus(overview.unit.status)} />
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressTextRow}>
                  <Text style={styles.progressLabel}>Progres Pembangunan</Text>
                  <Text style={styles.progressPercentage}>{overview.unit.progress}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: \`\${Math.max(4, overview.unit.progress)}%\` }]} />
                </View>
              </View>
            </View>
          </FadeInView>
        </View>

        <View style={styles.contentPad}>
          {/* QUICK ACTIONS BENTO GRID */}
          <FadeInView delay={100} duration={600}>
            <Text style={styles.sectionTitle}>Aksi Cepat</Text>
            <View style={styles.bentoGrid}>
              <View style={styles.bentoColumn}>
                <Pressable onPress={() => goToTab("Progres")} style={({ pressed }) => [styles.bentoLarge, pressed && styles.pressed]}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: c.info.bg }]}>
                    <Ionicons name="stats-chart" size={24} color={c.info.text} />
                  </View>
                  <Text style={styles.bentoTitle}>Progres Fisik</Text>
                  <Text style={styles.bentoCaption}>Pantau foto lapangan</Text>
                </Pressable>
              </View>
              <View style={styles.bentoColumn}>
                <Pressable onPress={() => goToTab("Tagihan")} style={({ pressed }) => [styles.bentoSmall, pressed && styles.pressed]}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: c.warning.bg, width: 36, height: 36, borderRadius: 10 }]}>
                    <Ionicons name="receipt" size={18} color={c.warning.text} />
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.bentoTitle}>Tagihan</Text>
                    <Text style={styles.bentoCaption}>Cek invoice</Text>
                  </View>
                </Pressable>
                <Pressable onPress={() => goToTab("Dokumen")} style={({ pressed }) => [styles.bentoSmall, pressed && styles.pressed]}>
                  <View style={[styles.bentoIconWrap, { backgroundColor: c.success.bg, width: 36, height: 36, borderRadius: 10 }]}>
                    <Ionicons name="document-text" size={18} color={c.success.text} />
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.bentoTitle}>Dokumen</Text>
                    <Text style={styles.bentoCaption}>Akses legal</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </FadeInView>

          {/* CLEAN INVOICE AREA (No Card) */}
          <FadeInView delay={200} duration={600} style={{ marginTop: 32, marginBottom: 40 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Ringkasan Akun</Text>
            </View>
            
            <View style={styles.cleanList}>
              <View style={styles.cleanListItem}>
                <View style={[styles.cleanListIcon, { backgroundColor: c.info.bg }]}>
                  <Ionicons name="notifications" size={22} color={c.info.text} />
                </View>
                <View style={styles.cleanListBody}>
                  <Text style={styles.cleanListLabel}>Notifikasi Baru</Text>
                  <Text style={styles.cleanListValue}>{overview.unreadNotifications} Pesan belum dibaca</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {overview.nextInvoice ? (
                <View style={styles.cleanListItem}>
                  <View style={[styles.cleanListIcon, { backgroundColor: c.danger.bg }]}>
                    <Ionicons name="alert-circle" size={22} color={c.danger.text} />
                  </View>
                  <View style={styles.cleanListBody}>
                    <Text style={styles.cleanListLabel}>Tagihan Berikutnya</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                      <Text style={styles.currencySymbol}>Rp</Text>
                      <Text style={styles.currencyValue}>{formatCurrency(overview.nextInvoice.amount).replace('Rp', '').trim()}</Text>
                    </View>
                    <Text style={styles.cleanListHint}>Jatuh tempo: {formatDate(overview.nextInvoice.dueDate)}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.cleanListItem}>
                  <View style={[styles.cleanListIcon, { backgroundColor: c.success.bg }]}>
                    <Ionicons name="checkmark-circle" size={22} color={c.success.text} />
                  </View>
                  <View style={styles.cleanListBody}>
                    <Text style={styles.cleanListLabel}>Status Tagihan</Text>
                    <Text style={[styles.currencyValue, { color: c.success.text, fontSize: 18 }]}>Lunas</Text>
                    <Text style={styles.cleanListHint}>Tidak ada tagihan tertunda</Text>
                  </View>
                </View>
              )}
            </View>
          </FadeInView>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* HERO HEADER */}
        <LinearGradient colors={[c.primary, c.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroHeader}>
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroGreeting}>Selamat datang,</Text>
                <Text style={styles.heroName}>{auth?.user.fullName}</Text>
              </View>
              <Pressable onPress={() => void signOut()} style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
                <Ionicons name="log-out-outline" size={22} color="#ffffff" />
              </Pressable>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {renderContent()}
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
    paddingBottom: 80, // Extra padding for overlap
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroSafeArea: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 24 : 12,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  heroName: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  overlapContainer: {
    marginTop: -50,
    paddingHorizontal: 20,
    zIndex: 10,
  },
  glassCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
  unitHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  unitKicker: {
    color: c.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  unitCode: {
    color: c.neutral900,
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 32,
  },
  unitType: {
    color: c.neutral500,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 12,
  },
  progressLabel: {
    color: c.neutral600,
    fontSize: 14,
    fontWeight: "600",
  },
  progressPercentage: {
    color: c.primary600,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: c.neutral100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: c.accent,
    borderRadius: 999,
  },
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  bentoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  bentoColumn: {
    flex: 1,
    gap: 12,
  },
  bentoLarge: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  bentoSmall: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  bentoIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  bentoTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 2,
  },
  bentoCaption: {
    fontSize: 12,
    fontWeight: "500",
    color: c.neutral500,
  },
  cleanList: {
    gap: 16,
  },
  cleanListItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  cleanListIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cleanListBody: {
    flex: 1,
  },
  cleanListLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
    marginBottom: 4,
  },
  cleanListValue: {
    fontSize: 16,
    fontWeight: "700",
    color: c.neutral900,
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: "700",
    color: c.danger.text,
  },
  currencyValue: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    color: c.neutral900,
  },
  cleanListHint: {
    fontSize: 13,
    color: c.neutral500,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: c.neutral200,
    marginVertical: 4,
    marginLeft: 64, // Align with text
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: c.neutral400,
    fontSize: 15,
    fontWeight: "500",
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('CustomerHomeScreen structure fully redesigned.');
