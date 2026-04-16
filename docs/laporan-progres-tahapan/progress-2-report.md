# Progress 2 Report - Fitur Inti Operasional Frontend Mobile

## Informasi Tahap

- Tahap: Progress 2
- Periode: 2026-04-10 sampai 2026-04-16
- Fokus: Fitur inti operasional lintas role
- Kategori: Big Progress
- Status: Selesai

## Ringkasan Big Progress

Tahap ini menandai transisi dari fondasi teknis menjadi aplikasi mobile yang memiliki kapabilitas bisnis inti: autentikasi dan session, navigasi berbasis role, offline queue untuk update milestone, lampiran media lintas alur utama, dan baseline push notification.

## 1. Realisasi Valid (Sudah Dikerjakan)

1. Auth dan session management berjalan, termasuk auto-lock saat inaktif.
2. Navigasi role-based aktif untuk Pengawas dan Customer.
3. Offline queue milestone aktif dengan mekanisme auto sync saat koneksi kembali.
4. Lampiran media (kamera/galeri) tersedia pada alur utama:
   - Pengawas: milestone dan kendala
   - Customer: bukti pembayaran dan tiket bantuan
5. Baseline push notification tersedia:
   - permission flow
   - registrasi token
   - parsing payload
   - redirection tab sesuai role
6. Validasi teknis lulus:
   - TypeScript compile check
   - Expo health check

## 2. Detail Teknis Implementasi

### 2.1 Alur Auth dan Session

1. User login melalui screen autentikasi.
2. Auth state disimpan untuk session restore.
3. Session dipantau saat perubahan state aplikasi.
4. Auto-lock dipicu ketika inaktivitas melewati batas waktu.

### 2.2 Alur Navigasi Berbasis Role

1. Setelah autentikasi, role user ditentukan dari auth state.
2. Navigator memilih tab sesuai role (`Pengawas` atau `Customer`).
3. Tab utama dipisah sehingga menu dan flow per role tidak bercampur.

### 2.3 Alur Offline Queue Milestone

1. Saat koneksi tidak tersedia, payload update milestone dimasukkan ke queue lokal.
2. Queue disimpan pada storage agar tidak hilang saat app restart.
3. Saat koneksi pulih, queue diproses berurutan dan disinkronkan ke API.
4. UI menampilkan indikator jumlah antrean untuk observability lapangan.

### 2.4 Alur Lampiran Media

1. User memilih sumber lampiran: kamera atau galeri.
2. URI media tervalidasi sebelum dikirim.
3. Payload media diikat ke flow bisnis terkait (milestone, issue, payment, ticket).
4. Service data meneruskan payload ke API atau fallback mock bila endpoint belum final.

### 2.5 Alur Push Notification Baseline

1. App meminta izin notifikasi dan menyiapkan channel Android.
2. Token Expo diregistrasikan melalui API wrapper.
3. Payload notifikasi diparsing secara typed, termasuk alias field route/screen/tab.
4. Navigator melakukan redirection tab berbasis role dari respons notifikasi.

## 3. Matriks Modul Inti dan Tanggung Jawab

| Modul | Tanggung Jawab Teknis |
|------|------------------------|
| `src/hooks/useAuth.tsx` | Lifecycle autentikasi dan kontrol session |
| `src/navigation/AppNavigator.tsx` | Pemilihan tab berdasarkan role |
| `src/hooks/useOfflineQueue.ts` | Penyimpanan dan sinkronisasi queue offline |
| `src/services/media.ts` | Akses kamera/galeri dan validasi hasil picker |
| `src/services/notifications.ts` | Registrasi token, listener, dan parser payload |
| `src/services/api.ts` | Kontrak API frontend dan fallback-safe wrapper |
| `src/AppRoot.tsx` | Bootstrap aplikasi dan integrasi notifikasi global |
| `src/screens/*` | Implementasi flow bisnis per role |

## 4. Bukti Verifikasi Teknis

| Jenis Bukti | Artefak | Lokasi |
|------------|---------|--------|
| Referensi commit utama | Implementasi API dan flow mobile inti | `docs/laporan-progres-tahapan/evidence/progress-2/commit-fe22e2b.txt` |
| Referensi commit dokumentasi | Riwayat laporan mingguan sebelumnya | `docs/laporan-progres-tahapan/evidence/progress-2/commit-3fc8c7e.txt` |
| Validasi compile | Hasil `npx tsc --noEmit` | `docs/laporan-progres-tahapan/evidence/progress-2/validation-2026-04-16.md` |
| Bukti visual | Checklist screenshot tahap 2 | `docs/laporan-progres-tahapan/evidence/progress-2/screenshot-checklist.md` |

Catatan verifikasi visual: sampai dokumen ini dibuat, screenshot belum terlampir di repository. Daftar screenshot prioritas sudah dicatat di checklist evidence tahap 2.

## 5. Keterlacakan Proses ke Hasil

| Aktivitas Proses | Dampak Teknis | Hasil Progres |
|------------------|---------------|---------------|
| Implementasi auth + session | Menambahkan kontrol login, restore, dan auto-lock | Auth lifecycle berjalan pada flow mobile |
| Implementasi role-based navigation | Memisahkan jalur menu pengawas dan customer | Navigasi lintas role stabil |
| Implementasi offline queue | Menambah reliability saat kondisi jaringan fluktuatif | Update milestone tetap dapat dikirim |
| Implementasi media attachment | Menambah dukungan bukti lapangan dan customer | Flow milestone, issue, billing, support lebih lengkap |
| Implementasi push baseline | Menambah channel update asinkron berbasis role | Respons notifikasi dapat mengarahkan tab aplikasi |

## 6. Bukti Pekerjaan (Referensi Kode)

- mobile/src/hooks/useAuth.tsx
- mobile/src/services/storage.ts
- mobile/src/navigation/AppNavigator.tsx
- mobile/src/hooks/useOfflineQueue.ts
- mobile/src/services/media.ts
- mobile/src/services/notifications.ts
- mobile/src/AppRoot.tsx
- mobile/src/services/api.ts
- mobile/src/screens/pengawas/FieldMilestonesScreen.tsx
- mobile/src/screens/pengawas/FieldIssuesScreen.tsx
- mobile/src/screens/customer/CustomerBillingScreen.tsx
- mobile/src/screens/customer/CustomerSupportScreen.tsx
- docs/progress-report-2026-04-16.md

## 7. Dampak Signifikan

1. Aplikasi mobile mencapai vertical slice yang dapat dipakai untuk proses operasional utama.
2. Reliability meningkat melalui kemampuan offline queue dan sinkronisasi otomatis.
3. Alur komunikasi update meningkat melalui fondasi push notification.

## 8. Item yang Belum Diakui Selesai pada Tahap Ini

1. Deep-link ke entity detail dari payload notifikasi belum final.
2. Integrasi backend produksi untuk beberapa endpoint notifikasi masih menunggu tim backend.
3. CI pipeline khusus mobile belum dinyatakan selesai.
