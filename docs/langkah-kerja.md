# DOKUMEN LANGKAH KERJA PENGEMBANGAN SISTEM
**Proyek: Sistem Informasi Manajemen Developer Perumahan & Konstruksi (SIMDP)**

---

## FASE 1: Perencanaan Arsitektur Database & Inisialisasi Proyek Dasar

Fase pertama berfokus pada perancangan arsitektur dasar dan struktur basis data perangkat lunak. Karena skala proyek mencakup tiga platform (Backend, Frontend Web Admin, dan Mobile App), pemilihan arsitektur awal menjadi tahap yang krusial untuk meminimalkan utang teknis (*technical debt*).

### 1.1. Inisialisasi Struktur Monorepo
Pengembangan sistem ini menggunakan pendekatan arsitektur *Monorepo* (Mono-repository), di mana seluruh kode sumber *Backend* (NestJS), *Web Admin* (Next.js), dan *Mobile App* (React Native/Expo) disimpan dalam satu repositori Git yang sama.

**Alasan Pemilihan Arsitektur:**
Pendekatan *Monorepo* dipilih karena memudahkan pembagian kode (*code sharing*) lintas platform, khususnya terkait tipe data (Typescript *types*) dan antarmuka (*interfaces*) antara NestJS dan Next.js. Pendekatan ini juga menyederhanakan manajemen dependensi. Pengaturan *package.json* dikonfigurasi pada tingkat root repositori (*workspaces*) agar perintah instalasi dan inisialisasi lingkungan lokal dapat dijalankan secara terpusat.

### 1.2. Pembuatan dan Konfigurasi Skema Prisma ORM (`schema.prisma`)
Sistem ini menggunakan Prisma ORM (*Object-Relational Mapping*) untuk mengelola interaksi dengan basis data PostgreSQL. Konfigurasi struktur tabel dan relasi entitas dideklarasikan secara terpusat pada berkas `schema.prisma`. 

Beberapa keputusan teknis utama dalam perancangan entitas basis data meliputi:

*   **Pemilihan Tipe Data *Decimal* untuk Atribut Finansial:** 
    Kolom yang menyimpan nilai mata uang menggunakan tipe data *Decimal*, bukan *Float/Double*. Keputusan ini didasarkan pada perlunya presisi yang akurat pada perhitungan finansial untuk menghindari hilangnya presisi desimal (*floating-point precision loss*).
*   **Pemisahan Entitas *Milestone* dan *MilestoneLog*:**
    Sistem menerapkan konsep *Audit Trail* dengan memisahkan tabel `Milestone` (status utama) dan `MilestoneLog` (riwayat perubahan). Setiap persetujuan atau penolakan akan dicatat kronologisnya pada tabel log.

**Potongan Kode: `schema.prisma`**
```prisma
// Contoh penggunaan tipe Decimal dan pemisahan Log Audit
model Unit {
  id             String      @id @default(uuid())
  blok           String
  nomor          String
  // Tipe Decimal digunakan untuk akurasi nilai mata uang
  hargaJual      Decimal     @db.Decimal(15, 2) 
  milestones     Milestone[]
}

model Milestone {
  id             String         @id @default(uuid())
  unitId         String
  namaPekerjaan  String
  status         String         // PENDING, WAITING_APPROVAL, COMPLETED
  logs           MilestoneLog[] // Relasi One-to-Many ke tabel riwayat log
  unit           Unit           @relation(fields: [unitId], references: [id])
}

model MilestoneLog {
  id             String     @id @default(uuid())
  milestoneId    String
  status         String     // Status pada saat log ini dibuat
  catatanRevisi  String?
  dibuatPada     DateTime   @default(now())
  milestone      Milestone  @relation(fields: [milestoneId], references: [id])
}
```

### 1.3. Eksekusi Migrasi Database Pertama (`prisma migrate dev`)
Setelah spesifikasi skema ditentukan, perintah `prisma migrate dev` dijalankan untuk mengonversi skema deklaratif Prisma menjadi perintah SQL *Data Definition Language* (DDL) dan mengeksekusinya di peladen PostgreSQL.

### 1.4. Pembuatan Skrip Seeder untuk Data Awal
Untuk mendukung kelancaran pengembangan *frontend*, sebuah *Seeder Script* berbasis TypeScript dikembangkan untuk memasukkan data uji (*dummy data*) yang terstruktur ke dalam basis data.

**Potongan Kode: `seed.ts`**
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Injeksi data dummy untuk keperluan pengembangan dan load testing
  const unitA1 = await prisma.unit.create({
    data: {
      blok: 'A',
      nomor: '1',
      hargaJual: 500000000.00,
      milestones: {
        create: [
          { namaPekerjaan: 'Pondasi', status: 'PENDING' },
          { namaPekerjaan: 'Struktur', status: 'PENDING' }
        ]
      }
    }
  });
  console.log('Seeding berhasil: ', unitA1);
}

main().finally(() => prisma.$disconnect());
```

---

## FASE 2: Pembangunan Modul Autentikasi & Otorisasi Lintas Platform

Modul ini bertanggung jawab atas identifikasi pengguna (autentikasi) dan pembatasan hak akses terhadap sumber daya sistem (otorisasi).

### 2.1. Konfigurasi Autentikasi Berbasis JWT (JSON Web Tokens)
Arsitektur API dikonfigurasi menggunakan pendekatan *stateless* tanpa manajemen *session* di tingkat server dengan menerapkan standar JWT.

**Implementasi Teknis:**
Saat login berhasil, NestJS melakukan *generate* token menggunakan pustaka `@nestjs/jwt`. JWT mendukung skalabilitas API karena server tidak perlu melacak status login pengguna di memori.

**Potongan Kode: `auth.service.ts`**
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload), // Generate JWT token
    };
  }
}
```

### 2.2. Algoritma Enkripsi Kata Sandi (Bcrypt)
Seluruh kata sandi pengguna tidak disimpan dalam bentuk *plaintext* (teks asli) di dalam basis data untuk menghindari kebocoran data (*data breach*).

**Logika Bisnis:**
Pada proses pendaftaran pengguna, kata sandi dienkripsi menggunakan fungsi *hashing* searah (Bcrypt) dengan tingkat *Salt Rounds* 10 untuk mencegah serangan berbasis kamus pencocokan kata sandi seperti *Rainbow Table Attack*.

**Potongan Kode: `users.service.ts`**
```typescript
import * as bcrypt from 'bcrypt';

async function createUser(email: string, plainTextPassword: string, role: string) {
  const saltRounds = 10;
  // Penggabungan plain-text dengan random salt melalui hashing searah
  const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role
    }
  });
}
```

### 2.3. Implementasi *Role-Based Access Control* (RBAC)
Sistem menerapkan kontrol akses berbasis peran (RBAC) untuk mendefinisikan batas otorisasi setiap pengguna setelah melewati proses autentikasi (misal: `DIREKTUR`, `MANAJER_PROYEK`, `PENGAWAS_LAPANGAN`).

**Implementasi Teknis:**
Otorisasi dikelola menggunakan *Custom Guards* dan *Decorators* di NestJS. *Guard* akan memblokir *request* dari pengguna yang tidak memiliki peran yang tepat dan mengembalikan status HTTP 403 Forbidden.

**Potongan Kode: `roles.guard.ts` & `units.controller.ts`**
```typescript
import { SetMetadata, UseGuards, Controller, Put } from '@nestjs/common';

// Custom Decorator untuk mendefinisikan peran yang diizinkan
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('units')
export class UnitsController {
  
  // Endpoint ini dilindungi oleh JwtAuthGuard dan RolesGuard
  @Put(':id/approve-progress')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MANAJER_PROYEK', 'DIREKTUR') // Hanya Manager dan Direktur yang bisa mengakses
  approveProgress(@Param('id') id: string) {
    // Logika persetujuan progres...
    return this.unitsService.approve(id);
  }
}
```

---

## FASE 3: Pengembangan API Master Data (Modul Inventaris Perumahan)

Setelah landasan keamanan selesai dibangun, fase selanjutnya difokuskan pada penyusunan layanan API (*Application Programming Interface*) inti yang mengelola data inventaris perumahan. Modul ini merupakan tulang punggung dari keseluruhan sistem manajemen developer.

### 3.1. Pembuatan Endpoint CRUD (Projects, Unit Types, Blocks, Lots)
Pengelolaan unit perumahan memerlukan hierarki data yang jelas. Oleh karena itu, modul ini dipecah ke dalam arsitektur berorientasi layanan (*Service-Oriented Architecture*) secara internal pada NestJS yang melayani operasi *Create, Read, Update, Delete* (CRUD).

**Logika Bisnis:**
Data diatur dalam hierarki `Proyek` $\rightarrow$ `Tipe Rumah` $\rightarrow$ `Blok` $\rightarrow$ `Kavling/Unit`. Penyusunan skema rute API (*routing*) menggunakan konvensi *RESTful*, seperti `GET /projects/:projectId/units` untuk mengambil seluruh daftar kavling yang berada dalam satu proyek spesifik. Setiap *endpoint* dilengkapi dengan validasi *Payload* (menggunakan `class-validator` pada *Data Transfer Object* / DTO) guna memastikan tipe data yang masuk dari klien valid sebelum diproses oleh basis data.

### 3.2. Implementasi Algoritma Penyortiran Leksikal dan Numerik
Data kavling lazimnya memiliki kombinasi penamaan alfabet dan numerik (contoh: Blok A1, A2, A10, B1). Secara bawaan (*default*), penyortiran alfabetis pada sistem komputer maupun basis data relasional akan mengurutkan deret tersebut menjadi: `A1, A10, A2`. Hal ini akan sangat membingungkan pengguna pada antarmuka tabel.

**Implementasi Teknis:**
Untuk mengatasi masalah ini, logika pengurutan dikalibrasi ulang. Ketimbang bergantung sepenuhnya pada klausa `ORDER BY` SQL murni, manipulasi pengurutan akhir menggunakan fungsi bawaan API internasionalisasi ECMAScript, yaitu `localeCompare` dengan opsi `numeric: true`. Fungsi ini mendeteksi angka di dalam teks (alfanumerik) dan mengurutkannya selayaknya nilai bilangan bulat alami.

**Potongan Kode: `units.service.ts`**
```typescript
async getSortedUnits(projectId: string) {
  // Pengambilan data mentah dari database Prisma
  const rawUnits = await prisma.unit.findMany({
    where: { projectId: projectId }
  });

  // Melakukan modifikasi pengurutan array secara mutasi in-place
  rawUnits.sort((a, b) => {
    if (a.blok === b.blok) {
      // Fitur localeCompare memaksa pengurutan deret A1, A2, A10 secara natural
      return String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true });
    }
    return String(a.blok).localeCompare(String(b.blok));
  });

  return rawUnits;
}
```

### 3.3. Pembuatan Filter Dinamis untuk Ketersediaan Unit
Sistem harus mampu melayani permintaan (*query*) spesifik dari *Web Admin* dan *Mobile App*, misalnya hanya menampilkan unit yang belum terjual kepada pengawas lapangan, atau hanya unit yang sedang dalam masa pembangunan.

**Logika Bisnis:**
*Endpoint* pencarian dimodifikasi untuk menerima parameter kueri (*Query Parameters*). Pada lapisan layanan (*Service Layer*), objek Prisma dimanipulasi untuk membangun struktur `where` secara dinamis. Parameter status seperti `Tersedia`, `Terjual`, atau `Booked` diubah menjadi filter eksklusif.

**Potongan Kode: `units.service.ts` (Dynamic Filtering)**
```typescript
async filterUnits(statusPenjualan?: string, statusPembangunan?: string) {
  // Mendefinisikan objek kueri Prisma secara dinamis
  const queryClause: any = {};

  if (statusPenjualan) {
    queryClause.statusPenjualan = statusPenjualan;
  }
  
  if (statusPembangunan) {
    queryClause.statusPembangunan = statusPembangunan;
  }

  return prisma.unit.findMany({
    where: queryClause,
    include: { tipeRumah: true }
  });
}
```

---

## FASE 4: Pembangunan Dasar Antarmuka Web Admin (Back-Office)

Setelah ketersediaan data dipastikan oleh *Backend*, pengembangan berpindah ke tumpukan antarmuka klien (*Client-Side Frontend*). Modul *Web Admin* ini bertindak sebagai pusat komando (Back-Office) yang dioperasikan oleh jajaran manajerial dan staf administrasi dari *browser* komputer.

### 4.1. Setup Framework Next.js, Tailwind CSS, dan Komponen Shadcn/UI
Platform *Web Admin* dibangun di atas kerangka kerja *Next.js* menggunakan arsitektur terbaru *App Router*. 

**Alasan Pemilihan Arsitektur:**
*Next.js* menawarkan kapabilitas *Server-Side Rendering* (SSR) yang lebih optimal dan penanganan (*routing*) struktur halaman yang lebih efisien dibandingkan *React* polos. Untuk perancangan antarmuka visual (UI), digunakan *Tailwind CSS* karena pendekatannya yang berpusat pada utilitas (*utility-first*), memungkinkan penyesuaian gaya dengan cepat tanpa harus menulis berkas CSS eksternal. Selain itu, integrasi perpustakaan komponen tanpa kepala (*headless UI component*) seperti *Shadcn/UI* digunakan untuk mempercepat pembuatan antarmuka kompleks seperti modul, *dropdown*, dan *data table* tanpa mengorbankan aksesibilitas kode.

### 4.2. Pembuatan Layout Dasar (Sidebar, Header, Breadcrumbs)
Pengembangan difokuskan pada fondasi tata letak situs (*site layout*). Struktur navigasi harus dirancang intuitif untuk sistem yang menampung ratusan sub-menu dan halaman operasional.

**Implementasi Teknis:**
Digunakan pendekatan berkas `layout.tsx` di *Next.js App Router*. Komponen navigasi *Sidebar* dan *Header* dirancang menggunakan paradigma *Client Components* (dengan deklarasi `"use client"`) karena membutuhkan interaksi interaktif (seperti *collapse/expand*). Sementara itu, komponen pembungkus utamanya dijalankan sebagai *Server Components* untuk mengurangi beban muat (*bundle size*) di peramban klien.

### 4.3. Pembuatan Komponen Tabel Data Dinamis untuk Manajemen Inventaris Unit
Data kavling yang berukuran besar harus disajikan secara komprehensif, tidak sekadar menggunakan tag tabel HTML mentah (`<table>`).

**Logika Bisnis:**
Komponen tabel dimodifikasi untuk mendukung penomoran halaman dinamis (*pagination*), kolom yang dapat disortir (*sortable headers*), dan saringan parsial (*partial filters*). Status ketersediaan (contoh: *Terjual*, *Tersedia*) dilengkapi dengan indikator lencana visual (*badges*) bersyarat untuk meminimalkan beban kognitif saat membaca data secara cepat (*rapid scanning*).

### 4.4. Integrasi React Query untuk Fetching API Master Data
Pada arsitektur SPA (*Single Page Application*) yang interaktif, mengelola status pemuatan (*loading states*), memori sementara (*caching*), dan galat koneksi jaringan (*error handling*) sangat memakan biaya operasional apabila dilakukan secara manual menggunakan `useEffect`.

**Alasan Pemilihan Arsitektur:**
Modul *TanStack Query* (React Query) diimplementasikan sebagai lapisan sinkronisasi data *Client-Side*. *React Query* mengatur ulang penarikan data latar belakang (*background fetching*) secara otomatis ketika pengguna memfokuskan kembali jendela penjelajah (*window focus refetching*). Selain itu, teknik pemrograman defensif (*defensive programming*) disuntikkan ke dalam rutinitas penarikan data API agar sistem tidak mengalami kerusakan tata letak (*White Screen of Death*) ketika struktur respons dari *Backend* tiba-tiba mengalami modifikasi spesifikasi.

**Potongan Kode: `hooks/useUnits.ts` (React Query Integration)**
```tsx
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Hook khusus untuk merangkum kompleksitas fetching data
export function useUnits(projectId: string) {
  return useQuery({
    queryKey: ['units', projectId],
    queryFn: async () => {
      const response = await axios.get(`/api/projects/${projectId}/units`);
      const data = response.data;
      
      // Defensive Parser: Memastikan sistem tidak rusak jika bentuk JSON bervariasi
      if (data && Array.isArray(data.data)) {
        return data.data; // Merespons format struktur pembungkus { data: [] }
      } else if (data && Array.isArray(data)) {
        return data; // Merespons format array primitif []
      }
      return []; // Kembalikan array kosong jika struktur data terindikasi anomali
    },
    // Konfigurasi durasi cache data (data tetap segar selama 5 menit)
    staleTime: 5 * 60 * 1000, 
  });
}
```

