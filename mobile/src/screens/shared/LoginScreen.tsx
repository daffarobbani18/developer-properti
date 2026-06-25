import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";

import { LabeledInput, PrimaryButton, SecondaryButton } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { clearBiometricCredential, getBiometricCredential, getStoredAuth, setBiometricCredential } from "../../services/storage";
import { registerBiometricCredential } from "../../services/api";
import { AuthState } from "../../types";
import { c } from "../../theme/colors";

export function LoginScreen(): React.JSX.Element {
  const { signIn, setSession, auth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);

  const [storedAuth, setStoredAuthState] = useState<AuthState | null>(null);
  const [isBiometricReady, setIsBiometricReady] = useState(false);
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(true);
  const [savedBiometricCred, setSavedBiometricCred] = useState<{ credentialId: string; publicKey: string } | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [hasHardware, isEnrolled, savedAuth, savedCred] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          getStoredAuth(),
          getBiometricCredential(),
        ]);

        if (!mounted) {
          return;
        }

        setStoredAuthState(savedAuth);
        setSavedBiometricCred(savedCred);
        setIsBiometricReady(Boolean(hasHardware && isEnrolled && savedAuth));
      } finally {
        if (mounted) {
          setIsCheckingBiometric(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSignIn = async (): Promise<void> => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await signIn(email.trim(), password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal login");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleBiometricSignIn = async (): Promise<void> => {
    if (!storedAuth) {
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentikasi biometrik",
        fallbackLabel: "Gunakan password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        await setSession(storedAuth);
      }
    } catch {
      setErrorMessage("Biometrik gagal. Silakan login dengan email dan password.");
    }
  };

  const handleBiometricSetup = async (): Promise<void> => {
    if (!auth) {
      return;
    }

    try {
      const credentialId = `cred_${Date.now()}`;
      const publicKey = `${auth.user.id}-${credentialId}`;

      await setBiometricCredential({ credentialId, publicKey });
      await registerBiometricCredential(auth, { credentialId, publicKey });
      setSavedBiometricCred({ credentialId, publicKey });
      setShowBiometricSetup(false);
    } catch {
      setErrorMessage("Gagal mendaftarkan biometrik. Silakan coba lagi.");
    }
  };

  const handleDisableBiometric = async (): Promise<void> => {
    await clearBiometricCredential();
    setSavedBiometricCred(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroKicker}>SIMDP Mobile</Text>
          <Text style={styles.heroTitle}>Monitoring Lapangan dan Portal Customer</Text>
          <Text style={styles.heroSubtitle}>
            Aplikasi ini mendukung update progres unit, kelola milestone, tagihan, dokumen, dan tiket
            bantuan dalam satu aplikasi.
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Masuk ke akun</Text>
          <LabeledInput
            label="Email"
            placeholder="email@contoh.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <LabeledInput
            label="Password"
            placeholder="Masukkan password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            hint="Masukkan password akun Anda"
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <PrimaryButton label="Login" loading={isSubmitting} onPress={handleSignIn} />

          {isCheckingBiometric ? (
            <View style={styles.biometricLoader}>
              <ActivityIndicator size="small" color="#1e6f78" />
              <Text style={styles.biometricText}>Memeriksa biometrik perangkat...</Text>
            </View>
          ) : null}

          {showBiometricSetup ? (
            <View style={styles.biometricSetupRow}>
              <SecondaryButton label="Batal" onPress={() => setShowBiometricSetup(false)} />
              <PrimaryButton label="Daftarkan Biometrik" onPress={handleBiometricSetup} />
            </View>
          ) : null}

          {isBiometricReady ? (
            <SecondaryButton label="Masuk dengan Biometrik" onPress={handleBiometricSignIn} />
          ) : null}

          {auth && !savedBiometricCred ? (
            <SecondaryButton label="Aktifkan Login Biometrik" onPress={() => setShowBiometricSetup(true)} />
          ) : null}

          {savedBiometricCred ? (
            <SecondaryButton label="Nonaktifkan Login Biometrik" onPress={handleDisableBiometric} />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: c.neutral50,
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: c.primaryDark,
    padding: 24,
    gap: 12,
    shadowColor: c.primaryDark,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  heroKicker: {
    color: c.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: c.neutral300,
    fontSize: 14,
    lineHeight: 22,
  },
  formCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.8)",
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 16,
    shadowColor: c.neutral900,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  formTitle: {
    color: c.neutral900,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  biometricSetupRow: {
    flexDirection: "row",
    gap: 12,
  },
  biometricLoader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  biometricText: {
    color: c.neutral600,
    fontSize: 14,
  },
  errorText: {
    color: c.danger.text,
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: c.danger.bg,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.danger.border,
  },
});