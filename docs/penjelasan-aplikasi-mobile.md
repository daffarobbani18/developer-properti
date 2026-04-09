# Penjelasan Aplikasi Mobile
# SIMDP — Sistem Informasi Manajemen Developer Perumahan

---

Sistem SIMDP memiliki 2 aplikasi mobile yang berbeda, masing-masing untuk pengguna yang berbeda:

| No | Nama Aplikasi | Untuk Siapa | Fungsi Utama |
|----|---------------|-------------|--------------|
| 1 | Mobile Lapangan | Tim internal developer (Site Engineer, Manajer Proyek) | Laporan progres konstruksi dari lokasi |
| 2 | Customer Portal Mobile | Pembeli rumah | Pantau progres rumah, tagihan, dokumen |

Kedua aplikasi ini bukan untuk publik umum — keduanya memerlukan login.

---

# BAGIAN A: MOBILE LAPANGAN

---

## A1. Apa Itu Mobile Lapangan

Mobile Lapangan adalah aplikasi HP yang digunakan oleh tim pengawas konstruksi milik developer. Aplikasi ini memungkinkan mereka melaporkan progres pembangunan setiap unit rumah langsung dari lokasi proyek — lengkap dengan foto bukti, status milestone, dan laporan kendala.

Data yang diinput dari aplikasi ini langsung tampil di Web Admin (untuk manajemen) dan Customer Portal (untuk pembeli).

---

## A2. Pengguna

Mobile Lapangan hanya digunakan oleh 2 role:

| Role | Jabatan | Tugas Utama | Cakupan Akses |
|------|---------|-------------|---------------|
| Site Engineer | Pengawas lapangan dari developer (bukan mandor kontraktor) | Mengecek dan melaporkan progres konstruksi per unit | Hanya unit yang ditugaskan kepadanya |
| Manajer Proyek | Penanggung jawab keseluruhan proyek | Memantau semua unit, menindaklanjuti kendala, approve dokumen | Semua proyek dan semua unit |

Catatan penting: Mandor dan tukang dari kontraktor TIDAK menggunakan aplikasi ini. Mereka bekerja berdasarkan kontrak dan progres mereka diawasi oleh Site Engineer.

---

## A3. Struktur Menu

### Navigasi Bawah (Bottom Tab)

```
[ Beranda ] [ Milestone ] [ Unit ] [ Kendala ] [ Notifikasi ]
```

### Peta Menu Lengkap

| Tab | Sub-menu | Fungsi |
|-----|----------|--------|
| Beranda | — | Ringkasan proyek, shortcut aksi cepat, alert deadline |
| Milestone | Pilih Unit | Pilih proyek lalu unit untuk lihat daftar milestone |
| | Update Status | Tandai milestone sebagai selesai + catatan |
| | Upload Foto | Ambil foto dari kamera atau galeri sebagai bukti |
| | Riwayat Update | Daftar semua update yang pernah dikirim |
| Unit | Daftar Unit | Semua unit per proyek dengan progress bar |
| | Detail Unit | Milestone, status, dan galeri foto per unit |
| Kendala | Buat Laporan | Form pelaporan masalah di lapangan |
| | Riwayat Kendala | Semua laporan + status penanganan |
| Notifikasi | — | Daftar notifikasi masuk + riwayat |

---

## A4. Fitur Lengkap

### A4.1 Beranda

Tampilan pertama setelah login.

**Isi beranda:**
- Sambutan: "Selamat pagi, Ahmad" + jabatan
- Kartu ringkasan proyek aktif yang ditugaskan:

| Info | Contoh |
|------|--------|
| Nama proyek | Perumahan Griya Asri Tahap 2 |
| Total unit | 48 unit |
| Progres keseluruhan | 62% |
| Milestone mendekati deadline | 3 milestone |

- Shortcut aksi cepat: "Update Milestone", "Ambil Foto", "Lapor Kendala"
- Alert: milestone yang sudah melewati atau mendekati target tanggal

---

### A4.2 Update Milestone

Fitur paling penting di aplikasi ini. Alurnya:

