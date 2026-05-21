import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";

import {
  Badge,
  Card,
  ScreenShell,
  SectionTitle,
  StatusBanner,
  PrimaryButton,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerSupportData, replyToTicket } from "../../services/api";
import { pickImages } from "../../services/media";
import { TicketItem } from "../../types";
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

  const submitReply = useCallback(async () => {
    if (!auth || !ticketId || !replyMessage.trim()) {
      setBanner("Pesan balasan wajib diisi.");
      return;
    }

    setIsReplying(true);
    setBanner(null);

    try {
      await replyToTicket(auth, {
        ticketId,
        message: replyMessage.trim(),
        photoUrls: replyPhotos,
      });

      setReplyMessage("");
      setReplyPhotos([]);
      await loadData();
      setBanner("Balasan terkirim.");
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
    <ScreenShell title={ticket.subject} subtitle={`ID: ${ticket.id}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexFill}
      >
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

        {/* Chat Thread */}
        <SectionTitle title="Diskusi" caption="Riwayat percakapan mengenai tiket ini" />
        
        <Card style={styles.chatCard}>
          {ticket.replies && ticket.replies.length > 0 ? (
            <View style={styles.chatList}>
              {ticket.replies.map((reply) => (
                <View
                  key={reply.id}
                  style={[
                    styles.replyBubble,
                    reply.senderRole === "CUSTOMER" ? styles.customerBubble : styles.agentBubble,
                  ]}
                >
                  <View style={styles.replyHeader}>
                    <Text style={styles.replySender}>{reply.sender}</Text>
                    <Text style={styles.replyDate}>{formatDateTime(reply.createdAt)}</Text>
                  </View>
                  <Text style={styles.replyMessage}>{reply.message}</Text>
                  {reply.photoUrl && (
                    <Text style={styles.replyAttachment}>📎 Lampiran foto</Text>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyChat}>Belum ada balasan. Kirim pesan pertama Anda!</Text>
          )}
        </Card>

        {/* Reply Form */}
        {ticket.status !== "SELESAI" && ticket.status !== "DITUTUP" && (
          <Card style={styles.replyCard}>
            <SectionTitle title="Balas Tiket" />
            <TextInput
              style={styles.replyInput}
              placeholder="Tulis balasan Anda..."
              value={replyMessage}
              onChangeText={setReplyMessage}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <View style={styles.replyFooter}>
              <Text style={styles.replyAttachmentCount}>
                Foto lampiran: {replyPhotos.length}/3
              </Text>
              <Pressable onPress={() => void pickReplyPhoto()}>
                <Text style={styles.addPhotoLink}>+ Tambah Foto</Text>
              </Pressable>
            </View>
            <PrimaryButton
              label={isReplying ? "Mengirim..." : "Kirim Balasan"}
              onPress={() => void submitReply()}
              disabled={isReplying || !replyMessage.trim()}
            />
          </Card>
        )}

        {banner && <StatusBanner message={banner} tone={inferBannerTone(banner)} />}
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  flexFill: { flex: 1 },
  loadingText: { color: "#4f6f77", fontSize: 14, textAlign: "center", padding: 20 },
  centeredCard: { padding: 20, alignItems: "center" },
  notFoundText: { color: "#4f6f77", marginBottom: 12 },
  ticketInfoCard: { marginBottom: 12, gap: 8 },
  ticketHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  ticketDate: { color: "#4f6f77", fontSize: 12 },
  ticketDesc: { color: "#1f2937", marginTop: 4 },
  ticketAttachment: { color: "#64748b", fontSize: 10, marginTop: 4 },
  chatCard: { marginBottom: 12, maxHeight: 240 },
  chatList: { gap: 8 },
  replyBubble: { padding: 10, borderRadius: 10, maxWidth: "80%" },
  customerBubble: { backgroundColor: "#dbeafe", alignSelf: "flex-start" },
  agentBubble: { backgroundColor: "#f1f5f9", alignSelf: "flex-end" },
  replyHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  replySender: { fontSize: 10, fontWeight: "600", color: "#334155" },
  replyDate: { fontSize: 10, color: "#64748b" },
  replyMessage: { fontSize: 13, color: "#1e293b" },
  replyAttachment: { fontSize: 10, color: "#64748b", marginTop: 4 },
  emptyChat: { color: "#94a3b8", textAlign: "center", padding: 20 },
  replyCard: { marginTop: "auto", paddingTop: 12 },
  replyInput: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 8,
    minHeight: 80,
  },
  replyFooter: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  replyAttachmentCount: { fontSize: 11, color: "#64748b" },
  addPhotoLink: { fontSize: 11, color: "#2563eb" },
});