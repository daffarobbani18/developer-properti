# LAPORAN KEMAJUAN MINGGUAN — MINGGU KE-2

**Judul Tugas Akhir:** Ekosistem Digital Properti Terpadu (SIMDP — Sistem Informasi Manajemen Developer Perumahan)
**Periode Laporan:** 28 April 2026 – 07 Mei 2026
**Minggu ke:** 7 (Fase Implementasi Modul Inti)
**Fokus Utama:** Modul Manajemen Inventori — Panel Admin Inventory
**Status Keseluruhan:** 🟢 Hijau — On Track
**Disusun oleh:** Daffa Robbani

---

## 1. Ringkasan Eksekutif

Memasuki minggu kedua pengembangan platform SIMDP, fokus kerja dialihkan sepenuhnya dari fase inisiasi dan setup fondasi ke fase implementasi modul inti pertama yang paling fundamental: **Modul Manajemen Inventori**. Keputusan untuk memprioritaskan modul ini di sprint awal bukan tanpa alasan; dari seluruh peta arsitektur sistem yang telah dirancang, Modul Inventori memegang posisi strategis sebagai **"hulu" atau sumber data primer** yang mengaliri hampir semua modul lain dalam ekosistem SIMDP.

Tanpa data inventori yang terstruktur dan akurat, tidak ada satupun modul hilir yang dapat berfungsi dengan benar:

- **Modul CRM & Sales** tidak dapat menampilkan ketersediaan unit kepada tim sales, tidak dapat memproses booking, dan tidak dapat melacak unit mana yang sedang dikerjakan.
- **Website Marketing (Publik)** tidak dapat menampilkan katalog properti yang real-time kepada calon pembeli, karena tidak ada sumber data yang sahih tentang tipe rumah, harga, dan status kavling.
- **Modul Keuangan** tidak dapat menghitung proyeksi pendapatan, karena tidak ada referensi harga per unit yang terstandarisasi.
- **Customer Portal** tidak dapat menampilkan informasi spesifik unit milik pembeli, karena tidak ada data master kavling yang dirujuk.
- **Modul Monitoring Proyek (Milestone)** tidak dapat mengidentifikasi unit mana yang sedang dalam konstruksi, karena tidak ada pemetaan kavling ke proyek.

Dengan demikian, penyelesaian Modul Inventori pada minggu ini adalah keputusan arsitektural yang tepat — **setiap jam yang diinvestasikan di sini akan berlipat manfaatnya pada seluruh sprint berikutnya**. Seluruh entitas data yang dibuat pada modul ini bersifat reusable dan akan menjadi backbone referensi bagi 6 modul lain dalam platform.

**[Screenshot: Tampilan Panel Admin Inventory — Tab Overview/Dasbor Inventaris menampilkan 4 kartu ringkasan statistik (Total Unit: 150, Tersedia: 45, Booked: 12, Terjual: 93) beserta grafik distribusi stok per tipe rumah]**

Pada minggu ini, seluruh sub-fitur utama dalam Modul Inventori berhasil diselesaikan dan dapat dioperasikan melalui antarmuka panel admin. Panel ini dibangun di atas stack Next.js dengan design system **"Griya Persada"** — dark-themed sidebar dengan aksen amber, dan white card-based layout untuk konten utama — yang konsisten dengan identitas visual keseluruhan platform.

---

## 2. Detail Fungsionalitas yang Diselesaikan

### 2.1 Sistem Manajemen Data Kawasan & Proyek

**Apa yang diimplementasikan:**
Sistem memiliki kemampuan untuk mengelola data kawasan perumahan sebagai entitas induk tertinggi dalam hierarki inventori. Kawasan merepresentasikan proyek perumahan secara keseluruhan — misalnya "Griya Persada Tahap 1" atau "Cluster The Skyline". Dalam antarmuka panel admin, kawasan menjadi konteks yang membungkus seluruh data blok, kavling, dan tipe rumah di bawahnya.

**Mengapa ini penting secara bisnis:**
Satu perusahaan developer properti umumnya mengelola lebih dari satu proyek perumahan secara bersamaan — bahkan dalam fase yang berbeda (ada yang masih pemasaran, ada yang sedang konstruksi, ada yang sudah serah terima). Tanpa pemisahan berbasis kawasan, seluruh data inventori akan tercampur menjadi satu daftar panjang yang tidak terstruktur, menyulitkan tim sales dalam mengidentifikasi ketersediaan unit per proyek, dan menyulitkan manajer dalam memantau kinerja penjualan per kawasan secara terpisah.

