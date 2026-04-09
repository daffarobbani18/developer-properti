import { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type Unit = {
  id: string;
  code: string;
  typeName: string;
  status: string;
  progress: number;
};

type Project = {
  id: string;
  name: string;
};

type UnitsScreenProps = {
  auth: AuthState;
};

export function UnitsScreen({ auth }: UnitsScreenProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [items, setItems] = useState<Unit[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  async function loadProjects() {
    const data = await authRequest<Project[]>(auth, "/field/projects");
    setProjects(data);
    if (!projectId && data.length > 0) {
      setProjectId(data[0].id);
    }
  }

  async function loadUnits(id: string) {
    if (!id) {
      setItems([]);
      return;
    }
    const data = await authRequest<Unit[]>(auth, `/field/projects/${id}/units`);
    setItems(data);
  }

  async function refresh() {
    setRefreshing(true);
    try {
      await loadProjects();
      if (projectId) {
        await loadUnits(projectId);
      }
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadUnits(projectId);
  }, [projectId]);

  const filtered = items.filter(
    (item) => item.code.toLowerCase().includes(search.toLowerCase()) || item.typeName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Unit Proyek</Text>

      <Text style={styles.label}>Project ID</Text>
      <TextInput
        style={styles.input}
        value={projectId}
        onChangeText={setProjectId}
        placeholder={projects[0]?.id ?? "Masukkan project ID"}
      />

      <TextInput style={styles.input} placeholder="Cari unit" value={search} onChangeText={setSearch} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.code}>{item.code}</Text>
            <Text>{item.typeName}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Progress: {item.progress}%</Text>
            <Text style={styles.muted}>Unit ID: {item.id}</Text>
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
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8
  },
  label: {
    color: "#4c6072",
    marginBottom: 4
  },
  input: {
    borderWidth: 1,
    borderColor: "#c8d6e1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#fff",
    marginBottom: 8
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e4ef",
    borderRadius: 12,
    padding: 10,
    marginBottom: 8
  },
  code: {
    fontWeight: "700"
  },
  muted: {
    color: "#5f7082",
    fontSize: 12
  }
});
