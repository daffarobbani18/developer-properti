import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform , StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

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
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            <View style={{ height: 24 }} />
            <View style={styles.heroTitleWrap}>
              <Text style={styles.heroKicker}>PEMBAYARAN & INVOICE</Text>
              <Text style={styles.heroTitle}>Tagihan Anda</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.overlapContainer}>
           {banner ? (
             <SlideInView direction="up" delay={0} style={{ marginBottom: 16 }}>
               <StatusBanner message={banner} tone={inferBannerTone(banner)} />
             </SlideInView>
           ) : null}

           {/* Total Tagihan Card */}
           <SlideInView direction="up" delay={50} duration={400}>
             <View style={styles.summaryCard}>
               <View style={styles.summaryHeader}>
                 <View style={styles.summaryIconWrap}>
                   <Ionicons name="wallet-outline" size={16} color={c.primary} />
                 </View>
                 <Text style={styles.summaryLabel}>
                    {totalTagihan > 0 ? "TOTAL TAGIHAN BERJALAN" : "STATUS PEMBAYARAN"}
                 </Text>
               </View>

               <View style={styles.summaryContent}>
                 {totalTagihan > 0 ? (
                    <View style={styles.summaryAmountRow}>
                      <Text style={styles.summaryCurrency}>Rp</Text>
                      <Text style={styles.summaryAmount}>{formatCurrency(totalTagihan).replace('Rp', '').trim()}</Text>
                    </View>
                 ) : (
                    <View style={styles.summaryAmountRow}>
                      <Ionicons name="checkmark-circle" size={32} color={c.success.bg} style={{ marginRight: 8 }} />
                      <Text style={styles.summaryAmount}>Lunas</Text>
                    </View>
                 )}
               </View>
               
               {totalTagihan > 0 && (
                 <View style={styles.summaryFooter}>
                   <Ionicons name="information-circle-outline" size={14} color={c.neutral400} />
                   <Text style={styles.summaryFooterText}>Pembayaran diverifikasi dalam 1x24 jam</Text>
                 </View>
               )}
             </View>
           </SlideInView>

           {/* PAYMENT UPLOAD SECTION */}
           {totalTagihan > 0 && selectedInvoice && (
             <SlideInView direction="up" delay={100} duration={400} style={styles.paymentSection}>
                <View style={styles.paymentSectionHeader}>
                   <View style={{ flex: 1 }}>
                     <Text style={styles.sectionTitle}>Bayar Tagihan</Text>
                     <Text style={styles.invoiceActiveName}>{selectedInvoice.name}</Text>
                   </View>
                   <Text style={styles.invoiceActiveAmount}>{formatCurrency(selectedInvoice.amount)}</Text>
                </View>
                
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
                  <Text style={[styles.submitBtnText, (!selectedProofPhotoUri || isSubmitting) && styles.submitBtnTextDisabled]}>{isSubmitting ? "Mengirim..." : "Kirim Bukti Pembayaran"}</Text>
                  {!isSubmitting && <Ionicons name="arrow-forward" size={18} color={(!selectedProofPhotoUri || isSubmitting) ? c.neutral400 : "#ffffff"} />}
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
    marginBottom: 8,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FBBF24",
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: -1,
  },
  overlapContainer: {
    paddingHorizontal: 24,
    marginTop: -40,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: c.neutral500,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  summaryContent: {
    marginBottom: 8,
  },
  summaryAmountRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  summaryCurrency: {
    fontSize: 20,
    fontWeight: "700",
    color: c.neutral900,
    marginTop: 6,
    marginRight: 4,
  },
  summaryAmount: {
    fontSize: 44,
    fontWeight: "900",
    color: c.neutral900,
    letterSpacing: -1.5,
    lineHeight: 50,
  },
  summaryFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: c.neutral100,
  },
  summaryFooterText: {
    fontSize: 12,
    color: c.neutral400,
    marginLeft: 6,
    fontWeight: "500",
  },
  contentPad: {
    paddingHorizontal: 24,
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
  paymentSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  invoiceActiveName: {
    fontSize: 14,
    color: c.neutral500,
    fontWeight: "600",
  },
  invoiceActiveAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: c.primary600,
  },
  uploadArea: {
    width: "100%",
    height: 180,
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    borderColor: c.neutral300,
    borderStyle: "dashed",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    overflow: "hidden",
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
    backgroundColor: "#E2E8F0",
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
    ...StyleSheet.absoluteFillObject,
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
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: c.neutral300,
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  submitBtnTextDisabled: {
    color: c.neutral500,
  },
  cleanList: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 8,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  cleanListItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
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
