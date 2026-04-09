# Fase Pengembangan Frontend — Website Marketing
# SIMDP · Sistem Informasi Manajemen Developer Perumahan

---

## Gambaran Umum

Dokumen ini menguraikan **fase pengerjaan frontend saja** untuk Website Marketing — aplikasi publik (tanpa login) yang berfungsi sebagai wajah digital perumahan kepada calon pembeli.

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Bahasa**: TypeScript
- **Target**: Calon pembeli umum (publik)
- **Prinsip Desain**: Konsisten, responsif (mobile-first), profesional, cepat

---

## Design System & Panduan Konsistensi

Sebelum masuk ke fase pengerjaan, seluruh komponen harus mengikuti **design system** yang sama agar tampilan konsisten dari halaman pertama hingga terakhir.

### Palet Warna

| Token | Warna | Keterangan |
|-------|-------|------------|
| `--color-primary` | `#1E3A5F` | Biru gelap — header, tombol utama, link aktif |
| `--color-primary-light` | `#2D5F8B` | Biru medium — hover state |
| `--color-secondary` | `#D4A843` | Emas — aksen, badge, highlight |
| `--color-accent` | `#27AE60` | Hijau — status tersedia, CTA sukses |
| `--color-danger` | `#E74C3C` | Merah — status terjual, error |
| `--color-neutral-50` | `#F8FAFB` | Background section terang |
| `--color-neutral-100` | `#EEF1F4` | Background kartu / card |
| `--color-neutral-700` | `#374151` | Teks body |
| `--color-neutral-900` | `#111827` | Teks heading |
| `--color-white` | `#FFFFFF` | Background utama |

### Tipografi

| Elemen | Font | Size (Desktop) | Size (Mobile) | Weight |
|--------|------|---------------:|---------------:|--------|
| H1 (Hero) | Inter | 48px | 32px | Bold (700) |
| H2 (Section Title) | Inter | 36px | 24px | Semibold (600) |
| H3 (Subsection) | Inter | 24px | 20px | Semibold (600) |
| H4 (Card Title) | Inter | 20px | 18px | Medium (500) |
| Body | Inter | 16px | 14px | Regular (400) |
| Caption | Inter | 14px | 12px | Regular (400) |
| Button | Inter | 16px | 14px | Semibold (600) |

### Spacing System (8px base grid)

| Token | Nilai | Penggunaan |
|-------|------:|------------|
| `xs` | 4px | Gap ikon-teks kecil |
| `sm` | 8px | Padding dalam komponen kecil |
| `md` | 16px | Gap antar elemen |
| `lg` | 24px | Padding dalam section |
| `xl` | 32px | Margin antar section |
| `2xl` | 48px | Jarak section ke section (mobile) |
| `3xl` | 64px | Jarak section ke section (desktop) |
| `4xl` | 96px | Padding hero section |

### Border Radius

| Elemen | Radius |
|--------|-------:|
| Button | 8px |
| Card | 12px |
| Image | 12px |
| Badge | 999px (pill) |
| Input | 8px |

### Shadow

