import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  PrimaryButton,
  ScreenShell,
  SectionTitle,
  StatusBanner,
  SkeletonList,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getFieldIssues } from "../../services/api";
import { IssueItem } from "../../types";
import { formatDateTime, formatIssueStatusLabel, formatIssueUrgencyLabel, inferBannerTone } from "../../utils/format";

function statusTone(status: IssueItem["status"]): "neutral" | "warning" | "success" {
  if (status === "SELESAI") {
    return "success";
  }
  if (status === "SEDANG_DITANGANI") {
    return "warning";
  }
  return "neutral";
}

function urgencyTone(urgency: IssueItem["urgency"]): "neutral" | "warning" | "danger" {
  if (urgency === "KRITIS") {
    return "danger";
  }
  if (urgency === "TINGGI") {
    return "warning";
  }
  return "neutral";
}

export function IssueHistoryScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();

  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const openIssuesCount = issues.filter(
    (issue) => issue.status === "BARU" || issue.status === "SEDANG_DITANGANI"
  ).length;

  const resolvedIssuesCount = issues.filter((issue) => issue.status === "SELESAI").length;

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    setIsLoading(true);
    setBanner(null);

    try {
      const data = await getFieldIssues(auth);
      setIssues(data);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memuat riwayat kendala");
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  return (
    <ScreenShell title="Riwayat Kendala" subtitle="Semua laporan kendala yang pernah diajukan">
      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

      <Card>
        <SectionTitle title="Ringkasan Kendala" caption="Statistik status kendala" />
        <View style={styles.metricGrid}>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Total Kendala</Text>
            <Text style={styles.metricValue}>{issues.length}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Dibuka</Text>
            <Text style={styles.metricValue}>{openIssuesCount}</Text>
          </View>
          <View style={styles.metricPill}>
            <Text style={styles.metricLabel}>Terselesaikan</Text>
            <Text style={styles.metricValue}>{resolvedIssuesCount}</Text>
          </View>
        </View>
        <PrimaryButton
          label="Buat Laporan Baru"
          onPress={() => navigation.navigate({ name: "IssueForm" } as never)}
        />
      </Card>

      {isLoading ? (
        <Card>
          <SkeletonList count={4} />
        </Card>
      ) : issues.length === 0 ? (
        <EmptyState message="Belum ada laporan kendala." />
      ) : (
        <View style={styles.listWrap}>
          {issues.map((issue) => (
            <Pressable
              key={issue.id}
              onPress={() => navigation.navigate({ name: "IssueForm", params: { issueId: issue.id } } as never)}
              style={({ pressed }) => [styles.issueCard, pressed && styles.issueCardPressed]}
            >
              <View style={styles.issueHeader}>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <Badge label={formatIssueStatusLabel(issue.status)} tone={statusTone(issue.status)} />
              </View>
              <View style={styles.issueMetaRow}>
                <Badge label={formatIssueUrgencyLabel(issue.urgency)} tone={urgencyTone(issue.urgency)} />
                <Badge label={issue.category} tone="neutral" />
              </View>
              <Text style={styles.issueDesc} numberOfLines={2}>
                {issue.description}
              </Text>
              <Text style={styles.issueDate}>{formatDateTime(issue.createdAt)}</Text>
              {issue.photoUrls?.length ? (
                <Text style={styles.issuePhotos}>Lampiran: {issue.photoUrls.length} foto</Text>
              ) : null}
            </Pressable>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  metricPill: {
    flexGrow: 1,
    minWidth: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 2,
  },
  metricLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricValue: {
    color: "#184b55",
    fontSize: 18,
    fontWeight: "800",
  },
  listWrap: {
    gap: 10,
  },
  issueCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#c8d9dd",
    backgroundColor: "#fcfefe",
    padding: 12,
    gap: 6,
  },
  issueCardPressed: {
    opacity: 0.7,
  },
  issueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  issueTitle: {
    flex: 1,
    color: "#123d47",
    fontSize: 15,
    fontWeight: "700",
  },
  issueMetaRow: {
    flexDirection: "row",
    gap: 6,
  },
  issueDesc: {
    color: "#3a5f67",
    fontSize: 13,
    lineHeight: 17,
  },
  issueDate: {
    color: "#5a7a82",
    fontSize: 11,
  },
  issuePhotos: {
    color: "#3d6670",
    fontSize: 11,
    fontStyle: "italic",
  },
});