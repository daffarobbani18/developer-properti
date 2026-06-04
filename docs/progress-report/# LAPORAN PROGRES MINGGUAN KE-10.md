# LAPORAN PROGRES MINGGUAN KE-10

## Sistem Informasi Manajemen Developer Properti (SIMDP)

---

| **Atribut Dokumen**    | **Keterangan**                                                        |
|------------------------|-----------------------------------------------------------------------|
| **Kode Proyek**        | SIMDP-ERP-2026                                                       |
| **Periode Laporan**    | Minggu Ke-10 — 2 Juni – 8 Juni 2026                                  |
| **Tanggal Disusun**    | 4 Juni 2026                                                          |
| **Disusun Oleh**       | Tim Pengembang SIMDP                                                  |
| **Klasifikasi**        | Internal — Laporan Berkala Proyek                                     |
| **Status Keseluruhan** | 🟢 **On Track** — Transisi ke Fase Integrasi Multi-Platform           |

---

## 1. RINGKASAN EKSEKUTIF (*EXECUTIVE SUMMARY*)

Minggu Ke-10 merupakan titik transisi strategis dalam siklus pengembangan Sistem Informasi Manajemen Developer Properti (SIMDP). Fase ini menandai penutupan resmi (*feature freeze*) seluruh modul *back-office administration* yang berjalan di platform Web Admin berbasis Next.js, dan secara simultan membuka gerbang menuju fase integrasi *multi-platform* — yakni penghubungan arsitektur *backend* monolitik Express.js/Prisma dengan dua kanal konsumsi baru: **Aplikasi Mobile Pengawas Lapangan** (React Native/Expo) dan **Portal Web Publik** (Next.js App Router).

Pencapaian paling signifikan pada minggu ini adalah tercapainya status **100% Clear dan Solid** pada keseluruhan arsitektur sistem keuangan proyek, khususnya pada modul Kredit Pemilikan Rumah (KPR). Seluruh *state machine pipeline* KPR — mulai dari pengajuan awal hingga skenario penolakan bank — telah divalidasi secara menyeluruh, termasuk mekanisme *audit trail* otomatis yang menjamin konsistensi data lintas tabel `Booking`, `Invoice`, `Unit`, dan `Expense` melalui *database transaction* atomik. Keberhasilan ini memberikan landasan kepercayaan yang kokoh bahwa pilar keuangan sistem tidak akan mengalami regresi ketika fokus pengembangan dialihkan ke domain operasional lapangan.

Dengan fondasi tersebut, energi pengembangan kini sepenuhnya diarahkan untuk mendukung **skalabilitas operasional di lapangan**: merancang alur kerja konstruksi berbasis Surat Perintah Kerja (SPK) Kontraktor, membangun *user experience* aplikasi mobile yang optimal untuk kondisi *outdoor* pengawas lapangan, serta merestrukturisasi portal publik dari model *single landing page* menjadi *property portal directory* yang mampu menampung inventaris multi-proyek secara dinamis.

---

## 2. RINCIAN PENCAPAIAN KERJA (*ACCOMPLISHMENTS*)

### 2.a. Modul KPR & Audit Trail Keuangan — ✅ Selesai 100%

#### 2.a.1. Implementasi State Machine Pipeline KPR pada Kanban Board

Modul Kredit Pemilikan Rumah (KPR) merupakan salah satu komponen paling kompleks dalam keseluruhan ekosistem SIMDP, mengingat setiap perubahan status pada pipeline KPR memiliki implikasi langsung terhadap minimal tiga modul lain secara bersamaan — yaitu modul Inventory (ketersediaan unit), modul Finance (tagihan dan pencairan), dan modul Legal (status dokumen hukum). Untuk mengelola kompleksitas tersebut, tim telah mengimplementasikan arsitektur **State Machine Pipeline** dengan tiga tingkatan aturan pergerakan kartu (*card transition rules*) pada tampilan Kanban Board di halaman `/(dashboard)/legal/kpr/page.tsx`:

**Tingkat 1 — Maju Tanpa Halangan (*Forward Unconditional*)**

Perpindahan kartu KPR ke arah status yang lebih tinggi (misalnya dari "Pengajuan" ke "Survei Bank", atau dari "Survei Bank" ke "Proses Akad") diizinkan tanpa hambatan apapun. Sistem hanya meminta konfirmasi standar dari pengguna melalui dialog konfirmasi sederhana, kemudian secara otomatis memperbaharui status record di tabel `Booking` melalui pemanggilan endpoint `PATCH /api/legal/kpr/:bookingId/status`. Desain ini mencerminkan realitas bisnis bahwa progres positif pada proses KPR tidak memerlukan validasi tambahan selain keputusan operator yang berwenang.

