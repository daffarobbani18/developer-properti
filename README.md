# Developer Properti — Monorepo

Sistem Informasi Manajemen Developer Perumahan (SIMDP)

## Struktur Repository

```
developer-properti/
├── docs/                        # Dokumentasi & fase pengembangan
├── backend/                     # NestJS API (shared untuk semua app)
│   ├── src/
│   │   ├── modules/             # Domain modules
│   │   │   ├── auth/            # Autentikasi & JWT
│   │   │   ├── user/            # Manajemen user & role
│   │   │   ├── crm/             # CRM & Sales
│   │   │   ├── keuangan/        # Keuangan & Cashflow
│   │   │   ├── proyek/          # Monitoring Milestone
│   │   │   ├── vendor/          # Pengeluaran & Vendor
│   │   │   ├── legal/           # Legal & Perizinan
│   │   │   └── notifikasi/      # Notifikasi
│   │   ├── common/              # Shared utilities
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   └── pipes/
│   │   ├── config/              # Konfigurasi app
│   │   └── database/            # Database config & seeds
│   └── prisma/                  # Prisma schema & migrations
├── frontend/
│   ├── web-admin/               # Next.js — Web Admin (internal)
│   ├── web-marketing/           # Next.js — Website Marketing (publik)
│   ├── customer-portal/         # Next.js — Customer Portal (pembeli)
│   └── shared/                  # Komponen & utilitas bersama
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── utils/
├── mobile/                      # React Native — Mobile App
│   └── src/
│       ├── screens/
│       ├── components/
│       ├── navigation/
│       ├── services/
│       ├── hooks/
│       └── types/
└── packages/
    └── types/                   # Shared TypeScript types (BE & FE)
        └── src/
```

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Backend | NestJS + Prisma + PostgreSQL |
| Web Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Mobile | React Native (TBD) |
| Auth | JWT + Role-Based Access Control |

## Aplikasi

| App | Deskripsi | User |
|-----|-----------|------|
| Web Admin | Pusat kendali operasional | Tim internal (8 role) |
| Website Marketing | Showcase perumahan & lead capture | Publik |
| Customer Portal | Portal pembeli: tagihan, dokumen, progress | Pembeli |
| Mobile Lapangan | Laporan milestone & foto konstruksi | Site Engineer |
