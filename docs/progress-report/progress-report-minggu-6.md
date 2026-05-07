# LAPORAN KEMAJUAN MINGGUAN — MINGGU KE-6

**Judul Tugas Akhir:** Ekosistem Digital Properti Terpadu (SIMDP — Sistem Informasi Manajemen Developer Perumahan)  
**Periode Laporan:** 21 April 2026 – 27 April 2026  
**Minggu ke:** 6 (Fase Fondasi Keamanan & Arsitektur Antarmuka)  
**Fokus Utama:** Modul Autentikasi, Role-Based Access Control (RBAC), dan Setup Layout Dashboard Inti  
**Status Keseluruhan:** 🟢 Hijau — On Track  
**Disusun oleh:** Daffa Robbani  

---

## 1. Ringkasan Eksekutif

Memasuki minggu ke-6 pengembangan platform SIMDP, tim pengembang mengambil keputusan arsitektural yang sangat kritis: **membangun fondasi keamanan dan kerangka antarmuka sistem sebelum modul-modul operasional spesifik mulai dikerjakan**. Keputusan ini bukan sekadar urutan teknis semata, melainkan sebuah strategi pengembangan yang disengaja dan beralasan kuat.

Sebuah analogi sederhana dapat menjelaskan urgensi ini: membangun modul-modul operasional (Inventori, CRM, Finance, Legal) tanpa terlebih dahulu memiliki sistem autentikasi yang kokoh ibarat membangun kamar-kamar hotel yang mewah tanpa terlebih dahulu memasang pintu, kunci, dan sistem resepsionis. Seluruh "properti" yang dibangun menjadi tidak aman dan tidak terkontrol aksesnya.

Pada minggu ke-6 ini, tiga komponen fondasi utama berhasil diselesaikan secara penuh:

1. **Sistem Autentikasi Terenkripsi** — memastikan hanya pengguna terdaftar yang dapat mengakses sistem.
2. **Portal Direktori & Role-Based Access Control (RBAC)** — memastikan setiap pengguna hanya dapat mengakses ruang kerja yang relevan dengan divisinya.
3. **Kerangka Antarmuka Inti (UI Shell)** — membangun "cangkang" visual yang konsisten (Sidebar + Topbar) yang akan membungkus semua halaman operasional ke depannya.

Ketiga komponen ini bersifat **lintas modul** — artinya, setiap modul yang akan dibangun pada minggu-minggu ke depan (Inventori, CRM, Finance, Legal, Supervisor) akan berjalan *di dalam* kerangka yang dibangun minggu ini. Investasi waktu di minggu ke-6 ini akan terbayar berulang kali pada setiap sprint berikutnya.

**[Screenshot: Halaman Login SIMDP dengan desain premium menampilkan form kredensial di sisi kiri dengan field Email dan Password, tombol "Masuk ke Sistem", serta ilustrasi arsitektur perumahan modern berwarna gradient di sisi kanan. Header menampilkan logo "SIMDP — Ekosistem Digital Properti Terpadu"]**

---

## 2. Detail Fungsionalitas yang Diselesaikan

### 2.1. Sistem Autentikasi dan Halaman Login Terenkripsi

**Apa yang diimplementasikan:**

Halaman *login* merupakan titik pertama interaksi pengguna dengan seluruh ekosistem SIMDP. Pada fase ini, implementasi autentikasi dilakukan pada lapisan *frontend* dengan konfigurasi yang sudah mempertimbangkan integrasi backend JWT (*JSON Web Token*) yang akan datang.

Komponen-komponen teknis yang dibangun pada sub-sistem autentikasi ini meliputi:

- **Form Input Tervalidasi:** Field *Email* dan *Password* dilengkapi dengan validasi *client-side* menggunakan logika validasi bawaan HTML5 yang diperkuat dengan pengecekan tambahan via JavaScript. Format email yang tidak valid atau *password* dengan panjang di bawah batas minimum akan langsung memunculkan pesan error yang informatif tanpa perlu menunggu respons dari server — mengurangi beban *request* tidak perlu ke backend.

- **Proteksi Rute Berbasis Middleware:** Konfigurasi *middleware* Next.js telah diimplementasikan pada file `middleware.ts` untuk mencegah praktik *URL bypassing* — yaitu kondisi di mana pengguna yang belum terautentikasi mencoba mengakses halaman *dashboard* langsung melalui URL address bar. Sistem secara otomatis mendeteksi ketiadaan sesi yang valid dan memaksa *redirect* kembali ke halaman `/login` sebelum halaman sempat ter-*render*.

