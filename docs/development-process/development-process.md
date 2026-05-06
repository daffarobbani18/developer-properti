# BUKU DEVELOPMENT PROCESS TERPADU

**Project:** Ekosistem Digital Properti Terpadu  
**Format Dokumen:** Single file berkelanjutan (update mingguan pada file yang sama)  
**Status:** Aktif  
**Periode Mulai:** 2026-04-03  
**PIC Dokumen:** Tim Engineering (Backend, Web Admin, Web Public, Mobile)

---

## BAB 0 - Cara Menggunakan Dokumen Ini

Dokumen ini ditulis seperti buku panduan implementasi. Tujuan utamanya adalah agar siapa pun di tim dapat mengikuti langkah pembuatan aplikasi dari awal sampai siap rilis, tanpa harus membuka banyak file laporan terpisah.

### 0.1 Aturan Pakai

1. Dokumen ini adalah sumber utama proses development.
2. Semua update mingguan ditambahkan ke bab histori di bagian akhir.
3. Setiap bab berisi:
   - tujuan,
   - langkah detail,
   - source code kunci,
   - placeholder gambar,
   - checklist hasil.
4. Jika ada perubahan keputusan teknis, tambahkan catatan revisi di bagian yang relevan.

### 0.2 Format Placeholder Gambar

Setiap langkah penting memiliki placeholder gambar dengan format berikut:

```md
[PLACEHOLDER GAMBAR]
ID: IMG-XXX
Judul: [judul screenshot]
Lokasi Disarankan: docs/assets/development-process/[nama-file].png
Keterangan: [apa yang harus terlihat di gambar]
[/PLACEHOLDER GAMBAR]
```

### 0.3 Prinsip Penulisan Supaya Konsisten

Supaya dokumen ini bisa dipakai tim jangka panjang, penulisan harus mengikuti prinsip berikut:

1. Tulis langkah dalam urutan eksekusi nyata di lapangan, bukan urutan teori.
2. Setiap langkah harus bisa diverifikasi hasilnya.
3. Jika ada keputusan teknis, jelaskan alasan keputusan tersebut dipilih.
4. Jika ada alternatif yang tidak dipilih, jelaskan singkat kenapa tidak dipakai.
5. Gunakan istilah yang sama antar bab untuk menghindari tafsir ganda.
6. Hindari kalimat umum seperti "sudah diperbaiki" tanpa bukti langkah atau validasi.

### 0.4 Definisi Output Wajib per Sprint

Agar kualitas dokumentasi tidak turun, setiap update mingguan minimal memiliki output berikut:

1. Minimal 1 perubahan teknis yang jelas (fitur, refactor, hardening, atau stabilisasi).
2. Minimal 1 bukti validasi (build pass, route check, atau uji fungsional).
3. Minimal 1 catatan kendala dan tindakan mitigasi.
4. Minimal 1 placeholder gambar yang relevan dengan perubahan minggu itu.
5. Jika menyentuh akses user atau route, wajib tulis dampak ke user role.

### 0.5 Cara Membaca Dokumen Berdasarkan Peran Tim

Dokumen ini bisa dibaca berbeda sesuai kebutuhan:

1. Engineer baru:
  - Mulai dari BAB 1 sampai BAB 3 untuk memahami fondasi.
  - Lanjut BAB 4 sampai BAB 7 untuk pola implementasi fitur.
2. QA/Tester:
  - Fokus BAB 9 dan BAB 10 untuk alur validasi.
  - Baca BAB 12 untuk konteks perubahan per minggu.
3. PM/Product:
  - Fokus BAB 1, BAB 7, BAB 12 untuk melihat progres nilai bisnis.
4. DevOps:
  - Fokus BAB 2, BAB 10, dan bagian incident pada BAB 12.

Dengan pola ini, satu dokumen tetap bisa melayani kebutuhan tim teknis dan non-teknis tanpa membuat dokumen terpisah.

---

## BAB 1 - Inisiasi Proyek dan Pembagian Pilar

### 1.1 Tujuan Bab

Menentukan batas kerja, urutan eksekusi, dan siapa yang mengerjakan apa agar development lintas aplikasi bisa berjalan paralel tanpa tumpang tindih.

### 1.2 Langkah Step-by-Step

#### Langkah 1 - Definisikan Pilar Sistem

1. Pilar A: Web Internal + Backend.
2. Pilar B: Website Publik + Portal Customer.
3. Pilar C: Mobile.
4. Tetapkan PIC per pilar.

[PLACEHOLDER GAMBAR]
ID: IMG-B1-L1
Judul: Board pembagian pilar dan PIC
Lokasi Disarankan: docs/assets/development-process/img-b1-l1-pilar-dan-pic.png
Keterangan: Menampilkan pembagian pilar dan nama penanggung jawab.
[/PLACEHOLDER GAMBAR]

#### Langkah 2 - Definisikan Urutan Delivery

1. Fondasi environment dan struktur monorepo.
2. Fondasi autentikasi dan role flow di web admin.
3. Hardening route dan session.
4. Delivery dashboard role-based.
5. Delivery conversion feature website publik.

[PLACEHOLDER GAMBAR]
ID: IMG-B1-L2
Judul: Roadmap urutan delivery
Lokasi Disarankan: docs/assets/development-process/img-b1-l2-roadmap.png
Keterangan: Menampilkan urutan prioritas pekerjaan lintas sprint.
[/PLACEHOLDER GAMBAR]

### 1.3 Checklist Bab

1. Pilar dan PIC sudah disetujui.
2. Urutan eksekusi sprint sudah ditetapkan.
3. Risiko overlap pekerjaan sudah diminimalkan.

### 1.4 Penjelasan Mendalam dan Contoh Eksekusi

Pada tahap inisiasi, kesalahan paling sering adalah langsung masuk coding tanpa kontrak kerja lintas pilar. Dampaknya biasanya baru terasa di minggu kedua atau ketiga saat mulai banyak integrasi. Karena itu, bab ini menekankan urutan pikir berikut:

