import React, { useCallback, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated, Easing } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

import {
  Badge,
  Card,
  EmptyState,
  LabeledInput,
  PrimaryButton,
  ScreenShell,
  SecondaryButton,
  SectionTitle,
  StatusBanner,
  SkeletonList,
  CountUpNumber,
} from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import {
  getFieldAttendanceHistory,
  getFieldAttendanceSummary,
  submitAttendance,
  updateFieldAttendance,
} from "../../services/api";
import { AttendanceItem, AttendanceSummary } from "../../types";
import { formatAttendanceStatusLabel } from "../../utils/format";
import { formatRelativeDate } from "../../utils/dateUtils";
import { getCurrentLocation, requestLocationPermission, validateLocation } from "../../services/location";

function getStatusIcon(status: AttendanceItem["status"]): React.JSX.Element {
  const iconMap: Record<AttendanceItem["status"], "checkmark-circle" | "time" | "document-text" | "medkit" | "alert-circle"> = {
    HADIR: "checkmark-circle",
    TERLAMBAT: "time",
    IZIN: "document-text",
    SAKIT: "medkit",
    ALPHA: "alert-circle",
  };
  const iconColor: Record<AttendanceItem["status"], string> = {
    HADIR: "#10b981",
    TERLAMBAT: "#f59e0b",
    IZIN: "#6b7280",
    SAKIT: "#8b5cf6",
    ALPHA: "#ef4444",
  };
  return <Ionicons name={iconMap[status]} size={16} color={iconColor[status]} />;
}

function getStatusTone(status: AttendanceItem["status"]): "success" | "warning" | "neutral" | "danger" {
  switch (status) {
    case "HADIR":
      return "success";
    case "TERLAMBAT":
      return "warning";
    case "IZIN":
      return "neutral";
    case "SAKIT":
      return "warning";
    case "ALPHA":
      return "danger";
  }
}

function getStatusLabel(status: AttendanceItem["status"]): string {
  return formatAttendanceStatusLabel(status);
}

