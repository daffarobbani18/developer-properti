"use client";

import { useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

const allowedRoles: Role[] = ["DIRECTOR", "FINANCE_MANAGER", "FINANCE_ADMIN"];

export default function CashflowPage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [cashflow, setCashflow] = useState<{
    totalIncome: number;
    totalExpense: number;
    currentBalance: number;
    receivableOutstanding: number;
  } | null>(null);
  const [summary, setSummary] = useState<{
    invoiceCount: number;
    paidCount: number;
    overdueCount: number;
    customerCount: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!auth) {
      return;
    }

    Promise.all([
      apiRequest<{
        totalIncome: number;
        totalExpense: number;
        currentBalance: number;
        receivableOutstanding: number;
      }>("/finance/cashflow"),
      apiRequest<{
        invoiceCount: number;
        paidCount: number;
        overdueCount: number;
        customerCount: number;
      }>("/finance/summary")
    ])
      .then(([cashflowData, summaryData]) => {
        setCashflow(cashflowData);
        setSummary(summaryData);
      })
      .catch((error) => {
        setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data cashflow");
      });
  }, [auth]);

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="Cashflow" subtitle="Pantau pemasukan, pengeluaran, dan kesehatan arus kas proyek.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}
      {cashflow ? (
        <div className="card-grid">
          <article className="stat-card">
            <h3>Total Pemasukan</h3>
            <strong>Rp{cashflow.totalIncome.toLocaleString("id-ID")}</strong>
          </article>
          <article className="stat-card">
            <h3>Total Pengeluaran</h3>
            <strong>Rp{cashflow.totalExpense.toLocaleString("id-ID")}</strong>
          </article>
          <article className="stat-card">
            <h3>Saldo Saat Ini</h3>
            <strong>Rp{cashflow.currentBalance.toLocaleString("id-ID")}</strong>
          </article>
          <article className="stat-card">
            <h3>Piutang Berjalan</h3>
            <strong>Rp{cashflow.receivableOutstanding.toLocaleString("id-ID")}</strong>
          </article>
        </div>
      ) : null}

      {summary ? (
        <div className="table-wrap" style={{ marginTop: "1rem" }}>
          <table>
            <tbody>
              <tr>
                <th>Total Invoice</th>
                <td>{summary.invoiceCount}</td>
              </tr>
              <tr>
                <th>Invoice Lunas</th>
                <td>{summary.paidCount}</td>
              </tr>
              <tr>
                <th>Invoice Overdue</th>
                <td>{summary.overdueCount}</td>
              </tr>
              <tr>
                <th>Total Customer</th>
                <td>{summary.customerCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminShell>
  );
}
