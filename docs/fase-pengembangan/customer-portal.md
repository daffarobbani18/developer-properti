# Fase Pengembangan Frontend — Customer Portal
# SIMDP · Sistem Informasi Manajemen Developer Perumahan

---

## Gambaran Umum

Customer Portal adalah aplikasi khusus untuk **pembeli rumah** agar mereka bisa memantau progres pembangunan, melihat tagihan, mengunduh dokumen, dan mengajukan komplain — semua dari satu tempat tanpa harus menghubungi developer setiap saat.

- **Teknologi**: Next.js (Web) + React Native (Mobile iOS & Android)
- **Target pengguna**: Pembeli / pemilik unit (publik terdaftar)
- **Tujuan utama**: Transparansi progres unit, self-service dokumen & tagihan
- **Akses**: Login dengan akun yang dibuat setelah akad jual beli
- **Lingkup dokumen ini**: Versi **Web** dan **Mobile** dibahas bersama karena fiturnya identik

---

## Ringkasan Fase

| Fase | Nama | Fokus | Output |
|------|------|-------|--------|
| 1 | Fondasi & Login | Struktur + autentikasi pembeli | Pembeli bisa login |
| 2 | Progres Unit | Pantau konstruksi & foto | Pembeli lihat perkembangan rumah |
| 3 | Tagihan & Pembayaran | Riwayat & konfirmasi bayar | Self-service keuangan |
| 4 | Dokumen & Legal | Unduh dokumen unit | Arsip digital pembeli |
| 5 | Komplain & Komunikasi | Tiket & notifikasi | Saluran komunikasi resmi |
| 6 | Polish & Mobile | UI polish + React Native | Versi mobile production-ready |

---

## Fase 1 — Fondasi & Login Pembeli

### Tujuan
Membangun kerangka portal dan sistem login khusus pembeli.

### Pekerjaan

#### 1.1 Setup Proyek Web
- [ ] Inisialisasi Next.js (berbeda repo dari Web Admin)
- [ ] Setup Tailwind CSS — tema warna perumahan (bukan tone corporate)
- [ ] Struktur folder: `/app`, `/components`, `/lib`, `/styles`
- [ ] Setup environment variables

#### 1.2 Layout Utama
- [ ] `Navbar` — logo developer, nama proyek, tombol notifikasi, avatar pembeli
- [ ] `Footer` — kontak developer, tautan bantuan
- [ ] `BottomNav` *(untuk versi mobile)* — ikon tab: Beranda, Progres, Tagihan, Dokumen, Bantuan
- [ ] `PortalLayout` — wrapper setelah login

#### 1.3 Autentikasi
- [ ] Halaman Login (`/login`) — email + password
- [ ] Halaman pertama kali masuk — ganti password sementara
- [ ] Forgot password (`/lupa-password`)
- [ ] Guard route — pembeli hanya bisa akses data unit milik sendiri
- [ ] Logout

#### 1.4 Halaman Beranda (`/`)
- [ ] Sambutan dengan nama pembeli
- [ ] Ringkasan unit: nama unit, blok, tipe, status konstruksi saat ini
- [ ] Kartu cepat: progres %, tagihan berikutnya, notifikasi terbaru
- [ ] Kontak darurat developer (WA & telepon)

### Checklist Selesai Fase 1
- [ ] Pembeli bisa login dan logout
- [ ] Halaman beranda tampil dengan info unit
- [ ] Pembeli tidak bisa akses unit milik orang lain
- [ ] Tampilan responsif di desktop & mobile browser

---

## Fase 2 — Progres Pembangunan Unit

### Tujuan
Memberikan transparansi penuh kepada pembeli tentang status konstruksi rumah mereka, dilengkapi foto terkini.

### Pekerjaan

#### 2.1 Halaman Progres (`/progres`)
- [ ] Progress bar besar — persentase total konstruksi unit pembeli
- [ ] Breakdown per tahap: Pondasi, Struktur, Dinding, Atap, Finishing, dll.
- [ ] Status tiap tahap: `Belum Mulai / Sedang Berjalan / Selesai`
- [ ] Estimasi selesai

#### 2.2 Galeri Foto Progres
- [ ] Timeline foto — diurut dari terbaru
- [ ] Setiap foto memiliki: tanggal diambil, keterangan tahap
- [ ] Lightbox zoom foto
- [ ] Foto bersumber dari laporan Mobile App tim lapangan

