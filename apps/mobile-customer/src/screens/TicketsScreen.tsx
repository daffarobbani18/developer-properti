import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  category: string;
};

type TicketsScreenProps = {
  auth: AuthState;
};

export function TicketsScreen({ auth }: TicketsScreenProps) {
  const [items, setItems] = useState<Ticket[]>([]);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    const data = await authRequest<Ticket[]>(auth, "/portal/tickets");
    setItems(data);
  }

  useEffect(() => {
    loadData().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Gagal memuat tiket");
    });
  }, []);

  async function createTicket() {
    if (!subject || !description) {
      setMessage("Subjek dan deskripsi wajib diisi");
      return;
    }

    try {
      await authRequest(auth, "/portal/tickets", {
        method: "POST",
        body: JSON.stringify({
          category: "Lainnya",
          subject,
          description
        })
      });
      setSubject("");
      setDescription("");
      setMessage("Tiket berhasil dibuat");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal membuat tiket");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Buat Tiket Komplain</Text>
        <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Subjek" />
        <TextInput
          style={[styles.input, { minHeight: 80 }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Deskripsi"
          multiline
        />
        <Pressable style={styles.button} onPress={createTicket}>
          <Text style={styles.buttonText}>Kirim Tiket</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.subject}</Text>
            <Text>{item.category}</Text>
            <Text>{item.status}</Text>
            <Text style={styles.muted}>ID: {item.id}</Text>
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
    padding: 12,
    marginBottom: 8
  },
  title: {
    fontWeight: "700",
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: "#c7ddda",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 7
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
  message: {
    marginTop: 7,
    color: "#4d6763"
  },
  item: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6ebe7",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  itemTitle: {
    fontWeight: "700"
  },
  muted: {
    color: "#617b78",
    fontSize: 12
  }
});