export function FieldAttendanceScreen(): React.JSX.Element {
  const { auth } = useAuth();
  const navigation = useNavigation();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [history, setHistory] = useState<AttendanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<AttendanceItem | null>(null);
  const [checkoutNotes, setCheckoutNotes] = useState("");

  const checkInScale = useRef(new Animated.Value(1)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  const checkInButtonStyle = {
    transform: [{ scale: checkInScale }],
  };

  const pulseStyle = {
    transform: [{ scale: pulseScale }],
  };

  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;

    if (todayAttendance?.status === "HADIR") {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.08,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      );
      pulseAnimation.start();
    } else {
      Animated.timing(pulseScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      pulseAnimation?.stop();
    };
  }, [todayAttendance?.status, pulseScale]);

  const animatedHandleCheckIn = async () => {
    Animated.sequence([
      Animated.spring(checkInScale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(checkInScale, {
        toValue: 1.05,
        useNativeDriver: true,
        speed: 30,
        bounciness: 2,
      }),
      Animated.spring(checkInScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
    ]).start();
    await handleCheckIn();
  };

  const animatedHandleCheckOut = async () => {
    Animated.sequence([
      Animated.spring(checkInScale, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }),
      Animated.spring(checkInScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }),
    ]).start();
    await handleCheckOut();
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const loadAttendanceData = useCallback(async () => {
    if (!auth) {
      return;
    }

    setErrorMessage(null);
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      const [summaryData, historyData] = await Promise.all([
        getFieldAttendanceSummary(auth),
        getFieldAttendanceHistory(auth, { month: currentMonth, limit: 30 }),
      ]);

      setSummary(summaryData);
      setHistory(historyData);

      const todayRecord = historyData.find((item) => item.date === todayDate);
      setTodayAttendance(todayRecord ?? null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data absensi");
    }
  }, [auth, todayDate]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        setIsLoading(true);
        try {
          await loadAttendanceData();
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [loadAttendanceData])
  );

  const handleCheckIn = useCallback(async () => {
    if (!auth || todayAttendance) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const { status } = await requestLocationPermission();
      if (status !== "granted") {
        setErrorMessage("Izin lokasi diperlukan untuk absen masuk.");
        return;
      }

      const location = await getCurrentLocation();
      const validation = await validateLocation(location);

      if (!validation.valid) {
        setErrorMessage(validation.error ?? "Lokasi tidak valid");
        return;
      }

      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);

      const newRecord = await submitAttendance(auth, {
        date: todayDate,
        checkInTime: timeString,
        status: "HADIR",
        notes: "Absen masuk via aplikasi",
        location: location?.coords
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTodayAttendance(newRecord);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal melakukan absen masuk");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, todayAttendance, todayDate]);

  const handleCheckOut = useCallback(async () => {
    if (!auth || !todayAttendance || todayAttendance.checkOutTime) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const now = new Date();
      const timeString = now.toTimeString().slice(0, 5);

      const updatedRecord = await updateFieldAttendance(auth, todayAttendance.id, {
        checkOutTime: timeString,
        notes: checkoutNotes || todayAttendance.notes,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTodayAttendance(updatedRecord);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal melakukan absen pulang");
    } finally {
      setIsSubmitting(false);
    }
  }, [auth, todayAttendance, checkoutNotes]);

  return (
    <ScreenShell title="Absensi Lapangan" subtitle="Catat kehadiran harian di lokasi proyek">
      {errorMessage ? <StatusBanner message={errorMessage} tone="danger" /> : null}

      <Card>
        <SectionTitle title="Absen Hari Ini" caption={todayDate} />
        
        {isLoading ? (
          <SkeletonList count={2} />
        ) : (
          <View style={styles.todayWrap}>
            {todayAttendance ? (
              <View style={styles.todayItem}>
<View style={styles.todayRow}>
                   <Text style={styles.todayLabel}>Status</Text>
                   <Animated.View style={pulseStyle}>
                     <Badge label={getStatusLabel(todayAttendance.status)} tone={getStatusTone(todayAttendance.status)} />
                   </Animated.View>
                 </View>

                {todayAttendance.checkInTime && (
                  <View style={styles.todayRow}>
                    <Text style={styles.todayLabel}>Jam Masuk</Text>
                    <Text style={styles.todayValue}>{todayAttendance.checkInTime}</Text>
                  </View>
                )}

                {todayAttendance.checkOutTime ? (
                  <View style={styles.todayRow}>
                    <Text style={styles.todayLabel}>Jam Pulang</Text>
                    <Text style={styles.todayValue}>{todayAttendance.checkOutTime}</Text>
                  </View>
                ) : (
                  <View style={styles.checkoutSection}>
                    <LabeledInput
                      label="Catatan (opsional)"
                      placeholder="Tambahkan catatan kerja hari ini"
                      value={checkoutNotes}
                      onChangeText={setCheckoutNotes}
                    />
                    <PrimaryButton
                      label="Absen Pulang"
                      onPress={() => void handleCheckOut()}
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    />
                  </View>
                )}
              </View>
) : (
               <View style={styles.todayItem}>
                 <Text style={styles.notCheckedText}>Belum absen masuk hari ini</Text>
                 <Animated.View style={checkInButtonStyle}>
                   <PrimaryButton
                     label="Absen Masuk"
                     onPress={() => void animatedHandleCheckIn()}
                     disabled={isSubmitting}
                     loading={isSubmitting}
                   />
                 </Animated.View>
               </View>
             )}
          </View>
        )}
      </Card>

      {summary && (
        <Card>
          <SectionTitle title="Ringkasan Bulanan" caption="Statistik kehadiran 30 hari terakhir" />
          
<View style={styles.statsGrid}>
             <View style={styles.statPill}>
               <Text style={styles.statLabel}>Kehadiran</Text>
               <CountUpNumber value={summary.attendanceRate} duration={1000} suffix="%" style={styles.statValue} />
             </View>
             <View style={styles.statPill}>
               <Text style={styles.statLabel}>Hadir</Text>
               <CountUpNumber value={summary.presentDays} duration={800} style={styles.statValue} />
             </View>
             <View style={styles.statPill}>
               <Text style={styles.statLabel}>Terlambat</Text>
               <CountUpNumber value={summary.lateDays} duration={800} style={styles.statValue} />
             </View>
             <View style={styles.statPill}>
               <Text style={styles.statLabel}>Izin/Sakit</Text>
               <CountUpNumber value={summary.permissionDays + summary.sickDays} duration={800} style={styles.statValue} />
             </View>
           </View>
        </Card>
      )}

      <Card>
        <SectionTitle title="Riwayat Absensi" caption="5 data terakhir" />
        
        {isLoading ? (
          <SkeletonList count={3} />
        ) : history.length === 0 ? (
          <EmptyState message="Belum ada data absensi" />
        ) : (
<View style={styles.historyList}>
             {history.slice(0, 5).map((item) => (
               <View key={item.id} style={styles.historyItem}>
<View style={styles.historyHeader}>
                    <Text style={styles.historyDate}>{formatRelativeDate(item.date)}</Text>
                    <View style={styles.statusWithIcon}>
                      {getStatusIcon(item.status)}
                      <Badge label={getStatusLabel(item.status)} tone={getStatusTone(item.status)} />
                    </View>
                  </View>
                 <View style={styles.historyTimes}>
                   {item.checkInTime && (
                     <Text style={styles.historyTime}>Masuk: {item.checkInTime}</Text>
                   )}
                   {item.checkOutTime && (
                     <Text style={styles.historyTime}>Pulang: {item.checkOutTime}</Text>
                   )}
                 </View>
               </View>
             ))}
           </View>
        )}
        
<SecondaryButton
            label="Lihat Semua Riwayat"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("AttendanceHistory" as never);
            }}
          />
      </Card>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  todayWrap: {
    gap: 8,
  },
  todayItem: {
    gap: 8,
  },
  todayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todayLabel: {
    color: "#3a5f67",
    fontSize: 14,
    fontWeight: "600",
  },
  todayValue: {
    color: "#123d47",
    fontSize: 16,
    fontWeight: "700",
  },
  checkoutSection: {
    gap: 12,
    marginTop: 8,
  },
  notCheckedText: {
    color: "#4a6f78",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statPill: {
    flexGrow: 1,
    minWidth: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cae0e4",
    backgroundColor: "#f4fbfc",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  statLabel: {
    color: "#4a6f78",
    fontSize: 11,
    fontWeight: "700",
  },
  statValue: {
    color: "#184b55",
    fontSize: 18,
    fontWeight: "800",
  },
  historyList: {
    gap: 8,
  },
  historyItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5ecee",
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  historyDate: {
    color: "#123d47",
    fontSize: 13,
    fontWeight: "600",
  },
  historyTimes: {
    flexDirection: "row",
    gap: 12,
  },
  historyTime: {
    color: "#4a6f78",
    fontSize: 12,
  },
  statusWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});