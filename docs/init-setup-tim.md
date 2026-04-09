# Panduan Init Proyek untuk Tim

Dokumen ini digunakan sebagai standar setup awal agar semua anggota tim menjalankan sistem dengan konfigurasi yang sama.

## 1) Arsitektur yang Dipakai

Proyek menggunakan 2 website + 1 mobile + 1 backend:

1. Web Internal ERP: frontend/web-admin
2. Web Publik + Portal Customer: frontend/web-public-portal
3. Mobile Multi-Role: mobile
4. Backend API terpusat: backend

## 2) Prasyarat Wajib

Pastikan tools berikut sudah terpasang:

1. Node.js LTS (disarankan 20+)
2. npm 10+
3. Git
4. PostgreSQL (lokal atau remote)
5. Expo Go (untuk uji mobile di perangkat)

Cek versi:

1. node -v
2. npm -v
3. git --version

## 3) Clone dan Masuk Folder

1. git clone <url-repo>
2. cd developer-properti

## 4) Install Seluruh Dependency

Dari root repo jalankan:

1. npm run install:all

Perintah ini akan install:

1. frontend/web-admin
2. frontend/web-public-portal
3. backend
4. mobile

## 5) Konfigurasi Environment

### 5.1 Backend

Buat file backend/.env dari backend/.env.example.

Isi minimal:

1. PORT=4000
2. DATABASE_URL=postgresql://postgres:postgres@localhost:5432/simdp
3. JWT_SECRET=change-me

### 5.2 Web Internal

Buat file frontend/web-admin/.env.local dari frontend/web-admin/.env.example.

Isi minimal:

1. PORT=3001
2. NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

### 5.3 Web Publik + Portal

Buat file frontend/web-public-portal/.env.local dari frontend/web-public-portal/.env.example.

Isi minimal:

1. PORT=3002
2. NEXT_PUBLIC_APP_NAME=Web Public + Portal

### 5.4 Mobile

Buat file mobile/.env dari mobile/.env.example.

Isi minimal:

1. EXPO_PUBLIC_API_BASE_URL=http://localhost:4000
2. EXPO_PUBLIC_APP_NAME=SIMDP Mobile
3. METRO_PORT=8082

Catatan:
Jika testing mobile menggunakan HP fisik dalam jaringan yang sama, API base URL biasanya perlu diganti ke IP lokal laptop (bukan localhost).

## 6) Port Standar Tim

Gunakan port ini sebagai standar bersama:

1. Web Admin: 3001
2. Web Public + Portal: 3002
3. Backend API: 4000
4. Expo Metro: 8082

## 7) Menjalankan Sistem (Per Terminal)

Buka 4 terminal terpisah dari root repo:

1. npm run dev:backend
2. npm run dev:web-admin
3. npm run dev:web-public
4. npm run dev:mobile

Akses:

1. Web Admin: http://localhost:3001
2. Web Public + Portal: http://localhost:3002
3. Backend health check: http://localhost:4000/health

## 8) Validasi Cepat Setelah Init

Checklist:

1. Backend menjawab /health dengan status ok
2. Web Admin terbuka tanpa crash
3. Web Public terbuka tanpa crash
4. Metro Expo berjalan dan QR code muncul

## 9) Workflow Kolaborasi Tim (Disarankan)

1. Branch utama stabil: main
2. Branch integrasi: develop
3. Branch fitur per role:
   - feature/backend-webadmin-...
   - feature/web-public-...
   - feature/mobile-...

Aturan singkat:

1. Tidak push langsung ke main
2. Semua merge lewat Pull Request
3. Sync dengan develop secara rutin

## 10) Troubleshooting Umum

### A) npm install gagal karena jaringan (ECONNRESET)

1. Ulangi per package:
   - npm --prefix backend install
   - npm --prefix frontend/web-admin install
   - npm --prefix frontend/web-public-portal install
   - npm --prefix mobile install

### B) Port sudah dipakai

1. Tutup proses lama, atau
2. Ganti port sementara di script/package lalu beri tahu tim

### C) Mobile tidak bisa akses backend

1. Ganti EXPO_PUBLIC_API_BASE_URL dari localhost ke IP lokal laptop
2. Pastikan HP dan laptop satu jaringan Wi-Fi

### D) Prisma/database belum siap

1. Pastikan PostgreSQL aktif
2. Cek DATABASE_URL benar
3. Jalankan prisma command setelah schema siap

## 11) Daftar File Penting Setup

1. package.json (root)
2. backend/package.json
3. frontend/web-admin/package.json
4. frontend/web-public-portal/package.json
5. mobile/package.json
6. .env.example di tiap sistem

## 12) Kontak Internal Tim

Isi bagian ini sesuai tim:

1. PIC Backend + Web Internal: [nama]
2. PIC Web Public + Portal: [nama]
3. PIC Mobile: [nama]
4. PIC DevOps/Deploy (opsional): [nama]

---

Dokumen ini adalah acuan setup pertama untuk seluruh anggota tim. Jika ada perubahan port, script, atau struktur folder, update dokumen ini di commit yang sama agar tetap sinkron.