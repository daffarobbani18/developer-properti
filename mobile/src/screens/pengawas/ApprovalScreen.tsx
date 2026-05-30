import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  PrimaryButton,
  ScreenShell,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { Milestone } from "../../types";
import { formatDate, formatMilestoneStatusLabel, inferBannerTone } from "../../utils/format";

type ApprovalItem = {
  id: string;
  type: "milestone" | "issue";
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  data: Milestone | null;
};

export function ApprovalScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const loadApprovals = useCallback(async () => {
    if (!auth) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockApprovals: ApprovalItem[] = [
      {
        id: "a1",
        type: "milestone",
        title: "Pekerjaan Pondasi",
        description: "Update status menjadi COMPLETED",
        submittedBy: "Ahmad Engineer",
        submittedAt: new Date().toISOString(),
        data: { id: "m1", unitId: "u1", name: "Pekerjaan Pondasi", orderNo: 1, targetDate: "2026-06-01", status: "COMPLETED", photos: [], checklist: [], checklistCompleted: 5, checklistTotal: 5 },
      },
      {
        id: "a2",
        type: "milestone",
        title: "Pekerjaan Batu Dasar",
        description: "Update progress 50%",
        submittedBy: "Budi Engineer",
        submittedAt: new Date(Date.now() - 3600000).toISOString(),
        data: { id: "m2", unitId: "u2", name: "Pekerjaan Batu Dasar", orderNo: 2, targetDate: "2026-06-15", status: "IN_PROGRESS", photos: [], checklist: [], checklistCompleted: 2, checklistTotal: 5 },
      },
    ];

    setPendingApprovals(mockApprovals);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        setBanner(null);
        try {
          await loadApprovals();
        } catch (error) {
          if (!cancelled) {
            setBanner(error instanceof Error ? error.message : "Gagal memuat approval");
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
    }, [loadApprovals])
  );

  const handleApprove = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      setBanner(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
      setBanner("Approval berhasil diproses.");

      setIsSubmitting(false);
    },
    []
  );

  const handleReject = useCallback(
    async (id: string) => {
      setIsSubmitting(true);
      setBanner(null);

      await new Promise((resolve) => setTimeout(resolve, 500));

      setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
      setBanner("Approval ditolak.");

      setIsSubmitting(false);
    },
    []
  );

  return (
    <ScreenShell title="Approval" subtitle="Review dan setujui perubahan milestone">
      <Card>
        <SectionTitle title="Statistik Approval" caption="Ringkasan antrian approval" />
        <View style={styles.statsGrid}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Menunggu</Text>
            <Text style={styles.statValue}>{pendingApprovals.length}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Milestone</Text>
            <Text style={styles.statValue}>{pendingApprovals.filter((a) => a.type === "milestone").length}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Kendala</Text>
            <Text style={styles.statValue}>{pendingApprovals.filter((a) => a.type === "issue").length}</Text>
          </View>
        </View>
      </Card>

      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat antrian approval...</Text>
        </Card>
      ) : pendingApprovals.length === 0 ? (
        <EmptyState message="Tidak ada approval yang menunggu." />
      ) : (
        <View style={styles.approvalList}>
          {pendingApprovals.map((item) => (
            <Card key={item.id}>
              <View style={styles.approvalHeader}>
                <Text style={styles.approvalTitle}>{item.title}</Text>
                <Badge label={item.type === "milestone" ? "Milestone" : "Kendala"} tone="warning" />
              </View>
              <Text style={styles.approvalDesc}>{item.description}</Text>
              <Text style={styles.approvalMeta}>Pengirim: {item.submittedBy}</Text>
              <Text style={styles.approvalMeta}>Waktu: {formatDate(item.submittedAt)}</Text>

              {item.data && "status" in item.data && (
                <View style={styles.milestoneInfo}>
                  <Text style={styles.milestoneInfoText}>Status saat ini: {formatMilestoneStatusLabel(item.data.status)}</Text>
                </View>
              )}

<View style={styles.actionRow}>
                  <PrimaryButton
                    label="Setujui"
                    onPress={() => void handleApprove(item.id)}
                    disabled={isSubmitting}
                  />
                  <PrimaryButton
                    label="Tolak"
                    onPress={() => void handleReject(item.id)}
                    disabled={isSubmitting}
                  />
                </View>
            </Card>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flexGrow: 1,
    minWidth: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  statLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statValue: {
    color: "#184b55",
    fontSize: 18,
    fontWeight: "800",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  approvalList: {
    gap: 10,
  },
  approvalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  approvalTitle: {
    color: "#123b45",
    fontSize: 15,
    fontWeight: "800",
    flex: 1,
  },
  approvalDesc: {
    color: "#335e67",
    fontSize: 13,
    marginBottom: 4,
  },
  approvalMeta: {
    color: "#4a6a72",
    fontSize: 12,
  },
  milestoneInfo: {
    backgroundColor: "#f4fbfc",
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
  },
  milestoneInfoText: {
    color: "#184b55",
    fontSize: 12,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
});