**Tingkat 2 — Mundur dengan Peringatan Modal (*Backward with Warning*)**

Perpindahan kartu ke arah status yang lebih rendah (misalnya dari "Proses Akad" kembali ke "Survei Bank") diizinkan, namun sistem akan menampilkan **warning modal** yang secara eksplisit menginformasikan kepada pengguna mengenai dampak kaskatif (*cascading impact*) yang akan terjadi. Dampak tersebut mencakup potensi pembatalan otomatis invoice tagihan yang telah di-*generate* oleh sistem pada tahap sebelumnya, serta penyesuaian ulang timeline pembayaran klien. Mekanisme peringatan ini dirancang untuk mencegah kesalahan operasional akibat *accidental drag* pada antarmuka Kanban, sekaligus tetap memberikan fleksibilitas bagi operator untuk melakukan koreksi status ketika diperlukan — misalnya jika terdapat kesalahan administratif atau perubahan keputusan dari pihak perbankan.

**Tingkat 3 — Terkunci Mutlak (*Terminal Lock*)**

Dua status terminal pada pipeline KPR — yaitu **"Selesai Akad"** dan **"Ditolak Bank"** — dikunci secara mutlak (*immutable*). Setelah sebuah kartu KPR mencapai salah satu dari kedua status ini, tidak ada perpindahan lebih lanjut yang diizinkan, baik maju maupun mundur. Penguncian ini diimplementasikan baik di sisi *frontend* (tombol aksi disembunyikan, kartu tidak dapat di-*drag*) maupun di sisi *backend* (validasi status di *service layer* menolak setiap request perubahan dengan HTTP 400 Bad Request). Rasionale dari keputusan arsitektur ini adalah bahwa kedua status tersebut telah memicu serangkaian aksi otomatis yang bersifat *irreversible* — seperti pembuatan dokumen BAST pada "Selesai Akad" atau eksekusi prosedur pembatalan pada "Ditolak Bank" — sehingga membalikkan status akan menyebabkan inkonsistensi data yang sangat sulit dipulihkan.

#### 2.a.2. Arsitektur Keamanan Backend untuk Skenario Pembatalan KPR

Skenario paling kritis dalam seluruh pipeline KPR adalah ketika pengajuan kredit klien **ditolak oleh pihak bank**. Pada skenario ini, sistem harus melakukan serangkaian operasi *write* yang saling bergantung ke empat tabel berbeda secara atomik — artinya seluruh operasi harus berhasil semua atau gagal semua (*all-or-nothing*). Untuk menjamin atomisitas tersebut, tim mengimplementasikan mekanisme `prisma.$transaction()` pada *service layer* di file `kpr.service.ts` dengan urutan eksekusi sebagai berikut:

```
prisma.$transaction([
  // 1. Update status Booking → "Ditolak Bank"
  prisma.booking.update({ where: { id }, data: { status: "Ditolak Bank" } }),

  // 2. Lepas unit kembali ke stok Inventory
  prisma.unit.update({
    where: { id: booking.unitId },
    data: { statusPenjualan: "Tersedia" }
  }),

  // 3. Batalkan seluruh invoice yang belum dibayar
  prisma.invoice.updateMany({
    where: { bookingId: id, status: "Belum Dibayar" },
    data: { status: "Dibatalkan" }
  }),

  // 4. Buat record Expense baru untuk refund booking fee
  prisma.expense.create({
    data: {
      category: "Refund Booking Fee",
      amount: booking.bookingFee,
      description: `Refund booking fee untuk ${lead.name} - Unit ${unit.blok}-${unit.nomorUnit}`,
      status: "Pending",
      bookingId: id
    }
  })
])
```

Keempat operasi di atas dieksekusi dalam satu *database transaction* tunggal. Jika salah satu operasi gagal — misalnya karena *constraint violation* pada tabel `Expense` — maka seluruh perubahan akan di-*rollback* secara otomatis oleh PostgreSQL, sehingga tidak akan pernah terjadi situasi di mana unit sudah dilepas ke stok namun invoice belum dibatalkan, atau sebaliknya. Pendekatan ini merupakan implementasi dari prinsip **ACID compliance** (*Atomicity, Consistency, Isolation, Durability*) yang menjadi standar industri untuk operasi keuangan kritis.

Record `Expense` yang terbentuk secara otomatis dengan status "Pending" ini kemudian akan muncul di dashboard tim Finance & Accounting sebagai *action item* yang memerlukan eksekusi manual — yakni proses transfer dana refund booking fee kepada klien yang KPR-nya ditolak. Dengan demikian, sistem memastikan tidak ada kewajiban finansial perusahaan yang terlewat tanpa tindak lanjut.

