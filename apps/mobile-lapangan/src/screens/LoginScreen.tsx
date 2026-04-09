import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { login } from "../lib/api";
import type { AuthState } from "../types";

type LoginScreenProps = {
  onLogin: (auth: AuthState) => Promise<void>;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("engineer@simdp.local");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function submit() {
    setLoading(true);
    setErrorMessage("");
    try {
      const auth = await login(email, password);
      await onLogin(auth);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>SIMDP Mobile Lapangan</Text>
      <Text style={styles.subtitle}>Masuk sebagai Site Engineer atau Manajer Proyek.</Text>

      <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Email" />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Password"
      />

      <Pressable style={styles.button} onPress={submit} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Memproses..." : "Masuk"}</Text>
      </Pressable>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#d6e4ef"
  },
  title: {
    fontSize: 22,
    fontWeight: "700"
  },
  subtitle: {
    color: "#53626f",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#c7d7e2",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8
  },
  button: {
    backgroundColor: "#0c7385",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  error: {
    color: "#c92f2f",
    marginTop: 8
  }
});
