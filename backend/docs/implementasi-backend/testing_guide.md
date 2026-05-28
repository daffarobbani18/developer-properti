# 🧪 Panduan Pengujian (Testing Guide) Backend ERP Properti

Dokumen ini berisi panduan komprehensif untuk menguji seluruh alur (End-to-End) sistem Backend ERP Properti yang telah menggunakan arsitektur **Domain-Driven Modular**.

## Persiapan Awal
1. Pastikan PostgreSQL berjalan dan terhubung.
2. Jalankan migrasi database jika belum:
   \\\ash
   npm run prisma:migrate
   \\\
3. Jalankan server backend:
   \\\ash
   npm run dev
   \\\
   Server berjalan di \http://localhost:5000\.
4. Anda dapat menggunakan **Postman**, **Insomnia**, atau langsung membuka **Swagger UI** di:
   \http://localhost:5000/api-docs\

---

## 🛣️ Skenario Pengujian End-to-End (E2E)

Berikut adalah urutan kronologis yang sesuai dengan alur bisnis di lapangan:

### 1. Modul Autentikasi (Fase 1)
- **POST \/api/auth/register\**: Daftarkan user baru (contoh: Role 'Sales' dan 'Finance').
- **POST \/api/auth/login\**: Login menggunakan akun tersebut untuk mendapatkan \Token JWT\.
- *Catatan: Set token ini sebagai \Bearer Token\ di Authorization Header untuk pengujian endpoint selanjutnya.*

### 2. Persiapan Master Data (Fase 2)
*(Gunakan akun ber-Role \Admin Inventory\ atau \Superadmin\)*
- **POST \/api/projects\**: Buat project perumahan baru.
- **POST \/api/projects/{id}/property-types\**: Tambahkan tipe rumah (misal: Tipe 36/72).
- **POST \/api/inventory/units\**: Buat kavling unit (Pilih status: \Tersedia\).

### 3. Penjualan & Booking (Fase 3 & 4)
*(Gunakan akun ber-Role \Sales\)*
- **POST \/api/sales/leads\**: Masukkan data calon pembeli (Lead).
- **POST \/api/sales/bookings\**: Lakukan *Booking* (pesan unit). Status awal akan menjadi \Menunggu Verifikasi\.

*(Ganti menggunakan akun ber-Role \Finance & Accounting\)*
- **GET \/api/finance/pending-bookings\**: Cek daftar booking yang masuk.
- **PUT \/api/finance/verify-payment\**: Pilih aksi \Approve\. Ini akan mengubah status Unit menjadi \Terjual\ dan meng-generate URL Kuitansi (PDF).

### 4. Tagihan & Pembayaran Lanjutan (Fase 5)
*(Gunakan akun ber-Role \Finance & Accounting\)*
- **POST \/api/billing/invoices/generate\**: Buat tagihan DP atau cicilan untuk Booking ID terkait.
- **POST \/api/billing/payments\**: Input pembayaran ketika konsumen sudah membayar tagihan. Jika dibayar penuh, status Invoice otomatis berubah menjadi \Paid\.

### 5. Pembangunan Fisik (Fase 6)
*(Gunakan akun ber-Role \Project Manager\)*
- **POST \/api/construction/progress\**: Laporkan progres (misal: \percentage: 20\). Anda bisa melampirkan foto jika mengetes melalui Form-Data.

### 6. Dokumen Legal & BAST (Fase 7)
*(Gunakan akun ber-Role \Tim Legal\)*
- **POST \/api/legal/documents\**: Tandai proses pembuatan AJB atau SHM menjadi \Diproses\ atau \Selesai\.
- **POST \/api/legal/bast/schedule\**: Buat jadwal Serah Terima Kunci (BAST).
- **PUT \/api/legal/bast/{id}/complete\**: Setujui bahwa serah terima sudah selesai.

### 7. Perhitungan Komisi Sales (Fase 8)
*(Gunakan akun ber-Role \Finance\ atau \Sales\)*
- **POST \/api/commissions/calculate\**: Hitung komisi untuk transaksi tersebut (misal \percentage: 2.5\). Status awal: \Pending\.

*(Gunakan akun ber-Role \Director\)*
- **PUT \/api/commissions/{id}/approve\**: Direktur menyetujui pencairan dana komisi.

*(Gunakan akun ber-Role \Finance\)*
- **PUT \/api/commissions/{id}/disburse\**: Finance mencairkan uang ke Sales (Status: \Paid\).

### 8. Dasbor Analitik (Fase 9)
*(Gunakan akun ber-Role \Director\ atau \Superadmin\)*
- **GET \/api/reports/dashboard\**: Panggil endpoint ini. Anda akan melihat:
  - Inventory Stats (Berapa yang Tersedia, Terjual).
  - Financial Stats (Berapa miliar rupiah yang sudah masuk dari *Payment* berstatus *Verified*).
  - Sales Performance (Grafik tren booking bulan ini).

---

## 🛡️ Pengujian Keamanan & Validasi (Zod)
Selain *Happy Path* di atas, cobalah melakukan pengujian negatif (*Negative Testing*):
1. **Palsukan Token**: Akses endpoint terproteksi tanpa token JWT, pastikan tertolak dengan \401 Unauthorized\.
2. **Tabrak Hak Akses**: Akses endpoint Director (seperti setuju komisi) menggunakan token Sales, pastikan tertolak dengan \403 Forbidden\.
3. **Format Salah**: Tembakkan string biasa pada parameter \ookingId\ yang seharusnya \UUID\. Middleware \Zod\ harus menolaknya dengan error deskriptif (bad request).
4. **Input Minus**: Cobalah masukkan angka \-10\ saat melakukan rekaman progres \percentage\. Zod akan menolak karena nilainya di luar nalar.
