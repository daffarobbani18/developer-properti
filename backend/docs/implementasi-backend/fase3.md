# Fase 3: Alur Interaksi & Transaksi (Modul Sales & Marketing)

## Deskripsi
Fase ini mengimplementasikan modul Penjualan (Sales) yang memungkinkan tim Sales & Marketing mencatat data prospek (*Lead*) dan mengeksekusi penguncian kavling (*Booking*). Seluruh rute dilindungi oleh kapabilitas RBAC yang mengharuskan *user* memiliki role `Sales & Marketing`.

## Struktur Database
Dua tabel inti dengan Primary Key berupa `String UUID` dan penulisan standar `camelCase` telah berhasil dijahit ke dalam arsitektur yang sudah ada:
1. **Lead**: 
   - Digunakan untuk mencatat kontak prospek pelanggan.
   - Field meliputi: `name`, `phone`, `email`, `source`, `statusCrm` (default: New), `notes`.
   - Terhubung secara *One-to-Many* dengan tabel Booking.
2. **Booking**:
   - Berfungsi sebagai bukti penguncian (*hold*) aset terhadap suatu Lead.
   - Menyimpan `leadId` dan `unitId` sebagai Foreign Key yang solid.
   - Memiliki parameter transaksional seperti `bookingFee` (Float) dan `paymentMethod`.
   - Menggunakan relasi berbalik (*back-relation*) `bookings Booking[]` di sisi model `Unit` dan `Lead`.

## Arsitektur Transaksional (Interactive Transactions)
Layer `sales.service.ts` dibangun menggunakan fitur tingkat lanjut Prisma, yakni **Interactive Transactions** (`prisma.$transaction`).
Fungsi `createBooking` menggaransi 100% konsistensi database (ACID) melalui langkah *Atomic*:
1. **Validasi Eksistensi**: Cek unit berdasarkan `unitId`.
2. **Validasi Status (Constraint Lock)**: Hanya Unit dengan label "Tersedia" yang boleh di-*booking*. Jika statusnya "Booked" atau "Terjual", proses akan di-revert (digagalkan) dengan pelemparan Error.
3. **Perekaman History**: Menulis transaksi `Booking` ke tabel.
4. **Update Status Aset**: Mengganti `statusPenjualan` unit tersebut menjadi "Booked" agar tidak bisa diganggu gugat oleh eksekusi *sales* lainnya.
Jika salah satu tahap gagal (misal server tiba-tiba mati sebelum tahap 4 selesai), *semua perubahan akan dibatalkan/di-rollback* oleh PostgreSQL. 

## Struktur Layer 
1. **`sales.service.ts`**: Rumah bagi *Interactive Transaction* dan seluruh pembacaan Prisma.
2. **`sales.controller.ts`**: Pintu gerbang HTTP untuk menyortir parameter Request, menindaklanjuti kegagalan *transaction* menjadi response HTTP `400 Bad Request`, dan sukses menjadi HTTP `201 Created`.
3. **`sales.routes.ts`**: Mendaftarkan 4 buah *endpoint* (`POST/GET Leads`, `POST/GET Bookings`) berisikan Middleware otorisasi + `@swagger` JSDoc interaktif.

## Status Integrasi
Modul telah sukses digabungkan (*requireRole('Sales & Marketing')*) dengan ekosistem Swagger API (`/api/sales`). Kompilasi TypeScript (`tsc --noEmit`) bersih dari _error_.
