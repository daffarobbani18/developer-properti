import React, { useCallback, useState, useEffect } from "react";
import { AppState, AppStateStatus, Linking, Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, Image, TextInput , StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { FieldStackParamList } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  EmptyState,
  LabeledInput,
  SlideInView,
  SkeletonList,
  StatusBanner,
} from "../../components/ui";
import { c } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import { createCustomerTicket, getCustomerSupportData } from "../../services/api";
import { capturePhoto, pickImages } from "../../services/media";
import { FaqItem, TicketItem } from "../../types";
import { formatDateTime, formatTicketStatusLabel, inferBannerTone } from "../../utils/format";

const TICKET_CATEGORIES: TicketItem["category"][] = [
  "Progres",
  "Kualitas Bangunan",
  "Dokumen",
  "Tagihan",
  "Lainnya",
];

function statusTone(status: TicketItem["status"]): "neutral" | "warning" | "success" | "danger" {
  if (status === "SELESAI" || status === "DITUTUP") {
    return "success";
  }
  if (status === "MENUNGGU_TINDAKAN_CUSTOMER") {
    return "danger";
  }
  if (status === "DIPROSES") {
    return "warning";
  }
  return "neutral";
}

export function FieldSupportScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<FieldStackParamList>>();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"TIKET" | "BUAT" | "FAQ">("TIKET");
  const [searchQuery, setSearchQuery] = useState("");

  const switchTab = (tab: "TIKET" | "BUAT" | "FAQ") => {
    Haptics.selectionAsync();
    setActiveTab(tab);
    setSearchQuery("");
  };

  const [category, setCategory] = useState<TicketItem["category"]>("Progres");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  type AttachmentStatus = "UPLOADING" | "UPLOADED" | "FAILED";
  type AttachmentItem = {
    id: string;
    uri: string;
    filename: string;
    size: number;
    status: AttachmentStatus;
    progress: number;
  };
  
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [viewerImages, setViewerImages] = useState<{uri: string}[]>([]);
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const openTicketsCount = tickets.filter(
    (ticket) => ticket.status === "BARU" || ticket.status === "DIPROSES" || ticket.status === "MENUNGGU_TINDAKAN_CUSTOMER"
  ).length;

  const closedTicketsCount = tickets.filter(
    (ticket) => ticket.status === "SELESAI" || ticket.status === "DITUTUP"
  ).length;

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }
    const result = await getCustomerSupportData(auth);
    setTickets(result.tickets);
    setFaq(result.faq);
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        setIsLoading(true);
        setBanner(null);
        try {
          await loadData();
        } catch (error) {
          if (!cancelled) setBanner(error instanceof Error ? error.message : "Gagal memuat data bantuan");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [loadData])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        setAttachments(prev => prev.map(a => {
          if (a.status === "UPLOADING") {
            return { ...a, status: "FAILED" };
          }
          return a;
        }));
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const processNewPhotoUris = (uris: string[]) => {
    if (uris.length === 0) return;
    
    // Check limit
    if (attachments.length + uris.length > 3) {
      alert("Maksimal 3 foto yang dapat dilampirkan.");
      return;
    }

    const newAtts: AttachmentItem[] = uris.map(uri => ({
      id: Math.random().toString(36).substr(2, 9),
      uri,
      filename: uri.split('/').pop() || 'photo.jpg',
      size: Math.floor(Math.random() * (4 * 1024 * 1024)) + 1024 * 1024, // Mock 1-5MB
      status: "UPLOADING",
      progress: 0,
    }));
    
    setAttachments(prev => [...prev, ...newAtts]);

    newAtts.forEach(att => {
      let prog = 0;
      // 10% chance to fail just to show error state, or let's not force failure, just mock progress
      const willFail = Math.random() < 0.1;
      const interval = setInterval(() => {
        prog += 20;
        setAttachments(prev => prev.map(a => {
          if (a.id === att.id) {
            if (willFail && prog === 60) {
              clearInterval(interval);
              return { ...a, status: "FAILED" };
            }
            if (prog >= 100) {
              clearInterval(interval);
              return { ...a, progress: 100, status: "UPLOADED" };
            }
            return { ...a, progress: prog };
          }
          return a;
        }));
      }, 500);
    });
  };

  const retryUpload = (id: string) => {
    setAttachments(prev => prev.map(a => a.id === id ? { ...a, status: "UPLOADING", progress: 0 } : a));
    let prog = 0;
    const interval = setInterval(() => {
      prog += 20;
      setAttachments(prev => prev.map(a => {
        if (a.id === id) {
          if (prog >= 100) {
            clearInterval(interval);
            return { ...a, progress: 100, status: "UPLOADED" };
          }
          return { ...a, progress: prog };
        }
        return a;
      }));
    }, 500);
  };

  const takePhoto = async () => {
    try {
      const uri = await capturePhoto({ maxSizeBytes: 5 * 1024 * 1024 });
      if (uri) processNewPhotoUris([uri]);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const pickPhotos = async () => {
    try {
      const remainingSlots = 3 - attachments.length;
      if (remainingSlots <= 0) {
         alert("Maksimal 3 foto telah dicapai.");
         return;
      }
      const uris = await pickImages({ selectionLimit: remainingSlots, maxSizeBytes: 5 * 1024 * 1024 });
      processNewPhotoUris(uris);
    } catch (error) {
      if (error instanceof Error) alert(error.message);
    }
  };

  const submitTicket = async () => {
    if (!auth || !subject.trim() || !description.trim()) {
      alert("Harap lengkapi semua bidang");
      return;
    }
    
    // Validate if any is still uploading or failed
    if (attachments.some(a => a.status === "UPLOADING")) {
      alert("Tunggu hingga semua foto selesai diunggah.");
      return;
    }
    if (attachments.some(a => a.status === "FAILED")) {
      alert("Ada foto yang gagal diunggah. Hapus atau coba lagi.");
      return;
    }

    try {
      setIsSubmitting(true);
      const validPhotoUris = attachments.filter(a => a.status === "UPLOADED").map(a => a.uri);
      
      await createCustomerTicket(auth, {
        category,
        subject: subject.trim(),
        description: description.trim(),
        photoUrls: validPhotoUris,
      });
      setSubject("");
      setDescription("");
      setCategory("Progres");
      setAttachments([]);
      setActiveTab("TIKET");
      await loadData();
      setBanner("Tiket bantuan berhasil dibuat.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal membuat tiket bantuan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactWhatsApp = useCallback(() => {
    const raw = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? "628123456789";
    const numeric = raw.replace(/\D/g, "");
    const url = `https://wa.me/${numeric}`;
    void Linking.openURL(url);
  }, []);

  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaq = faq.filter(f => 
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTiketTab = () => (
    <SlideInView direction="up" delay={50} duration={400}>
      <View style={styles.metricCard}>
        <View style={styles.metricCol}>
          <Text style={styles.metricValue}>{openTicketsCount}</Text>
          <Text style={styles.metricLabel}>Aktif</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricValue}>{closedTicketsCount}</Text>
          <Text style={styles.metricLabel}>Selesai</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricValue}>{tickets.length}</Text>
          <Text style={styles.metricLabel}>Total</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Riwayat Tiket</Text>
      {filteredTickets.length === 0 ? (
        <View style={styles.emptyStateWrap}>
           <Ionicons name="document-text-outline" size={48} color={c.neutral300} />
           <Text style={styles.emptyStateTitle}>{searchQuery ? "Tiket tidak ditemukan" : "Belum ada tiket"}</Text>
           <Text style={styles.emptyStateDesc}>{searchQuery ? "Coba gunakan kata kunci yang lain." : "Anda belum memiliki riwayat tiket bantuan. Jika memiliki kendala, jangan ragu untuk membuat tiket baru."}</Text>
           {!searchQuery && (
             <Pressable onPress={() => { Haptics.selectionAsync(); setActiveTab("BUAT"); }} style={styles.emptyStateBtn}>
               <Text style={styles.emptyStateBtnText}>Buat Tiket Baru</Text>
             </Pressable>
           )}
        </View>
      ) : (
        <View style={styles.ticketListContainer}>
          {filteredTickets.map((ticket) => (
            <Pressable
              key={ticket.id}
              onPress={() => navigation.navigate({ name: "TicketDetail", params: { ticketId: ticket.id } } as any)}
              style={({ pressed }) => [styles.ticketCardItem, pressed && styles.pressed]}
            >
              <View style={styles.ticketTopRow}>
                <View style={{flexDirection: "row", alignItems: "center", flex: 1, gap: 6}}>
                  {ticket.hasUnreadReplies && <View style={styles.unreadDot} />}
                  <Text style={[styles.ticketTitle, ticket.hasUnreadReplies && {fontWeight: "900"}]} numberOfLines={1}>{ticket.subject}</Text>
                </View>
                <Badge label={formatTicketStatusLabel(ticket.status)} tone={statusTone(ticket.status)} />
              </View>
              <View style={styles.ticketMetaRow}>
                <Badge label={ticket.category} tone="neutral" />
                <Text style={styles.ticketMeta}>{formatDateTime(ticket.createdAt)}</Text>
              </View>
              {ticket.photoUrls?.length ? (
                <View style={styles.attachmentRow}>
                  <Ionicons name="images-outline" size={14} color={c.neutral500} />
                  <Text style={styles.attachmentText}>{ticket.photoUrls.length} Lampiran</Text>
                </View>
              ) : null}
              <Text style={styles.ticketDesc} numberOfLines={2}>{ticket.description}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </SlideInView>
  );

  const renderBuatTab = () => (
    <SlideInView direction="up" delay={50} duration={400}>
      <View style={styles.cleanCard}>
        <Text style={styles.formTitle}>Lengkapi Detail Tiket</Text>
        
        {/* SLA Information Box */}
        <View style={styles.slaBox}>
           <Text style={styles.slaTitle}>Ekspektasi Layanan (SLA)</Text>
           <View style={styles.slaItem}>
             <Ionicons name="time-outline" size={16} color={c.info.text} />
             <Text style={styles.slaText}>Respon awal: <Text style={{fontWeight: '700'}}>{"<"} 2 jam kerja</Text></Text>
           </View>
           <View style={styles.slaItem}>
             <Ionicons name="calendar-outline" size={16} color={c.info.text} />
             <Text style={styles.slaText}>Penyelesaian: <Text style={{fontWeight: '700'}}>1–3 hari kerja</Text></Text>
           </View>
           <View style={styles.slaItem}>
             <Ionicons name="information-circle-outline" size={16} color={c.info.text} />
             <Text style={styles.slaText}>Operasional: <Text style={{fontWeight: '700'}}>Senin-Jumat, 08:00 - 17:00</Text></Text>
           </View>
        </View>

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pillRow}>
          {TICKET_CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={({ pressed }) => [
                styles.categoryPill,
                item === category && styles.categoryPillActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.categoryPillText, item === category && styles.categoryPillTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <LabeledInput
          label="Subjek"
          placeholder="Contoh: Permintaan update progres"
          value={subject}
          onChangeText={setSubject}
        />

        <LabeledInput
          label="Deskripsi"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Tuliskan detail keluhan Anda"
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.uploadSection}>
          <Text style={styles.label}>Lampiran Foto</Text>
          <Text style={styles.uploadInfoText}>Maksimal 3 foto. Maksimal 5 MB per foto.</Text>
          
          <View style={styles.photoActionRow}>
            <Pressable onPress={takePhoto} disabled={attachments.length >= 3} style={({pressed}) => [styles.uploadBtn, pressed && styles.pressed, attachments.length >= 3 && styles.uploadBtnDisabled]}>
              <Ionicons name="camera" size={20} color={attachments.length >= 3 ? c.neutral400 : c.primaryDark} />
              <Text style={[styles.uploadBtnText, attachments.length >= 3 && {color: c.neutral400}]}>Kamera</Text>
            </Pressable>
            <Pressable onPress={pickPhotos} disabled={attachments.length >= 3} style={({pressed}) => [styles.uploadBtn, pressed && styles.pressed, attachments.length >= 3 && styles.uploadBtnDisabled]}>
              <Ionicons name="images" size={20} color={attachments.length >= 3 ? c.neutral400 : c.primaryDark} />
              <Text style={[styles.uploadBtnText, attachments.length >= 3 && {color: c.neutral400}]}>Galeri</Text>
            </Pressable>
          </View>

          {attachments.length > 0 && (
            <View style={styles.attachmentList}>
              {attachments.map((att, idx) => (
                <View key={att.id} style={styles.attachmentItemRow}>
                  <Pressable 
                    onPress={() => {
                       setViewerImages(attachments.map(a => ({uri: a.uri})));
                       setViewerIndex(idx);
                       setIsViewerVisible(true);
                    }} 
                    style={styles.attachmentThumbBtn}
                  >
                     <Image source={{ uri: att.uri }} style={styles.attachmentThumbImg} />
                     <View style={styles.attachmentThumbOverlay}>
                       <Ionicons name="expand" size={16} color="#ffffff" />
                     </View>
                  </Pressable>
                  
                  <View style={styles.attachmentInfo}>
                     <Text style={styles.attachmentFilename} numberOfLines={1}>{att.filename}</Text>
                     <Text style={styles.attachmentSize}>{(att.size / (1024*1024)).toFixed(1)} MB</Text>
                     
                     {att.status === "UPLOADING" && (
                       <View style={styles.uploadProgressWrap}>
                          <Text style={styles.uploadingText}>Uploading... {att.progress}%</Text>
                          <View style={styles.progressBarBg}>
                             <View style={[styles.progressBarFill, {width: `${att.progress}%`}]} />
                          </View>
                       </View>
                     )}
                     {att.status === "UPLOADED" && (
                       <Text style={styles.uploadedText}><Ionicons name="checkmark-circle" size={12} /> Uploaded</Text>
                     )}
                     {att.status === "FAILED" && (
                       <View style={{flexDirection: "row", alignItems: "center", gap: 8}}>
                         <Text style={styles.failedText}>Upload gagal</Text>
                         <Pressable onPress={() => retryUpload(att.id)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                           <Text style={styles.retryText}>Coba Lagi</Text>
                         </Pressable>
                       </View>
                     )}
                  </View>

                  <Pressable 
                    onPress={() => setAttachments((prev) => prev.filter(a => a.id !== att.id))}
                    style={styles.removeAttachmentBtn}
                    hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                  >
                    <Ionicons name="trash-outline" size={20} color={c.danger.text} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Pressable 
          disabled={isSubmitting}
          onPress={() => void submitTicket()}
          style={({pressed}) => [
            styles.submitBtn,
            isSubmitting && styles.submitBtnDisabled,
            pressed && styles.pressed
          ]}
        >
          <Text style={styles.submitBtnText}>{isSubmitting ? "Mengirim..." : "Kirim Tiket"}</Text>
          {!isSubmitting && <Ionicons name="send" size={18} color="#ffffff" />}
        </Pressable>
      </View>
    </SlideInView>
  );

  const renderFaqTab = () => (
    <SlideInView direction="up" delay={50} duration={400}>
      <Pressable onPress={() => navigation.navigate({ name: "FaqContact" } as any)} style={({ pressed }) => [styles.moreFaqBtn, pressed && styles.pressed]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={styles.moreFaqIcon}>
            <Ionicons name="book-outline" size={22} color={c.primaryDark} />
          </View>
          <View>
            <Text style={styles.moreFaqTitle}>Pusat Pengetahuan</Text>
            <Text style={styles.moreFaqSub}>Lihat seluruh FAQ & Kontak</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={c.neutral400} />
      </Pressable>

      <Text style={styles.sectionTitle}>Pertanyaan Populer</Text>
      {filteredFaq.length === 0 ? (
        <View style={styles.emptyStateWrap}>
           <Ionicons name="library-outline" size={48} color={c.neutral300} />
           <Text style={styles.emptyStateTitle}>{searchQuery ? "FAQ tidak ditemukan" : "FAQ Belum Tersedia"}</Text>
           <Text style={styles.emptyStateDesc}>{searchQuery ? "Coba gunakan kata kunci yang lain." : "Daftar pertanyaan umum sedang diperbarui oleh tim kami."}</Text>
        </View>
      ) : (
        <View style={styles.cleanList}>
          {filteredFaq.map((item, idx) => (
            <View key={item.id}>
              {idx > 0 && <View style={styles.divider} />}
              <View style={styles.faqItem}>
                <View style={styles.faqIconWrap}>
                  <Ionicons name="help-circle" size={24} color={c.primaryLight} />
                </View>
                <View style={styles.faqContent}>
                  <Text style={styles.faqQuestion}>{item.question}</Text>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </SlideInView>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => void loadData()} tintColor="#ffffff" />}
        stickyHeaderIndices={[1]}
      >
        {/* ENTERPRISE CLEAN GLASS HEADER */}
        <LinearGradient 
          colors={[c.primary600, c.primary, c.primaryDark]}
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.heroHeader}
        >
          <LinearGradient 
             colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']}
             style={StyleSheet.absoluteFillObject}
             pointerEvents="none"
          />
          <View style={[styles.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <View style={{flex: 1}} />
              <Pressable onPress={contactWhatsApp} style={({ pressed }) => [styles.whatsappBtn, pressed && styles.pressed]}>
                <Ionicons name="logo-whatsapp" size={20} color="#ffffff" />
                <Text style={styles.whatsappBtnText}>CS</Text>
              </Pressable>
            </View>

            {activeTab !== "BUAT" ? (
              <View style={styles.heroCenter}>
                 <View style={styles.heroTitleWrap}>
                    <Text style={styles.heroKicker}>LAYANAN PENGAWAS</Text>
                    <Text style={styles.heroTitle}>Pusat Bantuan</Text>
                 </View>
              </View>
            ) : (
               <View style={styles.heroCenter}>
                  <View style={styles.heroTitleWrap}>
                     <Text style={styles.heroKicker}>LAYANAN PENGAWAS</Text>
                     <Text style={styles.heroTitle}>Buat Tiket</Text>
                  </View>
               </View>
            )}

            {/* SEARCH BAR */}
            {activeTab !== "BUAT" && (
              <View style={styles.searchContainer}>
                <View style={styles.searchScopeBadge}>
                  <Text style={styles.searchScopeText}>{activeTab === "TIKET" ? "Tiket Saya" : "FAQ"}</Text>
                  <Ionicons name="chevron-down" size={12} color={c.primaryDark} style={{marginLeft: 4}} />
                </View>
                <View style={styles.searchDivider} />
                <Ionicons name="search" size={18} color={c.neutral400} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ketik kata kunci..."
                  placeholderTextColor={c.neutral500}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")} hitSlop={8} style={styles.clearSearchBtn}>
                    <Ionicons name="close-circle" size={18} color={c.neutral400} />
                  </Pressable>
                )}
              </View>
            )}
          </View>
        </LinearGradient>

        {/* TAB SWITCHER */}
        <View style={styles.overlapContainer}>
           <View style={styles.segmentedControl}>
              <Pressable 
                onPress={() => { Haptics.selectionAsync(); setActiveTab("TIKET"); }} 
                style={[styles.segmentBtn, activeTab === "TIKET" && styles.segmentBtnActive]}
              >
                <Ionicons name="ticket-outline" size={16} color={activeTab === "TIKET" ? "#ffffff" : c.neutral500} style={{marginRight: 6}} />
                <Text style={[styles.segmentText, activeTab === "TIKET" && styles.segmentTextActive]}>Tiket Saya</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => { Haptics.selectionAsync(); setActiveTab("BUAT"); }} 
                style={[styles.segmentBtn, activeTab === "BUAT" && styles.segmentBtnActive]}
              >
                <Ionicons name="add-circle-outline" size={16} color={activeTab === "BUAT" ? "#ffffff" : c.neutral500} style={{marginRight: 6}} />
                <Text style={[styles.segmentText, activeTab === "BUAT" && styles.segmentTextActive]}>Buat Tiket</Text>
              </Pressable>

              <Pressable 
                onPress={() => { Haptics.selectionAsync(); setActiveTab("FAQ"); }} 
                style={[styles.segmentBtn, activeTab === "FAQ" && styles.segmentBtnActive]}
              >
                <Ionicons name="help-circle-outline" size={16} color={activeTab === "FAQ" ? "#ffffff" : c.neutral500} style={{marginRight: 6}} />
                <Text style={[styles.segmentText, activeTab === "FAQ" && styles.segmentTextActive]}>FAQ</Text>
              </Pressable>
           </View>
        </View>

        <View style={styles.contentPad}>
           {banner ? <StatusBanner message={banner} tone={inferBannerTone(banner)} /> : null}

           {isLoading ? (
             <SkeletonList count={4} />
           ) : (
             <>
                {activeTab === "TIKET" && renderTiketTab()}
                {activeTab === "BUAT" && renderBuatTab()}
                {activeTab === "FAQ" && renderFaqTab()}
             </>
           )}
        </View>
      </ScrollView>

      <ImageView
        images={viewerImages}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
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
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  whatsappBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25D366",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    gap: 6,
  },
  whatsappBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
  heroHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  heroCenter: {
    paddingBottom: 20,
    gap: 8,
  },
  heroTitleWrap: {
    paddingHorizontal: 4,
    flex: 1,
  },
  heroKicker: {
    color: c.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  overlapContainer: {
    marginTop: -40,
    marginBottom: 24,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 6,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
    elevation: 8,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 18,
  },
  segmentBtnActive: {
    backgroundColor: c.primaryDark,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "600",
    color: c.neutral500,
  },
  segmentTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 8,
  },
  searchScopeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: c.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  searchScopeText: {
    fontSize: 12,
    fontWeight: "800",
    color: c.primaryDark,
  },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: c.neutral200,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: c.neutral900,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  clearSearchBtn: {
    padding: 4,
  },
  tabBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  emptyStateWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.neutral200,
    borderStyle: "dashed",
    marginTop: 8,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDesc: {
    fontSize: 13,
    color: c.neutral500,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyStateBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: c.primaryLight,
    borderRadius: 16,
  },
  emptyStateBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: c.primaryDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.danger.text,
  },
  contentPad: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 16,
  },
  ticketListContainer: {
    gap: 12,
  },
  ticketCardItem: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
    gap: 12,
  },
  cleanList: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  divider: {
    height: 1,
    backgroundColor: c.neutral200,
    marginVertical: 12,
  },
  ticketItem: {
    paddingVertical: 8,
    gap: 8,
  },
  ticketTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  ticketTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: c.neutral900,
  },
  ticketMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketMeta: {
    fontSize: 12,
    color: c.neutral500,
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attachmentText: {
    fontSize: 12,
    color: c.neutral500,
    fontWeight: "600",
  },
  ticketDesc: {
    fontSize: 13,
    color: c.neutral600,
    lineHeight: 18,
  },
  metricCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.neutral100,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  metricCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  metricDivider: {
    width: 1,
    backgroundColor: c.neutral200,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "900",
    color: c.primaryDark,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: c.neutral500,
    textTransform: "uppercase",
  },
  cleanCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 16,
  },
  slaBox: {
    backgroundColor: c.info.bg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(14, 165, 233, 0.2)",
  },
  slaTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: c.info.text,
    marginBottom: 8,
  },
  slaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
    gap: 8,
  },
  slaText: {
    flex: 1,
    fontSize: 12,
    color: c.info.text,
    lineHeight: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: c.neutral700,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: c.neutral200,
    backgroundColor: c.neutral50,
  },
  categoryPillActive: {
    borderColor: c.primary,
    backgroundColor: c.primaryLight,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral600,
  },
  categoryPillTextActive: {
    color: c.primaryDark,
    fontWeight: "800",
  },
  uploadSection: {
    marginBottom: 24,
    marginTop: 8,
  },
  uploadInfoText: {
    fontSize: 12,
    color: c.neutral500,
    marginBottom: 12,
    marginTop: -4,
  },
  photoActionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  uploadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 12,
    backgroundColor: c.primaryLight,
    gap: 8,
  },
  uploadBtnDisabled: {
    backgroundColor: c.neutral200,
    opacity: 0.7,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: c.primaryDark,
  },
  attachmentList: {
    gap: 12,
  },
  attachmentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: c.neutral200,
  },
  attachmentThumbBtn: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    position: "relative",
  },
  attachmentThumbImg: {
    width: "100%",
    height: "100%",
  },
  attachmentThumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentFilename: {
    fontSize: 14,
    fontWeight: "700",
    color: c.neutral900,
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: c.neutral500,
    marginBottom: 4,
  },
  uploadProgressWrap: {
    marginTop: 4,
  },
  uploadingText: {
    fontSize: 11,
    color: c.info.text,
    marginBottom: 4,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 4,
    backgroundColor: c.neutral200,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: c.info.text,
    borderRadius: 2,
  },
  uploadedText: {
    fontSize: 12,
    color: c.success.text,
    fontWeight: "600",
  },
  failedText: {
    fontSize: 12,
    color: c.danger.text,
    fontWeight: "600",
  },
  retryText: {
    fontSize: 12,
    color: c.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  removeAttachmentBtn: {
    padding: 8,
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
  moreFaqBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: c.neutral100,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    justifyContent: "space-between",
  },
  moreFaqIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  moreFaqTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
  },
  moreFaqSub: {
    fontSize: 13,
    color: c.neutral500,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    gap: 12,
  },
  faqIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: c.neutral50,
    alignItems: "center",
    justifyContent: "center",
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 13,
    color: c.neutral600,
    lineHeight: 18,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
