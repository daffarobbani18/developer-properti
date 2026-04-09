import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { login } from "../lib/api";
import type { AuthState } from "../types";

type LoginScreenProps = {
  onLogin: (auth: AuthState) => Promise<void>;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("customer@simdp.local");
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
      <Text style={styles.title}>SIMDP Customer</Text>
      <Text style={styles.subtitle}>Pantau progres unit, tagihan, dan dokumen Anda.</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
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
    borderWidth: 1,
    borderColor: "#d7ebe8",
    borderRadius: 14,
    padding: 16
  },
  title: {
    fontSize: 22,
    fontWeight: "700"
  },
  subtitle: {
    color: "#4e6664",
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: "#c7ddda",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8
  },
  button: {
    backgroundColor: "#0d766f",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  error: {
    marginTop: 8,
    color: "#c72d2d"
  }
});
