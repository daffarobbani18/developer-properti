# Roadmap Pengembangan Frontend
# SIMDP — Sistem Informasi Manajemen Developer Perumahan

---

## Ikhtisar

Dokumen ini adalah peta jalan pengembangan **seluruh frontend** SIMDP, mencakup 4 aplikasi yang disusun dalam urutan prioritas dan saling terhubung satu sama lain.

Setiap tahap (step) dirancang agar menghasilkan output yang bisa diuji dan digunakan secara nyata sebelum melanjutkan ke tahap berikutnya.

---

## Daftar Aplikasi

| No | Aplikasi | Teknologi | Pengguna | Jumlah Halaman |
|----|----------|-----------|----------|:--------------:|
| 1 | Web Admin | Next.js + Tailwind | Tim internal (8 role) | 26 halaman |
| 2 | Website Marketing | Next.js + Tailwind | Publik (calon pembeli) | 15 halaman |
| 3 | Customer Portal | Next.js (Web) + React Native (Mobile) | Pembeli terdaftar | 12 web + 7 mobile |
| 4 | Mobile Lapangan | React Native | Site Engineer, Manajer Proyek | 12 screens |

---

## Urutan Pengembangan & Alasan

```
             PRIORITAS PENGEMBANGAN
             =====================

 [1] Web Admin        Fondasi sistem. Semua modul bisnis berjalan di sini.
      |                Tanpa ini, tidak ada data untuk app lain.
      |
 [2] Website          Quick win. Bisa langsung dipresentasikan ke mitra.
     Marketing        Output nyata pertama yang terlihat oleh dunia luar.
      |
 [3] Mobile           Dibutuhkan saat konstruksi aktif.
     Lapangan         Data milestone mengalir ke Web Admin & Customer Portal.
      |
 [4] Customer         Dibutuhkan setelah pembeli mulai bertransaksi.
     Portal           Bergantung pada data dari Web Admin & Mobile Lapangan.
```

**Catatan**: Urutan di atas tidak berarti harus selesai 100% sebelum memulai aplikasi berikutnya. Dalam praktiknya, setelah Web Admin Fase 1-2 selesai, Website Marketing bisa mulai dikerjakan secara paralel.

---

## Peta Fase Seluruh Aplikasi

### Ringkasan (27 Fase Total)

| Step | Aplikasi | Fase | Nama | Output Utama |
|:----:|----------|:----:|------|:-------------|
| 1 | Web Admin | 1 | Fondasi & Auth | Login, RBAC, dashboard dasar |
| 2 | Web Admin | 2 | CRM & Sales | Pipeline penjualan digital |
| 3 | Website Marketing | 1 | Landing Page | Halaman utama perumahan live |
| 4 | Website Marketing | 2 | Produk & Galeri | Katalog unit online |
| 5 | Web Admin | 3 | Keuangan & Cashflow | Tagihan, cashflow, RAB, laporan |
| 6 | Website Marketing | 3 | Formulir & Simulasi | Form leads + kalkulator KPR |
| 7 | Website Marketing | 4 | Optimasi & Polish | SEO, performa, analytics |
| 8 | Web Admin | 4 | Monitoring Milestone | Dashboard progres konstruksi |
| 9 | Mobile Lapangan | 1 | Setup & Login | App mobile + auth 2 role |
| 10 | Mobile Lapangan | 2 | Update Milestone & Foto | Input milestone + kamera |
| 11 | Mobile Lapangan | 3 | Unit & Kendala | Pantau unit + laporan masalah |
| 12 | Web Admin | 5 | Pengeluaran & Vendor | Tagihan termin + approval |
| 13 | Mobile Lapangan | 4 | Notifikasi & Offline | Push notif + mode tanpa internet |
| 14 | Mobile Lapangan | 5 | Polish & Deployment | Rilis ke tim lapangan |
| 15 | Web Admin | 6 | Legal & Perizinan | Repositori dokumen + tracker |
| 16 | Customer Portal | 1 | Fondasi & Login | Auth pembeli + beranda |
| 17 | Customer Portal | 2 | Progres Unit | Pantau konstruksi + foto |
| 18 | Customer Portal | 3 | Tagihan & Pembayaran | Self-service keuangan |
| 19 | Customer Portal | 4 | Dokumen & Legal | Arsip digital pembeli |
| 20 | Customer Portal | 5 | Komplain & Komunikasi | Tiket + FAQ |
| 21 | Customer Portal | 6 | Polish & Mobile | React Native + PWA |
| 22 | Web Admin | 7 | Polish & Integrasi | Koneksi semua modul + deploy |

---

## Detail Per Tahap

---

### Step 1 — Web Admin: Fondasi & Auth

**Tujuan**: Membangun kerangka aplikasi utama, sistem login, dan dashboard dasar sebagai pondasi semua modul.

**Pekerjaan**:

1. Setup Proyek
   - [ ] Inisialisasi Next.js dengan TypeScript
   - [ ] Setup Tailwind CSS + komponen UI (shadcn/ui)
   - [ ] Konfigurasi struktur folder: `/app`, `/components`, `/lib`, `/hooks`, `/types`
   - [ ] Setup environment variables
   - [ ] Setup Git + branching strategy

2. Layout & Navigasi Utama
   - [ ] Sidebar — menu navigasi modul (collapsible)
   - [ ] Header — nama user, notifikasi, avatar + dropdown logout
   - [ ] MainLayout — wrapper halaman setelah login
   - [ ] AuthLayout — wrapper halaman login
   - [ ] Responsif sidebar: hamburger menu/sheet di layar kecil

3. Autentikasi
   - [ ] Halaman Login (`/login`) — email + password
   - [ ] Validasi form login
   - [ ] Panggil API login, terima JWT token
   - [ ] Simpan token di httpOnly cookie / localStorage
   - [ ] Guard route — redirect ke login jika belum login
   - [ ] Halaman lupa password (`/lupa-password`)
   - [ ] Logout — hapus token + redirect ke login