| Level | Nilai | Penggunaan |
|-------|-------|------------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Card default |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.1)` | Card hover |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modal, dropdown |

### Breakpoints (Mobile-First)

| Breakpoint | Min Width | Target |
|------------|----------:|--------|
| `sm` | 640px | HP besar / landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Monitor besar |

### Container

| Breakpoint | Max Width |
|------------|----------:|
| Default | 100% (padding 16px) |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1200px |

---

## Ringkasan Fase

| Fase | Nama | Durasi | Output |
|------|------|--------|--------|
| 1 | Setup & Design System | 3–4 hari | Proyek siap, komponen dasar, design tokens |
| 2 | Landing Page (Halaman Utama) | 4–5 hari | Halaman utama responsif & lengkap |
| 3 | Halaman Produk & Detail Unit | 5–6 hari | Katalog tipe rumah, detail unit, galeri |
| 4 | Halaman Pendukung | 3–4 hari | Fasilitas, lokasi, galeri lingkungan |
| 5 | Formulir, Simulasi & Kontak | 4–5 hari | Form leads, kalkulator KPR, halaman kontak |
| 6 | SEO, Performa & Polish | 3–4 hari | SEO, animasi, optimasi gambar |
| 7 | Testing & Deployment | 2–3 hari | Website live, cross-browser tested |

**Total estimasi: 24–31 hari kerja**

---

## Fase 1 — Setup Proyek & Design System

### Tujuan
Menyiapkan fondasi proyek, konfigurasi tools, dan membangun design system agar seluruh komponen konsisten dari awal.

### 1.1 Inisialisasi Proyek

- [ ] Buat proyek Next.js 14+ dengan App Router
  ```bash
  npx create-next-app@latest website-marketing --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Setup struktur folder:
  ```
  src/
  ├── app/                    # App Router pages
  │   ├── layout.tsx          # Root layout
  │   ├── page.tsx            # Halaman utama (/)
  │   ├── tipe-rumah/
  │   │   ├── page.tsx        # Daftar tipe (/tipe-rumah)
  │   │   └── [slug]/
  │   │       └── page.tsx    # Detail unit (/tipe-rumah/[slug])
  │   ├── galeri/
  │   │   └── page.tsx        # Galeri (/galeri)
  │   ├── fasilitas/
  │   │   └── page.tsx        # Fasilitas (/fasilitas)
  │   ├── lokasi/
  │   │   └── page.tsx        # Lokasi (/lokasi)
  │   ├── simulasi-kpr/
  │   │   └── page.tsx        # Kalkulator KPR (/simulasi-kpr)
  │   ├── kontak/
  │   │   └── page.tsx        # Kontak (/kontak)
  │   └── promo/
  │       └── page.tsx        # Promo (/promo) — opsional
  ├── components/
  │   ├── ui/                 # Komponen UI reusable
  │   │   ├── Button.tsx
  │   │   ├── Badge.tsx
  │   │   ├── Card.tsx
  │   │   ├── Input.tsx
  │   │   ├── SectionWrapper.tsx
  │   │   └── Typography.tsx
  │   ├── layout/             # Komponen layout
  │   │   ├── Navbar.tsx
  │   │   ├── Footer.tsx
  │   │   ├── MobileMenu.tsx
  │   │   └── WhatsAppFloat.tsx
  │   ├── sections/           # Section halaman utama
  │   │   ├── HeroSection.tsx
  │   │   ├── KeunggulanSection.tsx
  │   │   ├── PreviewTipeSection.tsx
  │   │   ├── LokasiSection.tsx
  │   │   ├── TestimoniSection.tsx
  │   │   └── CTABanner.tsx
  │   └── shared/             # Komponen shared
  │       ├── UnitCard.tsx
  │       ├── GalleryGrid.tsx
  │       ├── Lightbox.tsx
  │       ├── FormLeads.tsx
  │       └── KPRCalculator.tsx
  ├── lib/                    # Utilities & helpers
  │   ├── constants.ts        # Konstanta (kontak, link WA, dsb)
  │   ├── utils.ts            # Helper functions
  │   └── formatters.ts       # Format rupiah, nomor HP, dsb
  ├── data/                   # Data statis (sementara, sebelum API)
  │   ├── units.ts            # Data tipe rumah
  │   ├── facilities.ts       # Data fasilitas
  │   ├── testimonials.ts     # Data testimoni
  │   └── promos.ts           # Data promo
  ├── hooks/                  # Custom React Hooks
  │   ├── useMediaQuery.ts
  │   └── useScrollAnimation.ts
  ├── types/                  # TypeScript types
  │   └── index.ts
  └── styles/
      └── globals.css         # Global styles + Tailwind directives
  ```
- [ ] Install dependencies tambahan:
  ```bash
  npm install clsx tailwind-merge lucide-react
  npm install -D prettier eslint-config-prettier
  ```
- [ ] Konfigurasi `tailwind.config.ts` dengan design tokens (warna, font, spacing)
- [ ] Konfigurasi `globals.css` — reset, font import, custom utilities
- [ ] Setup `.env.local` dengan variabel:
  ```
  NEXT_PUBLIC_SITE_NAME="Nama Perumahan"
  NEXT_PUBLIC_WA_NUMBER="6281234567890"
  NEXT_PUBLIC_WA_MESSAGE="Halo, saya tertarik dengan perumahan..."
  NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=""
  NEXT_PUBLIC_GA_MEASUREMENT_ID=""
  ```
- [ ] Setup Git repository + `.gitignore`

### 1.2 Design Tokens & Tailwind Config

- [ ] Definisikan custom colors di `tailwind.config.ts`:
  ```typescript
  colors: {
    primary: { DEFAULT: '#1E3A5F', light: '#2D5F8B' },
    secondary: '#D4A843',
    accent: '#27AE60',
    danger: '#E74C3C',
  }
  ```
- [ ] Definisikan custom font family (Inter via `next/font/google`)
- [ ] Definisikan custom spacing jika diperlukan
- [ ] Buat utility class `cn()` untuk merge Tailwind classes:
  ```typescript
  // lib/utils.ts
  import { clsx, ClassValue } from 'clsx';
  import { twMerge } from 'tailwind-merge';
  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }
  ```