1. Definisikan batas domain dulu.
2. Definisikan ownership dan handoff point.
3. Definisikan acceptance criteria sprint.
4. Baru masuk implementasi teknis.

Contoh keputusan yang benar pada tahap ini:

1. Fitur operasional internal ditaruh di web admin agar akses bisa role-based.
2. Fitur conversion calon pembeli ditaruh di web publik agar funnel tidak bercampur dengan back-office.
3. Mobile ditahan di fondasi dulu jika dependency backend belum stabil.

Contoh keputusan yang berisiko dan sebaiknya dihindari:

1. Menaruh logika bisnis yang sama di dua aplikasi sekaligus.
2. Membuat route publik dan route internal tanpa naming convention yang seragam.
3. Menentukan sprint target tanpa memperhitungkan kapasitas review dan QA.

### 1.5 Artefak yang Harus Dihasilkan

Setelah BAB 1 selesai, minimal harus ada artefak berikut:

1. Daftar pilar dan PIC yang disepakati.
2. Urutan prioritas sprint awal.
3. Daftar risiko awal project.
4. Draft quality gate mingguan.

Artefak ini penting karena menjadi acuan saat terjadi perbedaan tafsir di tengah sprint.

---

## BAB 2 - Setup Monorepo dan Environment

### 2.1 Tujuan Bab

Menyiapkan fondasi teknis agar semua aplikasi dapat dijalankan dari lingkungan kerja yang konsisten.

### 2.2 Langkah Step-by-Step

#### Langkah 1 - Validasi Struktur Folder

Pastikan struktur utama mencakup:

1. `backend/`
2. `frontend/web-admin/`
3. `frontend/web-public-portal/`
4. `mobile/`
5. `packages/`
6. `docs/`

[PLACEHOLDER GAMBAR]
ID: IMG-B2-L1
Judul: Struktur folder workspace
Lokasi Disarankan: docs/assets/development-process/img-b2-l1-struktur-folder.png
Keterangan: Tampilan explorer yang menunjukkan semua folder utama.
[/PLACEHOLDER GAMBAR]

#### Langkah 2 - Standarisasi Script Root

Contoh script root untuk orkestrasi lintas aplikasi:

File: `package.json`

```json
{
  "scripts": {
    "dev:web-admin": "npm --prefix frontend/web-admin run dev",
    "dev:web-public": "npm --prefix frontend/web-public-portal run dev",
    "dev:backend": "npm --prefix backend run dev",
    "dev:mobile": "npm --prefix mobile run dev",
    "install:web-admin": "npm --prefix frontend/web-admin install",
    "install:web-public": "npm --prefix frontend/web-public-portal install",
    "install:backend": "npm --prefix backend install",
    "install:mobile": "npm --prefix mobile install"
  }
}
```

[PLACEHOLDER GAMBAR]
ID: IMG-B2-L2
Judul: Script root monorepo
Lokasi Disarankan: docs/assets/development-process/img-b2-l2-script-root.png
Keterangan: Potongan package.json yang menampilkan script orkestrasi.
[/PLACEHOLDER GAMBAR]

#### Langkah 3 - Set Port Tiap Aplikasi

Contoh port yang dipakai:

1. Web Admin: `3001`
2. Web Public: `3002`
3. Mobile Expo: `8082`

Contoh script:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "start": "next start -p 3001"
  }
}
```

[PLACEHOLDER GAMBAR]
ID: IMG-B2-L3
Judul: Terminal aplikasi berjalan di port masing-masing
Lokasi Disarankan: docs/assets/development-process/img-b2-l3-port-running.png
Keterangan: Menampilkan beberapa terminal dengan port yang tidak bentrok.
[/PLACEHOLDER GAMBAR]

### 2.3 Checklist Bab

1. Semua dependency terpasang.
2. Semua aplikasi bisa start lokal.
3. Tidak ada konflik port.

### 2.4 Penjelasan Mendalam Setup yang Stabil

Bab setup sering dianggap sederhana, padahal paling menentukan stabilitas sprint berikutnya. Fokus utamanya bukan sekadar "aplikasi bisa jalan", tetapi "semua anggota tim menjalankan aplikasi dengan cara yang sama".

Urutan setup yang direkomendasikan:

1. Install dependency root (jika ada).
2. Install dependency per aplikasi.
3. Jalankan aplikasi satu per satu untuk validasi awal.
4. Jalankan dua atau lebih aplikasi bersamaan untuk cek konflik port.
5. Simpan catatan jika ada command khusus mesin tertentu.

Contoh command yang biasanya dipakai (PowerShell):

```powershell
npm run install:backend
npm run install:web-admin
npm run install:web-public
npm run install:mobile

