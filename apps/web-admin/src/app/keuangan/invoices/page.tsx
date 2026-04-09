"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type Invoice = {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: string;
  customer: {
    user: {
      fullName: string;
      email: string;
    };
  };
  unit?: {
    code: string;
  } | null;
};

const allowedRoles: Role[] = ["DIRECTOR", "FINANCE_MANAGER", "FINANCE_ADMIN"];

export default function InvoicePage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [items, setItems] = useState<Invoice[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      const data = await apiRequest<Invoice[]>("/finance/invoices");
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat invoice");
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadData();
  }, [auth]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      invoiceId: String(formData.get("invoiceId") ?? ""),
      amount: Number(formData.get("amount") ?? 0),
      method: String(formData.get("method") ?? "TRANSFER")
    };

    try {
      await apiRequest("/finance/payments", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      event.currentTarget.reset();
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menambah pembayaran");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="Tagihan & Piutang" subtitle="Monitoring tagihan pembeli dan verifikasi pembayaran.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <div className="panel">
        <h3>Konfirmasi Pembayaran</h3>
        <form className="inline-form" onSubmit={submitPayment}>
          <input name="invoiceId" placeholder="Invoice ID" required />
          <div className="two-col">
            <input name="amount" type="number" placeholder="Nominal" required />
            <select name="method" defaultValue="TRANSFER">
              <option value="TRANSFER">Transfer</option>
              <option value="VA">Virtual Account</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>
          <button type="submit">Catat Pembayaran</button>
        </form>
      </div>

      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Unit</th>
              <th>Jenis</th>
              <th>Jatuh Tempo</th>
              <th>Nominal</th>
              <th>Status</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.customer.user.fullName}</td>
                <td>{item.unit?.code ?? "-"}</td>
                <td>{item.type}</td>
                <td>{new Date(item.dueDate).toLocaleDateString("id-ID")}</td>
                <td>Rp{item.amount.toLocaleString("id-ID")}</td>
                <td>
                  <span className="status-chip">{item.status}</span>
                </td>
                <td>{item.id.slice(-8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