4. Role-Based Access Control (RBAC)
   - [ ] Baca role dari token JWT setelah login
   - [ ] Sembunyikan menu sidebar berdasarkan role
   - [ ] Guard per halaman/modul berdasarkan role
   - [ ] 8 role: direktur, manajer_sales, tim_sales, manajer_finance, admin_finance, manajer_proyek, site_engineer, admin_legal

5. Dashboard Utama (`/dashboard`)
   - [ ] Kartu ringkasan: unit terjual, pendapatan bulan ini, leads baru, proyek berjalan
   - [ ] Grafik tren penjualan bulanan
   - [ ] Tampilan disesuaikan per role
   - [ ] Komponen StatCard reusable

**Checklist Selesai**:
- [ ] Login & logout berfungsi
- [ ] RBAC bekerja — menu berbeda per role
- [ ] Dashboard tampil dengan data placeholder
- [ ] Guard route aktif

---

### Step 2 — Web Admin: CRM & Sales

**Tujuan**: Membangun pipeline penjualan digital menggantikan pencatatan manual.

**Pekerjaan**:

1. Manajemen Leads (`/crm/leads`)
   - [ ] Tabel daftar leads (nama, HP, sumber, status, tanggal masuk)
   - [ ] Filter: status, sumber, range tanggal, sales yang handle
   - [ ] Search leads by nama / nomor HP
   - [ ] Form tambah leads manual
   - [ ] Detail leads — histori semua interaksi
   - [ ] Update status leads: baru, follow-up, survey, negosiasi, booking
   - [ ] Assign leads ke sales tertentu
   - [ ] Sumber leads otomatis dari Website Marketing

2. Pipeline Kanban (`/crm/pipeline`)
   - [ ] Board kanban 6 kolom: Leads, Follow-up, Survey, Negosiasi, Booking, SPK
   - [ ] Drag & drop pindah kolom
   - [ ] Kartu leads: nama, tipe unit minat, telepon, sales PIC
   - [ ] Klik kartu ke detail leads

3. Manajemen Unit (`/crm/unit`)
   - [ ] Daftar semua unit: nomor unit, tipe, luas, harga, status
   - [ ] Status unit: Tersedia / Booked / Terjual / Indent
   - [ ] Filter per blok/cluster
   - [ ] Denah kavling (site plan) interaktif — warna per status
   - [ ] Form edit harga per unit

4. Transaksi Penjualan (`/crm/transaksi`)
   - [ ] Form booking unit: pilih leads, pilih unit, input tanda jadi
   - [ ] Form SPK: upload dokumen SPK
   - [ ] Skema pembayaran: KPR / tunai / tunai bertahap
   - [ ] Input status KPR: pengajuan, proses, disetujui, akad
   - [ ] Histori transaksi per unit

5. Aktivitas Sales (`/crm/aktivitas`)
   - [ ] Log semua aktivitas: telpon, kunjungan, WA, email
   - [ ] Jadwal follow-up — reminder otomatis
   - [ ] Kalender sales

**Checklist Selesai**:
- [ ] Leads bisa ditambah & status diupdate
- [ ] Pipeline kanban drag & drop berfungsi
- [ ] Status unit berubah saat booking/terjual
- [ ] Histori transaksi tercatat

---

### Step 3 — Website Marketing: Landing Page

**Tujuan**: Membangun halaman utama perumahan agar calon pembeli mendapat kesan pertama yang baik. Ini adalah output pertama yang bisa langsung ditunjukkan ke mitra.

**Pekerjaan**:

1. Setup Proyek
   - [ ] Inisialisasi proyek Next.js (repo terpisah dari Web Admin)
   - [ ] Setup Tailwind CSS — tema warna perumahan
   - [ ] Struktur folder: `/components`, `/pages`, `/public`, `/styles`
   - [ ] Konfigurasi font
   - [ ] Setup Git repository

2. Komponen Dasar
   - [ ] Navbar — logo, menu navigasi, tombol "Hubungi Kami"
   - [ ] Footer — info kontak, media sosial, copyright
   - [ ] Button — komponen tombol reusable
   - [ ] SectionWrapper — container layout konsisten antar section

3. Halaman Utama (`/`)
   - [ ] Hero Section — gambar perumahan, tagline, tombol CTA
   - [ ] Keunggulan — 3-5 poin keunggulan perumahan
   - [ ] Preview Tipe Rumah — 3 kartu unit unggulan dengan foto
   - [ ] Lokasi Strategis — embed Google Maps + poin keunggulan lokasi
   - [ ] Testimoni — slider testimoni pembeli
   - [ ] CTA Banner — ajakan hubungi sales / daftar sekarang

**Checklist Selesai**:
- [ ] Halaman utama dapat diakses di browser
- [ ] Tampilan responsif di mobile, tablet, desktop
- [ ] Navbar & footer berfungsi normal

---

### Step 4 — Website Marketing: Produk & Galeri

**Tujuan**: Menampilkan semua detail produk perumahan agar calon pembeli dapat membandingkan dan memilih unit.

**Pekerjaan**:

1. Halaman Tipe Rumah (`/tipe-rumah`)
   - [ ] Halaman daftar semua tipe unit (grid/list view)
   - [ ] Kartu unit: foto, nama tipe, luas tanah, luas bangunan, harga
   - [ ] Filter/sort: harga, tipe, status ketersediaan
   - [ ] Badge status unit: Tersedia / Indent / Terjual

2. Halaman Detail Unit (`/tipe-rumah/[slug]`)
   - [ ] Galeri foto multi-gambar (lightbox / carousel)
   - [ ] Spesifikasi teknis: luas, kamar tidur, kamar mandi, carport
   - [ ] Denah rumah (floor plan)
   - [ ] Fasilitas yang tersedia
   - [ ] Tombol: "Jadwalkan Survey", "Hubungi Sales via WhatsApp"

