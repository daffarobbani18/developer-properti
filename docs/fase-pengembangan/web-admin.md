# Fase Pengembangan Frontend — Web Admin
# SIMDP · Sistem Informasi Manajemen Developer Perumahan

---

## Gambaran Umum

Web Admin adalah aplikasi utama yang digunakan oleh seluruh tim internal developer perumahan. Ini adalah aplikasi paling kompleks karena mencakup **7 modul bisnis** dengan berbagai peran pengguna.

- **Teknologi**: Next.js (React) + Tailwind CSS
- **Target pengguna**: Direktur, Manajer, Tim Sales, Finance, Admin Legal (8 role internal)
- **Tujuan utama**: Pusat kendali semua operasi bisnis developer
- **Akses**: Login dengan role-based (RBAC) — berbeda tampilan per jabatan

---

## Ringkasan Fase

| Fase | Nama | Fokus | Output |
|------|------|-------|--------|
| 1 | Fondasi & Auth | Setup + sistem login RBAC | Login & dashboard kosong |
| 2 | CRM & Sales | Modul penjualan & pipeline pembeli | Tracking sales berjalan |
| 3 | Keuangan & Cashflow | Modul keuangan developer | Laporan keuangan live |
| 4 | Monitoring Milestone | Pengawasan konstruksi per milestone | Dashboard progres proyek |
| 5 | Pengeluaran & Vendor | Pembayaran kontraktor & kontrol biaya | Approval termin berjalan |
| 6 | Legal & Perizinan | Manajemen dokumen & izin | Repositori legal |
| 7 | Polish & Integrasi | UI/UX, notifikasi, koneksi modul | Sistem terintegrasi penuh |

---

## Fase 1 — Fondasi & Autentikasi

### Tujuan
Membangun kerangka aplikasi, sistem login, dan dashboard dasar yang menjadi pondasi semua modul.

### Pekerjaan

#### 1.1 Setup Proyek
- [ ] Inisialisasi Next.js dengan TypeScript
- [ ] Setup Tailwind CSS + komponen UI library (shadcn/ui atau Ant Design)
- [ ] Konfigurasi struktur folder: `/app`, `/components`, `/lib`, `/hooks`, `/types`
- [ ] Setup environment variables
- [ ] Setup Git + branching strategy

#### 1.2 Layout & Navigasi Utama
- [ ] `Sidebar` — menu navigasi modul (collapsible)
- [ ] `Header` — nama user, notifikasi bell, avatar + dropdown logout
- [ ] `MainLayout` — wrapper halaman setelah login
- [ ] `AuthLayout` — wrapper halaman login
- [ ] Responsif sidebar: hamburger menu di layar kecil

#### 1.3 Autentikasi
- [ ] Halaman Login (`/login`) — email + password
- [ ] Validasi form login
- [ ] Panggil API login → terima JWT token
- [ ] Simpan token di `httpOnly cookie` / `localStorage`
- [ ] Guard route — redirect ke login jika belum login
- [ ] Halaman lupa password (`/lupa-password`)
- [ ] Logout — hapus token + redirect ke login

#### 1.4 Role-Based Access Control (RBAC)
- [ ] Baca role dari token JWT setelah login
- [ ] Sembunyikan menu sidebar berdasarkan role
- [ ] Guard per halaman/modul berdasarkan role
- [ ] Definisi role: `direktur`, `manajer_sales`, `tim_sales`, `manajer_finance`, `admin_finance`, `manajer_proyek`, `site_engineer`, `admin_legal`

#### 1.5 Dashboard Utama (`/dashboard`)
- [ ] Kartu ringkasan: total unit terjual, pendapatan bulan ini, leads baru, proyek berjalan
- [ ] Grafik sederhana: tren penjualan bulanan
- [ ] Tampilan disesuaikan per role (Direktur melihat semua, Sales hanya penjualan, dst.)
- [ ] Komponen `StatCard` — reusable kartu statistik

### Checklist Selesai Fase 1
- [ ] Login & logout berfungsi
- [ ] RBAC bekerja — menu berbeda per role
- [ ] Dashboard tampil dengan data dummy/placeholder
- [ ] Guard route aktif (akses tanpa login → redirect login)

---

## Fase 2 — Modul CRM & Sales

### Tujuan
Membangun pipeline penjualan digital menggantikan pencatatan manual spreadsheet/buku.

### Pekerjaan

