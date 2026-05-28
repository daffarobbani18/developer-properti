# Fase 5: Manajemen Tagihan & Pembayaran Lanjutan (Modul Billing)

## Deskripsi
Fase 5 difokuskan untuk mengelola siklus piutang (*Accounts Receivable*) paska-booking. Ini mencakup proses pembuatan jadwal cicilan/DP otomatis (*Generate Invoices*), serta pencatatan uang masuk pelunasan (*Record Payments*). Modul ini sangat esensial untuk memonitor kesehatan arus kas (Cashflow) proyek properti.

## Struktur Database (Prisma)
Penambahan dua tabel kritikal dengan relasi *One-to-Many* yang solid:
1. **Model `Invoice`**: Mewakili surat tagihan. Terhubung dengan `Booking` melalui `bookingId`. 
   - Menyimpan jenis tagihan (`invoiceType`), nominal tagihan (`amountDue`), batas waktu pembayaran (`dueDate`), dan status kelunasan (`status`).
2. **Model `Payment`**: Mewakili bukti masuk kas/pembayaran yang disetorkan konsumen.
   - Terhubung dengan `Invoice` secara hirarkis melalui `invoiceId`.
   - Mengandung data `amountPaid`, `paymentMethod`, `paymentDate`, dan opsi bukti referensi transfer (`referenceNumber`).

## Logika Bisnis & Validasi (Billing Service)
Modul ini dilindungi oleh **Interactive Transaction (`prisma.$transaction`)** di setiap operasinya:
1. **Otomatisasi Tagihan (`generateInvoices`)**:
   - Jika pengguna memasukkan Total Hutang = 150 Juta dan Tenor = 3 Bulan, sistem secara simultan menerbitkan 3 *Invoice* senilai masing-masing 50 Juta Rupiah. 
   - Jatuh tempo diatur otomatis secara iteratif (+1 Bulan berturut-turut).
2. **Pencatatan Pembayaran (`recordPayment`)**:
   - Menerima setoran uang masuk. Jika nominal masuk (`amountPaid`) memenuhi atau melebihi tagihan (`amountDue`), tagihan tersebut langsung berubah statusnya menjadi 'Paid'.
   - Mencatat rekaman di tabel `Payment` sebagai histori historis pembayaran.
3. **Buku Piutang (*Billing History*)**:
   - Kalkulasi sisa hutang (*Remaining Balance*) dihitung secara *real-time* di *backend* dengan mengurangi nominal tagihan *Unpaid* dikurangi setoran parsial (jika ada).

## API Routes & Security
- **Endpoints**:
  - `POST /api/billing/invoices/generate`: Digerakkan oleh Finance untuk memproduksi jadwal *Installments*.
  - `POST /api/billing/payments`: Digunakan kasir/Finance saat uang masuk direkonsiliasi.
  - `GET /api/billing/:bookingId/history`: Melihat riwayat utuh satu pelanggan.
- **RBAC**: Semua dijamin keamanannya oleh `requireRole(['Finance & Accounting'])`.
- **Swagger**: Sudah dipetakan dengan baik pada kategori *Billing*.