```
Pilih Proyek
    |
    v
Pilih Unit (misal: Blok A-12)
    |
    v
Lihat Daftar Milestone
    |
    +--- Pondasi          [Selesai]
    +--- Struktur         [Selesai]
    +--- Dinding          [Sedang]     <-- klik untuk update
    +--- Atap             [Belum Mulai]
    +--- Finishing        [Belum Mulai]
    |
    v
Klik "Tandai Selesai"
    |
    v
Isi catatan (opsional): "Dinding lantai 1 selesai cor"
    |
    v
Ambil foto bukti (wajib, maks. 5 foto)
    |
    v
Konfirmasi & Kirim
    |
    v
Status berubah di: Web Admin + Customer Portal
```

**Status milestone:**

| Status | Arti |
|--------|------|
| Belum Mulai | Pekerjaan belum dikerjakan |
| Sedang | Pekerjaan sedang berjalan |
| Selesai | Pekerjaan sudah selesai dan ada foto buktinya |

**Milestone standar per unit rumah:**
1. Pondasi
2. Struktur (kolom, balok, plat lantai)
3. Dinding
4. Atap (rangka + penutup)
5. Plester & Acian
6. Instalasi (listrik, air, sanitasi)
7. Lantai & Finishing
8. Cat & Pembersihan

---

### A4.3 Upload Foto

Setiap update milestone harus disertai foto bukti.

**Cara kerja:**
- Langsung buka kamera HP untuk ambil foto
- Atau pilih dari galeri HP (bisa pilih beberapa sekaligus, maksimal 5)
- Foto otomatis dikompres sebelum dikirim (maksimal 1MB per foto)
- Preview foto sebelum kirim — bisa hapus dan ambil ulang
- Foto terhubung ke milestone yang sedang diupdate
- Setelah terkirim, foto bisa dilihat di Web Admin dan Customer Portal

---

### A4.4 Laporan Kendala

Untuk melaporkan masalah yang ditemukan di lapangan.

**Field form laporan:**

| Field | Isi |
|-------|-----|
| Proyek | Pilih proyek terkait |
| Unit | Pilih unit terkait (opsional jika kendala umum) |
| Kategori | Kualitas Pekerjaan / Jadwal Molor / Cuaca / Akses Lokasi / Lainnya |
| Urgensi | Rendah / Sedang / Tinggi / Kritis |
| Deskripsi | Penjelasan masalah yang ditemukan |
| Rekomendasi | Saran solusi dari pelapor |
| Foto | Foto bukti kendala (dari kamera atau galeri) |

**Setelah disubmit:**
- Laporan masuk ke Web Admin
- Manajer Proyek menerima notifikasi
- Status laporan: Baru -> Sedang Ditangani -> Selesai
- Site Engineer bisa melihat balasan/tindak lanjut dari manajer

---

### A4.5 Daftar Unit

**Informasi per unit di daftar:**

| Info | Contoh |
|------|--------|
| Nomor unit | Blok A-12 |
| Tipe | Azalea 45/90 |
| Progres | 62% (progress bar visual) |
| Status | Sedang Dibangun |
| Milestone terakhir selesai | Dinding |

**Fitur:**
- Filter berdasarkan blok/cluster
- Cari unit berdasarkan nomor
- Klik unit untuk masuk ke detail

**Detail unit berisi:**
- Daftar semua milestone + status masing-masing
- Tombol shortcut "Update Milestone"
- Galeri foto — semua foto yang pernah diupload untuk unit ini, diurutkan dari terbaru ke terlama (timeline)
- Swipe horizontal antar foto

---

### A4.6 Notifikasi

Notifikasi push masuk ke HP meskipun aplikasi tidak sedang dibuka.

**Kondisi notifikasi dikirim:**

| Kondisi | Penerima |
|---------|----------|
| Milestone mendekati deadline (H-3) | Site Engineer yang ditugaskan |
| Milestone sudah melewati deadline | Site Engineer + Manajer Proyek |
| Kendala sudah direspons/ditindaklanjuti | Site Engineer pelapor |
| Tagihan termin kontraktor disetujui/ditolak | Manajer Proyek |
| Pesan penting dari manajemen | Semua tim |

