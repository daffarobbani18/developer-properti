# Laporan Kemajuan Mingguan (Progress Report)
**Judul Tugas Akhir:** Ekosistem Digital Properti Terpadu (Sistem ERP Perusahaan Pengembang Properti)  
**Periode Pelaporan:** Minggu ke-6  
**Fokus Sprint:** Pengembangan Modul Autentikasi, *Role-Based Access Control* (RBAC), dan *Setup Layout Dashboard* Inti  

---

## 1. Ringkasan Eksekutif

Pada sprint pengembangan minggu ke-6 ini, fokus utama dialihkan dari tahap inisiasi proyek ke pembangunan **fondasi inti keamanan dan arsitektur kerangka antarmuka (UI Shell)**. Fase ini merupakan fase yang sangat krusial dalam siklus rekayasa perangkat lunak sistem ERP (*Enterprise Resource Planning*). Sebelum sistem dapat menangani logika bisnis yang kompleks untuk masing-masing divisi (seperti inventori, penjualan, atau keuangan), sistem harus memiliki "pintu gerbang" yang kokoh.

Keberhasilan implementasi modul Autentikasi dan *Role-Based Access Control* (RBAC) pada minggu ini memastikan bahwa aplikasi mampu memisahkan dan membatasi akses data secara ketat. Hal ini menjamin bahwa pengguna hanya dapat melihat dan memodifikasi modul yang relevan dengan tanggung jawab divisinya, sebuah syarat mutlak untuk keamanan data berstandar *enterprise*.

---

## 2. Detail Fungsionalitas yang Diselesaikan

Pada minggu ini, terdapat empat komponen arsitektural utama yang telah berhasil dirancang dan diimplementasikan pada sisi *front-end* (Next.js):

### 2.1. Sistem Autentikasi dan Halaman Login Terenkripsi
Telah diselesaikan antarmuka halaman login yang dirancang dengan mengedepankan keamanan dan estetika (*premium look*). 
- **Validasi Klien:** Form login telah dilengkapi dengan validasi *client-side* untuk meminimalisir beban *server* saat terjadi kesalahan input (misalnya: format email salah atau kata sandi terlalu pendek).
- **Proteksi Rute (Middleware):** Konfigurasi *middleware* telah diimplementasikan untuk mencegah akses langsung (URL *bypassing*) ke halaman *dashboard* tanpa sesi yang valid. Jika pengguna yang belum *login* mencoba mengakses halaman internal, sistem akan secara otomatis memaksa *redirect* kembali ke halaman *login*.

**[Screenshot: Halaman Login ERP dengan desain premium menampilkan form kredensial di sisi kiri dan ilustrasi hero image arsitektur properti di sisi kanan]**

### 2.2. Portal Direktori Sistem (Gateway Entry)
Sebagai jembatan antara halaman login dan *dashboard* operasional, telah dibangun sebuah "Portal Direktori Sistem". Halaman ini berfungsi sebagai *landing page* internal pasca-autentikasi.
- **Navigasi Kontekstual:** Menampilkan kartu-kartu menu berukuran besar untuk kelima *role* utama. Halaman ini membantu pengguna mengenali struktur ekosistem digital secara utuh sebelum masuk ke ruang kerja spesifik mereka.
- **Pendeteksian Role Otomatis:** Meskipun kelima kartu ditampilkan untuk edukasi sistem, sistem akan mengunci (*disable*) kartu modul yang tidak sesuai dengan *role* pengguna yang sedang *login*.

**[Screenshot: Halaman Portal Direktori Sistem dengan 5 kartu modul besar (Inventori, CRM, Keuangan, Legal, Supervisor) yang dilengkapi ikon elegan, di mana modul yang tidak memiliki hak akses tampak diredupkan (disabled)]**

