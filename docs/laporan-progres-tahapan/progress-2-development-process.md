# Progress 2 Development Process - Fitur Inti Operasional

## Informasi Tahap

- Tahap: Progress 2
- Periode: 2026-04-10 sampai 2026-04-16
- Fokus proses: Pengiriman vertical slice fitur inti mobile

## 1. Planning

1. Menetapkan target utama: auth, role navigation, API flow utama, dan reliability baseline.
2. Menetapkan scope mobile frontend only, dengan dependency endpoint lanjutan tetap koordinasi backend.
3. Menetapkan prioritas implementasi berdasarkan kebutuhan operasional harian pengawas dan customer.

## 2. Rationale Teknis Perencanaan

1. Auth dan role navigation dikerjakan lebih dulu karena menjadi gerbang semua flow fitur.
2. Offline queue diprioritaskan karena penggunaan lapangan memiliki risiko koneksi tidak stabil.
3. Attachment media diprioritaskan untuk memastikan bukti pekerjaan lapangan dan customer dapat terdokumentasi.
4. Push baseline dikerjakan sebagai fondasi observability, meskipun endpoint produksi backend belum final.

## 3. Development Execution

1. Implementasi auth flow dan session lifecycle, termasuk mekanisme auto-lock inaktif.
2. Implementasi role-based navigator dan pemisahan tab utama per role.
3. Implementasi offline queue untuk update milestone dan auto sync saat konektivitas pulih.
4. Implementasi alur lampiran media lintas flow utama menggunakan kamera/galeri.
5. Implementasi baseline push notification (token registration, payload parsing, route handoff).

## 4. Integrasi dan Koordinasi

1. Menyiapkan API layer dengan fallback aman saat endpoint backend belum final.
2. Menjaga kontrak payload agar kompatibel dengan kebutuhan notifikasi dan lampiran media.
3. Menyesuaikan alur navigasi berdasarkan payload push dan role pengguna.

## 5. Dampak Teknis Aktivitas terhadap Arsitektur

| Aktivitas Proses | Keputusan Teknis | Dampak pada Arsitektur |
|------------------|------------------|-------------------------|
| Auth dan session lifecycle | State auth dipusatkan pada hook terdedikasi | Kontrol login/logout/restore lebih konsisten di seluruh app |
| Role-based navigator | Navigasi dipisah berdasarkan role user | Boundary fitur pengawas dan customer menjadi jelas |
| Offline queue milestone | Queue disimpan pada storage lokal | Ketahanan input lapangan meningkat saat offline |
| Attachment media | Service media dipisah dari UI screen | Integrasi kamera/galeri reusable lintas flow |
| Push baseline | Parser payload dipusatkan di service notifikasi | Route handling notifikasi lebih konsisten dan aman |

## 6. Review dan Validasi

1. TypeScript compile check dijalankan untuk memastikan perubahan aman secara typing.
2. Expo health check dijalankan untuk memastikan integritas konfigurasi project.
3. Uji manual lintas role dilakukan pada alur utama (pengawas dan customer).

Artefak verifikasi:

1. `docs/laporan-progres-tahapan/evidence/progress-2/validation-2026-04-16.md`
2. `docs/laporan-progres-tahapan/evidence/progress-2/commit-fe22e2b.txt`

## 7. Blocker dan Risiko

1. Dependensi endpoint produksi notifikasi masih menunggu tim backend.
2. Deep-link spesifik entity dari notifikasi belum final di tahap ini.

## 8. Keputusan Teknis Tahap Ini

1. Mengadopsi mock-first fallback agar frontend tetap bisa bergerak saat backend bertahap.
2. Menempatkan bootstrap push pada root aplikasi agar konsisten lintas role.
3. Menempatkan logic parser notifikasi terpusat untuk menjaga konsistensi route handling.

## 9. Keterlacakan ke Dokumen Hasil

| Elemen Proses | Terhubung ke Hasil |
|---------------|--------------------|
| Aktivitas implementasi auth, role, offline, media, push | `progress-2-report.md` bagian realisasi valid |
| Keputusan teknis mock-first dan parser terpusat | `progress-2-report.md` bagian detail teknis dan keterlacakan |
| Review dan validasi | `progress-2-report.md` bagian bukti verifikasi teknis |

## 10. Handover ke Progress 3

1. Fokus ke modernisasi UI/UX lintas layar.
2. Fokus ke standarisasi status label dan feedback message.
3. Fokus ke hardening kualitas dan konsistensi maintainability.
