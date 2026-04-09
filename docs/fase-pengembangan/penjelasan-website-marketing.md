# Penjelasan Website Marketing
# SIMDP — Sistem Informasi Manajemen Developer Perumahan

---

## 1. Apa Itu Website Marketing

Website Marketing adalah situs publik yang berfungsi sebagai etalase digital perumahan. Siapa pun bisa mengaksesnya tanpa perlu login. Tujuan utamanya adalah menampilkan produk perumahan kepada calon pembeli, menarik minat mereka, dan mengubah pengunjung menjadi leads (calon pembeli yang meninggalkan data kontak).

Website ini adalah "wajah pertama" yang dilihat calon pembeli sebelum mereka memutuskan untuk menghubungi sales atau datang survey ke lokasi.

---

## 2. Pengguna

Website Marketing hanya memiliki 1 jenis pengguna:

| Pengguna | Deskripsi | Akses |
|----------|-----------|-------|
| Calon Pembeli (Publik) | Siapa saja yang mengunjungi website, baik dari pencarian Google, media sosial, iklan, atau rekomendasi | Bebas tanpa login |

Tidak ada sistem login di Website Marketing. Semua halaman terbuka untuk umum.

---

## 3. Tujuan Bisnis

Website Marketing menyelesaikan masalah-masalah berikut:

| Masalah Saat Ini | Solusi dari Website |
|-------------------|---------------------|
| Calon pembeli tidak tahu detail produk sebelum datang ke lokasi | Semua info unit, harga, denah, dan foto tersedia online |
| Developer mengandalkan brosur fisik yang mahal dan cepat usang | Website bisa diupdate kapan saja tanpa cetak ulang |
| Tidak ada cara mudah bagi calon pembeli untuk menghubungi sales | Form leads + tombol WhatsApp tersedia di setiap halaman |
| Calon pembeli tidak bisa memperkirakan cicilan KPR | Kalkulator simulasi KPR tersedia langsung di website |
| Data calon pembeli hilang karena hanya dicatat di HP sales | Form leads otomatis masuk ke sistem CRM Web Admin |

---

## 4. Struktur Menu & Halaman

### 4.1 Navigasi Utama (Navbar)

Menu navigasi yang selalu tampil di bagian atas setiap halaman:

```
Logo Perumahan | Beranda | Tipe Rumah | Fasilitas | Lokasi | Galeri | Simulasi KPR | Kontak | [Hubungi Kami]
```

### 4.2 Daftar Semua Halaman

| No | Halaman | URL | Fungsi |
|----|---------|-----|--------|
| 1 | Beranda | `/` | Landing page utama — kesan pertama calon pembeli |
| 2 | Tipe Rumah | `/tipe-rumah` | Daftar semua tipe unit yang dijual |
| 3 | Detail Unit | `/tipe-rumah/[nama-tipe]` | Info lengkap per tipe rumah |
| 4 | Fasilitas | `/fasilitas` | Daftar fasilitas perumahan |
| 5 | Lokasi | `/lokasi` | Peta lokasi + jarak ke tempat penting |
| 6 | Galeri | `/galeri` | Kumpulan foto perumahan |
| 7 | Simulasi KPR | `/simulasi-kpr` | Kalkulator cicilan rumah |
| 8 | Kontak | `/kontak` | Alamat, telepon, form kontak |
| 9 | Promo | `/promo` | Daftar promo aktif (opsional) |

### 4.3 Komponen Tambahan (Selalu Ada di Semua Halaman)

| Komponen | Posisi | Fungsi |
|----------|--------|--------|
| Navbar | Atas | Navigasi ke semua halaman |
| Footer | Bawah | Info kontak, media sosial, copyright |
| Tombol WhatsApp Floating | Pojok kanan bawah (sticky) | Langsung buka chat WA ke sales |

---

## 5. Detail Fitur Per Halaman

### 5.1 Beranda (`/`)

Halaman pertama yang dilihat pengunjung. Harus menarik perhatian dan memberikan gambaran lengkap perumahan dalam satu halaman.

**Section yang ditampilkan (dari atas ke bawah):**

| Section | Isi |
|---------|-----|
| Hero | Foto/video besar perumahan, tagline menarik, 1-2 tombol utama (misal: "Lihat Unit" dan "Hubungi Sales") |
| Keunggulan | 3-5 poin kenapa perumahan ini layak dipilih (lokasi strategis, harga terjangkau, fasilitas lengkap, dll.) |
| Preview Tipe Rumah | 3 kartu tipe rumah unggulan lengkap dengan foto, nama, luas, dan harga mulai. Klik untuk ke halaman detail |
| Lokasi Strategis | Peta Google Maps embed + daftar jarak ke tempat penting (sekolah, RS, tol, mall) |
| Testimoni | Slider berisi kutipan dari pembeli yang puas |
| CTA Banner | Ajakan terakhir: "Tertarik? Hubungi kami sekarang" dengan tombol WA dan form singkat |