3. Halaman Galeri (`/galeri`)
   - [ ] Grid foto lingkungan perumahan
   - [ ] Kategori: eksterior, interior, fasilitas, progres
   - [ ] Lightbox zoom foto

4. Halaman Fasilitas (`/fasilitas`)
   - [ ] Daftar fasilitas (taman, masjid, CCTV, dll.)
   - [ ] Foto + keterangan tiap fasilitas

5. Halaman Lokasi (`/lokasi`)
   - [ ] Embed Google Maps interaktif
   - [ ] Jarak ke titik penting: sekolah, RS, mall, tol
   - [ ] Tombol "Buka di Google Maps"

**Checklist Selesai**:
- [ ] Semua tipe unit tampil dengan foto
- [ ] Detail unit lengkap dan responsif
- [ ] Galeri berfungsi dengan lightbox
- [ ] Filter tipe unit bekerja

---

### Step 5 — Web Admin: Keuangan & Cashflow

**Tujuan**: Menggantikan pencatatan keuangan manual dengan sistem terpusat yang bisa dipantau real-time.

**Pekerjaan**:

1. Tagihan & Piutang (`/keuangan/tagihan`)
   - [ ] Daftar tagihan pembeli (cicilan DP, angsuran, IPL)
   - [ ] Status tagihan: Belum Bayar / Lunas / Terlambat
   - [ ] Generate tagihan otomatis berdasarkan jadwal
   - [ ] Upload bukti pembayaran
   - [ ] Konfirmasi pembayaran oleh admin

2. Pengeluaran (`/keuangan/pengeluaran`)
   - [ ] Form catat pengeluaran: kategori, nominal, tanggal, keterangan
   - [ ] Kategori: material, kontraktor, marketing, perizinan, operasional
   - [ ] Upload bukti (foto bon/faktur)
   - [ ] Daftar pengeluaran + filter

3. Cashflow (`/keuangan/cashflow`)
   - [ ] Grafik cashflow: pemasukan vs pengeluaran per bulan
   - [ ] Proyeksi cashflow ke depan
   - [ ] Alert zona merah (cashflow negatif)
   - [ ] Tabel perincian per bulan

4. RAB & Realisasi (`/keuangan/rab`)
   - [ ] Input anggaran per pos biaya
   - [ ] Perbandingan RAB vs realisasi aktual
   - [ ] Progress bar penggunaan anggaran per pos
   - [ ] Alert jika realisasi mendekati/melewati anggaran

5. Laporan Keuangan (`/keuangan/laporan`)
   - [ ] Laporan laba rugi per periode
   - [ ] Laporan per proyek
   - [ ] Export ke PDF / Excel

**Checklist Selesai**:
- [ ] Pemasukan & pengeluaran dapat dicatat
- [ ] Grafik cashflow tampil dengan data nyata
- [ ] RAB vs realisasi dapat dipantau
- [ ] Export laporan berfungsi

---

### Step 6 — Website Marketing: Formulir & Simulasi

**Tujuan**: Mengkonversi pengunjung menjadi leads yang masuk ke CRM dan membantu calon pembeli menghitung kemampuan KPR.

**Pekerjaan**:

1. Form Leads
   - [ ] Form: Nama, No. HP, email, tipe unit diminati, pesan
   - [ ] Validasi input (required, format email, format HP)
   - [ ] Submit form ke API CRM
   - [ ] Pesan sukses setelah submit
   - [ ] Anti-spam (honeypot / rate limit)

2. Kalkulator Simulasi KPR (`/simulasi-kpr`)
   - [ ] Input: harga properti, DP (%), tenor (tahun), suku bunga (%)
   - [ ] Output: jumlah DP, sisa pinjaman, cicilan per bulan
   - [ ] Tabel angsuran per tahun (opsional)
   - [ ] Tombol "Konsultasikan ke Sales"

3. Halaman Kontak (`/kontak`)
   - [ ] Alamat kantor pemasaran + peta
   - [ ] Jam operasional
   - [ ] Nomor telepon, WA, email
   - [ ] Form kontak langsung
   - [ ] Tombol WhatsApp floating (sticky di semua halaman)

4. Halaman Promo (`/promo`) — opsional
   - [ ] Daftar promo aktif
   - [ ] Konten promo dengan batas waktu

**Checklist Selesai**:
- [ ] Form leads tersubmit dan data tersimpan
- [ ] Kalkulator KPR menghitung dengan benar
- [ ] Tombol WhatsApp floating muncul di semua halaman

---

### Step 7 — Website Marketing: Optimasi & Polish

**Tujuan**: Memastikan website cepat, mudah ditemukan di Google, dan tampil profesional.

**Pekerjaan**:

1. SEO & Meta
   - [ ] Title dan meta description unik per halaman
   - [ ] Open Graph tags (preview saat dibagikan di WA/sosmed)
   - [ ] sitemap.xml otomatis
   - [ ] robots.txt
   - [ ] Alt text semua gambar

2. Performa
   - [ ] Optimasi gambar (Next.js Image, WebP)
   - [ ] Lazy loading gambar di galeri
   - [ ] Minimize bundle size
   - [ ] Target PageSpeed: >= 80 (mobile), >= 90 (desktop)

3. UI/UX Polish
   - [ ] Animasi scroll (fade-in section)
   - [ ] Loading skeleton
   - [ ] Error handling 404
   - [ ] Favicon & app icon

4. Deployment
   - [ ] Konfigurasi domain
   - [ ] Deploy ke Vercel / server production
   - [ ] Setup HTTPS/SSL
   - [ ] Uji lintas browser & berbagai ukuran layar

5. Analytics
   - [ ] Google Analytics 4
   - [ ] Event tracking: klik CTA, submit form, klik WA
   - [ ] Google Tag Manager (opsional)

