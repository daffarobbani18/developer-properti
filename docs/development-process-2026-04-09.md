# Development Process Mingguan — Frontend Mobile

## Informasi Umum

- Minggu ke: 1
- Periode: 2026-04-03 - 2026-04-09
- Tanggal report: 2026-04-09
- Project: Ekosistem Digital Properti Terpadu
- PIC process report: Tim Frontend Mobile

## 1. Planning

- Target minggu ini:
  - menyiapkan baseline project mobile
  - menyiapkan struktur folder per domain/role
  - memastikan app dapat dijalankan di local
- Scope disepakati:
  - setup technical foundation dulu, fitur bisnis menyusul sprint berikutnya
- Perubahan scope:
  - ada tambahan aktivitas alignment struktur repository mengikuti upstream terbaru

## 2. Development

### Aktivitas Utama

1. Setup workspace mobile berbasis Expo + TypeScript pada folder `mobile/`.
2. Membuat struktur teknis untuk pemisahan concern:
   - screen auth
   - screen pengawas lapangan
   - screen customer
   - shared screen/component
3. Menyiapkan baseline entry screen di `mobile/App.tsx` sebagai titik integrasi fase berikutnya.

### Integrasi Antar Tim

1. Sinkronisasi arah struktur repositori lintas tim setelah update upstream (backend/frontend/mobile).
2. Menyepakati bahwa implementasi API contract mobile akan mengikuti endpoint final backend pada sprint berikutnya.

## 3. Review & Testing

- PR dibuat/merged/pending: belum ada PR fitur mobile khusus; minggu ini fokus setup baseline.
- Testing singkat:
  - startup app baseline: pass
  - validasi struktur folder: pass
- Bug penting minggu ini:
  - belum ada bug fungsional (karena fitur bisnis belum diaktifkan)

## 4. Deployment/Environment

- Environment: local/dev
- Build/deploy status: baseline berjalan lokal
- Isu environment/tooling:
  - beberapa proses dev server mobile sebelumnya masih lock directory saat cleanup struktur lama
  - belum ada pipeline CI khusus mobile

## 5. Blocker & Risiko

- Blocker utama:
  - implementasi fitur tertunda karena minggu ini terserap ke sinkronisasi struktur repo
- Risiko utama:
  - velocity fitur bisa turun jika API contract final terlambat
- Mitigasi:
  - lock scope sprint berikutnya hanya untuk auth + navigation + 2 API flow utama

## 6. Keputusan Minggu Ini

1. Arsitektur mobile dipusatkan di folder `mobile/` sesuai struktur upstream terbaru.
2. Pekerjaan minggu berikutnya diprioritaskan ke vertical slice end-to-end (login -> lihat data -> submit update), bukan menyebar ke semua modul sekaligus.

## 7. Action Minggu Berikutnya

| Action Item | PIC | Due Date |
|------------|-----|----------|
| Implementasi login + session persistence | FE Mobile | 2026-04-12 |
| Setup navigation + role guard (pengawas/customer) | FE Mobile | 2026-04-13 |
| Integrasi API unit/progres & update milestone | FE Mobile | 2026-04-15 |
| Implementasi form kendala + validasi input | FE Mobile | 2026-04-16 |
| Setup test baseline (lint/typecheck/runbook QA) | FE Mobile | 2026-04-17 |