npm run dev:backend
npm run dev:web-admin
npm run dev:web-public
```

Gejala setup yang belum sehat:

1. Aplikasi hanya bisa jalan di satu laptop tertentu.
2. Port sering bentrok tanpa aturan yang jelas.
3. Error startup berbeda-beda padahal source code sama.

Tindakan korektif cepat:

1. Kunci versi dependency yang sensitif.
2. Samakan script startup lintas aplikasi.
3. Dokumentasikan command troubleshooting paling sering muncul.

### 2.5 Definition of Done Bab Setup

Bab setup dianggap selesai jika:

1. Semua aplikasi bisa start minimal sekali tanpa error kritikal.
2. Tim lain bisa mengikuti langkah setup tanpa instruksi lisan tambahan.
3. Build dasar tiap aplikasi tidak gagal karena masalah environment.

Jika salah satu belum terpenuhi, setup belum benar-benar selesai.

---

## BAB 3 - Fondasi Backend (API dan Domain)

### 3.1 Tujuan Bab

Membangun pusat data yang dipakai oleh web admin, web publik, dan mobile.

### 3.2 Langkah Step-by-Step

#### Langkah 1 - Siapkan Struktur Modul Domain

Domain utama backend:

1. `auth`
2. `crm`
3. `keuangan`
4. `legal`
5. `proyek`
6. `notifikasi`
7. `user`
8. `vendor`

[PLACEHOLDER GAMBAR]
ID: IMG-B3-L1
Judul: Struktur modul backend
Lokasi Disarankan: docs/assets/development-process/img-b3-l1-modul-backend.png
Keterangan: Menampilkan folder backend/src/modules beserta modul domain.
[/PLACEHOLDER GAMBAR]

#### Langkah 2 - Aktifkan Runtime Backend

File: `backend/package.json`

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

#### Langkah 3 - Validasi Startup

1. Jalankan backend mode development.
2. Pastikan tidak ada error bootstrap.
3. Catat error awal jika ada dependency atau env yang belum sesuai.

[PLACEHOLDER GAMBAR]
ID: IMG-B3-L3
Judul: Backend startup log
Lokasi Disarankan: docs/assets/development-process/img-b3-l3-backend-startup.png
Keterangan: Terminal backend berhasil start.
[/PLACEHOLDER GAMBAR]

### 3.3 Checklist Bab

1. Struktur modul backend terbentuk.
2. Service backend berjalan.
3. Fondasi API siap untuk integrasi tahap lanjut.

### 3.4 Penjelasan Mendalam Fondasi Backend

Fondasi backend harus diperlakukan sebagai kontrak data lintas aplikasi. Kesalahan struktur di backend biasanya berulang menjadi bug di web admin, web publik, dan mobile secara bersamaan.

Langkah perancangan yang direkomendasikan:

1. Tentukan entitas utama per domain.
2. Tentukan relasi yang stabil sejak awal.
3. Tentukan naming convention field yang konsisten.
4. Tentukan aturan validasi minimum tiap domain.

Contoh domain ke output API yang umum:

1. CRM: leads, follow-up, transaksi awal.
2. Keuangan: tagihan, cashflow, status pembayaran.
3. Proyek: progress lapangan, milestone, kendala.
4. Legal: dokumen, status validasi berkas.

Prinsip implementasi backend pada fase awal:

1. Stabilitas kontrak data lebih penting daripada kelengkapan fitur.
2. Hindari perubahan field mendadak tanpa catatan kompatibilitas.
3. Pastikan logging startup cukup untuk diagnosis error awal.

### 3.5 Risiko Umum dan Cara Mitigasi

1. Risiko: modul cepat bertambah tapi tidak punya boundary jelas.
  - Mitigasi: audit struktur folder per akhir sprint.
2. Risiko: field data tidak konsisten antar endpoint.
  - Mitigasi: gunakan schema atau type bersama sedini mungkin.
3. Risiko: integrasi frontend tertahan karena backend sering berubah.
  - Mitigasi: freeze kontrak minimal satu sprint untuk endpoint prioritas.

---

## BAB 4 - Web Admin: Login dan Role-Based Flow

### 4.1 Tujuan Bab

Membangun alur login lintas role agar user langsung diarahkan ke dashboard sesuai aksesnya.

### 4.2 Langkah Step-by-Step

#### Langkah 1 - Definisikan Role dan Akun Dev

File: `frontend/web-admin/src/app/(auth)/login/page.tsx`

```tsx
type UserRole = "admin" | "inventory" | "sales" | "finance" | "legal" | "supervisor";

const DEV_ACCOUNTS = [
  { email: "admin@simdp.dev", role: "admin" as UserRole, redirectTo: "/dashboard/admin" },
  { email: "inventory@simdp.dev", role: "inventory" as UserRole, redirectTo: "/dashboard/inventory" },
  { email: "sales@simdp.dev", role: "sales" as UserRole, redirectTo: "/dashboard/sales" },
  { email: "finance@simdp.dev", role: "finance" as UserRole, redirectTo: "/dashboard/finance" },
  { email: "legal@simdp.dev", role: "legal" as UserRole, redirectTo: "/dashboard/legal" },
  { email: "supervisor@simdp.dev", role: "supervisor" as UserRole, redirectTo: "/dashboard/supervisor" }
];
```

[PLACEHOLDER GAMBAR]
ID: IMG-B4-L1
Judul: Daftar role dan akun dev
Lokasi Disarankan: docs/assets/development-process/img-b4-l1-role-map.png
Keterangan: Potongan kode role dan account mapping.
[/PLACEHOLDER GAMBAR]

#### Langkah 2 - Simpan Session Role saat Login

```tsx
const authPayload = JSON.stringify({
  email: email.trim(),
  role: resolvedRole,
  redirectTo: targetRoute,
  loginAt: Date.now()
});

if (rememberSession) {
  localStorage.setItem("simdp_auth", authPayload);
  sessionStorage.removeItem("simdp_auth");
} else {
  sessionStorage.setItem("simdp_auth", authPayload);
  localStorage.removeItem("simdp_auth");
}