---

### 5.2 Tipe Rumah (`/tipe-rumah`)

Halaman katalog yang menampilkan semua tipe unit dalam bentuk grid.

**Informasi per kartu unit:**
- Foto utama unit
- Nama tipe (misal: "Tipe Azalea 45/90")
- Luas tanah dan luas bangunan
- Harga mulai dari
- Badge status: Tersedia / Indent / Terjual

**Fitur halaman:**
- Filter berdasarkan harga, tipe, dan status ketersediaan
- Sortir: harga terendah, harga tertinggi, terbaru
- Klik kartu untuk masuk ke halaman detail

---

### 5.3 Detail Unit (`/tipe-rumah/[nama-tipe]`)

Halaman lengkap untuk satu tipe rumah tertentu.

**Informasi yang ditampilkan:**

| Bagian | Isi |
|--------|-----|
| Galeri Foto | Multi-gambar dengan lightbox (klik untuk zoom). Foto eksterior, interior, dan denah |
| Spesifikasi | Luas tanah, luas bangunan, jumlah kamar tidur, kamar mandi, carport, lantai, daya listrik |
| Denah Rumah | Gambar floor plan / layout kamar |
| Harga | Harga mulai dari, catatan bisa nego / cicilan |
| Fasilitas | Fasilitas yang didapat (taman, CCTV, jalan paving, dll.) |
| Tombol Aksi | "Jadwalkan Survey Lokasi" dan "Hubungi Sales via WhatsApp" |

---

### 5.4 Fasilitas (`/fasilitas`)

Menampilkan semua fasilitas yang tersedia di lingkungan perumahan.

**Contoh daftar fasilitas:**
- Taman bermain anak
- Masjid / musholla
- Keamanan 24 jam + CCTV
- Jalan paving / aspal
- Area jogging / taman hijau
- Saluran air bersih & drainase

Setiap fasilitas ditampilkan dengan foto dan keterangan singkat.

---

### 5.5 Lokasi (`/lokasi`)

**Isi halaman:**
- Peta Google Maps interaktif (bisa scroll, zoom, klik)
- Tabel jarak ke tempat penting:

| Tujuan | Jarak | Waktu Tempuh |
|--------|-------|--------------|
| Pintu tol terdekat | 2,5 km | 5 menit |
| RS terdekat | 3 km | 8 menit |
| SD / SMP terdekat | 1 km | 3 menit |
| Pusat perbelanjaan | 4 km | 10 menit |

- Tombol "Buka di Google Maps" (mengarah ke Google Maps di HP)

---

### 5.6 Galeri (`/galeri`)

Kumpulan semua foto perumahan dalam format grid.

**Kategori foto:**
- Eksterior rumah — tampak depan, samping, belakang
- Interior rumah — ruang tamu, dapur, kamar
- Fasilitas lingkungan — taman, jalan, gerbang
- Progres pembangunan — dokumentasi proses konstruksi

**Fitur:**
- Klik foto untuk zoom (lightbox)
- Filter berdasarkan kategori

---

### 5.7 Simulasi KPR (`/simulasi-kpr`)

Kalkulator yang membantu calon pembeli menghitung estimasi cicilan rumah.

**Input yang diisi pengunjung:**

| Field | Contoh |
|-------|--------|
| Harga properti | Rp 350.000.000 |
| Uang muka (DP) | 20% |
| Tenor (lama cicilan) | 15 tahun |
| Suku bunga per tahun | 7,5% |

**Output yang ditampilkan:**

| Hasil | Nilai |
|-------|-------|
| Jumlah DP | Rp 70.000.000 |
| Sisa pinjaman | Rp 280.000.000 |
| Cicilan per bulan | Rp 2.595.000 |

**Tambahan:**
- Tabel ringkasan angsuran per tahun (opsional)
- Tombol "Konsultasikan ke Sales" — membuka form leads atau chat WhatsApp

---

### 5.8 Kontak (`/kontak`)

**Informasi yang ditampilkan:**
- Alamat kantor pemasaran
- Peta lokasi kantor (Google Maps embed)
- Nomor telepon kantor
- Nomor WhatsApp sales
- Alamat email
- Jam operasional (misal: Senin-Sabtu, 08.00-17.00)
- Form kontak langsung (Nama, HP, Email, Pesan)

---

### 5.9 Promo (`/promo`) — Opsional

Halaman daftar promo yang sedang berlaku.