**Di dalam aplikasi:**
- Daftar semua notifikasi (urut terbaru)
- Tandai sudah dibaca / tandai semua dibaca
- Klik notifikasi untuk langsung ke halaman terkait

---

### A4.7 Mode Offline

Lokasi proyek sering memiliki sinyal internet yang lemah atau tidak ada sama sekali. Fitur ini memastikan aplikasi tetap bisa dipakai.

**Cara kerja:**

| Situasi | Yang Terjadi |
|---------|--------------|
| Tidak ada internet | Banner "Anda sedang offline" tampil di atas layar |
| Update milestone saat offline | Data disimpan di HP, masuk ke antrian kirim |
| Ambil foto saat offline | Foto disimpan di HP, belum diupload |
| Internet kembali | Semua data di antrian otomatis dikirim ke server |
| Buka daftar unit saat offline | Data terakhir yang tersimpan (cache) tetap bisa dilihat |

Tidak ada data yang hilang karena putus koneksi — semuanya tersimpan lokal sampai berhasil dikirim.

---

## A5. Perbedaan Akses per Role

| Fitur | Site Engineer | Manajer Proyek |
|-------|:---:|:---:|
| Lihat beranda + ringkasan | Ya | Ya |
| Update status milestone | Ya (unit ditugaskan) | Ya (semua unit) |
| Upload foto milestone | Ya | Ya |
| Buat laporan kendala | Ya | Ya |
| Lihat daftar unit | Ya (unit ditugaskan) | Ya (semua proyek) |
| Tindak lanjuti / update status kendala | Tidak | Ya |
| Terima notifikasi | Ya | Ya |
| Gunakan mode offline | Ya | Ya |

---

## A6. Alur Data Mobile Lapangan

```
Site Engineer di lokasi proyek
     |
     | (update milestone + foto)
     v
Server SIMDP
     |
     +---> Web Admin: Manajer melihat progres terbaru
     |
     +---> Customer Portal: Pembeli melihat foto dan status rumahnya
     |
     +---> Modul Vendor: Milestone selesai = syarat tagihan termin bisa diproses
```

---

## A7. Keamanan

| Fitur Keamanan | Keterangan |
|----------------|------------|
| Login biometrik | Bisa login pakai sidik jari atau Face ID (selain email + password) |
| Auto-lock | Aplikasi terkunci otomatis setelah 15 menit tidak digunakan |
| Token otomatis refresh | Pengguna tidak perlu login ulang setiap hari |
| Data lokal terenkripsi | Data yang disimpan saat offline aman |

---

# BAGIAN B: CUSTOMER PORTAL MOBILE

---

## B1. Apa Itu Customer Portal Mobile

Customer Portal Mobile adalah aplikasi HP untuk pembeli rumah. Ini adalah versi mobile dari Customer Portal web — fiturnya sama persis, tetapi dioptimalkan untuk pengalaman di HP dengan fitur tambahan seperti push notification, kamera, dan login biometrik.

Portal ini memberikan transparansi penuh kepada pembeli tentang rumah yang mereka beli: progres pembangunan, tagihan, dokumen, dan saluran komplain resmi.

---

## B2. Pengguna

| Pengguna | Deskripsi | Akses |
|----------|-----------|-------|
| Pembeli / Pemilik Unit | Orang yang sudah melakukan transaksi pembelian unit | Login dengan akun yang diberikan setelah akad/booking |

Satu akun pembeli hanya bisa melihat data unit miliknya sendiri. Tidak bisa mengakses data pembeli lain.

**Kapan akun dibuat:**
Akun Customer Portal dibuat oleh admin setelah pembeli menyelesaikan proses booking atau akad jual beli di Web Admin. Pembeli menerima email/WA berisi email dan password sementara.

---

## B3. Struktur Menu

### Navigasi Bawah (Bottom Tab)

```
[ Beranda ] [ Progres ] [ Tagihan ] [ Dokumen ] [ Bantuan ]
```

### Peta Menu Lengkap

