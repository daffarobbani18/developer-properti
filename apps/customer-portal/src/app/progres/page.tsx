"use client";

import { useEffect, useState } from "react";

import { PortalShell } from "../../components/PortalShell";
import { apiRequest } from "../../lib/api-client";
import { useAuthGuard } from "../../lib/use-auth-guard";

type Milestone = {
  id: string;
  status: string;
  template: {
    name: string;
  };
  photos: Array<{ id: string; url: string; caption?: string; createdAt: string }>;
};

export default function ProgresPage() {
  const { auth, loading } = useAuthGuard();
  const [data, setData] = useState<{
    unit?: { code: string; typeName: string; progress: number } | null;
    milestones: Milestone[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    apiRequest<{
      unit?: { code: string; typeName: string; progress: number } | null;
      milestones: Milestone[];
    }>("/portal/progress")
      .then(setData)
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat progres");
      });
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <PortalShell user={auth.user} title="Progres Unit" subtitle="Pantau milestone pembangunan dan foto terbaru dari lapangan.">
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

      <article className="card" style={{ marginBottom: "0.8rem" }}>
        <h3>Progress Total</h3>
        <p>
          Unit: <strong>{data?.unit?.code ?? "-"}</strong>
        </p>
        <p>
          Persentase: <strong>{data?.unit?.progress ?? 0}%</strong>
        </p>
      </article>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Status</th>
              <th>Foto Terbaru</th>
            </tr>
          </thead>
          <tbody>
            {data?.milestones.map((item) => (
              <tr key={item.id}>
                <td>{item.template.name}</td>
                <td>
                  <span className="status">{item.status}</span>
                </td>
                <td>
                  {item.photos[0] ? (
                    <a href={item.photos[0].url} target="_blank" rel="noreferrer">
                      Lihat Foto
                    </a>
                  ) : (
                    "Belum ada foto"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PortalShell>
  );
}
