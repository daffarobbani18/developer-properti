# Fase Pengembangan Frontend — Website Marketing
# SIMDP · Sistem Informasi Manajemen Developer Perumahan

---

## Gambaran Umum

Website Marketing adalah area **publik** (tanpa login) dari website utama yang berfungsi sebagai wajah digital perumahan kepada calon pembeli. Ini adalah area yang paling cepat memberikan **nilai nyata** karena langsung bisa dipresentasikan ke mitra dan digunakan untuk marketing.

- **Teknologi**: Next.js (React)
- **Target pengguna**: Calon pembeli umum (publik)
- **Tujuan utama**: Tampilkan produk, generate leads, simulasi KPR
- **Integrasi**: Form leads → Modul CRM

### Catatan Arsitektur

Website Marketing dan Customer Portal berada dalam **satu website/codabase** dengan pemisahan area route:
- Area publik (marketing): `/`, `/tipe-rumah`, `/galeri`, `/simulasi-kpr`, `/kontak`
- Area customer (protected): `/portal/*`

Dengan skema ini, user tidak perlu pindah aplikasi saat bertransisi dari pengunjung menjadi customer terdaftar.

---

## Ringkasan Fase

| Fase | Nama | Fokus | Output |
|------|------|-------|--------|
| 1 | Fondasi & Landing Page | Struktur proyek + halaman utama | Halaman utama live |
| 2 | Halaman Produk & Galeri | Detail perumahan & unit | Katalog unit online |
| 3 | Formulir & Simulasi | Leads + KPR calculator | Leads masuk ke CRM |
| 4 | Optimasi & Polish | SEO, performa, animasi | Website production-ready |

---

## Fase 1 — Fondasi & Landing Page

### Tujuan
Membangun struktur proyek dan halaman utama yang menarik agar calon pembeli mendapat kesan pertama yang baik.

### Pekerjaan

#### 1.1 Setup Proyek
- [ ] Inisialisasi proyek Next.js
- [ ] Setup struktur folder (`/components`, `/pages`, `/public`, `/styles`)
- [ ] Konfigurasi Tailwind CSS / CSS Modules
- [ ] Setup font (Google Fonts)
- [ ] Konfigurasi environment variables (`.env.local`)
- [ ] Setup Git repository

#### 1.2 Komponen Dasar
- [ ] `Navbar` — logo, menu navigasi, tombol "Hubungi Kami"
- [ ] `Footer` — info kontak, media sosial, copyright
- [ ] `Button` — komponen tombol reusable (primary, secondary, outline)
- [ ] `SectionWrapper` — container layout konsisten antar section

#### 1.3 Halaman Utama (`/`)
- [ ] **Hero Section** — gambar/video perumahan, tagline, tombol CTA
- [ ] **Keunggulan** — 3–5 poin keunggulan perumahan (ikon + teks)
- [ ] **Preview Tipe Rumah** — 3 kartu unit unggulan dengan foto
- [ ] **Lokasi Strategis** — embed Google Maps + poin keunggulan lokasi
- [ ] **Testimoni** — slider testimoni pembeli
- [ ] **CTA Banner** — ajakan hubungi sales / daftar sekarang

### Checklist Selesai Fase 1
- [ ] Halaman utama dapat diakses di browser
- [ ] Tampilan responsif di mobile, tablet, desktop
- [ ] Navbar & footer berfungsi normal

---

## Fase 2 — Halaman Produk & Galeri

### Tujuan
Menampilkan semua detail produk perumahan agar calon pembeli dapat melihat lengkap sebelum memutuskan.

### Pekerjaan

#### 2.1 Halaman Tipe Rumah (`/tipe-rumah`)
- [ ] Halaman daftar semua tipe unit (grid/list view)
- [ ] Kartu unit: foto, nama tipe, luas tanah, luas bangunan, harga mulai
- [ ] Filter/sort berdasarkan: harga, tipe, status ketersediaan
- [ ] Badge status unit: **Tersedia / Indent / Terjual**

#### 2.2 Halaman Detail Unit (`/tipe-rumah/[slug]`)
- [ ] Galeri foto multi-gambar (lightbox / carousel)
- [ ] Spesifikasi teknis: luas, kamar tidur, kamar mandi, carport, dll.
- [ ] Denah rumah (floor plan image)
- [ ] Fasilitas yang tersedia
- [ ] Tombol: "Jadwalkan Survey", "Hubungi Sales via WhatsApp"

#### 2.3 Halaman Galeri (`/galeri`)
- [ ] Grid foto lingkungan perumahan
- [ ] Kategori foto: eksterior, interior, fasilitas, progres pembangunan
- [ ] Lightbox zoom foto

#### 2.4 Halaman Fasilitas (`/fasilitas`)
- [ ] Daftar fasilitas (taman, masjid, CCTV, dll.)
- [ ] Foto + keterangan tiap fasilitas