#### 2.1 Manajemen Leads (`/crm/leads`)
- [ ] Tabel daftar leads (nama, HP, sumber, status, tanggal masuk)
- [ ] Filter: status, sumber, range tanggal, sales yang handle
- [ ] Search leads by nama / nomor HP
- [ ] Form tambah leads manual
- [ ] Detail leads — histori semua interaksi
- [ ] Update status leads: `baru → follow-up → survey → negosiasi → booking`
- [ ] Assign leads ke sales tertentu
- [ ] Sumber leads otomatis dari Website Marketing

#### 2.2 Pipeline Kanban (`/crm/pipeline`)
- [ ] Board kanban 6 kolom: Leads → Follow-up → Survey → Negosiasi → Booking → SPK
- [ ] Drag & drop pindah kolom
- [ ] Kartu leads: nama, tipe unit minat, telepon, sales PIC
- [ ] Klik kartu → detail leads

#### 2.3 Manajemen Unit (`/crm/unit`)
- [ ] Daftar semua unit: nomor unit, tipe, luas, harga, status
- [ ] Status unit: `Tersedia / Booked / Terjual / Indent`
- [ ] Filter per blok/cluster
- [ ] Denah kavling (site plan) interaktif — warna per status
- [ ] Form edit harga per unit

#### 2.4 Transaksi Penjualan (`/crm/transaksi`)
- [ ] Form booking unit: pilih leads, pilih unit, input tanda jadi
- [ ] Form SPK: upload dokumen SPK
- [ ] Skema pembayaran: KPR / tunai / tunai bertahap
- [ ] Input status KPR: pengajuan → proses → disetujui → akad
- [ ] Histori transaksi per unit

#### 2.5 Aktivitas Sales (`/crm/aktivitas`)
- [ ] Log semua aktivitas: telpon, kunjungan, WA, email
- [ ] Jadwal follow-up — reminder otomatis
- [ ] Kalender sales

### Checklist Selesai Fase 2
- [ ] Leads bisa ditambah & di-update status
- [ ] Pipeline kanban drag & drop berfungsi
- [ ] Status unit berubah saat booking/terjual
- [ ] Histori transaksi tercatat

---

## Fase 3 — Modul Keuangan & Cashflow

### Tujuan
Menggantikan pencatatan keuangan manual dengan sistem terpusat yang bisa dipantau real-time.

### Pekerjaan

#### 3.1 Tagihan & Piutang (`/keuangan/tagihan`)
- [ ] Daftar tagihan pembeli (cicilan DP, angsuran, IPL)
- [ ] Status tagihan: `Belum Bayar / Lunas / Terlambat`
- [ ] Generate tagihan otomatis berdasarkan jadwal
- [ ] Upload bukti pembayaran
- [ ] Konfirmasi pembayaran oleh admin

#### 3.2 Pengeluaran (`/keuangan/pengeluaran`)
- [ ] Form catat pengeluaran: kategori, nominal, tanggal, keterangan
- [ ] Kategori: material, kontraktor, marketing, perizinan, operasional
- [ ] Upload bukti (foto bon/faktur)
- [ ] Daftar pengeluaran + filter

#### 3.3 Cashflow (`/keuangan/cashflow`)
- [ ] Grafik cashflow: pemasukan vs pengeluaran per bulan
- [ ] Proyeksi cashflow ke depan (berdasarkan jadwal tagihan + pengeluaran terencana)
- [ ] Alert zona merah (cashflow negatif terdeteksi)
- [ ] Tabel perincian per bulan

#### 3.4 RAB & Realisasi (`/keuangan/rab`)
- [ ] Input anggaran per pos biaya (RAB)
- [ ] Perbandingan RAB vs realisasi aktual
- [ ] Progress bar penggunaan anggaran per pos
- [ ] Alert jika realisasi mendekati / melewati anggaran

#### 3.5 Laporan Keuangan (`/keuangan/laporan`)
- [ ] Laporan laba rugi per periode
- [ ] Laporan per proyek
- [ ] Export ke PDF / Excel

### Checklist Selesai Fase 3
- [ ] Pemasukan & pengeluaran dapat dicatat
- [ ] Grafik cashflow tampil dengan data nyata
- [ ] RAB vs realisasi dapat dipantau
- [ ] Export laporan berfungsi

---

## Fase 4 — Modul Monitoring Milestone

### Tujuan
Memantau progres konstruksi setiap unit per milestone dari kantor, menerima laporan dari Site Engineer, dan memverifikasi sebelum pembayaran termin kontraktor.