---

### 2.b. Perancangan Sistem Modul Pembangunan & Aplikasi Mobile — ✅ Selesai 100%

#### 2.b.1. Keputusan Arsitektur Model Bisnis: Kontraktor/Borongan Pihak Ketiga

Salah satu keputusan arsitektur fundamental yang diambil pada minggu ini adalah penetapan **Model Bisnis Kontraktor/Borongan Pihak Ketiga** sebagai paradigma utama untuk modul pembangunan, menggantikan opsi swakelola tukang harian (*daily labor management*) yang sempat dipertimbangkan pada minggu-minggu sebelumnya.

Keputusan ini didasarkan pada analisis mendalam terhadap realitas operasional developer properti skala menengah di Indonesia, di mana mayoritas perusahaan pengembang tidak mengelola tenaga kerja konstruksi secara langsung, melainkan menunjuk kontraktor pelaksana melalui mekanisme **Surat Perintah Kerja (SPK)** yang mengikat secara hukum. Model ini memiliki beberapa implikasi arsitektur yang signifikan terhadap desain sistem:

- **Entitas Utama:** Sistem akan merekam data kontraktor sebagai entitas yang terhubung langsung ke proyek melalui relasi `Project.kontraktorName` dan `Project.nilaiKontrak`. Setiap proyek memiliki satu kontraktor utama yang bertanggung jawab atas seluruh pekerjaan konstruksi.

- **Skema Pembayaran Termin:** Pencairan dana kepada kontraktor dilakukan secara bertahap (*milestone-based disbursement*) dengan struktur termin standar industri:

  | **Termin**            | **Persentase**  | **Syarat Pencairan**                              |
  |-----------------------|-----------------|---------------------------------------------------|
  | Uang Muka (DP)        | 20%             | SPK ditandatangani                                |
  | Progres 50%           | 30%             | Opname lapangan terverifikasi ≥ 50%               |
  | Pelunasan 100%        | 40%             | Opname lapangan terverifikasi 100%                |
  | Retensi               | 10%             | Masa pemeliharaan selesai (biasanya 90 hari)      |

- **Integrasi dengan Modul Finance:** Setiap pencairan termin akan secara otomatis menghasilkan record pada tabel `Expense` dengan status "Pending" yang memerlukan persetujuan (*approval*) dari Project Manager dan/atau Direktur sebelum dana ditransfer. Mekanisme ini menjamin *segregation of duties* antara pihak yang memverifikasi progres di lapangan (Pengawas) dan pihak yang mengotorisasi pengeluaran dana (Manajemen).

Keputusan untuk tidak mengimplementasikan model swakelola pada fase ini bukan berarti menutup kemungkinan ke depan. Arsitektur database telah dirancang dengan fleksibilitas yang memadai — yakni melalui kolom `Project.status` yang dapat mengakomodasi berbagai jenis alur kerja — sehingga model swakelola dapat ditambahkan sebagai ekstensi di iterasi mendatang tanpa memerlukan *breaking changes* pada skema yang ada.

#### 2.b.2. Panduan Desain "Field-First UI" untuk Aplikasi Mobile Pengawas Lapangan

Aplikasi mobile untuk Pengawas Lapangan (Site Engineer) dirancang dengan filosofi **"Field-First UI"** — sebuah pendekatan desain yang mengutamakan kemampuan operasional di kondisi lapangan konstruksi yang penuh tantangan: sinar matahari langsung, tangan kotor atau basah, dan kebutuhan input data yang cepat di tengah aktivitas pengawasan. Panduan desain ini dituangkan ke dalam tiga prinsip utama:

**Prinsip 1 — High-Contrast Light Mode**

Berbeda dengan tren aplikasi modern yang mengedepankan *dark mode*, aplikasi pengawas lapangan SIMDP secara deliberat menggunakan **light mode dengan kontras tinggi** sebagai skema warna utama. Keputusan ini didasarkan pada riset ergonomi visual yang menunjukkan bahwa layar terang dengan teks gelap memiliki *readability* yang jauh lebih superior dibandingkan *dark mode* ketika perangkat digunakan di bawah sinar matahari langsung — kondisi yang hampir selalu dialami oleh pengawas lapangan sepanjang jam kerja mereka. Implementasi konkret dari prinsip ini terlihat pada penggunaan palet warna berikut di file `theme/colors.ts`:

  - **Background utama:** `#f8fafc` (putih keabu-abuan lembut, mengurangi *glare* dibanding putih murni)
  - **Teks utama:** `#102f38` — `#1e293b` (hijau gelap ke *slate* gelap, kontras rasio > 7:1 terhadap background)
  - **Aksen primer:** `#1a6d78` (teal gelap, tetap terbaca di bawah matahari)
  - **Indikator status:** Hijau `#10b981`, Kuning `#f59e0b`, Merah `#ef4444` (menggunakan saturasi tinggi agar warna tetap distinguishable di *outdoor*)

