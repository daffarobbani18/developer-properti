# Fase 7: Manajemen Dokumen Legal & Serah Terima (Legal & Compliance)

## Deskripsi
Fase 7 melengkapi siklus hidup akhir (end-to-end) proyek properti, yaitu tahap serah terima unit secara legal dari pihak *Developer* ke pihak *Pembeli*. Modul ini berfokus pada pelacakan dokumen legal (PPJB, AJB, SHM, IMB) dan tata laksana proses *Berita Acara Serah Terima (BAST)* kunci rumah.

## Struktur Database (Prisma)
Penambahan dua tabel baru untuk mendukung aktivitas departemen legal:
1. **Model `LegalDocument`**: Menyimpan rekam jejak progres dokumen kepemilikan. 
   - Terhubung dengan `Booking` melalui `bookingId` (relasi 1-to-M, satu booking bisa punya banyak jenis dokumen).
   - Menyimpan *Softcopy* hasil *scan* sertifikat yang diunggah (`fileUrl`).
2. **Model `Bast`**: Mencatat *Berita Acara Serah Terima*.
   - Menyimpan tanggal serah terima (`handoverDate`).
   - Menyimpan *Softcopy* dokumen penyerahan kunci yang telah ditandatangani (`documentUrl`).

## Logika Bisnis & Validasi (Legal Service)
Pencatatan ini memiliki tingkat disiplin (validasi) yang terhubung lintas-modul:
1. **Validasi Kesiapan Unit (`scheduleBast`)**: Sistem **tidak akan** mengizinkan penjadwalan Serah Terima Kunci jika pembangunan rumah belum rampung. Melalui *Prisma Query* lintas tabel (`booking.unit.statusPembangunan`), jika statusnya bukan **"Siap Huni"** (yang dihasilkan dari Fase 6), sistem akan melempar *HTTP 400 Bad Request*.
2. **Atomic Status Update (`completeBast`)**: Ketika *BAST* diselesaikan dan dokumennya diunggah, `prisma.$transaction` langsung bekerja melakukan 2 hal secara atomik:
   - Mengubah status tabel `Bast` menjadi 'Selesai'.
   - Memperbarui `statusPenjualan` pada tabel `Unit` dari 'Terjual' menjadi **'Diserahterimakan'**. 

## Penanganan File (Multer)
Pada `legal.routes.ts`, modul *Multer* diatur ulang untuk menerima unggahan dokumen PDF/Image. File-file penting ini di-_routing_ ke folder aman di direktori `/public/uploads/legal/`.

## Keamanan API (RBAC)
Mengingat dokumen *AJB/SHM* bersifat sangat rahasia, *endpoints* ini dilindungi ketat dan hanya dapat diakses oleh *user* dengan *role* tingkat tinggi:
- `Tim Legal`
- `Director`
Semua *role* operasional lain (*Sales*, *Pengawas*) tidak memiliki hak akses (*Forbidden*).