router.push(targetRoute);
```

#### Langkah 3 - Filter Menu Sidebar sesuai Role

File: `frontend/web-admin/src/components/layout/sidebar.tsx`

```tsx
const filteredMenuItems = useMemo(() => {
  if (currentRole === "guest") return [];

  return menuItems
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => item.roles.includes(currentRole))
        .map((item) => ({
          ...item,
          href: item.label === "Dashboard" ? ROLE_HOME[currentRole] : item.href,
          children: item.children?.filter((child) => child.roles.includes(currentRole))
        }))
    }))
    .filter((group) => group.items.length > 0);
}, [currentRole]);
```

[PLACEHOLDER GAMBAR]
ID: IMG-B4-L3
Judul: Sidebar role-based
Lokasi Disarankan: docs/assets/development-process/img-b4-l3-sidebar-role.png
Keterangan: Perbandingan menu role admin vs role non-admin.
[/PLACEHOLDER GAMBAR]

### 4.3 Checklist Bab

1. Login lintas role berhasil.
2. Redirect dashboard sesuai role.
3. Sidebar hanya menampilkan menu relevan.

### 4.4 Penjelasan Mendalam Login dan Role Flow

Role-based flow pada web admin bukan hanya urusan tampilan login. Fokus utamanya adalah memastikan user langsung tiba di area kerja yang benar dalam satu langkah, tanpa kebingungan navigasi.

Checklist logika login yang baik:

1. User role dikenali sejak submit form.
2. Role dipetakan ke satu home route yang jelas.
3. Session disimpan dengan format yang konsisten.
4. Sidebar membaca sumber role yang sama dengan halaman login.

Praktik yang perlu dihindari:

1. Menyimpan role di banyak key dengan nama berbeda.
2. Menentukan redirect berdasarkan label UI, bukan role data.
3. Menampilkan menu lengkap lalu menyembunyikannya hanya dengan CSS.

Kriteria UX yang harus dicapai:

1. User tidak perlu memilih dashboard secara manual setelah login.
2. User tidak melihat menu di luar scope kerjanya.
3. Refresh halaman tidak merusak konteks role aktif.

### 4.5 Validasi Manual yang Direkomendasikan

1. Uji login admin, sales, finance, legal, inventory, supervisor.
2. Uji redirect tiap role ke dashboard masing-masing.
3. Uji refresh browser untuk memastikan state role tetap terbaca.
4. Uji logout-login bergantian antar role dalam satu sesi kerja.

Jika semua pass, fondasi role flow siap lanjut ke route hardening.

---

## BAB 5 - Hardening Route dan Logout Aman

### 5.1 Tujuan Bab

Menutup celah akses URL manual dan memastikan sesi benar-benar bersih saat logout.

### 5.2 Langkah Step-by-Step

#### Langkah 1 - Definisikan Matrix Akses Route

File: `frontend/web-admin/src/proxy.ts`

```ts
const ROLE_ALLOWED_PREFIXES: Record<UserRole, string[]> = {
  admin: ["/dashboard", "/crm", "/finance", "/inventory", "/keuangan", "/legal", "/proyek", "/sales", "/supervisor"],
  inventory: ["/dashboard/inventory", "/inventory", "/proyek"],
  sales: ["/dashboard/sales", "/sales", "/crm"],
  finance: ["/dashboard/finance", "/finance", "/keuangan"],
  legal: ["/dashboard/legal", "/legal"],
  supervisor: ["/dashboard/supervisor", "/supervisor", "/proyek"]
};
```

#### Langkah 2 - Terapkan Guard Logic di Proxy

```ts
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const roleCookie = request.cookies.get("simdp_role")?.value;
  const role = VALID_ROLES.includes(roleCookie as UserRole) ? (roleCookie as UserRole) : null;

  if (pathname === "/") {
    if (!role) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (!role) return NextResponse.redirect(new URL("/login", request.url));
  if (!isAllowedByPrefix(pathname, ROLE_ALLOWED_PREFIXES[role])) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}
```

[PLACEHOLDER GAMBAR]
ID: IMG-B5-L2
Judul: Uji akses URL lintas role
Lokasi Disarankan: docs/assets/development-process/img-b5-l2-guard-test.png
Keterangan: Browser menampilkan redirect saat user masuk route yang tidak diizinkan.
[/PLACEHOLDER GAMBAR]

#### Langkah 3 - Implementasi Logout Cleanup

File: `frontend/web-admin/src/components/layout/sidebar.tsx`

```tsx
const handleLogout = () => {
  localStorage.removeItem("simdp_auth");
  sessionStorage.removeItem("simdp_auth");
  document.cookie = "simdp_role=; path=/; max-age=0; samesite=lax";
  document.cookie = "simdp_email=; path=/; max-age=0; samesite=lax";
  router.replace("/login");
};
```

### 5.3 Checklist Bab

1. Route tidak bisa dibypass via URL manual.
2. Root route redirect sesuai role.
3. Logout membersihkan session dengan benar.

### 5.4 Penjelasan Mendalam Route Hardening

Pembatasan menu di UI tidak cukup untuk keamanan akses. User tetap bisa mencoba direct URL. Karena itu, kontrol akses harus dipindahkan ke lapisan route handling.

Urutan implementasi yang aman:

1. Definisikan role matrix dulu.
2. Definisikan route public dan route protected.
3. Terapkan proxy/guard logic.
4. Tambahkan fallback redirect yang deterministik.
5. Uji skenario unauthorized untuk setiap role.

Prinsip fallback:

1. User tanpa role valid selalu ke login.
2. User dengan role valid tapi salah route selalu kembali ke role home.
3. Root route tidak boleh ambigu; wajib role-aware.

### 5.5 Detail Logout Lifecycle

Logout dianggap benar jika tiga lapisan dibersihkan:

1. State di memori komponen.
2. State di storage browser.
3. State di cookie/session token.

Tanpa cleanup menyeluruh, sering muncul phantom session: user terlihat logout di UI, tetapi route protected masih bisa diakses.

### 5.6 Checklist Uji Keamanan Minimum

1. Coba masuk route admin dari akun non-admin via URL manual.
2. Coba akses route protected setelah logout.
3. Coba akses root route sebelum dan sesudah login.
4. Pastikan tidak ada loop redirect login/dashboard.

---

## BAB 6 - Dashboard Dinamis per Role

### 6.1 Tujuan Bab

Menyediakan dashboard ringkas yang berbeda per role dengan KPI yang relevan.

### 6.2 Langkah Step-by-Step

#### Langkah 1 - Buat Route Dinamis Role

File: `frontend/web-admin/src/app/(dashboard)/dashboard/[role]/page.tsx`

```tsx
export function generateStaticParams() {
  return Object.keys(ROLE_DASHBOARD).map((role) => ({ role }));
}

