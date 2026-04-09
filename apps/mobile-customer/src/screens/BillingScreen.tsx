import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { authRequest } from "../lib/api";
import type { AuthState } from "../types";

type Invoice = {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: string;
};

type BillingScreenProps = {
  auth: AuthState;
};

export function BillingScreen({ auth }: BillingScreenProps) {
  const [items, setItems] = useState<Invoice[]>([]);
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    const data = await authRequest<Invoice[]>(auth, "/portal/invoices");
    setItems(data);
  }

  useEffect(() => {
    loadData().catch((error) => {
      setMessage(error instanceof Error ? error.message : "Gagal memuat tagihan");
    });
  }, []);

  async function uploadProof() {
    try {
      await authRequest(auth, "/portal/payments/upload", {
        method: "POST",
        body: JSON.stringify({
          invoiceId,
          amount: Number(amount),
          method: "TRANSFER",
          proofUrl
        })
      });
      setInvoiceId("");
      setAmount("");
      setProofUrl("");
      setMessage("Bukti pembayaran terkirim");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gagal upload bukti");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Upload Bukti Pembayaran</Text>
        <TextInput style={styles.input} value={invoiceId} onChangeText={setInvoiceId} placeholder="Invoice ID" />
        <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="Nominal" keyboardType="numeric" />
        <TextInput style={styles.input} value={proofUrl} onChangeText={setProofUrl} placeholder="URL bukti transfer" />
        <Pressable style={styles.button} onPress={uploadProof}>
          <Text style={styles.buttonText}>Kirim Bukti</Text>
        </Pressable>
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.type}</Text>
            <Text>Rp{item.amount.toLocaleString("id-ID")}</Text>
            <Text>{new Date(item.dueDate).toLocaleDateString("id-ID")}</Text>
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