**Prinsip 2 — Touch Target Minimum 48px**

Seluruh elemen interaktif pada aplikasi — termasuk tombol, *card*, *tab*, dan *toggle* — dirancang dengan ukuran sentuh minimum **48 × 48 density-independent pixels (dp)**, melebihi rekomendasi minimum Google Material Design (48dp) dan Apple Human Interface Guidelines (44pt). Ukuran ini dipilih untuk mengakomodasi skenario penggunaan dengan satu tangan (*one-handed operation*), penggunaan dengan sarung tangan kerja tipis, serta kondisi layar yang mungkin sedikit basah akibat keringat atau cuaca. Implementasi prinsip ini dapat dilihat pada `StyleSheet` di `AppNavigator.tsx` di mana setiap `tabItem` memiliki `minHeight: 56` dan `minWidth: 56`, serta pada komponen `IconButton` di `ui.tsx` yang menetapkan `minHeight: 44` dan `minWidth: 44` sebagai dimensi dasar.

**Prinsip 3 — Sistem Input Progress: Slider & Stepper Tebal**

Untuk pencatatan progres konstruksi di lapangan, sistem menggunakan komponen `AnimatedProgressBar` dengan ketebalan visual yang signifikan (default `height: 6` hingga `10` pada tampilan *dashboard*) dan input numerik yang jelas. Pendekatan ini dipilih dibandingkan *text input* bebas karena:
  - Mengurangi kemungkinan *typo* pada input persentase (misalnya mengetik "155%" yang tidak valid)
  - Memberikan *visual feedback* instan kepada pengawas mengenai posisi progres relatif terhadap target
  - Memungkinkan *batch update* yang cepat ketika pengawas melakukan inspeksi beberapa unit sekaligus

#### 2.b.3. Pemetaan Menu Aplikasi Mobile

Struktur navigasi aplikasi mobile dirancang menggunakan arsitektur **Bottom Tab + Stack Navigator** dari React Navigation v7, yang membagi fitur ke dalam dua kategori berdasarkan frekuensi akses:

**Menu Navbar Bawah (*Bottom Tab Navigation*) — Akses Frekuensi Tinggi:**

| **Tab**           | **Ikon**                | **Layar Utama**              | **Fungsi**                                                                              |
|-------------------|-------------------------|------------------------------|-----------------------------------------------------------------------------------------|
| Beranda           | `home` / `home-outline` | `FieldHomeScreen`            | Dashboard ringkasan proyek, statistik progres, aksi cepat, daftar proyek aktif          |
| Milestone         | `checkbox`              | `MilestoneListScreen`        | Daftar tugas milestone per unit, update status dan checklist pekerjaan                  |
| Unit              | `business`              | `UnitSelectScreen`           | Pemilihan dan navigasi antar unit/kavling yang ditugaskan                                |
| Kendala           | `warning`               | `IssueFormScreen`            | Formulir pelaporan kendala lapangan dengan kategori, urgensi, dan lampiran foto          |
| Notifikasi        | `notifications`         | `FieldNotificationsScreen`   | Pusat notifikasi untuk approval, deadline, dan pesan dari Project Manager                |

**Menu Non-Navbar / Kontekstual (*Stack Screen Navigation*) — Akses Sesuai Konteks:**

| **Layar**                   | **Route Name**        | **Fungsi**                                                                               |
|-----------------------------|-----------------------|------------------------------------------------------------------------------------------|
| Detail Proyek               | `ProjectDetail`       | Halaman lengkap proyek: hero image, statistik, tipe properti, site plan, daftar unit     |
| Detail Unit Lapangan        | `UnitDetailField`     | Informasi detail satu unit: tipe, harga, status pembangunan, progres konstruksi          |
| Update Milestone            | `MilestoneUpdate`     | Form update status milestone dengan upload bukti foto opname via kamera native perangkat |
| Riwayat Update              | `UpdateHistory`       | Log kronologis seluruh perubahan status dan progres yang dilakukan pengawas               |
| Riwayat Kendala             | `IssueHistory`        | Arsip seluruh laporan kendala beserta status penanganannya                                |
| Absensi                     | `Attendance`          | Pencatatan kehadiran harian pengawas dengan validasi lokasi GPS                          |
| Riwayat Absensi             | `AttendanceHistory`   | Rekap kehadiran bulanan untuk keperluan penggajian                                       |