export default async function RoleDashboardPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!(role in ROLE_DASHBOARD)) {
    notFound();
  }
  const dashboard = ROLE_DASHBOARD[role as Role];
  return <RoleDashboardView dashboard={dashboard} />;
}
```

#### Langkah 2 - Integrasi KPI dari Data Dummy

```tsx
import { dummyLeads, dummyTransaksi } from "@/lib/crm-data";
import { dummyCashflow } from "@/lib/keuangan-data";
import { dummyProyek } from "@/lib/proyek-data";

const totalLeads = dummyLeads.length;
const totalTransaksi = dummyTransaksi.length;
const latestCashflow = dummyCashflow[dummyCashflow.length - 1];
const totalProyek = dummyProyek.length;
```

#### Langkah 3 - Tambah Snapshot Prioritas

```tsx
const roleSnapshots = {
  admin: [
    {
      title: "Leads Perlu Follow-up",
      items: dummyLeads.slice(0, 3).map((lead) => ({
        label: lead.nama,
        meta: `${lead.status} - ${lead.minatUnit}`
      }))
    }
  ]
};
```

[PLACEHOLDER GAMBAR]
ID: IMG-B6-L3
Judul: Dashboard role dengan KPI dan snapshot
Lokasi Disarankan: docs/assets/development-process/img-b6-l3-dashboard-role.png
Keterangan: Halaman dashboard role yang menampilkan KPI cards dan section snapshot.
[/PLACEHOLDER GAMBAR]

### 6.3 Checklist Bab

1. Semua role punya halaman dashboard.
2. KPI tampil sesuai sumber data.
3. Route role invalid masuk ke not found.

### 6.4 Penjelasan Mendalam Dashboard Role-Based

Tujuan dashboard role-based bukan menampilkan semua data, tetapi menampilkan data paling relevan untuk keputusan cepat per role.

Pendekatan implementasi yang disarankan:

1. Gunakan konfigurasi terpusat per role (title, KPI, quick action, snapshot).
2. Hindari hardcode terpisah di setiap halaman role.
3. Pakai dataset yang realistis agar demo operasional kredibel.
4. Uji keterbacaan KPI dalam 5-10 detik pertama saat halaman dibuka.

Prinsip desain informasi dashboard:

1. KPI ringkas di atas.
2. Snapshot prioritas di tengah.
3. Aksi lanjutan (quick links) di area yang konsisten.

### 6.5 Validasi Kualitas Dashboard

1. Validasi angka KPI konsisten dengan dataset.
2. Validasi snapshot benar-benar relevan per role.
3. Validasi UI tetap stabil pada layar desktop dan mobile.
4. Validasi route role tertentu tidak bisa dibuka role lain.

Jika semua valid, dashboard siap digunakan sebagai baseline monitoring harian.

---

## BAB 7 - Website Publik: Simulasi KPR dan Detail Unit

### 7.1 Tujuan Bab

Meningkatkan conversion dengan menempatkan simulasi KPR langsung pada halaman detail unit.

### 7.2 Langkah Step-by-Step

#### Langkah 1 - Implementasi Formula KPR Real-Time

File: `frontend/web-public-portal/src/components/kpr-calculator.tsx`

```tsx
const calculation = useMemo(() => {
  const dpAmount = propertyPrice * (dpPercent / 100);
  const principal = propertyPrice - dpAmount;
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = tenorYears * 12;

  let monthlyPayment = 0;
  if (monthlyInterestRate > 0) {
    const numerator = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths));
    const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1;
    monthlyPayment = numerator / denominator;
  } else {
    monthlyPayment = principal / totalMonths;
  }

  return { dpAmount, loanAmount: principal, monthlyPayment };
}, [propertyPrice, dpPercent, interestRate, tenorYears]);
```

#### Langkah 2 - Parsing Harga Unit ke Angka

File: `frontend/web-public-portal/src/app/unit/[slug]/page.tsx`

```tsx
function parsePriceToNumber(priceStr: string): number {
  const cleaned = priceStr.replace(/[^\d.,]/g, "").replace(",", ".");
  const value = parseFloat(cleaned);
  const normalized = priceStr.toLowerCase();

  if (normalized.includes("miliar") || normalized.includes(" m")) return value * 1000000000;
  if (normalized.includes("juta") || normalized.includes(" jt")) return value * 1000000;
  return value;
}
```

#### Langkah 3 - Integrasi Kalkulator di Detail Unit

File: `frontend/web-public-portal/src/app/unit/[slug]/detail-content.tsx`

```tsx
<div className="lg:col-span-5 relative">
  <div className="sticky top-32">
    <KPRCalculator propertyPrice={propertyPriceNumeric} unitName={unit.name} />
  </div>