| Tab | Sub-menu | Fungsi |
|-----|----------|--------|
| Beranda | — | Ringkasan unit, progres, tagihan berikutnya, notifikasi |
| Progres | Progress Bar | Persentase total konstruksi unit |
| | Galeri Foto | Timeline foto konstruksi dari lapangan |
| | Milestone | Daftar tonggak penting + tanggal target vs aktual |
| | Info Proyek | Detail proyek, alamat, tipe rumah, manajer proyek |
| Tagihan | Ringkasan Keuangan | Total harga, sudah bayar, sisa |
| | Tagihan Aktif | Daftar tagihan yang belum dibayar |
| | Riwayat Pembayaran | Semua transaksi yang sudah dibayar |
| | Upload Bukti Bayar | Kirim foto bukti transfer |
| Dokumen | Daftar Dokumen | Semua dokumen unit yang bisa diunduh |
| | Info Serah Terima | Tanggal rencana + checklist kesiapan |
| Bantuan | Formulir Komplain | Form laporan masalah + upload foto |
| | Daftar Tiket | Semua tiket komplain + status |
| | FAQ | Pertanyaan yang sering ditanya |
| | Kontak Developer | WA, telepon, jam operasional |

---

## B4. Fitur Lengkap

### B4.1 Beranda

Halaman pertama setelah login. Memberikan ringkasan cepat semua hal penting.

**Isi beranda:**

| Bagian | Contoh Isi |
|--------|------------|
| Sambutan | "Selamat siang, Bapak Budi" |
| Info Unit | Blok A-12, Tipe Azalea 45/90, Perumahan Griya Asri |
| Progres Konstruksi | 68% (progress bar visual) |
| Tagihan Berikutnya | Cicilan DP ke-3 — Rp 5.000.000 — jatuh tempo 15 Mar 2026 |
| Notifikasi Terbaru | "Milestone Dinding unit Anda telah selesai" |
| Kontak Darurat | Tombol WA developer + nomor telepon kantor |

---

### B4.2 Progres Konstruksi

Fitur yang paling sering dibuka oleh pembeli — mereka ingin tahu rumah mereka sudah sampai mana.

**Progress bar utama:**
- Menampilkan persentase total konstruksi (misal: 68%)
- Warna hijau yang terisi sesuai persentase

**Breakdown per tahap:**

| Tahap | Status | Tanggal |
|-------|--------|---------|
| Pondasi | Selesai | 10 Jan 2026 |
| Struktur | Selesai | 28 Jan 2026 |
| Dinding | Selesai | 15 Feb 2026 |
| Atap | Sedang Berjalan | Target: 5 Mar 2026 |
| Finishing | Belum Mulai | Target: 25 Mar 2026 |

**Galeri foto progres:**
- Foto diurutkan dari terbaru (timeline)
- Setiap foto menampilkan: tanggal diambil, keterangan tahap
- Klik foto untuk zoom layar penuh
- Swipe geser antar foto
- Foto ini berasal dari upload Site Engineer melalui Mobile Lapangan

**Info proyek:**
- Nama proyek dan pengembang
- Alamat lokasi dan nomor unit
- Tipe rumah dan spesifikasi
- Nama manajer proyek + kontak

---

### B4.3 Tagihan & Pembayaran

**Ringkasan keuangan (tampil di atas halaman):**

| Info | Contoh |
|------|--------|
| Total harga unit | Rp 350.000.000 |
| Total sudah dibayar | Rp 120.000.000 |
| Sisa kewajiban | Rp 230.000.000 |
| Skema pembayaran | KPR — Bank BTN |
| Cicilan per bulan | Rp 2.595.000 |

**Tagihan aktif (belum dibayar):**

| Tagihan | Nominal | Jatuh Tempo | Status |
|---------|---------|-------------|--------|
| Cicilan DP ke-3 | Rp 5.000.000 | 15 Mar 2026 | Belum Bayar |
| IPL Maret 2026 | Rp 150.000 | 1 Mar 2026 | Jatuh Tempo |

Masing-masing tagihan memiliki tombol "Bayar Sekarang" yang mengarah ke virtual account atau payment gateway.

