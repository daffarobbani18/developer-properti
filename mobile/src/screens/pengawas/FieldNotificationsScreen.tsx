// [UI-FIX-V2] Remediation based on design-spec + audit — SIMDP Mobile v1.1
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  IconButton,
  PrimaryButton,
  ScreenShell,
  SectionTitle,
  SkeletonList,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getRoleNotifications, markNotificationsAsRead } from "../../services/api";
import { NotificationItem } from "../../types";
import { formatErrorMessage, inferBannerTone } from "../../utils/format";
import { formatRelativeDate } from "../../utils/dateUtils";

const routeMap: Record<string, { label: string; screen: string }> = {
  milestone_update: { label: "Lihat Milestone", screen: "Milestone" },
  issue_update: { label: "Lihat Kendala", screen: "Kendala" },
  deadline_alert: { label: "Lihat Unit", screen: "Unit" },
  payment_confirmed: { label: "Lihat Tagihan", screen: "Tagihan" },
  document_ready: { label: "Lihat Dokumen", screen: "Dokumen" },
};

export function FieldNotificationsScreen(): React.JSX.Element {
   const { auth } = useAuth();
   const navigation = useNavigation();

   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [banner, setBanner] = useState<string | null>(null);
   const [filter, setFilter] = useState<"all" | "unread">("all");

   const loadData = useCallback(async () => {
     if (!auth) {
       return;
     }

     const data = await getRoleNotifications(auth);
     setNotifications(data);
   }, [auth]);

   useFocusEffect(
     useCallback(() => {
       let cancelled = false;

       (async () => {
         setIsLoading(true);
         setBanner(null);
         try {
           await loadData();
         } catch (error) {
           if (!cancelled) {
             setBanner(formatErrorMessage(error));
           }
         } finally {
           if (!cancelled) {
             setIsLoading(false);
           }
         }
       })();

       return () => {
         cancelled = true;
       };
     }, [loadData])
   );

   const markAllRead = useCallback(async () => {
     if (!auth) {
       return;
     }

     setIsSubmitting(true);
     setBanner(null);

     try {
       const result = await markNotificationsAsRead(auth);
       setNotifications(result);
       setBanner("Semua notifikasi ditandai sudah dibaca.");
     } catch (error) {
       setBanner(formatErrorMessage(error));
     } finally {
       setIsSubmitting(false);
     }
   }, [auth]);

   const unreadCount = notifications.filter((item) => !item.isRead).length;
   const filteredNotifications = filter === "unread"
     ? notifications.filter((item) => !item.isRead)
     : notifications;

   return (
     <ScreenShell title="Notifikasi" subtitle="Ringkasan pengingat dan update lapangan">
<Card>
         <SectionTitle title="Status Notifikasi" caption="Pantau ringkasan notifikasi" />
         <View style={styles.topRow}>
           <View style={styles.metricPill}>
             <Text style={styles.metricLabel}>Total</Text>
             <Text style={styles.metricValue}>{notifications.length}</Text>
           </View>
           <View style={styles.metricPill}>
             <Text style={styles.metricLabel}>Belum Dibaca</Text>
             <Text style={styles.metricValue}>{unreadCount}</Text>
           </View>
         </View>
         <View style={styles.filterToggleRow}>
           <Pressable
             onPress={() => setFilter("all")}
             style={[styles.filterToggleBtn, filter === "all" && styles.filterToggleBtnActive]}
           >
             <Text style={[styles.filterToggleText, filter === "all" && styles.filterToggleTextActive]}>Semua</Text>
           </Pressable>
           <Pressable
             onPress={() => setFilter("unread")}
             style={[styles.filterToggleBtn, filter === "unread" && styles.filterToggleBtnActive]}
           >
             <Text style={[styles.filterToggleText, filter === "unread" && styles.filterToggleTextActive]}>Belum dibaca</Text>
           </Pressable>
           <IconButton icon="refresh" onPress={() => void loadData()} />
         </View>
         <PrimaryButton
           label={isSubmitting ? "Memproses..." : "Tandai Semua Dibaca"}
           onPress={() => void markAllRead()}
           disabled={unreadCount === 0 || isSubmitting}
         />
       </Card>

       {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

     {isLoading ? (
         <SkeletonList count={4} />
       ) : notifications.length === 0 ? (
         <EmptyState message="Belum ada notifikasi saat ini." />
       ) : (
         <View style={styles.listWrap}>
           {filteredNotifications.map((item) => (
             <Card key={item.id} style={!item.isRead ? styles.unreadCard : undefined}>
               <View style={styles.itemTopRow}>
                 <Text style={styles.itemTitle}>{item.title}</Text>
                 <Badge label={item.isRead ? "Dibaca" : "Baru"} tone={item.isRead ? "neutral" : "warning"} />
               </View>
               <Text style={styles.itemBody}>{item.body}</Text>
               <Text style={styles.itemDate}>{formatRelativeDate(item.createdAt)}</Text>
               {item.type === "issue_update" || item.type === "milestone_update" || item.type === "deadline_alert" || item.data?.route ? (
                 <View style={styles.actionRow}>
                   <PrimaryButton
                     label={routeMap[item.data?.route ?? item.type ?? ""]?.label ?? "Lihat Detail"}
                     onPress={() => {
                       const targetScreen = routeMap[item.data?.route ?? item.type ?? ""]?.screen;
                       if (targetScreen) {
                         (navigation as { navigate: (name: string) => void }).navigate(targetScreen as never);
                       }
                     }}
                     disabled={isSubmitting}
                   />
                 </View>
               ) : null}
             </Card>
           ))}
         </View>
       )}
     </ScreenShell>
   );
}

const styles = StyleSheet.create({
   topRow: {
     flexDirection: "row",
     flexWrap: "wrap",
     gap: 8,
   },
   metricPill: {
     minWidth: 126,
     borderRadius: 10,
     borderWidth: 1,
     borderColor: "#cde1e4",
     backgroundColor: "#f6fbfc",
     paddingHorizontal: 10,
     paddingVertical: 7,
   },
   metricLabel: {
     color: "#4f7078",
     fontSize: 11,
     fontWeight: "700",
   },
   metricValue: {
     color: "#1b4a53",
     fontSize: 18,
     fontWeight: "800",
   },
   filterToggleRow: {
     flexDirection: "row",
     gap: 8,
     marginTop: 12,
   },
   filterToggleBtn: {
     flex: 1,
     paddingVertical: 8,
     paddingHorizontal: 12,
     borderRadius: 8,
     backgroundColor: "#f1f5f9",
     alignItems: "center",
   },
   filterToggleBtnActive: {
     backgroundColor: "#117a85",
   },
   filterToggleText: {
     fontSize: 12,
     fontWeight: "600",
     color: "#475569",
   },
   filterToggleTextActive: {
     color: "#ffffff",
   },
   loadingText: {
     color: "#4f6f77",
     fontSize: 14,
   },
   listWrap: {
     gap: 9,
   },
   unreadCard: {
     borderColor: "#8bb6bc",
     backgroundColor: "#f4fbfc",
   },
   itemTopRow: {
     flexDirection: "row",
     justifyContent: "space-between",
     gap: 10,
    },
   itemTitle: {
     flex: 1,
     color: "#143f49",
     fontSize: 15,
     fontWeight: "800",
   },
   itemBody: {
     color: "#335e67",
     fontSize: 13,
     lineHeight: 18,
   },
   itemDate: {
     color: "#5a7980",
     fontSize: 12,
   },
   actionRow: {
     marginTop: 8,
   },
});
