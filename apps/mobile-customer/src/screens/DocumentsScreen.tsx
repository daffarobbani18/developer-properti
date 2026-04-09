import { useEffect, useState } from "react";
import { FlatList, Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type DocumentItem = {
  id: string;
  category: string;
  title: string;
  status: string;
  storageUrl: string;
};

type DocumentsScreenProps = {
  auth: AuthState;
};

export function DocumentsScreen({ auth }: DocumentsScreenProps) {
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    authRequest<DocumentItem[]>(auth, "/portal/documents")
      .then(setItems)
      .catch((error) => {
        setMessage(error instanceof Error ? error.message : "Gagal memuat dokumen");
      });
  }, []);

  return (
    <View style={styles.container}>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.category}</Text>
            <Text>{item.status}</Text>
            <Pressable onPress={() => Linking.openURL(item.storageUrl)}>
              <Text style={styles.link}>Buka Dokumen</Text>
            </Pressable>
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
  title: {
    fontWeight: "700"
  },
  link: {
    marginTop: 6,
    color: "#0d766f",
    fontWeight: "700"
  },
  message: {
    color: "#c92d2d",
    marginBottom: 8
  }
});
