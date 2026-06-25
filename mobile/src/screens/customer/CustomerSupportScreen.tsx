import React, { useCallback, useState, useEffect } from "react";
import { AppState, AppStateStatus, Linking, Pressable, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, Image , StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CustomerStackParamList } from "../../navigation/types";
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

const FaqAccordion = ({ item, isLast }: { item: FaqItem; isLast: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <View style={[styles.faqRowWrapper, !isLast && styles.faqRowBorder]}>
      <Pressable 
        onPress={() => { Haptics.selectionAsync(); setExpanded(!expanded); }}
        style={({pressed}) => [styles.faqRowHeader, pressed && styles.faqRowHeaderPressed]}
      >
        <Text style={[styles.faqQuestion, expanded && {color: c.primary}]} numberOfLines={expanded ? undefined : 2}>
          {item.question}
        </Text>
        <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={expanded ? c.primary : c.neutral400} />
      </Pressable>
      {expanded && (
        <View style={styles.faqBody}>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      )}
    </View>
  );
};

export function CustomerSupportScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"TIKET" | "BUAT" | "FAQ">("TIKET");

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
      {tickets.length === 0 ? (
        <View style={styles.emptyStateWrap}>
           <View style={styles.emptyStateIconWrap}>
             <Ionicons name="document-text-outline" size={40} color={c.neutral400} />
           </View>
           <Text style={styles.emptyStateTitle}>Belum ada tiket</Text>
           <Text style={styles.emptyStateDesc}>Anda belum memiliki riwayat tiket bantuan. Jika memiliki kendala, jangan ragu untuk membuat tiket baru.</Text>
           <Pressable onPress={() => { Haptics.selectionAsync(); setActiveTab("BUAT"); }} style={styles.emptyStateBtn}>
             <Text style={styles.emptyStateBtnText}>Buat Tiket Baru</Text>
           </Pressable>
        </View>
      ) : (
        <View style={styles.ticketListContainer}>
           {tickets.map((ticket) => {
             let iconName: keyof typeof Ionicons.glyphMap = "chatbubbles-outline";
             if (ticket.category === "Progres") iconName = "construct-outline";
             if (ticket.category === "Tagihan") iconName = "wallet-outline";
             if (ticket.category === "Dokumen") iconName = "document-text-outline";

             let iconBgColor = "rgba(37, 99, 235, 0.08)"; // Default Primary
             let iconColor = c.primary;

             if (ticket.status === "SELESAI" || ticket.status === "DITUTUP") {
               iconBgColor = "rgba(16, 185, 129, 0.12)";
               iconColor = c.success.text;
             } else if (ticket.status === "DIPROSES") {
               iconBgColor = "rgba(245, 158, 11, 0.12)";
               iconColor = c.warning.text;
             } else if (ticket.status === "MENUNGGU_TINDAKAN_CUSTOMER") {
               iconBgColor = "rgba(239, 68, 68, 0.12)";
               iconColor = c.danger.text;
             }

             return (
               <Pressable
                 key={ticket.id}
                 onPress={() => navigation.navigate({ name: "TicketDetail", params: { ticketId: ticket.id } } as any)}
                 style={({ pressed }) => [styles.ticketCard, pressed && styles.ticketCardPressed]}
               >
                 <View style={[styles.ticketIconWrap, { backgroundColor: iconBgColor }]}>
                   <Ionicons name={iconName} size={24} color={iconColor} />
                   {ticket.hasUnreadReplies && <View style={styles.unreadDotAbsolute} />}
                 </View>
                 <View style={styles.ticketInfoWrap}>
                   <View style={styles.ticketHeaderTitleRow}>
                     <Text style={[styles.ticketTitle, ticket.hasUnreadReplies && {fontWeight: "900"}]} numberOfLines={1}>{ticket.subject}</Text>
                   </View>
                   <Text style={styles.ticketDesc} numberOfLines={1}>{ticket.description}</Text>
                   <View style={styles.ticketBadgeRow}>
                     <Badge label={formatTicketStatusLabel(ticket.status)} tone={statusTone(ticket.status)} />
                     <Text style={styles.ticketMeta}>{formatDateTime(ticket.createdAt)}</Text>
                     {ticket.photoUrls?.length ? (
                       <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 'auto'}}>
                         <Ionicons name="images-outline" size={14} color={c.neutral400} />
                       </View>
                     ) : null}
                   </View>
                 </View>
                 <Ionicons name="chevron-forward" size={20} color={c.neutral300} style={{ marginLeft: 8 }} />
               </Pressable>
             );
           })}
        </View>
      )}
    </SlideInView>
  );

  const renderBuatTab = () => (
    <SlideInView direction="up" delay={50} duration={400}>
      <View style={styles.cleanCard}>
        <Text style={styles.formTitle}>Formulir Bantuan</Text>
        <Text style={styles.formSub}>Jelaskan kendala Anda secara detail agar tim kami dapat merespons dengan solusi terbaik.</Text>
        
        {/* SLA Information Box */}
        <View style={styles.slaBox}>
           <Text style={styles.slaTitle}>Ekspektasi Layanan (SLA)</Text>
           <View style={styles.slaItem}>
             <Ionicons name="time-outline" size={16} color={c.primary} />
             <Text style={styles.slaText}>Respon awal: <Text style={{fontWeight: '800'}}>{"<"} 2 jam kerja</Text></Text>
           </View>
           <View style={styles.slaItem}>
             <Ionicons name="calendar-outline" size={16} color={c.primary} />
             <Text style={styles.slaText}>Penyelesaian: <Text style={{fontWeight: '800'}}>1–3 hari kerja</Text></Text>
           </View>
           <View style={styles.slaItem}>
             <Ionicons name="information-circle-outline" size={16} color={c.primary} />
             <Text style={styles.slaText}>Operasional: <Text style={{fontWeight: '800'}}>Senin-Jumat, 08:00 - 17:00</Text></Text>
           </View>
        </View>

        <Text style={styles.label}>Kategori</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24, marginHorizontal: -24 }} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
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
        </ScrollView>

        <View style={{ marginBottom: 24 }}>
          <LabeledInput
            label="Subjek"
            placeholder="Contoh: Permintaan update progres"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={{ marginBottom: 8 }}>
          <LabeledInput
            label="Deskripsi"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholder="Tuliskan detail keluhan Anda"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.uploadSection}>
          <Text style={styles.label}>Lampiran Foto</Text>
          <Text style={styles.uploadInfoText}>Maksimal 3 foto. Maksimal 5 MB per foto.</Text>
          
          {attachments.length === 0 ? (
             <Pressable style={styles.dropzone} onPress={pickPhotos}>
                 <View style={styles.dropzoneIconWrapper}>
                    <Ionicons name="cloud-upload-outline" size={32} color={c.primary} />
                 </View>
                 <Text style={styles.dropzoneTitle}>Unggah Lampiran</Text>
                 <Text style={styles.dropzoneSub}>Ketuk untuk memilih dari Galeri</Text>
                 
                 <View style={styles.dropzoneOrContainer}>
                   <View style={styles.dropzoneDivider} />
                   <Text style={styles.dropzoneOrText}>atau</Text>
                   <View style={styles.dropzoneDivider} />
                 </View>
                 
                 <Pressable style={styles.dropzoneCameraBtn} onPress={takePhoto}>
                    <Ionicons name="camera" size={18} color={c.neutral700} />
                    <Text style={styles.dropzoneCameraText}>Buka Kamera</Text>
                 </Pressable>
              </Pressable>
          ) : (
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

          {attachments.length > 0 && attachments.length < 3 && (
             <Pressable style={styles.uploadMoreBtn} onPress={pickPhotos}>
                 <Ionicons name="add" size={20} color={c.primaryDark} />
                 <Text style={styles.uploadMoreBtnText}>Tambah Foto Lain ({attachments.length}/3)</Text>
             </Pressable>
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
        <LinearGradient
          colors={[c.primary600, c.primaryDark]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.moreFaqGradient}
        >
          <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']} style={StyleSheet.absoluteFillObject} pointerEvents="none" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={styles.moreFaqIcon}>
              <Ionicons name="book-outline" size={22} color="#FBBF24" />
            </View>
            <View>
              <Text style={styles.moreFaqTitle}>Panduan Layanan</Text>
              <Text style={styles.moreFaqSub}>Lihat seluruh FAQ & Kontak</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
        </LinearGradient>
      </Pressable>

      <Text style={styles.sectionTitle}>Pertanyaan Populer</Text>
      {faq.length === 0 ? (
        <View style={styles.emptyStateWrap}>
           <View style={styles.emptyStateIconWrap}>
             <Ionicons name="library-outline" size={40} color={c.neutral400} />
           </View>
           <Text style={styles.emptyStateTitle}>FAQ Belum Tersedia</Text>
           <Text style={styles.emptyStateDesc}>Daftar pertanyaan umum sedang diperbarui oleh tim kami.</Text>
        </View>
      ) : (
        <View style={styles.faqGroupContainer}>
          {faq.map((item, index) => (
            <FaqAccordion key={item.id} item={item} isLast={index === faq.length - 1} />
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
            <View style={styles.heroTopRow}>
              <View style={styles.heroTitleWrap}>
                 <Text style={styles.heroKicker}>LAYANAN PELANGGAN</Text>
                 <Text style={styles.heroTitle}>Pusat Bantuan</Text>
              </View>
              <Pressable onPress={contactWhatsApp} style={({ pressed }) => [styles.whatsappBtn, pressed && styles.pressed]}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.whatsappBtnText}>CS</Text>
              </Pressable>
            </View>
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
    backgroundColor: "rgba(255,255,255,0.15)",
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
  heroTitleWrap: {
    flex: 1,
  },
  heroKicker: {
    color: "#FBBF24", // Premium Gold
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1.2,
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
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 13,
    fontWeight: "700",
    color: c.neutral600,
  },
  segmentTextActive: {
    color: "#ffffff",
    fontWeight: "800",
  },
  emptyStateWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    borderWidth: 2,
    borderColor: c.neutral100,
    borderStyle: "dashed",
    marginTop: 8,
  },
  emptyStateIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: c.neutral50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
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
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: c.primary,
    borderRadius: 99,
  },
  emptyStateBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  unreadDotAbsolute: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: c.danger.text,
    borderWidth: 2,
    borderColor: "#ffffff",
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
  cleanList: {
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
  divider: {
    height: 1,
    backgroundColor: c.neutral200,
    marginVertical: 12,
  },
  ticketListContainer: {
    gap: 16,
  },
  ticketCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  ticketCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
    backgroundColor: c.neutral50,
  },
  ticketIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: c.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  ticketInfoWrap: {
    flex: 1,
    gap: 2,
  },
  ticketHeaderTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  ticketDesc: {
    fontSize: 14,
    color: c.neutral500,
    marginBottom: 8,
  },
  ticketBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ticketMeta: {
    fontSize: 12,
    color: c.neutral400,
  },
  metricCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  metricCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  metricDivider: {
    width: 1,
    backgroundColor: c.neutral100,
    marginVertical: 4,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: "900",
    color: c.neutral900,
    letterSpacing: -1.5,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: c.neutral600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cleanCard: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 24,
    marginBottom: 32,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: c.neutral900,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  formSub: {
    fontSize: 14,
    color: c.neutral500,
    marginBottom: 20,
    lineHeight: 22,
  },
  slaBox: {
    backgroundColor: "rgba(37, 99, 235, 0.06)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(37, 99, 235, 0.15)",
  },
  slaTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: c.primaryDark,
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  slaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  slaText: {
    fontSize: 13,
    color: c.primaryDark,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: c.neutral700,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: c.neutral100,
  },
  categoryPillActive: {
    backgroundColor: c.primaryDark,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: c.neutral600,
  },
  categoryPillTextActive: {
    color: "#ffffff",
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
  dropzone: { backgroundColor: "rgba(37, 99, 235, 0.04)", borderRadius: 20, borderWidth: 2, borderColor: "rgba(37, 99, 235, 0.3)", borderStyle: "dashed", padding: 24, alignItems: "center", justifyContent: "center", marginTop: 4 },
  dropzoneIconWrapper: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(37, 99, 235, 0.12)", alignItems: "center", justifyContent: "center", marginBottom: 16 },
  dropzoneTitle: { fontSize: 16, fontWeight: "800", color: c.primaryDark, marginBottom: 8, letterSpacing: -0.3 },
  dropzoneSub: { fontSize: 13, color: c.neutral500, marginBottom: 16 },
  dropzoneOrContainer: { flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 32, marginBottom: 16 },
  dropzoneDivider: { flex: 1, height: 1, backgroundColor: c.neutral200 },
  dropzoneOrText: { paddingHorizontal: 12, fontSize: 12, color: c.neutral400, fontWeight: "600" },
  dropzoneCameraBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: "#ffffff", borderRadius: 12, borderWidth: 1, borderColor: c.neutral200, elevation: 1 },
  dropzoneCameraText: { fontSize: 14, fontWeight: "700", color: c.neutral700 },

  uploadMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(37, 99, 235, 0.3)",
    borderStyle: "dashed",
    backgroundColor: "rgba(37, 99, 235, 0.04)",
    marginTop: 12,
    gap: 8,
  },
  uploadMoreBtnText: {
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.neutral100,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
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
    borderRadius: 28,
    gap: 8,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginTop: 8,
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
    borderRadius: 24,
    marginBottom: 28,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },
  moreFaqGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
  },
  moreFaqIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  moreFaqTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 2,
  },
  moreFaqSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  faqGroupContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: c.neutral100,
    overflow: "hidden",
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 32,
  },
  faqRowWrapper: {
    backgroundColor: "#ffffff",
  },
  faqRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: c.neutral100,
  },
  faqRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  faqRowHeaderPressed: {
    backgroundColor: c.neutral50,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  faqBody: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: c.neutral600,
    lineHeight: 24,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