- **Pengelolaan State Autentikasi:** Memanfaatkan `localStorage` untuk menyimpan state sesi secara sementara pada fase *frontend-only* ini, dengan desain yang sudah disiapkan untuk digantikan oleh *cookie httpOnly* berbasis JWT ketika backend siap diintegrasikan.

- **Desain Visual Premium:** Antarmuka *login* dirancang dengan pendekatan *split-screen layout* — sisi kiri berisi form dengan tipografi bersih dan *white card* floating di atas background gelap bertekstur, sementara sisi kanan menampilkan visual hero yang merepresentasikan identitas produk. Desain ini mengikuti konvensi SaaS premium modern seperti yang diterapkan pada platform-platform *enterprise* internasional.

**Mengapa komponen autentikasi ini sangat kritis:**

Sistem ERP yang mengelola data sensitif seperti harga properti, data pembeli, dan dokumen legal memiliki risiko yang sangat besar jika sistem autentikasinya lemah. Skenario terburuk yang dapat terjadi tanpa autentikasi yang baik antara lain: *data leak* informasi harga kepada kompetitor, manipulasi data transaksi oleh pihak tidak berwenang, atau akses tidak sah ke dokumen legal pembeli yang dapat berujung pada masalah hukum.

---

### 2.2. Portal Direktori Sistem (Gateway Entry)

**Apa yang diimplementasikan:**

Setelah melewati proses autentikasi, pengguna tidak langsung "dilempar" ke dalam halaman operasional yang mungkin membingungkan. Sebagai gantinya, sistem mengarahkan pengguna ke sebuah **Portal Direktori** yang berfungsi sebagai *landing page* internal pasca-*login*.

Portal Direktori ini menampilkan **lima kartu modul besar** yang merepresentasikan kelima divisi dalam ekosistem SIMDP:

1. **Admin Inventory** — Pengelolaan data kawasan, kavling, tipe, dan harga.
2. **Sales & Marketing** — Manajemen leads, pipeline, dan transaksi.
3. **Finance & Accounting** — Tagihan, cashflow, dan laporan keuangan.
4. **Legal & Perizinan** — Dokumen sertifikat, IMB, dan legalitas unit.
5. **Pengawas Lapangan** — Monitoring progres fisik konstruksi dan laporan lapangan.

**[Screenshot: Halaman Portal Direktori Sistem menampilkan 5 kartu modul berukuran besar dalam layout grid 3+2, masing-masing dilengkapi ikon elegan, nama divisi, dan deskripsi singkat tugas. Kartu modul yang tidak sesuai dengan role pengguna yang sedang login tampak diredupkan dengan overlay abu-abu dan ikon gembok (locked)]**

Kartu-kartu ini bukan sekadar elemen dekoratif — mereka memiliki fungsi ganda yang penting:

- **Fungsi Navigasi:** Setiap kartu adalah *entry point* langsung ke ruang kerja masing-masing divisi. Satu klik membawa pengguna masuk ke *dashboard* divisinya.
- **Fungsi Edukasi Sistem:** Bagi pengguna baru, halaman ini memberikan gambaran holistik tentang ekosistem SIMDP secara keseluruhan — mereka bisa melihat bahwa ada 5 divisi yang saling terhubung, meskipun mereka hanya memiliki akses ke salah satunya.
- **Fungsi Visual RBAC:** Kartu yang tidak sesuai dengan *role* pengguna yang sedang *login* akan ditampilkan dengan visual yang diredupkan (*disabled state*) dan dilengkapi ikon gembok. Ini memberikan *feedback* visual yang jelas tanpa perlu penjelasan teks panjang.

---

### 2.3. Implementasi Role-Based Access Control (RBAC) untuk 5 Divisi

**Apa yang diimplementasikan:**

RBAC adalah sistem otorisasi yang menentukan "siapa boleh mengakses apa" berdasarkan peran pengguna dalam organisasi. Pada fase *frontend* ini, logika RBAC diimplementasikan dalam bentuk struktur data *access control* yang terpusat di file `access.ts`.

Kelima peran pengguna yang telah didefinisikan beserta ruang lingkup akses masing-masing:

