import React, { useCallback, useState } from "react";
import { Linking, StyleSheet, Text, View, ScrollView, RefreshControl, Platform, Pressable , StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { c } from "../../theme/colors";

import {
  EmptyState,
  SlideInView,
  SkeletonList,
  StatusBanner,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { getCustomerSupportData } from "../../services/api";
import { FaqItem } from "../../types";

const OPERATIONAL_HOURS = "Senin - Jumat: 08:00 - 17:00 WIB";

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

export function FaqContactScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
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
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const raw = process.env.EXPO_PUBLIC_WHATSAPP_NUMBER ?? "628123456789";
    const numeric = raw.replace(/\D/g, "");
    const url = `https://wa.me/${numeric}`;
    void Linking.openURL(url);
  }, []);

  const contactPhone = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const phone = process.env.EXPO_PUBLIC_PHONE_NUMBER ?? "628123456789";
    const url = `tel:${phone}`;
    void Linking.openURL(url);
  }, []);

  const openEmail = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = process.env.EXPO_PUBLIC_EMAIL_ADDRESS ?? "cs@simdp.local";
    const url = `mailto:${email}`;
    void Linking.openURL(url);
  }, []);

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
          <SafeAreaView edges={['top', 'left', 'right']} style={styles.heroSafeArea}>
            <View style={styles.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text style={[styles.heroHeaderTitle, { color: "#ffffff" }]}>Panduan Layanan</Text>
              <View style={{ width: 44 }} />
            </View>

            <View style={styles.heroCenter}>
               <View style={styles.heroIconWrap}>
                 <Ionicons name="library" size={32} color="#FBBF24" />
               </View>
               <Text style={styles.heroTitle}>FAQ & Kontak Kami</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.contentPad}>
          {banner ? <StatusBanner message={banner} tone="danger" /> : null}

          <SlideInView direction="up" delay={50} duration={400}>
            <View style={styles.cleanCard}>
              <Text style={styles.sectionTitleHeader}>Hubungi Customer Service</Text>
              <View style={styles.contactList}>
                <Pressable onPress={contactWhatsApp} style={({ pressed }) => [styles.contactItemBtn, pressed && styles.pressed]}>
                  <View style={[styles.contactItemIcon, { backgroundColor: "rgba(37, 211, 102, 0.12)" }]}>
                    <Ionicons name="logo-whatsapp" size={24} color="#128C7E" />
                  </View>
                  <View style={styles.contactItemTextWrap}>
                    <Text style={styles.contactItemTitle}>WhatsApp</Text>
                    <Text style={styles.contactItemSub}>Respons Cepat (Aktif 24 Jam)</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={c.neutral300} />
                </Pressable>

                <View style={styles.contactItemDivider} />

                <Pressable onPress={contactPhone} style={({ pressed }) => [styles.contactItemBtn, pressed && styles.pressed]}>
                  <View style={[styles.contactItemIcon, { backgroundColor: "rgba(37, 99, 235, 0.12)" }]}>
                    <Ionicons name="call" size={24} color={c.accent} />
                  </View>
                  <View style={styles.contactItemTextWrap}>
                    <Text style={styles.contactItemTitle}>Telepon</Text>
                    <Text style={styles.contactItemSub}>Senin - Jumat, 08:00 - 17:00</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={c.neutral300} />
                </Pressable>

                <View style={styles.contactItemDivider} />

                <Pressable onPress={openEmail} style={({ pressed }) => [styles.contactItemBtn, pressed && styles.pressed]}>
                  <View style={[styles.contactItemIcon, { backgroundColor: "rgba(245, 158, 11, 0.12)" }]}>
                    <Ionicons name="mail" size={24} color="#D97706" />
                  </View>
                  <View style={styles.contactItemTextWrap}>
                    <Text style={styles.contactItemTitle}>Email</Text>
                    <Text style={styles.contactItemSub}>cs@simdp.local</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={c.neutral300} />
                </Pressable>
              </View>
            </View>
          </SlideInView>

          <SlideInView direction="up" delay={150} duration={400}>
            <Text style={styles.sectionTitle}>Pertanyaan Umum (FAQ)</Text>
            
            {isLoading ? (
              <SkeletonList count={4} />
            ) : faq.length === 0 ? (
              <View style={styles.emptyStateWrap}>
                 <View style={styles.emptyStateIconWrap}>
                   <Ionicons name="library-outline" size={40} color={c.neutral400} />
                 </View>
                 <Text style={styles.emptyStateTitle}>FAQ Belum Tersedia</Text>
                 <Text style={styles.emptyStateDesc}>Daftar pertanyaan umum sedang diperbarui oleh tim kami. Silakan hubungi CS jika Anda memiliki pertanyaan mendesak.</Text>
              </View>
            ) : (
              <View style={styles.faqGroupContainer}>
                {faq.map((item, idx) => (
                  <FaqAccordion key={item.id} item={item} isLast={idx === faq.length - 1} />
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
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    marginBottom: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
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
    paddingBottom: 24,
    paddingTop: 8,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: -1,
  },
  contentPad: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 16,
  },
  sectionTitleHeader: {
    padding: 24,
    paddingBottom: 8,
    fontSize: 16,
    fontWeight: "800",
    color: c.neutral900,
  },
  cleanCard: {
    marginTop: -40,
    backgroundColor: "#ffffff",
    borderRadius: 28,
    paddingBottom: 16,
    marginBottom: 32,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  contactList: {
    backgroundColor: "#ffffff",
  },
  contactItemBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 16,
    backgroundColor: "#ffffff",
  },
  contactItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  contactItemTextWrap: {
    flex: 1,
  },
  contactItemTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: c.neutral900,
    marginBottom: 4,
  },
  contactItemSub: {
    fontSize: 13,
    color: c.neutral500,
  },
  contactItemDivider: {
    height: 1,
    backgroundColor: c.neutral100,
    marginLeft: 88,
  },
  faqGroupContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
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
    paddingBottom: 24,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: c.neutral600,
    lineHeight: 24,
  },
  emptyStateWrap: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 4,
  },
  emptyStateIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: c.neutral50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
});