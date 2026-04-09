import React, { useCallback, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Badge, Card, EmptyState, ScreenShell, SectionTitle } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerDocuments } from "../../services/api";
import { DocumentItem } from "../../types";

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const data = await getCustomerDocuments(auth);
    setDocuments(data);
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

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat dokumen...</Text>
        </Card>
      ) : errorMessage ? (
        <Card>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : documents.length === 0 ? (
        <EmptyState message="Belum ada dokumen untuk unit Anda." />
      ) : (
        <View style={styles.listWrap}>
          {documents.map((item) => (
            <Card key={item.id}>
              <View style={styles.topRow}>
                <Text style={styles.title}>{item.title}</Text>
                <Badge label={item.status} tone={statusTone(item.status)} />
              </View>
              <Text style={styles.category}>Kategori: {item.category}</Text>
              {item.url ? (
                <Pressable
                  onPress={() => {
                    void Linking.openURL(item.url as string);
                  }}
                  style={({ pressed }) => [styles.linkBtn, pressed && styles.linkBtnPressed]}
                >
                  <Text style={styles.linkText}>Buka Dokumen</Text>
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
  errorText: {
    color: "#a41f26",
    fontSize: 13,
    fontWeight: "700",
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
});