**Role 1 — Admin Inventory:**
- ✅ Akses penuh ke Modul Inventori (Kawasan, Blok, Kavling, Tipe Rumah, Harga)
- ✅ Akses baca (read-only) ke Site Plan kawasan
- ❌ Tidak dapat mengakses data transaksi, keuangan, atau dokumen legal

**Role 2 — Sales & Marketing:**
- ✅ Akses penuh ke Modul CRM (Leads, Pipeline, Transaksi)
- ✅ Akses baca ke data unit kavling (untuk penawaran ke pembeli)
- ✅ Akses pembuatan Booking baru
- ❌ Tidak dapat mengubah data harga atau spesifikasi unit

**Role 3 — Finance & Accounting:**
- ✅ Akses penuh ke Modul Keuangan (Tagihan, Cashflow, RAB, Pengeluaran)
- ✅ Akses konfirmasi pembayaran dan pelunasan
- ✅ Akses baca ke data transaksi dari modul CRM
- ❌ Tidak dapat mengubah data inventori atau leads

**Role 4 — Tim Legal:**
- ✅ Akses penuh ke Modul Legal (Dokumen Induk, Legalitas Unit)
- ✅ Akses baca ke data pembeli (nama, unit yang dibeli)
- ❌ Tidak dapat mengakses data keuangan atau proses booking

**Role 5 — Pengawas Lapangan (Supervisor):**
- ✅ Akses penuh ke Modul Monitoring Proyek
- ✅ Upload foto dan laporan progres fisik per unit
- ✅ Update milestone konstruksi per kavling
- ❌ Tidak dapat mengakses data harga, transaksi, atau dokumen legal

**Mengapa implementasi RBAC ini esensial:**

Dalam konteks bisnis developer properti yang melibatkan puluhan karyawan dari divisi yang berbeda, risiko keamanan data tanpa RBAC sangat nyata. Seorang staf marketing yang tidak sengaja (atau sengaja) mengubah harga unit dapat berakibat pada kerugian finansial perusahaan. Seorang kontraktor lapangan yang memiliki akses ke data legal pembeli merupakan pelanggaran privasi yang serius. RBAC memastikan bahwa *sistem sendiri* yang menjaga batas-batas ini, bukan hanya mengandalkan kedisiplinan masing-masing individu.

---

### 2.4. Kerangka Antarmuka Inti (UI Shell): Sidebar Dinamis

**Apa yang diimplementasikan:**

Sidebar adalah komponen navigasi vertikal di sisi kiri layar yang menjadi "tulang punggung" navigasi seluruh dashboard. Berbeda dengan sidebar konvensional yang statis (menampilkan menu yang sama untuk semua pengguna), sidebar SIMDP dirancang secara **dinamis dan sadar-peran** (*role-aware*).

Komponen-komponen Sidebar yang dibangun:

- **Logo & Branding Area:** Bagian atas sidebar menampilkan logo "SIMDP" dan tagline "Ekosistem Digital Properti". Elemen ini konsisten di semua role.

- **Menu Navigasi Dinamis:** Daftar menu yang ditampilkan di sidebar berubah sesuai dengan role pengguna yang sedang *login*. Implementasi ini menggunakan sebuah fungsi filter yang memetakan daftar menu master ke hak akses role yang aktif — menu yang tidak diizinkan tidak hanya dinonaktifkan, tetapi **tidak dirender sama sekali ke dalam DOM** untuk mencegah inspeksi HTML.

- **Active State Visual:** Menu yang sedang aktif (halaman yang sedang dikunjungi) mendapatkan indikator visual berupa warna latar yang berbeda dan garis vertikal berwarna amber di sisi kiri. Ini membantu pengguna selalu mengetahui posisi navigasinya dalam sistem.

- **Dark Theme Konsisten:** Sidebar menggunakan background warna `zinc-950` (hampir hitam) dengan teks berwarna `zinc-400` untuk item non-aktif dan `zinc-100` untuk item aktif. Pemilihan warna ini mengikuti konvensi *dashboard* SaaS premium dan memberikan kontras tinggi terhadap konten utama yang menggunakan background putih.

---

### 2.5. Kerangka Antarmuka Inti (UI Shell): Topbar Responsif

**Apa yang diimplementasikan:**