#### 2.3 Milestone Unit
- [ ] Daftar tonggak penting: mulai bangun, selesai pondasi, dst., hingga serah terima
- [ ] Tanggal target vs tanggal aktual per milestone
- [ ] Status milestone: `Akan Datang / Selesai / Terlambat`

#### 2.4 Info Proyek
- [ ] Nama proyek & pengembang
- [ ] Alamat & nomor unit
- [ ] Tipe & spesifikasi rumah
- [ ] Nama manajer proyek + kontak

### Checklist Selesai Fase 2
- [ ] Progres unit tampil dengan persentase akurat
- [ ] Foto terkini dari lapangan muncul di portal
- [ ] Milestone terlihat jelas
- [ ] Data sinkron dengan yang diinput tim proyek di Web Admin

---

## Fase 3 — Tagihan & Pembayaran

### Tujuan
Memberikan kemudahan kepada pembeli untuk memantau dan mengelola kewajiban pembayaran mereka tanpa harus menghubungi admin.

### Pekerjaan

#### 3.1 Ringkasan Keuangan (`/tagihan`)
- [ ] Kartu: total harga unit, total sudah dibayar, sisa kewajiban
- [ ] Skema pembayaran aktif: KPR / tunai bertahap / tunai
- [ ] Cicilan KPR: bank, tanggal akad, besaran cicilan per bulan

#### 3.2 Tagihan Aktif
- [ ] Daftar tagihan yang belum dibayar
- [ ] Detail tagihan: jenis (DP/cicilan/IPL), jumlah, jatuh tempo
- [ ] Badge: `Belum Bayar / Jatuh Tempo / Terlambat`
- [ ] Tombol "Bayar Sekarang" (link ke VA / payment gateway)

#### 3.3 Riwayat Pembayaran
- [ ] Daftar semua transaksi pembayaran yang sudah dilakukan
- [ ] Status: `Lunas / Dikonfirmasi / Menunggu Verifikasi`
- [ ] Unduh bukti pembayaran / kwitansi digital per transaksi

#### 3.4 Upload Bukti Pembayaran Manual
- [ ] Form upload foto bukti transfer
- [ ] Pilih tagihan mana yang dibayar
- [ ] Status: `Menunggu Konfirmasi Admin`
- [ ] Notifikasi setelah dikonfirmasi

### Checklist Selesai Fase 3
- [ ] Tagihan aktif & riwayat pembayaran tampil
- [ ] Pembeli bisa upload bukti bayar
- [ ] Status pembayaran terupdate setelah dikonfirmasi admin
- [ ] Kwitansi digital bisa diunduh

---

## Fase 4 — Dokumen & Legal

### Tujuan
Menjadi gudang digital semua dokumen penting unit agar pembeli tidak perlu menyimpan fisik satu-satunya.

### Pekerjaan

#### 4.1 Halaman Dokumen (`/dokumen`)
- [ ] Daftar dokumen tersedia yang bisa diunduh
- [ ] Kategori dokumen:
  - Pra-pembelian: SPK (Surat Perjanjian Kredit), Brosur
  - Transaksi: AJB (Akta Jual Beli), Kwitansi DP
  - Kepemilikan: SHM (Sertifikat Hak Milik), IMB/PBG unit
  - Serah Terima: Berita Acara Serah Terima, Garansi

#### 4.2 Status Dokumen
- [ ] Setiap dokumen ada status: `Tersedia / Sedang Diproses / Belum Tersedia`
- [ ] Keterangan kenapa belum tersedia (proses notaris, dll.)

#### 4.3 Unduh Dokumen
- [ ] Tombol unduh dokumen PDF
- [ ] Preview PDF langsung di browser sebelum unduh
- [ ] Log waktu unduh (audit trail)

#### 4.4 Informasi Serah Terima
- [ ] Tanggal rencana serah terima unit
- [ ] Checklist item yang harus diselesaikan pembeli (lunasi hutang, lengkapi dokumen KPR, dll.)
- [ ] Status kesiapan serah terima

### Checklist Selesai Fase 4
- [ ] Dokumen terdaftar dengan status yang benar
- [ ] Unduhan dokumen berfungsi
- [ ] Preview PDF bisa dibuka
- [ ] Info serah terima tampil

---

## Fase 5 — Komplain & Komunikasi

### Tujuan
Menyediakan saluran resmi bagi pembeli untuk menyampaikan keluhan atau pertanyaan, menggantikan pesan WA/telepon yang tidak terstruktur.

