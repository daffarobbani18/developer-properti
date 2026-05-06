import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as LocalAuthentication from "expo-local-authentication";

import { LabeledInput, PrimaryButton, SecondaryButton } from "../../components/ui";
import { useAuth } from "../../hooks/useAuth";
import { demoCredentials } from "../../services/mock-data";
import { getStoredAuth } from "../../services/storage";
import { AuthState } from "../../types";

export function LoginScreen(): React.JSX.Element {
  const { signIn, setSession } = useAuth();
  const [email, setEmail] = useState(demoCredentials[0]?.email ?? "");
  const [password, setPassword] = useState(demoCredentials[0]?.password ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [storedAuth, setStoredAuthState] = useState<AuthState | null>(null);
  const [isBiometricReady, setIsBiometricReady] = useState(false);
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [hasHardware, isEnrolled, savedAuth] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          getStoredAuth(),
        ]);

        if (!mounted) {
          return;
        }

        setStoredAuthState(savedAuth);
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

  const demoHint = useMemo(
    () =>
      demoCredentials.map((item) => `${item.role}: ${item.email} / ${item.password}`).join("\n"),
    []
  );

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
            hint="Gunakan akun demo atau akun backend Anda"
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <PrimaryButton label="Login" loading={isSubmitting} onPress={handleSignIn} />

          {isCheckingBiometric ? (
            <View style={styles.biometricLoader}>
              <ActivityIndicator size="small" color="#1e6f78" />
              <Text style={styles.biometricText}>Memeriksa biometrik perangkat...</Text>
            </View>
          ) : null}

          {isBiometricReady ? (
            <SecondaryButton label="Masuk dengan Biometrik" onPress={handleBiometricSignIn} />
          ) : null}
        </View>

        <View style={styles.demoCard}>
          <Text style={styles.demoTitle}>Akun Demo</Text>
          <Text style={styles.demoHint}>{demoHint}</Text>
          <View style={styles.credentialRowWrap}>
            {demoCredentials.map((item) => (
              <Pressable
                key={item.email}
                onPress={() => {
                  setEmail(item.email);
                  setPassword(item.password);
                }}
                style={({ pressed }) => [styles.credentialPill, pressed && styles.credentialPressed]}
              >
                <Text style={styles.credentialRole}>{item.role}</Text>
                <Text style={styles.credentialEmail}>{item.email}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e5f1f0",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  heroCard: {
    borderRadius: 18,
    backgroundColor: "#154b57",
    padding: 16,
    gap: 8,
  },
  heroKicker: {
    color: "#98d8e2",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "800",
    lineHeight: 29,
  },
  heroSubtitle: {
    color: "#d7edf0",
    fontSize: 13,
    lineHeight: 20,
  },
  formCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bfd9dc",
    backgroundColor: "#ffffff",
    padding: 14,
    gap: 10,
  },
  formTitle: {
    color: "#183843",
    fontSize: 18,
    fontWeight: "800",
  },
  biometricLoader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  biometricText: {
    color: "#4e6870",
    fontSize: 13,
  },
  errorText: {
    color: "#a41f26",
    fontSize: 13,
    fontWeight: "600",
  },
  demoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bfd9dc",
    backgroundColor: "#f7fcfd",
    padding: 14,
    gap: 10,
  },
  demoTitle: {
    color: "#183843",
    fontSize: 15,
    fontWeight: "800",
  },
  demoHint: {
    color: "#456068",
    fontSize: 12,
    lineHeight: 19,
  },
  credentialRowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  credentialPill: {
    borderWidth: 1,
    borderColor: "#97bbc0",
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    minWidth: "48%",
  },
  credentialPressed: {
    opacity: 0.8,
  },
  credentialRole: {
    color: "#174857",
    fontSize: 11,
    fontWeight: "800",
  },
  credentialEmail: {
    color: "#345c66",
    fontSize: 12,
    marginTop: 2,
  },
});
