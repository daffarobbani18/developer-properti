import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type Issue = {
  id: string;
  title: string;
  category: string;
  urgency: string;
  status: string;
};

type IssuesScreenProps = {
  auth: AuthState;
};

export function IssuesScreen({ auth }: IssuesScreenProps) {
  const [items, setItems] = useState<Issue[]>([]);
  const [projectId, setProjectId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function loadIssues() {
    try {
      const path = projectId ? `/field/issues?projectId=${projectId}` : "/field/issues";
      const data = await authRequest<Issue[]>(auth, path);
      setItems(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat kendala");
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  async function submitIssue() {
    if (!projectId || !title || !description) {
      setMessage("Project ID, judul, dan deskripsi wajib diisi");
      return;
    }

    try {
      await authRequest(auth, "/field/issues", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          unitId: unitId || undefined,
          title,
          category: "Jadwal Molor",
          urgency: "HIGH",
          description
        })
      });
      setTitle("");
      setDescription("");
      setMessage("Laporan kendala berhasil dikirim");
      await loadIssues();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal mengirim kendala");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Laporan Kendala</Text>
      <TextInput style={styles.input} placeholder="Project ID" value={projectId} onChangeText={setProjectId} />
      <TextInput style={styles.input} placeholder="Unit ID (opsional)" value={unitId} onChangeText={setUnitId} />
      <TextInput style={styles.input} placeholder="Judul kendala" value={title} onChangeText={setTitle} />
      <TextInput
        style={[styles.input, { minHeight: 80 }]}
        placeholder="Deskripsi"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Pressable style={styles.button} onPress={submitIssue}>
        <Text style={styles.buttonText}>Kirim Kendala</Text>
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.category}</Text>
            <Text>
              {item.urgency} - {item.status}
            </Text>
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
    backgroundColor: "#f2f7fb"
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: "#c8d6e1",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginBottom: 8
  },
  button: {
    backgroundColor: "#0d7486",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  message: {
    marginVertical: 8,
    color: "#415d73"
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e4ef",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  cardTitle: {
    fontWeight: "700"
  }
});