### Pekerjaan

#### 5.1 Formulir Komplain (`/bantuan/komplain`)
- [ ] Pilih kategori: `Progres / Kualitas / Dokumen / Tagihan / Lainnya`
- [ ] Kolom deskripsi masalah
- [ ] Upload foto (jika ada kerusakan/kekurangan)
- [ ] Submit → tiket dibuat dengan nomor tiket

#### 5.2 Daftar Tiket (`/bantuan/tiket`)
- [ ] Daftar semua tiket yang pernah diajukan
- [ ] Status tiket: `Baru / Sedang Ditangani / Selesai / Ditutup`
- [ ] Detail tiket: deskripsi, foto, riwayat balasan dari developer

#### 5.3 Riwayat Percakapan per Tiket
- [ ] Chat-style thread antara pembeli & tim developer
- [ ] Pembeli bisa tambah balasan / info tambahan
- [ ] Notifikasi saat ada balasan dari developer

#### 5.4 FAQ (`/bantuan/faq`)
- [ ] Daftar pertanyaan yang sering ditanya
- [ ] Kategori: proses serah terima, pembayaran, sertifikat, dll.

#### 5.5 Kontak Langsung
- [ ] Tombol WA developer
- [ ] Nomor telepon kantor
- [ ] Jam operasional

### Checklist Selesai Fase 5
- [ ] Pembeli bisa submit komplain + upload foto
- [ ] Nomor tiket tergenerate
- [ ] Thread percakapan berfungsi
- [ ] FAQ dapat diakses

---

## Fase 6 — Polish & Versi Mobile (React Native)

### Tujuan
Memoles tampilan web dan membangun ulang fitur yang sama dalam versi aplikasi mobile (Android & iOS) dengan React Native.

### Pekerjaan

#### 6.1 Web Polish
- [ ] Animasi transisi antar halaman
- [ ] Loading skeleton di semua section
- [ ] Empty state (saat belum ada data)
- [ ] Tampilan responsif sempurna di semua ukuran HP (browser mobile)
- [ ] PWA (Progressive Web App) — bisa diinstall dari browser

#### 6.2 Setup React Native
- [ ] Inisialisasi proyek React Native (Expo atau bare RN)
- [ ] Setup navigasi: Bottom Tab + Stack Navigator
- [ ] Konfigurasi environment (API URL, dll.)
- [ ] Setup ikon & splash screen

#### 6.3 Portasi Fitur ke Mobile
- [ ] Beranda — sama dengan web
- [ ] Progres unit — progress bar + galeri foto (full screen swipe)
- [ ] Tagihan — daftar & upload foto bukti bayar via kamera
- [ ] Dokumen — daftar + unduh + share
- [ ] Komplain — form submit + foto dari kamera
- [ ] Tiket — list & thread percakapan

#### 6.4 Fitur Khusus Mobile
- [ ] Push notification (Firebase Cloud Messaging) — tagihan jatuh tempo, balasan tiket, update progres
- [ ] Biometrik login (Face ID / Fingerprint)
- [ ] Ambil foto langsung dari kamera untuk bukti bayar / komplain

#### 6.5 Deployment Mobile
- [ ] Build APK (Android) untuk testing internal
- [ ] Build IPA (iOS) untuk testing internal
- [ ] Submit ke Google Play Store + Apple App Store *(jika diperlukan)*

### Checklist Selesai Fase 6
- [ ] Web portal tampil sempurna di semua perangkat
- [ ] Aplikasi mobile bisa diinstall di Android & iOS
- [ ] Push notification berfungsi
- [ ] Semua fitur web tersedia di mobile

---

## Ringkasan Halaman

| Halaman | Fase | Web | Mobile |
|---------|------|:---:|:------:|
| Login & Beranda | 1 | ✅ | ✅ |
| Progres + Galeri Foto | 2 | ✅ | ✅ |
| Tagihan & Pembayaran | 3 | ✅ | ✅ |
| Dokumen & Unduhan | 4 | ✅ | ✅ |
| Komplain & FAQ | 5 | ✅ | ✅ |
| Push Notification | 6 | — | ✅ |
| Biometrik Login | 6 | — | ✅ |
| **Total halaman** | — | **12** | **7 screens utama** |

---

*Dokumen: customer-portal.md | Fase Pengembangan Frontend | Versi 1.0 | Februari 2026*
