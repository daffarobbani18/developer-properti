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

## 12. Kronologi Eksekusi Harian (Ringkas)

Bagian ini ditambahkan agar proses engineering minggu ke-4 tidak hanya terlihat sebagai daftar hasil, tetapi juga memiliki alur waktu kerja yang jelas dan dapat diaudit kembali saat retrospective sprint.

### Hari 1 - Finalisasi Scope Dashboard Role-Based

1. Menutup daftar kebutuhan minimum dashboard untuk 6 role.
2. Menetapkan struktur data konfigurasi yang akan dipakai bersama oleh seluruh role.
3. Menentukan baseline tampilan: KPI cards, quick links, dan snapshot prioritas.
4. Menetapkan bahwa seluruh data minggu ini masih menggunakan dummy dataset lintas modul.

### Hari 2 - Implementasi Route Dinamis dan Mapping Role

1. Menyusun route dinamis dashboard berbasis parameter role.
2. Menyelaraskan validasi role terhadap konfigurasi internal agar role invalid langsung ditolak.
3. Menambahkan static params untuk memastikan semua route role ikut diproses saat build.
4. Memastikan struktur route kompatibel dengan guard role yang sudah stabil pada minggu sebelumnya.

### Hari 3 - Integrasi Data KPI dari Modul CRM/Keuangan/Proyek

1. Menghubungkan nilai KPI ke data dummy yang sudah tersedia di masing-masing modul.
2. Menata ulang urutan KPI agar metrik penting tampil lebih dulu untuk setiap role.
3. Menyesuaikan format angka/ringkasan agar konsisten antar role dashboard.
4. Melakukan validasi tampilan ketika data berubah agar layout tidak rusak.

### Hari 4 - Penyusunan Snapshot Prioritas dan Polishing UI

1. Menambahkan section snapshot per role untuk mempercepat pembacaan item prioritas.
2. Menyesuaikan copy dan metadata ringkas agar konteks kerja role lebih jelas.
3. Melakukan penyempurnaan visual (kontras, spasi, keterbacaan komponen statistik).
4. Menjalankan uji mobile-desktop untuk menjaga konsistensi pengalaman pengguna.

### Hari 5 - Validasi Build, Pemeriksaan Route, dan Penutupan Sprint

1. Menjalankan build produksi pada direktori aplikasi yang benar.
2. Memastikan seluruh route dashboard role berhasil diprerender tanpa error.
3. Mencatat temuan deployment (root directory dan DEPLOYMENT_NOT_FOUND) sebagai risk register.
4. Menyusun keputusan sprint bahwa fokus minggu berikutnya bergeser ke website publik.

---

## 13. Quality Gate dan Acceptance Criteria

Untuk memastikan hasil sprint tidak hanya "selesai dikerjakan" tetapi juga "layak dipakai", tim menggunakan quality gate berikut pada minggu ke-4.

### A. Functional Acceptance

1. Semua role yang terdaftar dapat membuka dashboard role masing-masing.
2. Role tidak dapat mengakses dashboard role lain melalui navigasi normal.
3. KPI cards tampil lengkap tanpa komponen kosong pada data dummy saat ini.
4. Snapshot prioritas muncul sesuai konteks role dan tidak salah mapping data.

### B. Technical Acceptance

1. Build produksi aplikasi web admin harus lulus tanpa error kompilasi.
2. Dynamic role route harus tervalidasi dan ikut static generation.
3. Tidak ada error TypeScript baru akibat perubahan minggu ini.
4. Struktur konfigurasi dashboard tetap terpusat agar mudah dirawat.

### C. UX Acceptance

1. Informasi utama harus dapat dipahami maksimal dalam beberapa detik pertama.
2. Kontras teks pada kartu statistik memenuhi standar keterbacaan internal tim.
3. Komponen tetap stabil pada viewport desktop dan mobile.
4. Layout tidak menimbulkan pergeseran elemen mencolok saat data berubah.

### D. Operasional Acceptance

1. Tim dapat mengulangi build check dari environment lokal tanpa prosedur khusus tambahan.
2. Dokumen root directory deployment telah diperbarui agar tidak salah target artifact.
3. Hasil sprint dapat dipresentasikan lintas tim tanpa perubahan kode tambahan.

---

## 14. Dampak Operasional dan Nilai Bisnis

Walaupun minggu ini berfokus pada dashboard internal, dampak yang dihasilkan langsung terasa pada kesiapan operasional dan kualitas pengambilan keputusan harian.

1. Dampak ke Kecepatan Monitoring:
   - Pengguna internal tidak perlu membuka banyak halaman hanya untuk membaca status umum.
   - Ringkasan KPI dan snapshot mempercepat identifikasi prioritas kerja per role.
