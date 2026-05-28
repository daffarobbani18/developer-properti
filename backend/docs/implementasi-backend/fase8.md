# Fase 8: Manajemen Komisi Penjualan (Sales Commissions)

## Deskripsi
Fase 8 bertugas mengelola siklus insentif bagi tim *Sales*. Setelah transaksi penjualan berhasil dan uang masuk, pihak perusahaan wajib memberikan komisi kepada tenaga pemasar yang berkontribusi. Modul ini menghitung, menyetujui, dan merekam pencairan komisi secara sistematis, terukur, dan aman.

## Struktur Database (Prisma)
- **Model `Commission`**: Dibuat khusus untuk mengakomodir kalkulasi komisi penjualan.
  - Relasi 1-to-M ke tabel `Booking` (Satu Booking bisa membuahkan komisi).
  - Relasi 1-to-M ke tabel `User` khusus divisi Sales (Untuk melacak siapa yang menerima uang).
  - Kolom `percentage` (dalam persen), `nominalAmount` (kalkulasi nilai tunai), dan `status` (`Pending`, `Approved`, `Paid`).
  - Jejak audit persetujuan terekam dalam *timestamp* `approvedAt` dan `disbursedAt`.

## Logika Bisnis & Validasi (Commission Service)
Operasional komisi dirancang ketat dengan validasi berlapis dan mengandalkan `prisma.$transaction`:
1. **Kalkulasi Aman (`calculateCommission`)**: 
   - Hanya Booking yang sudah di-`Approve` oleh Finance yang bisa diajukan komisinya.
   - Nominal dihitung tepat berdasarkan `(totalPrice Unit) * percentage / 100`. Hasil hitungan langsung masuk berstatus `Pending`.
   - Di *Controller*, nilai maksimum persentase dibatasi (*hard limit* 5%) demi menjaga kewajaran margin keuntungan *developer*.
2. **Persetujuan Bertahap (`approveCommission`)**:
   - Komisi yang `Pending` butuh ketukan palu (Persetujuan) dari tingkat Direksi (`Director`). Status akan berubah menjadi `Approved` beserta pencatatan *timestamp*.
3. **Pencairan Keuangan (`disburseCommission`)**:
   - Hanya dapat diakses oleh tim `Finance & Accounting`. Eksekusi pencairan (`Paid`) dikunci dalam *atomic transaction* agar terjamin keabsahannya.

## Keamanan API (RBAC)
Pemisahan hak wewenang (*Separation of Duties*) adalah kekuatan utama di modul ini:
- **Kalkulasi & Lihat Data**: Diizinkan untuk `Sales` dan `Finance`.
- **Persetujuan (Approve)**: Eksklusif hanya untuk level `Director`.
- **Pencairan (Disburse)**: Eksklusif hanya untuk eksekutor `Finance & Accounting`.

## Swagger Dokumentasi
Tiga ujung tombak siklus (Kalkulasi -> Persetujuan -> Pencairan) terpetakan lengkap di Swagger di bawah tag **Commission**, memungkinkan pengujian operasional seolah-olah menggunakan 3 akun dengan role berbeda.