**Riwayat pembayaran:**
- Daftar semua transaksi yang sudah dilakukan
- Status: Lunas / Dikonfirmasi / Menunggu Verifikasi
- Tombol unduh kwitansi digital per transaksi

**Upload bukti bayar manual:**
- Untuk pembeli yang transfer manual (bukan via payment gateway)
- Upload foto bukti transfer dari kamera atau galeri HP
- Pilih tagihan mana yang dibayar
- Status: Menunggu Konfirmasi Admin
- Pembeli menerima notifikasi setelah admin mengkonfirmasi

---

### B4.4 Dokumen

Gudang digital semua dokumen penting unit pembeli.

**Kategori dan contoh dokumen:**

| Kategori | Dokumen |
|----------|---------|
| Pra-pembelian | SPK (Surat Pemesanan Kavling), Brosur / Price List |
| Transaksi | AJB (Akta Jual Beli), Kwitansi DP |
| Kepemilikan | SHM (Sertifikat Hak Milik), IMB/PBG unit |
| Serah Terima | Berita Acara Serah Terima, Kartu Garansi |

**Status per dokumen:**

| Status | Arti |
|--------|------|
| Tersedia | Dokumen sudah bisa diunduh |
| Sedang Diproses | Masih dalam proses (misal: di notaris) |
| Belum Tersedia | Dokumen belum dibuat / belum sampai tahap tersebut |

**Fitur:**
- Preview dokumen PDF langsung di aplikasi
- Unduh dokumen ke HP
- Share dokumen ke aplikasi lain (WA, email, dll.)

**Info serah terima:**
- Tanggal rencana serah terima unit
- Checklist yang harus dipenuhi pembeli sebelum serah terima:
  - Lunasi seluruh kewajiban
  - Lengkapi dokumen KPR
  - Tanda tangan berita acara
- Status kesiapan: Siap / Belum Siap (dengan keterangan apa yang belum lengkap)

---

### B4.5 Komplain & Bantuan

Saluran resmi bagi pembeli untuk menyampaikan keluhan atau pertanyaan.

**Form komplain:**

| Field | Keterangan |
|-------|------------|
| Kategori | Progres / Kualitas Bangunan / Dokumen / Tagihan / Lainnya |
| Deskripsi | Penjelasan masalah |
| Foto | Ambil dari kamera atau galeri (opsional, untuk bukti kerusakan) |

**Setelah submit:**
- Sistem membuat tiket dengan nomor unik (misal: TIK-2026-0042)
- Pembeli bisa pantau status tiket: Baru -> Sedang Ditangani -> Selesai -> Ditutup
- Percakapan antara pembeli dan tim developer ditampilkan dalam format thread (seperti chat)
- Notifikasi masuk saat ada balasan dari developer

**FAQ:**
- Daftar pertanyaan yang sering ditanya, dikelompokkan per kategori:
  - Proses serah terima
  - Cara pembayaran
  - Status sertifikat
  - Masalah bangunan / garansi

**Kontak langsung:**
- Tombol WhatsApp developer
- Nomor telepon kantor
- Jam operasional

---

### B4.6 Notifikasi Push

Notifikasi masuk ke HP pembeli meskipun aplikasi tidak sedang dibuka.

**Kondisi notifikasi dikirim:**

| Kondisi | Contoh |
|---------|--------|
| Milestone unit selesai | "Tahap Dinding unit Blok A-12 telah selesai" |
| Tagihan mendekati jatuh tempo | "Cicilan DP ke-3 jatuh tempo 3 hari lagi" |
| Tagihan terlambat | "Cicilan DP ke-3 sudah melewati jatuh tempo" |
| Pembayaran dikonfirmasi | "Pembayaran Rp 5.000.000 telah dikonfirmasi" |
| Dokumen baru tersedia | "Dokumen AJB Anda sudah tersedia untuk diunduh" |
| Balasan tiket komplain | "Tim developer telah membalas tiket TIK-2026-0042" |

---

### B4.7 Keamanan

