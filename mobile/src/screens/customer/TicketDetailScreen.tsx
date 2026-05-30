import React, { useCallback, useState, useRef, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import {
  Badge,
  Card,
  ScreenShell,
  SectionTitle,
  StatusBanner,
  PrimaryButton,
} from "../../components/ui";
import { c } from "../../theme/colors";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerSupportData, replyToTicket } from "../../services/api";
import { pickImages } from "../../services/media";
import { TicketItem, TicketReply } from "../../types";
import { formatDateTime, formatTicketStatusLabel, inferBannerTone } from "../../utils/format";

function statusTone(status: TicketItem["status"]): "neutral" | "warning" | "success" {
  if (status === "SELESAI" || status === "DITUTUP") {
    return "success";
  }
  if (status === "SEDANG_DITANGANI") {
    return "warning";
  }
  return "neutral";
}

export function TicketDetailScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const ticketId = (route.params as { ticketId: string })?.ticketId;

  const [ticket, setTicket] = useState<TicketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [replyPhotos, setReplyPhotos] = useState<string[]>([]);
  const [isReplying, setIsReplying] = useState(false);
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

  const handleSendReply = useCallback(async () => {
    if (!replyMessage.trim()) return;
    setIsReplying(true);
    setBanner(null);
    try {
      await replyToTicket(auth, {
        ticketId: ticketId!,
        message: replyMessage.trim(),
        photoUrls: replyPhotos,
      });

      const newMsg: TicketReply = {
        id: Date.now().toString(),
        ticketId: ticketId!,
        sender: "Anda",
        senderRole: "CUSTOMER",
        message: replyMessage.trim(),
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMsg]);
      setReplyMessage("");
      setReplyPhotos([]);
      await loadData();
      setBanner("Balasan terkirim.");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal mengirim balasan");
    } finally {
      setIsReplying(false);
    }
  }, [auth, loadData, replyMessage, replyPhotos, ticketId]);

  const pickReplyPhoto = useCallback(async () => {
    try {
      const remaining = 3 - replyPhotos.length;
      if (remaining <= 0) {
        setBanner("Maksimal 3 foto lampiran.");
        return;
      }

      const uris = await pickImages({ selectionLimit: remaining });
      if (uris.length > 0) {
        setReplyPhotos((prev) => [...prev, ...uris].slice(0, 3));
      }
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memilih foto.");
    }
  }, [replyPhotos.length]);

  const renderMessageBubble = useCallback(({ item }: { item: TicketReply }) => {
    const isCustomer = item.senderRole === "CUSTOMER";

    return (
      <View style={{
        flexDirection: "row",
        justifyContent: isCustomer ? "flex-end" : "flex-start",
        marginVertical: 4,
        paddingHorizontal: 16,
      }}>
        {!isCustomer && (
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: c.primary + "20",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 8,
            alignSelf: "flex-end",
          }}>
            <Text style={{ fontSize: 14 }}>👷</Text>
          </View>
        )}

        <View style={{ maxWidth: "75%" }}>
          {!isCustomer && (
            <Text style={{ fontSize: 11, color: c.neutral500, marginBottom: 2, marginLeft: 4 }}>
              {item.sender}
            </Text>
          )}
          <View style={{
            backgroundColor: isCustomer ? c.primary : c.neutral100,
            borderRadius: 16,
            borderBottomRightRadius: isCustomer ? 4 : 16,
            borderBottomLeftRadius: isCustomer ? 16 : 4,
            paddingHorizontal: 14,
            paddingVertical: 10,
          }}>
            <Text style={{
              fontSize: 14,
              color: isCustomer ? "#FFFFFF" : c.neutral900,
              lineHeight: 20,
            }}>
              {item.message}
            </Text>
          </View>
          <Text style={{
            fontSize: 10,
            color: c.neutral500,
            marginTop: 2,
            textAlign: isCustomer ? "right" : "left",
            marginHorizontal: 4,
          }}>
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
      <ScreenShell title="Memuat..." subtitle="">
        <Card>
          <Text style={styles.loadingText}>Memuat detail tiket...</Text>
        </Card>
      </ScreenShell>
    );
  }

  if (!ticket) {
    return (
      <ScreenShell title="Tiket Tidak Ditemukan" subtitle="">
        <Card style={styles.centeredCard}>
          <Text style={styles.notFoundText}>Tiket tidak ditemukan atau telah dihapus.</Text>
          <PrimaryButton label="Kembali" onPress={() => navigation.goBack()} />
        </Card>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title={ticket.subject} subtitle={`ID: ${ticket.id}`} noScroll>
        {/* Ticket Info */}
        <Card style={styles.ticketInfoCard}>
          <View style={styles.ticketHeader}>
            <Badge label={formatTicketStatusLabel(ticket.status)} tone={statusTone(ticket.status)} />
            <Badge label={ticket.category} tone="neutral" />
          </View>
          <Text style={styles.ticketDate}>{formatDateTime(ticket.createdAt)}</Text>
          <Text style={styles.ticketDesc}>{ticket.description}</Text>
          {ticket.photoUrls && ticket.photoUrls.length > 0 && (
            <Text style={styles.ticketAttachment}>Lampiran: {ticket.photoUrls.length} foto</Text>
          )}
        </Card>

        {/* Chat Thread - using FlatList for performance */}
        <SectionTitle title="Diskusi" caption="Riwayat percakapan mengenai tiket ini" />

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderMessageBubble}
          contentContainerStyle={{ paddingVertical: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Reply input di bawah, fixed */}
        {ticket.status !== "SELESAI" && ticket.status !== "DITUTUP" && (
          <View style={{
            flexDirection: "row",
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: c.neutral200,
            backgroundColor: "#fff",
            gap: 8,
            alignItems: "flex-end",
          }}>
            <TextInput
              style={{
                flex: 1,
                minHeight: 40,
                maxHeight: 100,
                borderWidth: 1,
                borderColor: c.neutral200,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 8,
                fontSize: 14,
                color: c.neutral900,
              }}
              value={replyMessage}
              onChangeText={setReplyMessage}
              placeholder="Tulis pesan..."
              placeholderTextColor={c.neutral500}
              multiline
            />
            <Pressable
              onPress={() => void handleSendReply()}
              disabled={!replyMessage.trim() || isReplying}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: replyMessage.trim() ? c.primary : c.neutral200,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>➤</Text>
            </Pressable>
          </View>
        )}

        {banner && <StatusBanner message={banner} tone={inferBannerTone(banner)} />}
      </ScreenShell>
  );
}

const styles = StyleSheet.create({
  loadingText: { color: "#4f6f77", fontSize: 14, textAlign: "center", padding: 20 },
  centeredCard: { padding: 20, alignItems: "center" },
  notFoundText: { color: "#4f6f77", marginBottom: 12 },
  ticketInfoCard: { marginBottom: 12, gap: 8 },
  ticketHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  ticketDate: { color: "#4f6f77", fontSize: 12 },
  ticketDesc: { color: "#1f2937", marginTop: 4 },
  ticketAttachment: { color: "#64748b", fontSize: 10, marginTop: 4 },
});