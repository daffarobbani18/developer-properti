"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import Link from "next/link";
import {
  UsersThree, Warning, TrendUp, MapPin, Plus, Buildings, ArrowRight, Calendar, X, CircleNotch, UploadSimple, PencilSimple, Trash, WarningCircle, CheckCircle
} from "@phosphor-icons/react";
import {
  dummyProyek,
  formatRupiah,
  formatTanggalShort,
  statusProyekLabel,
  statusProyekColor,
  type Proyek,
} from "@/lib/proyek-data";

const statusBadgeStyle: Record<string, string> = {
  "bg-blue-100 text-blue-700 border-blue-200": "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700 border-amber-200": "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700 border-emerald-200": "bg-emerald-100 text-emerald-700",
  "bg-zinc-100 text-zinc-600 border-zinc-200": "bg-zinc-100 text-zinc-600",
};

const progressBarColor: Record<string, string> = {
  "bg-blue-100 text-blue-700 border-blue-200": "from-blue-400 to-blue-500",
  "bg-amber-100 text-amber-700 border-amber-200": "from-amber-400 to-amber-500",
  "bg-emerald-100 text-emerald-700 border-emerald-200": "from-emerald-400 to-emerald-500",
  "bg-zinc-100 text-zinc-600 border-zinc-200": "from-zinc-300 to-zinc-400",
};

