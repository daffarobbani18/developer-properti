// [UI-FIX-V3] Priority Action Feed Redesign - SIMDP Mobile
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import { useNotifications } from "../../contexts/NotificationContext";
import type { FieldStackParamList } from "../../navigation/types";
import { EmptyState, SkeletonList, SlideInView } from "../../components/ui";
import { c } from "../../theme/colors";
import { formatRelativeDate } from "../../utils/dateUtils";

type NavigationProp = NativeStackNavigationProp<FieldStackParamList>;

export function FieldNotificationsScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);
  const { notifications, criticalCount, isLoading, refresh, markAsResolvedLocally, markAsReadLocally } = useNotifications();
  
  const [filter, setFilter] = useState<"all" | "actionable">("actionable");

  const handleNotificationAction = async (item: any) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Mark as read immediately when action is clicked
    markAsReadLocally(item.id);
    
    // We navigate. Note: in a real app, the target screen would mark it as resolved when the action completes.
    // Since we're demonstrating the flow, we'll mark it as resolved locally for now if it's handled.
    // For now, let's just mark it resolved to simulate action taken.
    markAsResolvedLocally(item.id);

    // Navigation Mapping
    if (item.data?.route === "milestone_update" || item.type === "milestone_update") {
      navigation.navigate("Beranda", { screen: "FieldMilestones" });
    } else if (item.data?.route === "deadline_alert" || item.type === "deadline_alert" || item.title.toLowerCase().includes('deadline') || item.title.toLowerCase().includes('defect')) {
      navigation.navigate("Beranda", { screen: "InspectionUnits" });
    } else {
      navigation.navigate("Beranda");
    }
  };

  const markAsReadSimple = (item: any) => {
    if (!item.isRead) {
      markAsReadLocally(item.id);
    }
  };

  const actionableList = notifications.filter(n => !n.isResolved);
  const displayList = filter === "actionable" ? actionableList : notifications;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} tintColor="#ffffff" />}
      >
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
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text style={styles.heroHeaderTitle}>Pusat Notifikasi</Text>
              <View style={{ width: 44 }} />
            </View>
            
            <View style={styles.heroStatsRow}>
               <View style={styles.heroStatItem}>
                 <Text style={styles.heroStatValue}>{actionableList.length}</Text>
                 <Text style={styles.heroStatLabel}>Tugas Menunggu</Text>
               </View>
               <View style={styles.heroStatDivider} />
               <View style={styles.heroStatItem}>
                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                   <Text style={[styles.heroStatValue, { color: criticalCount > 0 ? c.danger.text : c.success.text }]}>{criticalCount}</Text>
                   {criticalCount > 0 && <Ionicons name="warning" size={16} color={c.danger.text} />}
                 </View>
                 <Text style={styles.heroStatLabel}>Prioritas Kritis</Text>
               </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentPad}>
          <View style={styles.filterRow}>
            <Pressable
              onPress={() => { void Haptics.selectionAsync(); setFilter("actionable"); }}
              style={[styles.filterBtn, filter === "actionable" && styles.filterBtnActive]}
            >
              <Text style={[styles.filterBtnText, filter === "actionable" && styles.filterBtnTextActive]}>Perlu Tindakan</Text>
              {actionableList.length > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{actionableList.length}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => { void Haptics.selectionAsync(); setFilter("all"); }}
              style={[styles.filterBtn, filter === "all" && styles.filterBtnActive]}
            >
              <Text style={[styles.filterBtnText, filter === "all" && styles.filterBtnTextActive]}>Semua Histori</Text>
            </Pressable>
          </View>

          <SlideInView direction="up" delay={50} duration={400} style={{ marginTop: 16 }}>
             {isLoading && notifications.length === 0 ? (
                <SkeletonList count={4} />
              ) : displayList.length === 0 ? (
                <EmptyState message={filter === "actionable" ? "Tidak ada tugas lapangan yang mendesak saat ini." : "Belum ada histori notifikasi."} />
              ) : (
                <View style={styles.feedList}>
                  {displayList.map((item, index) => {
                    const isCritical = item.title.toLowerCase().includes('deadline') || item.title.toLowerCase().includes('terlambat') || item.title.toLowerCase().includes('kekurangan');
                    const isWarning = item.title.toLowerCase().includes('defect') || item.title.toLowerCase().includes('perhatian');
                    
                    const tone = isCritical ? 'critical' : isWarning ? 'warning' : 'info';
                    const IconName = isCritical ? 'alert-circle' : isWarning ? 'warning' : 'information-circle';
                    const toneColor = isCritical ? c.danger.text : isWarning ? c.warning.text : c.info.text;
                    const toneBg = isCritical ? c.danger.bg : isWarning ? c.warning.bg : c.info.bg;
                    
                    const statusText = item.isResolved ? "Selesai" : item.isRead ? "Dibaca" : "Perlu Tindakan";

                    return (
                      <SlideInView key={item.id} direction="up" delay={100 + index * 50} duration={350}>
                        <Pressable 
                          onPress={() => markAsReadSimple(item)}
                          style={({ pressed }) => [styles.feedItem, pressed && styles.pressedState, !item.isRead && styles.unreadItem]}
                        >
                          <View style={styles.feedItemLeft}>
                            <View style={[styles.iconWrap, { backgroundColor: toneBg }]}>
                              <Ionicons name={IconName} size={20} color={toneColor} />
                            </View>
                          </View>
                          
                          <View style={styles.feedItemBody}>
                            <View style={styles.feedHeaderRow}>
                              <Text style={[styles.feedTitle, { color: isCritical ? c.danger.text : c.neutral900 }]}>
                                {item.title}
                              </Text>
                              <View style={styles.statusBadgeWrap}>
                                <Text style={[styles.statusText, { color: item.isResolved ? c.success.text : item.isRead ? c.neutral500 : toneColor }]}>
                                  {statusText}
                                </Text>
                              </View>
                            </View>
                            
                            <Text style={styles.feedBodyText}>{item.body}</Text>
                            
                            <View style={styles.feedFooterRow}>
                              <Text style={styles.timeText}>{formatRelativeDate(item.createdAt)}</Text>
                              
                              {!item.isResolved && (
                                <Pressable 
                                  onPress={() => handleNotificationAction(item)}
                                  style={[styles.actionBtn, { backgroundColor: toneBg }]}
                                >
                                  <Text style={[styles.actionBtnText, { color: toneColor }]}>Tindak Lanjuti</Text>
                                  <Ionicons name="arrow-forward" size={14} color={toneColor} />
                                </Pressable>
                              )}
                            </View>
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
  container: { flex: 1, backgroundColor: c.neutral50 },
  heroHeader: { minHeight: 240, paddingBottom: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: "hidden" },
  heroSafeArea: { paddingHorizontal: 24 },
  heroTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  heroHeaderTitle: { fontSize: 18, fontWeight: "700", color: "#ffffff", letterSpacing: -0.5 },
  heroStatsRow: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  heroStatItem: { flex: 1 },
  heroStatValue: { fontSize: 28, fontWeight: "800", color: "#ffffff", marginBottom: 2, letterSpacing: -1 },
  heroStatLabel: { fontSize: 12, fontWeight: "500", color: c.neutral300 },
  heroStatDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.1)", marginHorizontal: 16 },
  contentPad: { paddingHorizontal: 20, paddingTop: 20 },
  
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  filterBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, backgroundColor: c.neutral100, borderRadius: 10, gap: 6 },
  filterBtnActive: { backgroundColor: c.neutral800 },
  filterBtnText: { fontSize: 13, fontWeight: "600", color: c.neutral600 },
  filterBtnTextActive: { color: "#ffffff" },
  filterBadge: { backgroundColor: c.danger.text, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  filterBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  feedList: { gap: 4 },
  feedItem: { flexDirection: 'row', paddingVertical: 16, gap: 12 },
  unreadItem: { backgroundColor: 'rgba(235, 248, 255, 0.3)', marginHorizontal: -20, paddingHorizontal: 20 },
  pressedState: { opacity: 0.7 },
  feedItemLeft: { paddingTop: 2 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  feedItemBody: { flex: 1 },
  feedHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 12 },
  feedTitle: { flex: 1, fontSize: 15, fontWeight: "700", letterSpacing: -0.3, lineHeight: 20 },
  statusBadgeWrap: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: c.neutral100 },
  statusText: { fontSize: 10, fontWeight: "700", textTransform: 'uppercase' },
  feedBodyText: { fontSize: 13, color: c.neutral600, lineHeight: 18, marginBottom: 12 },
  feedFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeText: { fontSize: 12, color: c.neutral400, fontWeight: "500" },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 4 },
  actionBtnText: { fontSize: 12, fontWeight: "700" },
  divider: { height: 1, backgroundColor: c.neutral100, marginLeft: 52 },
});
