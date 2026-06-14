"use client";

import { useState, useEffect } from "react";
import { Plus, PencilSimple, Trash, X } from "@phosphor-icons/react";

interface Role {
  id: string;
  name: string;
}

interface User {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  allowedMenus: string[];
}

const AVAILABLE_MENUS = [
  { label: "Daftar Proyek", value: "/admin/proyek" },
  { label: "Tipe Rumah", value: "/admin/tipe-rumah" },
  { label: "Kavling & Unit", value: "/admin/kavling-unit" },
  { label: "SPK Borongan", value: "/admin/spk" },
  { label: "Verifikasi Progres", value: "/admin/verifikasi-progres" },
  { label: "Site Plan", value: "/admin/site-plan" },
  { label: "Leads", value: "/sales/leads" },
  { label: "Pipeline", value: "/sales/pipeline" },
  { label: "Unit Sales", value: "/sales/unit" },
  { label: "Transaksi", value: "/sales/transaksi" },
  { label: "Aktivitas", value: "/sales/aktivitas" },
  { label: "Cashflow", value: "/finance/cashflow" },
  { label: "Tagihan", value: "/finance/tagihan" },
  { label: "Pengeluaran", value: "/finance/pengeluaran" },
  { label: "Monitoring SPK", value: "/finance/spk" },
  { label: "RAB & Realisasi", value: "/finance/rab" },
  { label: "Pipeline KPR", value: "/legal/kpr" },
  { label: "Dokumen Legal", value: "/legal/dokumen" },
  { label: "Serah Terima (BAST)", value: "/legal/bast" },
  { label: "Masa Retensi & Komplain", value: "/legal/retensi" },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [banner, setBanner] = useState<{ message: string; tone: "positive" | "critical" | "warning" } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    email: "",
    password: "",
    roleId: "",
    allowedMenus: [] as string[],
  });

  const getAuthHeaders = () => {
    let token = "";
    try {
      const authRaw = localStorage.getItem("simdp_auth") || sessionStorage.getItem("simdp_auth");
      if (authRaw) {
        token = JSON.parse(authRaw).token;
      }
    } catch {}
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [userRes, roleRes] = await Promise.all([
        fetch("http://localhost:4000/api/users", { headers: getAuthHeaders() }),
        fetch("http://localhost:4000/api/users/roles", { headers: getAuthHeaders() }),
      ]);

      if (userRes.ok && roleRes.ok) {
        const uData = await userRes.json();
        const rData = await roleRes.json();
        setUsers(uData.data);
        setRoles(rData.data);
      } else {
        setBanner({ message: "Gagal memuat data", tone: "critical" });
      }
    } catch (error) {
      setBanner({ message: "Terjadi kesalahan", tone: "critical" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (user?: User) => {
    if (user) {
      setIsEditing(true);
      setFormData({
        id: user.id,
        email: user.email,
        password: "",
        roleId: user.roleId,
        allowedMenus: user.allowedMenus || [],
      });
    } else {
      setIsEditing(false);
      setFormData({
        id: "",
        email: "",
        password: "",
        roleId: roles.length > 0 ? roles[0].id : "",
        allowedMenus: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleMenuToggle = (menuValue: string) => {
    setFormData((prev) => {
      const newMenus = prev.allowedMenus.includes(menuValue)
        ? prev.allowedMenus.filter((m) => m !== menuValue)
        : [...prev.allowedMenus, menuValue];
      return { ...prev, allowedMenus: newMenus };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    const url = isEditing
      ? `http://localhost:4000/api/users/${formData.id}`
      : "http://localhost:4000/api/users";
    const method = isEditing ? "PUT" : "POST";

    const body = {
      email: formData.email,
      roleId: formData.roleId,
      allowedMenus: formData.allowedMenus,
      ...(formData.password && { password: formData.password }),
    };

    try {
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setBanner({ message: `Berhasil ${isEditing ? "memperbarui" : "membuat"} pengguna`, tone: "positive" });
        loadData();
      } else {
        const data = await res.json();
        setBanner({ message: data.error || "Gagal menyimpan", tone: "critical" });
      }
    } catch (error) {
      setBanner({ message: "Terjadi kesalahan", tone: "critical" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
    try {
      const res = await fetch(`http://localhost:4000/api/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setBanner({ message: "Pengguna dihapus", tone: "positive" });
        loadData();
      } else {
        setBanner({ message: "Gagal menghapus", tone: "critical" });
      }
    } catch {
      setBanner({ message: "Terjadi kesalahan", tone: "critical" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-zinc-900">
            Manajemen Pengguna
          </h1>
          <p className="mt-1 text-sm text-zinc-500">Kelola akun dan kustomisasi akses menu</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
        >
          <Plus size={18} />
          Tambah Pengguna
        </button>
      </div>

      {banner && (
        <div className={`rounded-xl p-4 text-sm font-medium ${
          banner.tone === "positive" ? "bg-emerald-50 text-emerald-700" :
          banner.tone === "critical" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"
        }`}>
          {banner.message}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-6">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-zinc-900">Daftar Pengguna</h2>
          <p className="mt-1 text-sm text-zinc-500">Semua akun di sistem</p>
        </div>

        {isLoading ? (
          <p className="p-6 text-sm text-zinc-500">Memuat data...</p>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">Belum ada pengguna</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role Utama</th>
                  <th className="px-4 py-3 font-semibold">Akses Menu Kustom</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50">
                    <td className="px-4 py-3 font-medium text-zinc-900">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        {user.roleName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {user.allowedMenus && user.allowedMenus.length > 0
                        ? `${user.allowedMenus.length} Menu Khusus`
                        : "Default Role"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                        >
                          <PencilSimple size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-lg p-1.5 text-zinc-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 font-[family-name:var(--font-heading)] text-xl font-bold text-zinc-900">
              {isEditing ? "Edit Pengguna" : "Tambah Pengguna"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                    Password {isEditing && <span className="text-zinc-400 font-normal">(Kosongi jika tidak diubah)</span>}
                  </label>
                  <input
                    type="password"
                    required={!isEditing}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">Role Utama</label>
                <select
                  value={formData.roleId}
                  onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-700">
                  Akses Menu Kustom
                </label>
                <p className="mb-3 text-xs text-zinc-500">
                  Pilih menu secara spesifik untuk diizinkan. Jika dibiarkan kosong, pengguna akan mendapatkan akses *default* berdasarkan role utamanya.
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {AVAILABLE_MENUS.map((menu) => (
                    <label
                      key={menu.value}
                      className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 transition-colors ${
                        formData.allowedMenus.includes(menu.value)
                          ? "border-amber-500 bg-amber-50"
                          : "border-zinc-200 bg-white hover:bg-zinc-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.allowedMenus.includes(menu.value)}
                        onChange={() => handleMenuToggle(menu.value)}
                        className="mt-0.5 rounded border-zinc-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-zinc-700">{menu.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