---

## FASE 5: Inisialisasi Mobile App Lapangan & Integrasi Akses Pengawas

Fase ini menandai awal pembangunan antarmuka untuk pengguna di lapangan (*Field Engineers*). Aplikasi *mobile* harus dirancang sedemikian rupa agar dapat beroperasi pada perangkat berspesifikasi rendah dengan kondisi pencahayaan luar ruangan (*outdoor*) yang terang.

### 5.1. Setup Lingkungan React Native / Expo
Aplikasi *mobile* dibangun menggunakan *React Native* yang dikemas dalam ekosistem *Expo*.

**Alasan Pemilihan Arsitektur:**
Penggunaan *Expo* meniadakan kebutuhan untuk melakukan kompilasi modul bawaan (*native modules*) secara manual menggunakan Android Studio atau Xcode, yang sering kali menghambat kecepatan rilis (*time-to-market*). *Expo* menyediakan modul siap pakai untuk pengaksesan fitur perangkat keras seperti kamera dan sistem berkas lokal tanpa konfigurasi tambahan yang kompleks.

### 5.2. Pembuatan Navigasi Bottom Tabs dan Stack Screens
Aplikasi lapangan membutuhkan hierarki navigasi yang lugas agar pengawas tidak tersesat dalam menu saat berada di lokasi proyek.

**Implementasi Teknis:**
Digunakan arsitektur perutean berbasis fail (*file-based routing*) melalui `expo-router`. Struktur utama dipecah menjadi dua paradigma navigasi: 
1. *Bottom Tabs*: Menyediakan akses cepat ke halaman *Home* (Dasbor) dan *Profile*.
2. *Stack Screens*: Mengelola alur berurutan seperti peralihan dari daftar proyek menuju detail unit, lalu ke formulir pembaruan *milestone*.

### 5.3. Integrasi Layar Login dengan Penyimpanan Token Lokal
Autentikasi pada *mobile* memiliki sifat persisten. Pengawas tidak diwajibkan melakukan proses *login* setiap kali aplikasi dibuka ulang.

**Logika Bisnis dan Keamanan:**
Saat *Backend* merespons proses *login* dengan mengembalikan *JWT Access Token*, aplikasi seluler harus menyimpannya secara aman. Penggunaan `AsyncStorage` biasa dinilai tidak cukup aman karena rentan terhadap peretasan jika perangkat di-*root*. Oleh karena itu, token disimpan menggunakan `expo-secure-store`, yang mengintegrasikan penyimpanan JWT secara langsung ke dalam *Keystore* (Android) dan *Keychain* (iOS).

**Potongan Kode: `auth.ts` (Mobile Client)**
```typescript
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Fungsi login yang mengamankan token di enkripsi perangkatkeras
export async function loginToApp(email: string, password: string) {
  const response = await axios.post('https://api.simdp.com/auth/login', { email, password });
  const token = response.data.access_token;
  
  // Token disimpan di ranah aman OS, bukan memori biasa
  await SecureStore.setItemAsync('user_jwt', token);
  
  // Konfigurasi Header secara global untuk setiap permintaan selanjutnya
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

### 5.4. Pembuatan Desain Dasar Dasbor Ringkasan Pengawas Lapangan
Desain antarmuka (UI) untuk aplikasi ini tidak difokuskan pada nilai estetik dekoratif, melainkan pada kejelasan informasi (*high contrast UI*).

**Implementasi Teknis:**
Warna dominan yang dipilih sangat kontras (latar belakang putih cerah dengan teks hitam tebal dan tombol-tombol operasi berwarna solid) untuk mengompensasi pantulan sinar matahari di layar. Dasbor utama dirancang untuk langsung menampilkan ringkasan target harian dan daftar unit yang sedang mengalami revisi atau penolakan manajer (berwarna merah peringatan).

---

## FASE 6: Pengembangan Modul Legal, Penjualan & Kanban KPR

Setelah infrastruktur konstruksi berdiri, sistem dikembangkan secara lateral ke modul administrasi penjualan untuk mengakomodasi alur transaksi finansial dengan klien eksternal.

### 6.1. Pembuatan Endpoint Backend untuk Transaksi *Booking Fee* dan *Invoice*
Penjualan rumah sering kali diawali dengan pembayaran *Booking Fee* sebelum unit dikunci dari penawaran publik. 

**Logika Bisnis:**
*Backend* menyediakan layanan API untuk memproduksi entitas `Invoice`. Ketika status *Invoice* untuk *Booking Fee* berubah dari `UNPAID` menjadi `PAID`, sistem secara implisit akan memutasi ketersediaan `Unit` yang bersangkutan dari status `Tersedia` menjadi `Booked`. Transisi ini melindungi unit dari potensi penjualan ganda (*double-booking*).

### 6.2. Pembangunan Papan Kanban (Drag-and-Drop) di Web Admin
Proses pencairan Kredit Pemilikan Rumah (KPR) melibatkan tahapan birokrasi yang panjang dan tidak linear (contoh: Pengumpulan Berkas $\rightarrow$ Penilaian Bank $\rightarrow$ Wawancara $\rightarrow$ Akad). Menyajikan data ini dalam bentuk tabel konvensional dianggap menyulitkan pengawasan manajerial.

**Implementasi Teknis:**
Antarmuka *Web Admin* memfasilitasi modul KPR menggunakan pendekatan antarmuka *Kanban Board* (Papan Kanban). Dengan memanfaatkan pustaka manipulasi DOM seperti `@hello-pangea/dnd` (percabangan dari `react-beautiful-dnd`), pengguna dapat memindahkan kartu nasabah antarkolom status hanya dengan metode tarik dan lepas (*drag and drop*). Setiap aksi pelepasan kartu pada layar akan memicu panggilan API asinkron `PATCH /kpr/:id/status` ke peladen.

### 6.3. Pembuatan Aturan Transisi Status KPR (State Machine)
Pemindahan status secara visual harus divalidasi dan diatur oleh mesin logika peladen untuk mencegah inkonsistensi operasional.

**Logika Bisnis:**
Tidak semua transisi diizinkan. Sistem menerapkan *State Machine Validation*. Sebagai contoh, status tidak bisa dipindahkan dari `PENGUMPULAN_BERKAS` melompat langsung ke `AKAD_KREDIT` dengan melewati tahapan `WAWANCARA`. Jika administrator memaksakan gerakan *drag-and-drop* tersebut, *Backend* akan menolak eksekusi dan mengembalikan pesan galat, yang memaksa kartu di antarmuka klien memantul kembali ke kolom asalnya.

### 6.4. Penanganan Transaksi Atomik Database pada Skenario Penolakan KPR
Skenario pembatalan atau kegagalan persetujuan KPR oleh bank menuntut pengembalian status ketersediaan properti agar unit tersebut dapat segera ditawarkan kembali ke pasar.

**Implementasi Teknis:**
Ketika status KPR diubah menjadi `DITOLAK`, terjadi setidaknya dua modifikasi tabel basis data secara berantai: mencatat alasan penolakan pada tabel riwayat transaksi, dan mengubah status ketersediaan kavling pada tabel `Unit` dari `Booked` kembali menjadi `Tersedia`. Guna menghindari inkonsistensi jika peladen mengalami kegagalan proses di tengah operasi, seluruh eksekusi kueri dibungkus menggunakan antarmuka transaksi Prisma (`prisma.$transaction()`). Hal ini memberikan jaminan mutlak kepatuhan ACID (*all-or-nothing execution*).

**Potongan Kode: `kpr.service.ts`**
```typescript
async rejectKPR(kprId: string, reason: string) {
  // Seluruh mutasi dibungkus di dalam kapsul transaksi
  return prisma.$transaction(async (tx) => {
    
    // 1. Perbarui status aplikasi KPR menjadi Ditolak
    const kpr = await tx.kprApplication.update({
      where: { id: kprId },
      data: { status: 'DITOLAK', rejectionReason: reason },
      include: { unit: true }
    });

    // 2. Lepaskan kunci pemesanan unit, ubah kembali menjadi tersedia untuk pasar
    await tx.unit.update({
      where: { id: kpr.unitId },
      data: { statusPenjualan: 'Tersedia' }
    });

    return kpr;
  });
}
```

---

## FASE 7: Arsitektur Modul Konstruksi & Skema SPK (Surat Perintah Kerja)

Fase ini merupakan fondasi dari seluruh alur operasional di lapangan. Modul konstruksi dirancang untuk menjembatani hubungan antara perusahaan developer sebagai pemberi kerja dan kontraktor sebagai pelaksana pekerjaan fisik. Seluruh proses mulai dari penunjukan kontraktor, pemberian instruksi pekerjaan resmi melalui SPK, hingga pendefinisian target pekerjaan spesifik per kavling (Milestone) dikelola dalam modul ini.

### 7.1. Penambahan Entitas Relasional Kontraktor dan SPK pada Skema Database

Sebelum sebuah kavling dapat memulai proses pembangunan, sistem memerlukan rekaman legal yang mengikat antara kavling tersebut dengan kontraktor yang bertanggung jawab. Rekaman legal ini direpresentasikan oleh entitas `SPK` (Surat Perintah Kerja).

**Logika Bisnis:**
Dalam praktik industri konstruksi, satu kontraktor dapat memegang lebih dari satu SPK untuk kavling yang berbeda, namun satu kavling hanya dapat memiliki satu SPK yang aktif pada satu waktu. Relasi ini membentuk hubungan *Many-to-One* antara tabel `Unit` dan tabel `Kontraktor`, yang diperantarai oleh tabel `SPK`. Pemisahan entitas ini bertujuan untuk memastikan sistem dapat menyimpan riwayat lengkap kontraktor yang pernah bertanggung jawab atas suatu unit, termasuk jika di tengah proses terjadi pergantian kontraktor.

Selain itu, tabel `SPK` dirancang untuk menyimpan informasi kritis finansial seperti nilai kontrak (`nilaiKontrak`), tanggal mulai dan berakhirnya kontrak, serta daftar termin pembayaran yang telah disepakati. Informasi ini kelak menjadi acuan untuk modul pemicu keuangan otomatis pada fase berikutnya.

**Potongan Kode: Penambahan Model SPK di `schema.prisma`**
```prisma
model Kontraktor {
  id          String  @id @default(uuid())
  namaPerusahaan String
  namaPIC     String  // Nama Person in Charge
  noTelp      String?
  email       String? @unique
  spkList     SPK[]   // Satu kontraktor dapat memegang banyak SPK
}

model SPK {
  id             String      @id @default(uuid())
  nomorSPK       String      @unique
  unitId         String      @unique // Satu unit hanya memiliki satu SPK aktif
  kontraktorId   String
  nilaiKontrak   Decimal     @db.Decimal(18, 2)
  tanggalMulai   DateTime
  tanggalSelesai DateTime
  statusSPK      String      @default("AKTIF") // AKTIF, SELESAI, DIBATALKAN

  unit           Unit        @relation(fields: [unitId], references: [id])
  kontraktor     Kontraktor  @relation(fields: [kontraktorId], references: [id])
  terminList     TerminSPK[]
}

// Tabel termin pembayaran yang disepakati di dalam SPK
model TerminSPK {
  id          String  @id @default(uuid())
  spkId       String
  namaTermin  String  // Contoh: "Termin 1 - Pondasi Selesai (50%)"
  persentase  Int     // Persentase pencairan dari nilai kontrak total
  status      String  @default("BELUM_CAIR") // BELUM_CAIR, CAIR
  spk         SPK     @relation(fields: [spkId], references: [id])
}
```

**Alasan Pemisahan Tabel `TerminSPK`:**
Data termin pembayaran dipisahkan ke dalam tabel tersendiri (bukan disimpan sebagai kolom JSON) karena jumlah termin bersifat variabel — suatu SPK mungkin memiliki 2 termin, sementara SPK lain memiliki 4 termin. Penyimpanan dalam JSON akan menyulitkan proses kueri dan filter berbasis kondisi status termin. Normalisasi ke tabel relasional memungkinkan sistem melakukan kueri terhadap seluruh termin berstatus `BELUM_CAIR` di seluruh proyek dengan satu perintah SQL yang efisien.

### 7.2. Pembuatan Endpoint Integrasi Penugasan Kavling ke Kontraktor

Setelah entitas basis data tersedia, lapisan API dibangun untuk mengelola siklus hidup SPK.

**Logika Bisnis:**
Alur penugasan bekerja sebagai berikut. Pertama, staf administrasi membuat rekaman kontraktor baru jika belum ada (`POST /contractors`). Selanjutnya, SPK dibuat dengan menautkan ID kontraktor, ID unit, dan detail kontrak melalui endpoint `POST /spk`. Pada saat yang sama, status unit secara otomatis dimutasi dari `Tersedia` (jika unit belum dibeli) atau mempertahankan status `Terjual` dan menambahkan atribut `spkId` pada rekaman unit tersebut.

Penting untuk dipahami bahwa sebuah unit yang memiliki SPK aktif tidak boleh dapat dihapus dari sistem. Oleh karena itu, endpoint `DELETE /units/:id` dikonfigurasi untuk memeriksa keberadaan relasi SPK terlebih dahulu. Jika relasi ada, permintaan penghapusan akan diblokir dengan pesan galat yang informatif.

**Potongan Kode: `spk.service.ts`**
```typescript
async createSPK(createSpkDto: CreateSpkDto) {
  const { unitId, kontraktorId, nilaiKontrak, tanggalMulai, tanggalSelesai, terminList } = createSpkDto;

  // Validasi: Periksa apakah unit sudah memiliki SPK aktif
  const existingSpk = await prisma.sPK.findFirst({
    where: { unitId, statusSPK: 'AKTIF' }
  });

  if (existingSpk) {
    throw new ConflictException(`Unit ini sudah memiliki SPK aktif dengan nomor: ${existingSpk.nomorSPK}`);
  }

  return prisma.$transaction(async (tx) => {
    // 1. Buat rekaman SPK baru
    const spk = await tx.sPK.create({
      data: {
        nomorSPK: generateSPKNumber(), // Fungsi utilitas untuk nomor unik
        unitId,
        kontraktorId,
        nilaiKontrak,
        tanggalMulai,
        tanggalSelesai,
        // Buat termin pembayaran secara bersamaan dalam satu transaksi
        terminList: {
          create: terminList.map(t => ({
            namaTermin: t.namaTermin,
            persentase: t.persentase,
          }))
        }
      }
    });

    // 2. Tandai unit bahwa sudah terikat SPK
    await tx.unit.update({
      where: { id: unitId },
      data: { spkId: spk.id, statusPembangunan: 'DALAM_PEMBANGUNAN' }
    });

    return spk;
  });
}
```

### 7.3. Penyusunan Template Milestone Standar Pekerjaan

Setiap unit yang memiliki SPK aktif memerlukan daftar pekerjaan (*Milestone*) yang terstruktur. Pada tahap awal, sistem mengadopsi pendekatan *template-based* di mana serangkaian tahapan pekerjaan standar diinjeksikan secara otomatis setiap kali SPK baru dibuat.

**Logika Bisnis:**
Dalam industri konstruksi perumahan, tahapan pekerjaan umumnya mengikuti urutan standar: Persiapan Lahan, Pondasi, Struktur (Kolom & Balok), Dinding, Atap, Plesteran & Acian, Lantai, Instalasi MEP (Mekanikal, Elektrikal, Plumbing), dan *Finishing*. Setiap tahapan memiliki bobot kontribusi terhadap persentase progres keseluruhan yang berbeda. Sebagai contoh, tahap Pondasi mungkin berkontribusi 15% dari total progres, sedangkan tahap Instalasi MEP berkontribusi 10%.

Bobot persentase ini (`bobotPersentase`) disimpan pada tabel `Milestone`. Ketika seorang manajer menyetujui laporan pada sebuah *milestone*, nilai `bobotPersentase`-nya akan ditambahkan ke kolom `progress` pada tabel `Unit`. Pendekatan ini menjamin bahwa nilai progres di level unit selalu merupakan akumulasi objektif dari pekerjaan yang telah diverifikasi.

**Potongan Kode: Template Seeder Milestone di `spk.service.ts`**
```typescript
// Definisi template pekerjaan standar dengan bobot masing-masing
const DEFAULT_MILESTONE_TEMPLATES = [
  { namaPekerjaan: 'Persiapan Lahan',   bobotPersentase: 5  },
  { namaPekerjaan: 'Pondasi',           bobotPersentase: 15 },
  { namaPekerjaan: 'Struktur Beton',    bobotPersentase: 20 },
  { namaPekerjaan: 'Pasangan Dinding',  bobotPersentase: 15 },
  { namaPekerjaan: 'Pekerjaan Atap',    bobotPersentase: 10 },
  { namaPekerjaan: 'Plesteran & Acian', bobotPersentase: 10 },
  { namaPekerjaan: 'Pekerjaan Lantai',  bobotPersentase: 10 },
  { namaPekerjaan: 'Instalasi MEP',     bobotPersentase: 10 },
  { namaPekerjaan: 'Finishing',         bobotPersentase: 5  },
  // Total: 100%
];

