const fs = require('fs');

const file = 'src/screens/customer/CustomerBillingScreen.tsx';

const newContent = `import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CustomerStackParamList } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import {
   Badge,
   EmptyState,
   SlideInView,
   SkeletonList,
   StatusBanner,
} from "../../components/ui";
import { c } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerBillingData, submitPaymentProof } from "../../services/api";
import { capturePhoto, pickImages, uploadPhotoForPayment } from "../../services/media";
import { BillingSummary, InvoiceItem, PaymentItem } from "../../types";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatInvoiceStatusLabel,
  inferBannerTone,
} from "../../utils/format";

export function CustomerBillingScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();

  const [summary, setSummary] = useState<BillingSummary | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");
  const [amountInput, setAmountInput] = useState("");
  const [selectedProofPhotoUri, setSelectedProofPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!auth) return;
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
          if (!cancelled) setBanner(error instanceof Error ? error.message : "Gagal memuat data tagihan");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadData])
  );

  const payableInvoices = useMemo(() => invoices.filter((item) => item.status !== "LUNAS"), [invoices]);
  const paidInvoices = useMemo(() => invoices.filter((item) => item.status === "LUNAS"), [invoices]);

  const selectedInvoice = useMemo(
    () => invoices.find((item) => item.id === selectedInvoiceId) ?? null,
    [invoices, selectedInvoiceId]
  );

  const submitProof = useCallback(async () => {
    if (!auth || !selectedInvoiceId) {
      setBanner("Pilih invoice terlebih dahulu.");
      return;
    }
    const amount = Number(amountInput);
    if (Number.isNaN(amount) || amount <= 0) {
      setBanner("Nominal pembayaran tidak valid.");
      return;
    }
    if (!selectedProofPhotoUri) {
       setBanner("Lampirkan foto bukti pembayaran terlebih dahulu.");
       return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      const uploadResult = await uploadPhotoForPayment(selectedProofPhotoUri, auth);
      const resolvedProofUrl = uploadResult?.url || selectedProofPhotoUri;

      await submitPaymentProof(auth, {
        invoiceId: selectedInvoiceId,
        amount,
        proofUrl: resolvedProofUrl,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setSelectedProofPhotoUri(null);
      await loadData();
      setBanner("Bukti pembayaran berhasil dikirim.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengirim bukti pembayaran");
    } finally {
      setIsSubmitting(false);
    }
  }, [amountInput, auth, loadData, selectedInvoiceId, selectedProofPhotoUri]);

  const pickProofPhoto = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const uris = await pickImages({ selectionLimit: 1 });
      if (uris[0]) {
        setSelectedProofPhotoUri(uris[0]);
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memilih foto bukti pembayaran.");
    }
  }, []);

  const totalTagihan = payableInvoices.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
      >
        {/* FINTECH STYLE HEADER */}
        <LinearGradient 
          colors={totalTagihan > 0 ? [c.danger.bg, "#7f1d1d"] : [c.success.bg, "#14532d"]} 
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} 
          style={styles.heroHeader}
        >
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color={totalTagihan > 0 ? c.danger.text : c.success.text} />
              </Pressable>
              <Text style={[styles.heroHeaderTitle, { color: totalTagihan > 0 ? c.danger.text : c.success.text }]}>Keuangan</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.heroCenter}>
              <Text style={[styles.heroLabel, { color: totalTagihan > 0 ? "rgba(153,27,27,0.7)" : "rgba(20,83,45,0.7)" }]}>
                 {totalTagihan > 0 ? "TOTAL TAGIHAN" : "STATUS PEMBAYARAN"}
              </Text>
              {totalTagihan > 0 ? (
                 <View style={styles.heroAmountRow}>
                   <Text style={[styles.heroCurrency, { color: c.danger.text }]}>Rp</Text>
                   <Text style={[styles.heroAmount, { color: c.danger.text }]}>{formatCurrency(totalTagihan).replace('Rp', '').trim()}</Text>
                 </View>
              ) : (
                 <View style={styles.heroAmountRow}>
                   <Ionicons name="checkmark-circle" size={42} color={c.success.text} style={{ marginRight: 8 }} />
                   <Text style={[styles.heroAmount, { color: c.success.text }]}>Lunas</Text>
                 </View>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.contentPad}>
           {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

           {/* PAYMENT UPLOAD SECTION */}
           {totalTagihan > 0 && selectedInvoice && (
             <SlideInView direction="up" delay={50} duration={400} style={styles.paymentSection}>
                <Text style={styles.sectionTitle}>Bayar Tagihan: {selectedInvoice.name}</Text>
                
                <Pressable 
                  onPress={pickProofPhoto} 
                  style={({pressed}) => [styles.uploadArea, pressed && styles.pressed]}
                >
                   {selectedProofPhotoUri ? (
                      <View style={styles.uploadPreviewWrap}>
                        <Image source={{ uri: selectedProofPhotoUri }} style={styles.uploadPreview} />
                        <View style={styles.uploadOverlay}>
                          <Ionicons name="camera-reverse" size={24} color="#ffffff" />
                          <Text style={styles.uploadOverlayText}>Ganti Foto</Text>
                        </View>
                      </View>
                   ) : (
                      <View style={styles.uploadEmpty}>
                         <View style={styles.uploadIconWrap}>
                            <Ionicons name="cloud-upload-outline" size={28} color={c.primary} />
                         </View>
                         <Text style={styles.uploadTitle}>Upload Bukti Pembayaran</Text>
                         <Text style={styles.uploadSub}>Tap untuk membuka Galeri/Kamera</Text>
                      </View>
                   )}
                </Pressable>

                <Pressable 
                  disabled={isSubmitting || !selectedProofPhotoUri}
                  onPress={() => void submitProof()}
                  style={({pressed}) => [
                    styles.submitBtn,
                    (!selectedProofPhotoUri || isSubmitting) && styles.submitBtnDisabled,
                    pressed && styles.pressed
                  ]}
                >
                  <Text style={styles.submitBtnText}>{isSubmitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}</Text>
                  {!isSubmitting && <Ionicons name="arrow-forward" size={18} color="#ffffff" />}
                </Pressable>
             </SlideInView>
           )}

           {/* INVOICE HISTORY (CLEAN LIST) */}
           <SlideInView direction="up" delay={150} duration={400} style={{ marginTop: totalTagihan > 0 ? 40 : 16 }}>
              <Text style={styles.sectionTitle}>Riwayat Tagihan</Text>
              
              {paidInvoices.length === 0 ? (
                <EmptyState message="Belum ada riwayat tagihan." />
              ) : (
                <View style={styles.cleanList}>
                  {paidInvoices.map((inv, idx) => (
                    <View key={inv.id}>
                      {idx > 0 && <View style={styles.divider} />}
                      <View style={styles.cleanListItem}>
                        <View style={styles.cleanListLeft}>
                          <Text style={styles.invoiceName}>{inv.name}</Text>
                          <Text style={styles.invoiceMeta}>Jatuh tempo: {formatDate(inv.dueDate)}</Text>
                        </View>
                        <View style={styles.cleanListRight}>
                           <Text style={styles.invoiceAmount}>{formatCurrency(inv.amount)}</Text>
                           <View style={[styles.statusPill, { backgroundColor: c.success.bg }]}>
                             <Text style={[styles.statusPillText, { color: c.success.text }]}>Lunas</Text>
                           </View>
                        </View>
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
    backgroundColor: "#ffffff",
  },
  heroHeader: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroSafeArea: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  heroCenter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroAmountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  heroCurrency: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 6,
    marginRight: 4,
  },
  heroAmount: {
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: -2,
    lineHeight: 60,
  },
  contentPad: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 16,
  },
  paymentSection: {
    marginBottom: 24,
  },
  uploadArea: {
    width: "100%",
    height: 180,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: c.neutral300,
    borderRadius: 24,
    backgroundColor: c.neutral50,
    overflow: "hidden",
    marginBottom: 16,
  },
  uploadEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: c.primary100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: c.neutral900,
    marginBottom: 4,
  },
  uploadSub: {
    fontSize: 13,
    color: c.neutral500,
    fontWeight: "500",
  },
  uploadPreviewWrap: {
    flex: 1,
  },
  uploadPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadOverlayText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.primary,
    height: 56,
    borderRadius: 16,
    gap: 8,
  },
  submitBtnDisabled: {
    backgroundColor: c.neutral300,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  cleanList: {
    marginTop: 8,
  },
  cleanListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  cleanListLeft: {
    flex: 1,
  },
  cleanListRight: {
    alignItems: "flex-end",
  },
  invoiceName: {
    fontSize: 16,
    fontWeight: "700",
    color: c.neutral900,
    marginBottom: 4,
  },
  invoiceMeta: {
    fontSize: 13,
    color: c.neutral500,
  },
  invoiceAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 6,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: c.neutral200,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
`;

fs.writeFileSync(file, newContent);
console.log('CustomerBillingScreen successfully redesigned.');
