import React, { useCallback, useState } from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import {
  Card,
  EmptyState,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerSupportData } from "../../services/api";
import { FaqItem } from "../../types";

const OPERATIONAL_HOURS = "Senin - Jumat: 08:00 - 17:00 WIB";

export function FaqContactScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!auth) {
      return;
    }

    try {
      const result = await getCustomerSupportData(auth);
      setFaq(result.faq);
    } catch (error) {
      setBanner(error instanceof Error ? error.message : "Gagal memuat FAQ");
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData])
  );

  const contactWhatsApp = useCallback(() => {
    const raw = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? "628123456789";
    const numeric = raw.replace(/\D/g, "");
    const url = `https://wa.me/${numeric}`;
    void Linking.openURL(url);
  }, []);

  const contactPhone = useCallback(() => {
    const phone = process.env.EXPO_PUBLIC_PHONE_NUMBER ?? "628123456789";
    const url = `tel:${phone}`;
    void Linking.openURL(url);
  }, []);

  const openEmail = useCallback(() => {
    const email = process.env.EXPO_PUBLIC_EMAIL_ADDRESS ?? "cs@simdp.local";
    const url = `mailto:${email}`;
    void Linking.openURL(url);
  }, []);

  return (
    <ScreenShell title="FAQ & Kontak" subtitle="Pertanyaan umum dan cara menghubungi kami">
      {banner ? <StatusBanner message={banner} tone="danger" /> : null}

      <Card>
        <SectionTitle title="Hubungi Kami" caption="Pilih saluran yang paling nyaman" />
        <View style={styles.contactRow}>
          <SecondaryButton label="WhatsApp" onPress={contactWhatsApp} />
          <SecondaryButton label="Telepon" onPress={contactPhone} />
          <SecondaryButton label="Email" onPress={openEmail} />
        </View>
        <Text style={styles.operationalHours}>Jam Operasional: {OPERATIONAL_HOURS}</Text>
      </Card>

      <Card>
        <SectionTitle title="Pertanyaan Umum" caption="Jawaban untuk pertanyaan yang sering diajukan" />
        {isLoading ? (
          <Text style={styles.loadingText}>Memuat FAQ...</Text>
        ) : faq.length === 0 ? (
          <EmptyState message="FAQ belum tersedia saat ini." />
        ) : (
          <View style={styles.faqList}>
            {faq.map((item) => (
              <View key={item.id} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  operationalHours: {
    color: "#4a6a72",
    fontSize: 12,
    marginTop: 8,
  },
  loadingText: {
    color: "#4f6f77",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 20,
  },
  faqList: {
    gap: 10,
  },
  faqItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#c9dce0",
    backgroundColor: "#f8fcfd",
    padding: 12,
    gap: 6,
  },
  faqQuestion: {
    color: "#123d47",
    fontSize: 14,
    fontWeight: "700",
  },
  faqAnswer: {
    color: "#2f5e67",
    fontSize: 13,
    lineHeight: 18,
  },
});