**Checklist Selesai**:
- [ ] PageSpeed score memenuhi target
- [ ] Website live di domain
- [ ] SEO dasar terpasang
- [ ] Analytics melacak pengunjung

**-- Website Marketing selesai di titik ini --**

---

### Step 8 — Web Admin: Monitoring Milestone

**Tujuan**: Memantau progres konstruksi per unit dari kantor, menerima laporan dari Site Engineer, dan memverifikasi sebelum pembayaran termin.

**Pekerjaan**:

1. Daftar Proyek (`/proyek`)
   - [ ] Kartu/list semua proyek aktif
   - [ ] Ringkasan per proyek: total unit, % milestone selesai, jumlah kontraktor
   - [ ] Buat proyek baru + input daftar kontraktor

2. Dashboard Progres Unit (`/proyek/[id]/unit`)
   - [ ] Grid semua unit dalam proyek
   - [ ] Progress bar per unit (% milestone selesai)
   - [ ] Status warna: hijau (on track), kuning (mendekati telat), merah (terlambat)
   - [ ] Klik unit ke detail milestone

3. Manajemen Milestone (`/proyek/[id]/milestone`)
   - [ ] Daftar milestone standar per unit: Pondasi, Struktur, Dinding, Atap, Finishing
   - [ ] Status: Belum Mulai / Sedang / Selesai
   - [ ] Foto bukti milestone dari Site Engineer (via Mobile App)
   - [ ] Tanggal target vs tanggal aktual
   - [ ] Alert jika milestone melebihi target

4. Laporan Kendala (`/proyek/[id]/kendala`)
   - [ ] Daftar laporan kendala dari Site Engineer
   - [ ] Kategori: pekerjaan tidak sesuai spek, jadwal molor, cuaca
   - [ ] Status penanganan: Baru / Ditindaklanjuti / Selesai
   - [ ] Assign tindak lanjut ke pihak terkait

5. Tim Lapangan (`/proyek/[id]/tim`)
   - [ ] Daftar Site Engineer per proyek
   - [ ] Assign Site Engineer ke blok/unit tertentu

**Checklist Selesai**:
- [ ] Milestone per unit tampil dengan status dan foto
- [ ] Alert keterlambatan berfungsi
- [ ] Laporan kendala dapat ditindaklanjuti

---

### Step 9 — Mobile Lapangan: Setup & Login

**Tujuan**: Membangun fondasi aplikasi mobile dan sistem login untuk 2 role tim internal.

**Pekerjaan**:

1. Setup Proyek React Native
   - [ ] Inisialisasi proyek dengan Expo
   - [ ] Setup navigasi: React Navigation (Stack + Bottom Tab)
   - [ ] Konfigurasi NativeWind atau StyleSheet
   - [ ] Setup environment variables (API URL)
   - [ ] Konfigurasi ikon aplikasi & splash screen
   - [ ] Setup Git repository

2. Autentikasi
   - [ ] Halaman Login — email + password
   - [ ] Simpan token JWT di SecureStore
   - [ ] Auto-login jika token masih valid
   - [ ] Logout

3. Pembatasan Akses per Role
   - [ ] Tampilkan menu sesuai role:
     - Site Engineer: Update Milestone, Upload Foto, Laporan Kendala, Unit yang ditugaskan
     - Manajer Proyek: Semua unit, semua proyek, approve BA termin
   - [ ] Halaman unauthorized jika akses menu yang tidak diizinkan

4. Halaman Beranda (Home Tab)
   - [ ] Sambutan + nama pengguna + jabatan
   - [ ] Kartu ringkasan: proyek aktif yang ditugaskan
   - [ ] Shortcut aksi cepat: Update Milestone, Kamera, Laporan Kendala
   - [ ] Milestone mendekati deadline — ditampilkan sebagai alert

**Checklist Selesai**:
- [ ] Login dengan 2 role berbeda menghasilkan menu berbeda
- [ ] Auto-login berfungsi setelah restart app
- [ ] Beranda tampil info proyek yang relevan

---

### Step 10 — Mobile Lapangan: Update Milestone & Foto

**Tujuan**: Memudahkan Site Engineer melaporkan selesainya milestone konstruksi dengan foto bukti langsung dari lapangan.

**Pekerjaan**:

1. Pilih Unit & Milestone
   - [ ] Daftar proyek yang ditugaskan ke Site Engineer
   - [ ] Pilih proyek lalu list semua unit
   - [ ] Klik unit untuk daftar milestone
   - [ ] Status tiap milestone: Belum Mulai / Sedang / Selesai

2. Update Status Milestone
   - [ ] Tombol "Tandai Selesai" per milestone
   - [ ] Konfirmasi dialog sebelum disimpan
   - [ ] Input catatan opsional
   - [ ] Status berubah otomatis di Web Admin & Customer Portal

3. Upload Foto Milestone
   - [ ] Ambil foto dari kamera langsung
   - [ ] Pilih foto dari galeri (multi-pilih, maks. 5 foto)
   - [ ] Preview foto sebelum upload
   - [ ] Kompresi otomatis (maks. 1MB per foto)
   - [ ] Foto terhubung ke milestone yang dipilih

4. Riwayat Update Milestone
   - [ ] Daftar semua update yang pernah dikirim (urut terbaru)
   - [ ] Status: Terkirim / Gagal Kirim
   - [ ] Klik untuk lihat detail + foto
   - [ ] Kirim ulang jika gagal

**Checklist Selesai**:
- [ ] Milestone bisa diupdate status dari HP
- [ ] Foto bisa diambil dari kamera dan terupload
- [ ] Update langsung tampil di Web Admin & Customer Portal

---

### Step 11 — Mobile Lapangan: Unit & Kendala

**Tujuan**: Memberikan visibilitas penuh atas semua unit dan saluran pelaporan masalah yang terstruktur.

**Pekerjaan**:

