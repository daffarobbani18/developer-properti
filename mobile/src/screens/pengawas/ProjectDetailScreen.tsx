import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  StatusBar,
  Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getProjectDetail } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import {
  AnimatedProgressBar,
  Badge,
  Card,
  CountUpNumber,
  EmptyState,
  FadeInView,
  IconButton,
  SectionTitle,
  Skeleton,
  SkeletonList,
  SlideInView,
  StatusBanner,
} from "../../components/ui";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { c } from "../../theme/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Types for the API response
type PropertyTypeDetail = {
  id: string;
  name: string;
  luasTanah: number;
  luasBangunan: number;
  kamarTidur: number;
  kamarMandi: number;
  basePrice: number;
  imageUrl: string | null;
  facilities: string | null;
};

type UnitDetail = {
  id: string;
  blok: string;
  nomorUnit: string;
  nomor: string;
  kawasan: string;
  typeName: string;
  price: number;
  statusPembangunan: string;
  statusPenjualan: string;
  progress: number;
  buyerName: string | null;
};

type BlockGroup = {
  name: string;
  units: UnitDetail[];
};

type SitePlanData = {
  id: string;
  imageUrl: string;
  coordinatesData: string;
};

type StatusSummary = {
  tersedia: number;
  booked: number;
  terjual: number;
  total: number;
};

