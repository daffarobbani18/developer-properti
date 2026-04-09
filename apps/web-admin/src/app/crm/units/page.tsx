"use client";

import { useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type Unit = {
  id: string;
  code: string;
  typeName: string;
  status: string;
  price: number;
  project: {
    name: string;
  };
};

const allowedRoles: Role[] = ["DIRECTOR", "SALES_MANAGER", "SALES"];

export default function UnitsPage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [items, setItems] = useState<Unit[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData(filter = "") {
    try {
      const path = filter ? `/crm/units?status=${filter}` : "/crm/units";
      const data = await apiRequest<Unit[]>(path);
      setItems(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat unit");
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadData();
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="Manajemen Unit" subtitle="Status kavling dan tipe unit per proyek.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <div className="controls">
        <select
          value={statusFilter}
          onChange={(event) => {
            const next = event.target.value;
            setStatusFilter(next);
            loadData(next);
          }}
        >
          <option value="">Semua Status</option>
          <option value="AVAILABLE">Tersedia</option>
          <option value="BOOKED">Booked</option>
          <option value="SOLD">Terjual</option>
          <option value="INDENT">Indent</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Proyek</th>
              <th>Unit</th>
              <th>Tipe</th>
              <th>Status</th>
              <th>Harga</th>
            </tr>
          </thead>
          <tbody>
            {items.map((unit) => (
              <tr key={unit.id}>
                <td>{unit.project.name}</td>
                <td>{unit.code}</td>
                <td>{unit.typeName}</td>
                <td>
                  <span className="status-chip">{unit.status}</span>
                </td>
                <td>Rp{unit.price.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
