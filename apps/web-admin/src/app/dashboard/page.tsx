"use client";

import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "../../components/AdminShell";
import { apiRequest } from "../../lib/api-client";
import { useAuthGuard } from "../../lib/use-auth-guard";
import type { Role } from "../../lib/types";

const allInternalRoles: Role[] = [
  "DIRECTOR",
  "SALES_MANAGER",
  "SALES",
  "FINANCE_MANAGER",
  "FINANCE_ADMIN",
  "PROJECT_MANAGER",
  "SITE_ENGINEER",
  "LEGAL_ADMIN"
];

export default function DashboardPage() {
  const { auth, loading } = useAuthGuard(allInternalRoles);
  const [summary, setSummary] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const role = auth?.user.role;

  const canSales = useMemo(() => role && ["DIRECTOR", "SALES_MANAGER", "SALES"].includes(role), [role]);
  const canFinance = useMemo(
    () => role && ["DIRECTOR", "FINANCE_MANAGER", "FINANCE_ADMIN"].includes(role),
    [role]
  );
  const canProject = useMemo(
    () => role && ["DIRECTOR", "PROJECT_MANAGER", "SITE_ENGINEER"].includes(role),
    [role]
  );
  const canLegal = useMemo(() => role && ["DIRECTOR", "LEGAL_ADMIN", "PROJECT_MANAGER"].includes(role), [role]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    async function loadDashboard() {
      try {
        const result: Record<string, string> = {};

        if (canSales) {
          const pipeline = await apiRequest<Array<{ status: string; _count: { status: number } }>>(
            "/crm/pipeline"
          );
          const totalLeads = pipeline.reduce((sum, item) => sum + item._count.status, 0);
          result["Leads Aktif"] = totalLeads.toString();
        }

        if (canFinance) {
          const cashflow = await apiRequest<{
            totalIncome: number;
            totalExpense: number;
            currentBalance: number;
            receivableOutstanding: number;
          }>("/finance/cashflow");

          result["Pemasukan"] = `Rp${cashflow.totalIncome.toLocaleString("id-ID")}`;
          result["Pengeluaran"] = `Rp${cashflow.totalExpense.toLocaleString("id-ID")}`;
          result["Saldo"] = `Rp${cashflow.currentBalance.toLocaleString("id-ID")}`;
        }

        if (canProject) {
          const projects = await apiRequest<Array<{ _count: { units: number; issues: number } }>>(
            "/project/projects"
          );
          const unitCount = projects.reduce((sum, item) => sum + item._count.units, 0);
          const issueCount = projects.reduce((sum, item) => sum + item._count.issues, 0);
          result["Total Unit Proyek"] = unitCount.toString();
          result["Kendala Lapangan"] = issueCount.toString();
        }

        if (canLegal) {
          const monitoring = await apiRequest<{ expiring7: unknown[]; expiring30: unknown[]; expiring90: unknown[] }>(
            "/legal/monitoring"
          );
          result["Izin < 30 Hari"] = monitoring.expiring30.length.toString();
        }

        const notifications = await apiRequest<Array<{ isRead: boolean }>>("/notifications");
        result["Notifikasi Belum Dibaca"] = notifications.filter((item) => !item.isRead).length.toString();

        setSummary(result);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat dashboard");
      }
    }

    loadDashboard();
  }, [auth, canFinance, canLegal, canProject, canSales]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell
      user={auth.user}
      title="Dashboard"
      subtitle="Ringkasan kondisi operasional sesuai hak akses role Anda"
    >
      {errorMessage ? <p className="error">{errorMessage}</p> : null}
      <div className="card-grid">
        {Object.entries(summary).map(([label, value]) => (
          <article className="stat-card" key={label}>
            <h3>{label}</h3>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