async generateMilestonesFromSPK(unitId: string, spkId: string) {
  // Menggunakan createMany untuk efisiensi insert massal ke database
  await prisma.milestone.createMany({
    data: DEFAULT_MILESTONE_TEMPLATES.map(template => ({
      unitId,
      spkId,
      namaPekerjaan:   template.namaPekerjaan,
      bobotPersentase: template.bobotPersentase,
      status:          'PENDING',
    }))
  });
}
```

---

## FASE 8: Integrasi Manajemen Proyek Konstruksi di Aplikasi Mobile

Setelah seluruh infrastruktur API konstruksi tersedia, pengembangan difokuskan pada integrasi ke sisi aplikasi mobile. Pada fase ini, aplikasi lapangan mendapatkan kemampuan untuk menampilkan data proyek konstruksi yang relevan bagi pengawas dan berinteraksi dengan alur kerja *milestone* secara penuh.

### 8.1. Pembuatan Desain Field-First UI untuk Antarmuka Pengawas

Desain antarmuka (*User Interface*) untuk pengguna di lapangan harus mempertimbangkan kondisi penggunaan yang sangat berbeda dari pengguna *Web Admin* di dalam ruangan.

**Keputusan Desain yang Diterapkan:**
*   **Kontras Tinggi (High Contrast):** Semua elemen teks menggunakan ukuran font minimal 16sp dan bobot `semibold` agar terbaca di bawah kondisi pancaran sinar matahari langsung (*direct sunlight visibility*).
*   **Target Sentuh yang Luas (Large Touch Targets):** Semua tombol aksi utama dirancang memiliki tinggi minimal 52dp untuk memudahkan interaksi dengan jari pada saat memakai sarung tangan kerja atau kondisi tangan kotor.
*   **Minimasi Hierarki Layar:** Jumlah perpindahan layar untuk menyelesaikan satu alur kerja utama (seperti mengirim laporan kemajuan) dibatasi maksimum 3 langkah, dari dasbor utama hingga konfirmasi pengiriman.
*   **Mode Hemat Baterai:** Penggunaan animasi dibatasi secara sengaja pada aplikasi mobile untuk menghemat konsumsi baterai pada perangkat yang kerap digunakan seharian penuh tanpa sempat diisi ulang.

### 8.2. Penarikan Daftar Tugas (Milestone) Berdasarkan SPK yang Ditugaskan

Seorang pengawas hanya boleh melihat dan berinteraksi dengan *milestone* dari unit-unit yang secara eksplisit ditugaskan kepadanya. Sistem tidak boleh menampilkan data dari proyek lain.

**Logika Bisnis:**
Pada tabel `User`, terdapat relasi ke tabel `SPK` melalui tabel perantara `PengawasAssignment`. Setiap kali seorang pengawas membuka aplikasi, sistem akan menarik seluruh *milestone* secara terfilter berdasarkan ID pengawas yang sedang aktif (*session*). Endpoint yang digunakan adalah `GET /mobile/my-milestones` yang secara internal menjalankan kueri relasional melalui Prisma.

**Potongan Kode: `mobile.controller.ts` (Endpoint Khusus Mobile)**
```typescript
@Get('my-milestones')
@UseGuards(JwtAuthGuard)
async getMyMilestones(@CurrentUser() user: UserPayload) {
  // CurrentUser adalah custom decorator yang mengekstrak data dari JWT payload
  return this.mobileService.getMilestonesForPengawas(user.id);
}

// Implementasi di mobile.service.ts
async getMilestonesForPengawas(pengawasId: string) {
  return prisma.milestone.findMany({
    where: {
      spk: {
        // Filter bertingkat melalui relasi: cari milestone yang SPK-nya 
        // memiliki penugasan ke pengawas yang sedang login
        pengawasAssignments: {
          some: { pengawasId: pengawasId }
        }
      },
      // Hanya tampilkan milestone yang masih aktif (belum selesai)
      NOT: { status: 'COMPLETED' }
    },
    include: {
      unit: {
        select: { blok: true, nomor: true, tipeRumah: { select: { nama: true } } }
      }
    },
    orderBy: { createdAt: 'asc' }
  });
}
```

### 8.3. Pembuatan Layar Detail Proyek (Hero Section, Stats Grid, Daftar Tipe Rumah)

Sebelum masuk ke daftar *milestone*, pengawas dapat membuka halaman ringkasan (*summary*) dari suatu proyek. Layar ini menampilkan statistik agregat yang relevan.

**Implementasi Teknis:**
Layar detail proyek menggunakan komponen tata letak berbasis `ScrollView` dengan struktur sebagai berikut:

1.  **Hero Section:** Menampilkan nama proyek, lokasi, dan foto representatif proyek sebagai latar belakang dengan efek gradasi dari bawah untuk memastikan keterbacaan teks di atasnya.
2.  **Stats Grid (2x2):** Menampilkan empat metrik utama dalam format grid dua kolom:
    - Total Unit dalam proyek.
    - Jumlah Unit yang sedang dalam tahap pembangunan.
    - Jumlah Unit yang sudah mencapai progres di atas 80%.
    - Jumlah *Milestone* yang sedang menunggu persetujuan (*Waiting Approval*).
3.  **Daftar Tipe Rumah:** Menampilkan kartu horizontal yang dapat di-*scroll* secara lateral (*horizontal scroll*), memperlihatkan nama tipe rumah, ukuran luas tanah dan bangunan, serta jumlah kavling dari tipe tersebut.

**Potongan Kode: Komponen Stats Grid di `ProjectDetailScreen.tsx`**
```tsx
type Stat = { label: string; value: number; color: string };

