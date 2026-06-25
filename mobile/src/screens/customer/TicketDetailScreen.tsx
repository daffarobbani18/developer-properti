import React, { useCallback, useState, useRef, useEffect } from "react";
import { AppState, AppStateStatus, Image, Pressable, StyleSheet, Text, View, TextInput, FlatList, KeyboardAvoidingView, Platform , StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { CustomerStackParamList } from "../../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import ImageView from "react-native-image-viewing";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  SkeletonList,
  StatusBanner,
} from "../../components/ui";
import { c } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerSupportData, replyToTicket, markTicketAsRead } from "../../services/api";
import { pickImages } from "../../services/media";
import { TicketItem, TicketReply } from "../../types";
import { formatDateTime, formatTicketStatusLabel, inferBannerTone } from "../../utils/format";

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

export function TicketDetailScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();
  const route = useRoute();
  const ticketId = (route.params as { ticketId: string })?.ticketId;

  const [ticket, setTicket] = useState<TicketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

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
  const [messages, setMessages] = useState<TicketReply[]>([]);
  const flatListRef = useRef<FlatList<TicketReply>>(null);

  useEffect(() => {
    if (ticket?.replies) {
      setMessages(ticket.replies);
    }
  }, [ticket?.replies]);

  const loadData = useCallback(async () => {
    if (!auth || !ticketId) {
      return;
    }

    try {
      const result = await getCustomerSupportData(auth);
      const foundTicket = result.tickets.find((t) => t.id === ticketId);
      setTicket(foundTicket ?? null);
      
      if (foundTicket?.hasUnreadReplies) {
        await markTicketAsRead(auth, ticketId);
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memuat detail tiket");
    } finally {
      setIsLoading(false);
    }
  }, [auth, ticketId]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
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

  const handleSendReply = useCallback(async () => {
    if (!replyMessage.trim() && attachments.length === 0) return;
    
    // Validate if any is still uploading or failed
    if (attachments.some(a => a.status === "UPLOADING")) {
      setBanner("Tunggu hingga semua foto selesai diunggah.");
      return;
    }
    if (attachments.some(a => a.status === "FAILED")) {
      setBanner("Ada foto yang gagal diunggah. Hapus atau coba lagi.");
      return;
    }

    setIsReplying(true);
    setBanner(null);
    try {
      const validPhotoUris = attachments.filter(a => a.status === "UPLOADED").map(a => a.uri);
      
      await replyToTicket(auth, {
        ticketId: ticketId!,
        message: replyMessage.trim(),
        photoUrls: validPhotoUris,
      });

      const newMsg: TicketReply = {
        id: Date.now().toString(),
        ticketId: ticketId!,
        sender: "Anda",
        senderRole: "CUSTOMER",
        message: replyMessage.trim(),
        createdAt: new Date().toISOString(),
        photoUrl: validPhotoUris.length > 0 ? validPhotoUris[0] : undefined,
      };
      setMessages(prev => [...prev, newMsg]);
      setReplyMessage("");
      setAttachments([]);
      await loadData();
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengirim balasan");
    } finally {
      setIsReplying(false);
    }
  }, [auth, loadData, replyMessage, attachments, ticketId]);

  const processNewPhotoUris = (uris: string[]) => {
    if (uris.length === 0) return;
    
    if (attachments.length + uris.length > 3) {
      setBanner("Maksimal 3 foto lampiran.");
      return;
    }

    const newAtts: AttachmentItem[] = uris.map(uri => ({
      id: Math.random().toString(36).substr(2, 9),
      uri,
      filename: uri.split('/').pop() || 'photo.jpg',
      size: Math.floor(Math.random() * (4 * 1024 * 1024)) + 1024 * 1024,
      status: "UPLOADING",
      progress: 0,
    }));
    
    setAttachments(prev => [...prev, ...newAtts]);

    newAtts.forEach(att => {
      let prog = 0;
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

  const pickReplyPhoto = useCallback(async () => {
    try {
      const remaining = 3 - attachments.length;
      if (remaining <= 0) {
        setBanner("Maksimal 3 foto lampiran.");
        return;
      }

      const uris = await pickImages({ selectionLimit: remaining, maxSizeBytes: 5 * 1024 * 1024 });
      if (uris.length > 0) {
        processNewPhotoUris(uris);
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memilih foto.");
    }
  }, [attachments.length]);

  const renderMessageBubble = useCallback(({ item }: { item: TicketReply }) => {
    const isCustomer = item.senderRole === "CUSTOMER";

    return (
      <View style={[styles.bubbleContainer, { justifyContent: isCustomer ? "flex-end" : "flex-start" }]}>
        {!isCustomer && (
          <View style={styles.agentAvatar}>
            <Ionicons name="headset" size={14} color={c.primary} />
          </View>
        )}

        <View style={{ maxWidth: "80%" }}>
          {!isCustomer && (
            <Text style={styles.senderName}>{item.sender}</Text>
          )}
          <View style={[
            styles.bubbleBox, 
            isCustomer ? styles.bubbleCustomer : styles.bubbleAgent,
            {
              borderBottomRightRadius: isCustomer ? 4 : 16,
              borderBottomLeftRadius: isCustomer ? 16 : 4,
            }
          ]}>
            {item.photoUrl && (
               <Pressable 
                 onPress={() => {
                   setViewerImages([{uri: item.photoUrl!}]);
                   setViewerIndex(0);
                   setIsViewerVisible(true);
                 }}
                 style={styles.bubblePhotoWrap}
               >
                 <Image source={{uri: item.photoUrl}} style={styles.bubblePhoto} />
               </Pressable>
            )}
            <Text style={[styles.bubbleText, isCustomer && styles.bubbleTextCustomer]}>
              {item.message}
            </Text>
          </View>
          <Text style={[styles.bubbleTime, { textAlign: isCustomer ? "right" : "left" }]}>
            {new Date(item.createdAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((item: TicketReply) => item.id, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient 
          colors={[c.primaryDark, c.neutral900]} 
          locations={[0, 1]}
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
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
             <View style={styles.heroTopRow}>
                <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </Pressable>
                <View style={{ flex: 1, alignItems: "center" }}>
                   <Text style={styles.heroHeaderTitle} numberOfLines={1}>Memuat Detail</Text>
                </View>
                <View style={{ width: 44 }} />
             </View>
          </SafeAreaView>
        </LinearGradient>
        <View style={styles.contentPad}>
          <SkeletonList count={3} />
        </View>
      </View>
    );
  }

  if (!ticket) {
    return (
      <View style={styles.container}>
        <LinearGradient 
          colors={[c.primaryDark, c.neutral900]} 
          locations={[0, 1]}
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
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
             <View style={styles.heroTopRow}>
                <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </Pressable>
                <View style={{ flex: 1, alignItems: "center" }}>
                   <Text style={styles.heroHeaderTitle} numberOfLines={1}>Tidak Ditemukan</Text>
                </View>
                <View style={{ width: 44 }} />
             </View>
          </SafeAreaView>
        </LinearGradient>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="warning-outline" size={48} color={c.neutral400} />
          <Text style={{ marginTop: 16, color: c.neutral500 }}>Tiket tidak ditemukan atau telah dihapus.</Text>
        </View>
      </View>
    );
  }

  const isClosed = ticket.status === "SELESAI" || ticket.status === "DITUTUP";

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient 
        colors={[c.primaryDark, c.neutral900]} 
        locations={[0, 1]}
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
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
           <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 16 }}>
                 <Text style={styles.heroHeaderTitle} numberOfLines={1}>{ticket.subject}</Text>
                 <View style={styles.heroHeaderBadgeWrap}>
                   <Badge label={formatTicketStatusLabel(ticket.status)} tone={statusTone(ticket.status)} />
                 </View>
              </View>
              <View style={{ width: 44 }} />
           </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.contentPad}>
        {banner && <StatusBanner message={banner} tone={inferBannerTone(banner)} />}
      </View>

      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}
        keyExtractor={keyExtractor}
        renderItem={renderMessageBubble}
        contentContainerStyle={styles.chatListContent}
        inverted={true}
        ListFooterComponent={() => (
          <View style={styles.contextCard}>
             <View style={styles.ticketMetaRow}>
               <Text style={styles.ticketDate}>{formatDateTime(ticket.createdAt)}</Text>
               <Badge label={ticket.category} tone="neutral" />
             </View>
             
             <View style={styles.ticketDescBox}>
               <Text style={styles.ticketDesc}>{ticket.description}</Text>
               {ticket.photoUrls && ticket.photoUrls.length > 0 && (
                 <View style={styles.contextPhotos}>
                   {ticket.photoUrls.map((uri, idx) => (
                     <Pressable 
                       key={uri} 
                       onPress={() => {
                         setViewerImages(ticket.photoUrls!.map(u => ({uri: u})));
                         setViewerIndex(idx);
                         setIsViewerVisible(true);
                       }}
                       style={styles.contextPhotoWrap}
                     >
                       <Image source={{uri}} style={styles.contextPhoto} />
                       <View style={styles.contextPhotoOverlay}>
                         <Ionicons name="expand" size={16} color="#ffffff" />
                       </View>
                     </Pressable>
                   ))}
                 </View>
               )}
             </View>
          </View>
        )}
      />

      {!isClosed && (
        <SafeAreaView edges={['bottom']} style={styles.inputWrap}>
          <View style={styles.inputContainer}>
            <Pressable onPress={pickReplyPhoto} disabled={attachments.length >= 3} style={({pressed}) => [styles.uploadIconBtn, pressed && styles.pressed]}>
              <Ionicons name="image-outline" size={24} color={attachments.length >= 3 ? c.neutral400 : c.primary} />
            </Pressable>
            <View style={{flex: 1}}>
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
              <TextInput
                style={styles.inputField}
                value={replyMessage}
                onChangeText={setReplyMessage}
                placeholder="Tulis balasan..."
                placeholderTextColor={c.neutral400}
                multiline
              />
            </View>
            <Pressable
              onPress={() => void handleSendReply()}
              disabled={!replyMessage.trim() || isReplying}
              style={({ pressed }) => [
                styles.sendBtn,
                !replyMessage.trim() && styles.sendBtnDisabled,
                pressed && styles.pressed
              ]}
            >
              <Ionicons name="send" size={16} color="#ffffff" />
            </Pressable>
          </View>
        </SafeAreaView>
      )}

      <ImageView
        images={viewerImages}
        imageIndex={viewerIndex}
        visible={isViewerVisible}
        onRequestClose={() => setIsViewerVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  heroHeader: {
    paddingBottom: 24,
    overflow: "hidden",
  },
  heroSafeArea: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  heroHeaderSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  heroHeaderBadgeWrap: {
    marginTop: 8,
  },
  contentPad: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  chatListContent: {
    paddingBottom: 24,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  contextCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 24,
    marginBottom: 32,
    borderRadius: 24,
    padding: 24,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  ticketSubject: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginRight: 8,
  },
  ticketMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ticketDate: {
    fontSize: 12,
    color: c.neutral500,
  },
  ticketDescBox: {
    backgroundColor: c.neutral50,
    padding: 16,
    borderRadius: 16,
  },
  ticketDesc: {
    fontSize: 14,
    lineHeight: 24,
    color: c.neutral700,
  },
  contextPhotos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  contextPhotoWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    position: "relative",
  },
  contextPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contextPhotoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    gap: 8,
    paddingHorizontal: 24,
  },
  agentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: c.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "700",
    color: c.neutral600,
    marginBottom: 4,
    marginLeft: 4,
  },
  bubbleBox: {
    padding: 12,
  },
  bubblePhotoWrap: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    width: 200,
    height: 150,
  },
  bubblePhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bubbleCustomer: {
    backgroundColor: c.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleAgent: {
    backgroundColor: c.neutral100,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: c.neutral900,
  },
  bubbleTextCustomer: {
    color: "#ffffff",
  },
  bubbleTime: {
    fontSize: 10,
    color: c.neutral400,
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputWrap: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: c.neutral100,
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "flex-end",
    gap: 12,
  },
  uploadIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.neutral50,
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentList: {
    gap: 8,
    marginBottom: 8,
  },
  attachmentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.neutral200,
  },
  attachmentThumbBtn: {
    width: 40,
    height: 40,
    borderRadius: 6,
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
    fontSize: 13,
    fontWeight: "700",
    color: c.neutral900,
  },
  uploadProgressWrap: {
    marginTop: 4,
  },
  uploadingText: {
    fontSize: 11,
    color: c.info.text,
    marginBottom: 2,
    fontWeight: "600",
  },
  progressBarBg: {
    height: 3,
    backgroundColor: c.neutral200,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: c.info.text,
    borderRadius: 1.5,
  },
  uploadedText: {
    fontSize: 11,
    color: c.success.text,
    fontWeight: "600",
    marginTop: 2,
  },
  failedText: {
    fontSize: 11,
    color: c.danger.text,
    fontWeight: "600",
  },
  retryText: {
    fontSize: 11,
    color: c.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  removeAttachmentBtn: {
    padding: 8,
  },
  inputField: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: c.neutral50,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: c.neutral900,
    borderWidth: 1,
    borderColor: c.neutral100,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: c.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: c.neutral300,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});