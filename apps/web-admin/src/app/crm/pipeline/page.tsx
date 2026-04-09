"use client";

import { useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type Lead = {
  id: string;
  name: string;
  status: string;
  interestedUnitType?: string;
  phone: string;
};

const allowedRoles: Role[] = ["DIRECTOR", "SALES_MANAGER", "SALES"];
const columns = ["NEW", "FOLLOW_UP", "SURVEY", "NEGOTIATION", "BOOKING", "SPK", "CLOSED"];

export default function PipelinePage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [items, setItems] = useState<Lead[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    apiRequest<Lead[]>("/crm/leads")
      .then(setItems)
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat pipeline");
      });
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="Pipeline Penjualan" subtitle="Visualisasi status leads dari awal hingga closing.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}
      <div className="two-col" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {columns.map((column) => (
          <article className="panel" key={column}>
            <h3>
              {column} ({items.filter((lead) => lead.status === column).length})
            </h3>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {items
                .filter((lead) => lead.status === column)
                .map((lead) => (
                  <div key={lead.id} className="panel" style={{ padding: "0.7rem" }}>
                    <strong>{lead.name}</strong>
                    <p style={{ margin: "0.2rem 0" }}>{lead.interestedUnitType ?? "-"}</p>
                    <small>{lead.phone}</small>
                  </div>
                ))}
              {items.filter((lead) => lead.status === column).length === 0 ? <small>Belum ada data</small> : null}
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