Topbar adalah komponen navigasi horizontal di bagian atas layar yang melengkapi Sidebar. Komponen ini berisi elemen-elemen kontekstual yang membantu pengguna memahami posisi mereka dalam sistem dan memberikan akses cepat ke fungsi-fungsi global.

- **Breadcrumb Dinamis:** Menampilkan hierarki navigasi halaman yang sedang aktif dalam format rantai teks. Contoh: "Dashboard › CRM › Pipeline" atau "Dashboard › Keuangan › Tagihan". Breadcrumb ini di-*generate* secara otomatis berdasarkan segmen URL aktif.

- **Notifikasi (*Bell Icon*):** Ikon lonceng dengan *badge* angka merah menampilkan jumlah notifikasi yang belum dibaca. Notifikasi ini akan terisi secara real-time dari backend (misalnya: "Budi Santoso baru saja mengunggah bukti pembayaran", atau "IMB Blok B akan expired 7 hari lagi").

- **Profil Pengguna & Dropdown:** Pojok kanan atas menampilkan foto/avatar dan nama pengguna yang sedang *login* beserta nama divisinya. Klik pada avatar membuka *dropdown* yang berisi opsi "Pengaturan Profil" dan "Keluar" (*Logout*).

- **Responsivitas Mobile:** Pada layar di bawah lebar 768px (tablet atau *smartphone*), Sidebar otomatis tersembunyi. Sebagai gantinya, ikon *hamburger* (☰) muncul di Topbar. Klik pada ikon ini akan menggeser (*slide*) Sidebar dari sisi kiri layar sebagai *overlay drawer*, mempertahankan fungsionalitas navigasi penuh pada perangkat *mobile*.

**[Screenshot: Tampilan layout utama UI Shell dari sisi desktop — menampilkan Sidebar gelap di kiri dengan menu aktif "CRM & Sales" yang disorot amber, Topbar putih di atas dengan breadcrumb "Dashboard › CRM › Pipeline", notifikasi badge merah, dan avatar pengguna "Rina - Sales". Konten utama berupa halaman Pipeline Kanban terlihat di area tengah-kanan]**

---

## 3. Metrik Pencapaian dan Status

### 3.1 Persentase Penyelesaian Fase Fondasi

| Sub-Komponen | Status | Estimasi Penyelesaian | Keterangan |
| :--- | :---: | :---: | :--- |
| **Desain UI/UX Halaman Login** | ✅ Selesai | 100% | *Pixel-perfect* dengan desain premium |
| **Validasi Form Client-Side** | ✅ Selesai | 100% | Format email & panjang password |
| **Proteksi Rute (Middleware)** | 🟡 Hampir Selesai | 90% | Menyisakan *handling* token expired |
| **Portal Direktori 5 Role** | ✅ Selesai | 100% | Kartu navigasi dan *disabled state* |
| **Struktur Data RBAC** | ✅ Selesai | 100% | File `access.ts` terpusat |
| **Logika Menu Dinamis RBAC** | 🟡 Hampir Selesai | 80% | Menunggu injeksi token dari JWT |
| **Sidebar Dinamis (Desktop)** | ✅ Selesai | 100% | Dark theme, active state, role-aware |
| **Topbar + Breadcrumb** | ✅ Selesai | 100% | Dinamis berdasarkan URL segmen |
| **Responsivitas Mobile** | ✅ Selesai | 100% | Hamburger menu + slide drawer |
| **Notifikasi (Bell)** | 🟡 In Progress | 60% | UI selesai, koneksi real-time menunggu |

**Total Estimasi Fase Fondasi Frontend: ~95% selesai**

> Catatan: Sisa 5% adalah integrasi autentikasi dengan JWT dari backend (NestJS) yang akan menggantikan mekanisme `localStorage` sementara. Pekerjaan ini akan diselesaikan bersamaan dengan sprint backend API.

### 3.2 Progress Keseluruhan Platform SIMDP

| Aplikasi / Modul | Status | Progress |
| :--- | :---: | :---: |
| Web Admin — Autentikasi & RBAC | ✅ Selesai Fase Frontend | ~95% |
| Web Admin — UI Shell (Sidebar & Topbar) | ✅ Selesai | ~100% |
| Web Admin — Modul Inventori | ⬜ Belum dimulai | 0% |
| Web Admin — Modul CRM & Sales | ⬜ Belum dimulai | 0% |
| Web Admin — Modul Finance | ⬜ Belum dimulai | 0% |
| Web Admin — Modul Legal | ⬜ Belum dimulai | 0% |
| Web Admin — Modul Supervisor | ⬜ Belum dimulai | 0% |
| Backend NestJS + Prisma | ⬜ Struktur folder | ~5% |
| Website Marketing Publik | ⬜ Belum dimulai | 0% |
| Customer Portal | ⬜ Belum dimulai | 0% |
| Mobile App (Lapangan) | ⬜ Belum dimulai | 0% |

