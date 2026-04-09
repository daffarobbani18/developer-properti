"use client";

import { FormEvent, useEffect, useState } from "react";

import { PortalShell } from "../../components/PortalShell";
import { apiRequest } from "../../lib/api-client";
import { useAuthGuard } from "../../lib/use-auth-guard";

type Invoice = {
  id: string;
  type: string;
  amount: number;
  dueDate: string;
  status: string;
};

export default function TagihanPage() {
  const { auth, loading } = useAuthGuard();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadInvoices() {
    try {
      const data = await apiRequest<Invoice[]>("/portal/invoices");
      setInvoices(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat tagihan");
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadInvoices();
  }, [auth]);

  async function uploadPaymentProof(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await apiRequest("/portal/payments/upload", {
        method: "POST",
        body: JSON.stringify({
          invoiceId: String(formData.get("invoiceId") ?? ""),
          amount: Number(formData.get("amount") ?? 0),
          method: String(formData.get("method") ?? "TRANSFER"),
          proofUrl: String(formData.get("proofUrl") ?? "")
        })
      });
      event.currentTarget.reset();
      await loadInvoices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal unggah bukti bayar");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <PortalShell user={auth.user} title="Tagihan & Pembayaran" subtitle="Lihat tagihan aktif dan unggah bukti pembayaran dengan mudah.">
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      <div className="card" style={{ marginBottom: "0.8rem" }}>
        <h3>Upload Bukti Pembayaran</h3>
        <form className="inline-form" onSubmit={uploadPaymentProof}>
          <input name="invoiceId" placeholder="Invoice ID" required />
          <div className="grid-2">
            <input name="amount" type="number" placeholder="Nominal dibayar" required />
            <select name="method" defaultValue="TRANSFER">
              <option value="TRANSFER">Transfer</option>
              <option value="VA">Virtual Account</option>
              <option value="QRIS">QRIS</option>
            </select>
          </div>
          <input name="proofUrl" placeholder="URL bukti transfer" required />
          <button type="submit">Kirim Bukti Bayar</button>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Jenis</th>
              <th>Jatuh Tempo</th>
              <th>Nominal</th>
              <th>Status</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.type}</td>
                <td>{new Date(invoice.dueDate).toLocaleDateString("id-ID")}</td>
                <td>Rp{invoice.amount.toLocaleString("id-ID")}</td>
                <td>
                  <span className="status">{invoice.status}</span>
                </td>
                <td>{invoice.id.slice(-8)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