function StatsGrid({ projectId }: { projectId: string }) {
  const { data: stats } = useProjectStats(projectId);

  const statItems: Stat[] = [
    { label: 'Total Unit',        value: stats?.totalUnit ?? 0,       color: '#3b82f6' },
    { label: 'Dalam Pembangunan', value: stats?.dalamPembangunan ?? 0, color: '#f59e0b' },
    { label: 'Progres > 80%',     value: stats?.hampirSelesai ?? 0,   color: '#10b981' },
    { label: 'Tunggu Persetujuan',value: stats?.waitingApproval ?? 0, color: '#ef4444' },
  ];

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 }}>
      {statItems.map((item) => (
        <View
          key={item.label}
          style={{
            width: '47%',
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            borderLeftWidth: 4,
            borderLeftColor: item.color,
            // Menerapkan shadow untuk kesan card yang mengapung
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 28, fontWeight: '700', color: item.color }}>
            {item.value}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
```

### 8.4. Pengelolaan Status Offline dan Error Handling Jaringan

Aplikasi lapangan beroperasi di lokasi yang tidak selalu memiliki koneksi internet yang stabil. Sistem harus mampu menangani kondisi koneksi yang terputus tanpa menyebabkan aplikasi *crash* atau kehilangan data yang sudah diinput pengawas.

**Implementasi Teknis:**
Pada versi awal, strategi penanganan koneksi putus menggunakan mekanisme *optimistic UI update* berbasis React Query. Ketika sebuah permintaan API gagal karena *timeout* atau koneksi terputus, React Query akan secara otomatis mencoba kembali (*retry*) hingga maksimum 3 kali dengan interval yang semakin panjang (*exponential backoff*). Selama proses percobaan ulang, antarmuka tetap menampilkan data terakhir yang berhasil dimuat dari memori *cache* lokal agar pengawas tidak melihat layar kosong.

Untuk formulir laporan yang sudah diisi namun gagal terkirim, sistem menyimpan sementara (*draft persistence*) isi formulir ke dalam penyimpanan lokal (`AsyncStorage`) agar pengawas tidak perlu mengisi ulang seluruh formulir setelah koneksi pulih.

**Potongan Kode: Konfigurasi Retry & Cache di `queryClient.ts`**
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data dianggap masih segar selama 3 menit (tidak refetch selama periode ini)
      staleTime: 3 * 60 * 1000,
      // Data disimpan di cache selama 10 menit walau komponen tidak aktif
      gcTime: 10 * 60 * 1000,
      // Mencoba ulang sebanyak 3 kali jika gagal
      retry: 3,
      // Tidak refetch otomatis saat aplikasi kembali ke foreground (hemat data)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Untuk operasi tulis, coba ulang 1 kali jika gagal
      retry: 1,
    }
  }
});
```

---

## FASE 9: Pembangunan Fitur Pelaporan Lapangan (Milestone Update)

Fase ini merupakan inti dari interaksi antara pengawas lapangan dan sistem. Seluruh pekerjaan yang dibangun pada fase-fase sebelumnya (pengelolaan SPK, daftar milestone, antarmuka mobile) bermuara pada satu fungsi utama: kemampuan pengawas untuk melaporkan kemajuan pekerjaan fisik secara terstruktur beserta bukti fotografi. Laporan yang dihasilkan dari fase ini menjadi sumber data utama yang divalidasi oleh manajer proyek di Web Admin.

### 9.1. Pembuatan Akses Kamera dan Galeri Perangkat pada Mobile App

Bukti fisik pekerjaan lapangan berupa foto merupakan komponen yang tidak dapat dihilangkan dari laporan konstruksi. Tanpa bukti fotografi, manajer tidak memiliki dasar yang cukup untuk memverifikasi klaim penyelesaian pekerjaan dari pengawas.

**Logika Bisnis:**
Setiap laporan *milestone* diwajibkan menyertakan minimal satu foto sebagai bukti pekerjaan. Foto dapat diambil langsung dari kamera perangkat pada saat pelaporan, atau dipilih dari galeri jika foto sudah diambil sebelumnya. Sistem tidak membatasi jumlah foto secara ketat, namun memberikan rekomendasi batas 5 foto per laporan untuk menghindari waktu unggah yang terlalu panjang pada koneksi 4G yang tidak stabil.

**Implementasi Teknis:**
Akses ke kamera dan galeri perangkat dikelola menggunakan modul `expo-image-picker`. Modul ini mengabstraksikan perbedaan implementasi antara Android dan iOS ke dalam satu antarmuka API yang seragam. Sebelum mengakses kamera, sistem diwajibkan meminta izin (*permission*) dari sistem operasi perangkat. Izin ini hanya perlu diminta sekali; apabila pengguna menolak, aplikasi akan menampilkan panduan untuk mengaktifkan kembali izin tersebut melalui halaman pengaturan perangkat.

**Potongan Kode: `useCameraAndGallery.ts` (Custom Hook)**
```typescript
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export function useCameraAndGallery() {
  
  // Membuka kamera untuk pengambilan foto langsung di lapangan
  const openCamera = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert(
        'Izin Ditolak',
        'Akses kamera diperlukan untuk mengambil foto lapangan. Aktifkan izin kamera di Pengaturan perangkat.',
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,        // Kompresi 70% untuk keseimbangan kualitas dan ukuran file
      allowsEditing: true, // Mengizinkan crop sederhana sebelum submit
      aspect: [4, 3],      // Rasio aspek standar dokumentasi lapangan
    });

    if (result.canceled || !result.assets?.[0]) return null;
    return result.assets[0].uri; // URI lokal berkas gambar di perangkat
  };

  // Membuka galeri untuk memilih foto yang sudah diambil sebelumnya
  const openGallery = async (): Promise<string | null> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permission.status !== 'granted') {
      Alert.alert('Izin Ditolak', 'Akses galeri diperlukan untuk memilih foto.');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled || !result.assets?.[0]) return null;
    return result.assets[0].uri;
  };

  return { openCamera, openGallery };
}
```

### 9.2. Pembuatan Formulir Pembaruan Status Pekerjaan Lapangan

Layar formulir pembaruan *milestone* dirancang untuk mengumpulkan seluruh informasi yang dibutuhkan dalam satu sesi pengisian yang efisien.

**Komponen Formulir dan Validasi:**
Formulir terdiri dari beberapa elemen input berikut:
1.  **Foto Bukti Pekerjaan:** Area pratinjau (*preview*) foto yang dapat menampung hingga 5 gambar. Masing-masing gambar dapat dihapus secara individual. Tombol penambahan foto menampilkan pilihan antara "Ambil Foto Kamera" dan "Pilih dari Galeri".
2.  **Catatan Pekerjaan (Opsional):** Kolom teks bebas untuk memberikan keterangan tambahan, seperti kendala yang ditemui atau informasi spesifik pekerjaan yang tidak dapat dicakup oleh foto.
3.  **Konfirmasi Status:** Komponen *checkbox* atau *toggle* yang mewajibkan pengawas secara eksplisit menyatakan bahwa pekerjaan telah selesai dikerjakan dan siap untuk diverifikasi.

Sebelum pengiriman, validasi sisi klien (*client-side validation*) dilakukan untuk memastikan setidaknya satu foto telah dilampirkan. Tombol kirim dinonaktifkan (*disabled state*) selama proses validasi berjalan untuk mencegah pengiriman ganda.

**Potongan Kode: `MilestoneUpdateScreen.tsx` (Formulir Pelaporan)**
```tsx
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useCameraAndGallery } from '@/hooks/useCameraAndGallery';
import { useSubmitMilestoneReport } from '@/hooks/useMilestones';

export default function MilestoneUpdateScreen({ route }) {
  const { milestoneId, namaPekerjaan } = route.params;
  const [photos, setPhotos]         = useState<string[]>([]);
  const [catatan, setCatatan]       = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const { openCamera, openGallery }     = useCameraAndGallery();
  const { mutateAsync: submitReport }   = useSubmitMilestoneReport();

  const handleAddPhoto = async (source: 'camera' | 'gallery') => {
    const uri = source === 'camera' ? await openCamera() : await openGallery();
    if (uri && photos.length < 5) {
      setPhotos(prev => [...prev, uri]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (photos.length === 0) {
      Alert.alert('Foto Diperlukan', 'Tambahkan minimal 1 foto sebagai bukti pekerjaan.');
      return;
    }
    
    setSubmitting(true);
    try {
      await submitReport({ milestoneId, photos, catatan });
      // Navigasi kembali ke daftar milestone setelah berhasil
      navigation.goBack();
    } catch (error) {
      Alert.alert('Gagal Mengirim', 'Laporan gagal terkirim. Periksa koneksi dan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 16 }}>
        Laporan: {namaPekerjaan}
      </Text>

      {/* Grid Pratinjau Foto */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {photos.map((uri, index) => (
          <View key={index} style={{ position: 'relative' }}>
            <Image source={{ uri }} style={{ width: 100, height: 100, borderRadius: 8 }} />
            <TouchableOpacity
              onPress={() => handleRemovePhoto(index)}
              style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#ef4444', borderRadius: 99, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tombol Tambah Foto */}
      {photos.length < 5 && (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <TouchableOpacity onPress={() => handleAddPhoto('camera')}
            style={{ flex: 1, backgroundColor: '#1e40af', padding: 14, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '600' }}>📷 Kamera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleAddPhoto('gallery')}
            style={{ flex: 1, backgroundColor: '#374151', padding: 14, borderRadius: 12, alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '600' }}>🖼 Galeri</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Tombol Kirim Laporan */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting || photos.length === 0}
        style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#16a34a', padding: 16, borderRadius: 14, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>
          {isSubmitting ? 'Mengirim Laporan...' : 'Kirim Laporan Pekerjaan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

### 9.3. Pembangunan Endpoint Penerimaan Laporan dan Pembaruan Log Histori

Setelah formulir dikirim dari aplikasi *mobile*, *backend* harus menangani dua hal secara bersamaan: menyimpan berkas foto ke sistem penyimpanan, dan memperbarui status *milestone* beserta rekaman historisnya.

**Arsitektur Penanganan Unggah File (Multipart/Form-Data):**
Kesalahan umum yang ditemukan pada tahap awal pengembangan adalah pengiriman data foto dalam format *payload* JSON (menggunakan encoding Base64). Pendekatan ini memiliki dua kelemahan utama: ukuran data membengkak hingga 33% akibat proses encoding, dan *backend* Express/NestJS berbasis `multer` tidak dirancang untuk memproses berkas biner yang tertanam dalam body JSON.

Oleh karena itu, pengiriman data formulir laporan dimigrasi secara penuh ke format `multipart/form-data`. Pada format ini, berkas foto dikirim sebagai bagian biner murni, sementara metadata (seperti `milestoneId` dan `catatan`) dikirim sebagai bagian teks dalam satu permintaan HTTP yang sama.

**Potongan Kode: `submitMilestoneReport` di `mobile/src/services/milestones.ts`**
```typescript
export async function submitMilestoneReport(
  milestoneId: string,
  photoUris: string[],
  catatan: string,
  token: string
) {
  const formData = new FormData();
  
  // Lampirkan metadata sebagai field teks biasa
  formData.append('milestoneId', milestoneId);
  formData.append('catatan', catatan);

  // Lampirkan setiap foto sebagai objek binary FormData
  photoUris.forEach((uri, index) => {
    const filename = uri.split('/').pop() ?? `photo_${index}.jpg`;
    const match    = /\.(\w+)$/.exec(filename);
    const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
    
    formData.append('photos', {
      uri,
      name: filename,
      type: mimeType,
    } as any); // Cast 'as any' diperlukan untuk kompatibilitas FormData React Native
  });

  const response = await fetch(`${API_BASE_URL}/mobile/milestones/report`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // PENTING: Content-Type TIDAK boleh diset secara manual.
      // Browser/RN akan otomatis menambahkan boundary yang benar untuk multipart.
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Pengiriman laporan gagal: HTTP ${response.status}`);
  }
  return response.json();
}
```

**Potongan Kode: Endpoint Penerima di `mobile.controller.ts` (NestJS)**
```typescript
import { UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Post('milestones/report')
@UseGuards(JwtAuthGuard)
@UseInterceptors(FilesInterceptor('photos', 5, {
  storage: diskStorage({
    destination: './public/uploads/milestone-reports',
    filename: (req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, callback) => {
    // Hanya izinkan file dengan ekstensi gambar yang valid
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return callback(new BadRequestException('Hanya file gambar yang diizinkan'), false);
    }
    callback(null, true);
  }
}))
async submitReport(
  @UploadedFiles() files: Express.Multer.File[],
  @Body() body: SubmitReportDto,
  @CurrentUser() user: UserPayload
) {
  const photoUrls = files.map(f => `/uploads/milestone-reports/${f.filename}`);
  return this.mobileService.createMilestoneReport(body.milestoneId, photoUrls, body.catatan, user.id);
}
```

**Potongan Kode: Logika Pembuatan Log di `mobile.service.ts`**
```typescript
async createMilestoneReport(
  milestoneId: string,
  photoUrls: string[],
  catatan: string,
  pengawasId: string
) {
  return prisma.$transaction(async (tx) => {
    // 1. Perbarui status utama Milestone menjadi WAITING_APPROVAL
    //    Pengawas tidak dapat langsung mengubah status menjadi COMPLETED.
    //    Persetujuan final selalu ada di tangan Manajer.
    const updatedMilestone = await tx.milestone.update({
      where: { id: milestoneId },
      data: { status: 'WAITING_APPROVAL' }
    });

    // 2. Buat rekaman log audit yang permanen dan tidak dapat diubah
    await tx.milestoneLog.create({
      data: {
        milestoneId,
        status:     'WAITING_APPROVAL',
        catatan:    catatan || 'Laporan diajukan oleh pengawas lapangan.',
        photoUrls,  // Array URL foto yang disimpan di server
        reportedBy: pengawasId,
      }
    });

    return updatedMilestone;
  });
}
```

---

## FASE 10: Sinkronisasi Status Konstruksi & Penguncian Otorisasi (State Machine)

Fase ini menyelesaikan siklus penuh alur kerja pelaporan lapangan. Setelah pengawas mengirim laporan (Fase 9), laporan tersebut memasuki antrian persetujuan di Web Admin. Fase 10 mendefinisikan mekanisme bagaimana manajer memproses laporan tersebut, aturan transisi status yang berlaku, dan mekanisme perlindungan data guna mencegah korupsi nilai progres unit.

### 10.1. Pemisahan Otoritas: Pengawas dan Manajer

Kesalahan desain yang umum pada sistem manajemen konstruksi adalah memberikan keleluasaan kepada pengawas untuk memodifikasi nilai progres secara langsung. Hal ini membuka celah manipulasi data.

**Logika Bisnis:**
Sistem SIMDP menerapkan prinsip *Segregation of Duties* (Pemisahan Tugas) secara tegas. Dua otoritas yang berbeda berlaku di dalam sistem:

*   **Otoritas Pengawas Lapangan:**
    - Dapat mengubah status *milestone* dari `PENDING` menjadi `IN_PROGRESS` (menandai pekerjaan dimulai).
    - Dapat mengajukan laporan penyelesaian, yang secara otomatis mengubah status menjadi `WAITING_APPROVAL`.
    - **Tidak dapat** memodifikasi nilai persentase progres unit secara langsung.
    - **Tidak dapat** mengubah status *milestone* menjadi `COMPLETED`.

*   **Otoritas Manajer Proyek:**
    - Dapat melihat seluruh laporan yang berstatus `WAITING_APPROVAL` dari semua unit dan semua pengawas.
    - Memiliki kewenangan eksklusif untuk menyetujui (`APPROVE`) atau menolak (`REJECT`) sebuah laporan.
    - Saat menyetujui, sistem secara otomatis menambahkan nilai `bobotPersentase` *milestone* ke kolom `progress` pada tabel `Unit`.
    - Saat menolak, manajer wajib mengisi catatan revisi yang akan diteruskan ke pengawas.

Pemisahan ini diimplementasikan melalui kombinasi *Role-Based Access Control* (RBAC) pada level API dan validasi logika bisnis pada lapisan *Service*.

### 10.2. Mesin Status Milestone (State Machine Transitions)

Alur transisi status *milestone* tidak bersifat bebas; setiap status hanya dapat berpindah ke status tertentu berdasarkan kondisi yang valid. Implementasi *State Machine* ini mencegah situasi tidak konsisten seperti sebuah *milestone* berpindah dari `COMPLETED` kembali ke `PENDING` tanpa melalui mekanisme yang diotorisasi.

**Diagram Alur Transisi Status:**
```
PENDING
  └─► IN_PROGRESS       (dipicu oleh: Pengawas memulai pekerjaan)
        └─► WAITING_APPROVAL  (dipicu oleh: Pengawas mengirim laporan)
              ├─► COMPLETED    (dipicu oleh: Manajer menyetujui laporan)
              └─► REJECTED     (dipicu oleh: Manajer menolak laporan)
                    └─► WAITING_APPROVAL  (dipicu oleh: Pengawas mengirim laporan revisi)
```

**Implementasi Validasi Transisi di `construction.service.ts`:**
```typescript
// Peta aturan transisi yang diizinkan per status asal
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  'PENDING':           ['IN_PROGRESS'],
  'IN_PROGRESS':       ['WAITING_APPROVAL'],
  'WAITING_APPROVAL':  ['COMPLETED', 'REJECTED'],
  'REJECTED':          ['WAITING_APPROVAL'],
  'COMPLETED':         [], // Status final; tidak ada transisi yang diizinkan
};

async transitionMilestoneStatus(
  milestoneId: string,
  newStatus: string,
  requestingUserId: string
) {
  const milestone = await prisma.milestone.findUniqueOrThrow({
    where: { id: milestoneId }
  });
  
  const allowedNextStatuses = ALLOWED_TRANSITIONS[milestone.status];

  // Validasi: Periksa apakah transisi yang diminta terdaftar sebagai valid
  if (!allowedNextStatuses.includes(newStatus)) {
    throw new BadRequestException(
      `Transisi tidak valid: Status '${milestone.status}' tidak dapat berpindah ke '${newStatus}'.`
    );
  }

  return prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: newStatus }
  });
}
```

### 10.3. Implementasi Transaksi Atomik untuk Persetujuan Progres

Operasi persetujuan (*approve*) merupakan salah satu transaksi paling kritis dalam sistem karena melibatkan modifikasi pada beberapa tabel secara bersamaan. Kegagalan di satu tahap tanpa *rollback* yang benar dapat menghasilkan kondisi inkonsisten, misalnya status *milestone* berubah menjadi `COMPLETED` tetapi nilai progres pada tabel `Unit` tidak bertambah.

**Implementasi Teknis:**
Seluruh rangkaian operasi persetujuan dibungkus di dalam mekanisme transaksi interaktif Prisma (`prisma.$transaction`). Prisma menjamin bahwa semua perintah di dalam blok transaksi tersebut akan dieksekusi secara *atomik*: jika salah satu perintah gagal karena alasan apapun (koneksi terputus, *constraint* basis data dilanggar), semua perubahan sebelumnya dalam blok yang sama akan dikembalikan (*rolled back*) secara otomatis.

**Potongan Kode: `construction.service.ts` (Logika Approve Lengkap)**
```typescript
async approveMilestone(milestoneId: string, manajerId: string, catatan?: string) {
  // Validasi awal: Hanya milestone berstatus WAITING_APPROVAL yang bisa disetujui
  const milestone = await prisma.milestone.findFirst({
    where: { id: milestoneId, status: 'WAITING_APPROVAL' },
    include: { unit: true }
  });

  if (!milestone) {
    throw new NotFoundException(
      'Milestone tidak ditemukan atau tidak dalam status menunggu persetujuan.'
    );
  }

  // Ambil nilai progres unit saat ini sebelum penambahan
  const progressSebelumnya = milestone.unit.progress;
  const progressBaru = progressSebelumnya + milestone.bobotPersentase;

  return prisma.$transaction(async (tx) => {
    // OPERASI 1: Ubah status Milestone menjadi COMPLETED
    const completedMilestone = await tx.milestone.update({
      where: { id: milestoneId },
      data: { status: 'COMPLETED' }
    });

    // OPERASI 2: Tambahkan bobot persentase ke progres Unit
    // Menggunakan operator 'increment' Prisma untuk menghindari Race Condition:
    // Jika dua manajer menyetujui secara bersamaan, nilai tidak akan saling menimpa.
    await tx.unit.update({
      where: { id: milestone.unitId },
      data: { progress: { increment: milestone.bobotPersentase } }
    });

    // OPERASI 3: Catat rekaman persetujuan ke log audit
    await tx.milestoneLog.create({
      data: {
        milestoneId,
        status:     'COMPLETED',
        catatan:    catatan ?? 'Laporan disetujui oleh manajer.',
        reportedBy: manajerId,
      }
    });

    // OPERASI 4: Periksa apakah unit telah mencapai progres 100%
    // Jika ya, ubah status pembangunan unit menjadi Selesai Dibangun
    if (progressBaru >= 100) {
      await tx.unit.update({
        where: { id: milestone.unitId },
        data: { statusPembangunan: 'SIAP_HUNI' }
      });
    }

    return completedMilestone;
  });
}
```

**Catatan Penggunaan `increment`:**
Pada Operasi 2, digunakan operator `increment` bawaan Prisma alih-alih membaca nilai `progress` saat ini lalu menambahkannya secara manual di kode TypeScript. Alasannya adalah untuk mencegah *Race Condition*: dalam skenario di mana dua manajer menyetujui dua *milestone* berbeda dari unit yang sama secara hampir bersamaan, jika nilai dibaca lalu ditulis secara manual, salah satu nilai bisa tertimpa. Operator `increment` mendelegasikan kalkulasi ke tingkat mesin basis data PostgreSQL yang menangani konkurensi secara aman.

### 10.4. Pembangunan Antarmuka Verifikasi Progres di Web Admin

Di sisi *Web Admin*, manajer memerlukan antarmuka yang dapat menampilkan semua laporan yang masuk secara terstruktur dan memudahkan proses tinjauan.

**Keputusan Desain: 3-Step Drill-Down Navigation**
Karena sistem dapat mengelola ratusan unit dari beberapa proyek sekaligus, menampilkan seluruh laporan dalam satu tabel datar akan menghasilkan antarmuka yang sulit dioperasikan. Oleh karena itu, diterapkan pola navigasi *drill-down* tiga tingkat:

1.  **Tingkat 1 — Pilih Proyek:** Manajer memilih proyek yang ingin ditinjau dari daftar kartu proyek.
2.  **Tingkat 2 — Pilih Unit/Blok:** Sistem menampilkan daftar blok dan unit yang di dalamnya terdapat laporan berstatus `WAITING_APPROVAL`. Unit yang tidak memiliki laporan menunggu tidak ditampilkan untuk mengurangi kebisingan informasi.
3.  **Tingkat 3 — Tinjau Laporan:** Manajer melihat detail laporan termasuk foto-foto bukti pekerjaan, catatan pengawas, dan riwayat log sebelumnya, sebelum mengambil keputusan approve atau reject.

**Potongan Kode: Filter Unit yang Memerlukan Perhatian di `page.tsx`**
```tsx
"use client";
import { useState, useEffect } from 'react';

export default function VerifikasiProgresPage() {
  const [projects, setProjects]   = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [units, setUnits]         = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [milestones, setMilestones] = useState([]);

  // Memuat daftar unit yang memiliki milestone WAITING_APPROVAL
  useEffect(() => {
    if (!selectedProject) return;

    fetch(`/api/projects/${selectedProject.id}/units?hasWaitingApproval=true`)
      .then(res => res.json())
      .then(data => {
        const unitData = Array.isArray(data.data) ? data.data : data;
        
        // Penyortiran alfanumerik agar Blok A1, A2, A10 tampil berurutan benar
        unitData.sort((a, b) => {
          if (a.blok !== b.blok) return a.blok.localeCompare(b.blok);
          return String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true });
        });
        
        setUnits(unitData);
      });
  }, [selectedProject]);

  // Memuat milestone dari unit yang dipilih
  useEffect(() => {
    if (!selectedUnit) return;

    fetch(`/api/units/${selectedUnit.id}/milestones?status=WAITING_APPROVAL`)
      .then(res => res.json())
      .then(data => setMilestones(Array.isArray(data.data) ? data.data : data));
  }, [selectedUnit]);

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {/* Kolom Kiri: Daftar Unit */}
      <div className="col-span-1 bg-white rounded-2xl p-4 shadow-sm border overflow-y-auto">
        <h2 className="font-bold text-lg mb-3">Pilih Unit</h2>
        {units.map(unit => (
          <button
            key={unit.id}
            onClick={() => setSelectedUnit(unit)}
            className={`w-full text-left p-3 rounded-xl mb-2 border-2 transition-colors
              ${selectedUnit?.id === unit.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-transparent hover:bg-gray-50'}`}
          >
            <p className="font-semibold">Blok {unit.blok}-{unit.nomor}</p>
            <p className="text-sm text-gray-500">{unit.tipeRumah?.nama}</p>
          </button>
        ))}
      </div>

      {/* Kolom Kanan: Detail Laporan Milestone */}
      <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border">
        {selectedUnit ? (
          <MilestoneReviewPanel milestones={milestones} />
        ) : (
          <p className="text-gray-400 text-center mt-16">Pilih unit dari daftar untuk meninjau laporan.</p>
        )}
      </div>
    </div>
  );
}
```

---

## FASE 11: Resolusi Transmisi Media & Optimasi Drill-Down UI Web Admin

Fase ini merupakan fase stabilisasi dan penyempurnaan dari dua komponen yang paling sering diinteraksikan oleh pengguna: fitur unggah foto di aplikasi mobile dan antarmuka verifikasi progres di Web Admin. Sejumlah isu teknis yang tidak terdeteksi selama pengembangan awal baru muncul saat sistem diuji dengan data nyata dalam kondisi jaringan yang tidak ideal.

### 11.1. Migrasi Format Pengiriman Foto dari JSON ke Multipart/Form-Data

Meskipun keputusan arsitektur untuk menggunakan `multipart/form-data` sudah ditetapkan pada Fase 9, ditemukan bahwa implementasi pertamanya masih menggunakan pendekatan lama untuk beberapa skenario, yaitu mengonversi gambar ke Base64 dan menyematkannya dalam *payload* JSON.

**Diagnosis Masalah:**
Investigasi dilakukan dengan menganalisis log HTTP di peladen. Ditemukan bahwa ketika pengawas mengirim laporan dengan foto berukuran besar (di atas 3MB), permintaan HTTP berhasil diterima peladen dengan status HTTP 200 OK, namun berkas foto tidak tersimpan di sistem berkas. Peladen `multer` di NestJS menerima permintaan tetapi tidak menemukan bagian `multipart` yang berisi berkas biner. Penyebabnya: kode klien secara eksplisit menetapkan `Content-Type: application/json`, yang menyebabkan `multer` mengabaikan seluruh konten permintaan.

**Dua Aturan Wajib yang Ditetapkan:**
1.  Header `Content-Type` **tidak boleh** ditetapkan secara manual. Ketika menggunakan `FormData`, *runtime* React Native akan menghitung dan menambahkan nilai `Content-Type: multipart/form-data; boundary=...` beserta nilai *boundary* unik secara otomatis.
2.  Berkas gambar harus dilampirkan menggunakan struktur objek khusus React Native yang memiliki tiga properti wajib: `uri` (path lokal), `name` (nama berkas), dan `type` (MIME type).

**Potongan Kode: `media.ts` — Versi Final setelah Perbaikan**
```typescript
import { Platform } from 'react-native';

export async function uploadSinglePhoto(uri: string, token: string) {
  try {
    const formData = new FormData();
    const filename  = uri.split('/').pop() ?? `photo_${Date.now()}.jpg`;
    const extMatch  = /\.(\w+)$/.exec(filename);
    const mimeType  = extMatch ? `image/${extMatch[1].toLowerCase()}` : 'image/jpeg';

    // Pada iOS, URI memiliki prefiks 'file://' yang harus dihapus
    const normalizedUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    formData.append('image', { uri: normalizedUri, name: filename, type: mimeType } as any);

    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${token}` },
      // Content-Type TIDAK diset manual — runtime menanganinya sendiri
      body:    formData,
    });

    if (!response.ok) throw new Error(`Upload gagal: HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return null;
  }
}
```

### 11.2. Implementasi Conditional Defensive Parser untuk Respons API

Saat integrasi antara *Web Admin* dan *Backend* diuji, ditemukan inkonsistensi dalam format respons JSON dari berbagai *endpoint*. Beberapa mengembalikan array primitif (`[]`), sementara yang lain membungkusnya dalam objek (`{ data: [], meta: {} }`). Inkonsistensi ini menyebabkan antarmuka menampilkan halaman kosong atau galat runtime karena kode mencoba melakukan iterasi pada nilai `undefined`.

**Potongan Kode: `lib/api-parser.ts` (Reusable Defensive Parser)**
```typescript
/**
 * Mengurai respons API berformat tidak konsisten menjadi array yang aman.
 * Menangani tiga skenario:
 *  - Array primitif langsung: [item1, item2]
 *  - Objek pembungkus: { data: [item1, item2] }
 *  - Respons tidak dikenal / null: kembalikan array kosong
 */
export function parseApiResponse<T>(response: unknown): T[] {
  if (Array.isArray(response)) return response as T[];

  if (
    response !== null &&
    typeof response === 'object' &&
    'data' in response &&
    Array.isArray((response as any).data)
  ) {
    return (response as any).data as T[];
  }

  console.warn('[DEFENSIVE PARSER] Struktur respons tidak dikenali:', response);
  return [];
}
```

**Contoh Penggunaan di `page.tsx`:**
```tsx
const fetchMilestones = async (unitId: string) => {
  const res     = await fetch(`/api/units/${unitId}/milestones`);
  const rawData = await res.json();
  setMilestones(parseApiResponse<Milestone>(rawData));
};
```

### 11.3. Transformasi UI: Navigasi 3-Step Drill-Down dan Lazy Fetching

Pada versi awal Web Admin, semua *milestone* dari semua unit ditampilkan dalam satu tabel datar dengan ribuan baris. Pemuatan ribuan baris DOM serentak menyebabkan penurunan performa browser yang signifikan, dan manajer harus melakukan *scroll* panjang untuk menemukan laporan yang relevan.

**Keputusan Desain:**
Antarmuka didesain ulang menggunakan pola navigasi *3-Step Drill-Down*. Setiap lapisan hanya memuat data setelah lapisan sebelumnya dipilih (*lazy fetching*), sehingga beban awal halaman berkurang drastis.

**Potongan Kode: State Management dan Lazy Fetching di `page.tsx`**
```tsx
const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
const [selectedUnitId,    setSelectedUnitId]    = useState<string | null>(null);
const [units, setUnits]         = useState<Unit[]>([]);
const [milestones, setMilestones] = useState<Milestone[]>([]);

// Reset state turunan saat proyek berubah
const handleSelectProject = (id: string) => {
  setSelectedProjectId(id);
  setSelectedUnitId(null);
  setUnits([]);
  setMilestones([]);
};

// Muat unit saat proyek dipilih — hanya unit yang memiliki SPK aktif
useEffect(() => {
  if (!selectedProjectId) return;
  fetch(`/api/projects/${selectedProjectId}/units?spkNotNull=true&exclude=SIAP_HUNI`)
    .then(r => r.json())
    .then(data => {
      const parsed = parseApiResponse<Unit>(data);
      // Penyortiran alfanumerik untuk memastikan urutan A1, A2, A10
      parsed.sort((a, b) => {
        if (a.blok !== b.blok) return a.blok.localeCompare(b.blok);
        return String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true });
      });
      setUnits(parsed);
    });
}, [selectedProjectId]);

