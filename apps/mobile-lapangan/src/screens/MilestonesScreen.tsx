import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { authRequest } from "../lib/api";
import { getQueue, setQueue } from "../lib/storage";
import type { AuthState, PendingQueueItem } from "../types";

type Milestone = {
  id: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  template: {
    name: string;
  };
};

type MilestonesScreenProps = {
  auth: AuthState;
};

async function queueMilestoneUpdate(item: PendingQueueItem): Promise<void> {
  const queue = await getQueue();
  queue.push(item);
  await setQueue(queue);
}

export function MilestonesScreen({ auth }: MilestonesScreenProps) {
  const [unitId, setUnitId] = useState("");
  const [items, setItems] = useState<Milestone[]>([]);
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  async function loadMilestones() {
    if (!unitId) {
      return;
    }

    try {
      const data = await authRequest<Milestone[]>(auth, `/field/units/${unitId}/milestones`);
      setItems(data);
      setMessage("Milestone berhasil dimuat");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal memuat milestone");
    }
  }

  async function syncQueue() {
    const queue = await getQueue();
    if (queue.length === 0) {
      setMessage("Queue offline kosong");
      return;
    }

    const remaining: PendingQueueItem[] = [];

    for (const item of queue) {
      try {
        if (item.type === "MILESTONE_UPDATE") {
          await authRequest(auth, `/field/milestones/${item.payload.milestoneId}/update`, {
            method: "POST",
            body: JSON.stringify({
              status: item.payload.status,
              note: item.payload.note
            })
          });
        }
      } catch {
        remaining.push(item);
      }
    }

    await setQueue(remaining);
    setMessage(`Sinkronisasi selesai. Sisa antrian: ${remaining.length}`);
    await loadMilestones();
  }

  useEffect(() => {
    syncQueue();
  }, []);

  async function updateStatus(milestoneId: string, status: "IN_PROGRESS" | "COMPLETED") {
    try {
      await authRequest(auth, `/field/milestones/${milestoneId}/update`, {
        method: "POST",
        body: JSON.stringify({
          status,
          note: `Update dari mobile lapangan: ${status}`
        })
      });
      setMessage("Milestone berhasil diupdate");
      await loadMilestones();
    } catch (error) {
      await queueMilestoneUpdate({
        type: "MILESTONE_UPDATE",
        payload: {
          milestoneId,
          status,
          note: "Disimpan saat offline"
        },
        createdAt: new Date().toISOString()
      });

      setMessage(error instanceof Error ? `${error.message}. Disimpan ke queue offline.` : "Tersimpan ke queue");
    }
  }

  async function uploadPhoto(milestoneId: string) {
    if (!photoUrl) {
      setMessage("Isi URL foto terlebih dahulu");
      return;
    }

    try {
      await authRequest(auth, `/field/milestones/${milestoneId}/photos`, {
        method: "POST",
        body: JSON.stringify({
          photos: [{ url: photoUrl, caption: "Upload mobile lapangan" }]
        })
      });
      setMessage("Foto milestone berhasil diunggah");
      setPhotoUrl("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal upload foto");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Milestone</Text>
      <TextInput
        style={styles.input}
        value={unitId}
        onChangeText={setUnitId}
        placeholder="Masukkan Unit ID"
      />
      <Pressable style={styles.button} onPress={loadMilestones}>
        <Text style={styles.buttonText}>Muat Milestone</Text>
      </Pressable>

      <TextInput
        style={styles.input}
        value={photoUrl}
        onChangeText={setPhotoUrl}
        placeholder="URL foto (contoh sementara)"
      />

      <Pressable style={styles.secondaryButton} onPress={syncQueue}>
        <Text style={styles.secondaryButtonText}>Sinkronkan Queue Offline</Text>
      </Pressable>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.template.name}</Text>
            <Text>Status: {item.status}</Text>
            <Text style={styles.muted}>Milestone ID: {item.id}</Text>
            <View style={styles.actions}>
              <Pressable style={styles.button} onPress={() => updateStatus(item.id, "IN_PROGRESS")}>
                <Text style={styles.buttonText}>On Progress</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={() => updateStatus(item.id, "COMPLETED")}>
                <Text style={styles.buttonText}>Selesai</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={() => uploadPhoto(item.id)}>
                <Text style={styles.secondaryButtonText}>Upload Foto</Text>
              </Pressable>
            </View>
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
  input: {
    borderWidth: 1,
    borderColor: "#c8d6e1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    backgroundColor: "#fff",
    marginBottom: 8
  },
  button: {
    backgroundColor: "#0d7486",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#0d7486",
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  secondaryButtonText: {
    color: "#0d7486",
    fontWeight: "700"
  },
  message: {
    marginVertical: 8,
    color: "#3b566c"
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
  },
  muted: {
    color: "#5f7082",
    fontSize: 12,
    marginBottom: 6
  },
  actions: {
    gap: 6
  }
});