### Pekerjaan

#### 4.1 Daftar Proyek (`/proyek`)
- [ ] Kartu/list semua proyek aktif
- [ ] Ringkasan per proyek: total unit, % milestone selesai, jumlah kontraktor aktif
- [ ] Buat proyek baru + input daftar kontraktor & kontrak

#### 4.2 Dashboard Progres Unit (`/proyek/[id]/unit`)
- [ ] Grid semua unit dalam proyek
- [ ] Progress bar per unit (% milestone selesai)
- [ ] Status warna: hijau (on track), kuning (mendekati telat), merah (terlambat)
- [ ] Klik unit → detail milestone + histori foto

#### 4.3 Manajemen Milestone (`/proyek/[id]/milestone`)
- [ ] Daftar milestone standar per unit: Pondasi, Struktur, Dinding, Atap, Finishing, dll.
- [ ] Status tiap milestone: `Belum Mulai / Sedang / Selesai`
- [ ] Foto bukti milestone dari Site Engineer (via Mobile App)
- [ ] Tanggal target vs tanggal aktual per milestone
- [ ] Alert jika milestone melebihi target tanggal

#### 4.4 Laporan Kendala (`/proyek/[id]/kendala`)
- [ ] Daftar laporan kendala masuk dari Site Engineer
- [ ] Kategori: pekerjaan tidak sesuai spek, jadwal molor, cuaca, dll.
- [ ] Status penanganan: `Baru / Ditindaklanjuti / Selesai`
- [ ] Assign tindak lanjut ke pihak terkait

#### 4.5 Tim Lapangan (`/proyek/[id]/tim`)
- [ ] Daftar Site Engineer yang ditugaskan per proyek
- [ ] Assign Site Engineer ke blok/unit tertentu

### Checklist Selesai Fase 4
- [ ] Milestone per unit tampil dengan status dan foto
- [ ] Foto dari Mobile App muncul di Web Admin
- [ ] Alert keterlambatan milestone berfungsi
- [ ] Laporan kendala dapat ditindaklanjuti

---

## Fase 5 — Modul Pengeluaran & Vendor

### Tujuan
Mengelola pembayaran termin ke kontraktor dengan sistem approval berjenjang, verifikasi milestone, dan kontrol RAB vs realisasi.

### Pekerjaan

#### 5.1 Manajemen Kontraktor & Vendor (`/vendor`)
- [ ] Daftar kontraktor: nama perusahaan, kontak, jenis pekerjaan
- [ ] Detail per kontraktor: proyek yang pernah dikerjakan, rekam jejak
- [ ] Form tambah kontraktor baru
- [ ] Upload kontrak digital per proyek

#### 5.2 Pengajuan Tagihan Termin (`/vendor/tagihan`)
- [ ] Form input tagihan termin dari kontraktor
- [ ] Pilih proyek, kontraktor, milestone yang diklaim selesai, nilai tagihan
- [ ] Sistem cek otomatis: apakah milestone terkait sudah ditandai selesai di Modul Milestone?
- [ ] Status: `Menunggu Verifikasi → Disetujui → Dibayar`

#### 5.3 Workflow Approval (`/vendor/approval`)
- [ ] Notifikasi ke approver (Finance / Direktur) saat tagihan masuk
- [ ] Halaman daftar tagihan menunggu approval
- [ ] Tombol Setujui / Tolak + isi alasan
- [ ] Nilai < Rp 50 juta → approval Manajer Finance. ≥ Rp 50 juta → Direktur
- [ ] Histori approval + timestamp

#### 5.4 Berita Acara Termin (`/vendor/ba`)
- [ ] BA termin digenerate otomatis setelah approval
- [ ] Isi BA: nama proyek, kontraktor, milestone, nilai, tanggal
- [ ] Download PDF Berita Acara
- [ ] Daftar semua BA per proyek

#### 5.5 RAB vs Realisasi (`/vendor/rab`)
- [ ] Input anggaran per pos biaya konstruksi
- [ ] Setiap pembayaran termin otomatis mengurangi saldo anggaran
- [ ] Grafik: anggaran tersisa vs progres milestone
- [ ] Alert jika realisasi mendekati/melewati batas RAB

### Checklist Selesai Fase 5
- [ ] Alur tagihan → verifikasi → approval → BA berfungsi
- [ ] Tagihan hanya bisa disetujui jika milestone sudah selesai
- [ ] BA PDF dapat digenerate dan diunduh
- [ ] RAB vs realisasi terpantau real-time