### 1.3 Komponen UI Dasar (Design System)

Setiap komponen harus mendukung **responsif** dan mengikuti **design tokens**.

#### Button
- [ ] Variants: `primary`, `secondary`, `outline`, `ghost`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] States: default, hover, active, disabled
- [ ] Support ikon (left/right icon)
- [ ] Responsif: full-width di mobile (`w-full sm:w-auto`)

#### Badge
- [ ] Variants: `tersedia` (hijau), `indent` (kuning), `terjual` (merah)
- [ ] Ukuran konsisten, border-radius pill

#### Card
- [ ] Base card dengan shadow, border-radius, hover effect
- [ ] Variant: dengan gambar (thumbnail atas), tanpa gambar
- [ ] Responsif: stack vertikal di mobile

#### Input & Textarea
- [ ] Style konsisten: border, focus ring, error state
- [ ] Label + helper text
- [ ] Responsif

#### SectionWrapper
- [ ] Container dengan max-width + padding konsisten
- [ ] Prop: `background` (light/dark), `spacing` (sm/md/lg)
- [ ] Heading section (title + subtitle) opsional

#### Typography
- [ ] Komponen heading (`H1`–`H4`) dengan size responsif bawaan
- [ ] Paragraph component

### 1.4 Layout Components

#### Navbar
- [ ] Logo di kiri
- [ ] Menu navigasi di tengah/kanan:
  - Beranda | Tipe Rumah | Galeri | Fasilitas | Lokasi | Simulasi KPR | Kontak
- [ ] Tombol CTA "Hubungi Kami" (link WA)
- [ ] **Mobile**: Hamburger menu → drawer/overlay menu full screen
- [ ] Sticky navbar saat scroll (dengan shadow)
- [ ] Active state pada menu sesuai halaman aktif
- [ ] Blur background saat scroll (`backdrop-blur`)

#### Footer
- [ ] 4 kolom (desktop), stack (mobile):
  - **Kolom 1**: Logo + deskripsi singkat perumahan
  - **Kolom 2**: Navigasi cepat (link halaman)
  - **Kolom 3**: Kontak (alamat, telepon, email, jam operasional)
  - **Kolom 4**: Media sosial (Instagram, Facebook, YouTube, TikTok)
- [ ] Copyright bar di bawah
- [ ] Responsif: 4 kolom → 2 kolom (tablet) → 1 kolom (mobile)

#### WhatsApp Floating Button
- [ ] Posisi: fixed bottom-right
- [ ] Ikon WhatsApp + tooltip "Chat via WhatsApp"
- [ ] Link ke `wa.me/{nomor}?text={pesan}`
- [ ] Animasi pulse/bounce halus
- [ ] Z-index tinggi agar selalu di atas

### Checklist Selesai Fase 1
- [ ] Proyek berjalan di `localhost:3000` tanpa error
- [ ] Design tokens terpasang di Tailwind config
- [ ] Semua komponen UI dasar sudah dibuat dan responsif
- [ ] Navbar + Footer tampil dan berfungsi
- [ ] WhatsApp floating button tampil di semua halaman
- [ ] Struktur folder rapi sesuai panduan

---

## Fase 2 — Landing Page (Halaman Utama)

### Tujuan
Membangun halaman utama yang menarik, informatif, dan mendorong calon pembeli untuk mengeksplor lebih lanjut atau menghubungi sales.

### 2.1 Hero Section

- [ ] **Desktop**: Layout 2 kolom — teks kiri, gambar/visual kanan
- [ ] **Mobile**: Stack — gambar atas, teks bawah
- [ ] Elemen:
  - Tagline utama (H1): "Hunian Nyaman di Lokasi Strategis"
  - Sub-tagline (paragraph): deskripsi singkat perumahan
  - 2 tombol CTA:
    - **Primary**: "Lihat Tipe Rumah" → link ke `/tipe-rumah`
    - **Secondary/Outline**: "Hubungi Sales" → link WA
  - Badge/pill: "Mulai dari Rp 300 juta" (opsional)
- [ ] Background: gambar perumahan (optimized, lazy-loaded) atau gradient overlay di atas gambar
- [ ] Tinggi: `min-h-[80vh]` desktop, `min-h-[60vh]` mobile

### 2.2 Keunggulan Section

