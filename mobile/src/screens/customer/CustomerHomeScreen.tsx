import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { Badge, Card, EmptyState, ScreenShell, SecondaryButton, SectionTitle } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerOverviewData } from "../../services/api";
import { CustomerOverview } from "../../types";
import { formatCurrency, formatDate } from "../../utils/format";

export function CustomerHomeScreen(): React.JSX.Element {
  const { auth, signOut } = useAuth();

  const [overview, setOverview] = useState<CustomerOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const result = await getCustomerOverviewData(auth);
    setOverview(result);
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
            setErrorMessage(error instanceof Error ? error.message : "Gagal memuat beranda customer");
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
    <ScreenShell
      title="Portal Customer"
      subtitle={auth ? `${auth.user.fullName} • ${auth.user.email}` : ""}
      rightAction={<SecondaryButton label="Logout" onPress={() => void signOut()} />}
    >
      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat data customer...</Text>
        </Card>
      ) : errorMessage ? (
        <Card>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : !overview ? (
        <EmptyState message="Data unit customer belum tersedia." />
      ) : (
        <>
          <Card>
            <SectionTitle title="Unit Anda" />
            <View style={styles.unitRow}>
              <Text style={styles.unitCode}>{overview.unit.code}</Text>
              <Badge
                label={overview.unit.status === "DONE" ? "Selesai" : "Dalam Pembangunan"}
                tone={overview.unit.status === "DONE" ? "success" : "warning"}
              />
            </View>
            <Text style={styles.unitType}>{overview.unit.typeName}</Text>
            <Text style={styles.unitMeta}>Progress pembangunan: {overview.unit.progress}%</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(4, overview.unit.progress)}%` }]} />
            </View>
          </Card>

          <Card>
            <SectionTitle title="Ringkasan Akun" />
            <Text style={styles.summaryText}>Notifikasi belum dibaca: {overview.unreadNotifications}</Text>
            {overview.nextInvoice ? (
              <>
                <Text style={styles.summaryText}>Tagihan berikutnya: {overview.nextInvoice.name}</Text>
                <Text style={styles.summaryText}>Nominal: {formatCurrency(overview.nextInvoice.amount)}</Text>
                <Text style={styles.summaryText}>Jatuh tempo: {formatDate(overview.nextInvoice.dueDate)}</Text>
              </>
            ) : (
              <Text style={styles.summaryText}>Tidak ada tagihan berikutnya.</Text>
            )}
          </Card>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  errorText: {
    color: "#a41f26",
    fontWeight: "700",
    fontSize: 13,
  },
  unitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitCode: {
    color: "#123d47",
    fontSize: 20,
    fontWeight: "800",
  },
  unitType: {
    color: "#2d5a64",
    fontSize: 14,
  },
  unitMeta: {
    color: "#3e666f",
    fontSize: 13,
  },
  progressTrack: {
    marginTop: 2,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#dce9ea",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1f7f8a",
    borderRadius: 999,
  },
  summaryText: {
    color: "#2b5962",
    fontSize: 13,
    fontWeight: "600",
  },
});