// Muat milestone saat unit dipilih
useEffect(() => {
  if (!selectedUnitId) return;
  fetch(`/api/units/${selectedUnitId}/milestones`)
    .then(r => r.json())
    .then(data => setMilestones(parseApiResponse<Milestone>(data)));
}, [selectedUnitId]);
```

### 11.4. Komponen Custom Modal Konfirmasi dengan Efek Backdrop Blur

Dialog bawaan browser (`window.confirm()`) digantikan dengan komponen *Modal* kustom berbasis React. Modal ini menggunakan efek *backdrop blur* untuk memberikan fokus visual yang jelas, dan mendukung teks konfirmasi yang kontekstual sesuai aksi yang sedang dilakukan.

**Potongan Kode: `ConfirmModal.tsx`**
```tsx
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant: 'success' | 'danger';
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen, title, message, confirmLabel,
  variant, isLoading, onConfirm, onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const btnClass = variant === 'success'
    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
    : 'bg-red-600 hover:bg-red-700 shadow-red-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-2 text-xl font-bold text-zinc-900">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-zinc-500">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 
              text-sm font-semibold text-white shadow-lg transition-all ${btnClass}
              disabled:opacity-60`}
          >
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-semibold
              text-zinc-700 transition-colors hover:bg-zinc-200 disabled:opacity-60"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## FASE 12: Otomasi Pemicu Keuangan (Finance Triggers) & Push Notifications

Fase 12 merupakan salah satu fase paling kompleks dalam keseluruhan siklus pengembangan SIMDP. Sistem ditingkatkan dari sekadar pencatat dan verifikasi menjadi entitas yang mampu bereaksi secara otonom terhadap perubahan kondisi bisnis. Dua fitur besar yang diimplementasikan adalah: mekanisme pemicu keuangan otomatis berbasis ambang batas progres konstruksi, dan sistem notifikasi *push* real-time yang menghubungkan keputusan manajer dengan pengawas di lapangan secara instan.

### 12.1. Algoritma Threshold Crossing untuk Pemicu Termin Pembayaran

Dalam kontrak SPK antara developer dan kontraktor, pencairan dana dikaitkan dengan pencapaian fisik tertentu. Kontraktor berhak menerima bagian dari nilai kontrak ketika progres fisik kavling mencapai titik-titik tertentu (misalnya 30%, 60%, dan 100%). Proses ini di lingkungan konvensional memerlukan birokrasi manual yang memakan waktu.

**Logika Bisnis — Mengapa Menggunakan Pendekatan Crossing, Bukan Equality:**
Sistem tidak memeriksa apakah nilai progres *sama dengan* nilai ambang batas (`progress == 50`), melainkan apakah nilai progres *baru saja melewati* nilai ambang batas. Ini dilakukan dengan membandingkan nilai progres sebelum dan sesudah penambahan. Pendekatan ini diperlukan karena bobot setiap *milestone* tidak selalu merupakan bilangan yang menghasilkan penjumlahan tepat pada titik ambang batas. Misalnya, dengan bobot 15%, progres bisa langsung melompat dari 40% ke 55%, melewati titik 50% tanpa pernah bernilai tepat 50%.

**Potongan Kode: `construction.service.ts` — Algoritma Threshold Crossing**
```typescript
const TERMIN_THRESHOLDS = [
  { persentase: 30,  label: 'Termin 1 (30%) — Pondasi & Struktur'  },
  { persentase: 60,  label: 'Termin 2 (60%) — Dinding & Atap'      },
  { persentase: 100, label: 'Termin 3 (100%) — Finishing & Selesai' },
];