**Contoh isi:**
- "DP mulai dari 5% — berlaku sampai 31 Maret 2026"
- "Free biaya AJB untuk 10 pembeli pertama"
- "Bonus AC untuk tipe Dahlia 60/120"

Setiap promo memiliki: judul, deskripsi, periode berlaku, dan tombol "Klaim Promo" (mengarah ke form leads).

---

## 6. Alur Pengunjung (User Flow)

Bagaimana calon pembeli biasanya menjelajahi website:

```
Pengunjung datang (dari Google / iklan / WA)
     |
     v
Halaman Beranda
     |
     +---> Lihat tipe rumah ---> Detail unit ---> "Hubungi Sales" / "Jadwalkan Survey"
     |
     +---> Cek lokasi ---> Buka Google Maps
     |
     +---> Simulasi KPR ---> Hitung cicilan ---> "Konsultasikan ke Sales"
     |
     +---> Lihat galeri foto
     |
     +---> Isi form leads / Klik tombol WA floating
     |
     v
Data calon pembeli masuk ke sistem CRM (Web Admin)
     |
     v
Tim Sales menindaklanjuti
```

---

## 7. Form Leads — Detail

Form leads adalah komponen paling penting dari Website Marketing karena ini yang mengubah pengunjung pasif menjadi data calon pembeli aktif.

**Field form:**

| Field | Wajib | Keterangan |
|-------|:-----:|------------|
| Nama lengkap | Ya | — |
| Nomor HP / WhatsApp | Ya | Format Indonesia (+62 / 08xx) |
| Email | Tidak | Opsional |
| Tipe unit yang diminati | Ya | Dropdown dari daftar tipe yang tersedia |
| Pesan / catatan | Tidak | Pertanyaan atau permintaan khusus |

**Setelah submit:**
1. Tampilkan pesan "Terima kasih, tim sales kami akan menghubungi Anda dalam 1x24 jam"
2. Data otomatis masuk ke modul CRM di Web Admin sebagai leads baru
3. Tim sales menerima notifikasi ada leads baru

**Form ini muncul di:**
- Halaman beranda (section CTA)
- Halaman kontak
- Halaman detail unit (tombol "Jadwalkan Survey")
- Halaman simulasi KPR (tombol "Konsultasikan ke Sales")

---

## 8. Koneksi dengan Sistem Lain

Website Marketing tidak berdiri sendiri. Data yang dihasilkan mengalir ke sistem lain:

```
Website Marketing
     |
     | (form leads disubmit)
     v
Modul CRM & Sales (Web Admin)
     |
     | (tim sales follow-up)
     v
Calon Pembeli dihubungi
     |
     | (jika deal)
     v
Modul Keuangan (Web Admin) + Customer Portal (akun pembeli dibuat)
```

| Data dari Website | Masuk ke | Digunakan untuk |
|-------------------|----------|-----------------|
| Data form leads (nama, HP, unit diminati) | CRM Web Admin | Tim Sales follow-up |
| Sumber leads (dari halaman mana form diisi) | CRM Web Admin | Analisis efektivitas marketing |

---

## 9. Fitur Penting yang Harus Ada

Fitur yang membedakan website marketing perumahan profesional dari yang asal-asalan:

| Fitur | Kenapa Penting |
|-------|----------------|
| Responsif (mobile-friendly) | 70-80% pengunjung membuka dari HP, bukan laptop |
| Tombol WhatsApp floating | Cara tercepat bagi calon pembeli untuk bertanya |
| Galeri foto berkualitas tinggi | Foto adalah faktor keputusan utama calon pembeli |
| Kalkulator KPR | Membantu calon pembeli menghitung kemampuan sebelum bertanya |
| SEO (Search Engine Optimization) | Agar perumahan muncul di Google saat orang mencari "rumah dijual di [kota]" |
| Kecepatan loading | Website yang lambat membuat pengunjung pergi dalam 3 detik |
| Open Graph tags | Saat link website dibagikan di WA/sosmed, preview-nya tampil rapi |
| Google Analytics | Untuk tahu berapa banyak pengunjung, dari mana, dan halaman apa yang paling dilihat |

---

## 10. Ringkasan

| Aspek | Detail |
|-------|--------|
| Jenis | Website publik tanpa login |
| Pengguna | Calon pembeli umum |
| Jumlah halaman | 9 halaman |
| Menu utama | Beranda, Tipe Rumah, Fasilitas, Lokasi, Galeri, Simulasi KPR, Kontak |
| Fitur utama | Katalog unit, galeri foto, simulasi KPR, form leads, tombol WA |
| Output utama | Data leads calon pembeli yang masuk ke CRM |
| Koneksi | Form leads -> CRM & Sales (Web Admin) |

---

*Dokumen: penjelasan-website-marketing.md | SIMDP | Versi 1.0 | Februari 2026*
