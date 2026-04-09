# SIMDP Monorepo

Monorepo implementasi Sistem Informasi Manajemen Developer Perumahan (SIMDP).

## Aplikasi

- `apps/api`: Backend API (Express + Prisma + PostgreSQL/SQLite)
- `apps/website-marketing`: Website publik marketing (Next.js)
- `apps/web-admin`: Aplikasi internal admin (Next.js)
- `apps/customer-portal`: Portal pembeli web (Next.js)
- `apps/mobile-lapangan`: Aplikasi lapangan (Expo React Native)
- `apps/mobile-customer`: Aplikasi pelanggan (Expo React Native)
- `packages/shared`: Shared types dan utilities

## Menjalankan

1. Install dependency: `pnpm install`
2. Setup env backend: salin `apps/api/.env.example` menjadi `apps/api/.env`
3. Generate Prisma client: `pnpm db:generate`
4. Migrasi database: `pnpm db:migrate`
5. Seed data: `pnpm db:seed`
6. Jalankan per app sesuai kebutuhan, contoh:
   - API: `pnpm dev:api`
   - Marketing: `pnpm dev:marketing`
   - Web Admin: `pnpm dev:web-admin`
   - Portal: `pnpm dev:portal`
   - Mobile Lapangan: `pnpm dev:mobile-lapangan`
   - Mobile Customer: `pnpm dev:mobile-customer`

## Akun Seed (Default)

Semua akun seed menggunakan password: `Password123!`

- Direktur: `direktur@simdp.local`
- Sales Manager: `sales.manager@simdp.local`
- Sales: `sales@simdp.local`
- Finance Manager: `finance.manager@simdp.local`
- Finance Admin: `finance@simdp.local`
- Project Manager: `pm@simdp.local`
- Site Engineer: `engineer@simdp.local`
- Legal Admin: `legal@simdp.local`
- Customer: `customer@simdp.local`

## Validasi

- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Build: `pnpm build`

Dokumentasi teknis tambahan tersedia di `docs/`.
