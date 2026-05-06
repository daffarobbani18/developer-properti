# Laporan Progres Tahapan (Big Progress)

Folder ini berisi laporan progres frontend mobile yang dibagi per tahap besar (Progress 1, Progress 2, Progress 3, dan seterusnya).

## Tujuan

Dokumen tahap disusun untuk memastikan klaim progres dapat diverifikasi secara teknis, mudah ditelusuri, dan layak digunakan sebagai bukti akademis maupun audit engineering.

## Prinsip Penyusunan

- Setiap tahap harus merepresentasikan perubahan signifikan (big progress).
- Hanya progres yang valid dan benar-benar sudah dikerjakan yang boleh dicantumkan.
- Setiap tahap wajib punya 2 file terpisah:
  - report hasil (apa yang berhasil dicapai)
  - development process (bagaimana proses engineering dijalankan)

## Standar Kualitas Dokumen Tahap

### 1. Kedetailan Teknis Minimal

- Wajib memuat contoh struktur direktori aktual pada tahap terkait.
- Wajib menjelaskan organisasi modul dan tanggung jawab teknisnya.
- Wajib menjelaskan alur implementasi inti (misalnya alur auth, offline queue, atau push handling).

### 2. Bukti Verifikasi Minimal

- Wajib mencantumkan referensi commit atau snapshot version control.
- Wajib mencantumkan hasil validasi teknis yang dapat direproduksi (misalnya typecheck atau health check).
- Wajib mencantumkan checklist lampiran visual (screenshot) beserta status ketersediaannya.

### 3. Keterlacakan Proses ke Hasil

- Wajib ada matriks yang menghubungkan aktivitas proses engineering dengan hasil progres.
- Wajib menjelaskan dampak teknis keputusan proses terhadap arsitektur atau kualitas aplikasi.

## Struktur Evidence

Semua artefak pendukung disimpan di folder berikut:

- `docs/laporan-progres-tahapan/evidence/progress-1/`
- `docs/laporan-progres-tahapan/evidence/progress-2/`
- `docs/laporan-progres-tahapan/evidence/progress-3/`

## Daftar Tahap Saat Ini

1. Progress 1
   - progress-1-report.md
   - progress-1-development-process.md
2. Progress 2
   - progress-2-report.md
   - progress-2-development-process.md
3. Progress 3
   - progress-3-report.md
   - progress-3-development-process.md

## Aturan Penambahan Tahap Berikutnya

Jika ada milestone besar baru, tambahkan:

- progress-4-report.md
- progress-4-development-process.md

Lalu buat folder evidence baru:

- `docs/laporan-progres-tahapan/evidence/progress-4/`

Lanjutkan pola yang sama untuk Progress 5 dan seterusnya.