type ProjectDetailData = {
  id: string;
  name: string;
  location: string;
  status: string;
  totalUnits: number;
  targetSelesai: string | null;
  kontraktorName: string | null;
  nilaiKontrak: number;
  estimasiAnggaran: number | null;
  nomorIzin: string | null;
  description: string | null;
  imageUrl: string | null;
  overallProgress: number;
  statusSummary: StatusSummary;
  propertyTypes: PropertyTypeDetail[];
  blocks: BlockGroup[];
  sitePlan: SitePlanData | null;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function getImageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  
  let safePath = path;
  if (safePath.startsWith("http://localhost:4000")) {
    safePath = safePath.replace("http://localhost:4000", "");
  }
  
  if (safePath.startsWith("http")) return safePath;
  
  const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const hasUploads = safePath.includes("uploads/");
  const cleanPath = safePath.startsWith("/") ? safePath : `/${safePath}`;
  
  return `${baseUrl}${hasUploads ? cleanPath : `/uploads${cleanPath}`}`;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "Tersedia":
      return "#10b981";
    case "Booked":
      return "#f59e0b";
    case "Terjual":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

function getStatusBg(status: string): string {
  switch (status) {
    case "Tersedia":
      return "#ecfdf5";
    case "Booked":
      return "#fffbeb";
    case "Terjual":
      return "#fef2f2";
    default:
      return "#f9fafb";
  }
}

function getProjectStatusLabel(status: string): string {
  switch (status) {
    case "perencanaan":
      return "📋 Perencanaan";
    case "konstruksi":
      return "🏗️ Konstruksi";
    case "finishing":
      return "🔧 Finishing";
    case "selesai":
      return "✅ Selesai";
    default:
      return status;
  }
}

// ─── Section Components ───

function HeroSection({ project }: { project: ProjectDetailData }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[s.heroContainer, { opacity: fadeAnim }]}>
      {project.imageUrl ? (
        <Image
          source={{ uri: getImageUrl(project.imageUrl) }}
          style={s.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View style={s.heroPlaceholder}>
          <Ionicons name="business" size={48} color="#94a3b8" />
        </View>
      )}
      <View style={s.heroOverlay}>
        <View style={s.heroStatusRow}>
          <View style={s.heroStatusPill}>
            <Text style={s.heroStatusText}>
              {getProjectStatusLabel(project.status)}
            </Text>
          </View>
        </View>
        <Text style={s.heroTitle}>{project.name}</Text>
        <View style={s.heroLocationRow}>
          <Ionicons name="location-outline" size={14} color="#e2e8f0" />
          <Text style={s.heroLocation}>{project.location}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function StatsRow({ summary, progress }: { summary: StatusSummary; progress: number }) {
  return (
    <SlideInView direction="up" delay={100} duration={400}>
      <View style={s.statsGrid}>
        <View style={[s.statCard, { borderLeftColor: "#1a6d78" }]}>
          <Text style={s.statLabel}>Progres</Text>
          <CountUpNumber
            value={progress}
            suffix="%"
            duration={1000}
            style={s.statValue}
          />
          <AnimatedProgressBar
            progress={progress}
            height={4}
            color="#1a6d78"
            style={{ marginTop: 4 }}
          />
        </View>
        <View style={[s.statCard, { borderLeftColor: "#10b981" }]}>
          <Text style={s.statLabel}>Tersedia</Text>
          <CountUpNumber
            value={summary.tersedia}
            duration={800}
            style={[s.statValue, { color: "#10b981" }]}
          />
        </View>
        <View style={[s.statCard, { borderLeftColor: "#f59e0b" }]}>
          <Text style={s.statLabel}>Booked</Text>
          <CountUpNumber
            value={summary.booked}
            duration={800}
            style={[s.statValue, { color: "#f59e0b" }]}
          />
        </View>
        <View style={[s.statCard, { borderLeftColor: "#ef4444" }]}>
          <Text style={s.statLabel}>Terjual</Text>
          <CountUpNumber
            value={summary.terjual}
            duration={800}
            style={[s.statValue, { color: "#ef4444" }]}
          />
        </View>
      </View>
    </SlideInView>
  );
}

function InfoSection({ project }: { project: ProjectDetailData }) {
  const infoItems = [
    project.kontraktorName && {
      icon: "construct-outline" as const,
      label: "Kontraktor",
      value: project.kontraktorName,
    },
    project.nomorIzin && {
      icon: "document-text-outline" as const,
      label: "Nomor Izin",
      value: project.nomorIzin,
    },
    project.nilaiKontrak > 0 && {
      icon: "cash-outline" as const,
      label: "Nilai Kontrak",
      value: formatCurrency(project.nilaiKontrak),
    },
    project.estimasiAnggaran && {
      icon: "calculator-outline" as const,
      label: "Estimasi Anggaran",
      value: formatCurrency(project.estimasiAnggaran),
    },
    project.targetSelesai && {
      icon: "calendar-outline" as const,
      label: "Target Selesai",
      value: new Date(project.targetSelesai).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ].filter(Boolean) as Array<{
    icon: React.ComponentProps<typeof Ionicons>["name"];
    label: string;
    value: string;
  }>;

  if (infoItems.length === 0 && !project.description) return null;

  return (
    <SlideInView direction="up" delay={200} duration={400}>
      <Card>
        <SectionTitle title="Informasi Proyek" caption="Data detail proyek" />
        {project.description && (
          <Text style={s.description}>{project.description}</Text>
        )}
        {infoItems.map((item, i) => (
          <View key={i} style={s.infoRow}>
            <Ionicons name={item.icon} size={18} color="#1a6d78" />
            <View style={s.infoTextWrap}>
              <Text style={s.infoLabel}>{item.label}</Text>
              <Text style={s.infoValue}>{item.value}</Text>
            </View>
          </View>
        ))}
      </Card>
    </SlideInView>
  );
}

function PropertyTypesSection({ types, onSelect }: { types: PropertyTypeDetail[], onSelect: (pt: PropertyTypeDetail) => void }) {
  if (types.length === 0) return null;

  return (
    <SlideInView direction="up" delay={300} duration={400}>
      <Card>
        <SectionTitle
          title="Tipe Properti"
          caption={`${types.length} tipe tersedia`}
        />
        {types.map((pt) => (
          <Pressable
            key={pt.id}
            onPress={() => onSelect(pt)}
            style={({ pressed }) => [
              s.typeCard,
              pressed && { opacity: 0.85 },
            ]}
          >
            <View style={s.typeHeader}>
              <View style={{ flex: 1 }}>
                <Text style={s.typeName}>{pt.name}</Text>
                <Text style={s.typePrice}>{formatCurrency(pt.basePrice)}</Text>
              </View>
              <View style={s.typeActionRow}>
                <Text style={s.typeActionText}>Lihat Detail</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#1a6d78"
                />
              </View>
            </View>
          </Pressable>
        ))}
      </Card>
    </SlideInView>
  );
}

function SitePlanSection({ sitePlan }: { sitePlan: SitePlanData | null }) {
  if (!sitePlan) return null;

  return (
    <SlideInView direction="up" delay={350} duration={400}>
      <Card>
        <SectionTitle title="Site Plan" caption="Denah proyek" />
        <View style={s.sitePlanWrap}>
          <Image
            source={{ uri: getImageUrl(sitePlan.imageUrl) }}
            style={s.sitePlanImage}
            resizeMode="contain"
          />
        </View>
        <View style={s.sitePlanLegend}>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: "#10b981" }]} />
            <Text style={s.legendText}>Tersedia</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: "#f59e0b" }]} />
            <Text style={s.legendText}>Booked</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendDot, { backgroundColor: "#ef4444" }]} />
            <Text style={s.legendText}>Terjual</Text>
          </View>
        </View>
      </Card>
    </SlideInView>
  );
}

