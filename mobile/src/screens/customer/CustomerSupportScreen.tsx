import React, { useCallback, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
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
import { createCustomerTicket, getCustomerSupportData } from "../../services/api";
import { FaqItem, TicketItem } from "../../types";
import { formatDateTime } from "../../utils/format";

const TICKET_CATEGORIES: TicketItem["category"][] = [
  "Progres",
  "Kualitas Bangunan",
  "Dokumen",
  "Tagihan",
  "Lainnya",
];

function statusTone(status: TicketItem["status"]): "neutral" | "warning" | "success" {
  if (status === "SELESAI" || status === "DITUTUP") {
    return "success";
  }
  if (status === "SEDANG_DITANGANI") {
    return "warning";
  }
  return "neutral";
}

export function CustomerSupportScreen(): React.JSX.Element {
  const { auth } = useAuth();

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const [category, setCategory] = useState<TicketItem["category"]>("Progres");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          if (!cancelled) {
            setBanner(error instanceof Error ? error.message : "Gagal memuat data bantuan");
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

  const submitTicket = useCallback(async () => {
    if (!auth || !subject.trim() || !description.trim()) {
      setBanner("Judul dan deskripsi tiket wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setBanner(null);

    try {
      await createCustomerTicket(auth, {
        category,
        subject: subject.trim(),
        description: description.trim(),
      });

      setSubject("");
      setDescription("");
      setCategory("Progres");
      await loadData();
      setBanner("Tiket bantuan berhasil dibuat.");
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal membuat tiket bantuan");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, category, description, loadData, subject]);

  const contactWhatsApp = useCallback(() => {
    const raw = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? "628123456789";
    const numeric = raw.replace(/\D/g, "");
    const url = `https://wa.me/${numeric}`;
    void Linking.openURL(url);
  }, []);

  return (
    <ScreenShell title="Bantuan" subtitle="Buat tiket, cek status, dan akses FAQ">
      <Card>
        <SectionTitle title="Kontak Cepat" />
        <PrimaryButton label="Hubungi WhatsApp CS" onPress={contactWhatsApp} />
      </Card>

      <Card>
        <SectionTitle title="Buat Tiket Baru" />

        <Text style={styles.label}>Kategori</Text>
        <View style={styles.pillRow}>
          {TICKET_CATEGORIES.map((item) => (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              style={({ pressed }) => [
                styles.pill,
                item === category && styles.pillActive,
                pressed && styles.pillPressed,
              ]}
            >
              <Text style={[styles.pillText, item === category && styles.pillTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <LabeledInput
          label="Subjek"
          placeholder="Contoh: Permintaan update progres minggu ini"
          value={subject}
          onChangeText={setSubject}
        />

        <LabeledInput
          label="Deskripsi"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Tuliskan detail pertanyaan atau kendala Anda"
          value={description}
          onChangeText={setDescription}
        />

        <PrimaryButton
          label={isSubmitting ? "Mengirim..." : "Kirim Tiket"}
          onPress={() => void submitTicket()}
          disabled={isSubmitting}
        />
      </Card>

      {banner ? (
        <Card>
          <Text style={styles.bannerText}>{banner}</Text>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <Text style={styles.loadingText}>Memuat bantuan...</Text>
        </Card>
      ) : (
        <>
          <Card>
            <SectionTitle title="Tiket Anda" />
            {tickets.length === 0 ? (
              <EmptyState message="Belum ada tiket bantuan." />
            ) : (
              <View style={styles.listWrap}>
                {tickets.map((ticket) => (
                  <View key={ticket.id} style={styles.ticketItem}>
                    <View style={styles.ticketTopRow}>
                      <Text style={styles.ticketTitle}>{ticket.subject}</Text>
                      <Badge label={ticket.status} tone={statusTone(ticket.status)} />
                    </View>
                    <Text style={styles.ticketMeta}>Kategori: {ticket.category}</Text>
                    <Text style={styles.ticketMeta}>{formatDateTime(ticket.createdAt)}</Text>
                    <Text style={styles.ticketDesc}>{ticket.description}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Card>
            <SectionTitle title="FAQ" />
            {faq.length === 0 ? (
              <EmptyState message="FAQ belum tersedia." />
            ) : (
              <View style={styles.listWrap}>
                {faq.map((item) => (
                  <View key={item.id} style={styles.faqItem}>
                    <Text style={styles.faqQuestion}>{item.question}</Text>
                    <Text style={styles.faqAnswer}>{item.answer}</Text>
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
    backgroundColor: "#f8fcfc",
    paddingVertical: 8,
    paddingHorizontal: 11,
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
  ticketItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c4d8db",
    backgroundColor: "#f8fcfd",
    padding: 10,
    gap: 2,
  },
  ticketTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  ticketTitle: {
    flex: 1,
    color: "#123e48",
    fontSize: 14,
    fontWeight: "800",
  },
  ticketMeta: {
    color: "#3f6972",
    fontSize: 12,
  },
  ticketDesc: {
    color: "#2f5d66",
    fontSize: 13,
  },
  faqItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c9dce0",
    backgroundColor: "#f8fcfd",
    padding: 10,
    gap: 4,
  },
  faqQuestion: {
    color: "#123d47",
    fontSize: 14,
    fontWeight: "800",
  },
  faqAnswer: {
    color: "#2f5e67",
    fontSize: 13,
    lineHeight: 18,
  },
});
