# Deployment Log: Developer Properti

**Tanggal**: 15 Juni 2026
**Server**: VPS Ubuntu 24.04 (IP: 52.184.85.27)

## 1. Persiapan VPS (Selesai)
- Node.js (v20), Nginx, PostgreSQL, Git, dan PM2 berhasil diinstal.
- Database PostgreSQL `simdp` dan user `simdp_user` dengan password `password123` berhasil dibuat.

## 2. Setup Repository (Selesai)
- Repository `https://github.com/daffarobbani18/developer-properti.git` berhasil di-clone ke direktori `/var/www/developer-properti`.
- Ownership direktori telah diset ke user `testing`.

## 3. Setup Backend (Selesai)
- Menambahkan Swap Memory 2GB untuk menstabilkan VPS.
- Dependensi diinstal dan file `.env` dibuat dengan kredensial PostgreSQL.
- Schema Prisma di-push dan database di-seed dengan akun *Owner* (owner@erp.com / password123).
- Backend dibangun dan dijalankan menggunakan PM2 (port 4000).

## 4. Setup Frontend (Selesai)
- Karena VPS berukuran kecil, proses `build` Next.js mengalami *Out of Memory/Bus Error*.
- **Solusi**: Build dilakukan di lokal komputer (*Standalone mode*) dan `.zip` hasil build diekstrak ke VPS.
- Aplikasi `web-admin` berjalan menggunakan PM2 di port 3001.
- Aplikasi `web-public-portal` berjalan menggunakan PM2 di port 3000.

## 5. Reverse Proxy Nginx (Selesai)
- Nginx dikonfigurasi untuk mem-proxy akses web:
  - Port 80 diarahkan ke `localhost:3000` (Web Public)
  - Port 8080 diarahkan ke `localhost:3001` (Web Admin)

> **Catatan Penting**: Anda harus mengizinkan Port 8080 di pengaturan Network Security Group (NSG) / Firewall Azure Anda untuk dapat mengakses Web Admin. Web Public sudah dapat diakses langsung.
