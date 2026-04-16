import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  SecondaryButton,
  ScreenShell,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerBillingData, submitPaymentProof } from "../../services/api";
import { capturePhoto, pickImages } from "../../services/media";
import { BillingSummary, InvoiceItem, PaymentItem } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatInvoiceStatusLabel,
  formatPaymentStatusLabel,
  inferBannerTone,
} from "../../utils/format";

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

function toneByPaymentStatus(status: PaymentItem["status"]): "warning" | "success" {
  return status === "DIKONFIRMASI" ? "success" : "warning";
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
  const [selectedProofPhotoUri, setSelectedProofPhotoUri] = useState<string | null>(null);
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

  const selectedInvoice = useMemo(
    () => invoices.find((item) => item.id === selectedInvoiceId) ?? null,
    [invoices, selectedInvoiceId]
  );

  const submitProof = useCallback(async () => {
    const resolvedProofUrl = selectedProofPhotoUri ?? proofUrl.trim();

    if (!auth || !selectedInvoiceId || !resolvedProofUrl) {
      setBanner("Pilih invoice dan lampirkan bukti pembayaran (kamera/galeri/URL).");
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
        proofUrl: resolvedProofUrl,
      });

      setProofUrl("");
      setSelectedProofPhotoUri(null);
      await loadData();
      setBanner("Bukti pembayaran berhasil dikirim.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengirim bukti pembayaran");
    } finally {
      setIsSubmitting(false);
    }
  }, [amountInput, auth, loadData, proofUrl, selectedInvoiceId, selectedProofPhotoUri]);

  const takeProofPhoto = useCallback(async () => {
    try {
      const uri = await capturePhoto();
      if (uri) {
        setSelectedProofPhotoUri(uri);
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengambil foto bukti pembayaran.");
    }
  }, []);

  const pickProofPhoto = useCallback(async () => {
    try {
      const uris = await pickImages({ selectionLimit: 1 });
      if (uris[0]) {
        setSelectedProofPhotoUri(uris[0]);
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memilih foto bukti pembayaran.");
    }
  }, []);

  return (
    <ScreenShell title="Tagihan & Pembayaran" subtitle="Pantau invoice dan kirim bukti transfer">
      {summary ? (
        <Card>
          <SectionTitle
            title="Ringkasan Pembayaran"
            caption={`Skema pembayaran aktif: ${summary.paymentScheme}`}
          />
          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Total Harga</Text>
              <Text style={styles.metricValue}>{formatCurrency(summary.totalPrice)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Sudah Dibayar</Text>
              <Text style={styles.metricValue}>{formatCurrency(summary.paid)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Sisa Tagihan</Text>
              <Text style={styles.metricValue}>{formatCurrency(summary.outstanding)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Cicilan Bulanan</Text>
              <Text style={styles.metricValue}>{formatCurrency(summary.monthlyInstallment)}</Text>
            </View>
          </View>
        </Card>
      ) : null}

      <Card>
        <SectionTitle
          title="Unggah Bukti Pembayaran"
          caption="Pilih invoice aktif lalu kirim bukti transfer"
        />

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

            {selectedInvoice ? (
              <View style={styles.selectedInvoiceCard}>
                <View style={styles.listItemTop}>
                  <Text style={styles.invoiceName}>{selectedInvoice.name}</Text>
                  <Badge
                    label={formatInvoiceStatusLabel(selectedInvoice.status)}
                    tone={toneByInvoiceStatus(selectedInvoice.status)}
                  />
                </View>
                <Text style={styles.invoiceMeta}>Jatuh tempo: {formatDate(selectedInvoice.dueDate)}</Text>
              </View>
            ) : null}

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

            <Text style={styles.helperText}>Anda dapat menggunakan URL atau lampiran foto dari kamera/galeri.</Text>

            <View style={styles.photoActionRow}>
              <SecondaryButton label="Ambil Foto Bukti" onPress={() => void takeProofPhoto()} />
              <SecondaryButton label="Pilih dari Galeri" onPress={() => void pickProofPhoto()} />
            </View>

            {selectedProofPhotoUri ? (
              <View style={styles.photoItemRow}>
                <Text style={styles.photoItemText}>{selectedProofPhotoUri}</Text>
                <Pressable
                  onPress={() => setSelectedProofPhotoUri(null)}
                  style={({ pressed }) => [styles.pill, pressed && styles.pillPressed]}
                >
                  <Text style={styles.pillText}>Hapus</Text>
                </Pressable>
              </View>
            ) : null}

            <PrimaryButton
              label={isSubmitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}
              onPress={() => void submitProof()}
              disabled={isSubmitting}
            />
          </>
        )}
      </Card>

      {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

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
                        label={formatInvoiceStatusLabel(invoice.status)}
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
                    <View style={styles.listItemTop}>
                      <Text style={styles.invoiceName}>{item.invoiceId}</Text>
                      <Badge
                        label={formatPaymentStatusLabel(item.status)}
                        tone={toneByPaymentStatus(item.status)}
                      />
                    </View>
                    <Text style={styles.invoiceMeta}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.invoiceMeta}>Metode: {item.method}</Text>
                    {item.proofUrl ? <Text style={styles.invoiceMeta}>Bukti: {item.proofUrl}</Text> : null}
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
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCard: {
    flexGrow: 1,
    flexBasis: "48%",
    minHeight: 72,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "center",
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
    fontSize: 14,
    fontWeight: "800",
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
  selectedInvoiceCard: {
    borderWidth: 1,
    borderColor: "#c6dbde",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#f7fcfd",
    gap: 2,
  },
  helperText: {
    color: "#486f78",
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
  photoActionRow: {
    gap: 8,
  },
  photoItemRow: {
    borderWidth: 1,
    borderColor: "#c6dbde",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#f7fcfd",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  photoItemText: {
    flex: 1,
    color: "#3a646d",
    fontSize: 12,
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
