# Fase 4: Validasi Finansial & Otomatisasi (Modul Finance)

## Deskripsi
Fase 4 menitikberatkan pada validasi pembayaran *booking fee* oleh tim Finance & Accounting. Modul ini menjadi pintu terakhir yang menentukan apakah suatu kavling resmi terjual atau justru dilepas kembali ke *market* (Tersedia). 
Fitur kunci dari fase ini adalah integrasi otomatisasi PDF untuk mencetak bukti kuitansi digital (*Receipt*) secara instan ketika pembayaran disetujui.

## Struktur Database
Sesuai skema, kita telah menambahkan ekstensi baru ke tabel `Booking`:
1. `verifiedAt` (DateTime?): Penanda waktu validasi dilakukan.
2. `receiptUrl` (String?): Link/Path statis menuju file PDF Kuitansi untuk bisa diakses oleh *frontend* maupun diunduh langsung.
3. `financeNotes` (String?): Catatan internal dari pihak finance (alasan penolakan atau catatan tambahan).

## Logika Bisnis & Validasi (Finance Service)
1. **Interactive Transaction (`prisma.$transaction`)**
   Sama halnya dengan tahap pemesanan, verifikasi juga menggunakan transaksi bersarang untuk menjamin keutuhan data.
   - **Jika APPROVE**: Status `Booking` diubah menjadi 'Approved', `verifiedAt` dicatat, file PDF kuitansi diterbitkan, dan status `Unit` diubah menjadi 'Terjual'.
   - **Jika REJECT**: Status `Booking` diubah menjadi 'Ditolak', alasan ditulis ke `financeNotes`, dan status `Unit` akan **dikembalikan** menjadi 'Tersedia' sehingga tim Sales bisa menjualnya kembali ke prospek lain.

2. **Otomatisasi PDF Kuitansi (`pdfkit`)**
   Fungsi statis `generateReceiptPDF` akan menyusun dokumen PDF secara langsung (*on-the-fly*). 
   - Folder tujuan disimpan di `/public/uploads/receipts/`. 
   - Struktur PDF mencakup Logo/Header, Detail Pembeli, Unit yang dipesan, dan Nilai Nominal Booking Fee.
   - Fungsi akan mengembalikan URL relatif `/uploads/receipts/...` yang kemudian akan di-*commit* ke tabel `Booking`.

## API Routes & Security
- **Endpoints**: `GET /api/finance/bookings/pending` dan `POST /api/finance/bookings/:id/verify`.
- **Role Base Access Control**: Sepenuhnya diproteksi oleh middleware `verifyToken` & `requireRole(['Finance & Accounting'])`.
- **Swagger**: Parameter input seperti status *Approve/Reject* didefinisikan secara konkret di dokumentasi Swagger.