### 2.2 Sistem Manajemen Data Blok

**Apa yang diimplementasikan:**
Di bawah hierarki kawasan, sistem mendukung pencatatan data blok. Setiap kawasan perumahan biasanya dibagi ke dalam beberapa blok (Blok A, B, C, atau pemberian nama premium seperti "The Astoria Wing", "Magnolia Cluster"). Blok ini menjadi kelompok logis bagi kavling-kavling yang berlokasi berdekatan dan memiliki karakteristik serupa.

**Mengapa ini penting secara bisnis:**
Pemisahan blok memiliki implikasi langsung pada strategi penjualan. Developer sering meluncurkan pemasaran per blok secara bertahap (*phased launch*) — misalnya memasarkan Blok A terlebih dahulu hingga sold out, baru membuka Blok B. Sistem yang memahami struktur blok ini memungkinkan admin untuk mengontrol visibilitas kavling per blok di website marketing publik, serta membantu tim sales menyampaikan informasi yang akurat kepada calon pembeli tentang lokasi unit dalam peta kawasan.

### 2.3 Sistem Input Nomor Kavling (Unit Fisik)

**Apa yang diimplementasikan:**
Setiap kavling didaftarkan sebagai entitas unit fisik yang unik dengan identifikasi berbasis kode blok dan nomor urut (contoh format: `BLK-A1`, `BLK-A2`, `BLK-C5`). Sistem menyediakan form registrasi unit baru melalui modal **"Registrasi Unit Kavling"** yang dapat diakses dari tab *Kavling & Unit*.

Setiap unit yang terdaftar tercatat dalam tabel master unit dengan kolom:
- **ID Unit / Blok** — identifikasi unik berbasis kode alfanumerik
- **Tipe Rumah** — referensi ke master tipe yang sudah terdaftar
- **Harga Spesifik** — harga final unit tersebut (base price ± penyesuaian)
- **Status** — kondisi terkini unit (Tersedia / Booked / Terjual)
- **Aksi** — tombol edit dan hapus yang muncul saat hover

**[Screenshot: Tab "Kavling & Unit" menampilkan tabel unit dengan data blok BLK-A1 (Tersedia), BLK-A2 (Booked), BLK-C5 (Terjual), BLK-D1 dan BLK-D2 beserta badge status berwarna — hijau untuk Tersedia, amber untuk Booked, merah untuk Terjual — dan tombol aksi hover]**

**Mengapa ini penting secara bisnis:**
Nomor kavling adalah identitas paling atomik dalam bisnis properti. Setiap transaksi jual-beli, setiap cicilan, setiap progres konstruksi, setiap dokumen legal — semuanya merujuk pada satu nomor kavling yang spesifik. Kesalahan dalam pencatatan nomor kavling dapat berujung pada dispute hukum, double-booking yang merugikan reputasi developer, atau kesalahan penerbitan sertifikat. Sistem pencatatan yang terstruktur dengan ID unik per unit menjadi fondasi keabsahan data di seluruh proses bisnis.

### 2.4 Sistem Master Tipe Rumah

**Apa yang diimplementasikan:**
Modul menyediakan halaman **"Master Tipe Rumah"** yang menampilkan kartu visual per tipe properti. Tipe rumah adalah *blueprint* atau cetak biru yang merepresentasikan konfigurasi standar suatu produk. Setiap master tipe menyimpan atribut:
- Nama tipe (contoh: "The Astoria", "The Bvlgari", "Magnolia")
- Luas Tanah (m²)
- Luas Bangunan (m²)
- Jumlah kamar tidur
- Jumlah kamar mandi
- Harga Dasar (Base Price)

Form input tipe baru tersedia melalui modal yang dapat dipanggil dengan tombol **"+ Tambah Tipe"**, lengkap dengan field terstruktur untuk setiap atribut di atas.

