"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type LegalDoc = {
  id: string;
  category: string;
  title: string;
  number?: string;
  status: string;
  expiresAt?: string | null;
};

const allowedRoles: Role[] = ["DIRECTOR", "LEGAL_ADMIN", "PROJECT_MANAGER"];

export default function LegalDocumentPage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [docs, setDocs] = useState<LegalDoc[]>([]);
  const [monitoring, setMonitoring] = useState<{ expiring7: unknown[]; expiring30: unknown[]; expiring90: unknown[] } | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      const [documents, monitor] = await Promise.all([
        apiRequest<LegalDoc[]>("/legal/documents"),
        apiRequest<{ expiring7: unknown[]; expiring30: unknown[]; expiring90: unknown[] }>("/legal/monitoring")
      ]);

      setDocs(documents);
      setMonitoring(monitor);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dokumen legal");
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadData();
  }, [auth]);

  async function createDoc(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const expiresAt = String(formData.get("expiresAt") ?? "");

    try {
      await apiRequest("/legal/documents", {
        method: "POST",
        body: JSON.stringify({
          category: String(formData.get("category") ?? ""),
          title: String(formData.get("title") ?? ""),
          number: String(formData.get("number") ?? "") || undefined,
          storageUrl: String(formData.get("storageUrl") ?? ""),
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          status: "PROCESSING"
        })
      });
      event.currentTarget.reset();
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menyimpan dokumen");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="Legal & Perizinan" subtitle="Repositori dokumen legal dan monitoring masa berlaku izin.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <div className="two-col">
        <div className="panel">
          <h3>Tambah Dokumen Legal</h3>
          <form className="inline-form" onSubmit={createDoc}>
            <input name="category" placeholder="Kategori (PBG/AJB/SHM)" required />
            <input name="title" placeholder="Judul dokumen" required />
            <input name="number" placeholder="Nomor dokumen" />
            <input name="storageUrl" placeholder="URL penyimpanan dokumen" required />
            <input name="expiresAt" type="date" />
            <button type="submit">Simpan</button>
          </form>
        </div>

        <div className="panel">
          <h3>Monitoring Kadaluarsa</h3>
          <p>&lt; 7 hari: {monitoring?.expiring7.length ?? 0}</p>
          <p>&lt; 30 hari: {monitoring?.expiring30.length ?? 0}</p>
          <p>&lt; 90 hari: {monitoring?.expiring90.length ?? 0}</p>
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Judul</th>
              <th>Nomor</th>
              <th>Status</th>
              <th>Kadaluarsa</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.category}</td>
                <td>{doc.title}</td>
                <td>{doc.number ?? "-"}</td>
                <td>
                  <span className="status-chip">{doc.status}</span>
                </td>
                <td>{doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString("id-ID") : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
