"use client";

import { useEffect, useState } from "react";

import { PortalShell } from "../../components/PortalShell";
import { apiRequest } from "../../lib/api-client";
import { useAuthGuard } from "../../lib/use-auth-guard";

export default function BerandaPage() {
  const { auth, loading } = useAuthGuard();
  const [overview, setOverview] = useState<{
    customer: { fullName: string; email: string; phone?: string };
    unit?: { code: string; typeName: string; progress: number; status: string } | null;
    nextInvoice?: { amount: number; dueDate: string; status: string } | null;
    unreadNotifications: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    apiRequest<{
      customer: { fullName: string; email: string; phone?: string };
      unit?: { code: string; typeName: string; progress: number; status: string } | null;
      nextInvoice?: { amount: number; dueDate: string; status: string } | null;
      unreadNotifications: number;
    }>("/portal/overview")
      .then(setOverview)
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data beranda");
      });
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <PortalShell
      user={auth.user}
      title="Beranda"
      subtitle="Ringkasan status unit, tagihan terdekat, dan notifikasi terbaru."
    >
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
      {overview ? (
        <>
          <div className="grid-3">
            <article className="card stat">
              <h3>Unit Anda</h3>
              <strong>{overview.unit ? `${overview.unit.code} (${overview.unit.typeName})` : "Belum terhubung"}</strong>
            </article>
            <article className="card stat">
              <h3>Progres Konstruksi</h3>
              <strong>{overview.unit?.progress ?? 0}%</strong>
            </article>
            <article className="card stat">
              <h3>Notifikasi Belum Dibaca</h3>
              <strong>{overview.unreadNotifications}</strong>
            </article>
          </div>

          <div className="grid-2" style={{ marginTop: "0.8rem" }}>
            <article className="card">
              <h3>Tagihan Berikutnya</h3>
              {overview.nextInvoice ? (
                <>
                  <p>
                    Nominal: <strong>Rp{overview.nextInvoice.amount.toLocaleString("id-ID")}</strong>
                  </p>
                  <p>Jatuh tempo: {new Date(overview.nextInvoice.dueDate).toLocaleDateString("id-ID")}</p>
                  <p>
                    Status: <span className="status">{overview.nextInvoice.status}</span>
                  </p>
                </>
              ) : (
                <p className="muted">Belum ada tagihan aktif.</p>
              )}
            </article>

            <article className="card">
              <h3>Kontak Developer</h3>
              <p>WhatsApp: +62 812-3456-7890</p>
              <p>Telepon: (021) 5551 2026</p>
              <p>Email: cs@grahamutiara.id</p>
            </article>
          </div>
        </>
      ) : null}
    </PortalShell>
  );
}
