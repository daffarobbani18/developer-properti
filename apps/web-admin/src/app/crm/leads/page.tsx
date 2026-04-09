"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  status: string;
  assignedTo?: {
    fullName: string;
  } | null;
};

const allowedRoles: Role[] = ["DIRECTOR", "SALES_MANAGER", "SALES"];
const stages = ["NEW", "FOLLOW_UP", "SURVEY", "NEGOTIATION", "BOOKING", "SPK", "CLOSED"];

export default function LeadsPage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [items, setItems] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const filtered = useMemo(() => {
    const keyword = query.toLowerCase();
    return items.filter(
      (lead) =>
        lead.name.toLowerCase().includes(keyword) ||
        lead.phone.toLowerCase().includes(keyword) ||
        lead.source.toLowerCase().includes(keyword)
    );
  }, [items, query]);

  async function loadLeads() {
    setLoadingData(true);
    setErrorMessage("");
    try {
      const data = await apiRequest<Lead[]>("/crm/leads");
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat leads");
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadLeads();
  }, [auth]);

  async function addLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? "") || undefined,
      source: String(formData.get("source") ?? "manual"),
      interestedUnitType: String(formData.get("interest") ?? "") || undefined
    };

    try {
      await apiRequest("/crm/leads", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      event.currentTarget.reset();
      await loadLeads();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menambah leads");
    }
  }

  async function moveLeadStatus(lead: Lead) {
    const currentIndex = stages.indexOf(lead.status);
    if (currentIndex < 0 || currentIndex >= stages.length - 1) {
      return;
    }

    const nextStatus = stages[currentIndex + 1];

    try {
      await apiRequest(`/crm/leads/${lead.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus, note: `Update cepat ke ${nextStatus}` })
      });
      await loadLeads();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal update status");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="CRM Leads" subtitle="Kelola leads dari website, pameran, dan kanal lainnya.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <div className="panel">
        <h3>Tambah Lead Manual</h3>
        <form className="inline-form" onSubmit={addLead}>
          <div className="two-col">
            <input name="name" placeholder="Nama" required />
            <input name="phone" placeholder="No. HP" required />
          </div>
          <div className="two-col">
            <input name="email" type="email" placeholder="Email" />
            <input name="source" placeholder="Sumber (contoh: pameran)" defaultValue="manual" />
          </div>
          <input name="interest" placeholder="Minat tipe unit" />
          <button type="submit">Tambah Lead</button>
        </form>
      </div>

      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <div className="controls">
          <input
            placeholder="Cari nama/telepon/sumber"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="button" onClick={loadLeads}>
            {loadingData ? "Memuat..." : "Refresh"}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kontak</th>
              <th>Sumber</th>
              <th>Status</th>
              <th>Sales</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>
                  {lead.phone}
                  <br />
                  <small>{lead.email ?? "-"}</small>
                </td>
                <td>{lead.source}</td>
                <td>
                  <span className="status-chip">{lead.status}</span>
                </td>
                <td>{lead.assignedTo?.fullName ?? "Belum di-assign"}</td>
                <td>
                  <button type="button" onClick={() => moveLeadStatus(lead)}>
                    Naik Tahap
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>Belum ada data leads.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
