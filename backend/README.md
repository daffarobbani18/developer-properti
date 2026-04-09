# Backend — NestJS API

Shared API server untuk semua aplikasi SIMDP.

## Tech Stack
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

## Modules
- `auth` — Autentikasi, JWT, refresh token
- `user` — Manajemen user, role, permission
- `crm` — CRM, leads, pipeline, transaksi
- `keuangan` — Cashflow, invoice, tagihan
- `proyek` — Milestone monitoring, progress
- `vendor` — Pengeluaran, vendor management
- `legal` — Perizinan, legalitas, dokumen
- `notifikasi` — Push notification, email, in-app

## Getting Started
```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev

# Run development server
npm run start:dev
```
