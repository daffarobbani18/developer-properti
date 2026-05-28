# Fase 2: Hulu Data - Master Assets (Modul Minggu 7)

## Deskripsi
Fase ini bertujuan untuk mengelola data inti (Master Assets) dalam sistem ERP Properti, yaitu Master Tipe Properti (Tipe Rumah) dan Master Unit Kavling. Modul ini dibatasi hanya untuk pengguna dengan hak akses `Admin Inventory`.

## Penyesuaian Skema (Prisma)
- **PropertyType**: 
  - Kolom lama dipertahankan (`bedrooms`, `bathrooms`, `price`) dengan alias baru untuk mengakomodir standar operasional (`kamarTidur`, `kamarMandi`, `basePrice`).
- **Unit**:
  - Berperan sebagai entitas *KavlingUnit*.
  - Kolom lama dipertahankan (`blok`, `nomorUnit`, `price`, `status`).
  - Kolom baru yang ditambahkan: `kawasan`, `nomor`, `statusPembangunan`, `statusPenjualan`, `priceMarkup`, `totalPrice`.

## Struktur Layer
### 1. `src/services/inventory.service.ts`
- **Tipe Properti**: 
  - `createPropertyType`: Fungsi membuat master tipe properti dan memetakan field *camelCase* secara otomatis.
  - `getAllPropertyTypes`: Mengambil seluruh data master tipe beserta detail nama `Project`.
- **Unit Kavling**:
  - `createKavlingUnit`: Melakukan validasi *constraint* unik per kawasan (kombinasi `blok` dan `nomor` tidak boleh duplikat). Mengkalkulasi `totalPrice` = `basePrice` (dari PropertyType) + `priceMarkup`.
  - `getAllKavlingUnits`: Menampilkan daftar semua kavling dengan dukungan filter dinamis via *query params* (berdasarkan `statusPenjualan` dan `kawasan`).

### 2. `src/controllers/inventory.controller.ts`
- Menerima request untuk `PropertyType` dan `KavlingUnit`. 
- Menangani konversi angka dengan `Number()` sebelum di-pass ke service.
- Error handling dengan try-catch untuk mengembalikan error secara clean jika terjadi duplikasi blok/nomor.

### 3. `src/routes/inventory.routes.ts`
- Modul ini diregistrasikan di path `/api/inventory`.
- Endpoint dilindungi oleh dua lapis satpam:
  - `verifyToken`: Cek keabsahan *bearer token*.
  - `requireRole(["Admin Inventory"])`: Blokir *user* selain Admin Inventory.
- Semua *route endpoint* telah terdokumentasi rapi dengan `@swagger` untuk diintegrasikan ke Swagger UI.

## Refactoring Dead Code
Untuk menjaga *codebase* tetap bersih dan efisien, file _routes_ lama yang mengatur tipe dan unit secara individual tanpa RBAC/Validasi (`property-types.route.ts` dan `units.route.ts`) telah dihapus secara permanen. Pengelolaannya kini sepenuhnya tersentralisasi di `inventory.routes.ts`.

---
*Status: Selesai diimplementasikan.*
