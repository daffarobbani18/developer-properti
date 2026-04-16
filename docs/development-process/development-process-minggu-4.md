# DEVELOPMENT PROCESS MINGGU KE-4

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-04-24 - 2026-04-30  
**Minggu ke:** 4  
**PIC:** Tim Frontend Web Admin

---

## 1. Tujuan Minggu Ini

Tujuan minggu ke-4 adalah menyelesaikan implementasi dashboard berbasis role pada web admin agar setiap role memperoleh ringkasan kerja yang sesuai konteks bisnis. Tujuan sekunder adalah memastikan aplikasi siap build produksi dan mengurangi risiko deployment.

---

## 2. Proses yang Dilakukan

### A. Planning

**Target yang disepakati:**
1. Menyusun satu source konfigurasi dashboard per role.
2. Menghubungkan nilai KPI ke dataset dummy lintas modul.
3. Menambahkan section snapshot agar data prioritas terbaca cepat.
4. Menuntaskan build check produksi sebelum lanjut rilis.

**Ruang lingkup teknis:**
1. Route dashboard role-based tetap mengikuti guard role minggu sebelumnya.
2. Tidak menambah endpoint backend baru.
3. Fokus pada konsumsi data dummy yang sudah ada di frontend.

### B. Development

**Aktivitas utama:**
1. Membangun halaman dashboard dinamis per role dengan route dashboard/[role].
2. Menyusun mapping konten role:
   - title
   - subtitle
   - tone visual
   - KPI cards
   - quick links
3. Menarik data dari modul frontend existing:
   - crm-data
   - keuangan-data
   - proyek-data
4. Menambahkan snapshot section per role berisi ringkasan item prioritas.
5. Melakukan perapian visual dan perbaikan kontras teks pada kartu statistik.
6. Menjaga konsistensi komponen agar responsif pada breakpoint mobile-desktop.

**Integrasi yang dilakukan:**
1. Integrasi data antar modul frontend tanpa perubahan API backend.
2. Integrasi route role dashboard dengan role home mapping di guard.

### C. Review & Testing

**Skenario review/testing:**
1. Uji semua role membuka dashboard masing-masing.
2. Uji akses dashboard role lain (harus ditolak oleh guard).
3. Uji render KPI dan snapshot pada setiap role.
4. Uji build produksi penuh.

**Hasil testing:**
1. Build produksi web admin berhasil.
2. Route dashboard role berhasil diprerender.
3. Tidak ditemukan error TypeScript pada implementasi dashboard minggu ini.

### D. Deployment/Environment

**Environment:** Local production build + deployment readiness check

**Temuan environment penting:**
1. Build gagal saat dijalankan dari root monorepo (direktori tidak tepat).
2. Build berhasil saat dijalankan dari direktori aplikasi web admin.
3. Masalah DEPLOYMENT_NOT_FOUND ditemukan terkait konfigurasi deployment target.

**Tindakan korektif:**
1. Menetapkan prosedur build per aplikasi berdasarkan root directory masing-masing.
2. Mendokumentasikan kebutuhan set root directory terpisah antara web admin dan web publik pada Vercel.

### E. Review Tim

Review akhir minggu menyetujui bahwa dashboard role-based sudah siap dipakai sebagai baseline monitoring harian. Tim juga menyepakati bahwa sprint berikutnya diprioritaskan ke website publik (simulasi KPR dan detail unit).

---

## 3. Hasil Proses Minggu Ini

1. Dashboard role-based selesai untuk 6 role.
2. KPI dashboard terhubung ke data dummy lintas modul.
3. Snapshot role-based selesai dan terbaca dengan baik.
4. Build produksi tervalidasi.
5. Isu deployment utama berhasil diidentifikasi akar penyebabnya.

---

## 4. Blocker, Risiko, dan Mitigasi

**Blocker:**
1. Kegagalan build awal akibat salah direktori eksekusi.
2. Error DEPLOYMENT_NOT_FOUND pada hasil deploy.

**Risiko:**
1. Salah konfigurasi root directory dapat menghasilkan deploy yang menampilkan artifact project berbeda.

**Mitigasi:**
1. Standarisasi langkah build per app folder.
2. Checklist deployment sebelum publish.
3. Verifikasi route kunci pasca deploy.

---

## 5. Keputusan Minggu Ini

1. Menetapkan dashboard role-based sebagai baseline UX web admin.
2. Menetapkan root directory per project sebagai aturan wajib deployment.
3. Memprioritaskan fitur conversion di website publik pada minggu ke-5.

---

## 6. Action Minggu Berikutnya

| Action Item | PIC | Due Date |
|------------|-----|----------|
| Membangun kalkulator simulasi KPR real-time di website publik | Frontend Web Publik | Minggu ke-5 |
| Integrasi kalkulator ke halaman detail unit dengan harga otomatis | Frontend Web Publik | Minggu ke-5 |
| Revisi desain detail unit agar sesuai referensi visual | Frontend Web Publik | Minggu ke-5 |
| Validasi endpoint route unit detail dan stabilisasi CSS | Frontend Web Publik | Minggu ke-5 |

---

## 7. Rincian Teknis Implementasi

Rincian implementasi minggu ke-4 menekankan bagaimana dashboard role-based dibangun secara modular:

1. Rincian Struktur Route Dashboard:
   - Menetapkan route dinamis untuk role.
   - Menjaga kompatibilitas route dengan guard role yang telah aktif dari sprint sebelumnya.
2. Rincian Konfigurasi Dashboard Role:
   - Menyusun konfigurasi per role untuk title, subtitle, warna, statistik, dan quick links.
   - Menjaga pola render konsisten agar maintenance lebih mudah.
3. Rincian Integrasi Dataset:
   - Menghubungkan dataset modul CRM, Keuangan, dan Proyek ke komponen dashboard.
   - Menyesuaikan formula KPI agar mencerminkan angka operasional dummy yang realistis.
4. Rincian Snapshot Prioritas:
   - Menentukan data paling relevan untuk ditampilkan sebagai ringkasan cepat tiap role.
   - Menambahkan section snapshot untuk mempersingkat waktu scanning user.
5. Rincian UI Polishing:
   - Menyesuaikan kontras warna teks pada kartu statistik.
   - Menyesuaikan responsivitas grid agar stabil di berbagai breakpoint.

---

## 8. Matrix Pengujian Minggu Ini

| Skenario Uji | Metode | Hasil |
|--------------|--------|-------|
| Buka dashboard role admin | Manual browser | Pass |
| Buka dashboard role inventory | Manual browser | Pass |
| Buka dashboard role sales | Manual browser | Pass |
| Buka dashboard role finance/legal/supervisor | Manual browser | Pass |
| Validasi render snapshot per role | Manual browser + data compare | Pass |
| Build produksi full web admin | Next build | Pass |

Catatan matrix:
1. Seluruh skenario diarahkan untuk memvalidasi readiness dashboard sebelum fokus beralih ke website publik.
2. Pengujian visual dilakukan pada desktop dan mobile untuk menjaga konsistensi UX.

---

## 9. Artefak Output Engineering

1. Halaman dashboard role-based untuk 6 role.
2. Mapping konfigurasi KPI dan quick links per role.
3. Integrasi data dummy lintas modul frontend.
4. Snapshot section per role.
5. Catatan build produksi dan route prerender.

Artefak ini dipakai sebagai acuan internal untuk demo operasional dan validasi alur kerja lintas tim.

---

## 10. Lessons Learned Minggu Ini

1. Struktur konfigurasi role-based mempercepat iterasi dibanding pendekatan hardcoded per halaman.
2. Kontras visual harus divalidasi setelah data dinamis masuk, karena distribusi konten berubah.
3. Build dari root monorepo berpotensi menyesatkan jika root directory deployment tidak jelas.
4. Dokumentasi prosedur build per aplikasi penting untuk menghindari kebingungan tim saat rilis.

---

## 11. Cuplikan Source Code Penting Minggu Ini

### A. Integrasi Dataset Lintas Modul ke Dashboard

File: `frontend/web-admin/src/app/(dashboard)/dashboard/[role]/page.tsx`

```tsx
import { dummyAktivitas, dummyLeads, dummyTransaksi, dummyUnits } from "@/lib/crm-data";
import { dummyCashflow, dummyPengeluaran, dummyTagihan } from "@/lib/keuangan-data";
import { dummyKendala, dummyProyek, dummyUnit } from "@/lib/proyek-data";

const totalLeads = dummyLeads.length;
const totalTransaksi = dummyTransaksi.length;
const latestCashflow = dummyCashflow[dummyCashflow.length - 1];
const totalProyek = dummyProyek.length;
```

Penjelasan singkat:
1. Snippet ini menunjukkan bahwa KPI sudah ditarik dari dataset modul, bukan nilai statis murni.
2. Integrasi ini membuat dashboard role-based lebih representatif untuk demo operasional.

### B. Dynamic Route dan Static Params per Role

File: `frontend/web-admin/src/app/(dashboard)/dashboard/[role]/page.tsx`

```tsx
export function generateStaticParams() {
   return Object.keys(ROLE_DASHBOARD).map((role) => ({ role }));
}

export default async function RoleDashboardPage({
   params,
}: {
   params: Promise<{ role: string }>;
}) {
   const { role } = await params;

   if (!(role in ROLE_DASHBOARD)) {
      notFound();
   }

   const dashboard = ROLE_DASHBOARD[role as Role];
   // ...render
}
```

Penjelasan singkat:
1. Dashboard dirender berdasarkan role parameter dan tervalidasi.
2. Static params memastikan route role ikut diprerender saat build produksi.

### C. Snapshot Prioritas per Role

File: `frontend/web-admin/src/app/(dashboard)/dashboard/[role]/page.tsx`

```tsx
const roleSnapshots = {
   admin: [
      {
         title: "Leads Perlu Follow-up",
         items: dummyLeads.slice(0, 3).map((lead) => ({
            label: lead.nama,
            meta: `${lead.status} • ${lead.minatUnit}`,
         })),
      },
   ],
   sales: [
      {
         title: "Hot Leads",
         items: dummyLeads.filter((lead) => lead.status !== "baru").slice(0, 4).map((lead) => ({
            label: lead.nama,
            meta: `${lead.status} • PIC ${lead.salesPIC}`,
         })),
      },
   ],
} as const;
```

Penjelasan singkat:
1. Setiap role punya snapshot data yang berbeda sesuai prioritas kerja.
2. Ini adalah komponen kunci untuk mempercepat scanning informasi awal pengguna.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-4.