private async checkAndTriggerTermin(
  tx: Prisma.TransactionClient,
  unitId: string,
  spkId: string,
  progressSebelumnya: number,
  progressSesudahnya: number,
) {
  for (const termin of TERMIN_THRESHOLDS) {
    // Kondisi crossing: nilai sebelumnya di bawah batas, nilai sesudahnya di atas atau sama
    const terjebak = progressSebelumnya < termin.persentase
                  && progressSesudahnya >= termin.persentase;

    if (terjebak) {
      const spk = await tx.sPK.findUnique({
        where: { id: spkId },
        include: { terminList: true, kontraktor: true }
      });

      const terminSPK    = spk!.terminList.find(t => t.persentase === termin.persentase);
      const nilaiTagihan = terminSPK
        ? (spk!.nilaiKontrak.toNumber() * terminSPK.persentase) / 100
        : 0;

      await tx.expense.create({
        data: {
          kategori:  'Pembayaran Kontraktor',
          deskripsi: `${termin.label} — Kontraktor: ${spk!.kontraktor.namaPerusahaan}`,
          jumlah:    nilaiTagihan,
          status:    'DRAFT', // Staf keuangan mereview sebelum mencairkan
          spkId,
          unitId,
          // Jatuh tempo 14 hari sejak tagihan tercipta
          tanggalJatuhTempo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        }
      });

      // Tandai termin SPK sudah dipicu agar tidak terpicu dua kali
      if (terminSPK) {
        await tx.terminSPK.update({
          where: { id: terminSPK.id },
          data:  { status: 'SUDAH_DIPICU' }
        });
      }
    }
  }
}
```

### 12.2. Arsitektur Registrasi dan Sinkronisasi Expo Push Token

*Push Notification* memerlukan token unik per perangkat yang dikelola oleh server Expo. Token ini perlu disinkronkan ke basis data SIMDP agar sistem dapat mengetahui cara menghubungi perangkat pengawas yang spesifik.

**Strategi Sinkronisasi:**
Proses registrasi token terjadi otomatis setiap kali pengguna berhasil *login*. Sistem menggunakan strategi *upsert* untuk memperbarui token jika sudah ada, atau menyisipkan token baru jika belum terdaftar. Satu pengguna dapat memiliki lebih dari satu token (jika menggunakan lebih dari satu perangkat).

**Potongan Kode: `registerAndSyncPushToken` di Sisi Mobile**
```typescript
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerAndSyncPushToken(authToken: string): Promise<void> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[PUSH] Pengguna menolak izin notifikasi.');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  });

  await fetch(`${process.env.EXPO_PUBLIC_API_URL}/mobile/push-token`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${authToken}`,
    },
    body: JSON.stringify({ token: tokenData.data }),
  });
}
```

### 12.3. Sistem Penembakan Notifikasi Fire-and-Forget

Pengiriman notifikasi ke server eksternal Expo tidak boleh memblokir respons HTTP ke *browser* manajer. Oleh karena itu, fungsi pengiriman notifikasi menggunakan pola *Fire-and-Forget*: dipanggil tanpa `await` di dalam *controller*, dan menangani kegagalannya sendiri secara internal.

**Potongan Kode: `push-notification.service.ts`**
```typescript
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

const expoClient = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export async function sendPushToUser(
  userId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where:  { id: userId },
      select: { expoPushTokens: true }
    });

    if (!user?.expoPushTokens?.length) return;

    const messages: ExpoPushMessage[] = user.expoPushTokens
      .filter(token => Expo.isExpoPushToken(token))
      .map(token => ({
        to:        token,
        sound:     'default',
        title,
        body,
        data:      data ?? {},
        channelId: 'milestone-updates',
      }));

    // Pecah menjadi bongkahan untuk mematuhi batas ukuran API Expo
    const chunks = expoClient.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expoClient.sendPushNotificationsAsync(chunk);
    }
  } catch (error) {
    // Kegagalan notifikasi tidak disebarkan ke pemanggil
    console.error('[PUSH NOTIFICATION ERROR]', error);
  }
}
```

**Integrasi di `construction.service.ts` (tanpa `await`):**
```typescript
async approveMilestone(milestoneId: string, manajerId: string, catatan?: string) {
  // ... kode transaksi database ...

  // Fire-and-Forget: tidak menggunakan 'await' agar respons tidak tertahan
  sendPushToUser(
    milestone.pengawasId,
    '✅ Laporan Disetujui',
    `Pekerjaan "${milestone.namaPekerjaan}" pada Kavling ${unit.blok}-${unit.nomor} telah disetujui.`,
    { milestoneId, route: 'MilestoneDetail' }
  );

  return completedMilestone;
}

async rejectMilestone(milestoneId: string, manajerId: string, catatanRevisi: string) {
  // ... kode transaksi database ...

  sendPushToUser(
    milestone.pengawasId,
    '❌ Laporan Ditolak — Revisi Diperlukan',
    `Pekerjaan "${milestone.namaPekerjaan}" ditolak. Catatan: ${catatanRevisi}`,
    { milestoneId, route: 'MilestoneUpdate' }
  );

  return rejectedMilestone;
}
```

### 12.4. Deep Link Handler dan Invalidasi Cache saat Notifikasi Diketuk

Ketika pengawas mengetuk notifikasi, aplikasi harus membuka layar yang relevan secara langsung dan memuat data terbaru dari server (bukan dari cache lokal yang mungkin sudah usang).

**Potongan Kode: Deep Link Handler di `AppNavigator.tsx`**
```typescript
import * as Notifications from 'expo-notifications';
import { useQueryClient }  from '@tanstack/react-query';

// Konfigurasi tampilan notifikasi saat aplikasi dalam keadaan foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

export function AppNavigator() {
  const navigation  = useNavigation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as {
        milestoneId?: string;
        route?: string;
      };

      if (data.milestoneId && data.route) {
        // Paksa refresh data yang berkaitan dengan milestone ini
        queryClient.invalidateQueries({ queryKey: ['milestone', data.milestoneId] });
        queryClient.invalidateQueries({ queryKey: ['milestones'] });

        // Navigasi ke layar yang ditentukan oleh payload notifikasi
        navigation.navigate(data.route as never, { milestoneId: data.milestoneId } as never);
      }
    });

    // Bersihkan listener saat komponen di-unmount (mencegah kebocoran memori)
    return () => subscription.remove();
  }, [navigation, queryClient]);
}
```

---

## FASE 13: Pengembangan Portal Publik, Optimalisasi Performa, dan Penguatan Keamanan Aplikasi

Fase ini merupakan fase pengembangan akhir sebelum sistem memasuki tahap persiapan *deployment*. Fokus pada fase ini terbagi ke dalam tiga domain utama: (1) pembangunan Portal Publik sebagai antarmuka menghadap konsumen eksternal (B2C), (2) optimalisasi performa di sisi *backend* dan *frontend* untuk memastikan sistem dapat menangani beban produksi, dan (3) penguatan lapisan keamanan aplikasi melalui serangkaian konfigurasi pertahanan yang diterapkan langsung pada kode sumber.

### 13.1. Pembangunan Portal Publik dengan Server-Side Rendering (SSR)

Berbeda dengan *Web Admin* yang beroperasi di balik sistem autentikasi dan hanya diakses oleh staf internal, Portal Publik adalah antarmuka yang bisa diakses oleh siapa saja, termasuk calon pembeli properti. Antarmuka ini dirancang untuk menampilkan informasi ketersediaan unit, tipe rumah, harga, dan progres pembangunan secara visual.

**Alasan Penggunaan Server-Side Rendering (SSR):**
Pada *Web Admin*, pendekatan *Client-Side Rendering* (CSR) dengan React Query sudah mencukupi karena konten tidak perlu diindeks oleh mesin pencari. Namun, pada Portal Publik, dua syarat teknis harus dipenuhi:
1.  **Kecepatan Muat Pertama (*First Contentful Paint*):** Calon pembeli yang mengakses portal dari tautan promosi atau iklan digital harus langsung melihat konten bermakna, bukan layar kosong sementara JavaScript diunduh dan dieksekusi.
2.  **Optimasi Mesin Pencari (SEO):** *Crawler* Google tidak mengeksekusi JavaScript secara sempurna. Agar halaman properti dapat muncul di hasil pencarian Google dengan metadata yang lengkap (judul halaman, deskripsi, gambar), konten harus sudah tersedia di dalam HTML saat halaman pertama kali dimuat.

Oleh karena itu, seluruh halaman Portal Publik diimplementasikan sebagai *Server Components* murni di Next.js, yang mengambil data langsung di sisi server sebelum HTML dikirim ke browser pengunjung.

**Potongan Kode: `app/(public)/projects/[slug]/page.tsx` (SSR Murni)**
```tsx
import { Metadata } from 'next';

// Fungsi ini dieksekusi di Node.js (server), bukan di browser klien
async function getProjectData(slug: string) {
  const res = await fetch(`${process.env.INTERNAL_API_URL}/projects/by-slug/${slug}`, {
    // ISR: data di-cache dan diperbarui setiap 60 detik tanpa rebuild penuh
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

// Metadata halaman digenerate secara dinamis untuk keperluan SEO
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const project = await getProjectData(params.slug);
  if (!project) return { title: 'Proyek Tidak Ditemukan' };

  return {
    title:       `${project.nama} — Developer Properti`,
    description: project.deskripsi,
    openGraph: {
      title:       project.nama,
      description: project.deskripsi,
      images:      [{ url: project.fotoCover }],
      type:        'website',
    },
    // Structured Data (Schema.org) untuk Google Rich Snippets
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type':    'RealEstateListing',
        name:       project.nama,
        address:    project.lokasi,
      }),
    },
  };
}

// Async Server Component — tidak ada 'use client'
export default async function ProjectPublicPage({ params }: { params: { slug: string } }) {
  const project = await getProjectData(params.slug);
  if (!project) return <NotFoundView />;

  return (
    <main>
      <ProjectHeroSection    project={project} />
      <UnitAvailabilityGrid  units={project.units} />
      <InteractiveSitePlan   svgUrl={project.svgDenah} units={project.units} />
      <ContactCTASection     projectId={project.id} />
    </main>
  );
}
```

### 13.2. Implementasi Peta Denah Interaktif (Dynamic SVG Site Plan)

Peta denah (*Site Plan*) adalah salah satu fitur paling informatif pada portal pemasaran properti. Alih-alih menyajikan gambar statis, sistem dikembangkan untuk menampilkan SVG interaktif di mana setiap poligon kavling pada peta dapat diklik dan merespons *hover* dari pengguna.

**Arsitektur Teknis:**
Berkas SVG untuk denah perumahan disiapkan oleh tim desain dengan setiap poligon kavling diberi atribut `data-unit-id` yang berisi ID unit terkait. Ketika SVG dirender di browser, kode JavaScript menyuntikkan *event listener* ke setiap elemen poligon untuk menampilkan tooltip berisi status unit, harga, dan tipe rumah.

Pewarnaan kavling bersifat dinamis: `Tersedia` ditampilkan hijau, `Booked` kuning, dan `Terjual` merah. Warna diperbarui secara otomatis berdasarkan data dari API.

**Pertimbangan Performa pada SVG Kompleks:**
SVG denah perumahan dengan ratusan kavling dapat berukuran sangat besar (di atas 500KB). Untuk mengatasinya:
-   Komponen SVG di-*memoize* menggunakan `React.memo` untuk mencegah *re-render* yang tidak perlu.
-   Modifikasi atribut warna kavling dilakukan langsung pada elemen DOM SVG menggunakan `useRef`, bukan melalui *state* React, sehingga menghindari siklus render penuh.

**Potongan Kode: `InteractiveSitePlan.tsx`**
```tsx
"use client";
import { useEffect, useRef, useState, memo } from 'react';

interface Unit {
  id:              string;
  blok:            string;
  nomor:           string;
  statusPenjualan: 'Tersedia' | 'Booked' | 'Terjual';
  hargaJual:       number;
  tipeRumah:       { nama: string };
}

const STATUS_COLORS: Record<string, string> = {
  Tersedia: '#22c55e',
  Booked:   '#f59e0b',
  Terjual:  '#ef4444',
};

export const InteractiveSitePlan = memo(function InteractiveSitePlan(
  { svgUrl, units }: { svgUrl: string; units: Unit[] }
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ unit: Unit; x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Peta lookup O(1) agar pencarian per event tidak melalui iterasi array
    const unitMap = new Map(units.map(u => [u.id, u]));

    unitMap.forEach((unit, unitId) => {
      const el = container.querySelector<SVGElement>(`[data-unit-id="${unitId}"]`);
      if (!el) return;

      // Modifikasi langsung pada DOM — tidak melalui React state (lebih cepat)
      el.style.fill       = STATUS_COLORS[unit.statusPenjualan] ?? '#94a3b8';
      el.style.opacity    = '0.75';
      el.style.cursor     = 'pointer';
      el.style.transition = 'opacity 0.15s ease';

      el.addEventListener('mouseenter', () => {
        el.style.opacity = '1';
        const rect = el.getBoundingClientRect();
        setTooltip({ unit, x: rect.left + rect.width / 2, y: rect.top });
      });

      el.addEventListener('mouseleave', () => {
        el.style.opacity = '0.75';
        setTooltip(null);
      });
    });
  }, [units]);

  return (
    <div className="relative w-full" ref={containerRef}>
      <object data={svgUrl} type="image/svg+xml"
        className="w-full h-auto" aria-label="Peta Denah Perumahan" />

      {tooltip && (
        <div className="fixed z-50 rounded-xl bg-white p-3 shadow-2xl border text-sm"
          style={{ left: tooltip.x, top: tooltip.y - 10, transform: 'translate(-50%, -100%)' }}>
          <p className="font-bold">Kavling {tooltip.unit.blok}-{tooltip.unit.nomor}</p>
          <p className="text-gray-500">{tooltip.unit.tipeRumah.nama}</p>
          <p className="font-semibold text-blue-600">
            Rp {tooltip.unit.hargaJual.toLocaleString('id-ID')}
          </p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full
            ${ tooltip.unit.statusPenjualan === 'Tersedia'
                 ? 'bg-green-100 text-green-700'
                 : tooltip.unit.statusPenjualan === 'Booked'
                 ? 'bg-yellow-100 text-yellow-700'
                 : 'bg-red-100 text-red-700' }`}>
            {tooltip.unit.statusPenjualan}
          </span>
        </div>
      )}
    </div>
  );
});
```

### 13.3. Optimalisasi Performa Query Database

Seiring bertambahnya volume data, beberapa kueri yang bekerja baik selama pengembangan dengan data *dummy* menjadi lambat saat diuji dengan data produksi bervolume nyata.

**Tiga Masalah Utama yang Ditemukan:**
1.  **Over-fetching:** *Endpoint* menggunakan `prisma.unit.findMany({})` tanpa klausa `select`, sehingga mengambil semua kolom termasuk kolom berukuran besar yang tidak dibutuhkan oleh respons API.
2.  **N+1 Query Problem:** Kode mengambil daftar unit terlebih dahulu, lalu untuk setiap unit melakukan kueri terpisah untuk mendapatkan data `tipeRumah`. Dengan 200 unit, ini berarti 201 kueri database per satu permintaan halaman.
3.  **Tidak Ada Indeks pada Kolom Filter:** Kolom `statusPenjualan` dan `statusPembangunan` sering digunakan sebagai filter namun tidak memiliki indeks, menyebabkan *Full Table Scan* pada setiap kueri.

**Potongan Kode: Perbaikan Over-Fetching dan N+1**
```typescript
// Sebelum (tidak efisien): mengambil semua kolom + N+1 relasi
// const units = await prisma.unit.findMany({ where: { projectId } });
// for (const unit of units) { unit.tipeRumah = await prisma.tipeRumah.findUnique(...) }

// Sesudah (efisien): satu kueri dengan select terbatas dan include relasi
const units = await prisma.unit.findMany({
  where: { projectId },
  select: {
    id:              true,
    blok:            true,
    nomor:           true,
    hargaJual:       true,
    statusPenjualan: true,
    progress:        true,
    tipeRumah: {
      select: { id: true, nama: true, luasTanah: true, luasBangunan: true }
    },
    spk: {
      select: {
        kontraktor: { select: { namaPerusahaan: true } }
      }
    },
    milestones: {
      where:   { status: { not: 'COMPLETED' } },
      orderBy: { createdAt: 'asc' },
      take:    1, // Hanya ambil milestone aktif pertama untuk ringkasan
    }
  }
});
```

**Potongan Kode: Penambahan Indeks Database pada `schema.prisma`**
```prisma
model Unit {
  id               String  @id @default(uuid())
  blok             String
  nomor            String
  statusPenjualan  String  @default("Tersedia")
  statusPembangunan String @default("BELUM_MULAI")
  progress         Float   @default(0)

  // Indeks komposit untuk mempercepat kueri filter yang umum digunakan
  @@index([projectId, statusPenjualan])
  @@index([projectId, statusPembangunan])
  @@index([spkId])
}

model MilestoneLog {
  id          String   @id @default(uuid())
  milestoneId String
  status      String
  dibuatPada  DateTime @default(now())

  // Indeks untuk mempercepat pengambilan riwayat log berurutan
  @@index([milestoneId, dibuatPada])
}
```

### 13.4. Optimalisasi Performa Rendering React Frontend

Pada halaman daftar unit dengan ratusan baris, setiap kali ada *state* yang berubah (misalnya pengguna membuka *dropdown* filter), seluruh daftar dirender ulang meskipun data unit tidak berubah. Hal ini menyebabkan peningkatan penggunaan CPU yang terlihat pada perangkat dengan spesifikasi rendah.

**Implementasi `React.memo` dan `useCallback`:**
```tsx
// Komponen baris di-memo agar tidak dirender ulang kecuali props 'unit' berubah
const UnitTableRow = memo(function UnitTableRow({
  unit, onSelect
}: { unit: Unit; onSelect: (id: string) => void }) {
  return (
    <tr onClick={() => onSelect(unit.id)} className="hover:bg-gray-50 cursor-pointer">
      <td className="px-4 py-3 font-medium">{unit.blok}-{unit.nomor}</td>
      <td className="px-4 py-3 text-gray-600">{unit.tipeRumah?.nama}</td>
      <td className="px-4 py-3"><StatusBadge status={unit.statusPenjualan} /></td>
      <td className="px-4 py-3 text-right font-semibold">
        Rp {Number(unit.hargaJual).toLocaleString('id-ID')}
      </td>
      <td className="px-4 py-3"><ProgressBar value={unit.progress} /></td>
    </tr>
  );
});

export function UnitTable({ units }: { units: Unit[] }) {
  const router = useRouter();

  // useCallback memastikan referensi fungsi stabil antar render
  // sehingga memo pada UnitTableRow benar-benar efektif
  const handleSelectUnit = useCallback(
    (unitId: string) => router.push(`/admin/units/${unitId}`),
    [router]
  );

  return (
    <table className="w-full">
      <tbody>
        {units.map(unit => (
          <UnitTableRow key={unit.id} unit={unit} onSelect={handleSelectUnit} />
        ))}
      </tbody>
    </table>
  );
}
```

### 13.5. Penguatan Keamanan Aplikasi (Security Hardening)

Sebelum sistem memasuki fase *deployment*, serangkaian lapisan keamanan diterapkan langsung pada kode sumber *backend*.

#### 13.5.1. Rate Limiting untuk Mencegah Brute Force

Modul `@nestjs/throttler` diimplementasikan untuk membatasi jumlah permintaan per IP dalam periode waktu tertentu, melindungi *endpoint* login dari serangan percobaan kata sandi massal.

**Potongan Kode: Konfigurasi Global dan Khusus Login**
```typescript
// app.module.ts — Konfigurasi throttler global
@Module({
  imports: [
    ThrottlerModule.forRoot([
      { name: 'short',  ttl: 1000,  limit: 10  }, // 10 req/detik per IP
      { name: 'medium', ttl: 60000, limit: 100 }, // 100 req/menit per IP
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

// auth.controller.ts — Pembatasan lebih ketat untuk endpoint login
@Throttle({ short: { ttl: 60000, limit: 5 } }) // Maks 5 percobaan login per menit per IP
@Post('login')
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}
```

#### 13.5.2. Konfigurasi CORS Whitelist

Daftar *origin* yang diizinkan mengakses API dikonfigurasi secara eksplisit. Hanya domain resmi aplikasi yang dimasukkan dalam *whitelist*.

**Potongan Kode: CORS Whitelist di `main.ts`**
```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://admin.developer-properti.com',
  'https://developer-properti.com',
];

app.enableCors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Izinkan server-to-server
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin '${origin}' tidak diizinkan.`));
    }
  },
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials:    true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

#### 13.5.3. HTTP Security Headers dengan Helmet.js

Modul `helmet` menambahkan serangkaian header HTTP keamanan yang memberi instruksi kepada browser untuk mengaktifkan fitur perlindungan bawaan mereka.

**Header keamanan yang ditambahkan:**
-   `X-Content-Type-Options: nosniff` — Mencegah *MIME sniffing*.
-   `X-Frame-Options: DENY` — Mencegah *Clickjacking* melalui `<iframe>`.
-   `Strict-Transport-Security` — Memaksa HTTPS selama 1 tahun (*HSTS*).
-   `Content-Security-Policy` — Membatasi sumber daya yang boleh dimuat browser (*XSS mitigation*).

**Potongan Kode: Konfigurasi Helmet di `main.ts`**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"], // Dibutuhkan Tailwind
      imgSrc:      ["'self'", 'data:', 'blob:'],
      connectSrc:  ["'self'", 'https://exp.host'], // Server Expo Push
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
    }
  },
  crossOriginEmbedderPolicy: false,
}));
```

#### 13.5.4. Validasi dan Sanitasi Input Global (ValidationPipe)

**Potongan Kode: Konfigurasi di `main.ts` dan Contoh DTO**
```typescript
// main.ts — Terapkan ValidationPipe secara global
app.useGlobalPipes(new ValidationPipe({
  whitelist:             true,  // Hapus properti yang tidak ada dalam DTO
  forbidNonWhitelisted:  true,  // Tolak permintaan dengan properti tidak dikenal
  transform:             true,  // Konversi tipe otomatis (string -> number, dsb.)
  transformOptions: { enableImplicitConversion: true },
}));

// create-user.dto.ts — Contoh DTO dengan validasi deklaratif
export class CreateUserDto {
  @IsEmail({}, { message: 'Format email tidak valid.' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Kata sandi minimal 8 karakter.' })
  password: string;

  @IsEnum(
    ['DIREKTUR', 'MANAJER_PROYEK', 'STAF_FINANCE', 'PENGAWAS_LAPANGAN'],
    { message: 'Nilai peran tidak valid.' }
  )
  role: string;
}
```

### 13.6. Pengujian End-to-End Alur Kerja Utama (QA Testing)

Sebelum sistem dinyatakan siap untuk *deployment*, serangkaian pengujian fungsional menyeluruh (*end-to-end*) dieksekusi untuk memverifikasi bahwa keseluruhan alur kerja bisnis berjalan benar dari ujung ke ujung.

**Tabel Skenario Pengujian:**

| No | Skenario | Platform | Hasil yang Diharapkan |
|----|----------|----------|-----------------------|
| 1  | Login dengan kredensial salah 6 kali berturut-turut | Web Admin | Blokir sementara 1 menit (*rate limiting*) |
| 2  | Pengawas mengakses endpoint persetujuan Manajer | Mobile API | Ditolak dengan HTTP 403 Forbidden |
| 3  | Upload foto berukuran 5MB dari aplikasi mobile | Mobile | Foto tersimpan di server, URL berhasil dikembalikan |
| 4  | Approve milestone yang membuat progres unit melewati 30% | Web Admin | Draf tagihan Termin 1 terbuat otomatis di modul keuangan |
| 5  | Approve milestone terakhir (progres unit mencapai 100%) | Web Admin | Status unit berubah menjadi `SIAP_HUNI` secara otomatis |
| 6  | Manajer menolak laporan pengawas | Web Admin | Notifikasi push diterima pengawas dalam ≤ 5 detik |
| 7  | Pengawas mengetuk notifikasi penolakan | Mobile | Aplikasi membuka layar formulir revisi dengan data segar |
| 8  | Pembatalan KPR oleh bank | Web Admin | Status kavling otomatis kembali menjadi `Tersedia` |
| 9  | Akses halaman proyek di portal publik | Browser | Metadata SEO lengkap, waktu muat ≤ 2 detik |
| 10 | Klik kavling pada peta SVG interaktif | Browser | Tooltip muncul dengan status dan harga kavling yang akurat |

---

### 13.7. Optimalisasi Lanjutan Backend (Backend Performance Optimization)

Subbab ini mendokumentasikan rencana langkah kerja optimalisasi sisi *backend* yang dijadwalkan sebagai kelanjutan dari pengembangan inti. Target utama dari serangkaian optimalisasi ini adalah mengurangi latensi respons API, menurunkan beban komputasi peladen, dan memastikan sistem dapat menangani lonjakan pengguna bersamaan (*concurrent users*) tanpa degradasi performa yang signifikan.

#### 13.7.1. Implementasi Lapisan Cache Redis untuk Endpoint Berbeban Tinggi

Beberapa *endpoint* di dalam sistem bersifat intensif dalam hal frekuensi akses namun data yang dikembalikannya jarang berubah. Contoh yang paling relevan adalah *endpoint* `GET /projects` yang mengembalikan daftar seluruh proyek — data ini mungkin hanya diperbarui beberapa kali dalam sehari, namun diakses oleh puluhan atau ratusan pengguna per jam. Tanpa lapisan *cache*, setiap permintaan ke *endpoint* tersebut akan memaksa sistem menjalankan kueri basis data penuh, termasuk join ke tabel-tabel relasinya.

**Strategi Cache yang Diterapkan:**
Sistem akan menggunakan Redis sebagai penyimpanan *cache* in-memory. Redis dipilih karena kecepatan operasi baca-tulisnya yang berada pada skala sub-milidetik, serta dukungannya terhadap mekanisme *Time-To-Live* (TTL) yang memungkinkan data lama kedaluwarsa dan diperbarui secara otomatis.

Pola yang diterapkan adalah *Cache-Aside* (Lazy Loading): sistem pertama-tama memeriksa apakah data yang diminta tersedia di Redis. Jika ada (*cache hit*), data dikembalikan langsung dari Redis tanpa menyentuh basis data. Jika tidak ada (*cache miss*), sistem mengambil data dari basis data, menyimpannya ke Redis dengan TTL tertentu, lalu mengembalikannya ke klien.

**Potongan Kode: `cache.service.ts` (Abstraksi Cache Redis)**
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  // Hapus semua key yang mengandung pola tertentu (untuk invalidasi selektif)
  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) await this.redis.del(...keys);
  }
}
```

**Potongan Kode: Penerapan Cache di `projects.service.ts`**
```typescript
async getProjects(): Promise<Project[]> {
  const cacheKey = 'projects:all';

  // Langkah 1: Cek Redis terlebih dahulu
  const cached = await this.cacheService.get<Project[]>(cacheKey);
  if (cached) {
    console.log('[CACHE HIT] Mengembalikan data proyek dari Redis');
    return cached;
  }

  // Langkah 2: Cache miss — ambil dari database
  console.log('[CACHE MISS] Mengambil data proyek dari database');
  const projects = await prisma.project.findMany({
    include: { tipeRumahList: true },
    orderBy: { createdAt: 'desc' },
  });

  // Langkah 3: Simpan hasil ke Redis dengan TTL 5 menit
  await this.cacheService.set(cacheKey, projects, 5 * 60);

  return projects;
}