1. Daftar Unit
   - [ ] List semua unit dalam proyek yang ditugaskan
   - [ ] Progress bar per unit
   - [ ] Status unit: Belum Mulai / Sedang Dibangun / Selesai
   - [ ] Filter per blok/cluster
   - [ ] Search unit by nomor

2. Detail Unit
   - [ ] Daftar semua milestone + status
   - [ ] Tombol update milestone (shortcut ke Step 10)
   - [ ] Galeri semua foto — timeline dari awal hingga terkini
   - [ ] Swipe horizontal antar foto

3. Laporan Kendala
   - [ ] Form laporan masalah kontraktor / kondisi lapangan
   - [ ] Kategori: Kualitas Pekerjaan / Jadwal Molor / Cuaca / Akses Lokasi / Lainnya
   - [ ] Tingkat urgensi: Rendah / Sedang / Tinggi / Kritis
   - [ ] Foto kendala (kamera atau galeri)
   - [ ] Deskripsi masalah + rekomendasi solusi
   - [ ] Submit lalu notifikasi masuk ke Manajer Proyek

4. Daftar Kendala
   - [ ] Semua laporan kendala yang pernah dibuat
   - [ ] Status: Baru / Sedang Ditangani / Selesai
   - [ ] Balasan dari Manajer Proyek
   - [ ] (Manajer Proyek) Update status kendala

**Checklist Selesai**:
- [ ] Semua unit tampil dengan persentase milestone
- [ ] Galeri foto per unit berfungsi
- [ ] Laporan kendala terkirim dan memicu notifikasi

---

### Step 12 — Web Admin: Pengeluaran & Vendor

**Tujuan**: Mengelola pembayaran termin ke kontraktor dengan approval berjenjang dan verifikasi milestone.

**Pekerjaan**:

1. Manajemen Kontraktor & Vendor (`/vendor`)
   - [ ] Daftar kontraktor: nama, kontak, jenis pekerjaan
   - [ ] Detail per kontraktor: proyek, rekam jejak
   - [ ] Form tambah kontraktor baru
   - [ ] Upload kontrak digital per proyek

2. Pengajuan Tagihan Termin (`/vendor/tagihan`)
   - [ ] Form input tagihan termin dari kontraktor
   - [ ] Pilih proyek, kontraktor, milestone yang diklaim selesai, nilai tagihan
   - [ ] Cek otomatis: apakah milestone terkait sudah ditandai selesai?
   - [ ] Status: Menunggu Verifikasi, Disetujui, Dibayar

3. Workflow Approval (`/vendor/approval`)
   - [ ] Notifikasi ke approver saat tagihan masuk
   - [ ] Halaman daftar tagihan menunggu approval
   - [ ] Tombol Setujui / Tolak + alasan
   - [ ] Aturan: < Rp 50 juta oleh Manajer Finance, >= Rp 50 juta oleh Direktur
   - [ ] Histori approval + timestamp

4. Berita Acara Termin (`/vendor/ba`)
   - [ ] BA digenerate otomatis setelah approval
   - [ ] Isi: nama proyek, kontraktor, milestone, nilai, tanggal
   - [ ] Download PDF Berita Acara
   - [ ] Daftar semua BA per proyek

5. RAB vs Realisasi (`/vendor/rab`)
   - [ ] Input anggaran per pos biaya konstruksi
   - [ ] Pembayaran termin otomatis mengurangi saldo anggaran
   - [ ] Grafik: anggaran tersisa vs progres milestone
   - [ ] Alert jika mendekati/melewati batas RAB

**Checklist Selesai**:
- [ ] Alur tagihan, verifikasi, approval, BA berfungsi
- [ ] Tagihan hanya disetujui jika milestone sudah selesai
- [ ] BA PDF dapat diunduh
- [ ] RAB vs realisasi terpantau

---

### Step 13 — Mobile Lapangan: Notifikasi & Offline

**Tujuan**: Memastikan tim lapangan tetap menerima informasi penting dan bisa bekerja meskipun sinyal lemah.

**Pekerjaan**:

1. Push Notification
   - [ ] Setup Firebase Cloud Messaging (FCM)
   - [ ] Notifikasi untuk: milestone mendekati deadline, kendala direspons, tagihan termin disetujui/ditolak, pesan dari manajer
   - [ ] Halaman riwayat notifikasi
   - [ ] Mark as read

2. Offline Mode
   - [ ] Simpan update milestone yang belum terkirim ke antrian lokal (AsyncStorage)
   - [ ] Banner indikator offline
   - [ ] Auto sync saat koneksi pulih
   - [ ] Foto tersimpan lokal dulu, upload saat ada koneksi
   - [ ] Cache daftar unit & milestone agar bisa dibaca offline

3. Sinkronisasi
   - [ ] Pull-to-refresh di semua halaman daftar
   - [ ] Indikator loading saat sinkronisasi
   - [ ] Konfirmasi sukses saat data berhasil sinkron

**Checklist Selesai**:
- [ ] Push notification diterima oleh HP
- [ ] Update tersimpan lokal saat offline dan terkirim saat online
- [ ] Tidak ada data yang hilang karena masalah koneksi

---

### Step 14 — Mobile Lapangan: Polish & Deployment

**Tujuan**: Memoles tampilan dan mendistribusikan aplikasi ke tim lapangan.

**Pekerjaan**:

1. UI/UX Polish
   - [ ] Ukuran tombol minimal 44px tap target
   - [ ] Feedback haptic saat submit/update berhasil
   - [ ] Loading state (spinner) saat upload / submit
   - [ ] Empty state saat belum ada data
   - [ ] Konfirmasi dialog sebelum aksi penting
   - [ ] Error message dalam Bahasa Indonesia
   - [ ] Tampilan adaptif untuk HP 5" hingga 6.7"