---

## Fase 6 — Modul Legal & Perizinan

### Tujuan
Menjadi repositori digital semua dokumen legal dan mengingatkan tim sebelum izin kedaluwarsa.

### Pekerjaan

#### 6.1 Repositori Dokumen (`/legal/dokumen`)
- [ ] Upload dan kategorisasi dokumen legal
- [ ] Kategori: izin proyek (IMB/PBG, SHGB), dokumen pembeli (AJB, SHM), kontrak
- [ ] Preview dokumen PDF langsung di browser
- [ ] Download dokumen

#### 6.2 Tracker Perizinan (`/legal/perizinan`)
- [ ] Daftar semua izin dengan: nama izin, nomor, tanggal terbit, tanggal expired
- [ ] Status: `Aktif / Akan Kedaluwarsa / Kadaluarsa`
- [ ] Progress pengajuan izin baru: `Persiapan → Pengajuan → Proses → Terbit`
- [ ] Catatan per izin

#### 6.3 Monitoring Kadaluarsa (`/legal/monitoring`)
- [ ] Kalender izin yang akan berakhir
- [ ] Daftar izin: < 90 hari, < 30 hari, < 7 hari
- [ ] Badge warna: kuning / oranye / merah

#### 6.4 Dokumen Pembeli
- [ ] Upload AJB, SHM, BPHTB per unit
- [ ] Status serah terima dokumen ke pembeli
- [ ] Link ke Customer Portal (pembeli bisa unduh)

### Checklist Selesai Fase 6
- [ ] Dokumen bisa diupload & dipreview
- [ ] Status kadaluarsa izin tampil dengan warna
- [ ] Pembeli bisa unduh dokumen mereka via portal
- [ ] Monitoring kadaluarsa berfungsi

---

## Fase 7 — Polish & Integrasi

### Tujuan
Menyatukan semua modul, memastikan data mengalir antar modul, dan memoles UI/UX sebelum go-live.

### Pekerjaan

#### 7.1 Notifikasi In-App
- [ ] Bell notifikasi di header
- [ ] Notifikasi: leads baru, approval tagihan menunggu, milestone terlambat, tagihan jatuh tempo, izin akan kadaluarsa
- [ ] Mark as read / mark all as read
- [ ] Halaman riwayat semua notifikasi

#### 7.2 Konektivitas Antar Modul
- [ ] Unit terjual di CRM → otomatis update modul Keuangan
- [ ] Data pembeli di CRM → otomatis membuat akun Customer Portal
- [ ] Termin disetujui di Pengeluaran & Vendor → otomatis tercatat sebagai pengeluaran di Keuangan
- [ ] Milestone selesai di lapangan (Mobile App) → tampil di Web Admin, Customer Portal, & unlock termin

#### 7.3 UI/UX Polish
- [ ] Loading state (skeleton) di semua tabel & halaman
- [ ] Empty state dengan ilustrasi (saat data kosong)
- [ ] Error handling & pesan feedback yang jelas
- [ ] Konfirmasi sebelum aksi penting (hapus, setujui, tolak)
- [ ] Tooltip untuk icon/label yang tidak jelas

#### 7.4 Pengujian
- [ ] Uji semua fitur di semua role berbeda
- [ ] Uji responsivitas (laptop 1366px, 1920px)
- [ ] Uji performa halaman dengan banyak data
- [ ] Bug fix

#### 7.5 Deployment
- [ ] Build production
- [ ] Deploy ke server
- [ ] Setup domain + HTTPS

### Checklist Selesai Fase 7
- [ ] Semua modul terhubung dan data mengalir antar modul
- [ ] Notifikasi berfungsi untuk semua kondisi penting
- [ ] Tidak ada bug kritis
- [ ] Web Admin live di server production

---

## Ringkasan Modul & Halaman

| Modul | Jumlah Halaman Utama | Fase |
|-------|:--------------------:|------|
| Auth & Dashboard | 3 | 1 |
| CRM & Sales | 5 | 2 |
| Keuangan & Cashflow | 5 | 3 |
| Monitoring Milestone | 5 | 4 |
| Pengeluaran & Vendor | 5 | 5 |
| Legal & Perizinan | 4 | 6 |
| Polish & Integrasi | — | 7 |
| **Total** | **26** | — |

---

*Dokumen: web-admin.md | Fase Pengembangan Frontend | Versi 1.0 | Februari 2026*