Layar **Detail Proyek** (`ProjectDetailScreen`) yang diimplementasikan pada minggu ini merupakan salah satu layar paling kaya fitur dalam aplikasi. Layar ini mengambil data secara real-time dari endpoint `GET /mobile/field/projects/:id` dan menampilkannya dalam lima seksi visual yang diorganisir secara hierarkis:

1. **Hero Section** — Gambar utama proyek dengan overlay gradient, status pill, dan lokasi
2. **Stats Grid** — Empat kartu animasi menampilkan progres keseluruhan dan ringkasan status unit (Tersedia/Booked/Terjual) dengan animasi *count-up* yang menarik
3. **Informasi Proyek** — Data kontraktor, nomor izin, nilai kontrak, estimasi anggaran, dan target penyelesaian
4. **Tipe Properti** — Daftar tipe rumah yang dapat diklik untuk membuka modal *bottom sheet* berisi foto, spesifikasi lengkap (luas tanah, luas bangunan, jumlah kamar), dan fasilitas
5. **Daftar Unit/Kavling** — Grid 2 kolom yang dikelompokkan per blok dengan tab navigasi horizontal, menampilkan kode unit, tipe, harga, progress bar, status penjualan, dan nama pembeli

---

### 2.c. Restrukturisasi Web Portal Publik Multi-Proyek — 🟡 Sedang Berjalan (70%)

#### 2.c.1. Transformasi dari Single Landing Page ke Property Portal Directory

Pada iterasi awal, Web Portal Publik SIMDP dirancang sebagai **single landing page** statis yang menampilkan informasi satu proyek perumahan tunggal. Seiring dengan pertumbuhan bisnis perusahaan yang mulai menangani beberapa proyek secara paralel, arsitektur ini menjadi *bottleneck* yang signifikan. Oleh karena itu, pada minggu ini dilakukan perombakan fundamental menjadi model **Property Portal Directory** — sebuah portal dinamis yang mampu menampilkan katalog seluruh proyek perumahan perusahaan beserta detail inventarisnya.

Transformasi ini diimplementasikan menggunakan **Next.js App Router** dengan sistem rute bersarang (*nested routing*) dan segmen dinamis (*dynamic segments*) yang memungkinkan struktur URL yang bersih dan SEO-friendly:

```
/                               → Halaman utama portal (daftar semua proyek)
/proyek/[projectId]             → Halaman detail proyek (deskripsi, peta, tipe tersedia)
/proyek/[projectId]/tipe/[tipeId]  → Halaman detail tipe rumah (spesifikasi, galeri, harga)
```

Setiap segmen dinamis (`[projectId]` dan `[tipeId]`) di-*resolve* secara *server-side* melalui pemanggilan API internal, sehingga halaman dapat di-*pre-render* oleh Next.js untuk performa optimal dan kemampuan *indexing* oleh mesin pencari. Pendekatan ini secara signifikan meningkatkan *discoverability* proyek perumahan perusahaan di hasil pencarian Google — sebuah keuntungan kompetitif yang sangat bernilai dalam industri properti.

#### 2.c.2. Implementasi SVG Site Plan Mapping untuk Peta Kavling Interaktif

Salah satu fitur unggulan dari portal publik adalah **Peta Kavling Interaktif** yang memungkinkan calon pembeli melihat ketersediaan unit secara visual langsung pada denah proyek. Implementasi fitur ini menggunakan pendekatan **SVG Site Plan Mapping** yang elegan dan *maintainable*, alih-alih pendekatan tradisional berbasis koordinat X,Y yang rumit dan sulit dikelola.

Mekanisme kerja SVG Site Plan Mapping adalah sebagai berikut:

1. **Persiapan Aset:** Tim desain membuat file SVG peta kavling proyek menggunakan perangkat lunak vektor (seperti Adobe Illustrator atau Figma). Setiap elemen kavling dalam file SVG diberikan atribut `id` yang unik dan konsisten — misalnya `id="A-01"`, `id="A-02"`, `id="B-01"`, dst.

2. **Pencocokan Data:** Setiap unit di database memiliki kolom `svgPathId` (didefinisikan pada skema Prisma di `schema.prisma` baris 101) yang menyimpan ID vektor SVG yang berkorespondensi dengan kavling tersebut di peta.

