import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SectionTitle,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerBillingData, submitPaymentProof } from "../../services/api";
import { BillingSummary, InvoiceItem, PaymentItem } from "../../types";
import { formatCurrency, formatDate, formatDateTime } from "../../utils/format";

function toneByInvoiceStatus(
  status: InvoiceItem["status"]
): "neutral" | "warning" | "danger" | "success" {
  if (status === "LUNAS") {
    return "success";
  }
  if (status === "JATUH_TEMPO" || status === "TERLAMBAT") {
    return "danger";
  }
  if (status === "MENUNGGU_VERIFIKASI") {
    return "warning";
  }
  return "neutral";
}

export function CustomerBillingScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [amountInput, setAmountInput] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    const data = await getCustomerBillingData(auth);
    setSummary(data.summary);
    setInvoices(data.invoices);
    setPayments(data.payments);

    const payable = data.invoices.find((item) => item.status !== "LUNAS");
    if (payable && !selectedInvoiceId) {
      setSelectedInvoiceId(payable.id);
      setAmountInput(String(payable.amount));
    }
  }, [auth, selectedInvoiceId]);

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
            setBanner(error instanceof Error ? error.message : "Gagal memuat data tagihan");
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

  useEffect(() => {
    const invoice = invoices.find((item) => item.id === selectedInvoiceId);
    if (invoice) {
      setAmountInput(String(invoice.amount));
    }
  }, [invoices, selectedInvoiceId]);

  const payableInvoices = useMemo(
    () => invoices.filter((item) => item.status !== "LUNAS"),
    [invoices]
  );

  const submitProof = useCallback(async () => {
    if (!auth || !selectedInvoiceId || !proofUrl.trim()) {
      setBanner("Pilih invoice dan isi URL bukti pembayaran.");
      return;
    }

    const amount = Number(amountInput);
    if (Number.isNaN(amount) || amount <= 0) {
      setBanner("Nominal pembayaran tidak valid.");
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      await submitPaymentProof(auth, {
        invoiceId: selectedInvoiceId,
        amount,
        proofUrl: proofUrl.trim(),
      });

      setProofUrl("");
      await loadData();
      setBanner("Bukti pembayaran berhasil dikirim.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengirim bukti pembayaran");
    } finally {
      setIsSubmitting(false);
    }
  }, [amountInput, auth, loadData, proofUrl, selectedInvoiceId]);

  return (
    <ScreenShell title="Tagihan & Pembayaran" subtitle="Pantau invoice dan kirim bukti transfer">
      {summary ? (
        <Card>
          <SectionTitle title="Ringkasan Pembayaran" />
          <Text style={styles.summaryText}>Skema: {summary.paymentScheme}</Text>
          <Text style={styles.summaryText}>Total harga: {formatCurrency(summary.totalPrice)}</Text>
          <Text style={styles.summaryText}>Sudah dibayar: {formatCurrency(summary.paid)}</Text>
          <Text style={styles.summaryText}>Sisa tagihan: {formatCurrency(summary.outstanding)}</Text>
          <Text style={styles.summaryText}>
            Estimasi cicilan bulanan: {formatCurrency(summary.monthlyInstallment)}
          </Text>
        </Card>
      ) : null}

      <Card>
        <SectionTitle title="Unggah Bukti Pembayaran" />

        {payableInvoices.length === 0 ? (
          <EmptyState message="Semua invoice sudah lunas." />
        ) : (
          <>
            <Text style={styles.label}>Pilih Invoice</Text>
            <View style={styles.pillRow}>
              {payableInvoices.map((invoice) => (
                <Pressable
                  key={invoice.id}
                  onPress={() => setSelectedInvoiceId(invoice.id)}
                  style={({ pressed }) => [
                    styles.pill,
                    selectedInvoiceId === invoice.id && styles.pillActive,
                    pressed && styles.pillPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.pillText,
                      selectedInvoiceId === invoice.id && styles.pillTextActive,
                    ]}
                  >
                    {invoice.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <LabeledInput
              label="Nominal Transfer"
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <LabeledInput
              label="URL Bukti Transfer"
              placeholder="https://..."
              value={proofUrl}
              onChangeText={setProofUrl}
            />

            <PrimaryButton
              label={isSubmitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}
              onPress={() => void submitProof()}
              disabled={isSubmitting}
            />
          </>
        )}
      </Card>

      {banner ? (
        <Card>
          <Text style={styles.bannerText}>{banner}</Text>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat data billing...</Text>
        </Card>
      ) : (
        <>
          <Card>
            <SectionTitle title="Daftar Invoice" />
            {invoices.length === 0 ? (
              <EmptyState message="Belum ada invoice tersedia." />
            ) : (
              <View style={styles.listWrap}>
                {invoices.map((invoice) => (
                  <View key={invoice.id} style={styles.listItem}>
                    <View style={styles.listItemTop}>
                      <Text style={styles.invoiceName}>{invoice.name}</Text>
                      <Badge
                        label={invoice.status}
                        tone={toneByInvoiceStatus(invoice.status)}
                      />
                    </View>
                    <Text style={styles.invoiceMeta}>{formatCurrency(invoice.amount)}</Text>
                    <Text style={styles.invoiceMeta}>Jatuh tempo: {formatDate(invoice.dueDate)}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card>
            <SectionTitle title="Riwayat Pembayaran" />
            {payments.length === 0 ? (
              <EmptyState message="Belum ada riwayat pembayaran." />
            ) : (
              <View style={styles.listWrap}>
                {payments.map((item) => (
                  <View key={item.id} style={styles.listItem}>
                    <Text style={styles.invoiceName}>{item.invoiceId}</Text>
                    <Text style={styles.invoiceMeta}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.invoiceMeta}>Metode: {item.method}</Text>
                    <Text style={styles.invoiceMeta}>Status: {item.status}</Text>
                    <Text style={styles.invoiceMeta}>{formatDateTime(item.paidAt)}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryText: {
    color: "#305b65",
    fontSize: 13,
    fontWeight: "700",
  },
  label: {
    color: "#1f4f5a",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#97bbc0",
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: "#f8fcfc",
  },
  pillActive: {
    borderColor: "#1e6f78",
    backgroundColor: "#dff3f5",
  },
  pillPressed: {
    opacity: 0.82,
  },
  pillText: {
    color: "#3a646d",
    fontSize: 12,
    fontWeight: "700",
  },
  pillTextActive: {
    color: "#114a53",
  },
  bannerText: {
    color: "#1f5661",
    fontSize: 13,
    fontWeight: "700",
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
  },
  listWrap: {
    gap: 8,
  },
  listItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c4d8db",
    backgroundColor: "#f8fcfd",
    padding: 10,
    gap: 2,
  },
  listItemTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  invoiceName: {
    flex: 1,
    color: "#123e48",
    fontSize: 14,
    fontWeight: "800",
  },
  invoiceMeta: {
    color: "#3f6972",
    fontSize: 12,
  },
});
