import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type Milestone = {
  id: string;
  status: string;
  template: {
    name: string;
  };
};

type ProgressScreenProps = {
  auth: AuthState;
};

export function ProgressScreen({ auth }: ProgressScreenProps) {
  const [unitCode, setUnitCode] = useState("-");
  const [progress, setProgress] = useState(0);
  const [items, setItems] = useState<Milestone[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    authRequest<{ unit?: { code: string; progress: number } | null; milestones: Milestone[] }>(auth, "/portal/progress")
      .then((data) => {
        setUnitCode(data.unit?.code ?? "-");
        setProgress(data.unit?.progress ?? 0);
        setItems(data.milestones);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat progres");
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Unit</Text>
        <Text style={styles.value}>{unitCode}</Text>
        <Text style={styles.label}>Progress Total</Text>
        <Text style={styles.value}>{progress}%</Text>
      </View>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.template.name}</Text>
            <Text>{item.status}</Text>
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
  label: {
    color: "#55706d"
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0d766f",
    marginBottom: 4
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
  error: {
    color: "#c82f2f",
    marginBottom: 6
  }
});