### 3.3 KPI Sprint Minggu ke-6

| KPI | Target | Realisasi | Status |
| :--- | :---: | :---: | :---: |
| Halaman login fungsional dan berdesain premium | 1 halaman | 1 halaman | ✅ Tercapai |
| Portal Direktori dengan 5 kartu role | 1 halaman | 1 halaman | ✅ Tercapai |
| Role terdefinisi di sistem | 5 role | 5 role | ✅ Tercapai |
| Layout Sidebar responsif | 1 komponen | 1 komponen | ✅ Tercapai |
| Topbar + Breadcrumb dinamis | 1 komponen | 1 komponen | ✅ Tercapai |
| Bug critical di *routing* | 0 bug | 0 bug | ✅ Aman |
| TypeScript *type check* bersih | Pass | Pass | ✅ Tercapai |

---

## 4. Hubungan Fondasi Minggu Ini dengan Modul-Modul Berikutnya

Komponen yang dibangun minggu ini bersifat menyeluruh dan menjadi prasyarat eksplisit untuk semua sprint berikutnya. Berikut adalah pemetaan ketergantungan antar komponen:

```
FONDASI MINGGU KE-6 (Prasyarat)
          │
          ├──► Modul Inventori (Minggu ke-7)
          │     • Berjalan di dalam Layout Shell (Sidebar + Topbar)
          │     • Diproteksi oleh Middleware Autentikasi
          │     • Hanya dapat diakses oleh Role: Admin Inventory
          │
          ├──► Modul CRM & Sales (Minggu ke-8)
          │     • Berjalan di dalam Layout Shell yang sama
          │     • Menu Sidebar berubah sesuai Role: Sales
          │     • Modul Inventori tidak tampil di Sidebar Sales
          │
          ├──► Modul Finance (Minggu ke-9)
          │     • Layout Shell yang identik
          │     • Role: Finance mendapat menu berbeda dari Sales
          │     • Portal Direktori menampilkan modul Finance aktif
          │
          ├──► Modul Legal (Minggu ke-10)
          │     • Menggunakan struktur RBAC yang sama
          │     • Role: Legal hanya melihat menu Legal di Sidebar
          │
          └──► Modul Supervisor (Minggu ke-11)
                • Menggunakan UI Shell yang identik
                • Role: Supervisor mendapat akses eksklusif ke tracking lapangan
```

Dari diagram di atas terlihat bahwa tanpa fondasi minggu ke-6, tidak ada satupun modul operasional yang dapat berdiri secara aman dan terstruktur. Ini adalah minggu paling "tak terlihat" secara fitur bisnis, namun paling fundamental secara arsitektur teknis.

---

## 5. Kendala dan Catatan Teknis

### 5.1 Kendala yang Dihadapi

1. **Kompleksitas Logika RBAC Dinamis:** Implementasi logika yang membuat menu Sidebar berubah sesuai *role* secara dinamis (bukan hanya menyembunyikan menu yang ada, tetapi benar-benar tidak merendernya ke DOM) membutuhkan perancangan ulang struktur komponen `menuItems`. Solusi yang dipilih adalah menyimpan konfigurasi menu dalam bentuk array objek dengan properti `allowedRoles: string[]`, lalu memfilter array tersebut sebelum dirender.

2. **Sinkronisasi State Login Lintas Komponen:** Memastikan bahwa perubahan status autentikasi (misalnya saat *logout*) langsung memperbarui tampilan Sidebar, Topbar, dan Portal Direktori secara bersamaan memerlukan penerapan pola *shared state* yang tepat. Pada fase ini diselesaikan menggunakan *React Context* untuk menyebarkan data sesi ke seluruh pohon komponen.