- [ ] Heading: "Mengapa Memilih [Nama Perumahan]?"
- [ ] Grid 3 kolom (desktop), 1 kolom (mobile)
- [ ] Setiap item:
  - Ikon (Lucide icon)
  - Judul keunggulan (H4)
  - Deskripsi singkat (1–2 kalimat)
- [ ] Data dari file statis (`data/`)
- [ ] Contoh keunggulan: "Lokasi Strategis", "Desain Modern", "Harga Terjangkau", "Fasilitas Lengkap", "Keamanan 24 Jam"

### 2.3 Preview Tipe Rumah Section

- [ ] Heading: "Pilihan Tipe Rumah"
- [ ] Grid 3 kartu unit unggulan (desktop), swipe/scroll horizontal (mobile)
- [ ] Setiap kartu (`UnitCard`):
  - Foto utama (aspect ratio 4:3)
  - Badge status (Tersedia/Indent/Terjual)
  - Nama tipe (H4)
  - Spesifikasi mini: LT / LB / KT / KM
  - Harga mulai: "Mulai Rp 350 juta"
  - Tombol: "Lihat Detail" → link ke `/tipe-rumah/[slug]`
- [ ] Tombol "Lihat Semua Tipe" → link ke `/tipe-rumah`

### 2.4 Lokasi Strategis Section

- [ ] Layout 2 kolom: peta kiri, info kanan (desktop) — stack (mobile)
- [ ] Embed Google Maps (iframe) dengan marker lokasi perumahan
- [ ] Daftar jarak ke titik penting:
  - 🏥 RS terdekat: ± 5 menit
  - 🏫 Sekolah: ± 3 menit
  - 🛍 Mall: ± 10 menit
  - 🛣 Tol: ± 15 menit
- [ ] Tombol "Buka di Google Maps"

### 2.5 Testimoni Section

- [ ] Heading: "Kata Mereka yang Sudah Memilih Kami"
- [ ] Carousel/slider testimoni (auto-play, swipeable di mobile)
- [ ] Setiap testimoni:
  - Foto pembeli (avatar/placeholder)
  - Nama
  - Tipe unit yang dibeli
  - Kutipan testimoni
  - Rating bintang (opsional)
- [ ] Indicator dots di bawah carousel
- [ ] Data dari file statis

### 2.6 CTA Banner Section

- [ ] Background: warna primary atau gambar dengan overlay
- [ ] Teks ajakan: "Tertarik? Jadwalkan Kunjungan Sekarang"
- [ ] Sub-teks: "Tim kami siap membantu Anda menemukan hunian impian"
- [ ] 2 tombol:
  - "Hubungi via WhatsApp" (primary, ikon WA)
  - "Lihat Promo" → link ke `/promo`
- [ ] Responsif: teks center di mobile, layout horizontal di desktop

### Checklist Selesai Fase 2
- [ ] Halaman utama lengkap dengan semua section
- [ ] Responsif sempurna di mobile (375px), tablet (768px), desktop (1280px)
- [ ] Semua link dan tombol berfungsi
- [ ] Gambar menggunakan Next.js `<Image>` component
- [ ] Halaman loading < 3 detik

---

## Fase 3 — Halaman Produk & Detail Unit

### Tujuan
Menampilkan katalog produk perumahan secara lengkap agar calon pembeli dapat membandingkan dan memilih unit yang sesuai.

### 3.1 Halaman Daftar Tipe Rumah (`/tipe-rumah`)

- [ ] **Header halaman**: Judul + deskripsi singkat
- [ ] **Filter bar** (sticky di mobile):
  - Filter: Status (Tersedia / Indent / Terjual)
  - Sort: Harga terendah, harga tertinggi, luas terbesar
  - Counter: "Menampilkan X dari Y tipe"
- [ ] **Grid view**: 3 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- [ ] Setiap kartu menggunakan komponen `UnitCard` (sudah dibuat di Fase 2)
- [ ] State kosong: "Tidak ada unit yang sesuai filter" jika tidak ada hasil
- [ ] Data dari file statis `/data/units.ts`

### 3.2 Halaman Detail Unit (`/tipe-rumah/[slug]`)

- [ ] **Breadcrumb**: Beranda > Tipe Rumah > [Nama Tipe]
- [ ] **Galeri foto** (bagian atas):
  - Foto utama besar + thumbnail gallery di bawah
  - Klik thumbnail → ganti foto utama
  - Klik foto utama → buka lightbox fullscreen
  - Swipe gesture di mobile
  - Counter: "3 / 8 foto"
- [ ] **Info utama** (samping galeri di desktop, bawah di mobile):
  - Nama tipe (H1)
  - Badge status
  - Harga: "Rp 450.000.000"
  - Spesifikasi ringkas: LT / LB / KT / KM / Carport