2. Dampak ke Konsistensi Data Demo:
   - Seluruh role melihat dashboard dari sumber dataset yang sama, sehingga narasi operasional lebih konsisten.
   - Ini penting untuk sinkronisasi komunikasi antar divisi saat review mingguan.
3. Dampak ke Risiko Deployment:
   - Temuan root directory pada minggu ini menurunkan risiko salah deploy pada sprint berikutnya.
   - Tim memiliki prosedur yang lebih jelas untuk memastikan artifact yang dirilis benar.
4. Dampak ke Roadmap Sprint:
   - Karena dashboard role-based sudah stabil, tim dapat mengalihkan fokus dengan percaya diri ke fitur conversion website publik pada minggu ke-5.

---

## 15. Handoff dan Kesiapan Sprint Berikutnya

Agar transisi antar sprint berjalan rapi, minggu ke-4 ditutup dengan paket handoff teknis berikut.

### A. Handoff Artefak

1. Struktur konfigurasi role dashboard yang sudah distandarkan.
2. Daftar KPI dan snapshot per role yang telah tervalidasi.
3. Catatan build dan route prerender sebagai bukti readiness.
4. Catatan deployment issue dan tindakan korektif untuk rilis berikutnya.

### B. Handoff Pengetahuan

1. Tim memahami pola pengembangan route dinamis berbasis role yang aman.
2. Tim memahami titik sensitif deployment pada monorepo multi-aplikasi.
3. Tim memahami pola integrasi data dummy lintas modul sebagai baseline sebelum API real aktif.

### C. Checklist Penutupan Sprint

1. Scope utama minggu ke-4 selesai sesuai target.
2. Pengujian inti functional dan build telah lulus.
3. Dokumen proses sudah diperbarui dan siap dipakai untuk audit internal.
4. Prioritas sprint berikutnya telah disepakati dan terdokumentasi.

---

## 16. Analisis Efektivitas Proses Minggu Ke-4

Analisis ini menilai efektivitas sprint saat tim menyelesaikan dashboard role-based sekaligus menutup isu kesiapan deployment.

1. Efektivitas struktur konfigurasi role:
   - Tinggi, karena pendekatan konfiguratif mempercepat delivery untuk banyak role.
   - Biaya perubahan konten dashboard antar role menjadi lebih rendah.
2. Efektivitas integrasi dataset dummy:
   - Baik, KPI dashboard menjadi lebih representatif dibanding nilai statis murni.
   - Tim dapat melakukan demo operasional dengan konteks data yang konsisten.
3. Efektivitas quality gate build:
   - Baik, build produksi dijalankan sebagai langkah wajib sebelum sprint ditutup.
   - Temuan lingkungan deployment bisa teridentifikasi sebelum menjadi insiden rilis.
4. Area yang perlu dijaga:
   - Peralihan fokus sprint ke website publik berisiko menurunkan perhatian pada regresi dashboard.
   - Diperlukan checklist regression ringan untuk menjaga baseline web admin tetap stabil.

---

## 17. Risk Register Transisi ke Minggu Ke-5

1. Risiko deployment salah target project pada monorepo:
   - Dampak: artifact tidak sesuai aplikasi, potensi error saat validasi URL.
   - Strategi: verifikasi root directory wajib sebelum build/deploy.
2. Risiko route guard tidak selaras dengan route dashboard baru:
   - Dampak: akses role valid terganggu.
   - Strategi: retest lintas role setelah setiap penambahan route dashboard.
3. Risiko context switching tim saat pindah domain ke website publik:
   - Dampak: waktu adaptasi meningkat dan ritme sprint melambat.
   - Strategi: menyiapkan handoff artefak yang ringkas namun lengkap.
4. Risiko quality drift pada UI role dashboard setelah tim fokus ke domain lain:
   - Dampak: regressions minor terlambat terdeteksi.
   - Strategi: jadwalkan health check periodik web admin meski bukan fokus sprint.

---

## 18. Rekomendasi Hardening Proses Pasca Sprint

1. Menetapkan template deployment checklist lintas aplikasi pada monorepo.
2. Menambahkan verifikasi route kunci pasca build sebagai prosedur standar.
3. Menjaga dokumentasi mapping role dashboard tetap hidup agar onboarding task baru lebih cepat.
4. Menyediakan baseline regression mini untuk web admin saat tim fokus di website publik.
5. Menggunakan pola konfiguratif yang sama untuk fitur role-based berikutnya agar biaya maintenance tetap rendah.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-4.