"use client";

import { useEffect, useState } from "react";

import { PortalShell } from "../../components/PortalShell";
import { apiRequest } from "../../lib/api-client";
import { useAuthGuard } from "../../lib/use-auth-guard";

type Document = {
  id: string;
  category: string;
  title: string;
  status: string;
  storageUrl: string;
};

export default function DokumenPage() {
  const { auth, loading } = useAuthGuard();
  const [docs, setDocs] = useState<Document[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    apiRequest<Document[]>("/portal/documents")
      .then(setDocs)
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dokumen");
      });
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <PortalShell user={auth.user} title="Dokumen Digital" subtitle="Unduh dokumen unit Anda kapan saja dengan aman.">
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Judul</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.category}</td>
                <td>{doc.title}</td>
                <td>
                  <span className="status">{doc.status}</span>
                </td>
                <td>
                  <a href={doc.storageUrl} target="_blank" rel="noreferrer">
                    Buka Dokumen
                  </a>
                </td>
              </tr>
            ))}
            {docs.length === 0 ? (
              <tr>
                <td colSpan={4}>Belum ada dokumen tersedia.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
