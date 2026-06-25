import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, Dimensions , StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { useNotifications } from "../../contexts/NotificationContext";
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi,";
  if (hour < 15) return "Selamat siang,";
  if (hour < 18) return "Selamat sore,";
  return "Selamat malam,";
}

export function CustomerHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

  const [overview, setOverview] = useState<CustomerOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { unreadCount } = useNotifications();

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
                  <LinearGradient
                    colors={[c.primaryLight, c.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressFill, { width: `${Math.max(4, overview.unit.progress)}%` }]}
                  />
                </View>
              </View>
            </View>
          </FadeInView>
        </View>

        <View style={styles.contentPad}>
          {/* ACTIVE TICKETS WIDGET */}
          {overview?.activeTickets && overview.activeTickets.length > 0 && (
            <FadeInView delay={50} duration={600} style={{marginBottom: 32}}>
               <Text style={styles.sectionTitle}>Tiket Bantuan Aktif</Text>
               <View style={{ gap: 16 }}>
                 {overview.activeTickets.map(ticket => (
                   <Pressable key={ticket.id} onPress={() => goToTab("Bantuan")} style={({pressed}) => [styles.activeTicketCard, pressed && styles.pressed]}>
                      <View style={styles.activeTicketHeader}>
                        <View style={{flexDirection: "row", alignItems: "flex-start", gap: 16, flex: 1}}>
                          <View style={[styles.ticketIconWrap, { backgroundColor: ticket.hasUnreadReplies ? c.danger.bg : c.warning.bg }]}>
                            <Ionicons name="chatbubbles" size={24} color={ticket.hasUnreadReplies ? c.danger.text : c.warning.text} />
                          </View>
                          <View style={{ flex: 1, paddingRight: 8 }}>
                            <View style={{flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6}}>
                              {ticket.hasUnreadReplies && <View style={styles.unreadDot} />}
                              <Text style={[styles.ticketStatusText, ticket.hasUnreadReplies && { color: c.danger.text }]}>{
                                ticket.status === "MENUNGGU_TINDAKAN_CUSTOMER" ? "Menunggu Balasan Anda" : 
                                ticket.status === "BARU" ? "Menunggu Respons" : "Sedang Diproses"
                              }</Text>
                            </View>
                            <Text style={styles.activeTicketSubject} numberOfLines={2}>{ticket.subject}</Text>
                          </View>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={c.neutral400} style={{ marginTop: 12 }} />
                      </View>
                   </Pressable>
                 ))}
               </View>
            </FadeInView>
          )}

          {/* INVOICE CARD */}
          <FadeInView delay={100} duration={600} style={{ marginTop: 0, marginBottom: 40 }}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Ringkasan Akun</Text>
            </View>
            
            <Pressable onPress={() => goToTab("Tagihan")} style={({ pressed }) => [styles.invoiceCard, pressed && styles.pressed]}>
              {overview.nextInvoice ? (
                <>
                  <View style={styles.invoiceAmountWrap}>
                    <Text style={styles.invoiceLabel}>Tagihan Berikutnya</Text>
                    <View style={styles.currencyValueRow}>
                      <Text style={styles.currencySymbol}>Rp</Text>
                      <Text style={styles.currencyValue}>{formatCurrency(overview.nextInvoice.amount).replace('Rp', '').trim()}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.invoiceDivider} />

                  <View style={styles.invoiceFooterRow}>
                    <View style={styles.invoiceFooterLeft}>
                      <View style={[styles.invoiceIconWrapSmall, { backgroundColor: c.danger.bg }]}>
                        <Ionicons name="time" size={16} color={c.danger.text} />
                      </View>
                      <Text style={styles.invoiceMeta}>Jatuh tempo: {formatDate(overview.nextInvoice.dueDate)}</Text>
                    </View>
                    <View style={styles.invoiceCta}>
                       <Text style={styles.invoiceCtaText}>Bayar</Text>
                       <Ionicons name="arrow-forward" size={14} color={c.primary} />
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.invoiceAllClear}>
                    <View style={[styles.invoiceIconWrap, { backgroundColor: c.success.bg, marginBottom: 16 }]}>
                      <Ionicons name="checkmark-circle" size={28} color={c.success.text} />
                    </View>
                    <Text style={styles.invoiceName}>Semua Lunas!</Text>
                    <Text style={[styles.invoiceMeta, { textAlign: 'center', marginTop: 4 }]}>Tidak ada tagihan yang harus dibayar saat ini.</Text>
                </View>
              )}
            </Pressable>
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
        <LinearGradient 
          colors={[c.primary600, c.primary, c.primaryDark]} 
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroHeader}
        >
          {/* Subtle Top Inner Shadow/Reflection */}
          <LinearGradient 
             colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} 
             style={StyleSheet.absoluteFillObject} 
             pointerEvents="none" 
          />
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1, paddingRight: 20 }}>
                <Text style={styles.heroGreeting}>{getGreeting()}</Text>
                <Text style={styles.heroName} numberOfLines={1} adjustsFontSizeToFit>{auth?.user.fullName}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 }}>
                <Pressable onPress={() => navigation.navigate("CustomerNotifikasi")} style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
                  <Ionicons name="notifications-outline" size={22} color="#ffffff" />
                  {unreadCount > 0 && (
                    <View style={styles.badgeWrap}>
                      <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable onPress={() => void signOut()} style={({ pressed }) => [styles.logoutBtn, pressed && styles.pressed]}>
                  <Ionicons name="log-out-outline" size={22} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </View>
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
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroTitleWrap: {
  },
  heroSafeArea: {
    paddingHorizontal: 24,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 24,
  },
  heroGreeting: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginBottom: 6,
  },
  heroName: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeWrap: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: c.danger.text,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  overlapContainer: {
    marginTop: -40,
    paddingHorizontal: 24,
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
    fontSize: 30,
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
    color: c.neutral900,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: c.neutral100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
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
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -1,
    marginBottom: 16,
  },
  activeTicketCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  activeTicketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ticketIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTicketSubject: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    lineHeight: 22,
  },
  ticketStatusText: {
    fontSize: 12,
    fontWeight: "700",
    color: c.warning.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.danger.text,
  },
  invoiceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  invoiceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  invoiceIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceName: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 2,
  },
  invoiceMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral500,
  },
  invoiceAmountWrap: {
    marginBottom: 20,
  },
  invoiceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: c.neutral500,
    marginBottom: 4,
  },
  currencyValueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "800",
    color: c.primary,
    marginTop: 6,
    marginRight: 6,
  },
  currencyValue: {
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: -1.5,
    color: c.neutral900,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: c.neutral100,
    marginHorizontal: -24,
    marginBottom: 16,
  },
  invoiceFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  invoiceFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  invoiceIconWrapSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  invoiceCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(14, 165, 233, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  invoiceCtaText: {
    fontSize: 12,
    fontWeight: "800",
    color: c.primaryDark,
  },
  invoiceAllClear: {
    alignItems: "center",
    paddingVertical: 16,
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
