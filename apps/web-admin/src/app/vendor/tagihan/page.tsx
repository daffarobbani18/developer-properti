"use client";

import { FormEvent, useEffect, useState } from "react";

import { AdminShell } from "../../../components/AdminShell";
import { apiRequest } from "../../../lib/api-client";
import { useAuthGuard } from "../../../lib/use-auth-guard";
import type { Role } from "../../../lib/types";

type Vendor = {
  id: string;
  name: string;
};

type Project = {
  id: string;
  name: string;
};

type VendorInvoice = {
  id: string;
  amount: number;
  description: string;
  status: string;
  vendor: {
    name: string;
  };
  project: {
    name: string;
  };
};

const allowedRoles: Role[] = ["DIRECTOR", "FINANCE_MANAGER", "PROJECT_MANAGER"];

export default function VendorTagihanPage() {
  const { auth, loading } = useAuthGuard(allowedRoles);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<VendorInvoice[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    try {
      const [vendorData, projectData, invoiceData] = await Promise.all([
        apiRequest<Vendor[]>("/vendor/vendors"),
        apiRequest<Project[]>("/project/projects"),
        apiRequest<VendorInvoice[]>("/vendor/invoices")
      ]);
      setVendors(vendorData);
      setProjects(projectData);
      setInvoices(invoiceData);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal memuat data vendor");
    }
  }

  useEffect(() => {
    if (!auth) {
      return;
    }
    loadData();
  }, [auth]);

  async function addVendor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await apiRequest("/vendor/vendors", {
        method: "POST",
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          contactPerson: String(formData.get("contactPerson") ?? "") || undefined,
          phone: String(formData.get("phone") ?? "") || undefined,
          serviceType: String(formData.get("serviceType") ?? "") || undefined
        })
      });
      event.currentTarget.reset();
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menambah vendor");
    }
  }

  async function addInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await apiRequest("/vendor/invoices", {
        method: "POST",
        body: JSON.stringify({
          vendorId: String(formData.get("vendorId") ?? ""),
          projectId: String(formData.get("projectId") ?? ""),
          amount: Number(formData.get("amount") ?? 0),
          description: String(formData.get("description") ?? "")
        })
      });
      event.currentTarget.reset();
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menambah tagihan");
    }
  }

  async function approve(id: string) {
    try {
      await apiRequest(`/vendor/invoices/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({})
      });
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal approve");
    }
  }

  async function reject(id: string) {
    const reason = window.prompt("Masukkan alasan penolakan") ?? "Data belum sesuai";

    try {
      await apiRequest(`/vendor/invoices/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason })
      });
      await loadData();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal reject");
    }
  }

  if (loading || !auth) {
    return <main className="login-page">Memuat...</main>;
  }

  return (
    <AdminShell user={auth.user} title="Pengeluaran & Vendor" subtitle="Kelola vendor, tagihan termin, dan approval berjenjang.">
      {errorMessage ? <p className="error">{errorMessage}</p> : null}

      <div className="two-col">
        <div className="panel">
          <h3>Tambah Vendor</h3>
          <form className="inline-form" onSubmit={addVendor}>
            <input name="name" placeholder="Nama Vendor" required />
            <input name="contactPerson" placeholder="Contact Person" />
            <input name="phone" placeholder="Nomor HP" />
            <input name="serviceType" placeholder="Jenis Pekerjaan" />
            <button type="submit">Simpan Vendor</button>
          </form>
        </div>

        <div className="panel">
          <h3>Input Tagihan Termin</h3>
          <form className="inline-form" onSubmit={addInvoice}>
            <select name="vendorId" required>
              <option value="">Pilih Vendor</option>
              {vendors.map((vendor) => (
                <option value={vendor.id} key={vendor.id}>
                  {vendor.name}
                </option>
              ))}
            </select>
            <select name="projectId" required>
              <option value="">Pilih Proyek</option>
              {projects.map((project) => (
                <option value={project.id} key={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <input name="amount" type="number" placeholder="Nilai tagihan" required />
            <textarea name="description" placeholder="Deskripsi pekerjaan" rows={3} required />
            <button type="submit">Ajukan Tagihan</button>
          </form>
        </div>
      </div>

      <div className="table-wrap" style={{ marginTop: "1rem" }}>
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Proyek</th>
              <th>Deskripsi</th>
              <th>Nilai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item) => (
              <tr key={item.id}>
                <td>{item.vendor.name}</td>
                <td>{item.project.name}</td>
                <td>{item.description}</td>
                <td>Rp{item.amount.toLocaleString("id-ID")}</td>
                <td>
                  <span className="status-chip">{item.status}</span>
                </td>
                <td>
                  <div className="controls" style={{ marginBottom: 0 }}>
                    <button type="button" onClick={() => approve(item.id)}>
                      Approve
                    </button>
                    <button type="button" onClick={() => reject(item.id)}>
                      Tolak
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
