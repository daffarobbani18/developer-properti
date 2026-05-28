# Fase 9: Dasbor Eksekutif & Analitik (Executive Reporting)

Fase ini mengimplementasikan Endpoint khusus untuk memberikan ringkasan (summary) performa bisnis ke level eksekutif, direktur, dan superadmin.

## Tujuan
1. Memberikan agregat performa inventori (kavling/unit tersedia, terjual, dll).
2. Memberikan agregat total pendapatan masuk.
3. Melaporkan tren jumlah penjualan per bulan.

## Teknologi & Pendekatan
- **Arsitektur:** Domain-Driven Modular (src/modules/reporting).
- **Validasi:** Menggunakan Zod DTO (eport-query.dto.ts) untuk memvalidasi *query parameters* (rentang tanggal opsional).
- **Efisiensi:** Menggunakan Promise.all dan fitur agregasi bawaan Prisma (groupBy, ggregate) untuk menghindari masalah N+1 Query.

## Struktur File
- src/modules/reporting/dto/report-query.dto.ts (Zod validation)
- src/modules/reporting/reporting.service.ts (Business logic & agregasi Prisma)
- src/modules/reporting/reporting.controller.ts (Penggabungan respon API)
- src/modules/reporting/reporting.routes.ts (Definisi Endpoint & Swagger Docs)

## Endpoint yang Tersedia
- \GET /api/reports/dashboard\ - (Role: Director, Superadmin)

## Penggunaan Filter Tanggal
Direksi dapat menambahkan *Query Parameter* \startDate\ dan \endDate\ berformat ISO-8601 (cth: \2026-01-01T00:00:00.000Z\) untuk memfilter agregat keuangan dan tren sales berdasarkan waktu tertentu.