// Saat data proyek diperbarui, invalidasi cache secara eksplisit
async updateProject(id: string, dto: UpdateProjectDto): Promise<Project> {
  const updated = await prisma.project.update({ where: { id }, data: dto });

  // Hapus cache yang sudah basi agar permintaan berikutnya mengambil data segar
  await this.cacheService.del('projects:all');
  await this.cacheService.del(`projects:${id}`);

  return updated;
}
```

#### 13.7.2. Implementasi Cursor-Based Pagination untuk Endpoint Data Besar

Pada saat ini, beberapa *endpoint* yang mengembalikan daftar data (seperti daftar unit dan daftar log *milestone*) menggunakan pendekatan *offset pagination* (`SKIP/TAKE`). Pendekatan ini memiliki kelemahan fundamental pada data bervolume sangat besar: semakin besar nomor halaman yang diminta, semakin besar nilai `SKIP` yang harus dijalankan oleh mesin basis data, menyebabkan latensi kueri meningkat secara linear.

**Perbedaan Offset vs Cursor Pagination:**

| Aspek | Offset Pagination | Cursor Pagination |
|-------|-------------------|-----------------|
| Cara kerja | `SKIP 1000 TAKE 10` | `WHERE id > lastId LIMIT 10` |
| Performa pada halaman akhir | Lambat (full scan) | Konstan (index scan) |
| Stabilitas saat data berubah | Risiko duplikasi/lewat | Stabil |
| Cocok untuk | Halaman admin kecil | Feed, scroll tak terbatas |

**Potongan Kode: Implementasi Cursor Pagination di `units.service.ts`**
```typescript
interface PaginationParams {
  cursor?: string;  // ID unit terakhir yang sudah diterima klien
  take:    number;  // Jumlah data yang diminta
}

interface PaginatedResult<T> {
  data:       T[];
  nextCursor: string | null; // null jika sudah halaman terakhir
  hasMore:    boolean;
}

async getUnitsPaginated(
  projectId: string,
  params: PaginationParams
): Promise<PaginatedResult<Unit>> {
  const { cursor, take } = params;

  // Ambil satu data ekstra untuk mendeteksi apakah masih ada halaman berikutnya
  const units = await prisma.unit.findMany({
    where:   { projectId },
    take:    take + 1,
    cursor:  cursor ? { id: cursor } : undefined,
    skip:    cursor ? 1 : 0,  // Lewati cursor itu sendiri
    orderBy: { createdAt: 'asc' },
    select:  { id: true, blok: true, nomor: true, statusPenjualan: true, hargaJual: true },
  });

  const hasMore    = units.length > take;
  const data       = hasMore ? units.slice(0, take) : units;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { data, nextCursor, hasMore };
}
```

#### 13.7.3. Kompresi Respons HTTP (Gzip/Brotli Compression)

Respons JSON dari API yang berukuran besar (seperti daftar ratusan unit beserta relasinya) dapat mencapai ukuran ratusan kilobyte. Tanpa kompresi, seluruh data ini dikirim dalam bentuk teks mentah, memakan bandwidth jaringan dan memperlambat waktu transfer.

**Implementasi Kompresi di `main.ts`:**
```typescript
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aktifkan kompresi Gzip/Brotli untuk semua respons
  // Middleware ini otomatis mendeteksi header Accept-Encoding dari klien
  app.use(compression({
    // Hanya kompres respons yang lebih besar dari 1KB
    threshold: 1024,
    // Level kompresi: 1 (cepat, kompresi rendah) hingga 9 (lambat, kompresi tinggi)
    // Level 6 adalah keseimbangan optimal untuk API server
    level: 6,
  }));

  await app.listen(3000);
}
```

**Estimasi Penghematan Ukuran Respons:**

| Jenis Data | Ukuran Asli | Setelah Gzip | Penghematan |
|------------|------------|--------------|-------------|
| Daftar 200 unit (JSON) | 420 KB | ~85 KB | ~80% |
| Respons log milestone 500 baris | 280 KB | ~62 KB | ~78% |
| Respons data kontraktor + SPK | 150 KB | ~38 KB | ~75% |

#### 13.7.4. Implementasi Request Logging dan Performance Monitoring

Untuk mengidentifikasi *bottleneck* secara proaktif di lingkungan produksi, setiap permintaan HTTP harus dicatat beserta informasi waktu eksekusinya. Hal ini memungkinkan tim pengembang mendeteksi *endpoint* yang lambat berdasarkan data nyata dari lingkungan produksi, bukan hanya dari pengujian lokal.

**Implementasi Interceptor Logging di NestJS:**
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Performance');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req       = context.switchToHttp().getRequest();
    const { method, url } = req;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = context.switchToHttp().getResponse().statusCode;

        // Tandai endpoint yang lambat (lebih dari 500ms) dengan level WARNING
        if (duration > 500) {
          this.logger.warn(
            `SLOW [${method}] ${url} → ${statusCode} (${duration}ms) ⚠️`
          );
        } else {
          this.logger.log(
            `[${method}] ${url} → ${statusCode} (${duration}ms)`
          );
        }
      })
    );
  }
}

// Daftarkan sebagai interceptor global di main.ts
// app.useGlobalInterceptors(new PerformanceLogInterceptor());
```

#### 13.7.5. Optimalisasi Koneksi Database (Connection Pooling)

Setiap kueri yang dikirim oleh Prisma memerlukan koneksi ke basis data PostgreSQL. Membuka dan menutup koneksi setiap kali ada kueri merupakan operasi yang mahal. *Connection pooling* mempertahankan sejumlah koneksi yang sudah terbuka dalam kolam (*pool*) dan mendaur ulangnya untuk kueri-kueri berikutnya.

**Konfigurasi Connection Pool di `.env`:**
```bash
# URL koneksi dengan parameter pool dikonfigurasi secara eksplisit
# connection_limit: jumlah koneksi maksimum yang dipertahankan dalam pool
# pool_timeout: batas waktu menunggu koneksi tersedia (dalam detik)
DATABASE_URL="postgresql://user:password@localhost:5432/simdp?connection_limit=10&pool_timeout=10"

# Untuk produksi dengan volume lebih tinggi, gunakan PgBouncer sebagai middleware pool
# PgBouncer memungkinkan ratusan koneksi aplikasi diarahkan ke puluhan koneksi DB yang efisien
DATABASE_SHADOW_URL="postgresql://user:password@localhost:5432/simdp_shadow"
```

**Konfigurasi Prisma Client Singleton:**
```typescript
// prisma.ts — Pastikan hanya satu instance PrismaClient yang dibuat
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: [
    { level: 'warn',  emit: 'event' },
    { level: 'error', emit: 'event' },
    // Aktifkan log kueri hanya di mode pengembangan
    ...(process.env.NODE_ENV === 'development'
      ? [{ level: 'query' as const, emit: 'event' as const }]
      : []
    )
  ],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

### 13.8. Optimalisasi Lanjutan Frontend (Frontend Performance Optimization)

Subbab ini mendokumentasikan rencana langkah kerja optimalisasi sisi *frontend* yang mencakup Web Admin (Next.js) dan Portal Publik. Target utamanya adalah memastikan skor *Google Lighthouse* berada pada nilai hijau (di atas 90) untuk semua kategori: *Performance*, *Accessibility*, *Best Practices*, dan *SEO*.

#### 13.8.1. Analisis dan Pengurangan Ukuran Bundle JavaScript

Ukuran *bundle* JavaScript yang dikirim ke browser secara langsung memengaruhi waktu muat awal halaman. Seiring bertambahnya pustaka dan komponen, ukuran *bundle* cenderung meningkat tanpa disadari.

**Langkah Audit Bundle:**
```bash
# Instal analyzer untuk visualisasi komposisi bundle
npm install --save-dev @next/bundle-analyzer

# Jalankan build dengan mode analisis
ANALYZE=true npm run build
# Output: file HTML interaktif yang menampilkan visualisasi treemap ukuran setiap modul
```

**Konfigurasi `next.config.js` untuk Bundle Analyzer:**
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aktifkan kompresi di level Next.js
  compress: true,

  // Eksternalisasi paket besar yang tidak perlu di-bundle
  // (diambil dari node_modules saat runtime, bukan saat build)
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
```

**Praktik Pengurangan Bundle:**
```typescript
// BURUK: Mengimpor seluruh pustaka ikon (menambah ~500KB ke bundle)
import * as Icons from 'lucide-react';

// BAIK: Impor hanya ikon yang digunakan (tree-shaking)
import { CheckCircle, XCircle, Clock } from 'lucide-react';

// BURUK: Mengimpor seluruh pustaka utilitas
import _ from 'lodash';

// BAIK: Impor fungsi spesifik saja
import debounce from 'lodash/debounce';
```

#### 13.8.2. Implementasi Code Splitting dan Lazy Loading Komponen

Tidak semua komponen perlu dimuat pada saat halaman pertama kali diakses. Komponen yang berat dan hanya muncul pada interaksi tertentu (seperti modal, *chart*, atau editor teks) dapat dimuat secara tertunda (*lazy loading*) menggunakan `next/dynamic`.

**Potongan Kode: Dynamic Import untuk Komponen Berat**
```tsx
import dynamic from 'next/dynamic';

// Komponen SVG Interaktif dimuat hanya saat diperlukan (pengguna menggulir ke sana)
// Menampilkan placeholder selama komponen dimuat
const InteractiveSitePlan = dynamic(
  () => import('@/components/InteractiveSitePlan'),
  {
    loading: () => (
      <div className="w-full h-96 bg-gray-100 animate-pulse rounded-2xl"
        role="status" aria-label="Memuat peta denah..." />
    ),
    ssr: false, // Jangan render di server — komponen ini butuh browser API (event listener)
  }
);

// Grafik Recharts hanya dimuat saat halaman Laporan Keuangan dibuka
const FinanceChart = dynamic(
  () => import('@/components/FinanceChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

// Editor komentar revisi dimuat hanya saat modal penolakan dibuka
const RejectionNoteEditor = dynamic(
  () => import('@/components/RejectionNoteEditor'),
  { ssr: false }
);
```

#### 13.8.3. Optimalisasi Gambar dengan `next/image`

Gambar proyek (foto kavling, foto laporan pengawas) adalah salah satu kontributor terbesar terhadap ukuran halaman. Next.js menyediakan komponen `<Image>` bawaan yang mengotomasi serangkaian optimasi gambar.

**Fitur Optimasi yang Diaktifkan:**
-   **Format Modern (WebP/AVIF):** Next.js secara otomatis mengonversi gambar JPEG/PNG ke format WebP atau AVIF yang berukuran lebih kecil, asalkan browser mendukungnya.
-   **Lazy Loading Gambar:** Gambar yang berada di luar area tampilan (*below the fold*) tidak diunduh hingga pengguna menggulir mendekatinya.
-   **`srcSet` Responsif:** Next.js otomatis menghasilkan beberapa ukuran gambar untuk menyesuaikan resolusi layar perangkat.
-   **Placeholder Blur:** Sementara gambar asli dimuat, tampilan placeholder buram (*blur*) mencegah pergeseran tata letak yang mengganggu (*Cumulative Layout Shift*).

**Potongan Kode: Penggunaan `next/image` yang Benar**
```tsx
import Image from 'next/image';

function ProjectHeroSection({ project }: { project: Project }) {
  return (
    <div className="relative h-96 w-full overflow-hidden rounded-3xl">
      <Image
        src={project.fotoCover}
        alt={`Foto cover proyek ${project.nama}`}
        fill
        sizes="(max-width: 768px) 100vw, 80vw"  // Petunjuk ukuran untuk browser
        className="object-cover"
        priority   // Muat gambar ini segera (Above The Fold — LCP element)
        placeholder="blur"
        blurDataURL={project.fotoCoverBlurHash} // Hash 8x8px untuk placeholder
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white">
        <h1 className="text-3xl font-bold">{project.nama}</h1>
        <p className="text-white/80">{project.lokasi}</p>
      </div>
    </div>
  );
}
```

#### 13.8.4. Optimalisasi Web Vitals: CLS, LCP, dan FID

*Web Vitals* adalah serangkaian metrik yang didefinisikan oleh Google sebagai indikator kualitas pengalaman pengguna. Skor *Web Vitals* yang baik berkontribusi langsung pada peringkat SEO Google.

**Tiga Metrik Utama yang Dioptimasi:**

**1. LCP (Largest Contentful Paint) — Target: < 2.5 detik**
LCP mengukur waktu yang dibutuhkan elemen konten terbesar (biasanya gambar *hero* atau blok teks utama) untuk selesai dirender di layar.