function BlocksSection({ blocks }: { blocks: BlockGroup[] }) {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(
    blocks.length > 0 ? blocks[0].name : null
  );

  if (blocks.length === 0) return null;

  return (
    <SlideInView direction="up" delay={400} duration={400}>
      <Card>
        <SectionTitle
          title="Daftar Unit / Kavling"
          caption={`${blocks.reduce((a, b) => a + b.units.length, 0)} unit tersedia`}
        />

        {/* Block tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.blockTabScroll}
        >
          {blocks.map((block) => (
            <Pressable
              key={block.name}
              onPress={() =>
                setExpandedBlock(
                  expandedBlock === block.name ? null : block.name
                )
              }
              style={[
                s.blockTab,
                expandedBlock === block.name && s.blockTabActive,
              ]}
            >
              <Text
                style={[
                  s.blockTabText,
                  expandedBlock === block.name && s.blockTabTextActive,
                ]}
              >
                Blok {block.name}
              </Text>
              <Text
                style={[
                  s.blockTabCount,
                  expandedBlock === block.name && s.blockTabCountActive,
                ]}
              >
                {block.units.length} unit
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Unit cards for expanded block */}
        {blocks.map(
          (block) =>
            expandedBlock === block.name && (
              <FadeInView key={block.name} duration={250}>
                <View style={s.unitGrid}>
                  {block.units.map((unit) => (
                    <View key={unit.id} style={s.unitCard}>
                      <View style={s.unitCardHeader}>
                        <View style={s.unitIdWrap}>
                          <Text style={s.unitId}>
                            {unit.blok}-{unit.nomorUnit || unit.nomor}
                          </Text>
                        </View>
                        <View
                          style={[
                            s.unitStatusDot,
                            {
                              backgroundColor: getStatusColor(
                                unit.statusPenjualan
                              ),
                            },
                          ]}
                        />
                      </View>

                      <Text style={s.unitTypeName}>{unit.typeName}</Text>
                      <Text style={s.unitPrice}>
                        {formatCurrency(unit.price)}
                      </Text>

                      <View style={s.unitProgressRow}>
                        <AnimatedProgressBar
                          progress={unit.progress}
                          height={3}
                          color={getStatusColor(unit.statusPenjualan)}
                          style={{ flex: 1 }}
                        />
                        <Text style={s.unitProgressText}>
                          {unit.progress}%
                        </Text>
                      </View>

                      <View
                        style={[
                          s.unitStatusBadge,
                          { backgroundColor: getStatusBg(unit.statusPenjualan) },
                        ]}
                      >
                        <Text
                          style={[
                            s.unitStatusText,
                            { color: getStatusColor(unit.statusPenjualan) },
                          ]}
                        >
                          {unit.statusPenjualan}
                        </Text>
                      </View>

                      {unit.buyerName && (
                        <View style={s.buyerRow}>
                          <Ionicons
                            name="person-outline"
                            size={12}
                            color="#64748b"
                          />
                          <Text style={s.buyerName} numberOfLines={1}>
                            {unit.buyerName}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </FadeInView>
            )
        )}
      </Card>
    </SlideInView>
  );
}

// ─── Main Screen ───

export function ProjectDetailScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = useAuth();
  const { projectId, projectName } = route.params as {
    projectId: string;
    projectName: string;
  };

  const [project, setProject] = useState<ProjectDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<PropertyTypeDetail | null>(null);

  const insets = useSafeAreaInsets();
  const safeTop = Platform.OS === 'android' ? ((StatusBar.currentHeight || 0) > 24 ? StatusBar.currentHeight : 45) : (insets?.top || 20);

  const loadProject = useCallback(async () => {
    if (!auth) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getProjectDetail(auth, projectId);
      setProject(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat detail proyek"
      );
    } finally {
      setIsLoading(false);
    }
  }, [auth, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  if (isLoading) {
    return (
      <View style={s.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadProject} tintColor="#ffffff" />}
        >
          {/* HERO HEADER */}
          <LinearGradient 
            colors={[c.primary600, c.primary, c.primaryDark]} 
            locations={[0, 0.4, 1]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={s.heroHeader}
          >
            <LinearGradient 
               colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} 
               style={StyleSheet.absoluteFillObject} 
               pointerEvents="none" 
            />
            <View style={[s.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
              <View style={s.heroTopRow}>
                <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [s.iconBtn, pressed && s.pressed]}>
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </Pressable>
                <Text style={s.heroHeaderTitle}>{projectName || "Detail Proyek"}</Text>
                <View style={{ width: 44 }} />
              </View>
            </View>
          </LinearGradient>

          <View style={s.contentPad}>
            <Skeleton width="100%" height={180} borderRadius={12} />
            <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
              <Skeleton width="48%" height={80} borderRadius={8} />
              <Skeleton width="48%" height={80} borderRadius={8} />
            </View>
            <SkeletonList count={3} />
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error || !project) {
    return (
      <View style={s.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadProject} tintColor="#ffffff" />}
        >
          {/* HERO HEADER */}
          <LinearGradient 
            colors={[c.primary600, c.primary, c.primaryDark]} 
            locations={[0, 0.4, 1]}
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={s.heroHeader}
          >
            <LinearGradient 
               colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} 
               style={StyleSheet.absoluteFillObject} 
               pointerEvents="none" 
            />
            <View style={[s.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
              <View style={s.heroTopRow}>
                <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [s.iconBtn, pressed && s.pressed]}>
                  <Ionicons name="arrow-back" size={24} color="#ffffff" />
                </Pressable>
                <Text style={s.heroHeaderTitle}>{projectName || "Detail Proyek"}</Text>
                <View style={{ width: 44 }} />
              </View>
            </View>
          </LinearGradient>

          <View style={s.contentPad}>
            <StatusBanner
              message={error || "Data proyek tidak ditemukan"}
              tone="danger"
            />
            <EmptyState
              message="Gagal memuat data proyek"
              actionLabel="Coba Lagi"
              onAction={loadProject}
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadProject} tintColor="#ffffff" />}
      >
        {/* HERO HEADER */}
        <LinearGradient 
          colors={[c.primary600, c.primary, c.primaryDark]} 
          locations={[0, 0.4, 1]}
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={s.heroHeader}
        >
          <LinearGradient 
             colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']} 
             style={StyleSheet.absoluteFillObject} 
             pointerEvents="none" 
          />
          <View style={[s.heroSafeArea, { paddingTop: (safeTop || 45) + 16 }]}>
            <View style={s.heroTopRow}>
              <Pressable onPress={() => navigation.goBack()} style={({ pressed }) => [s.iconBtn, pressed && s.pressed]}>
                <Ionicons name="arrow-back" size={24} color="#ffffff" />
              </Pressable>
              <Text style={s.heroHeaderTitle}>{project.name}</Text>
              <View style={{ width: 44 }} />
            </View>
          </View>
        </LinearGradient>

        {/* PROJECT IMAGE CARD (Overlapping) */}
        <View style={s.overlapContainer}>
          <SlideInView direction="up" delay={50} duration={500}>
            {project.imageUrl ? (
              <View style={s.projectImageCard}>
                <Image
                  source={{ uri: getImageUrl(project.imageUrl) }}
                  style={s.projectImage}
                  resizeMode="cover"
                />
                <View style={s.projectImageOverlay}>
                  <View style={s.projectStatusRow}>
                    <View style={s.projectStatusPill}>
                      <Text style={s.projectStatusText}>
                        {getProjectStatusLabel(project.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={s.projectLocationRow}>
                    <Ionicons name="location-outline" size={14} color="#e2e8f0" />
                    <Text style={s.projectLocation}>{project.location}</Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={s.projectImagePlaceholder}>
                <Ionicons name="business" size={48} color="#94a3b8" />
              </View>
            )}
          </SlideInView>
        </View>

        <View style={s.contentPad}>
          <StatsRow summary={project.statusSummary} progress={project.overallProgress} />
          <InfoSection project={project} />
          <PropertyTypesSection types={project.propertyTypes} onSelect={setSelectedType} />
          <SitePlanSection sitePlan={project.sitePlan} />
          <BlocksSection blocks={project.blocks} />
        </View>
      </ScrollView>

      <Modal visible={!!selectedType} animationType="slide" transparent={true} onRequestClose={() => setSelectedType(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Detail Tipe Rumah</Text>
              <IconButton icon="close" onPress={() => setSelectedType(null)} />
            </View>
            <ScrollView style={s.modalScroll} contentContainerStyle={s.modalScrollContent}>
              {selectedType?.imageUrl ? (
                <Image source={{ uri: getImageUrl(selectedType.imageUrl) }} style={s.modalImage} resizeMode="cover" />
              ) : (
                <View style={s.modalImagePlaceholder}>
                  <Ionicons name="home" size={64} color="#94a3b8" />
                  <Text style={s.modalImagePlaceholderText}>Tidak ada foto</Text>
                </View>
              )}
              
              <View style={s.modalContent}>
                <Text style={s.modalTypeName}>{selectedType?.name}</Text>
                <Text style={s.modalPrice}>{selectedType ? formatCurrency(selectedType.basePrice) : ""}</Text>
                
                <Text style={s.modalSectionLabel}>Spesifikasi Tipe</Text>
                <View style={s.typeDetailGrid}>
                  <View style={s.typeDetailItem}>
                    <Ionicons name="resize-outline" size={18} color="#1a6d78" />
                    <View>
                      <Text style={s.typeDetailLabel}>Luas Tanah</Text>
                      <Text style={s.typeDetailValue}>{selectedType?.luasTanah} m²</Text>
                    </View>
                  </View>
                  <View style={s.typeDetailItem}>
                    <Ionicons name="home-outline" size={18} color="#1a6d78" />
                    <View>
                      <Text style={s.typeDetailLabel}>Luas Bangunan</Text>
                      <Text style={s.typeDetailValue}>{selectedType?.luasBangunan} m²</Text>
                    </View>
                  </View>
                  <View style={s.typeDetailItem}>
                    <Ionicons name="bed-outline" size={18} color="#1a6d78" />
                    <View>
                      <Text style={s.typeDetailLabel}>Kamar Tidur</Text>
                      <Text style={s.typeDetailValue}>{selectedType?.kamarTidur}</Text>
                    </View>
                  </View>
                  <View style={s.typeDetailItem}>
                    <Ionicons name="water-outline" size={18} color="#1a6d78" />
                    <View>
                      <Text style={s.typeDetailLabel}>Kamar Mandi</Text>
                      <Text style={s.typeDetailValue}>{selectedType?.kamarMandi}</Text>
                    </View>
                  </View>
                </View>

                {selectedType?.facilities && (
                  <>
                    <Text style={s.modalSectionLabel}>Fasilitas & Keunggulan</Text>
                    <View style={s.modalFacilitiesWrap}>
                      <Text style={s.modalFacilitiesText}>{selectedType.facilities}</Text>
                    </View>
                  </>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ───

const s = StyleSheet.create({
  // Hero
  heroContainer: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 4,
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  heroPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  heroStatusRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  heroStatusPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  heroStatusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  heroLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  heroLocation: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "500",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: (SCREEN_WIDTH - 64) / 2 - 4,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a6d78",
    marginTop: 2,
  },

  // Info Section
  description: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 1,
  },

  // Property Types
  typeCard: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 12,
    backgroundColor: "#fafcfd",
    marginBottom: 8,
  },
  typeCardExpanded: {
    borderColor: "#1a6d78",
    backgroundColor: "#f0fafb",
  },
  typeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  typeName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  typePrice: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1a6d78",
    marginTop: 2,
  },
  typeDetailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  typeDetailItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  typeDetailLabel: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
  },
  typeDetailValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1e293b",
  },
  facilitiesWrap: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  facilitiesLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  facilitiesText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
  },

  // Site Plan
  sitePlanWrap: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sitePlanImage: {
    width: "100%",
    height: 250,
  },
  sitePlanLegend: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },

  // Blocks / Units
  blockTabScroll: {
    marginBottom: 12,
  },
  blockTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
    marginRight: 8,
    alignItems: "center",
  },
  blockTabActive: {
    borderColor: "#1a6d78",
    backgroundColor: "#f0fafb",
  },
  blockTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  blockTabTextActive: {
    color: "#1a6d78",
  },
  blockTabCount: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94a3b8",
    marginTop: 1,
  },
  blockTabCountActive: {
    color: "#1a6d78",
  },
  unitGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  unitCard: {
    width: "48.5%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    padding: 10,
    gap: 4,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  unitCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitIdWrap: {
    backgroundColor: "#f0f9ff",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  unitId: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0c4a6e",
  },
  unitStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  unitTypeName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    marginTop: 2,
  },
  unitPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1e293b",
  },
  unitProgressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  unitProgressText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    width: 30,
    textAlign: "right",
  },
  unitStatusBadge: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  unitStatusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  buyerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  buyerName: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "600",
    flex: 1,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "85%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  modalImage: {
    width: "100%",
    height: 240,
  },
  modalImagePlaceholder: {
    width: "100%",
    height: 240,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  modalImagePlaceholderText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContent: {
    padding: 20,
  },
  modalTypeName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a6d78",
    marginTop: 4,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    marginTop: 24,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalFacilitiesWrap: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  modalFacilitiesText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 22,
  },
  typeActionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typeActionText: {
    fontSize: 12,
    color: "#1a6d78",
    fontWeight: "700",
  },

  // Standard Header Styles
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
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  overlapContainer: {
    marginTop: -40,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  contentPad: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  projectImageCard: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
  projectImage: {
    width: "100%",
    height: 200,
  },
  projectImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(15, 23, 42, 0.65)",
  },
  projectStatusRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  projectStatusPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  projectStatusText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  projectLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  projectLocation: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "500",
  },
  projectImagePlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
});

