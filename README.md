# Developer Properti — Monorepo

Sistem Informasi Manajemen Developer Perumahan (SIMDP)

## Struktur Repository

```
developer-properti/
├── docs/                        # Dokumentasi & fase pengembangan
├── backend/                     # Express API (shared untuk semua app)
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
│   ├── web-public-portal/       # Next.js — Website Publik + Portal Customer
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
| Backend | Node.js (Express) + Prisma + PostgreSQL |
| Web Frontend | Next.js + Tailwind CSS + shadcn/ui |
| Mobile | React Native (Expo) |
| Auth | JWT + Role-Based Access Control |

## Aplikasi

| App | Deskripsi | User |
|-----|-----------|------|
| Web Admin | Pusat kendali operasional | Tim internal (8 role) |
| Website Publik + Portal Customer | Marketing publik + area customer terproteksi | Publik & Pembeli |
| Mobile Lapangan | Laporan milestone & foto konstruksi | Site Engineer |

## Port Development

- Web Admin: `http://localhost:3001`
- Website Publik + Portal: `http://localhost:3002`
- Backend API: `http://localhost:4000`
- Expo Metro (Mobile): `http://localhost:8082`

## Commands (from repository root)

```bash
npm run install:all
npm run dev:web-admin
npm run dev:web-public
npm run dev:backend
npm run dev:mobile
```
