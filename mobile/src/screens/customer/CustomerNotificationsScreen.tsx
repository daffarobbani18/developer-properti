import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Platform, ActivityIndicator , StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { CustomerStackParamList } from "../../navigation/types";
import { useNotifications } from "../../contexts/NotificationContext";
import { c } from "../../theme/colors";
import { formatDate } from "../../utils/format";
import { NotificationItem } from "../../types";
import { SlideInView } from "../../components/ui";

type CustomerNotifikasiNavigationProp = NativeStackNavigationProp<CustomerStackParamList, "CustomerNotifikasi">;

export function CustomerNotificationsScreen(): React.JSX.Element {
  const navigation = useNavigation<CustomerNotifikasiNavigationProp>();
  const { notifications, isLoading, markAsReadLocally, unreadCount } = useNotifications();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

  const handlePressNotification = async (item: NotificationItem) => {
    if (!item.isRead) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await markAsReadLocally(item.id);
    }

    const targetRoute = item.actionType || item.data?.route || item.type;
    
    if (targetRoute === "progress" || targetRoute === "PROJECT_UPDATE" || targetRoute === "milestone_update") {
      navigation.navigate("Progres");
    } else if (targetRoute === "billing" || targetRoute === "PAYMENT_UPDATE" || targetRoute === "payment_confirmed") {
      navigation.navigate("Tagihan");
    } else if (targetRoute === "document" || targetRoute === "document_ready") {
      navigation.navigate("Dokumen");
    }
  };

  const renderIcon = (type: string | undefined) => {
    if (type === "PROJECT_UPDATE" || type === "progress") {
      return <Ionicons name="construct-outline" size={20} color={c.primary} />;
    }
    if (type === "PAYMENT_UPDATE" || type === "billing") {
      return <Ionicons name="receipt-outline" size={20} color={c.success.text} />;
    }
    return <Ionicons name="information-circle-outline" size={20} color={c.info.text} />;
  };

  const getIconBg = (type: string | undefined) => {
    if (type === "PROJECT_UPDATE" || type === "progress") return c.primaryLight;
    if (type === "PAYMENT_UPDATE" || type === "billing") return c.success.bg;
    return c.info.bg;
  };

  const getCtaText = (targetRoute: string | undefined) => {
    if (targetRoute === "progress" || targetRoute === "PROJECT_UPDATE" || targetRoute === "milestone_update") return "Lihat Progress";
    if (targetRoute === "billing" || targetRoute === "PAYMENT_UPDATE" || targetRoute === "payment_confirmed") return "Lihat Tagihan";
    if (targetRoute === "document" || targetRoute === "document_ready") return "Buka Dokumen";
    return "Lihat Detail";
  };


  return (
    <View style={styles.container}>
      {/* CONTENT */}
      {isLoading && notifications.length === 0 ? (
        <View style={styles.centerBox}>
           <ActivityIndicator size="large" color={c.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <SlideInView direction="up" delay={100} duration={500} style={styles.centerBox}>
           <View style={styles.emptyIconCircle}>
             <Ionicons name="notifications-outline" size={48} color={c.primary} />
             <View style={styles.emptyIconBadge}>
                <Ionicons name="checkmark" size={16} color="#fff" />
             </View>
           </View>
           <Text style={styles.emptyText}>Semua Terbaca!</Text>
           <Text style={styles.emptySubText}>Belum ada informasi terbaru untuk Anda. Segala pembaruan terkait progres maupun pembayaran proyek akan muncul di sini.</Text>
        </SlideInView>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* HEADER */}
              <LinearGradient colors={[c.primaryDark, "#020617"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
                <View style={{ paddingTop: (safeTop || 45) + 16, paddingHorizontal: 24 }}>
                  <View style={styles.headerRow}>
                    <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                      <Ionicons name="arrow-back" size={24} color="#ffffff" />
                    </Pressable>
                    <Text style={styles.headerTitle}>Pusat Informasi</Text>
                    <View style={{ width: 44 }} />
                  </View>
                </View>
              </LinearGradient>

              <View style={styles.overlapContainer}>
                {unreadCount > 0 ? (
                  <View style={styles.listHeaderWrap}>
                    <View style={styles.listHeaderPill}>
                      <Text style={styles.listHeaderText}>Anda memiliki {unreadCount} pesan baru</Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ height: 24 }} />
                )}
              </View>
            </>
          }
          renderItem={({ item, index }) => {
            const isUnread = !item.isRead;
            const targetRoute = item.actionType || item.data?.route || item.type;
            const ctaText = getCtaText(targetRoute);
            
            return (
              <SlideInView direction="up" delay={Math.min(index * 50, 400)} duration={400}>
                <Pressable 
                  onPress={() => void handlePressNotification(item)}
                  style={({ pressed }) => [
                    styles.card,
                    isUnread && styles.cardUnread,
                    pressed && styles.pressed
                  ]}
                >
                  {isUnread && <View style={styles.unreadBorderLeft} />}
                  <View style={[styles.iconBox, { backgroundColor: getIconBg(item.type) }]}>
                    {renderIcon(item.type)}
                  </View>
                  <View style={styles.cardBody}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={[styles.cardTitle, isUnread && styles.cardTitleUnread]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View style={styles.timeWrap}>
                        <Text style={[styles.cardTime, isUnread && styles.cardTimeUnread]}>{formatDate(item.createdAt)}</Text>
                        {isUnread && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                    <Text style={[styles.cardDesc, isUnread && styles.cardDescUnread]} numberOfLines={2}>{item.body}</Text>
                    
                    {item.actionType !== "informasi" && (
                      <View style={styles.cardActionContainer}>
                        <View style={styles.actionPill}>
                          <Text style={styles.actionText}>{ctaText}</Text>
                          <Ionicons name="arrow-forward" size={14} color={c.primaryDark} />
                        </View>
                      </View>
                    )}
                  </View>
                </Pressable>
              </SlideInView>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  header: {
    paddingBottom: 64,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  centerBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    marginTop: 64,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: c.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyIconBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: c.success.text,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: c.neutral50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "800",
    color: c.neutral800,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  emptySubText: {
    fontSize: 14,
    color: c.neutral500,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingBottom: 40,
  },
  overlapContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
    zIndex: 10,
  },
  listHeaderWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  listHeaderPill: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: "700",
    color: c.neutral700,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    paddingRight: 20,
    marginBottom: 16,
    marginHorizontal: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden", 
  },
  cardUnread: {
    backgroundColor: "rgba(14, 165, 233, 0.02)",
    shadowColor: c.primary,
    shadowOpacity: 0.08,
    borderColor: "rgba(14, 165, 233, 0.15)",
  },
  unreadBorderLeft: {
    position: "absolute",
    left: 0,
    top: 24,
    bottom: 24,
    width: 5,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: c.primary,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardBody: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: c.neutral700,
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: {
    fontWeight: "800",
    color: c.neutral900,
  },
  timeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTime: {
    fontSize: 11,
    fontWeight: "600",
    color: c.neutral400,
  },
  cardTimeUnread: {
    fontWeight: "700",
    color: c.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.primary,
  },
  cardDesc: {
    fontSize: 13,
    color: c.neutral600,
    lineHeight: 20,
    marginBottom: 14,
  },
  cardDescUnread: {
    color: c.neutral700,
  },
  cardActionContainer: {
    alignItems: "flex-start",
  },
  actionPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(14, 165, 233, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "800",
    color: c.primaryDark,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