2. Optimasi Foto
   - [ ] Kompresi otomatis sebelum upload (maks. 1MB)
   - [ ] Upload multi-foto paralel dengan progress bar
   - [ ] Retry otomatis jika gagal

3. Keamanan
   - [ ] Login biometrik (fingerprint / face ID)
   - [ ] Auto-lock setelah 15 menit tidak aktif
   - [ ] Token refresh otomatis

4. Pengujian
   - [ ] Uji di Android 9+
   - [ ] Uji di iOS 14+
   - [ ] Uji kondisi jaringan lambat (3G)
   - [ ] Uji offline mode
   - [ ] Bug fix

5. Deployment
   - [ ] Build APK/AAB untuk Android
   - [ ] Build IPA untuk iOS
   - [ ] Distribusi internal: APK langsung (Android) / TestFlight (iOS)
   - [ ] Panduan instalasi untuk tim lapangan

**Checklist Selesai**:
- [ ] Semua tombol nyaman disentuh
- [ ] Foto terkompresi dan terupload lancar
- [ ] App stabil di Android & iOS
- [ ] Tim lapangan sudah install dan login

**-- Mobile Lapangan selesai di titik ini --**

---

### Step 15 — Web Admin: Legal & Perizinan

**Tujuan**: Repositori digital semua dokumen legal dan pengingat sebelum izin kedaluwarsa.

**Pekerjaan**:

1. Repositori Dokumen (`/legal/dokumen`)
   - [ ] Upload dan kategorisasi dokumen legal
   - [ ] Kategori: izin proyek (IMB/PBG, SHGB), dokumen pembeli (AJB, SHM), kontrak
   - [ ] Preview dokumen PDF langsung di browser
   - [ ] Download dokumen

2. Tracker Perizinan (`/legal/perizinan`)
   - [ ] Daftar semua izin: nama, nomor, tanggal terbit, tanggal expired
   - [ ] Status: Aktif / Akan Kedaluwarsa / Kadaluarsa
   - [ ] Progress pengajuan izin baru: Persiapan, Pengajuan, Proses, Terbit
   - [ ] Catatan per izin

3. Monitoring Kadaluarsa (`/legal/monitoring`)
   - [ ] Kalender izin yang akan berakhir
   - [ ] Daftar: < 90 hari, < 30 hari, < 7 hari
   - [ ] Badge warna berdasarkan urgensi

4. Dokumen Pembeli
   - [ ] Upload AJB, SHM, BPHTB per unit
   - [ ] Status serah terima dokumen ke pembeli
   - [ ] Link ke Customer Portal (pembeli bisa unduh)

**Checklist Selesai**:
- [ ] Dokumen bisa diupload & dipreview
- [ ] Status kadaluarsa izin tampil dengan warna
- [ ] Monitoring kadaluarsa berfungsi

---

### Step 16 — Customer Portal: Fondasi & Login

**Tujuan**: Membangun kerangka portal dan sistem login khusus pembeli.

**Pekerjaan**:

1. Setup Proyek Web
   - [ ] Inisialisasi Next.js (repo terpisah)
   - [ ] Setup Tailwind CSS — tema warna perumahan
   - [ ] Struktur folder: `/app`, `/components`, `/lib`, `/styles`
   - [ ] Setup environment variables

2. Layout Utama
   - [ ] Navbar — logo developer, nama proyek, notifikasi, avatar pembeli
   - [ ] Footer — kontak developer, tautan bantuan
   - [ ] BottomNav (versi mobile) — tab: Beranda, Progres, Tagihan, Dokumen, Bantuan
   - [ ] PortalLayout — wrapper setelah login

3. Autentikasi
   - [ ] Halaman Login — email + password
   - [ ] Halaman pertama kali masuk — ganti password sementara
   - [ ] Forgot password
   - [ ] Guard route — pembeli hanya akses data unit miliknya
   - [ ] Logout

4. Halaman Beranda (`/`)
   - [ ] Sambutan dengan nama pembeli
   - [ ] Ringkasan unit: nama, blok, tipe, status konstruksi
   - [ ] Kartu cepat: progres %, tagihan berikutnya, notifikasi terbaru
   - [ ] Kontak darurat developer

**Checklist Selesai**:
- [ ] Pembeli bisa login dan logout
- [ ] Beranda tampil dengan info unit
- [ ] Pembeli tidak bisa akses unit milik orang lain
- [ ] Responsif di desktop & mobile

---

### Step 17 — Customer Portal: Progres Unit

**Tujuan**: Transparansi penuh kepada pembeli tentang status konstruksi rumah mereka.

**Pekerjaan**:

1. Halaman Progres (`/progres`)
   - [ ] Progress bar besar — persentase total konstruksi
   - [ ] Breakdown per tahap: Pondasi, Struktur, Dinding, Atap, Finishing
   - [ ] Status tiap tahap: Belum Mulai / Sedang Berjalan / Selesai
   - [ ] Estimasi selesai

2. Galeri Foto Progres
   - [ ] Timeline foto — urut dari terbaru
   - [ ] Setiap foto: tanggal, keterangan tahap
   - [ ] Lightbox zoom
   - [ ] Foto bersumber dari laporan Mobile App

3. Milestone Unit
   - [ ] Daftar tonggak penting: mulai bangun hingga serah terima
   - [ ] Tanggal target vs tanggal aktual
   - [ ] Status: Akan Datang / Selesai / Terlambat

4. Info Proyek
   - [ ] Nama proyek & pengembang
   - [ ] Alamat & nomor unit
   - [ ] Tipe & spesifikasi rumah
   - [ ] Nama manajer proyek + kontak

**Checklist Selesai**:
- [ ] Progres tampil dengan persentase akurat
- [ ] Foto terkini dari lapangan muncul
- [ ] Data sinkron dengan yang diinput tim proyek

---

### Step 18 — Customer Portal: Tagihan & Pembayaran

**Tujuan**: Kemudahan untuk pembeli memantau dan mengelola kewajiban pembayaran tanpa menghubungi admin.

