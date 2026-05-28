# Fase 6: Manajemen Pembangunan (Construction Progress)

## Deskripsi
Fase 6 mengelola siklus pembangunan kavling perumahan. Karena banyak unit bersifat *Inden* / Pesan Bangun, tim proyek (Project Manager atau Pengawas Lapangan) membutuhkan wadah untuk melaporkan perkembangan fisik pembangunan. 
Fitur kunci dari fase ini adalah pelaporan progres dengan validasi linear (*tidak boleh mundur*) dan kemampuan melampirkan foto lapangan.

## Struktur Database (Prisma)
Penambahan model `ConstructionProgress` dengan atribut:
- `unitId` (UUID) - Relasi berantai dengan kavling/unit yang dibangun.
- `percentage` (Int) - Pencatat seberapa persen pembangunan sudah berjalan (0-100).
- `description` (String) - Catatan laporan mandor/pengawas.
- `photoUrl` (String) - *Path* statis ke *public/uploads/construction/* yang menampung file gambar.
- `recordedById` (UUID) - Mengunci siapa (user/pengawas) yang bertanggung jawab melaporkan data tersebut.

## Logika Bisnis & Validasi (Construction Service)
Pencatatan ini dilindungi oleh `prisma.$transaction` pada fungsi `recordProgress`:
1. **Validasi Skala**: `percentage` wajib bernilai 0 hingga 100.
2. **Validasi Linearitas (No Time Travel)**: Sistem memeriksa progres *terbaru* (diurutkan secara *desc*). Persentase progres yang di-input hari ini tidak boleh **lebih kecil** daripada progres hari kemarin. (Misal: Jika kemarin sudah 50%, hari ini tidak bisa lapor 40%).
3. **Auto-Completion (Serah Terima Readiness)**: Apabila input `percentage` = 100, transaksi akan secara otomatis memperbarui *statusPembangunan* dari `Unit` di tabel master dari *Pesan Bangun* menjadi **Siap Huni**.

## Penanganan File (Multer)
Pada `construction.routes.ts`, modul *Multer* diatur untuk menangani data `multipart/form-data`:
- Setiap foto pembangunan otomatis diberi *timestamp* dan angka acak agar namanya unik (`progress-171822...jpg`).
- Tersimpan rapi di direktori yang di-expose ke publik secara statis di Node.js.

## Keamanan API (RBAC)
Pencatatan progres secara selektif dibatasi untuk *role*:
- `Pengawas Lapangan`
- `Project Manager`
- `Admin Inventory`

Role lain seperti *Sales* atau *Finance* akan otomatis terlempar dengan `403 Forbidden` jika mencoba *hit* endpoint ini.