- [ ] **Tab atau accordion spesifikasi**:
  - **Spesifikasi Teknis**: luas tanah, luas bangunan, jumlah lantai, kamar tidur, kamar mandi, carport, listrik, air
  - **Material & Finishing**: pondasi, dinding, atap, lantai, kusen, sanitasi
  - **Denah Rumah**: gambar floor plan (lightbox zoom)
  - **Fasilitas**: daftar fasilitas di sekitar unit
- [ ] **CTA Section** (sticky di mobile bottom):
  - "Jadwalkan Survey" → buka form leads / WA
  - "Hubungi Sales via WhatsApp" → link WA dengan pesan otomatis: "Halo, saya tertarik dengan tipe [Nama Tipe]"
  - "Simulasi KPR" → link ke `/simulasi-kpr?harga={harga}`
- [ ] **Related Units**: 3 unit tipe lain sebagai rekomendasi

### 3.3 Komponen Lightbox

- [ ] Modal fullscreen dengan background gelap
- [ ] Navigasi: prev/next (arrow button + keyboard + swipe)
- [ ] Close: tombol X + klik background + keyboard Esc
- [ ] Counter: "3 / 8"
- [ ] Zoom: pinch-to-zoom di mobile (opsional)
- [ ] Animasi: fade-in/out smooth
- [ ] Prevent body scroll saat lightbox aktif

### Checklist Selesai Fase 3
- [ ] Halaman daftar tipe rumah menampilkan semua unit
- [ ] Filter dan sort berfungsi dengan benar
- [ ] Halaman detail unit lengkap (galeri, spesifikasi, denah)
- [ ] Lightbox berfungsi dengan navigasi
- [ ] Responsif di semua breakpoint
- [ ] Setiap detail unit memiliki URL unik (`/tipe-rumah/[slug]`)

---

## Fase 4 — Halaman Pendukung

### Tujuan
Melengkapi informasi perumahan dengan halaman galeri lingkungan, fasilitas, dan lokasi.

### 4.1 Halaman Galeri (`/galeri`)

- [ ] **Header halaman**: Judul + deskripsi
- [ ] **Filter tab kategori**: Semua | Eksterior | Interior | Fasilitas | Progres Pembangunan
- [ ] **Grid masonry/uniform**: 3 kolom (desktop), 2 kolom (tablet), 1 kolom (mobile)
- [ ] Setiap foto:
  - Thumbnail dengan aspect ratio konsisten
  - Hover overlay: judul foto + ikon zoom
  - Klik → buka lightbox (reuse dari Fase 3)
- [ ] Lazy loading untuk semua foto
- [ ] Data dari file statis `/data/gallery.ts`

### 4.2 Halaman Fasilitas (`/fasilitas`)

- [ ] **Header halaman**: Judul + deskripsi
- [ ] **Grid fasilitas**: 2 kolom (desktop), 1 kolom (mobile)
- [ ] Setiap fasilitas:
  - Foto/ikon
  - Nama fasilitas (H3)
  - Deskripsi detail
- [ ] Contoh fasilitas: Taman bermain, Masjid, CCTV 24 jam, One gate system, Jalan paving, Saluran air, Area hijau
- [ ] Data dari file statis `/data/facilities.ts`

### 4.3 Halaman Lokasi (`/lokasi`)

- [ ] **Embed Google Maps** interaktif (ukuran besar)
- [ ] **Daftar jarak** ke tempat penting (format kartu grid):
  - Kategori: Pendidikan, Kesehatan, Perbelanjaan, Transportasi, Ibadah
  - Setiap item: ikon + nama tempat + jarak (km) + estimasi waktu tempuh
- [ ] **Tombol aksi**:
  - "Buka di Google Maps" → link external
  - "Petunjuk Arah" → link Google Maps directions
- [ ] Responsif: peta full-width di mobile, 60/40 split di desktop

### Checklist Selesai Fase 4
- [ ] Halaman galeri menampilkan foto per kategori
- [ ] Lightbox berfungsi dari halaman galeri
- [ ] Halaman fasilitas informatif dan responsif
- [ ] Halaman lokasi menampilkan peta dan daftar jarak
- [ ] Semua halaman mengikuti design system yang sama

---

## Fase 5 — Formulir, Simulasi & Kontak

### Tujuan
Mengkonversi pengunjung menjadi leads melalui formulir, tools simulasi KPR, dan kemudahan menghubungi sales.

### 5.1 Komponen Form Leads (Reusable)