| Fitur | Keterangan |
|-------|------------|
| Login biometrik | Sidik jari atau Face ID (selain email + password) |
| Ganti password awal | Wajib ganti password sementara saat pertama login |
| Data terisolasi | Setiap pembeli hanya bisa akses data unit miliknya |
| Lupa password | Reset via email |

---

## B5. Alur Data Customer Portal

```
Mobile Lapangan (Site Engineer update milestone + foto)
     |
     v
Server SIMDP
     |
     v
Customer Portal Mobile (pembeli melihat):
     +---> Progres konstruksi + foto terbaru
     +---> Tagihan yang digenerate oleh admin keuangan
     +---> Dokumen yang diupload oleh admin legal
     +---> Balasan tiket dari tim developer
```

Data di Customer Portal bersifat read-only dari sisi pembeli, kecuali:
- Upload bukti pembayaran (foto transfer)
- Submit formulir komplain (+ foto)
- Balas thread tiket komplain

---

# RINGKASAN KEDUA APLIKASI

---

## Perbandingan

| Aspek | Mobile Lapangan | Customer Portal Mobile |
|-------|-----------------|------------------------|
| Pengguna | Site Engineer, Manajer Proyek | Pembeli rumah |
| Akses | Login (2 role internal) | Login (1 role: pembeli) |
| Fungsi utama | Input data (laporan dari lapangan) | Lihat data (pantau rumah yang dibeli) |
| Aksi utama | Update milestone, upload foto, lapor kendala | Lihat progres, cek tagihan, unduh dokumen, komplain |
| Tab navigasi | Beranda, Milestone, Unit, Kendala, Notifikasi | Beranda, Progres, Tagihan, Dokumen, Bantuan |
| Mode offline | Ya (penting, lokasi proyek sering tanpa sinyal) | Tidak (pembeli biasa mengakses dari tempat dengan internet) |
| Push notification | Ya | Ya |
| Login biometrik | Ya | Ya |
| Jumlah screen | 12 | 7 utama |

## Hubungan Antar Aplikasi

```
Web Admin (pusat data)
     |
     |--- mengirim data ke ---> Customer Portal Mobile (pembeli lihat)
     |
     |--- menerima data dari ---> Mobile Lapangan (tim input dari lokasi)
     |
     |--- menerima data dari ---> Website Marketing (form leads masuk)
```

Kedua aplikasi mobile TIDAK berkomunikasi langsung satu sama lain. Semuanya melewati server / Web Admin sebagai pusat data.

---

## Daftar Seluruh Screen

### Mobile Lapangan (12 screen)

| No | Screen | Fungsi |
|----|--------|--------|
| 1 | Login | Email + password |
| 2 | Beranda | Ringkasan proyek + shortcut |
| 3 | Pilih Proyek | Daftar proyek yang ditugaskan |
| 4 | Pilih Unit | Daftar unit per proyek |
| 5 | Daftar Milestone | Status tiap milestone per unit |
| 6 | Update Milestone | Form tandai selesai + catatan |
| 7 | Upload Foto | Kamera / galeri + preview |
| 8 | Riwayat Update | Semua update yang pernah dikirim |
| 9 | Daftar Unit | Semua unit + progress bar |
| 10 | Detail Unit | Milestone + galeri foto |
| 11 | Form Kendala | Form laporan masalah |
| 12 | Riwayat Kendala | Semua laporan + status |

### Customer Portal Mobile (7 screen utama)

| No | Screen | Fungsi |
|----|--------|--------|
| 1 | Login | Email + password + biometrik |
| 2 | Beranda | Ringkasan unit + progres + tagihan |
| 3 | Progres | Progress bar + galeri foto + milestone |
| 4 | Tagihan | Daftar tagihan + riwayat + upload bukti |
| 5 | Dokumen | Daftar dokumen + unduh + serah terima |
| 6 | Komplain | Form + daftar tiket + thread |
| 7 | FAQ & Kontak | Pertanyaan umum + kontak developer |

---

*Dokumen: penjelasan-aplikasi-mobile.md | SIMDP | Versi 1.0 | Februari 2026*