Langkah optimasi:
-   Tambahkan atribut `priority` pada komponen `<Image>` untuk elemen *hero* agar gambar tersebut diprioritaskan dalam antrean unduhan.
-   Gunakan *preload* untuk *font* kustom yang digunakan pada elemen *hero*.
-   Pastikan server merespons permintaan halaman pertama dalam < 200ms (TTFB).

**2. CLS (Cumulative Layout Shift) — Target: < 0.1**
CLS mengukur seberapa banyak konten bergeser secara tidak terduga selama proses muat halaman. Pergeseran tata letak yang tinggi menyebabkan pengalaman membaca yang sangat buruk.

Langkah optimasi:
```tsx
// BURUK: Gambar tanpa dimensi eksplisit menyebabkan CLS tinggi
<img src={unit.foto} alt="Foto unit" />

// BAIK: Dimensi eksplisit mencegah pergeseran tata letak saat gambar dimuat
<Image
  src={unit.foto}
  alt="Foto unit"
  width={400}
  height={300}
  className="rounded-xl"
/>

// BURUK: Teks muncul terlambat karena font belum dimuat (Flash of Invisible Text)
import { Inter } from 'next/font/google';
const inter = new Inter({ subsets: ['latin'] }); // Tanpa display: 'swap'

// BAIK: Font menggunakan swap agar teks segera tampil dengan font fallback
const inter = new Inter({
  subsets:  ['latin'],
  display:  'swap',   // Tampilkan teks segera dengan font system, ganti saat Inter siap
  variable: '--font-inter',
});
```

**3. INP (Interaction to Next Paint) — Target: < 200ms**
INP mengukur latensi antara interaksi pengguna (klik tombol, ketuk input) dan waktu browser menampilkan pembaruan visual berikutnya.

Langkah optimasi:
```tsx
// Pindahkan komputasi berat ke Web Worker agar tidak memblokir thread utama
// Contoh: kalkulasi agregat statistik unit di halaman dashboard

// useWorker.ts — Hook untuk menjalankan fungsi di Web Worker
import { useEffect, useState } from 'react';

export function useWorkerCalculation<T, R>(
  fn: (data: T) => R,
  input: T
): { result: R | null; loading: boolean } {
  const [result, setResult]  = useState<R | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jalankan kalkulasi di thread terpisah
    const worker = new Worker(
      new URL('../workers/stats.worker.ts', import.meta.url)
    );

    worker.postMessage(input);
    worker.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
      worker.terminate();
    };

    return () => worker.terminate();
  }, [input]);

  return { result, loading };
}
```

#### 13.8.5. Optimalisasi Performa Aplikasi Mobile React Native

Selain *web*, aplikasi *mobile* juga memerlukan serangkaian optimasi khusus mengingat keterbatasan sumber daya perangkat (CPU, memori, dan baterai) yang jauh lebih ketat dibandingkan komputer dekstop.

**A. Implementasi FlatList untuk Daftar Panjang:**
```tsx
import { FlatList, ActivityIndicator } from 'react-native';

// BURUK: Merender semua item sekaligus — menyebabkan hang pada daftar panjang
// {milestones.map(item => <MilestoneCard key={item.id} item={item} />)}

// BAIK: FlatList merender hanya item yang terlihat di layar (virtualisasi)
function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  const renderItem = useCallback(
    ({ item }: { item: Milestone }) => <MilestoneCard item={item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: Milestone) => item.id,
    []
  );

  return (
    <FlatList
      data={milestones}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      // Konfigurasi windowing untuk performa optimal
      initialNumToRender={10}    // Render 10 item pertama saat mount
      maxToRenderPerBatch={5}    // Render maksimum 5 item per batch saat scroll
      windowSize={5}             // Pertahankan 5 layar item di memori
      removeClippedSubviews      // Lepas komponen yang jauh dari viewport
      // Tampilkan footer loading saat data berikutnya sedang diambil
      ListFooterComponent={
        milestones.length === 0
          ? <EmptyState text="Tidak ada tugas aktif" />
          : null
      }
    />
  );
}
```

**B. Optimasi Gambar di Mobile dengan `expo-image`:**
```tsx
import { Image } from 'expo-image';

// expo-image lebih efisien dari komponen Image bawaan React Native:
// - Dukungan WebP dan AVIF bawaan
// - Cache ke disk secara otomatis
// - Placeholder blur tanpa konfigurasi tambahan

function MilestonePhotoGrid({ photoUrls }: { photoUrls: string[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {photoUrls.map((url, i) => (
        <Image
          key={i}
          source={{ uri: url }}
          style={{ width: 100, height: 100, borderRadius: 8 }}
          placeholder={BLUR_HASH}         // Hash warna dominan gambar
          contentFit="cover"
          transition={200}                // Animasi fade-in halus
          cachePolicy="memory-disk"       // Cache di RAM dan disk
          recyclingKey={url}              // Reuse komponen untuk URL yang sama
        />
      ))}
    </View>
  );
}
```

**C. Monitoring Performa dengan Flipper dan Perf Monitor:**
```typescript
// Aktifkan React Native Perf Monitor di mode pengembangan
// untuk memantau frame rate (FPS), penggunaan memori, dan waktu render

import { PerformanceObserver } from 'react-native';

// Catat waktu render komponen yang lambat (hanya di development)
if (__DEV__) {
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
      if (entry.duration > 16) { // Lebih lambat dari 1 frame (60fps = 16.67ms/frame)
        console.warn(
          `[PERF] Render lambat: ${entry.name} memakan ${entry.duration.toFixed(2)}ms`
        );
      }
    });
  });
  observer.observe({ entryTypes: ['measure'] });
}
```

#### 13.8.6. Implementasi Service Worker dan Strategi Caching Browser (Web Admin)

Untuk Web Admin, meskipun tidak memerlukan kemampuan *offline* penuh seperti aplikasi mobile, strategi *caching* browser yang tepat dapat mempercepat navigasi berulang secara signifikan.

**Strategi Caching per Tipe Aset:**

| Jenis Aset | Strategi | TTL |
|------------|----------|-----|
| File JavaScript/CSS (versioned hash) | Cache First | Selamanya |
| Font Google/Lokal | Cache First | 1 tahun |
| Gambar statis (logo, ikon) | Cache First | 1 tahun |
| Gambar dinamis (foto lapangan) | Stale-While-Revalidate | 1 hari |
| Data API (JSON) | Network First | Tidak dicache |

**Konfigurasi `next.config.js` untuk Cache Headers:**
```javascript
module.exports = {
  async headers() {
    return [
      {
        // Font dan ikon — cache permanen (hash berubah saat konten berubah)
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        // Gambar statis yang jarang berubah
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }
        ],
      },
      {
        // Halaman publik — cache 60 detik, izinkan stale selama 1 jam
        source: '/(public)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=3600' }
        ],
      },
    ];
  },
};
```

#### 13.8.7. Ringkasan Target Skor Performa Pasca Optimasi

| Metrik | Sebelum Optimasi | Target Pasca Optimasi | Strategi Utama |
|--------|------------------|-----------------------|----------------|
| LCP (Portal Publik) | ~4.5 detik | < 2.0 detik | `priority` pada `<Image>`, ISR cache |
| CLS (Web Admin) | 0.35 | < 0.05 | Dimensi eksplisit gambar, font `display: swap` |
| INP (Web Admin) | ~450ms | < 150ms | `React.memo`, `useCallback`, Web Worker |
| Bundle JS (Web Admin) | ~1.8 MB | < 700 KB | Code splitting, dynamic import, tree-shaking |
| API Response Time (P95) | ~850ms | < 200ms | Redis cache, cursor pagination, DB index |
| Mobile FPS (Daftar Panjang) | ~30 FPS | > 58 FPS | FlatList virtualisasi, `removeClippedSubviews` |

---

## FASE 14: Standarisasi, Dokumentasi API, dan Tata Kelola Basis Data

Sebelum masuk ke fase *deployment* (peluncuran ke lingkungan produksi), penting untuk memastikan seluruh landasan kode (*codebase*) memiliki standar yang sama, antarmuka yang terdokumentasi dengan baik, dan sistem pengelolaan data awal (*seeding*) yang dapat direproduksi. Fase ini berfungsi sebagai penutup masa pengembangan, memastikan bahwa proyek dapat dikelola secara berkelanjutan oleh tim di masa depan.

### 14.1. Dokumentasi API Terpusat menggunakan Swagger (OpenAPI)

Dengan arsitektur *Monorepo* di mana aplikasi Web Admin, Portal Publik, dan Aplikasi Mobile semuanya bergantung pada satu *Backend* NestJS yang sama, kebutuhan akan dokumentasi API yang *up-to-date* sangat krusial. Pendekatan dokumentasi manual sering kali tertinggal dari perubahan kode.

Oleh karena itu, sistem diintegrasikan dengan `@nestjs/swagger` untuk mengamalkan prinsip *Code-as-Documentation*. Setiap *endpoint* API, struktur permintaan (DTO), dan format respons direpresentasikan menggunakan dekorator TypeScript yang secara otomatis akan dikonversi menjadi spesifikasi OpenAPI 3.0.

**Potongan Kode: Konfigurasi Swagger di `main.ts`**
```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Konfigurasi dasar dokumen Swagger
  const config = new DocumentBuilder()
    .setTitle('API Developer Properti (SIMDP)')
    .setDescription('Dokumentasi lengkap REST API untuk sistem manajemen perumahan dan konstruksi.')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token' // Nama identifier auth
    )
    .addTag('Auth', 'Endpoint autentikasi dan manajemen sesi')
    .addTag('Projects', 'Manajemen data proyek dan tipe rumah')
    .addTag('Mobile', 'Endpoint khusus untuk aplikasi pengawas lapangan')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Tampilkan antarmuka UI Swagger di rute /api/docs
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'API Docs - SIMDP',
    swaggerOptions: { persistAuthorization: true }, // Simpan token walau halaman di-refresh
  });

  await app.listen(3000);
}
```

**Potongan Kode: Penerapan Dekorator Swagger pada Controller**
```typescript
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Mobile')
@Controller('mobile')
export class MobileController {
  
  @Get('milestones/pending')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Mendapatkan daftar milestone yang menunggu dikerjakan' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil data.', type: [MilestoneResponseDto] })
  @ApiResponse({ status: 401, description: 'Akses ditolak. Token tidak valid atau kadaluarsa.' })
  async getPendingMilestones(@CurrentUser() user: UserPayload) {
    return this.mobileService.getPendingMilestones(user.id);
  }
}
```

### 14.2. Standarisasi Format Respons dan *Error Handling* Secara Global

Sering kali *frontend* (Web dan Mobile) kesulitan memproses respons API karena struktur datanya berbeda-beda antar *endpoint*. Untuk mengatasi hal ini, NestJS menyediakan fitur *Interceptor* dan *Exception Filter* untuk membungkus semua respons sukses maupun gagal ke dalam format JSON yang terstandarisasi.

**Format Respons Standar:**
```json
// Sukses
{
  "success": true,
  "statusCode": 200,
  "data": { ... },
  "message": "Operasi berhasil"
}

// Gagal
{
  "success": false,
  "statusCode": 404,
  "error": "Not Found",
  "message": "Unit tidak ditemukan",
  "timestamp": "2026-06-11T01:00:00.000Z"
}
```

**Potongan Kode: Global Response Interceptor (`transform.interceptor.ts`)**
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        statusCode: context.switchToHttp().getResponse().statusCode,
        data, // Bungkus semua kembalian dari Controller ke dalam properti 'data'
      }))
    );
  }
}
```

**Potongan Kode: Global Exception Filter (`http-exception.filter.ts`)**
```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Tentukan status code: ambil dari HttpException, atau default ke 500 (Internal Server Error)
    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Ambil pesan error (termasuk hasil validasi DTO dari class-validator)
    const errorResponse = exception instanceof HttpException 
      ? exception.getResponse() 
      : { message: 'Terjadi kesalahan internal pada server' };

    response.status(status).json({
      success: false,
      statusCode: status,
      error: typeof errorResponse === 'object' && 'error' in errorResponse 
               ? errorResponse['error'] 
               : 'Error',
      message: typeof errorResponse === 'object' && 'message' in errorResponse 
                 ? errorResponse['message'] 
                 : errorResponse,
      timestamp: new Date().toISOString(),
    });
  }
}
```
*Filter dan Interceptor di atas kemudian didaftarkan secara global pada `main.ts` menggunakan `app.useGlobalInterceptors()` dan `app.useGlobalFilters()`.*

### 14.3. Manajemen Konfigurasi Terpusat (`@nestjs/config`)

Aplikasi yang tangguh tidak boleh memiliki kredensial atau pengaturan yang di-*hardcode* di dalam kode sumber. Hal ini sangat berbahaya jika kode bocor dan membuat *deployment* lintas lingkungan (Development, Staging, Production) menjadi rumit.

Sistem diatur ulang untuk memusatkan pembacaan *environment variables* menggunakan `@nestjs/config`. Seluruh variabel wajib diverifikasi (*validation schema*) sebelum aplikasi bisa berjalan. Jika ada variabel yang kurang atau salah tipe data, NestJS akan menolak untuk *booting*.

**Potongan Kode: Validasi Konfigurasi di `app.module.ts`**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'; // Pustaka validasi skema

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Konfigurasi tersedia di seluruh modul tanpa impor ulang
      validationSchema: Joi.object({
        NODE_ENV:             Joi.string().valid('development', 'production', 'test').default('development'),
        PORT:                 Joi.number().default(3000),
        DATABASE_URL:         Joi.string().required(),
        JWT_SECRET:           Joi.string().required(),
        JWT_EXPIRATION:       Joi.string().default('1d'),
        EXPO_ACCESS_TOKEN:    Joi.string().required(),
        FRONTEND_ADMIN_URL:   Joi.string().uri().required(),
        FRONTEND_PUBLIC_URL:  Joi.string().uri().required(),
        REDIS_URL:            Joi.string().uri().optional(),
      }),
    }),
  ],
})
export class AppModule {}
```

### 14.4. Database Seeding & Migrasi Terstruktur

Sebelum aplikasi dapat digunakan dengan baik di lingkungan yang benar-benar baru (seperti pada peladen produksi yang masih kosong), basis data perlu memiliki beberapa data bawaan (*initial state*), misalnya akun administrator utama (Super Admin) agar sistem bisa diakses pertama kali. 

Mekanisme **Seeding** di Prisma digunakan untuk memasukkan sekumpulan data master standar yang sifatnya wajib bagi jalannya sistem.

**Potongan Kode: Skrip Seeding di `prisma/seed.ts`**
```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Mulai proses database seeding...');

  // 1. Buat Akun Super Admin Bawaan
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  
  // Menggunakan upsert untuk memastikan skrip dapat dijalankan berulang kali 
  // tanpa menghasilkan error duplikasi (Idempotent)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@developer.com' },
    update: {},
    create: {
      email:    'admin@developer.com',
      password: adminPassword,
      name:     'Sistem Administrator',
      role:     'DIREKTUR',
      noHp:     '081234567890',
    },
  });
  console.log(`✅ Super Admin dibuat: ${superAdmin.email}`);

  // 2. Buat Data Dummy Proyek Awal (Hanya di mode Development)
  if (process.env.NODE_ENV !== 'production') {
    const sampleProject = await prisma.project.upsert({
      where: { kodeProyek: 'PRJ-DEMO-01' },
      update: {},
      create: {
        nama:        'Grand Residence Tahap 1',
        kodeProyek:  'PRJ-DEMO-01',
        lokasi:      'Jl. Sudirman, Jakarta Selatan',
        deskripsi:   'Perumahan eksklusif dengan fasilitas lengkap di pusat kota.',
        luasLahan:   5000,
        status:      'AKTIF',
      },
    });
    console.log(`✅ Proyek Demo dibuat: ${sampleProject.nama}`);
  }

  console.log('🎉 Seeding selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Selanjutnya, pada dokumen `package.json`, perintah `seed` ini didaftarkan agar bisa dipanggil melalui perintah CLI bawaan Prisma: `npx prisma db seed`.

Dengan rampungnya **FASE 14** ini, seluruh arsitektur dasar, fitur operasional, lapisan keamanan, standarisasi kode, serta performa telah sepenuhnya stabil. Aplikasi kini memasuki status *Release Candidate* (RC) dan siap untuk melalui siklus **FASE 15: Deployment & Arsitektur Infrastruktur Cloud**.