3. **Pewarnaan Dinamis:** Ketika portal publik merender peta kavling, *frontend* mengambil data ketersediaan unit dari API, kemudian secara programatik melakukan manipulasi atribut `fill` pada setiap elemen SVG berdasarkan status penjualan unit:

   | **Status Penjualan** | **Warna Fill SVG** | **Hex Code** | **Keterangan Visual**            |
   |----------------------|--------------------|--------------|----------------------------------|
   | Tersedia             | 🟢 Hijau           | `#10b981`    | Kavling tersedia untuk dibeli    |
   | Booked               | 🟡 Kuning          | `#f59e0b`    | Kavling sedang dalam proses booking |
   | Terjual              | 🔴 Merah           | `#ef4444`    | Kavling sudah terjual            |

4. **Interaktivitas:** Calon pembeli dapat meng-klik kavling berwarna hijau untuk melihat detail unit (tipe rumah, luas tanah, harga) dalam sebuah *tooltip* atau *sidebar panel*, kemudian melanjutkan ke formulir minat beli atau menghubungi tim sales melalui WhatsApp.

Pendekatan SVG Mapping ini memiliki keunggulan signifikan dibandingkan pendekatan *canvas-based* atau *image map*: file SVG bersifat *resolution-independent* (tetap tajam pada semua ukuran layar), ringan secara ukuran file, mudah di-*maintain* oleh desainer tanpa perlu pengetahuan pemrograman, dan mendukung animasi CSS native untuk efek *hover* dan transisi yang halus.

#### 2.c.3. Endpoint Backend Publik Tanpa Autentikasi

Untuk mendukung konsumsi data oleh portal publik — yang secara inheren harus dapat diakses oleh siapa saja tanpa login — tim telah membuat **endpoint backend terpisah** yang beroperasi tanpa token pengaman (*unauthenticated endpoint*). Endpoint ini didaftarkan pada rute `/api/public/projects` di file `app.ts` dan diimplementasikan di modul `public.controller.ts`.

Pemisahan endpoint publik dari endpoint admin yang dilindungi autentikasi (`/api/projects`, `/api/inventory`, dll.) merupakan keputusan arsitektur keamanan yang krusial:

- **Pencegahan Kebocoran Data Sensitif:** Endpoint publik hanya mengembalikan field yang aman untuk konsumsi publik — yaitu nama proyek, lokasi, deskripsi, gambar, tipe properti, dan status ketersediaan unit. Data sensitif seperti nilai kontrak kontraktor, estimasi anggaran internal, informasi pembeli, riwayat pembayaran, dan data pengguna sistem **tidak pernah** di-*expose* melalui endpoint ini.

- **Seleksi Field Eksplisit:** Controller publik menggunakan mekanisme `select` pada query Prisma (baris 12 di `public.controller.ts`) untuk secara eksplisit menentukan field mana saja yang dikembalikan, alih-alih mengandalkan *exclusion* yang rawan terhadap *accidental exposure* saat ada penambahan kolom baru di skema database.

- **Isolasi Rate Limiting:** Dengan endpoint terpisah, di masa depan tim dapat menerapkan kebijakan *rate limiting* yang berbeda — misalnya membatasi endpoint publik pada 100 request/menit untuk mencegah *scraping*, sementara endpoint admin yang terautentikasi diizinkan throughput lebih tinggi untuk mendukung operasional harian.

---

## 3. HAMBATAN & SOLUSI (*ISSUES & RESOLUTIONS*)

### Hambatan: Kompleksitas Pengujian Integrasi API Backend–Mobile Lintas Lingkungan Pengembangan

Selama proses pengembangan fitur integrasi mobile, tim menghadapi hambatan teknis yang cukup signifikan terkait pengujian konektivitas antara **server API backend** yang berjalan di mesin lokal (*localhost*) milik Lead Developer dengan **aplikasi mobile** yang dikembangkan oleh tim frontend mobile pada **repository fork terpisah**.

Akar masalah ini bersifat multi-dimensional:

1. **Masalah Jaringan Localhost:** Server backend berjalan di `http://localhost:4000` pada mesin Lead Developer. Namun, emulator Android atau perangkat fisik milik tim mobile tidak dapat mengakses `localhost` dari mesin pengembang lain yang berbeda jaringan. Bahkan dalam jaringan yang sama, alamat akses harus menggunakan IP internal (misalnya `http://192.168.x.x:4000`), yang berubah setiap kali perangkat berpindah jaringan WiFi.

2. **Inkonsistensi Data URL Gambar:** Ketika gambar di-upload melalui Web Admin, sistem menyimpan URL gambar dengan format `http://localhost:4000/uploads/...` ke dalam database. URL ini valid untuk Web Admin yang berjalan di mesin yang sama, namun **tidak dapat diakses** oleh aplikasi mobile yang berjalan di perangkat berbeda. Masalah ini telah menyebabkan kegagalan render gambar proyek pada halaman Detail Proyek di aplikasi mobile.