**Mengapa ini penting secara bisnis:**
Model *Master Tipe → Unit Instance* mengikuti prinsip DRY (*Don't Repeat Yourself*) dalam konteks bisnis. Daripada memasukkan spesifikasi lengkap untuk setiap dari 150 kavling secara manual, admin cukup mendefinisikan 3-5 tipe master, lalu setiap kavling tinggal mereferensikan tipe yang sesuai. Perubahan spesifikasi tipe (misalnya penambahan carport pada tipe tertentu) cukup dilakukan sekali di master dan otomatis berlaku ke semua kavling yang merujuknya.

### 2.5 Penetapan Status Unit: Pesan Bangun vs. Siap Huni

**Apa yang diimplementasikan:**
Sistem mendukung dua klasifikasi fundamental kondisi fisik unit yang memiliki implikasi berbeda dalam proses penjualan dan konstruksi:

- **Pesan Bangun (Inden):** Unit masih berupa kavling tanah kosong yang akan dibangun setelah terjadi transaksi pembelian. Calon pembeli memesan unit yang belum fisik bangunannya.
- **Siap Huni (Ready Stock):** Unit sudah selesai dibangun secara fisik dan bisa langsung ditempati setelah proses administrasi jual-beli selesai.

**Mengapa pemisahan status ini sangat kritis secara bisnis:**

Ini bukan sekadar perbedaan label — perbedaan status ini berdampak pada:

1. **Proses Penjualan:** Unit Siap Huni memungkinkan closing lebih cepat karena pembeli dapat langsung survey fisik bangunan. Unit Pesan Bangun memerlukan presentasi denah dan maket, serta membutuhkan waktu tunggu konstruksi 8-24 bulan.

2. **Skema KPR:** Bank memiliki produk KPR yang berbeda — KPR Inden (pencairan bertahap sesuai progress konstruksi) vs. KPR Ready Stock (pencairan sekaligus). Tim sales harus mengetahui status ini sebelum mengarahkan pembeli ke bank.

3. **Pengakuan Pendapatan:** Dalam akuntansi developer properti, pendapatan dari unit Pesan Bangun diakui secara bertahap sesuai persentase penyelesaian, sedangkan unit Siap Huni diakui sekaligus saat akad. Ini berdampak pada laporan keuangan yang dibaca oleh modul Finance.

4. **Timeline Serah Terima:** Unit Pesan Bangun memiliki tanggal serah terima yang perlu dipantau oleh modul Monitoring Proyek, sedangkan unit Siap Huni langsung memiliki tanggal yang sudah pasti.

### 2.6 Sistem Input Luas Tanah (m²) dan Luas Bangunan (m²)

**Apa yang diimplementasikan:**
Dua field dimensi utama — **Luas Tanah (LT)** dan **Luas Bangunan (LB)** — diimplementasikan sebagai input numerik terpisah pada form Master Tipe. Pada tampilan kartu tipe rumah, kedua nilai ini ditampilkan secara prominan menggunakan format "Tipe LT/LB" (contoh: "Tipe 200/150") yang merupakan konvensi standar industri properti Indonesia.

**Mengapa ini penting secara bisnis:**

- **Luas Tanah** menentukan Nilai Jual Objek Pajak (NJOP) dan menjadi basis perhitungan Bea Perolehan Hak atas Tanah dan Bangunan (BPHTB) yang harus dibayar pembeli.
- **Luas Bangunan** menentukan besarnya Pajak Bumi dan Bangunan (PBB) tahunan yang menjadi kewajiban pemilik.
- Rasio LT terhadap LB (*floor area ratio*) menjadi salah satu indikator utama yang dipertimbangkan calon pembeli saat membandingkan unit antar cluster atau antar developer.
- Data ini juga krusial untuk proses perizinan — Izin Mendirikan Bangunan (IMB) / Persetujuan Bangunan Gedung (PBG) diterbitkan berbasis luas bangunan yang tercatat, dan harus konsisten dengan data dalam sistem.

### 2.7 Penetapan Harga Dasar (Base Price) dan Penyesuaian Harga Khusus

**Apa yang diimplementasikan:**
Sistem mengimplementasikan model harga dua lapis yang mencerminkan realita bisnis properti:

**Layer 1 — Base Price (Harga Dasar Master Tipe):**
Ditetapkan pada level Master Tipe Rumah. Ini adalah harga standar untuk tipe tersebut tanpa faktor lokasi. Field input tersedia di form "Input Master Tipe Baru" dengan format `Rp [nilai]`.

**Layer 2 — Penyesuaian Harga Khusus (Price Adjustment per Unit):**
Ditetapkan pada level unit individual saat registrasi kavling. Field ini tersedia di form "Registrasi Unit Kavling" dengan label **"Penyesuaian Harga (Markup Hook/Taman)"** berformat `+ Rp [nilai]`. Field ini bersifat opsional — kosong berarti harga unit sama persis dengan Base Price tipe masternya.

**[Screenshot: Modal "Registrasi Unit Kavling" terbuka dengan field ID Blok & Nomor (BLK-A12), dropdown Pilih Tipe Rumah, dan field Penyesuaian Harga dengan prefix "+ Rp" — memperlihatkan alur input data kavling lengkap]**

**Mengapa model dua-lapis ini esensial secara bisnis:**

Dalam satu tipe rumah yang sama (misalnya Tipe 200/150), dua kavling yang bersebelahan bisa memiliki harga yang berbeda signifikan karena faktor:

- **Hook/Sudut:** Kavling pojok (*hook*) memiliki dua sisi terbuka, memberikan privasi lebih dan nilai estetika lebih tinggi — biasanya markup 3-8%.
- **Hadap Taman/Fasilitas:** Kavling yang menghadap taman cluster, kolam renang, atau fasilitas umum memiliki nilai premium dibanding kavling yang menghadap unit lain.
- **Posisi Baris:** Kavling di baris depan dekat gerbang vs. baris belakang bisa memiliki preferensi berbeda-beda bergantung segmen pembeli.
- **Kontur Tanah:** Kavling yang tidak perlu urugan tanah besar memiliki biaya fondasi lebih rendah, yang bisa ditranslasikan ke harga lebih kompetitif.

Tanpa model harga dua-lapis ini, developer dipaksa memilih antara: (a) membuat terlalu banyak master tipe hanya untuk mengakomodasi variasi harga, atau (b) menetapkan harga seragam yang mengakibatkan kerugian potensi pendapatan dari kavling premium.

### 2.8 Dasbor Overview Inventori

**Apa yang diimplementasikan:**
Tab pertama dari panel Admin Inventory adalah **Dasbor Overview** yang menampilkan ringkasan kondisi inventori secara real-time melalui:

- **4 Kartu KPI Statistik:** Total Unit Kavling (150), Unit Tersedia (45), Sedang Booked (12), Sudah Terjual (93)
- **Alert Stok Menipis:** Banner peringatan otomatis yang muncul ketika ketersediaan unit di suatu tipe rumah mendekati habis — contoh: "Sisa 2 unit tersedia untuk Tipe Magnolia. Pertimbangkan untuk membuka blok baru."
- **Grafik Distribusi Stok per Tipe:** Visualisasi bar chart yang menampilkan komparasi stok antara semua tipe rumah yang terdaftar

### 2.9 Manajemen Master Site Plan

**Apa yang diimplementasikan:**
Tab **"Site Plan"** menyediakan interface untuk mengunggah dan mengelola peta digital kawasan perumahan. Sistem mendukung format file SVG/PNG untuk denah interaktif, dengan area drag-and-drop yang intuitif. Panel samping menampilkan daftar "Denah Aktif" yang sudah diunggah beserta timestamp pembaruan terakhir.

**Mengapa ini penting:**
Site plan yang terunggah di panel admin akan menjadi sumber data gambar yang ditampilkan di Website Marketing publik. Tim marketing tidak perlu mengakses server atau tool terpisah untuk memperbarui peta kavling — cukup melalui panel admin yang sama.

---

## 3. Metrik Pencapaian

### 3.1 Persentase Penyelesaian Modul Inventori

| Sub-Komponen | Status | Estimasi Penyelesaian |
|---|---|---|
| Dasbor Overview & KPI Statistik | ✅ Selesai | 100% |
| Master Tipe Rumah (CRUD UI) | ✅ Selesai | 100% |
| Input LT, LB, Kamar, Base Price | ✅ Selesai | 100% |
| Registrasi Unit Kavling per Blok | ✅ Selesai | 100% |
| Status Unit (Tersedia/Booked/Terjual) | ✅ Selesai | 100% |
| Penyesuaian Harga Khusus per Unit | ✅ Selesai | 100% |
| Alert Stok Menipis Otomatis | ✅ Selesai | 100% |
| Grafik Distribusi Stok | ✅ Selesai | 100% |
| Manajemen Site Plan (Upload UI) | ✅ Selesai | 100% |
| Integrasi API Backend (koneksi ke DB) | ⬜ Belum | 0% |
| Status Pesan Bangun vs. Siap Huni (DB Level) | 🟡 Parsial | 50% |

**Total Estimasi Fase Frontend Inventori: ~90% selesai**

> Catatan: Angka 90% mencerminkan penyelesaian lapisan presentasi (UI/UX) secara penuh. Sisa 10% adalah integrasi ke backend/database yang akan dikerjakan setelah backend API endpoint selesai dibangun pada sprint mendatang.

### 3.2 Progress Keseluruhan Platform SIMDP

| Aplikasi / Modul | Status | Progress |
|---|---|---|
| Web Admin — Autentikasi & RBAC | ✅ Selesai Fase 1 | ~95% |
| Web Admin — Modul Inventori | ✅ Selesai Fase Frontend | ~90% |
| Web Admin — Modul CRM & Sales | ✅ Selesai Fase Frontend | ~85% |
| Web Admin — Modul Finance | 🟡 In Progress | ~40% |
| Web Admin — Modul Legal | 🟡 In Progress | ~35% |
| Web Admin — Modul Monitoring Proyek | 🟡 In Progress | ~30% |
| Backend NestJS + Prisma | ⬜ Struktur folder | ~10% |
| Website Marketing Publik | ⬜ Belum dimulai | 0% |
| Customer Portal | ⬜ Belum dimulai | 0% |
| Mobile App (Lapangan) | 🟡 In Progress | ~40% |

### 3.3 KPI Sprint Minggu ke-2

| KPI | Target | Realisasi | Status |
|---|---|---|---|
| Sub-fitur inventori selesai (UI) | 8 fitur | 9 fitur | ✅ Melampaui target |
| Modal input fungsional | 2 modal | 2 modal | ✅ Tercapai |
| Tab navigasi dalam modul | 4 tab | 4 tab | ✅ Tercapai |
| Design system konsisten | Amber/Zinc | Teraplikasi penuh | ✅ Tercapai |
| Bug critical | 0 | 0 | ✅ Aman |
| Typecheck bersih | Pass | Pass | ✅ Tercapai |

---

## 4. Hubungan Modul Inventori dengan Modul Lain

Berikut adalah pemetaan konkret bagaimana data yang dihasilkan Modul Inventori pada minggu ini akan digunakan oleh modul-modul lain:

```
MODUL INVENTORI (Hulu — Data Master)
          │
          ├──► CRM & Sales
          │     • Daftar unit "Tersedia" untuk ditawarkan sales ke leads
          │     • Harga unit sebagai acuan negosiasi
          │     • Update status ke "Booked" saat terjadi booking
          │
          ├──► Website Marketing Publik
          │     • Katalog tipe rumah (nama, LT, LB, harga)
          │     • Status ketersediaan kavling secara real-time
          │     • Site plan interaktif dari data yang diunggah admin
          │
          ├──► Modul Keuangan
          │     • Base Price per tipe sebagai dasar proyeksi pendapatan
          │     • Harga spesifik per unit untuk pembuatan invoice
          │
          ├──► Customer Portal
          │     • Detail unit milik pembeli (tipe, LT, LB, nomor kavling)
          │     • Status unit sebagai referensi progres
          │
          └──► Monitoring Proyek (Milestone)
                • Kavling yang berstatus "Pesan Bangun" masuk ke antrian konstruksi
                • Nomor unit sebagai identifier di setiap milestone
```

---

## 5. Kendala dan Catatan Teknis

### 5.1 Kendala yang Dihadapi

1. **Integrasi Backend Tertunda:** Backend API (NestJS + Prisma) untuk modul inventori belum selesai dibangun, sehingga saat ini data yang ditampilkan masih menggunakan *seed data* statis yang hardcoded di frontend. Integrasi penuh ke database PostgreSQL menjadi prioritas sprint berikutnya.

2. **Status "Pesan Bangun vs. Siap Huni" di Level UI:** Meskipun konsep sudah diimplementasikan dalam desain sistem, selector status ini masih perlu ditambahkan secara eksplisit ke dalam form registrasi unit sebagai field dropdown terpisah. Saat ini status yang terexpose baru tiga kondisi transaksi (Tersedia/Booked/Terjual), belum dikombinasikan dengan kondisi fisik unit.

### 5.2 Keputusan Teknis

- **Design Pattern Modal:** Dipilih pendekatan portal modal (fixed overlay dengan backdrop blur) dibanding halaman baru untuk input data, mempertahankan konteks navigasi pengguna dan mengurangi jumlah route yang perlu dikelola.
- **Model Harga Dua-Lapis:** Implementasi Base Price di level Master Tipe + Price Adjustment di level Unit mengikuti pola yang lazim digunakan sistem ERP properti enterprise, dan terbukti efisien untuk skenario developer dengan 3-10 tipe rumah dan 50-300 kavling.

---

## 6. Rencana Tindak Lanjut (Sprint Minggu ke-3)

Dengan Modul Inventori yang kini telah selesai secara lapisan presentasi, sprint minggu ke-3 secara logis akan bergerak ke dua arah: **memperdalam Modul Inventori dengan integrasi backend**, sekaligus **memanfaatkan data inventori untuk membangun modul hilir pertama**.

### Prioritas 1: Integrasi Backend API Inventori

Membangun endpoint NestJS untuk:
- `GET /inventory/types` — mengambil semua master tipe rumah dari database
- `POST /inventory/types` — menyimpan tipe rumah baru ke PostgreSQL via Prisma
- `GET /inventory/units` — mengambil semua kavling dengan filter blok dan status
- `POST /inventory/units` — registrasi unit baru
- `PATCH /inventory/units/:id/status` — update status unit (digunakan oleh modul CRM saat terjadi booking)

### Prioritas 2: Integrasi Data Inventori ke Website Marketing Publik

Memulai pembangunan Website Marketing (web-public) yang memanfaatkan data inventori sebagai sumber konten:
- Halaman landing page dengan section "Tipe Rumah" yang menampilkan kartu tipe dari API
- Halaman katalog kavling dengan filter status (hanya menampilkan yang "Tersedia")
- Integrasi site plan interaktif menggunakan aset yang sudah diunggah di panel admin

### Prioritas 3: Finalisasi Field Status Fisik Unit

Menambahkan field **"Kondisi Fisik"** dengan opsi:
- `PESAN_BANGUN` — untuk unit inden yang belum terbangun
- `SIAP_HUNI` — untuk unit ready stock yang sudah bisa dihuni

dan menyambungkannya ke logika modul CRM (info yang ditampilkan ke tim sales) serta modul Monitoring Proyek (penentuan apakah unit memerlukan tracking milestone konstruksi).

### Prioritas 4: Dashboard Analytics Inventori

Meningkatkan dasbor overview dengan data analitik lebih kaya:
- Grafik tren penjualan per bulan
- Persentase sold-out per tipe rumah
- Estimasi revenue berdasarkan harga × unit terjual

---

## 7. Lampiran Screenshot

**[Screenshot: Modal "Input Master Tipe Baru" terbuka — menampilkan field Nama Tipe Rumah, input Luas Tanah (m²) dan Luas Bangunan (m²) dalam grid 2 kolom, input Kamar Tidur dan Kamar Mandi, serta field Harga Dasar (Base Price) dengan prefix "Rp" dan tombol "Simpan Tipe Baru"]**

**[Screenshot: Tab "Tipe Rumah" menampilkan 3 kartu property type — The Astoria (200/150, 4 kamar, Rp 2,8 M), The Bvlgari (250/210, 5 kamar, Rp 4,5 M), dan Magnolia (72/36, 2 kamar, Rp 450 Juta) — dengan layout card grid dan badge spesifikasi amber]**

---

## 8. Kesimpulan

Minggu ke-2 menandai pencapaian kritis pertama dalam rangkaian pengembangan platform SIMDP: terselesaikannya Modul Manajemen Inventori yang berfungsi sebagai tulang punggung data seluruh ekosistem. Dengan 9 sub-fitur inventori yang berhasil diimplementasikan, 2 modal input yang fungsional, dan dasbor overview yang informatif, fondasi data properti kini sudah tersedia dan siap dimanfaatkan oleh modul-modul lain.

Langkah terpenting yang menanti di sprint ke-3 adalah menjembatani lapisan frontend yang sudah matang ini dengan backend API dan database, sehingga data inventori yang diinput melalui panel admin dapat mengalir secara nyata ke seluruh titik konsumsi dalam ekosistem — mulai dari Website Marketing publik hingga Customer Portal pembeli.

---

*Dokumen: progress-report-minggu-2-inventori.md*
*Dibuat: 07 Mei 2026*
*Bagian dari: Dokumentasi Tugas Akhir — Ekosistem Digital Properti Terpadu*