3. **Performa Render Middleware pada Next.js:** Konfigurasi middleware yang terlalu agresif sempat menyebabkan *redirect loop* pada beberapa kasus tepi (*edge cases*), seperti saat pengguna mengakses halaman yang memang publik (misalnya halaman *login* itu sendiri). Masalah ini diselesaikan dengan mendefinisikan `matcher` secara eksplisit di konfigurasi middleware untuk mengecualikan rute-rute publik.

### 5.2 Keputusan Teknis

- **Pilihan `localStorage` vs. Cookie:** Pada fase *frontend-only* ini, dipilih `localStorage` untuk kemudahan *debugging*. Namun desain arsitekturnya sudah dipersiapkan untuk migrasi ke *httpOnly Cookie* — pendekatan yang jauh lebih aman — ketika backend JWT siap diintegrasikan.
- **Single Layout File:** Seluruh kerangka (Sidebar + Topbar) diimplementasikan dalam satu file `layout.tsx` di level *root* aplikasi, memanfaatkan fitur *nested layout* Next.js App Router. Ini memastikan kerangka tetap konsisten di semua halaman tanpa perlu *props drilling*.

---

## 6. Rencana Tindak Lanjut (Sprint Minggu ke-7)

Dengan kokohnya fondasi autentikasi, RBAC, dan UI Shell yang kini telah rampung, seluruh "kandang" sudah siap. Sprint minggu ke-7 akan memulai pengisian kandang tersebut dengan **modul operasional pertama dan paling fundamental**: **Modul Manajemen Inventori** khusus untuk *role* Admin Inventory.

### Prioritas 1: Pembangunan Modul Inventori (Panel Admin Inventory)

Modul ini akan mencakup pembangunan antarmuka untuk:
- **Dasbor Overview Inventori** — Kartu statistik KPI (Total Unit, Tersedia, Booked, Terjual) dan grafik distribusi stok.
- **Master Tipe Rumah** — Form input dan tampilan kartu tipe (nama, LT m², LB m², kamar, harga dasar).
- **Registrasi Unit Kavling** — Form pendaftaran unit per blok dengan referensi ke master tipe dan penyesuaian harga.
- **Manajemen Site Plan** — Interface upload peta kawasan.
- **Status Unit** — Sistem badge berwarna (Tersedia / Booked / Terjual).

### Prioritas 2: Pengujian Integrasi Layout

Setelah Modul Inventori selesai, tim akan memvalidasi bahwa Sidebar, Topbar, Breadcrumb, dan proteksi middleware bekerja secara kohesif dengan halaman-halaman Inventori yang baru saja dibangun.

### Prioritas 3: Dokumentasi Desain System

Mendokumentasikan token-token desain ("Griya Persada" Design System) — palet warna, tipografi, ukuran komponen — agar konsistensi visual terjaga oleh semua anggota tim pada sprint-sprint berikutnya.

---

## 7. Lampiran Screenshot

**[Screenshot: Tampilan close-up Sidebar SIMDP di sisi kiri — menampilkan 5 item menu (Inventori, CRM & Sales, Keuangan, Legal, Supervisor) dengan menu "Inventori" sedang aktif (highlight amber). Terdapat avatar pengguna dan nama "Admin — Daffa" di bagian bawah sidebar]**

---

## 8. Kesimpulan

Minggu ke-6 menandai selesainya fase yang paling "diam namun paling penting" dalam siklus pengembangan SIMDP. Tidak ada modul bisnis yang terlihat secara visual bagi pengguna akhir yang berhasil dirilis minggu ini — dan itu memang disengaja. Yang berhasil dibangun adalah **infrastruktur tak kasat mata** yang menjadi syarat mutlak keberhasilan seluruh sprint berikutnya: pintu gerbang yang aman, sistem pembatas akses yang cerdas, dan kerangka antarmuka yang konsisten.

Dengan berhasilnya implementasi Autentikasi, Portal Direktori, RBAC 5 Role, Sidebar Dinamis, dan Topbar Responsif, platform SIMDP kini memiliki "sistem saraf pusat" yang siap menopang puluhan halaman operasional yang akan datang. Tim pengembangan memasuki minggu ke-7 dengan keyakinan penuh bahwa fondasi yang dibangun ini cukup kuat untuk menopang keseluruhan ekosistem digital properti yang sedang dibangun.

---

*Dokumen: progress-report-minggu-6.md*  
*Dibuat: 07 Mei 2026*  
*Bagian dari: Dokumentasi Tugas Akhir — Ekosistem Digital Properti Terpadu*