### 2.3. Implementasi Role-Based Access Control (RBAC)
Arsitektur RBAC telah distrukturkan ke dalam kode (*hard-coded* pada fase ini sebelum dinamisasi dari *database*). Sistem kini mampu mengenali dan membatasi hak akses untuk 5 (lima) peran pengguna yang berbeda secara hierarkis:
1. **Admin Inventory:** Memiliki akses eksklusif ke manajemen kawasan, blok, unit kavling, tipe rumah, dan harga dasar.
2. **Sales & Marketing:** Akses dibatasi pada manajemen *leads*, *pipeline* penjualan (Kanban), serta pengajuan *booking*.
3. **Finance & Accounting:** Akses penuh pada validasi pembayaran, pencairan KPR, manajemen tagihan, dan pemantauan *cashflow*.
4. **Tim Legal:** Akses pengelolaan dokumen sertifikat (SHM/HGB), IMB, dan progres akta per unit pembeli.
5. **Pengawas Lapangan (Supervisor):** Akses khusus untuk meng-*update* progres fisik bangunan dan mengunggah foto laporan kerja.

### 2.4. Kerangka Antarmuka Inti (UI Shell: Sidebar & Topbar)
Kerangka dasar atau *layout* utama yang akan membungkus semua halaman operasional telah berhasil dibangun.
- **Sidebar Dinamis:** Menu navigasi vertikal di sebelah kiri (*Sidebar*) dirancang agar dapat berubah secara dinamis sesuai dengan *role* pengguna (RBAC). Jika akun Finance yang *login*, menu Inventori tidak akan dirender ke dalam DOM.
- **Topbar Responsif:** Baris navigasi atas dilengkapi dengan *breadcrumb* dinamis untuk melacak hierarki halaman, notifikasi lonceng, serta profil pengguna dengan fungsi *dropdown* (*Logout* dan Pengaturan).
- **Mobile Responsiveness:** Menggunakan pendekatan *mobile-first*, *sidebar* secara otomatis akan tersembunyi menjadi *hamburger menu* ketika diakses melalui perangkat *mobile* atau tablet.

**[Screenshot: Tampilan antarmuka layout utama (UI Shell) yang menunjukkan Sidebar berwarna dark-theme dengan menu CRM yang sedang aktif, beserta Topbar berwarna putih bersih yang menampilkan breadcrumb "Dashboard > CRM > Pipeline"]**

---

## 3. Metrik Pencapaian dan Status

Hingga akhir minggu ke-6, persentase penyelesaian untuk fase fondasi arsitektur dan keamanan (UI/UX) tercatat sangat positif.

| Sub-Komponen | Status | Persentase Selesai | Keterangan |
| :--- | :---: | :---: | :--- |
| **Desain UI/UX Login & Portal** | Selesai | 100% | Komponen *pixel-perfect* dengan desain *premium*. |
| **Logika Middleware / Proteksi URL** | Hampir Selesai | 90% | Proteksi berjalan lancar, menyisakan *handling* token *expired*. |
| **Layout Inti (Sidebar & Topbar)** | Selesai | 100% | *Layout routing* global sudah stabil lintas *browser*. |
| **Logika RBAC Dinamis** | Proses | 80% | Struktur *state* sudah siap, menunggu injeksi token dari JWT Backend. |

---

## 4. Rencana Tindak Lanjut (Next Sprint - Minggu ke-7)

Dengan kokohnya pintu gerbang autentikasi dan kerangka tata letak *dashboard* yang sudah rampung, fondasi aplikasi telah siap untuk diisi dengan fitur-fitur operasional spesifik.

Pada *sprint* minggu depan (Minggu ke-7), pengembangan akan beralih secara eksklusif untuk membangun dan menyelesaikan modul pertama dalam hierarki ekosistem ini, yaitu **Modul Manajemen Inventori (Panel Admin Inventory)**. Pekerjaan minggu depan akan berfokus pada pembuatan antarmuka pengelolaan kawasan, pembuatan unit kavling, input spesifikasi tipe rumah, serta logika penetapan harga dasar produk.

---
*Laporan ini disusun sebagai bentuk pertanggungjawaban teknis atas pengembangan perangkat lunak Sistem Ekosistem Digital Properti Terpadu.*