3. **Sinkronisasi Kode Lintas Repository:** Tim frontend mobile bekerja pada repository fork yang terpisah dari repository utama proyek. Perubahan skema API di backend (misalnya penambahan endpoint baru seperti `GET /mobile/field/projects/:id`) memerlukan koordinasi manual untuk memastikan kontrak API tetap konsisten di kedua sisi.

### Solusi yang Diterapkan dan Direncanakan:

**Solusi Jangka Pendek (Sudah Diimplementasikan):**
- Implementasi fungsi **`getImageUrl()`** pada *frontend* mobile yang secara otomatis mendeteksi dan menormalisasi URL gambar — menghapus prefix `http://localhost:4000` dan menggantinya dengan `API_BASE_URL` yang dikonfigurasi melalui *environment variable* `EXPO_PUBLIC_API_BASE_URL`. Fungsi ini menjamin gambar tetap tampil dengan benar terlepas dari di mana *backend* di-*host*.
- Penggunaan konfigurasi `.env` yang fleksibel pada aplikasi mobile untuk memungkinkan pergantian cepat antara endpoint lokal dan endpoint produksi.

**Solusi Jangka Menengah (Dalam Proses Implementasi):**
- **Penyepakatan Alur Git Flow via Pull Request (PR):** Tim menyepakati mekanisme formal di mana setiap perubahan dari repository fork tim mobile harus diajukan sebagai Pull Request ke repository utama. Lead Developer akan melakukan *code review* dan *merge* secara berkala untuk menjaga konsistensi kode dan mencegah *divergence* yang terlalu jauh.
- **Tunnelling via Ngrok:** Untuk kebutuhan pengujian ad-hoc, Lead Developer akan menggunakan layanan *tunnelling* Ngrok untuk mengekspos server backend lokal ke internet melalui URL publik sementara (misalnya `https://xxxx.ngrok.io`). URL ini kemudian dapat digunakan oleh tim mobile sebagai `API_BASE_URL` tanpa perlu melakukan perubahan infrastruktur.

**Solusi Jangka Panjang (Direncanakan):**
- **Deployment Backend ke Cloud VM:** Rencana deployment awal server backend ke *Cloud Virtual Machine* menggunakan salah satu penyedia layanan cloud — dengan opsi yang sedang dievaluasi meliputi **Oracle Cloud** (tersedia *Always Free Tier* yang cukup untuk server Express.js + PostgreSQL), **Microsoft Azure**, atau **Amazon Web Services (AWS)**. Dengan backend yang berjalan pada server cloud dengan IP publik statis, seluruh tim (baik frontend web, frontend mobile, maupun QA) akan dapat mengakses API secara konsisten dan stabil tanpa bergantung pada ketersediaan mesin lokal Lead Developer.

---

## 4. RENCANA KERJA MINGGU BERIKUTNYA (*NEXT ACTION PLAN*)

Berdasarkan pencapaian dan hambatan yang teridentifikasi pada Minggu Ke-10, berikut adalah tiga poin rencana kerja prioritas untuk Minggu Ke-11:

### 4.1. Review, Testing, dan Merge Pull Request Aplikasi Mobile

Tim Lead Developer akan melakukan **code review menyeluruh** terhadap Pull Request yang diajukan oleh tim frontend mobile dari repository fork. Proses review akan mencakup:
- Validasi kesesuaian implementasi dengan desain UI/UX yang telah disepakati (*design spec compliance*)
- Pengecekan konsistensi penamaan komponen, variabel, dan struktur folder terhadap konvensi proyek utama
- Pengujian fungsional end-to-end pada emulator Android dan/atau perangkat fisik untuk memastikan tidak ada regresi
- Resolusi *merge conflict* jika ada, diikuti dengan *merge* ke branch `develop` pada repository utama

Target: Seluruh fitur aplikasi mobile yang telah dibangun — termasuk halaman Detail Proyek, navigasi antar layar, dan integrasi API — harus ter-*merge* dan berjalan stabil pada repository utama di akhir minggu.

### 4.2. Implementasi Skema Database SPK Kontraktor dan Otomasi Pencairan Termin