- [ ] Field form:
  | Field | Tipe | Validasi |
  |-------|------|----------|
  | Nama Lengkap | `text` | Wajib, min 3 karakter |
  | Nomor HP | `tel` | Wajib, format 08xx / +628xx |
  | Email | `email` | Opsional, format email valid |
  | Tipe Unit Diminati | `select` | Wajib, opsi dari data units |
  | Pesan | `textarea` | Opsional, max 500 karakter |
- [ ] **Validasi real-time**: error message muncul saat blur atau submit
- [ ] **Honeypot field** untuk anti-spam (hidden field)
- [ ] **Submit handler**:
  - Sementara: simpan ke `localStorage` + tampilkan di console
  - Siap dipasang API endpoint nanti (struktur fetch sudah dibuat)
- [ ] **UX setelah submit**:
  - Loading state pada tombol (spinner + disable)
  - Pesan sukses: "Terima kasih! Tim kami akan menghubungi Anda segera."
  - Reset form setelah sukses
  - Error handling: pesan gagal + tombol coba lagi
- [ ] Komponen ini reusable — bisa dipanggil di halaman mana saja

### 5.2 Kalkulator Simulasi KPR (`/simulasi-kpr`)

- [ ] **Header halaman**: Judul + penjelasan "Simulasi ini hanya estimasi"
- [ ] **Form input**:
  | Input | Tipe | Default | Keterangan |
  |-------|------|---------|------------|
  | Harga Properti | `number` (Rp) | Rp 400.000.000 | Slider + input manual |
  | Uang Muka (DP) | `range` (%) | 20% | Slider 10%–50% |
  | Tenor | `select` | 15 tahun | Opsi: 5, 10, 15, 20, 25 tahun |
  | Suku Bunga | `number` (%) | 7.5% | Input manual |
- [ ] **Output real-time** (hitung otomatis saat input berubah):
  - Jumlah DP: Rp XX.XXX.XXX
  - Pinjaman pokok: Rp XX.XXX.XXX
  - Cicilan per bulan: **Rp XX.XXX.XXX** (highlight besar)
  - Total pembayaran selama tenor
  - Total bunga yang dibayar
- [ ] **Rumus**: Flat rate atau anuitas (default flat rate karena sederhana):
  ```
  Cicilan = (Pinjaman + (Pinjaman × Bunga × Tenor)) / (Tenor × 12)
  ```
- [ ] **Tabel angsuran** (collapsible):
  - Kolom: Tahun ke-, Sisa Pokok, Cicilan/bulan, Total Bayar/tahun
- [ ] **CTA di bawah hasil**:
  - "Konsultasikan ke Sales" → buka form leads atau WA
  - Pesan WA otomatis: "Halo, saya ingin konsultasi KPR untuk properti Rp {harga}, DP {dp}%, tenor {tenor} tahun"
- [ ] **Bisa menerima query param**: `/simulasi-kpr?harga=450000000` → auto-fill harga
- [ ] Format angka: Rupiah Indonesia (`Rp 450.000.000`)
- [ ] Responsif: 2 kolom (input-output) di desktop, stack di mobile

### 5.3 Halaman Kontak (`/kontak`)

- [ ] **Layout 2 kolom** (desktop), stack (mobile):
  - **Kiri**: Informasi kontak
  - **Kanan**: Form kontak (reuse `FormLeads`)
- [ ] **Informasi kontak**:
  - Alamat kantor pemasaran (dengan ikon)
  - Nomor telepon (klik-to-call di mobile)
  - WhatsApp (klik-to-chat)
  - Email (klik-to-mail)
  - Jam operasional (tabel hari + jam)
  - Media sosial (ikon + link)
- [ ] **Embed peta kecil** di bawah info kontak (Google Maps kantor pemasaran)

### 5.4 Halaman Promo (`/promo`) — Opsional

- [ ] **Header halaman**: Judul + "Promo Terbaik Saat Ini"
- [ ] **Grid kartu promo**: 2 kolom (desktop), 1 kolom (mobile)
- [ ] Setiap kartu:
  - Banner/gambar promo
  - Judul promo
  - Deskripsi singkat
  - Badge: "Berlaku s/d DD MMM YYYY"
  - Tombol CTA → WA / form leads
- [ ] State kosong: "Belum ada promo aktif saat ini"
- [ ] Data dari file statis `/data/promos.ts`

### Checklist Selesai Fase 5
- [ ] Form leads berfungsi dengan validasi lengkap
- [ ] Data leads tersimpan (localStorage sementara)
- [ ] Kalkulator KPR menghitung dengan benar
- [ ] Format Rupiah tampil benar
- [ ] Halaman kontak informatif dan responsif
- [ ] Semua CTA mengarah ke WA / form dengan benar