**Pekerjaan**:

1. Ringkasan Keuangan (`/tagihan`)
   - [ ] Kartu: total harga unit, total sudah dibayar, sisa kewajiban
   - [ ] Skema pembayaran aktif
   - [ ] Info cicilan KPR: bank, tanggal akad, besaran per bulan

2. Tagihan Aktif
   - [ ] Daftar tagihan belum dibayar
   - [ ] Detail: jenis, jumlah, jatuh tempo
   - [ ] Badge: Belum Bayar / Jatuh Tempo / Terlambat
   - [ ] Tombol "Bayar Sekarang" (link ke VA / payment gateway)

3. Riwayat Pembayaran
   - [ ] Daftar semua transaksi yang sudah dibayar
   - [ ] Status: Lunas / Dikonfirmasi / Menunggu Verifikasi
   - [ ] Unduh bukti pembayaran / kwitansi digital

4. Upload Bukti Pembayaran Manual
   - [ ] Form upload foto bukti transfer
   - [ ] Pilih tagihan yang dibayar
   - [ ] Status: Menunggu Konfirmasi Admin
   - [ ] Notifikasi setelah dikonfirmasi

**Checklist Selesai**:
- [ ] Tagihan aktif & riwayat pembayaran tampil
- [ ] Pembeli bisa upload bukti bayar
- [ ] Status terupdate setelah dikonfirmasi admin
- [ ] Kwitansi digital bisa diunduh

---

### Step 19 — Customer Portal: Dokumen & Legal

**Tujuan**: Gudang digital semua dokumen penting unit pembeli.

**Pekerjaan**:

1. Halaman Dokumen (`/dokumen`)
   - [ ] Daftar dokumen yang bisa diunduh
   - [ ] Kategori: Pra-pembelian (SPK, Brosur), Transaksi (AJB, Kwitansi DP), Kepemilikan (SHM, IMB/PBG), Serah Terima (BA, Garansi)

2. Status Dokumen
   - [ ] Status per dokumen: Tersedia / Sedang Diproses / Belum Tersedia
   - [ ] Keterangan kenapa belum tersedia

3. Unduh Dokumen
   - [ ] Tombol unduh PDF
   - [ ] Preview PDF langsung di browser
   - [ ] Log waktu unduh (audit trail)

4. Informasi Serah Terima
   - [ ] Tanggal rencana serah terima
   - [ ] Checklist yang harus diselesaikan pembeli
   - [ ] Status kesiapan serah terima

**Checklist Selesai**:
- [ ] Dokumen terdaftar dengan status yang benar
- [ ] Unduhan berfungsi
- [ ] Preview PDF bisa dibuka

---

### Step 20 — Customer Portal: Komplain & Komunikasi

**Tujuan**: Saluran resmi bagi pembeli untuk keluhan atau pertanyaan, menggantikan WA/telepon yang tidak terstruktur.

**Pekerjaan**:

1. Formulir Komplain (`/bantuan/komplain`)
   - [ ] Pilih kategori: Progres / Kualitas / Dokumen / Tagihan / Lainnya
   - [ ] Kolom deskripsi masalah
   - [ ] Upload foto (jika ada kerusakan)
   - [ ] Submit dan tiket dibuat dengan nomor tiket

2. Daftar Tiket (`/bantuan/tiket`)
   - [ ] Semua tiket yang pernah diajukan
   - [ ] Status: Baru / Sedang Ditangani / Selesai / Ditutup
   - [ ] Detail tiket: deskripsi, foto, riwayat balasan

3. Thread Percakapan per Tiket
   - [ ] Chat-style thread antara pembeli & tim developer
   - [ ] Pembeli bisa tambah balasan / info tambahan
   - [ ] Notifikasi saat ada balasan

4. FAQ (`/bantuan/faq`)
   - [ ] Daftar pertanyaan yang sering ditanya
   - [ ] Kategori: serah terima, pembayaran, sertifikat

5. Kontak Langsung
   - [ ] Tombol WA developer
   - [ ] Nomor telepon kantor
   - [ ] Jam operasional

**Checklist Selesai**:
- [ ] Pembeli bisa submit komplain + upload foto
- [ ] Nomor tiket tergenerate
- [ ] Thread percakapan berfungsi

---

### Step 21 — Customer Portal: Polish & Mobile

**Tujuan**: Memoles web dan membangun versi mobile (React Native) dengan fitur yang sama.

**Pekerjaan**:

1. Web Polish
   - [ ] Animasi transisi antar halaman
   - [ ] Loading skeleton di semua section
   - [ ] Empty state (saat belum ada data)
   - [ ] Responsif sempurna di semua ukuran HP
   - [ ] PWA — bisa diinstall dari browser

2. Setup React Native
   - [ ] Inisialisasi proyek (Expo)
   - [ ] Navigasi: Bottom Tab + Stack Navigator
   - [ ] Konfigurasi environment
   - [ ] Setup ikon & splash screen

3. Portasi Fitur ke Mobile
   - [ ] Beranda
   - [ ] Progres unit — progress bar + galeri foto (full screen swipe)
   - [ ] Tagihan — daftar + upload foto bukti bayar via kamera
   - [ ] Dokumen — daftar + unduh + share
   - [ ] Komplain — form submit + foto dari kamera
   - [ ] Tiket — list & thread

4. Fitur Khusus Mobile
   - [ ] Push notification (FCM) — tagihan jatuh tempo, balasan tiket, update progres
   - [ ] Biometrik login (Face ID / Fingerprint)
   - [ ] Ambil foto dari kamera untuk bukti bayar / komplain

5. Deployment Mobile
   - [ ] Build APK untuk testing
   - [ ] Build IPA untuk testing
   - [ ] Submit ke Play Store + App Store (jika diperlukan)

