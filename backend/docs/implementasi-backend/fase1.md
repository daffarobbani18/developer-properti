# Implementasi Backend - Fase 1: Autentikasi dan Role-Based Access Control (RBAC)

## Deskripsi
Fase 1 berfokus pada pembangunan pondasi keamanan sistem, meliputi manajemen pengguna (User), penugasan hak akses (Role), dan autentikasi berbasis token JWT (JSON Web Token). Arsitektur yang digunakan adalah Layered Architecture (Routes, Controllers, Services).

## Status Pengerjaan
**Status:** Selesai (Menunggu pengujian koneksi database lokal)

## Komponen yang Diimplementasikan

### 1. Database (Prisma ORM & PostgreSQL)
- **File:** `prisma/schema.prisma`
- **Perubahan:**
  - Database provider diubah dari `sqlite` ke `postgresql`. URL didapatkan dari `env("DATABASE_URL")`.
  - Penambahan model `Role` (id, name).
  - Penambahan model `User` (id, email, password, roleId) berelasi dengan `Role`.

### 2. Services (Logika Bisnis)
- **File:** `src/services/auth.service.ts`
- **Fungsi:**
  - `registerUser`: Menerima input email, password (plain), roleId. Memeriksa ketersediaan email dan validitas role, kemudian melakukan *hashing* password menggunakan `bcrypt` dengan 10 salt rounds sebelum menyimpan data ke database.
  - `loginUser`: Memverifikasi email dan membandingkan password dengan hash di database. Jika cocok, mengembalikan JWT (jsonwebtoken) dengan masa berlaku 1 hari. Token berisi payload `userId` dan `roleName`.

### 3. Controllers (Handler Request/Response)
- **File:** `src/controllers/auth.controller.ts`
- **Fungsi:**
  - `register`: Handler untuk endpoint pendaftaran. Mengelola validasi input dasar, menangani error dari Service (misalnya "Email sudah terdaftar"), dan memberikan HTTP status code yang sesuai (201, 400, 500).
  - `login`: Handler untuk otentikasi masuk. Memberikan response JWT dengan status code 200, atau 401 jika kredensial salah.
  - `me`: Handler yang hanya bisa diakses setelah token divalidasi. Mengembalikan data profil user berdasarkan `req.user`.

### 4. Middlewares (Keamanan)
- **File:** `src/middlewares/auth.middleware.ts`
- **Fungsi:**
  - `verifyToken`: Membaca header `Authorization: Bearer <token>`, memverifikasi *signature* JWT, lalu menyematkan *decoded payload* ke `req.user`.
  - `requireRole(roles)`: Memeriksa apakah `req.user.roleName` (didapat dari JWT) termasuk dalam array role yang diizinkan untuk mengakses suatu endpoint. Jika tidak cocok, menolak akses (HTTP 403).

### 5. Routes & Dokumentasi Swagger
- **File:** `src/routes/auth.route.ts` & `src/config/swagger.ts`
- **Fungsi:**
  - Endpoint yang didaftarkan: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` (dilindungi `verifyToken`).
  - Anotasi Swagger (`@swagger`) disematkan di setiap rute untuk mendeskripsikan *schema request*, parameter otorisasi, dan struktur respon.
  - Swagger UI dirender di endpoint `/api-docs` (`http://localhost:4000/api-docs`).
  - BearerAuth dideklarasikan secara terpusat untuk mempermudah testing UI.

## Catatan untuk Developer (Testing)
Karena sekarang kita menggunakan PostgreSQL:
1. Pastikan PostgreSQL berjalan di lokal/server.
2. Buat database baru (misal: `simdp_db`).
3. Buat file `.env` (atau perbarui `.env` yang ada) di direktori `backend` dan tambahkan baris:
   `DATABASE_URL="postgresql://username:password@localhost:5432/simdp_db"`
4. Jalankan perintah migrasi: `npx prisma migrate dev --name init_auth`
5. Jalankan server: `npm run dev`
6. Akses UI dokumentasi di `http://localhost:4000/api-docs`.