---

## Fase 6 — SEO, Performa & Polish

### Tujuan
Memastikan website mudah ditemukan di Google, cepat diakses, dan terlihat profesional dengan animasi halus.

### 6.1 SEO & Meta Tags

- [ ] Setup metadata per halaman menggunakan Next.js `generateMetadata()`:
  | Halaman | Title | Description |
  |---------|-------|-------------|
  | `/` | [Nama Perumahan] — Hunian Nyaman di [Kota] | Temukan rumah impian Anda... |
  | `/tipe-rumah` | Tipe Rumah — [Nama Perumahan] | Pilihan tipe rumah mulai dari... |
  | `/tipe-rumah/[slug]` | [Nama Tipe] — [Nama Perumahan] | Detail spesifikasi dan harga... |
  | `/galeri` | Galeri — [Nama Perumahan] | Lihat foto perumahan kami... |
  | `/simulasi-kpr` | Simulasi KPR — [Nama Perumahan] | Hitung estimasi cicilan KPR... |
  | `/kontak` | Kontak — [Nama Perumahan] | Hubungi tim pemasaran kami... |
- [ ] **Open Graph tags** (gambar + judul + deskripsi per halaman)
- [ ] **Twitter Card meta tags**
- [ ] Setup `sitemap.xml` menggunakan Next.js built-in sitemap
- [ ] Setup `robots.txt`
- [ ] **Alt text** pada semua gambar
- [ ] **Heading hierarchy** benar (H1 → H2 → H3, tanpa skip)
- [ ] **Structured data / JSON-LD**: schema RealEstateAgent + Product (opsional)

### 6.2 Optimasi Performa

- [ ] Semua gambar menggunakan `next/image` dengan:
  - Format WebP otomatis
  - `sizes` attribute sesuai breakpoint
  - `placeholder="blur"` untuk gambar statis
  - `loading="lazy"` untuk gambar di bawah fold
  - `priority` untuk gambar hero (above the fold)
- [ ] Audit dan minimize bundle size:
  - Dynamic import untuk komponen berat (Lightbox, KPR Calculator)
  - Tree-shaking icon library (import per-icon, bukan seluruh library)
- [ ] Font optimization menggunakan `next/font/google`
- [ ] Target Lighthouse:
  - Performance: ≥ 85 (mobile), ≥ 90 (desktop)
  - Accessibility: ≥ 90
  - Best Practices: ≥ 90
  - SEO: ≥ 90

### 6.3 Animasi & UI Polish

- [ ] **Scroll animation** (fade-in + slide-up saat section masuk viewport):
  - Implementasi dengan `IntersectionObserver` (custom hook `useScrollAnimation`)
  - Terapkan ke semua section di halaman utama
  - Animasi subtle: `opacity 0→1`, `translateY 20px→0`, `duration 600ms`
- [ ] **Hover effects**:
  - Kartu: scale(1.02) + shadow elevation
  - Tombol: background shift + slight scale
  - Link: underline animation
- [ ] **Loading UI**:
  - Skeleton loader untuk kartu unit (shimmer effect)
  - Loading spinner untuk form submit
- [ ] **Error page** (`not-found.tsx`):
  - Ilustrasi 404
  - Pesan: "Halaman tidak ditemukan"
  - Tombol: "Kembali ke Beranda"
- [ ] **Favicon & app icons**:
  - `favicon.ico` (32x32)
  - `apple-touch-icon.png` (180x180)
  - `og-image.jpg` (1200x630) — default OG image
- [ ] **Smooth scroll** untuk anchor link

### Checklist Selesai Fase 6
- [ ] Setiap halaman memiliki title & meta description unik
- [ ] Open Graph preview benar saat dibagikan di WhatsApp / media sosial
- [ ] Lighthouse score memenuhi target
- [ ] Animasi scroll halus dan tidak mengganggu
- [ ] 404 page custom tersedia
- [ ] Favicon terpasang

---

## Fase 7 — Testing & Deployment

### Tujuan
Memastikan website berfungsi sempurna di berbagai device dan browser, lalu deploy ke production.

### 7.1 Cross-Browser Testing

- [ ] Test di browser:
  | Browser | Platform |
  |---------|----------|
  | Chrome | Desktop + Mobile |
  | Firefox | Desktop |
  | Safari | Mobile (iOS) |
  | Samsung Internet | Mobile (Android) |
  | Edge | Desktop |
