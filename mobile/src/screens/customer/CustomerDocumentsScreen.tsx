import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator, Alert, ScrollView, RefreshControl } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  EmptyState,
  StatusBanner,
  SlideInView,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerDocuments, getHandoverInfo } from "../../services/api";
import { downloadDocument } from "../../services/media";
import { DocumentItem, HandoverInfo } from "../../types";
import { formatDocumentStatusLabel, inferBannerTone } from "../../utils/format";
import { c } from "../../theme";

// Helper for status tone
function statusTone(status: DocumentItem["status"]): "neutral" | "warning" | "success" {
  if (status === "TERSEDIA") return "success";
  if (status === "SEDANG_DIPROSES") return "warning";
  return "neutral";
}

export function CustomerDocumentsScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [handoverInfo, setHandoverInfo] = useState<HandoverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) return;
    const [data, handover] = await Promise.all([
      getCustomerDocuments(auth),
      getHandoverInfo(auth?.user?.id ? 'unit-1' : 'unit-001'),
    ]);
    setDocuments(data);
    setHandoverInfo(handover);
  }, [auth]);

  const handleDownload = useCallback(async (document: DocumentItem) => {
    if (!document.url) {
      Alert.alert("Error", "Dokumen tidak tersedia untuk diunduh");
      return;
    }

    setDownloadingId(document.id);
    try {
      const result = await downloadDocument(document.url, document.title);
      if (!result.success) {
        Alert.alert("Error", result.message);
      } else {
        Alert.alert("Berhasil", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Gagal mengunduh dokumen");
    } finally {
      setDownloadingId(null);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          await loadData();
        } catch (error) {
          if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dokumen");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadData])
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* PREMIUM ENTERPRISE HEADER */}
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

          <View style={[styles.heroSafeArea, { paddingTop: (insets.top || 45) + 16 }]}>
            <View style={{ height: 24 }} />
            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroKicker}>LEGAL & TRANSAKSI</Text>
              <Text style={styles.heroTitle}>Dokumen Digital</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.overlapContainer}>
          {errorMessage && (
            <SlideInView direction="up" delay={0} style={{ marginBottom: 16 }}>
               <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
            </SlideInView>
          )}

          {/* Handover Card */}
          {handoverInfo && (
            <SlideInView direction="up" delay={50}>
              <View style={styles.handoverCard}>
                <View style={styles.handoverHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.handoverTitle}>Serah Terima Unit</Text>
                    <Text style={styles.handoverSubtitle}>
                      Rencana: <Text style={{ fontWeight: "700", color: c.primary600 }}>{new Date(handoverInfo.plannedDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</Text>
                    </Text>
                  </View>
                  <Badge
                    label={handoverInfo.checklist.every((i) => i.isCompleted) ? "Siap" : handoverInfo.status === "READY" ? "Siap" : "Persiapan"}
                    tone={handoverInfo.checklist.every((i) => i.isCompleted) ? "success" : "warning"}
                  />
                </View>

                <Text style={styles.handoverSectionTitle}>CHECKLIST KESIAPAN</Text>

                <View style={styles.handoverList}>
                  {handoverInfo.checklist.map((item, index) => (
                    <View key={item.id} style={styles.handoverItemRow}>
                      <View style={[styles.handoverCheckbox, item.isCompleted && styles.handoverCheckboxCompleted]}>
                        {item.isCompleted ? (
                          <Ionicons name="checkmark" size={14} color="#ffffff" />
                        ) : (
                          <Text style={styles.handoverCheckboxNum}>{index + 1}</Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.handoverItemLabel, item.isCompleted && styles.handoverItemDone]}>{item.label}</Text>
                        <Text style={styles.handoverItemDesc}>{item.description}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {!handoverInfo.checklist.every((i) => i.isCompleted) && (
                  <View style={styles.handoverWarningBox}>
                    <Ionicons name="warning" size={16} color={c.warning.text} style={styles.handoverWarningIcon} />
                    <Text style={styles.handoverWarningText}>Selesaikan semua checklist sebelum tanggal serah terima</Text>
                  </View>
                )}
              </View>
            </SlideInView>
          )}

          {/* Document List */}
          <SlideInView direction="up" delay={100}>
             <View style={styles.sectionHeader}>
               <Text style={styles.sectionTitle}>Daftar Dokumen</Text>
               <View style={styles.badgeWrap}>
                 <Text style={styles.badgeText}>{documents.length} File</Text>
               </View>
             </View>

             {documents.length === 0 && !isLoading ? (
               <EmptyState message="Belum ada dokumen untuk unit Anda." />
             ) : (
               <View style={styles.listWrap}>
                 {documents.map((item) => (
                   <View key={item.id} style={styles.docCard}>
                     <View style={[styles.docIconWrap, !item.url && styles.docIconWrapDisabled]}>
                        <Ionicons name="document-text-outline" size={24} color={item.url ? c.accent : c.neutral400} />
                     </View>
                     <View style={styles.docContent}>
                        <Text style={styles.docTitle}>{item.title}</Text>
                        <Text style={styles.docCategory}>{item.category}</Text>
                        <View style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                           <Badge label={formatDocumentStatusLabel(item.status)} tone={statusTone(item.status)} />
                        </View>
                     </View>
                     <View style={styles.docAction}>
                        {item.url ? (
                          <Pressable
                            onPress={() => void handleDownload(item)}
                            style={({ pressed }) => [styles.downloadBtn, pressed && styles.pressed]}
                            disabled={downloadingId === item.id}
                          >
                            {downloadingId === item.id ? (
                              <ActivityIndicator size="small" color="#ffffff" />
                            ) : (
                              <Ionicons name="cloud-download-outline" size={20} color="#ffffff" />
                            )}
                          </Pressable>
                        ) : (
                          <View style={styles.downloadBtnDisabled}>
                             <Ionicons name="lock-closed-outline" size={18} color={c.neutral400} />
                          </View>
                        )}
                     </View>
                   </View>
                 ))}
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
    minHeight: 240,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  heroSafeArea: {
    paddingHorizontal: 24,
  },

  heroTitleWrap: {
  },
  heroKicker: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  overlapContainer: {
    marginTop: -40,
    paddingHorizontal: 24,
    zIndex: 10,
    marginBottom: 24,
  },
  handoverCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: c.neutral100,
    marginBottom: 24,
  },
  handoverHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: c.neutral100,
    paddingBottom: 16,
  },
  handoverTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
  },
  handoverSubtitle: {
    fontSize: 13,
    color: c.neutral500,
    marginTop: 4,
  },
  handoverSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: c.neutral400,
    marginBottom: 16,
    letterSpacing: 1,
  },
  handoverList: {
    gap: 16,
  },
  handoverItemRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  handoverCheckbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: c.neutral200,
    backgroundColor: c.neutral50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  handoverCheckboxCompleted: {
    backgroundColor: c.success.text,
    borderColor: c.success.text,
  },
  handoverCheckboxNum: {
    color: c.neutral500,
    fontSize: 12,
    fontWeight: "800",
  },
  handoverItemLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: c.neutral900,
  },
  handoverItemDone: {
    textDecorationLine: "line-through",
    color: c.neutral400,
  },
  handoverItemDesc: {
    fontSize: 13,
    color: c.neutral500,
    marginTop: 4,
    lineHeight: 18,
  },
  handoverWarningBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: c.warning.bg,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderWidth: 1,
    borderColor: c.warning.border,
  },
  handoverWarningIcon: {
    marginTop: 1,
  },
  handoverWarningText: {
    flex: 1,
    fontSize: 13,
    color: c.warning.text,
    fontWeight: "700",
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
  },
  badgeWrap: {
    backgroundColor: c.neutral800,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  listWrap: {
    gap: 12,
  },
  docCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: c.neutral100,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  docIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  docIconWrapDisabled: {
    backgroundColor: c.neutral100,
  },
  docContent: {
    flex: 1,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 4,
  },
  docCategory: {
    fontSize: 13,
    color: c.neutral500,
  },
  docAction: {
    marginLeft: 16,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadBtnDisabled: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.neutral100,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
});