Implementasi teknis modul pembangunan akan dimulai dari sisi database dan backend:
- **Desain dan migrasi skema Prisma** untuk tabel-tabel baru: `Contractor` (data kontraktor), `SPK` (Surat Perintah Kerja), dan `TerminPayment` (jadwal pencairan termin). Relasi antar tabel akan mengacu pada model bisnis kontraktor yang telah diputuskan pada poin 2.b.1.
- **Implementasi fungsionalitas otomasi** di mana ketika Pengawas Lapangan memvalidasi progres termin konstruksi (misalnya menandai "Progres 50% tercapai" melalui aplikasi mobile), sistem secara otomatis akan membuat record baru pada tabel `Expense` dengan status "Pending" dan kategori "Pencairan Termin SPK". Record ini kemudian akan muncul di dashboard Finance sebagai *task* yang memerlukan persetujuan dan eksekusi pembayaran.
- **Pembuatan endpoint API** `POST /api/construction/termin/:terminId/validate` yang menerima validasi dari pengawas lapangan beserta bukti foto opname, dan men-*trigger* proses otomasi pencairan di atas.

### 4.3. Integrasi SVG Site Plan dengan State Ketersediaan Unit dari API Publik

Menyelesaikan sisa 30% pengerjaan restrukturisasi portal publik dengan fokus pada:
- **Penghubungan file SVG** peta kavling proyek dengan data ketersediaan unit secara *real-time*. File SVG akan di-*embed* sebagai komponen React, kemudian setiap elemen `<path>` atau `<rect>` yang memiliki `id` matching dengan `svgPathId` pada tabel `Unit` akan diwarnai secara dinamis berdasarkan `statusPenjualan` yang ditarik dari endpoint `GET /api/public/projects/:id`.
- **Implementasi interaktivitas klik** pada kavling SVG: ketika calon pembeli meng-klik kavling berwarna hijau (Tersedia), sistem akan menampilkan *popover* berisi ringkasan informasi unit (tipe, luas, harga) beserta tombol aksi "Hubungi Sales" yang terintegrasi dengan WhatsApp Business API.
- **Optimisasi performa rendering** SVG pada perangkat mobile melalui teknik *lazy loading* dan *viewport-based rendering* untuk peta kavling yang memiliki jumlah elemen besar (> 100 kavling).

---

## LAMPIRAN

### A. Daftar File yang Dimodifikasi/Ditambahkan pada Minggu Ke-10

| **No** | **File**                                                              | **Aksi**    | **Deskripsi Perubahan**                                   |
|--------|-----------------------------------------------------------------------|-------------|-----------------------------------------------------------|
| 1      | `backend/src/modules/mobile/mobile.controller.ts`                     | Modified    | Tambah endpoint `getProjectDetail` dengan data lengkap    |
| 2      | `backend/src/modules/mobile/mobile.routes.ts`                         | Modified    | Registrasi route `GET /field/projects/:id`                |
| 3      | `backend/src/modules/legal/kpr.service.ts`                            | Modified    | Implementasi `prisma.$transaction` untuk pembatalan KPR   |
| 4      | `mobile/src/screens/pengawas/ProjectDetailScreen.tsx`                 | **Created** | Halaman detail proyek dengan 5 seksi visual               |
| 5      | `mobile/src/screens/pengawas/FieldHomeScreen.tsx`                     | Modified    | Card proyek menjadi clickable → navigasi ke detail        |
| 6      | `mobile/src/screens/pengawas/ProjectDashboardScreen.tsx`              | Modified    | Card proyek PM menjadi clickable → navigasi ke detail     |
| 7      | `mobile/src/navigation/types.ts`                                     | Modified    | Tambah `ProjectDetail` route params                       |
| 8      | `mobile/src/navigation/AppNavigator.tsx`                              | Modified    | Registrasi `ProjectDetailScreen` di Field & PM stack      |
| 9      | `mobile/src/components/ui.tsx`                                        | Modified    | Fix `CountUpNumber` style type → `StyleProp<TextStyle>`   |
| 10     | `frontend/web-admin/src/app/(dashboard)/legal/kpr/page.tsx`           | Modified    | Implementasi Kanban Board KPR dengan state machine rules  |

### B. Metrik Teknis

| **Metrik**                            | **Nilai**                                      |
|---------------------------------------|-------------------------------------------------|
| Total endpoint API aktif              | 48 endpoint (14 modul)                          |
| Tabel database (Prisma schema)        | 16 model                                       |
| Komponen UI mobile                    | 22 komponen reusable                            |
| Halaman Web Admin                     | 12 halaman dashboard                            |
| Test coverage backend                 | Dalam perencanaan (target Minggu Ke-12)         |
| Ukuran repository (tanpa node_modules)| ~4.2 MB                                        |

---

> **Dokumen ini bersifat internal dan ditujukan untuk keperluan koordinasi tim pengembang serta pelaporan progres kepada manajemen proyek. Distribusi di luar lingkup tersebut memerlukan persetujuan tertulis dari Pimpinan Proyek.**

---

*Disusun pada 4 Juni 2026 — Tim Pengembang SIMDP*