- [ ] Pastikan tidak ada layout broken di semua browser

### 7.2 Responsive Testing

- [ ] Test di resolusi:
  | Device | Width |
  |--------|------:|
  | iPhone SE | 375px |
  | iPhone 14 | 390px |
  | Samsung Galaxy | 412px |
  | iPad Mini | 768px |
  | iPad Pro | 1024px |
  | Laptop | 1366px |
  | Desktop | 1920px |
- [ ] Test orientasi landscape di mobile
- [ ] Test dengan keyboard/tab navigation (accessibility)

### 7.3 Functional Testing

- [ ] Semua link navigasi benar (tidak ada broken link)
- [ ] Form leads validasi dan submit berfungsi
- [ ] Kalkulator KPR kalkulasi benar (test beberapa skenario)
- [ ] Filter tipe rumah berfungsi
- [ ] Lightbox buka/tutup/navigasi berfungsi
- [ ] WhatsApp floating button mengarah ke link benar
- [ ] Semua tombol CTA berfungsi
- [ ] Google Maps embed tampil

### 7.4 Deployment

- [ ] Build production: `npm run build` — pastikan tidak ada error
- [ ] Test production build lokal: `npm run start`
- [ ] Deploy ke Vercel:
  - Connect Git repository
  - Set environment variables
  - Custom domain (jika sudah tersedia)
- [ ] Setup HTTPS / SSL (otomatis di Vercel)
- [ ] Uji website di domain production

### 7.5 Pasang Analytics

- [ ] Install & konfigurasi Google Analytics 4:
  - Komponen `GoogleAnalytics` di root layout
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` di environment variable
- [ ] Setup event tracking:
  | Event | Trigger |
  |-------|---------|
  | `page_view` | Setiap halaman dikunjungi |
  | `cta_click` | Klik tombol CTA apapun |
  | `lead_submit` | Form leads berhasil submit |
  | `wa_click` | Klik tombol WhatsApp |
  | `kpr_simulate` | Kalkulator KPR digunakan |
  | `unit_view` | Halaman detail unit dibuka |
- [ ] Google Tag Manager (opsional, untuk kemudahan tracking di masa depan)

### Checklist Selesai Fase 7
- [ ] Website berfungsi di semua browser target
- [ ] Responsif di semua ukuran layar yang ditest
- [ ] Tidak ada broken link atau error console
- [ ] Website live di production
- [ ] Analytics melacak pengunjung dan event

---

## Data Statis (Placeholder)

Sebelum backend API tersedia, semua data ditampilkan dari file statis TypeScript. Struktur data yang harus disiapkan:

### `/data/units.ts`
```typescript
export interface Unit {
  slug: string;
  name: string;
  status: 'tersedia' | 'indent' | 'terjual';
  price: number;
  landArea: number;      // luas tanah (m²)
  buildingArea: number;  // luas bangunan (m²)
  bedrooms: number;
  bathrooms: number;
  carport: number;
  floors: number;
  electricity: string;   // "1300 VA"
  water: string;         // "PDAM"
  images: string[];      // path foto
  floorPlan: string;     // path denah
  description: string;
  features: string[];
  materials: {
    foundation: string;
    walls: string;
    roof: string;
    floor: string;
    frame: string;
  };
}
```

### `/data/facilities.ts`
```typescript
export interface Facility {
  name: string;
  description: string;
  icon: string;
  image: string;
}
```

### `/data/testimonials.ts`
```typescript
export interface Testimonial {
  name: string;
  unitType: string;
  quote: string;
  avatar: string;
  rating: number;
}
```

---

## Catatan Penting

1. **Mobile-First**: Selalu koding dimulai dari tampilan mobile, lalu tambahkan style untuk tablet dan desktop menggunakan breakpoint Tailwind (`sm:`, `md:`, `lg:`, `xl:`)
2. **Data Statis Dulu**: Semua data menggunakan file TypeScript statis. Ketika backend API siap, cukup ganti fungsi fetch data tanpa mengubah komponen UI
3. **Komponen Reusable**: Setiap komponen dibuat modular dan reusable. Jangan duplikasi kode
4. **Performa**: Selalu gunakan `next/image`, dynamic import untuk komponen berat, dan lazy loading
5. **Aksesibilitas**: Pastikan tab navigation, alt text, kontras warna, dan focus visible di semua elemen interaktif
6. **Konsistensi**: Selalu gunakan design tokens dari Tailwind config. Jangan hardcode warna/spacing

---

*Dokumen: website-marketing-frontend.md | Fase Pengembangan Frontend Only | Versi 1.0 | Februari 2026*
