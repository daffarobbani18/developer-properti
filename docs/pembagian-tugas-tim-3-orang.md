# Pembagian Tugas Tim (3 Orang)

## Komposisi

1. Developer A (Anda): Web Internal + Backend
2. Developer B: Website Publik (Marketing)
3. Developer C: Mobile (Pengawas + Customer)

## Pembagian Scope Teknis

### 1) Developer A — Web Internal + Backend

- Folder utama:
  - `frontend/web-admin`
  - `backend`
- Tanggung jawab:
  - Arsitektur API, autentikasi, role, skema database Prisma
  - Modul ERP internal: CRM, transaksi, finance, legal, master unit
  - Kontrak API untuk publik website dan mobile
- Deliverable awal:
  - Prisma schema v1 + migration awal
  - Endpoint Auth + Users + Units + Leads + Transactions + Payments + ProgressLogs + Tickets
  - Dokumentasi endpoint (request/response)

### 2) Developer B — Website Publik (Marketing)

- Folder utama:
  - `frontend/web-public-portal` (area public)
- Tanggung jawab:
  - Halaman publik: `/`, `/tipe-rumah`, `/galeri`, `/simulasi-kpr`, `/kontak`
  - Form minat yang masuk ke endpoint leads
  - Tampilan stok unit real-time (status warna)
- Deliverable awal:
  - Layout publik + komponen marketing reusable
  - Integrasi API list unit & create lead

### 3) Developer C — Mobile (Pengawas + Customer)

- Folder utama:
  - `mobile`
- Tanggung jawab:
  - Role Pengawas: update progres, upload foto, kendala
  - Role Customer: progres unit, kuitansi, sertifikat, tiket komplain
  - Navigasi role-based dan state auth mobile
- Deliverable awal:
  - Struktur screen auth/pengawas/customer
  - Integrasi endpoint login, progress logs, tickets, payments

## Aturan Kerja Kolaborasi

1. Branching
- `main`: stabil
- `develop`: integrasi
- fitur per orang:
  - `feature/backend-webadmin-*`
  - `feature/web-public-*`
  - `feature/mobile-*`

2. Integration Contract (wajib disepakati dulu)
- Naming enum status unit: `AVAILABLE`, `BOOKED`, `SOLD`
- Format respons API konsisten (success/data/message/error)
- Field tanggal standar ISO-8601
- ID menggunakan UUID

3. Ritme Sinkronisasi
- Daily sync 15 menit
- Freeze kontrak API mingguan
- Merge ke `develop` minimal 2x per minggu

## Urutan Implementasi Paling Aman

1. Backend v1 + auth + master unit (Developer A)
2. Website publik consume unit + kirim leads (Developer B)
3. Mobile auth + baca progress dasar (Developer C)
4. Transaksi/finance + progress logs + tickets full
5. Hardening, testing integrasi, dan UAT
