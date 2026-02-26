# Arsitektur Sistem — SIMDP
# Sistem Informasi Manajemen Developer Perumahan

---

## Daftar Isi

1. [Gambaran Arsitektur Keseluruhan](#1-gambaran-arsitektur-keseluruhan)
2. [Diagram Alur Pengguna (User Flow)](#2-diagram-alur-pengguna-user-flow)
3. [Arsitektur Aplikasi & Modul](#3-arsitektur-aplikasi--modul)
4. [Alur Data Antar Modul (Data Flow)](#4-alur-data-antar-modul-data-flow)
5. [Arsitektur Teknis (Tech Stack)](#5-arsitektur-teknis-tech-stack)
6. [Integrasi Sistem Eksternal](#6-integrasi-sistem-eksternal)
7. [Hak Akses & Keamanan](#7-hak-akses--keamanan)
8. [Alur Proses Per Modul](#8-alur-proses-per-modul)

---

## 1. Gambaran Arsitektur Keseluruhan

```
╔══════════════════════════════════════════════════════════════════════════╗
║                        SIMDP PLATFORM                                   ║
║                                                                          ║
║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  ║
║  │   WEB ADMIN     │  │ MOBILE LAPANGAN │  │    CUSTOMER PORTAL      │  ║
║  │  (Back Office)  │  │  (Android/iOS)  │  │   (Web + Android/iOS)   │  ║
║  │                 │  │                 │  │                         │  ║
║  │ • CRM & Sales   │  │ • Foto milestone│  │ • Pantau progres unit   │  ║
║  │ • Keuangan      │  │ • Upload foto   │  │ • Tagihan & pembayaran  │  ║
║  │ • Mon. Milestone│  │ • Lap. kendala  │  │ • Unduh dokumen         │  ║
║  │ • Pengel.&Vendor│  │ • BA kontraktor │  │ • Komplain & tiket      │  ║
║  │ • Legal         │  │                 │  │ • Notifikasi            │  ║
║  └────────┬────────┘  └────────┬────────┘  └───────────┬─────────────┘  ║
║           │                    │                        │                ║
║           └────────────────────┴────────────────────────┘                ║
║                                │                                         ║
║                    ┌───────────┴────────────┐                            ║
║                    │      API GATEWAY        │                            ║
║                    │   (REST API / HTTPS)    │                            ║
║                    └───────────┬────────────┘                            ║
║                                │                                         ║
║                    ┌───────────┴────────────┐                            ║
║                    │    BACKEND SERVER       │                            ║
║                    │  (Business Logic Layer) │                            ║
║                    └───────────┬────────────┘                            ║
║                                │                                         ║
║                    ┌───────────┴────────────┐                            ║
║                    │       DATABASE          │                            ║
║                    │     (PostgreSQL)        │                            ║
║                    └────────────────────────┘                            ║
║                                                                          ║
║  ┌──────────────────────────────────────────────────────────────────┐    ║
║  │                   WEBSITE MARKETING (Publik)                     │    ║
║  │          Landing Page · Galeri · Simulasi KPR · Form Leads       │    ║
║  └──────────────────────────────────────────────────────────────────┘    ║
╚══════════════════════════════════════════════════════════════════════════╝
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
     ┌──────┴──────┐   ┌────────┴───────┐   ┌───────┴──────┐
     │ WhatsApp API│   │   Bank / KPR   │   │    Email     │
     │  (Notifikasi│   │  (Integrasi    │   │   Service    │
     │   & Chat)   │   │  Pembayaran)   │   │              │
     └─────────────┘   └────────────────┘   └──────────────┘
```

---

## 2. Diagram Alur Pengguna (User Flow)

### A. Alur Calon Pembeli → Pembeli

```mermaid
flowchart TD
    A([Calon Pembeli]) --> B[Kunjungi Website Marketing]
    B --> C[Lihat Galeri & Simulasi KPR]
    C --> D[Isi Form Leads]
    D --> E[(CRM: Leads Masuk Otomatis)]
    E --> F[Sales Terima Notifikasi]
    F --> G[Sales Follow-up]
    G --> H{Tertarik?}
    H -- Tidak --> I[Sales Nurturing / Re-follow-up]
    I --> H
    H -- Ya --> J[Survey Lokasi]
    J --> K[Negosiasi Harga & Unit]
    K --> L[Booking + Bayar Tanda Jadi]
    L --> M[Tanda Tangan SPK]
    M --> N{Skema Bayar?}
    N -- KPR --> O[Pengajuan KPR ke Bank]
    O --> P{KPR Disetujui?}
    P -- Ya --> Q[Bank Bayar ke Developer]
    P -- Tidak --> R[Cari Bank Lain / Skema Lain]
    N -- Tunai --> S[Pelunasan Langsung]
    Q --> T[Akad Jual Beli di Notaris]
    S --> T
    T --> U[Akun Customer Portal Dibuat]
    U --> V([Pembeli Bisa Pantau Progres])
```

---

### B. Alur Tim Lapangan → Update Milestone

```mermaid
flowchart TD
    A([Site Engineer]) --> B[Buka Mobile App]
    B --> C[Pilih Proyek & Unit]
    C --> D[Pilih Milestone yang Selesai]
    D --> E[Upload Foto Bukti Milestone]
    E --> F[Tandai Milestone: Selesai]
    F --> G{Ada Kendala / Deviasi?}
    
    G -- Ya --> H[Catat Kendala & Kategori]
    H --> I[Eskalasi ke Manajer Proyek]
    I --> J[Manajer Tindak Lanjut]
    G -- Tidak --> K[(Database: Milestone Tersimpan)]
    J --> K
    K --> L[Progres Unit Diperbarui Otomatis]
    L --> M[Customer Portal: Foto Milestone Tampil]
    L --> N[Dashboard Manajer Proyek Diperbarui]
```

---

### C. Alur Pembayaran Kontraktor (Pengeluaran & Vendor)

```mermaid
flowchart TD
    A([Manajer Proyek]) --> B[Terima Tagihan Termin
dari Kontraktor]
    B --> C[Cek Progres Konstruksi
sesuai Milestone?]
    C -- Belum sesuai --> D[Notifikasi Penolakan
ke Kontraktor]
    D --> E[Kontraktor Selesaikan
Milestone]
    E --> C
    C -- Sesuai --> F[Buat Pengajuan
Pembayaran Termin]
    F --> G{Nilai Tagihan?}
    G -- < Rp 50 juta --> H[Approval
Manajer Finance]
    G -- ≥ Rp 50 juta --> I[Approval
Direktur]
    H --> J{Disetujui?}
    I --> J
    J -- Tidak --> K[Notifikasi Penolakan
+ Alasan]
    K --> F
    J -- Ya --> L[Transfer ke
Rekening Kontraktor]
    L --> M[(Pengeluaran Tercatat
di Modul Keuangan)]
    M --> N[Berita Acara
Termin Tersimpan]
```

---

## 3. Arsitektur Aplikasi & Modul

```
SIMDP — 4 APLIKASI & 7 MODUL
═══════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────┐
│                      WEB ADMIN                              │
│                   (Browser / Laptop)                        │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   MODUL 1    │   MODUL 2    │   MODUL 5    │   MODUL 6      │
│ CRM & Sales  │  Keuangan &  │  Monitoring  │ Pengeluaran &  │
│              │  Cashflow    │  Milestone   │    Vendor      │
├──────────────┴──────────────┴──────────────┴────────────────┤
│           MODUL 4            │          MODUL 7              │
│      Website Marketing       │     Legal & Perizinan         │
│      (embed/terintegrasi)    │                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   MOBILE LAPANGAN                           │
│    (Android / iOS — Site Engineer & Manajer Proyek)         │
├─────────────────────────────────────────────────────────────┤
│              Sub-modul: Monitoring Milestone                │
│  Update foto & progres milestone  ·  Laporan kendala        │
│  BA termin kontraktor  ·  Eskalasi masalah ke manajer       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CUSTOMER PORTAL                           │
│            (Web Browser + Android / iOS)                    │
├─────────────────────────────────────────────────────────────┤
│                      MODUL 3                                │
│                  Customer Portal                            │
│  • Progres unit    • Tagihan    • Dokumen    • Komplain      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  WEBSITE MARKETING                          │
│                  (Website Publik)                           │
├─────────────────────────────────────────────────────────────┤
│                      MODUL 4                                │
│  Landing page · Galeri · Virtual Tour · Simulasi KPR        │
│  Form Leads ──────────────────────────────► Modul CRM       │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Alur Data Antar Modul (Data Flow)

```mermaid
flowchart LR
    WM[Website Marketing\nModul 4]
    CRM[CRM & Sales\nModul 1]
    KEU[Keuangan & Cashflow\nModul 2]
    CP[Customer Portal\nModul 3]
    PM[Monitoring Milestone\nModul 5]
    PRO[Pengeluaran & Vendor\nModul 6]
    LEG[Legal & Perizinan\nModul 7]

    WM -- Form leads --> CRM
    CRM -- Data pembeli + unit terjual --> KEU
    CRM -- Data pembeli --> CP
    KEU -- Status pembayaran --> CP
    PM -- Foto & progres milestone --> CP
    PM -- Tagihan termin kontraktor --> PRO
    PRO -- Biaya kontraktor aktual --> KEU
    LEG -- Status izin proyek --> PM
    KEU -- Budget tersisa --> PRO
```

---

### Matriks Keterhubungan Modul

```
             ┌────┬─────┬────┬─────┬─────┬─────┬─────┐
             │CRM │KEU  │CP  │WM   │PM   │PRO  │LEG  │
─────────────┼────┼─────┼────┼─────┼─────┼─────┼─────┤
CRM & Sales  │ —  │ ──► │ ──►│ ◄── │     │     │     │
Keuangan     │ ◄──│  —  │ ──►│     │     │ ◄── │     │
Cust. Portal │ ◄──│ ◄── │ — │     │ ◄── │     │     │
Website Mktg │ ──►│     │    │  —  │     │     │     │
Mon. Milest. │    │     │ ──►│     │  —  │ ──► │ ◄── │
Pengel.&Vend │    │ ──► │    │     │ ◄── │  —  │     │
Legal        │    │     │    │     │ ──► │     │  —  │
─────────────┴────┴─────┴────┴─────┴─────┴─────┴─────┘

Keterangan: ──► = mengirim data ke modul tersebut
```

---

## 5. Arsitektur Teknis (Tech Stack)

```
╔══════════════════════════════════════════════════════════════╗
║                    LAYER PRESENTASI                         ║
╠══════════════════╦═══════════════╦══════════════════════════╣
║   Web Admin      ║    Mobile     ║   Customer Portal        ║
║   Next.js        ║  React Native ║   Next.js (Web)          ║
║   (React.js)     ║  (Android/iOS)║   React Native (Mobile)  ║
╠══════════════════╩═══════════════╩══════════════════════════╣
║              LAYER KOMUNIKASI                               ║
║          REST API  ·  HTTPS  ·  JWT Auth                    ║
╠══════════════════════════════════════════════════════════════╣
║                    LAYER BISNIS                             ║
║            Backend Server (Node.js / Laravel)               ║
║                                                             ║
║  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌─────────────┐  ║
║  │  Auth &  │ │ Business │ │Notification│ │   File      │  ║
║  │  RBAC    │ │  Logic   │ │  Service   │ │  Storage    │  ║
║  └──────────┘ └──────────┘ └────────────┘ └─────────────┘  ║
╠══════════════════════════════════════════════════════════════╣
║                     LAYER DATA                              ║
║            PostgreSQL (Database Utama)                      ║
║            Redis (Cache & Session)                          ║
║            AWS S3 / GCS (Foto & Dokumen)                    ║
╠══════════════════════════════════════════════════════════════╣
║                  LAYER INFRASTRUKTUR                        ║
║          Cloud Server (AWS / GCP / Azure)                   ║
║          SSL Certificate · CDN · Auto-Scaling               ║
╚══════════════════════════════════════════════════════════════╝
```

### Detail Stack per Komponen

| Layer | Komponen | Teknologi | Fungsi |
|-------|----------|-----------|--------|
| Frontend | Web Admin | Next.js / React.js | Antarmuka tim internal |
| Frontend | Mobile Lapangan | React Native | Laporan & foto dari lapangan |
| Frontend | Customer Portal Web | Next.js | Portal pembeli via browser |
| Frontend | Customer Portal Mobile | React Native | Portal pembeli via HP |
| Frontend | Website Marketing | Next.js | Website publik perumahan |
| API | Gateway | REST API + HTTPS | Komunikasi frontend ↔ backend |
| Auth | Keamanan | JWT + RBAC | Token login + hak akses per jabatan |
| Backend | Server Utama | Node.js / Laravel | Business logic semua modul |
| Backend | Notifikasi | Firebase Cloud Messaging | Push notif ke HP |
| Backend | Email | SendGrid / Mailgun | Email otomatis ke pengguna |
| Backend | WhatsApp | WhatsApp Business API | Notifikasi & pesan ke WA |
| Database | Utama | PostgreSQL | Penyimpanan semua data bisnis |
| Database | Cache | Redis | Percepat query yang sering diakses |
| Storage | File | AWS S3 / Google Cloud Storage | Simpan foto, dokumen, sertifikat |
| Infrastruktur | Server | AWS / GCP / Azure | Hosting cloud |
| Infrastruktur | Keamanan | SSL + enkripsi AES | Enkripsi data sensitif |

---

## 6. Integrasi Sistem Eksternal

```mermaid
flowchart TD
    SIMDP[SIMDP Backend Server]

    subgraph Notifikasi
        WA[WhatsApp Business API]
        EMAIL[Email Service\nSendGrid / Mailgun]
        FCM[Firebase Cloud Messaging\nPush Notifikasi HP]
    end

    subgraph Keuangan
        BANK[Bank Partner\nIntegrasi KPR]
        VA[Virtual Account\nPayment Gateway]
        QRIS[QRIS\nDompet Digital]
    end

    subgraph Marketing
        GADS[Google Ads\nTracking Leads]
        META[Meta Ads\nFacebook / Instagram]
        MKTPLACE[Marketplace Properti\nRumah123 / OLX]
    end

    SIMDP <--> WA
    SIMDP <--> EMAIL
    SIMDP <--> FCM
    SIMDP <--> BANK
    SIMDP <--> VA
    SIMDP <--> QRIS
    SIMDP <-- tracking pixel --> GADS
    SIMDP <-- tracking pixel --> META
    SIMDP <-- form API --> MKTPLACE
```

### Detail Integrasi

| Sistem Eksternal | Tujuan Integrasi | Arah Data |
|-----------------|-----------------|-----------|
| WhatsApp Business API | Kirim notifikasi reminder cicilan, update progres, info serah terima | SIMDP → Pengguna |
| Email (SendGrid) | Kirim tagihan, konfirmasi, dokumen digital | SIMDP → Pengguna |
| Firebase (FCM) | Push notifikasi ke aplikasi mobile | SIMDP → HP Pengguna |
| Bank / KPR | Terima notifikasi persetujuan KPR & pencairan dana | Bank → SIMDP |
| Virtual Account | Pembayaran cicilan & IPL dari pembeli | Pembeli → Bank → SIMDP |
| QRIS | Pembayaran digital | Pembeli → SIMDP |
| Google Ads | Tracking sumber leads dari iklan Google | Google → SIMDP |
| Meta Ads (FB/IG) | Tracking sumber leads dari iklan Facebook/Instagram | Meta → SIMDP |
| Marketplace Properti | Leads dari Rumah123 / OLX masuk otomatis ke CRM | Marketplace → SIMDP |

---

## 7. Hak Akses & Keamanan

### Diagram Hak Akses (Role-Based Access Control / RBAC)

```
PENGGUNA            APLIKASI          MODUL YANG BISA DIAKSES
════════            ════════          ══════════════════════════

Direktur ──────────► Web Admin ──────► Semua modul (full view)

Manajer Sales ─────► Web Admin ──────► CRM, Marketing, Customer Portal

Tim Sales ─────────► Web Admin ──────► CRM (unit yang ditangani)
                                        Customer Portal (unit sendiri)

Manajer Finance ───► Web Admin ──────► Keuangan, Pengeluaran & Vendor (approval)

Admin Finance ─────► Web Admin ──────► Keuangan

Manajer Proyek ────► Web Admin ──────► Monitoring Milestone, Pengeluaran & Vendor, Legal
                   ► Mobile App ─────► Semua fitur lapangan

Site Engineer ─────► Mobile App ─────► Update milestone, upload foto, laporan kendala

Admin Legal ───────► Web Admin ──────► Legal & Perizinan

Pembeli ───────────► Customer Portal ► Unit milik sendiri saja
```

### Tabel Hak Akses per Modul

| Role | CRM | Keuangan | Cust. Portal | Mon. Milestone | Pengel. & Vendor | Legal |
|------|-----|----------|--------------|:--------------:|:----------------:|-------|
| Direktur | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Manajer Sales | ✅ Full | ❌ | ✅ Full | 👁 Lihat | ❌ | ❌ |
| Tim Sales | ✅ Terbatas | ❌ | ✅ Terbatas | ❌ | ❌ | ❌ |
| Manajer Finance | ❌ | ✅ Full | ❌ | 👁 Lihat | ✅ Approval | ❌ |
| Admin Finance | ❌ | ✅ Input | ❌ | ❌ | ❌ | ❌ |
| Manajer Proyek | 👁 Lihat | 👁 Lihat | ❌ | ✅ Full | ✅ Full | ✅ Full |
| Site Engineer | ❌ | ❌ | ❌ | ✅ Lapangan | ❌ | ❌ |
| Admin Legal | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ Full |
| Pembeli | ❌ | ❌ | ✅ Unit sendiri | ❌ | ❌ | ❌ |

> **Keterangan:** ✅ Full = baca + tulis penuh | ✅ Terbatas = hanya data yang relevan | 👁 Lihat = read-only | ❌ = tidak bisa akses

### Layer Keamanan Sistem

```
REQUEST DARI PENGGUNA
        │
        ▼
┌───────────────────┐
│   HTTPS / SSL     │  ← Enkripsi semua data dalam perjalanan
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  API Rate Limiter │  ← Batasi percobaan login berlebihan
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  JWT Auth Token   │  ← Verifikasi identitas pengguna
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  RBAC Middleware  │  ← Cek hak akses sesuai role
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Business Logic   │  ← Proses request
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Database (enkr.) │  ← Data sensitif dienkripsi saat disimpan
└───────────────────┘
```

---

## 8. Alur Proses Per Modul

### Modul 1 — CRM & Sales: Alur Pipeline

```mermaid
stateDiagram-v2
    [*] --> Leads : Masuk dari website/WA/pameran
    Leads --> FollowUp : Sales dihubungi
    FollowUp --> Leads : Belum respons (auto reminder)
    FollowUp --> Survey : Calon pembeli setuju survey
    Survey --> Negosiasi : Tertarik
    Survey --> FollowUp : Butuh waktu
    Negosiasi --> Booking : Sepakat harga & unit
    Negosiasi --> FollowUp : Belum sepakat
    Booking --> SPK : Tanda tangan perjanjian
    SPK --> ProsesKPR : Bayar via KPR
    SPK --> Akad : Bayar tunai
    ProsesKPR --> Akad : KPR disetujui bank
    ProsesKPR --> SPK : KPR ditolak, cari opsi lain
    Akad --> [*] : Unit TERJUAL — akun portal dibuat
```

---

### Modul 2 — Keuangan: Alur Cashflow

```mermaid
flowchart LR
    subgraph PEMASUKAN
        A1[Booking Fee\nCalon Pembeli]
        A2[DP / Cicilan\nPembeli]
        A3[Pencairan KPR\ndari Bank]
        A4[Kredit Konstruksi\ndari Bank]
    end

    subgraph SISTEM_KEUANGAN[SISTEM KEUANGAN]
        B1[Catat Pemasukan]
        B2[Monitor vs Budget]
        B3[Proyeksi Cashflow]
        B4[Alert Dini]
    end

    subgraph PENGELUARAN
        C1[Bayar Kontraktor\n& Subkon]
        C2[Bayar Supplier\nMaterial]
        C3[Biaya Marketing\n& Sales]
        C4[Biaya Perizinan\n& Legal]
        C5[Biaya Operasional\nKantor]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B2 --> C1 & C2 & C3 & C4 & C5
```

---

### Modul 5 — Monitoring Milestone: Alur Pengawasan Kontraktor

```mermaid
flowchart TD
    A[Kickoff Proyek &\nKontrak Kontraktor] --> B[Tentukan Milestone\n& Jadwal Termin]
    B --> C{Kontraktor Bekerja}

    C --> D[Site Engineer Cek\nLapangan Berkala]
    D --> E{Milestone Selesai?}
    E -- Belum --> F[Catat Progres &\nEstimasi Selesai]
    F --> G{Ada Kendala?}
    G -- Ya --> H[Laporan Kendala\nke Manajer Proyek]
    H --> I[Tindak Lanjut &\nNegosiasiasi Kontraktor]
    I --> C
    G -- Tidak --> C
    E -- Selesai --> J[Upload Foto\nMilestone]
    J --> K[Update Status:\nMilestone ✅]
    K --> L[(Database Progres\nUnit Diperbarui)]
    L --> M[Customer Portal\nFoto & % Tampil]
    L --> N[Kontraktor Bisa\nAjukan Termin]
```

---

### Modul 6 — Pengeluaran & Vendor: Alur Pembayaran Kontraktor

```mermaid
flowchart TD
    A([Kontraktor Ajukan\nTagihan Termin]) --> B[Manajer Proyek\nVerifikasi Milestone]
    B --> C{Milestone Sesuai\nKontrak?}
    C -- Tidak --> D[Kembalikan ke\nKontraktor]
    D --> E[Kontraktor Perbaiki\nPekerjaan]
    E --> B
    C -- Ya --> F[Buat Pengajuan\nPembayaran]
    F --> G{Nilai Termin}
    G -- < Rp 50 juta --> H[Approval\nManajer Finance]
    G -- ≥ Rp 50 juta --> I[Approval\nDirektur]
    H --> J{Disetujui?}
    I --> J
    J -- Tidak --> K[Notifikasi Penolakan\n+ Alasan]
    K --> F
    J -- Ya --> L[Proses Transfer\nke Kontraktor]
    L --> M[Berita Acara Termin\nDitandatangani]
    M --> N[(Pengeluaran Tercatat\ndi Modul Keuangan)]
    N --> O[Update RAB vs\nRealisasi Otomatis]
```

---

### Modul 7 — Legal: Alur Perizinan

```mermaid
flowchart TD
    A([Proyek Baru]) --> B[Input Semua\nDokumen Wajib]
    B --> C{Cek Kelengkapan}
    C -- Belum Lengkap --> D[Alert: Dokumen\nBelum Tersedia]
    D --> E[Ajukan ke\nInstansi Terkait]
    E --> F[Update Status:\nSedang Diproses]
    F --> G{Dokumen Terbit?}
    G -- Belum --> F
    G -- Ya --> H[Upload Dokumen\nke Repositori]
    H --> I[Set Tanggal\nKadaluarsa]
    I --> J[Sistem Monitor\nMasa Berlaku]

    C -- Lengkap --> J

    J --> K{90 Hari Sebelum\nKadaluarsa?}
    K -- Ya --> L[Kirim Peringatan\nPertama]
    L --> M{30 Hari Sebelum?}
    M -- Ya --> N[Kirim Peringatan\nKedua]
    N --> O{7 Hari Sebelum?}
    O -- Ya --> P[Alert Darurat\nke Manajer & Direktur]
    P --> E
```

---

*Dokumen: arsitektur-sistem.md | Versi 1.0 | Februari 2026*
*Dibuat sebagai lampiran teknis dari proposal-proyek.md*
