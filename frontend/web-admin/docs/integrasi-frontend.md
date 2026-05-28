# Dokumentasi Integrasi Frontend & Backend API

Dokumen ini menjelaskan pendekatan, standar, dan arsitektur yang digunakan untuk menghubungkan (integrasi) aplikasi Next.js (Frontend Web Admin) dengan Express.js (Backend Modular API).

## 1. Pendekatan Integrasi
Integrasi dilakukan menggunakan pendekatan **Client-Side Fetching** pada komponen berbasis interaktivitas (React Client Components) dan memanfaatkan JSON Web Token (JWT) untuk otentikasi.

Alur standar integrasi:
1. **Autentikasi (Otorisasi)**: Pengguna login melalui `/api/auth/login`. Backend mengembalikan `token`.
2. **Bearer Token**: Token tersebut disimpan sementara atau digunakan langsung pada request API berikutnya melalui header `Authorization: Bearer <token>`.
3. **Data Fetching (Async/Await)**: Komponen melakukan fetching asinkron menggunakan `fetch()` saat komponen dimuat (didalam `useEffect`).
4. **State Management**: Data hasil fetch disimpan di dalam state React (`useState`). Terdapat state `loading` untuk memberikan *feedback* visual (seperti animasi *spinner*) kepada pengguna saat menunggu balasan dari server.
5. **Fallback & Resiliency**: Jika fetch gagal (karena server mati atau timeout), komponen disiapkan untuk menggunakan fallback value atau memunculkan error, sehingga aplikasi tidak akan *crash*.

## 2. Standar & Best Practices yang Diterapkan
- **Aman (Security)**: Semua endpoint dilindungi oleh JWT Token (`Authorization: Bearer`). Tanpa token yang sah, backend akan menolak request (`401 Unauthorized`).
- **Cepat (Performance)**: Pengambilan data diagregasi dari backend. Contoh: endpoint `/api/reports/dashboard` memanggil query secara paralel (`Promise.all`) di backend dan mengirim rekap utilitas secara instan tanpa perlu client memanggil banyak endpoint.
- **Andal (Reliability)**: Memiliki mekanisme *Error Handling* berbasis `try...catch...finally`.
- **Standar Format Data (Zod Validation)**: Backend divalidasi ketat menggunakan Zod DTO untuk menghindari tipe data yang korup atau tidak lengkap dari client.

## 3. Struktur Endpoint Utama
Berikut adalah peta endpoint yang menghubungkan frontend Web Admin dengan sistem backend ERP Properti:

| Modul Frontend | Endpoint Backend (API) | Keterangan |
| --- | --- | --- |
| **Auth / Login** | `POST /api/auth/login` | Otorisasi dan pemberian JWT Token |
| **Dasbor Eksekutif** | `GET /api/reports/dashboard` | Mengembalikan rekap performa, finansial, dan inventory |
| **Proyek & Inventory** | `GET /api/inventory/types`<br>`GET /api/inventory/units`<br>`GET /api/projects` | Mengembalikan daftar ketersediaan kavling dan progres fisik proyek |

## 4. Cara Penggunaan bagi Tim Developer
Saat ingin menambahkan fitur/halaman baru yang butuh integrasi API:
1. Pastikan Anda berada dalam komponen dengan instruksi `"use client"`.
2. Siapkan state untuk `data` dan `loading`.
3. Dapatkan token dari state autentikasi atau mock (untuk sementara jika menggunakan data seeding).
4. Gunakan pola berikut:
```javascript
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:4000/api/nama-endpoint", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, []);
```

## Status Progres Integrasi
- ✅ Dasbor Eksekutif (Tahap 1)
- ⏳ Finance & Tagihan (Tahap 2)
- ⏳ CRM & Sales (Tahap 3)
- ⏳ Legal & BAST (Tahap 4)
- ⏳ Konstruksi / Supervisor (Tahap 5)