**Checklist Selesai**:
- [ ] Web portal responsif sempurna
- [ ] App mobile bisa diinstall di Android & iOS
- [ ] Push notification berfungsi
- [ ] Semua fitur web tersedia di mobile

**-- Customer Portal selesai di titik ini --**

---

### Step 22 — Web Admin: Polish & Integrasi

**Tujuan**: Menyatukan semua modul, memastikan data mengalir antar modul, dan memoles UI/UX sebelum go-live.

**Pekerjaan**:

1. Notifikasi In-App
   - [ ] Bell notifikasi di header
   - [ ] Kondisi: leads baru, approval tagihan menunggu, milestone terlambat, tagihan jatuh tempo, izin akan kadaluarsa
   - [ ] Mark as read / mark all as read
   - [ ] Halaman riwayat notifikasi

2. Konektivitas Antar Modul
   - [ ] Unit terjual di CRM -> otomatis update modul Keuangan
   - [ ] Data pembeli di CRM -> membuat akun Customer Portal
   - [ ] Termin disetujui di Vendor -> tercatat sebagai pengeluaran di Keuangan
   - [ ] Milestone selesai di Mobile -> tampil di Web Admin, Customer Portal, & unlock termin

3. UI/UX Polish
   - [ ] Loading state (skeleton) di semua tabel & halaman
   - [ ] Empty state dengan ilustrasi (saat data kosong)
   - [ ] Error handling & pesan feedback yang jelas
   - [ ] Konfirmasi sebelum aksi penting (hapus, setujui, tolak)
   - [ ] Tooltip untuk label yang tidak jelas

4. Pengujian
   - [ ] Uji semua fitur di semua role
   - [ ] Uji responsivitas (1366px, 1920px)
   - [ ] Uji performa dengan banyak data
   - [ ] Bug fix

5. Deployment
   - [ ] Build production
   - [ ] Deploy ke server
   - [ ] Setup domain + HTTPS

**Checklist Selesai**:
- [ ] Semua modul terhubung dan data mengalir
- [ ] Notifikasi berfungsi untuk semua kondisi
- [ ] Tidak ada bug kritis
- [ ] Web Admin live di server production

**-- Seluruh frontend SIMDP selesai --**

---

## Diagram Alur Data Antar Aplikasi

```
                         Calon Pembeli
                              |
                              v
                    +-------------------+
                    | Website Marketing |
                    | (Next.js - Publik)|
                    +--------+----------+
                             |
                        Form Leads
                             |
                             v
                    +-------------------+           +--------------------+
                    |    Web Admin      |<--------->| Mobile Lapangan    |
                    |  (Next.js - RBAC) |  Milestone| (React Native)     |
                    |                   |  + Foto   |                    |
                    | - CRM & Sales     |           | - Update Milestone |
                    | - Keuangan        |           | - Upload Foto      |
                    | - Monitoring      |  Kendala  | - Laporan Kendala  |
                    | - Vendor          |<--------->|                    |
                    | - Legal           |           +--------------------+
                    +--------+----------+                  |
                             |                        Site Engineer
                        Data Pembeli               Manajer Proyek
                        + Progres
                        + Tagihan
                             |
                             v
                    +-------------------+
                    | Customer Portal   |
                    | (Next.js + RN)    |
                    |                   |
                    | - Progres Unit    |
                    | - Tagihan         |
                    | - Dokumen         |
                    | - Komplain        |
                    +-------------------+
                             |
                          Pembeli
```

---

## Ringkasan Statistik

| Aplikasi | Fase | Halaman/Screen | Teknologi |
|----------|:----:|:--------------:|-----------|
| Web Admin | 7 | 26 halaman | Next.js |
| Website Marketing | 4 | 15 halaman | Next.js |
| Mobile Lapangan | 5 | 12 screens | React Native |
| Customer Portal | 6 | 12 web + 7 mobile | Next.js + React Native |
| **Total** | **22 step** | **~72** | — |

---

## Dependensi Antar Step

| Step | Bergantung Pada |
|:----:|:----------------|
| 1 | — (titik awal) |
| 2 | Step 1 (layout & auth) |
| 3 | — (proyek terpisah, bisa paralel dengan Step 2) |
| 4 | Step 3 |
| 5 | Step 2 (data CRM diperlukan untuk tagihan) |
| 6 | Step 3 (form leads butuh halaman produk sudah ada) |
| 7 | Step 4, 6 |
| 8 | Step 2 (data unit dari CRM) |
| 9 | Step 8 (modul milestone di Web Admin harus ada dulu) |
| 10 | Step 9 |
| 11 | Step 10 |
| 12 | Step 8 (verifikasi milestone) |
| 13 | Step 10, 11 |
| 14 | Step 13 |
| 15 | Step 1 (layout Web Admin) |
| 16 | Step 5 (data keuangan pembeli harus ada) |
| 17 | Step 8 (data milestone dari Web Admin) |
| 18 | Step 5, 16 (data tagihan) |
| 19 | Step 15, 16 (dokumen legal + portal login) |
| 20 | Step 16 |
| 21 | Step 17-20 (semua fitur portal selesai) |
| 22 | Semua step sebelumnya |

---

## Peluang Paralel

Beberapa step bisa dikerjakan bersamaan jika ada lebih dari 1 developer:

| Jalur Paralel | Step yang Bisa Bersamaan |
|:---:|:--------------------------|
| A | Step 3, 4 (Website Marketing) bisa paralel dengan Step 2 (CRM) |
| B | Step 9, 10 (Mobile Lapangan) bisa paralel dengan Step 5 (Keuangan) |
| C | Step 15 (Legal) bisa paralel dengan Step 12 (Vendor) |
| D | Step 16-20 (Customer Portal) bisa paralel dengan Step 14 (Mobile Polish) |

---

*Dokumen: roadmap-frontend.md | Roadmap Pengembangan Frontend | Versi 1.0 | Februari 2026*
