import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
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
  if (status === "DONE") {
    return "success";
  }
  if (status === "IN_PROGRESS") {
    return "warning";
  }
  return "neutral";
}

export function CustomerHomeScreen({ globalBanner }: { globalBanner?: string | null }): React.JSX.Element {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation();

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

  const goToTab = useCallback(
    (tabName: "Progres" | "Tagihan" | "Dokumen" | "Bantuan") => {
      (navigation as { navigate: (routeName: string) => void }).navigate(tabName);
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
      {globalBanner ? <StatusBanner message={globalBanner} tone={inferBannerTone(globalBanner)} /> : null}

      <Card>
        <SectionTitle title="Aksi Cepat" caption="Navigasi cepat untuk kebutuhan harian" />
        <View style={styles.quickActionGrid}>
          <Pressable
            onPress={() => goToTab("Progres")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Lihat Progres</Text>
            <Text style={styles.quickActionCaption}>Pantau pembangunan unit</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("Tagihan")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Tagihan</Text>
            <Text style={styles.quickActionCaption}>Cek invoice & pembayaran</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("Dokumen")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Dokumen</Text>
            <Text style={styles.quickActionCaption}>Akses berkas legal</Text>
          </Pressable>

          <Pressable
            onPress={() => goToTab("Bantuan")}
            style={({ pressed }) => [styles.quickActionBtn, pressed && styles.quickActionBtnPressed]}
          >
            <Text style={styles.quickActionTitle}>Bantuan</Text>
            <Text style={styles.quickActionCaption}>Buat tiket atau FAQ</Text>
          </Pressable>
        </View>
      </Card>

      <SecondaryButton label="Muat Ulang Data" onPress={() => void loadData()} />

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat data customer...</Text>
        </Card>
      ) : errorMessage ? (
        <StatusBanner message={errorMessage} tone={inferBannerTone(errorMessage)} />
      ) : !overview ? (
        <EmptyState message="Data unit customer belum tersedia." />
      ) : (
        <>
          <Card>
            <SectionTitle title="Unit Anda" />
            <View style={styles.unitRow}>
              <Text style={styles.unitCode}>{overview.unit.code}</Text>
              <Badge label={formatUnitStatusLabel(overview.unit.status)} tone={toneByUnitStatus(overview.unit.status)} />
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
  quickActionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickActionBtn: {
    flexGrow: 1,
    flexBasis: "48%",
    minHeight: 72,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cae1e5",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 9,
    justifyContent: "center",
    gap: 2,
  },
  quickActionBtnPressed: {
    opacity: 0.86,
  },
  quickActionTitle: {
    color: "#184a55",
    fontSize: 13,
    fontWeight: "800",
  },
  quickActionCaption: {
    color: "#4a7078",
    fontSize: 11,
    fontWeight: "600",
  },
});