export default function ProyekPage() {
  const [projects, setProjects] = useState<Proyek[]>(dummyProyek);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: "",
    location: "",
    totalUnits: "",
    targetSelesai: "",
    status: "perencanaan",
    kontraktorName: "",
    nomorIzin: "",
    description: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Proyek | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const fetchProjects = async () => {
      try {
        setLoading(true);
        // Login to get token
        const loginRes = await fetch("http://localhost:4000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;

        if (token) {
          const prjRes = await fetch("http://localhost:4000/api/projects", {
            headers: { "Authorization": `Bearer ${token}` }
          });
          const fetchedProjects = await prjRes.json();
          if (fetchedProjects && fetchedProjects.length > 0) {
            setProjects(fetchedProjects.map((p: any) => ({
              id: p.id,
              nama: p.name,
              lokasi: p.location,
              totalUnit: p.totalUnits || 0,
              unitSelesai: p._count?.units || 0, // Using count for now, adjust based on actual completed units logic
              persentaseSelesai: p.totalUnits > 0 ? Math.round(((p._count?.units || 0) / p.totalUnits) * 100) : 0,
              statusProyek: p.status,
              jumlahKontraktor: p.jumlahKontraktor || 0,
              tanggalMulai: p.createdAt,
              targetSelesai: p.targetSelesai || p.createdAt,
              nilaiKontrak: p.nilaiKontrak || 0,
              kontraktorName: p.kontraktorName || "",
              estimasiAnggaran: p.estimasiAnggaran || 0,
              nomorIzin: p.nomorIzin || "",
              description: p.description || "",
              imageUrl: p.imageUrl || "",
            })));
          }
        }
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    setMounted(true);
    fetchProjects();
  }, []);

  const handleProjectSubmit = async () => {
    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const loginData = await loginRes.json();
      const token = loginData.token;

      let finalImageUrl = projectForm.imageUrl;

      // Handle Image Upload First
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        
        const uploadRes = await fetch("http://localhost:4000/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Gagal mengupload gambar proyek");
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = `http://localhost:4000${uploadData.imageUrl}`;
      }

      if (!token) return;

      const payload = {
        name: projectForm.name,
        location: projectForm.location,
        totalUnits: parseInt(projectForm.totalUnits) || 0,
        targetSelesai: projectForm.targetSelesai ? new Date(projectForm.targetSelesai).toISOString() : null,
        status: projectForm.status,
        kontraktorName: projectForm.kontraktorName,
        nomorIzin: projectForm.nomorIzin,
        description: projectForm.description,
        imageUrl: finalImageUrl,
      };

      const url = editProjectId 
        ? `http://localhost:4000/api/projects/${editProjectId}` 
        : "http://localhost:4000/api/projects";
      const method = editProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Gagal: ${err.message || res.statusText || "Internal Server Error"}`);
        return;
      }
      
      setIsProjectModalOpen(false);
      setEditProjectId(null);
      setProjectForm({ name: "", location: "", totalUnits: "", targetSelesai: "", status: "perencanaan", kontraktorName: "", nomorIzin: "", description: "", imageUrl: "" });
      setSelectedFile(null);
      
      await fetchProjects();
      showToast(`Berhasil ${editProjectId ? 'mengedit' : 'membuat'} proyek ${payload.name}`, 'success');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteProjectId) return;
    try {
      setSubmitting(true);
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "superadmin@erp.com", password: "password123" })
      });
      const loginData = await loginRes.json();
      if (!loginData.token) return;

      const res = await fetch(`http://localhost:4000/api/projects/${deleteProjectId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${loginData.token}` },
      });

      if (res.ok) {
        setDeleteProjectId(null);
        setProjectToDelete(null);
        
        await fetchProjects();
        showToast(`Berhasil menghapus proyek`, 'success');
      } else {
        alert("Gagal menghapus proyek");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const proyekAktif = projects.filter(
    (p) => p.statusProyek === "konstruksi" || p.statusProyek === "finishing"
  );
  const totalUnit = projects.reduce((sum, p) => sum + p.totalUnit, 0);
  const unitSelesai = projects.reduce((sum, p) => sum + p.unitSelesai, 0);
  const persentaseGlobal = totalUnit > 0 ? Math.round((unitSelesai / totalUnit) * 100) : 0;

  const summaryStats = [
    {
      label: "Total Proyek",
      value: String(projects.length),
      note: `${proyekAktif.length} sedang berjalan`,
      icon: Buildings,
      bg: "bg-blue-50",
      color: "text-blue-500",
    },
    {
      label: "Total Unit",
      value: String(totalUnit),
      note: `${unitSelesai} unit selesai`,
      icon: TrendUp,
      bg: "bg-emerald-50",
      color: "text-emerald-500",
    },
    {
      label: "Progress Global",
      value: `${persentaseGlobal}%`,
      note: "rata-rata penyelesaian",
      icon: TrendUp,
      bg: "bg-amber-50",
      color: "text-amber-500",
      progress: persentaseGlobal,
    },
    {
      label: "Site Engineer",
      value: "12",
      note: "aktif di lapangan",
      icon: UsersThree,
      bg: "bg-rose-50",
      color: "text-rose-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="module-hero md:p-8" style={{ "--hero-accent": "rgba(59,130,246,0.06)" } as React.CSSProperties}>
        <div className="hero-pattern absolute inset-0 pointer-events-none rounded-2xl opacity-50" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-blue-700">
              <Buildings weight="duotone" size={11} className="text-blue-500" /> Monitoring Proyek
            </div>
            <h1 className="font-[family-name:var(--font-heading)] text-2xl font-normal tracking-tight text-zinc-900 md:text-3xl">
              Progress Konstruksi & Milestone Unit
            </h1>
            <p className="max-w-2xl text-sm text-zinc-500 leading-relaxed">
              Pantau progres konstruksi, kelola milestone tiap unit, dan sinkronisasi data dengan tim lapangan.
            </p>
          </div>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-600 shadow-sm transition-all hover:bg-amber-100 hover:shadow-md"
          >
            <Plus weight="duotone" size={16} /> Tambah Proyek
          </button>
        </div>
      </section>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="stat-card group flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-600 truncate">{stat.label}</p>
              <h3 className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{stat.value}</h3>
              {"progress" in stat && stat.progress !== undefined ? (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${stat.progress}%` }}
                  />
                </div>
              ) : (
                <p className="mt-1 text-xs text-zinc-500 truncate">{stat.note}</p>
              )}
            </div>
            <div className={`icon-wrapper h-14 w-14 shrink-0 ${stat.bg === 'bg-blue-50' ? 'icon-blue' : stat.bg === 'bg-emerald-50' ? 'icon-emerald' : stat.bg === 'bg-amber-50' ? 'icon-amber' : stat.bg === 'bg-rose-50' ? 'icon-rose' : 'icon-violet'}`}>
              <stat.icon weight="duotone" size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Proyek Cards */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Daftar Proyek</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((proyek) => (
            <ProyekCard 
              key={proyek.id} 
              proyek={proyek} 
              onEdit={(p) => {
                setEditProjectId(p.id);
                setProjectForm({
                  name: p.nama,
                  location: p.lokasi,
                  totalUnits: String(p.totalUnit),
                  targetSelesai: p.targetSelesai ? new Date(p.targetSelesai).toISOString().split('T')[0] : "",
                  status: p.statusProyek,
                  kontraktorName: p.kontraktorName || "",
                  nomorIzin: p.nomorIzin || "",
                  description: p.description || "",
                  imageUrl: p.imageUrl || "",
                });
                setIsProjectModalOpen(true);
              }}
              onDelete={(p) => {
                setProjectToDelete(p);
                setDeleteProjectId(p.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* Modal Tambah Proyek */}
      {isProjectModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between rounded-t-2xl border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-lg font-bold text-zinc-900">Registrasi Proyek Baru</h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="p-1 text-zinc-400 transition-colors hover:text-rose-500">
                <X weight="duotone" size={20} />
              </button>
            </div>
            <div className="space-y-5 p-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nama Proyek</label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="Contoh: Pesona Indah 2"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Lokasi / Alamat</label>
                <input
                  type="text"
                  value={projectForm.location}
                  onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                  placeholder="Contoh: Jl. Sudirman, Jakarta Selatan"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Target Total Unit</label>
                  <input
                    type="number"
                    value={projectForm.totalUnits}
                    onChange={(e) => setProjectForm({ ...projectForm, totalUnits: e.target.value })}
                    placeholder="0"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Target Selesai</label>
                  <input
                    type="date"
                    value={projectForm.targetSelesai}
                    onChange={(e) => setProjectForm({ ...projectForm, targetSelesai: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nama Kontraktor</label>
                <input
                  type="text"
                  value={projectForm.kontraktorName}
                  onChange={(e) => setProjectForm({ ...projectForm, kontraktorName: e.target.value })}
                  placeholder="PT Bangun Bersama"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Nomor Izin (IMB/PBG)</label>
                  <input
                    type="text"
                    value={projectForm.nomorIzin}
                    onChange={(e) => setProjectForm({ ...projectForm, nomorIzin: e.target.value })}
                    placeholder="IMB/123/2026"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Status Awal</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                  >
                    <option value="perencanaan">Perencanaan (Planning)</option>
                    <option value="konstruksi">Konstruksi (Ongoing)</option>
                    <option value="finishing">Finishing (Completed)</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Foto Cover / Siteplan Proyek</label>
                <div className="flex items-center gap-4">
                  {projectForm.imageUrl && !selectedFile && (
                    <img src={projectForm.imageUrl} alt="Preview" className="h-16 w-16 rounded-lg object-cover border border-zinc-200" />
                  )}
                  {selectedFile && (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 text-xs text-amber-700 text-center p-1 overflow-hidden">
                      {selectedFile?.name}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-700">
                      <UploadSimple weight="duotone" size={20} />
                      {selectedFile ? "Ganti File Gambar" : "Upload File Gambar"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setSelectedFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-600">Tentang Proyek (Opsional) <span className="text-amber-500 normal-case tracking-normal">*Tampil di web publik</span></label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="Kawasan hunian eksklusif dengan fasilitas..."
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm transition-all focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 rounded-b-2xl border-t border-zinc-100 bg-zinc-50/50 px-6 py-4">
              <button
                onClick={() => setIsProjectModalOpen(false)}
                disabled={submitting}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleProjectSubmit} 
                disabled={submitting || !projectForm.name || !projectForm.location}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition-all hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin" /> : "Simpan Proyek"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {deleteProjectId && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 mb-6">
                <Trash weight="duotone" className="h-10 w-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-900 mb-2">Hapus Proyek?</h2>
              <p className="text-zinc-500 mb-2">
                Anda yakin ingin menghapus proyek <span className="font-bold text-zinc-800">"{projectToDelete?.nama}"</span>?
              </p>
              
              {(projectToDelete?.totalUnit || 0) > 0 && (
                <div className="mt-4 bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 text-left">
                  <WarningCircle weight="fill" className="text-rose-500 h-5 w-5 shrink-0 mt-0.5" />
                  <div className="text-sm text-rose-700">
                    <p className="font-bold mb-1">Peringatan Kritis!</p>
                    <p>Proyek ini memiliki <b>{projectToDelete?.totalUnit} unit</b> dan tipe rumah terkait. Menghapus proyek akan <b>menghapus semua data unit dan tipe rumah</b> tersebut selamanya.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3 p-4 bg-zinc-50 border-t border-zinc-100">
              <button
                onClick={() => {
                  setDeleteProjectId(null);
                  setProjectToDelete(null);
                }}
                disabled={submitting}
                className="rounded-xl px-5 py-3 text-sm font-bold text-zinc-600 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition-all disabled:opacity-50"
              >
                {submitting ? <CircleNotch weight="bold" className="animate-spin h-5 w-5" /> : "Ya, Hapus Proyek"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Toast Notification */}
      {toast && mounted && createPortal(
        <div className="fixed top-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-sm z-[200] animate-in slide-in-from-top-5 fade-in duration-300">
          <div className={`flex items-center gap-3 rounded-2xl px-5 py-4 shadow-xl ${
            toast.type === 'success' 
              ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
              : 'bg-rose-500 text-white shadow-rose-500/20'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle weight="fill" className="h-6 w-6" />
            ) : (
              <WarningCircle weight="fill" className="h-6 w-6" />
            )}
            <p className="text-sm font-semibold">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
            >
              <X weight="bold" className="h-4 w-4" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function ProyekCard({ proyek, onEdit, onDelete }: { proyek: Proyek, onEdit: (p: Proyek) => void, onDelete: (p: Proyek) => void }) {
  const isDelayed = proyek.persentaseSelesai < 50 && proyek.statusProyek === "konstruksi";
  const rawColor = statusProyekColor[proyek.statusProyek] ?? "";
  const badgeStyle = statusBadgeStyle[rawColor] ?? "bg-zinc-100 text-zinc-600";
  const barGradient = progressBarColor[rawColor] ?? "from-zinc-300 to-zinc-400";

  return (
    <div className="block h-full">
      <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]">
        {/* Actions (Edit/Delete) */}
        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
          <button 
            onClick={(e) => { e.preventDefault(); onEdit(proyek); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-500 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all hover:scale-110"
            title="Edit Proyek"
          >
            <PencilSimple weight="bold" size={14} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onDelete(proyek); }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm border border-zinc-200 text-zinc-500 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all hover:scale-110"
            title="Hapus Proyek"
          >
            <Trash weight="bold" size={14} />
          </button>
        </div>

        <Link href={`/admin/proyek/${proyek.id}/unit`} className="block">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-bold text-zinc-900 group-hover:text-amber-600 transition-colors">
                {proyek.nama}
              </h3>
              {isDelayed && <Warning weight="duotone" className="h-4 w-4 shrink-0 text-amber-500" />}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
              <MapPin weight="duotone" size={12} />
              <span>{proyek.lokasi}</span>
            </div>
          </div>
          <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${badgeStyle}`}>
            {statusProyekLabel[proyek.statusProyek]}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="mb-5 grid grid-cols-3 gap-3">
          {[
            { label: "Total Unit", value: proyek.totalUnit, color: "text-zinc-900" },
            { label: "Selesai", value: proyek.unitSelesai, color: "text-emerald-600" },
            { label: "Kontraktor", value: proyek.jumlahKontraktor, color: "text-blue-600" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-zinc-50 p-3 text-center">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Progress Keseluruhan</span>
            <span className="text-xs font-bold text-zinc-900">{proyek.persentaseSelesai}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-500`}
              style={{ width: `${proyek.persentaseSelesai}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Calendar weight="duotone" size={11} />
              <span>Mulai: {formatTanggalShort(proyek.tanggalMulai)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <Calendar weight="duotone" size={11} />
              <span>Target: {formatTanggalShort(proyek.targetSelesai)}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">Nilai Kontrak</p>
            <p className="text-sm font-bold text-zinc-900">{formatRupiah(proyek.nilaiKontrak)}</p>
          </div>
        </div>

        {/* View Link */}
        <div className="mt-4 flex items-center justify-end gap-1 text-xs font-medium text-amber-500 opacity-0 transition-opacity group-hover:opacity-100">
          Lihat Detail Unit <ArrowRight size={13} />
        </div>
        </Link>
      </div>
    </div>
  );
}


