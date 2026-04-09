import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqScreenProps = {
  auth: AuthState;
};

export function FaqScreen({ auth }: FaqScreenProps) {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    authRequest<FaqItem[]>(auth, "/portal/faq")
      .then(setItems)
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Gagal memuat FAQ");
      });
  }, []);

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item.question}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.question}>{item.question}</Text>
            <Text>{item.answer}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f4fbf9"
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6ebe7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  question: {
    fontWeight: "700",
    marginBottom: 4
  },
  message: {
    color: "#c92d2d",
    marginBottom: 8
  }
});