</div>
```

[PLACEHOLDER GAMBAR]
ID: IMG-B7-L3
Judul: Detail unit dengan panel KPR sticky
Lokasi Disarankan: docs/assets/development-process/img-b7-l3-detail-unit-kpr.png
Keterangan: Menampilkan halaman detail unit dan kalkulator KPR di panel kanan.
[/PLACEHOLDER GAMBAR]

#### Langkah 4 - Penanganan Isu Route 404

1. Pastikan server berjalan pada proses terbaru (bukan process stale).
2. Validasi dynamic params mengikuti pola framework yang dipakai.
3. Rebuild dan restart aplikasi.
4. Cek endpoint route detail unit secara langsung.

[PLACEHOLDER GAMBAR]
ID: IMG-B7-L4
Judul: Verifikasi endpoint route detail unit
Lokasi Disarankan: docs/assets/development-process/img-b7-l4-route-check.png
Keterangan: Hasil cek endpoint detail unit dengan status sukses.
[/PLACEHOLDER GAMBAR]

### 7.3 Checklist Bab

1. Simulasi KPR merespons perubahan slider secara real-time.
2. Harga unit otomatis terbaca.
3. Route detail unit stabil.
4. Layout desktop dan mobile rapi.

### 7.4 Penjelasan Mendalam Fitur Conversion

Fitur simulasi KPR punya dampak langsung ke conversion karena user bisa menghitung estimasi cicilan tanpa keluar dari konteks unit yang sedang dilihat.

Pola implementasi yang direkomendasikan:

1. Kalkulasi harus real-time, tanpa submit ulang halaman.
2. Harga properti harus otomatis dari data unit aktif.
3. Panel simulasi harus tetap terlihat saat user scroll konten detail.
4. Hasil harus diberi konteks bahwa ini estimasi, bukan persetujuan final bank.

Mengapa integrasi ke detail unit lebih baik dibanding halaman terpisah:

1. User tidak perlu memindahkan konteks dari produk ke kalkulator.
2. Friksi pengisian harga manual hilang.
3. Alur keputusan user lebih pendek.

### 7.5 Incident Handling Detail Unit 404

Kasus 404 pada route dinamis biasanya punya dua sumber utama:

1. Implementasi route/params belum sesuai pola framework.
2. Runtime masih menjalankan artifact lama karena process stale.

Urutan diagnosis yang disarankan:

1. Cek proses aktif pada port.
2. Verifikasi build terbaru sudah selesai.
3. Restart server dari artifact terbaru.
4. Cek endpoint route target secara langsung.

### 7.6 Validasi Akhir Fitur KPR

1. Ubah slider DP dan pastikan cicilan berubah.
2. Ubah slider bunga dan pastikan cicilan berubah.
3. Ubah slider tenor dan pastikan cicilan berubah.
4. Pastikan route unit `astoria` dan `bvlgari` dapat diakses.
5. Pastikan layout tidak pecah setelah hard refresh.

---

## BAB 8 - Mobile Baseline

### 8.1 Tujuan Bab

Menyiapkan fondasi aplikasi mobile agar siap masuk implementasi fitur role-based.

### 8.2 Langkah Step-by-Step

1. Siapkan struktur `screens/auth`, `screens/customer`, `screens/pengawas`, `screens/shared`.
2. Siapkan fondasi navigasi role-based.
3. Pastikan script start mobile aktif:

File: `mobile/package.json`

```json
{
  "scripts": {
    "dev": "expo start --port 8082"
  }
}
```

[PLACEHOLDER GAMBAR]
ID: IMG-B8-L1
Judul: Struktur screens mobile
Lokasi Disarankan: docs/assets/development-process/img-b8-l1-mobile-screens.png
Keterangan: Explorer yang menampilkan struktur role-based pada mobile.
[/PLACEHOLDER GAMBAR]

### 8.3 Checklist Bab

1. Struktur role-based mobile tersedia.
2. Runtime mobile bisa start.
3. Baseline siap untuk integrasi fitur berikutnya.

### 8.4 Penjelasan Mendalam Roadmap Mobile

Pada fase ini mobile memang masih baseline, tetapi tetap harus ditulis detail agar tidak menjadi area yang tertinggal tanpa arah.

Urutan kerja yang direkomendasikan untuk fase berikutnya:

1. Finalisasi auth flow mobile.
2. Pisahkan navigation tree customer dan pengawas.
3. Integrasikan screen prioritas tinggi lebih dulu (progress, komplain, dokumen).
4. Sinkronkan tipe data dengan backend sebelum integrasi API penuh.

Prinsip agar mobile tidak tertinggal:

1. Tetapkan minimal 1 task mobile setiap sprint.
2. Gunakan komponen shared untuk elemen yang berulang.
3. Hindari implementasi UI duluan jika kontrak data belum jelas.

### 8.5 Indikator Kesiapan Integrasi Mobile

1. Struktur screen role-based sudah mapan.
2. Navigasi utama dapat berpindah tanpa error.
3. Type untuk payload penting sudah mulai diselaraskan.

Jika indikator ini terpenuhi, mobile siap masuk fase integrasi data yang lebih serius.

---

## BAB 9 - Testing, Build, dan Validasi Kualitas

### 9.1 Tujuan Bab

Menetapkan quality gate tetap supaya setiap sprint ditutup dengan bukti teknis yang jelas.

### 9.2 Step-by-Step Validasi

#### Langkah 1 - Functional Test

1. Uji flow utama sesuai scope sprint.
2. Uji role-based flow (jika ada perubahan akses).
3. Uji route kritikal.

#### Langkah 2 - Technical Test

1. Jalankan build pada aplikasi terdampak.
2. Pastikan tidak ada error TypeScript baru.
3. Pastikan route statis/dinamis diproses sesuai ekspektasi.

#### Langkah 3 - UX Test

1. Cek desktop.
2. Cek mobile.
3. Cek visual hierarchy setelah patch besar.

#### Langkah 4 - Incident Closure Test

1. Verifikasi perbaikan bug dengan endpoint/objective check.
2. Pastikan server berjalan pada artifact terbaru.

[PLACEHOLDER GAMBAR]
ID: IMG-B9-L4
Judul: Build pass dan smoke test
Lokasi Disarankan: docs/assets/development-process/img-b9-l4-build-smoke-test.png
Keterangan: Terminal build sukses dan bukti route check.
[/PLACEHOLDER GAMBAR]

### 9.3 Penjelasan Mendalam Quality Gate

Quality gate harus diperlakukan sebagai syarat release internal, bukan formalitas dokumentasi. Jika quality gate dilewati, masalah kecil akan menumpuk dan menjadi insiden besar di sprint berikutnya.

Cara praktis menerapkan quality gate:

1. Tetapkan checklist tetap per sprint.
2. Tambahkan checklist khusus jika ada perubahan besar (akses, route, layout, atau build).
3. Simpan bukti minimal berupa output build, screenshot uji, dan catatan skenario.

Contoh status quality gate:

1. Pass: semua skenario inti sukses, tidak ada blocker.
2. Pass with note: fitur utama sukses, ada catatan minor yang tidak menghambat.
3. Fail: ada skenario inti gagal atau bug kritikal belum tertutup.

### 9.4 Definition of Done Sprint Teknis

Sprint teknis dianggap selesai jika:

1. Scope fitur selesai sesuai acceptance criteria.
2. Build aplikasi terdampak lulus.
3. Route/fitur kritikal tervalidasi manual.
4. Dokumentasi minggu diperbarui pada file ini.
5. Risiko residual ditulis dengan jelas.

---

## BAB 10 - Deployment Readiness dan Runbook Singkat

### 10.1 Pre-Deploy Checklist

1. Root directory benar per aplikasi.
2. Build pass pada aplikasi target.
3. Environment variabel sesuai.
4. Route kritikal sudah diuji.

### 10.2 Post-Deploy Checklist

1. Halaman login dapat diakses.
2. Dashboard/route utama dapat diakses.
3. Halaman detail unit dapat diakses.
4. Tidak ada error kritikal runtime.

### 10.3 Runbook Cepat Saat Bug Routing

1. Cek apakah proses lama masih menahan port.
2. Hentikan proses stale.
3. Jalankan ulang server dari build terbaru.
4. Verifikasi endpoint target.

[PLACEHOLDER GAMBAR]
ID: IMG-B10-L3
Judul: Penanganan process stale pada port aplikasi
Lokasi Disarankan: docs/assets/development-process/img-b10-l3-process-stale.png
Keterangan: Bukti proses lama dihentikan dan server baru aktif.
[/PLACEHOLDER GAMBAR]

### 10.4 Penjelasan Mendalam Deployment Readiness

Pada monorepo, kesalahan paling sering bukan di kode, tetapi pada target deploy yang salah. Karena itu, bab ini menekankan disiplin verifikasi sebelum dan sesudah deploy.

Kesalahan umum yang sering terjadi:

1. Menjalankan build dari direktori yang tidak sesuai aplikasi target.
2. Menganggap server sudah update padahal masih process lama.
3. Menutup incident hanya berdasarkan asumsi, tanpa endpoint check.

Pola kerja yang disarankan:

1. Pre-deploy checklist wajib diselesaikan seluruhnya.
2. Deploy dilakukan per aplikasi target dengan root directory yang benar.
3. Post-deploy smoke test dijalankan pada route paling kritikal.
4. Jika ada error, tulis incident note singkat beserta langkah reproduksi.

### 10.5 Struktur Incident Note yang Disarankan

Saat ada insiden, gunakan format ringkas berikut:

1. Waktu kejadian.
2. Gejala yang terlihat user.
3. Dugaan awal.
4. Akar penyebab final.
5. Langkah perbaikan.
6. Bukti verifikasi penutupan.

Dengan format ini, insiden bisa dipelajari kembali tanpa kehilangan konteks teknis.

---

## BAB 11 - Template Update Mingguan (Wajib)

Setiap minggu, tambahkan section baru di bawah ini tanpa membuat file baru.

````md
### Minggu Ke-[N] ([YYYY-MM-DD] s.d. [YYYY-MM-DD])

#### Tujuan Minggu Ini
1. [tujuan 1]
2. [tujuan 2]

#### Langkah Detail (Step-by-Step)
1. [langkah 1]
2. [langkah 2]
3. [langkah 3]

#### Source Code Kunci
```[bahasa]
[potongan kode penting]
```

#### Placeholder Gambar
[PLACEHOLDER GAMBAR]
ID: IMG-W[N]-01
Judul: [judul screenshot]
Lokasi Disarankan: docs/assets/development-process/img-w[N]-01.png
Keterangan: [isi]
[/PLACEHOLDER GAMBAR]

#### Hasil
1. [hasil 1]
2. [hasil 2]

#### Kendala
1. [kendala 1]

#### Mitigasi
1. [mitigasi 1]
````

### 11.1 Contoh Pengisian Template yang Benar

Contoh ringkas berikut menunjukkan bagaimana menulis update mingguan yang tidak ambigu.

````md
### Minggu Ke-6 (2026-05-08 s.d. 2026-05-14)

#### Tujuan Minggu Ini
1. Menstabilkan alur upload dokumen legal di web admin.
2. Menambah validasi format file pada halaman upload.

#### Langkah Detail (Step-by-Step)
1. Audit komponen upload yang ada.
2. Tambah validasi ekstensi dan ukuran file.
3. Uji upload sukses, gagal, dan cancel.
4. Build check aplikasi web admin.

#### Source Code Kunci
```tsx
const isAllowed = ["application/pdf", "image/jpeg", "image/png"].includes(file.type);
if (!isAllowed) {
  setError("Format file tidak didukung");
  return;
}
```

#### Placeholder Gambar
[PLACEHOLDER GAMBAR]
ID: IMG-W6-01
Judul: Validasi upload dokumen legal
Lokasi Disarankan: docs/assets/development-process/img-w6-01-upload-validation.png
Keterangan: Menampilkan pesan error saat file tidak sesuai format.
[/PLACEHOLDER GAMBAR]

#### Hasil
1. Upload hanya menerima format yang diizinkan.
2. Pesan error tampil jelas saat file tidak valid.

#### Kendala
1. Beberapa browser membaca MIME type berbeda untuk file lama.

#### Mitigasi
1. Tambah validasi fallback berbasis ekstensi nama file.
````

Contoh di atas bisa dijadikan acuan agar update mingguan tetap jelas, terukur, dan mudah diaudit.

---

## BAB 12 - Histori Berkelanjutan (Minggu 1-5)

### Minggu Ke-1 (2026-04-03 s.d. 2026-04-09)

#### Ringkasan Eksekusi

Minggu pertama difokuskan pada fondasi. Tim sengaja tidak memaksakan delivery fitur besar karena prioritas utama adalah memastikan semua aplikasi dapat dijalankan dalam pola kerja yang seragam.

#### Langkah Detail

1. Menetapkan pilar kerja dan ownership antar anggota tim.
2. Menyusun struktur monorepo dan script awal lintas aplikasi.
3. Menetapkan port runtime agar tidak bentrok saat dijalankan paralel.
4. Menjalankan smoke test awal untuk backend, web admin, web publik, dan mobile.

#### Hasil Teknis

1. Fondasi workspace lintas aplikasi terbentuk.
2. Tim memiliki baseline command yang sama.
3. Risiko setup berulang mulai terpetakan sejak awal.

#### Kendala dan Mitigasi

1. Kendala: setup lintas mesin belum 100 persen seragam.
2. Mitigasi: standardisasi command dan checklist setup dibakukan.

### Minggu Ke-2 (2026-04-10 s.d. 2026-04-16)

#### Ringkasan Eksekusi

Minggu kedua berfokus ke stabilitas pengalaman login role-based di web admin, termasuk redirect otomatis dan relevansi navigasi per role.

#### Langkah Detail

1. Restorasi tampilan login agar sesuai referensi visual.
2. Menetapkan mapping akun dev ke role dan route dashboard tujuan.
3. Menyimpan state role untuk menjaga kontinuitas sesi.
4. Menyesuaikan sidebar agar hanya menampilkan menu sesuai role.
5. Menjalankan regression test login-redirect-refresh untuk banyak role.

#### Hasil Teknis

1. Alur login menjadi lebih deterministik.
2. Navigasi user lebih fokus sesuai domain kerjanya.
3. Fondasi siap untuk hardening route pada sprint berikutnya.

#### Kendala dan Mitigasi

1. Kendala: potensi mismatch state role pada refresh.
2. Mitigasi: penyelarasan key session dan pembacaan ulang state role.

### Minggu Ke-3 (2026-04-17 s.d. 2026-04-23)

#### Ringkasan Eksekusi

Minggu ketiga adalah fase keamanan akses. Tim memindahkan kontrol dari sekadar UI restriction ke route-level guard agar URL manual tidak bisa membypass izin role.

#### Langkah Detail

1. Menambahkan matrix prefix route yang diizinkan untuk tiap role.
2. Menerapkan proxy guard untuk validasi akses.
3. Menstabilkan root redirect agar role-aware.
4. Menambahkan logout cleanup lintas storage dan cookie.
5. Menutup bug loop dashboard ke login.

#### Hasil Teknis

1. Route unauthorized terblokir dengan fallback yang benar.
2. Logout lifecycle menjadi lebih aman.
3. Fondasi akses route siap menopang dashboard role-based.

#### Kendala dan Mitigasi

1. Kendala: risiko benturan antara redirect root dan fallback unauthorized.
2. Mitigasi: menetapkan role home sebagai fallback tunggal dan menambah regression test.

### Minggu Ke-4 (2026-04-24 s.d. 2026-04-30)

#### Ringkasan Eksekusi

Minggu keempat berfokus pada delivery dashboard dinamis per role dengan KPI kontekstual serta validasi build produksi untuk kesiapan deployment.

#### Langkah Detail

1. Menyusun route dashboard dinamis untuk 6 role utama.
2. Mengintegrasikan data dummy lintas modul menjadi KPI operasional.
3. Menambahkan snapshot prioritas agar user cepat membaca fokus kerja.
4. Menjalankan build validation end-to-end pada web admin.
5. Menginvestigasi error deployment dan memperjelas aturan root directory.

#### Hasil Teknis

1. Dashboard role-based siap dipakai demo operasional.
2. Build produksi berhasil dan route tervalidasi.
3. Risiko deployment salah target menurun setelah prosedur diperjelas.

#### Kendala dan Mitigasi

1. Kendala: build awal gagal karena eksekusi dari direktori yang salah.
2. Mitigasi: standarisasi runbook build per aplikasi pada monorepo.

### Minggu Ke-5 (2026-05-01 s.d. 2026-05-07)

#### Ringkasan Eksekusi

Minggu kelima menghasilkan fitur conversion yang paling berdampak pada website publik: simulasi KPR real-time yang terintegrasi langsung ke halaman detail unit.

#### Langkah Detail

1. Membangun komponen kalkulator KPR berbasis formula anuitas.
2. Mengintegrasikan kalkulator ke detail unit dengan harga otomatis.
3. Menyesuaikan layout detail unit agar konsisten dengan referensi prioritas.
4. Menangani incident route 404 pada unit detail.
5. Menstabilkan CSS setelah refactor visual besar.
6. Menutup incident dengan build check dan endpoint verification.

#### Hasil Teknis

1. Simulasi real-time berjalan stabil.
2. Flow detail unit menjadi lebih persuasif untuk conversion.
3. Route penting kembali normal dengan bukti verifikasi objektif.

#### Kendala dan Mitigasi

1. Kendala: process stale pada port membuat hasil patch tidak langsung terlihat.
2. Mitigasi: kill process lama, restart artifact terbaru, dan cek endpoint langsung.

### 12.1 Pelajaran Umum dari Minggu 1-5

1. Stabilitas fondasi lebih penting daripada kecepatan delivery di minggu awal.
2. Role-based system harus dijaga di UI dan route sekaligus.
3. Incident routing harus divalidasi dengan endpoint check, bukan asumsi visual.
4. Dokumen tunggal berkelanjutan mempercepat handoff antar sprint.

---

## BAB 13 - Catatan Penutup

Dokumen ini adalah versi perbaikan dengan format buku step-by-step yang detail, memuat source code kunci, serta placeholder gambar di setiap tahap penting. Mulai sekarang, seluruh development process cukup dilanjutkan pada file ini tanpa membuat file mingguan terpisah.