#### 2.5 Halaman Lokasi (`/lokasi`)
- [ ] Embed Google Maps interaktif
- [ ] Jarak ke titik penting: sekolah, rumah sakit, pusat perbelanjaan, tol
- [ ] Tombol "Buka di Google Maps"

### Checklist Selesai Fase 2
- [ ] Semua tipe unit tampil dengan foto
- [ ] Detail unit lengkap dan responsif
- [ ] Galeri berfungsi dengan lightbox
- [ ] Filter tipe unit bekerja

---

## Fase 3 — Formulir & Simulasi

### Tujuan
Mengkonversi pengunjung menjadi leads yang masuk ke sistem CRM, dan membantu calon pembeli menghitung kemampuan KPR.

### Pekerjaan

#### 3.1 Komponen Form Leads
- [ ] Form: Nama, No. HP, email, tipe unit yang diminati, pesan
- [ ] Validasi input (required fields, format email, format HP)
- [ ] Integrasi submit form → API CRM (atau simpan ke JSON sementara)
- [ ] Pesan sukses setelah submit
- [ ] Anti-spam (honeypot / rate limit)

#### 3.2 Kalkulator Simulasi KPR (`/simulasi-kpr`)
- [ ] Input: Harga properti, DP (%), tenor (tahun), suku bunga (%)
- [ ] Output otomatis: Jumlah DP (Rp), sisa pinjaman, cicilan per bulan (Rp)
- [ ] Tabel angsuran per tahun (opsional)
- [ ] Tombol "Konsultasikan ke Sales" → buka form leads / WA

#### 3.3 Halaman Kontak (`/kontak`)
- [ ] Alamat kantor pemasaran + peta
- [ ] Jam operasional
- [ ] Nomor telepon, WA, email
- [ ] Form kontak langsung
- [ ] Tombol WhatsApp floating (sticky di semua halaman)

#### 3.4 Halaman Promo (`/promo`) *(opsional)*
- [ ] Daftar promo aktif
- [ ] Konten promo dengan batas waktu

### Checklist Selesai Fase 3
- [ ] Form leads tersubmit dan data tersimpan
- [ ] Kalkulator KPR menghitung dengan benar
- [ ] Tombol WhatsApp floating muncul di semua halaman
- [ ] Tidak ada error pada proses submit form

---

## Fase 4 — Optimasi & Polish

### Tujuan
Memastikan website cepat, mudah ditemukan di Google, dan tampil profesional sebelum digunakan secara resmi.

### Pekerjaan

#### 4.1 SEO & Meta
- [ ] `<title>` dan `<meta description>` unik per halaman
- [ ] Open Graph tags (untuk preview saat dibagikan di WA / media sosial)
- [ ] `sitemap.xml` otomatis
- [ ] `robots.txt`
- [ ] Alt text semua gambar

#### 4.2 Performa
- [ ] Optimasi gambar (Next.js Image component, WebP format)
- [ ] Lazy loading gambar di galeri
- [ ] Minimize bundle size
- [ ] Target Google PageSpeed: ≥ 80 (mobile), ≥ 90 (desktop)

#### 4.3 UI/UX Polish
- [ ] Animasi scroll (fade-in section saat scroll)
- [ ] Loading skeleton saat konten dimuat
- [ ] Error handling halaman 404
- [ ] Favicon & app icon

#### 4.4 Deployment
- [ ] Konfigurasi domain (subdomain atau domain khusus)
- [ ] Deploy ke Vercel / server production
- [ ] Setup HTTPS / SSL
- [ ] Uji coba lintas browser (Chrome, Firefox, Safari)
- [ ] Uji coba di berbagai ukuran layar HP

#### 4.5 Analytics
- [ ] Pasang Google Analytics 4
- [ ] Setup event tracking: klik CTA, submit form, klik WA
- [ ] Pasang Google Tag Manager (opsional)

### Checklist Selesai Fase 4
- [ ] PageSpeed score memenuhi target
- [ ] Website live di domain asli
- [ ] SEO dasar terpasang
- [ ] Analytics melacak pengunjung

---

## Ringkasan Komponen

| Halaman / Komponen | Fase | Prioritas |
|-------------------|------|-----------|
| Navbar & Footer | 1 | Wajib |
| Hero + CTA | 1 | Wajib |
| Keunggulan & Lokasi | 1 | Wajib |
| Daftar Tipe Rumah | 2 | Wajib |
| Detail Unit + Galeri | 2 | Wajib |
| Halaman Galeri | 2 | Tinggi |
| Halaman Fasilitas & Lokasi | 2 | Tinggi |
| Form Leads | 3 | Wajib |
| Simulasi KPR | 3 | Tinggi |
| Halaman Kontak | 3 | Wajib |
| Tombol WA Floating | 3 | Wajib |
| SEO & Meta | 4 | Wajib |
| Optimasi Gambar | 4 | Wajib |
| Google Analytics | 4 | Tinggi |
| Animasi & Polish | 4 | Menengah |

---

*Dokumen: website-marketing.md | Fase Pengembangan Frontend | Versi 1.0 | Februari 2026*
