import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  Skeleton,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerDocuments, getHandoverInfo } from "../../services/api";
import { downloadDocument } from "../../services/media";
import { DocumentItem, HandoverInfo } from "../../types";
import { formatDocumentStatusLabel, inferBannerTone } from "../../utils/format";

import { colors } from "../../theme/colors";

function statusTone(status: DocumentItem["status"]): "neutral" | "warning" | "success" {
  if (status === "TERSEDIA") {
    return "success";
  }
  if (status === "SEDANG_DIPROSES") {
    return "warning";
  }
  return "neutral";
}

export function CustomerDocumentsScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [handoverInfo, setHandoverInfo] = useState<HandoverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const [data, handover] = await Promise.all([
      getCustomerDocuments(auth),
      getHandoverInfo(auth?.user?.id ? 'unit-1' : 'unit-001'),
    ]);
    setDocuments(data);
    setHandoverInfo(handover);
  }, [auth]);

  const handleReload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dokumen");
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

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
          if (!cancelled) {
            setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dokumen");
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

  return (
    <ScreenShell title="Dokumen Digital" subtitle="Akses dokumen legal dan transaksi unit Anda">
      <Card>
        <SectionTitle title="Status Dokumen" />
        <Text style={styles.summaryText}>Total dokumen: {documents.length}</Text>
      </Card>

      {/* Handover Section */}
      {handoverInfo === null ? (
        <Card style={{ marginBottom: 20 }}>
          <Skeleton width="60%" height={20} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={16} />
        </Card>
      ) : (
        <Card style={{ marginBottom: 20 }}>
          <View style={styles.handoverHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.handoverTitle}>Serah Terima Unit</Text>
              <Text style={styles.handoverSubtitle}>
                Rencana:{" "}
                <Text style={{ fontWeight: "600", color: colors.primary }}>
                  {new Date(handoverInfo.plannedDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </Text>
            </View>
            <Badge
              label={
                handoverInfo.checklist.every((i) => i.isCompleted) ? "Siap" : handoverInfo.status === "READY" ? "Siap" : "Persiapan"
              }
              tone={
                handoverInfo.checklist.every((i) => i.isCompleted) ? "success" : "warning"
              }
            />
          </View>

          <Text style={styles.handoverSectionTitle}>CHECKLIST KESIAPAN</Text>

          <View style={{ gap: 12 }}>
            {handoverInfo.checklist.map((item, index) => (
              <View key={item.id} style={styles.handoverItemRow}>
                <View
                  style={[
                    styles.handoverCheckbox,
                    item.isCompleted && styles.handoverCheckboxCompleted,
                  ]}
                >
                  {item.isCompleted ? (
                    <Text style={styles.handoverCheckboxMark}>✓</Text>
                  ) : (
                    <Text style={styles.handoverCheckboxNum}>{index + 1}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.handoverItemLabel,
                      item.isCompleted && styles.handoverItemDone,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={styles.handoverItemDesc}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {!handoverInfo.checklist.every((i) => i.isCompleted) && (
            <View style={styles.handoverWarningBox}>
              <Text style={styles.handoverWarningText}>
                ⚠ Selesaikan semua checklist sebelum tanggal serah terima
              </Text>
            </View>
          )}
        </Card>
      )}

      <SecondaryButton label="Muat Ulang Dokumen" onPress={() => void handleReload()} disabled={isLoading} />

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat dokumen...</Text>
        </Card>
      ) : errorMessage ? (
        <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
      ) : documents.length === 0 ? (
        <EmptyState message="Belum ada dokumen untuk unit Anda." />
      ) : (
        <View style={styles.listWrap}>
          {documents.map((item) => (
            <Card key={item.id}>
              <View style={styles.topRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Badge label={formatDocumentStatusLabel(item.status)} tone={statusTone(item.status)} />
              </View>
              <Text style={styles.category}>Kategori: {item.category}</Text>
{item.url ? (
                 <Pressable
                   onPress={() => {
                     void handleDownload(item);
                   }}
                   style={({ pressed }) => [styles.linkBtn, pressed && styles.linkBtnPressed]}
                   disabled={downloadingId === item.id}
                 >
                   {downloadingId === item.id ? (
                     <ActivityIndicator size="small" color="#1f5661" />
                   ) : (
                     <>
                       <Text style={styles.linkText}>Unduh Dokumen</Text>
                     </>
                   )}
                 </Pressable>
               ) : (
                 <Text style={styles.pendingText}>Dokumen belum tersedia untuk diunduh.</Text>
               )}
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    color: "#315b64",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 9,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: {
    flex: 1,
    color: "#123d47",
    fontSize: 15,
    fontWeight: "800",
  },
  category: {
    color: "#44656e",
    fontSize: 12,
  },
  linkBtn: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#7fa6ab",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#f4fcfd",
  },
  linkBtnPressed: {
    opacity: 0.8,
  },
  linkText: {
    color: "#1f5661",
    fontSize: 12,
    fontWeight: "700",
  },
  pendingText: {
    color: "#5b7980",
    fontSize: 12,
  },
  handoverHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  handoverTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#123d47",
  },
  handoverSubtitle: {
    fontSize: 13,
    color: "#4a6870",
    marginTop: 2,
  },
  handoverSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3a5f67",
    marginBottom: 12,
  },
  handoverItemRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  handoverCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#97bbc0",
    backgroundColor: "#f8fcfc",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  handoverCheckboxCompleted: {
    backgroundColor: colors.success.text,
    borderColor: colors.success.text,
  },
  handoverCheckboxMark: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  handoverCheckboxNum: {
    color: "#547078",
    fontSize: 12,
    fontWeight: "700",
  },
  handoverItemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#123d47",
  },
  handoverItemDone: {
    textDecorationLine: "line-through",
    color: "#7a949e",
  },
  handoverItemDesc: {
    fontSize: 12,
    color: "#547078",
    marginTop: 2,
  },
  handoverWarningBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.warning.bg,
  },
  handoverWarningText: {
    fontSize: 12,
    color: colors.warning.text,
    fontWeight: "600",
  },
});
