# LAPORAN KEMAJUAN MINGGUAN -- MINGGU KE-8

**Judul Tugas Akhir:** Ekosistem Digital Properti Terpadu (SIMDP -- Sistem Informasi Manajemen Developer Perumahan)  
**Periode Laporan:** 05 Mei 2026 -- 11 Mei 2026  
**Minggu ke:** 8 (Fase Implementasi Modul Operasional Sales dan Marketing)  
**Fokus Utama:** Modul CRM -- Manajemen Leads, Pipeline Penjualan, Sistem Booking Unit, dan Log Aktivitas Sales  
**Status Keseluruhan:** Hijau -- On Track  
**Disusun oleh:** Daffa Robbani  

---

## 1. Ringkasan Eksekutif (Executive Summary)

Pada sprint minggu ke-7, pengembangan platform SIMDP berhasil menyelesaikan Modul Manajemen Inventori secara menyeluruh pada lapisan presentasi (frontend). Seluruh entitas data master yang diperlukan -- mulai dari kawasan, blok, nomor kavling, master tipe rumah, harga dasar dua-lapis, hingga peta denah kawasan (site plan) -- telah tersedia sebagai fondasi data di dalam sistem. Keberhasilan tersebut meninggalkan satu pertanyaan arsitektural yang harus dijawab pada sprint berikutnya: data produk sudah tersedia di dalam gudang digital, tetapi bagaimana data tersebut akan dimanfaatkan oleh lini depan perusahaan untuk menghasilkan pendapatan? Pertanyaan inilah yang menjadi pemandu kerja selama minggu ke-8.

Minggu ke-8 secara eksklusif difokuskan pada pembangunan **Modul Sales dan Marketing (CRM)** -- modul yang memosisikan diri sebagai ujung tombak operasional perusahaan developer properti. Jika Modul Inventori pada minggu ke-7 berperan sebagai "gudang barang dagangan", maka Modul CRM yang dibangun minggu ini berperan sebagai "mesin penjualan" yang mengubah barang dagangan tersebut menjadi transaksi nyata. Dalam lanskap bisnis properti, proses penjualan tidak pernah sederhana -- ia melibatkan siklus panjang mulai dari pencarian prospek (lead generation), pengelolaan hubungan (customer relationship management), negosiasi yang kerap berlangsung berminggu-minggu, hingga penguncian unit (booking) yang memerlukan koordinasi ketat antar divisi agar tidak terjadi kesalahan fatal seperti penjualan ganda (double-booking).

Dalam konteks visi besar ekosistem terpadu yang menjadi inti dari tugas akhir ini, Modul CRM memiliki posisi strategis yang tak tergantikan. Ia menjadi titik pertemuan pertama antara data internal (inventori, harga, ketersediaan unit) dengan data eksternal (prospek pembeli, preferensi pasar, kanal pemasaran). Dari modul inilah aliran data mulai mengalir ke hilir:

- **Data booking** yang diproses oleh tim sales akan menjadi dasar bagi Modul Keuangan untuk membuat tagihan.
- **Data pembeli dan unit** yang terkunci akan menjadi dasar bagi Modul Legal untuk memulai proses pembuatan dokumen PPJB.
- **Data status kavling** yang berubah dari "Tersedia" menjadi "Booked" akan langsung ter-propagasi ke Website Marketing Publik untuk memperbarui tampilan site plan secara real-time.

Tanpa modul CRM yang terstruktur, seluruh rantai nilai di hilir akan terganggu karena tidak ada sumber data transaksi yang terstandarisasi. Oleh karena itu, penyelesaian modul ini pada minggu ke-8 merupakan pencapaian yang sangat krusial bagi kelangsungan pengembangan platform secara keseluruhan.

**[SCREENSHOT: Halaman utama Dashboard CRM menampilkan 5 kartu navigasi modul (Daftar Leads, Pipeline, Manajemen Unit, Transaksi, Aktivitas Sales) dengan counter data per kategori, serta 2 kartu statistik ringkasan di pojok kanan atas bertuliskan "Leads Hari Ini: 10" dan "Follow Up: 08"]**

---

## 2. Penjabaran Detail Fungsionalitas dan Data yang Diselesaikan

Modul CRM yang dibangun pada minggu ini terdiri dari **5 sub-modul halaman** yang saling terhubung dan membentuk satu alur kerja penjualan yang utuh. Berikut adalah penjabaran detail dari setiap sub-modul.

### 2.1. Sistem Manajemen Leads (CRM Database Prospek Pembeli)

**Apa fungsi fitur ini:**

Halaman Daftar Leads merupakan titik awal dari seluruh siklus penjualan di dalam platform SIMDP. Secara konseptual, seorang "lead" adalah individu yang telah menunjukkan ketertarikan terhadap produk properti yang ditawarkan oleh developer, namun belum melakukan transaksi pembelian. Di dunia nyata, leads ini bisa datang dari berbagai kanal -- seseorang yang mengisi formulir di website perusahaan, seorang pengunjung yang datang langsung ke kantor marketing (walk-in), ataupun prospek yang merespons iklan di media sosial. Tanpa sistem pencatatan yang terstruktur, data-data prospek ini biasanya berserakan di catatan pribadi masing-masing sales, di pesan WhatsApp yang menumpuk, atau di lembar Excel yang tidak tersinkronisasi. Sistem CRM Leads yang dibangun pada minggu ini menyelesaikan masalah fragmentasi data tersebut dengan menyediakan satu sumber kebenaran (single source of truth) untuk seluruh data prospek perusahaan.

**Bagaimana alur kerja operasionalnya di sistem:**

Dalam antarmuka yang telah diimplementasikan, halaman Leads menyajikan sebuah tabel data master yang menampilkan seluruh prospek yang tercatat beserta atribut-atribut pentingnya. Kolom-kolom data yang ditampilkan dalam tabel meliputi:

- **Nama** -- Nama lengkap prospek beserta ID unik lead (contoh: L001, L002).
- **Kontak** -- Nomor telepon dan alamat email yang disertai ikon masing-masing untuk memudahkan identifikasi visual.
- **Sumber** -- Kanal perolehan prospek, yang diklasifikasikan ke dalam 6 kategori: Website, Instagram, Facebook, Referral, Walk-in, dan Pameran.
- **Status** -- Posisi terkini prospek dalam funnel penjualan, ditampilkan sebagai badge berwarna (Baru, Follow Up, Survey, Negosiasi, Booking, atau SPK).
- **Minat** -- Tipe unit yang diminati oleh prospek (contoh: Tipe 45/72, Tipe 60/90).
- **Sales PIC** -- Nama sales yang bertanggung jawab menangani prospek tersebut.
- **Tanggal** -- Tanggal pertama kali prospek tercatat masuk ke dalam sistem.

Di bagian atas halaman, terdapat deretan **badge filter interaktif** yang berfungsi sebagai mekanisme filter cepat berdasarkan status. Setiap badge menampilkan nama tahapan beserta counter jumlah leads di tahap tersebut. Pengguna dapat mengklik badge "Negosiasi" untuk langsung memfilter hanya leads yang sedang dalam tahap negosiasi, dan mengklik lagi untuk mengembalikan tampilan ke seluruh data. Selain badge, sistem juga menyediakan komponen filter tambahan:

- **Search Bar** -- Pencarian berdasarkan nama atau nomor telepon.
- **Dropdown Filter Status** -- Filter berdasarkan status funnel (Baru, Follow Up, Survey, Negosiasi, Booking, SPK).
- **Dropdown Filter Sumber** -- Filter berdasarkan kanal akuisisi (Website, Instagram, Facebook, Referral, Walk-in, Pameran).
- **Tombol Reset** -- Menghapus seluruh filter yang aktif dan mengembalikan tampilan ke kondisi awal.

Untuk menambahkan prospek baru, sistem menyediakan form modal yang dipanggil melalui tombol "Tambah Lead". Form ini mencakup field-field berikut:

- **Nama Lengkap** dan **No. Telepon** (baris pertama, layout grid 2 kolom)
- **Email** (baris kedua, full width)
- **Sumber** (dropdown) dan **Minat Unit** (baris ketiga, layout grid 2 kolom)
- **Catatan** (textarea, baris keempat, untuk informasi kualitatif tambahan)

Setiap lead yang tersimpan juga dilengkapi dengan **modal detail** yang dapat dipanggil dengan mengklik baris data atau ikon mata. Modal ini menampilkan informasi lengkap prospek dan yang terpenting -- deretan tombol **"Pindah ke"** di bagian bawah yang memungkinkan sales memperbarui status lead secara cepat (misalnya dari "Follow Up" langsung ke "Survey") tanpa harus membuka halaman terpisah. Desain interaksi ini mengikuti prinsip minimal-click workflow -- aktivitas yang paling sering dilakukan sales harus bisa diselesaikan dalam jumlah klik seminimal mungkin.

**Apa nilai urgensi dan dampak bisnisnya:**

Bagi perusahaan developer properti berskala menengah yang mengelola puluhan hingga ratusan prospek secara simultan, kehilangan satu lead karena lupa follow-up bisa berarti kehilangan potensi pendapatan ratusan juta rupiah. Dampak bisnis spesifik dari fitur ini antara lain:

- **Eliminasi kehilangan data prospek** -- Seluruh leads dari semua kanal tercatat dalam satu database terpusat, bukan tersebar di catatan pribadi masing-masing sales.
- **Analisis efektivitas kanal pemasaran** -- Manajer pemasaran dapat menganalisis dari kanal mana mayoritas leads berkualitas tinggi berasal. Jika data menunjukkan bahwa 60% leads yang berujung pada transaksi berasal dari Instagram sementara Facebook hanya menghasilkan 5%, maka anggaran pemasaran digital dapat direalokasikan secara data-driven.
- **Akuntabilitas sales** -- Setiap leads memiliki PIC (Person in Charge) yang jelas, sehingga jika ada prospek yang terlewat follow-up, manajer dapat mengidentifikasi dan menindaklanjuti.

---

### 2.2. Sistem Pipeline Penjualan (Kanban Board Drag-and-Drop)

**Apa fungsi fitur ini:**

Jika halaman Leads adalah tempat data prospek disimpan, maka halaman Pipeline adalah tempat data tersebut divisualisasikan secara spasial berdasarkan posisi mereka dalam perjalanan menuju pembelian. Pipeline menggunakan paradigma antarmuka **Kanban Board** -- sebuah papan visual yang terbagi menjadi beberapa kolom, di mana setiap kolom merepresentasikan satu tahapan dalam corong penjualan (sales funnel). Pendekatan Kanban dipilih karena kemampuannya menyajikan informasi yang kompleks (puluhan leads di berbagai tahap) dalam satu layar yang mudah dicerna secara visual, tanpa memerlukan navigasi ke halaman terpisah.

**Bagaimana alur kerja operasionalnya di sistem:**

Papan Kanban yang telah diimplementasikan terdiri dari **enam kolom** yang merepresentasikan tahapan penjualan secara berurutan, masing-masing dengan aksen warna yang berbeda di border atas kolom:

- **Baru** (aksen abu-abu) -- Leads yang baru masuk dan belum diproses oleh sales manapun.
- **Follow Up** (aksen biru) -- Leads yang sudah dihubungi setidaknya satu kali melalui telepon, WhatsApp, atau email.
- **Survey** (aksen ungu) -- Leads yang sudah dijadwalkan atau sudah melakukan kunjungan langsung ke lokasi proyek perumahan.
- **Negosiasi** (aksen amber) -- Leads yang sedang dalam diskusi aktif mengenai harga, skema pembayaran, dan pemilihan unit spesifik.
- **Booking** (aksen hijau) -- Leads yang sudah membayar uang tanda jadi dan unit kavling sudah dikunci secara resmi.
- **SPK** (aksen hijau tua) -- Surat Pesanan Kavling sudah ditandatangani, proses sedang bergerak menuju akad kredit atau pelunasan.

Setiap kolom memiliki **header** yang menampilkan nama tahap dan badge counter berisi jumlah leads di tahap tersebut. Di bawahnya, kartu-kartu leads tersusun vertikal dan masing-masing menampilkan informasi ringkas:

- Nama prospek dan badge status berwarna
- Tipe unit yang diminati (dengan ikon rumah)
- Nomor telepon (dengan ikon telepon)
- Nama Sales PIC (dengan ikon pengguna)
- Sumber perolehan dan tanggal masuk (di footer kartu, dipisahkan garis tipis)

Fitur utama yang membedakan pipeline ini dari sekadar daftar statis adalah kemampuan **drag-and-drop**. Alur operasional tipikal:

1. Sales Rina baru saja menelepon Budi Santoso dan berhasil menjadwalkan kunjungan lokasi untuk hari Sabtu.
2. Rina membuka halaman Pipeline, menemukan kartu "Budi Santoso" di kolom "Follow Up".
3. Rina menyeret (drag) kartu Budi dari kolom "Follow Up" ke kolom "Survey".
4. Sistem secara otomatis memperbarui status Budi menjadi "Survey" tanpa refresh halaman.
5. Kartu Budi kini muncul di kolom Survey, dan counter di header Follow Up berkurang 1 sementara counter Survey bertambah 1.

Sebagai alternatif dari drag-and-drop, pengguna juga dapat mengklik kartu untuk membuka modal detail yang menampilkan informasi lengkap beserta deretan tombol "Pindah ke" untuk berpindah tahap secara cepat.

**[SCREENSHOT: Halaman Pipeline CRM menampilkan papan Kanban dengan 6 kolom bertahap -- Baru (2 kartu), Follow Up (2 kartu), Survey (2 kartu), Negosiasi (2 kartu), Booking (1 kartu), dan SPK (1 kartu). Setiap kartu memperlihatkan nama lead, tipe minat, nomor telepon, badge status berwarna, dan nama sales PIC. Kolom header memiliki aksen warna berbeda dan counter jumlah lead]**

**Apa nilai urgensi dan dampak bisnisnya:**

Dalam rapat mingguan tim sales yang rutin dilakukan di perusahaan developer properti, manajer sales perlu melihat gambaran menyeluruh tentang kondisi funnel penjualan. Tanpa visualisasi pipeline, jawaban atas pertanyaan-pertanyaan manajerial harus diekstrak secara manual dari spreadsheet. Dengan Kanban board, manfaat yang diperoleh antara lain:

- **Diagnosis cepat kesehatan funnel** -- Jika kolom "Survey" menumpuk sementara kolom "Negosiasi" kosong, itu mengindikasikan masalah konversi pasca-kunjungan lokasi.
- **Identifikasi bottleneck** -- Manajer langsung tahu di tahap mana leads "tersangkut" paling lama.
- **Transparansi beban kerja** -- Terlihat jelas sales mana yang menangani berapa banyak leads di setiap tahap.
- **Aksi segera** -- Drag-and-drop memungkinkan update status dalam hitungan detik, bukan menit.

---

### 2.3. Sistem Manajemen Unit dan Site Plan Interaktif (Perspektif Sales)

**Apa fungsi fitur ini:**

Halaman Manajemen Unit di dalam Modul CRM merupakan jembatan langsung antara data inventori yang dibangun pada minggu ke-7 dengan kebutuhan operasional tim sales. Berbeda dengan halaman inventori yang berorientasi pada input dan pengelolaan data (perspektif admin), halaman unit di CRM ini berorientasi pada **konsumsi data dan eksekusi penjualan** (perspektif sales). Tim sales membutuhkan akses cepat untuk mengetahui unit mana yang masih tersedia, berapa harganya, dan di mana lokasinya dalam peta kawasan -- semua informasi ini harus tersaji dalam hitungan detik ketika seorang prospek bertanya melalui telepon atau saat sales sedang melakukan presentasi di depan calon pembeli.

**Bagaimana alur kerja operasionalnya di sistem:**

Halaman ini menyajikan **dua mode tampilan** yang dapat dipilih melalui toggle button:

**Mode 1 -- Grid / Site Plan Visual:**
- Kavling dirender sebagai kotak-kotak berwarna yang dikelompokkan berdasarkan blok (Blok A, Blok B, Blok C).
- Setiap kotak menampilkan: nomor unit (contoh: A-01), tipe rumah (contoh: 36/60), dan label status.
- Warna kotak berubah sesuai status unit:
  - **Hijau** -- Tersedia (boleh ditawarkan ke calon pembeli)
  - **Kuning/Amber** -- Booked (sudah dikunci, tidak boleh ditawarkan)
  - **Abu-abu** -- Terjual (transaksi sudah final)
  - **Biru** -- Indent (pemesanan konstruksi, unit belum dibangun)
- Legenda warna disajikan di atas area grid sebagai panduan pembacaan.
- Klik pada kotak unit membuka modal detail.

**Mode 2 -- Tabel Data:**
- Tampilan tabular dengan kolom: No. Unit, Blok, Tipe, Luas Tanah (m2), Luas Bangunan (m2), Harga, Status, dan Pembeli.
- Setiap baris dapat diklik untuk membuka modal detail yang sama.
- Footer tabel menampilkan informasi "Menampilkan X dari Y unit".

Di bagian atas kedua mode, terdapat **empat kartu KPI ringkasan**:

- **Total Unit** -- Jumlah seluruh kavling terdaftar (12 unit)
- **Tersedia** -- Jumlah unit yang statusnya masih bisa dijual (5 unit, warna hijau)
- **Booked** -- Jumlah unit yang sedang dalam proses transaksi (2 unit, warna amber)
- **Terjual** -- Jumlah unit yang transaksinya sudah selesai (3 unit, warna abu-abu)

Sistem filter yang tersedia mencakup:

- **Search** -- Pencarian berdasarkan nomor unit
- **Filter Blok** -- Dropdown untuk memilih blok spesifik (Blok A, B, atau C)
- **Filter Status** -- Dropdown untuk memfilter berdasarkan status (Tersedia, Booked, Terjual, Indent)

Ketika pengguna mengklik salah satu unit, **modal detail** terbuka menampilkan:

- Header berisi nomor unit, nama blok, tipe rumah, dan badge status berwarna
- Informasi dimensi: Luas Tanah (m2) dan Luas Bangunan (m2)
- Harga unit dalam format Rupiah (font bold dan ukuran lebih besar)
- Nama pembeli (jika unit sudah terjual/booked) atau tanda strip jika belum
- **Dua tombol aksi** (hanya muncul untuk unit berstatus "Tersedia"):
  - "Booking Unit Ini" -- mengarahkan ke proses penguncian unit
  - "Edit Harga" -- untuk penyesuaian harga khusus unit tersebut

**Apa nilai urgensi dan dampak bisnisnya:**

Visualisasi site plan berbasis warna ini memecahkan salah satu masalah klasik dalam operasional penjualan properti: **asimetri informasi antar sales**.

- Dalam model konvensional, informasi ketersediaan unit biasanya tersimpan di satu papan fisik di kantor marketing atau di spreadsheet yang tidak selalu diperbarui secara real-time.
- Seorang sales yang sedang di lapangan bersama calon pembeli tidak memiliki akses ke informasi terkini, dan bisa saja menawarkan unit yang sudah di-booking sales lain beberapa jam sebelumnya.
- Dengan site plan digital yang menampilkan data dari sumber yang sama, setiap sales memiliki pandangan yang identik tentang kondisi stok.
- Risiko miskomunikasi dan double-booking yang merugikan reputasi perusahaan dapat dieliminasi secara struktural.

---

### 2.4. Sistem Booking dan Transaksi (Penguncian Unit Kavling)

**Apa fungsi fitur ini:**

Halaman Transaksi merupakan kulminasi dari seluruh siklus penjualan yang difasilitasi oleh CRM. Di sinilah komitmen verbal antara sales dan prospek diterjemahkan menjadi catatan resmi di dalam sistem -- sebuah lead berubah menjadi pembeli, dan sebuah kavling berubah statusnya dari "Tersedia" menjadi "Booked". Proses booking di dunia properti memiliki implikasi hukum dan finansial yang signifikan: begitu pembeli membayar uang tanda jadi dan booking tercatat, unit tersebut secara efektif "dikunci" dan tidak boleh ditawarkan kepada pihak lain. Kesalahan dalam proses ini -- seperti lupa mencatat atau terlambat mengunci unit -- dapat berujung pada kerugian finansial dan kerusakan reputasi yang serius bagi perusahaan.

**Bagaimana alur kerja operasionalnya di sistem:**

**A. Form Booking Unit Baru**

Form Booking Unit diakses melalui tombol "Booking Baru" pada halaman Transaksi. Form ini ditampilkan sebagai dialog modal dengan layout grid dua kolom yang terstruktur. Field-field yang tersedia:

- **Baris 1:**
  - **Pilih Lead** (dropdown) -- Menampilkan nama-nama prospek yang sudah terdaftar di database CRM, memastikan setiap booking terhubung dengan data prospek yang tervalidasi.
  - **Pilih Unit** (dropdown) -- Menampilkan hanya unit-unit yang statusnya masih "Tersedia" dari database inventori. Ini adalah titik integrasi paling kritis antara Modul CRM dan Modul Inventori.

- **Baris 2:**
  - **Skema Pembayaran** (dropdown) -- Tiga opsi: KPR (Kredit Pemilikan Rumah), Tunai (bayar lunas), atau Tunai Bertahap (cicilan langsung ke developer tanpa melalui bank).
  - **Tanda Jadi (Rp)** -- Nominal booking fee dalam format Rupiah.

- **Baris 3:**
  - **Nominal Uang Muka / DP (Rp)** -- Nilai total Down Payment yang disepakati.
  - **Tenor Cicilan DP (Bulan)** (dropdown) -- Pilihan periode cicilan DP: 1x (lunas di muka), 2x (2 bulan), 3x (3 bulan), atau 6x (6 bulan).

- **Baris 4:** Tombol "Batal" dan "Proses Booking".

Kelengkapan field pada baris ke-3 sangat penting karena data kesepakatan pembayaran yang diinput di sini nantinya akan menjadi dasar bagi Modul Keuangan untuk men-generate jadwal tagihan cicilan secara otomatis -- misalnya jika disepakati DP Rp 20 juta dicicil 2x, sistem akan membuatkan 2 lembar invoice masing-masing Rp 10 juta dengan jatuh tempo yang berbeda.

**[SCREENSHOT: Modal Form "Booking Unit Baru" terbuka menampilkan layout grid 2 kolom dengan dropdown "Pilih Lead" berisi daftar nama prospek, dropdown "Pilih Unit" berisi nomor kavling yang tersedia, dropdown "Skema Pembayaran" (KPR/Tunai/Tunai Bertahap), input "Tanda Jadi (Rp)", input "Nominal Uang Muka / DP (Rp)", dan dropdown "Tenor Cicilan DP" (1x/2x/3x/6x), diikuti tombol "Proses Booking" berwarna biru]**

**B. Tabel Riwayat Transaksi**

Setelah booking diproses, data transaksi ditampilkan dalam tabel riwayat dengan kolom-kolom berikut:

- **ID** -- Kode unik transaksi dalam format alfanumerik (T001, T002, dst).
- **Pembeli** -- Nama lengkap pembeli yang tercatat.
- **Unit** -- Nomor kavling yang di-booking (contoh: A-01, A-03).
- **Skema** -- Badge label skema pembayaran (KPR / Tunai / Tunai Bertahap).
- **Nilai** -- Total nilai transaksi dalam format Rupiah.
- **Status KPR** -- Badge berwarna yang menunjukkan posisi proses KPR (Pengajuan, Proses, Disetujui, Akad, atau Ditolak).
- **Progress** -- Mini progress bar horizontal yang secara visual menggambarkan persentase kemajuan proses KPR.
- **Tanggal** -- Tanggal booking dicatat ke dalam sistem.

Setiap baris dapat diklik untuk membuka modal detail transaksi.

**C. Detail Transaksi dan Update Progress KPR**

Modal detail transaksi menampilkan informasi yang lebih lengkap, termasuk:

- Header berisi nama pembeli, ID transaksi, dan nomor unit.
- **Dropdown interaktif Status KPR** (bukan sekadar label statis) -- memungkinkan tim sales memperbarui status KPR secara langsung. Opsi yang tersedia:
  - Pengajuan -- Berkas sedang dikirim ke bank.
  - Proses -- Bank sedang melakukan BI Checking dan analisis kapasitas bayar.
  - Disetujui -- SP3K (Surat Persetujuan Kredit) sudah terbit dari bank.
  - Akad -- Penandatanganan akad kredit di hadapan notaris sudah selesai.
  - Ditolak -- Bank menolak pengajuan KPR (perlu diajukan ke bank lain).
- **Stepper visual 4 tahap** -- Empat lingkaran bernomor yang menyala secara progresif sesuai status KPR aktif, dihubungkan oleh garis horizontal. Lingkaran aktif berwarna biru dengan shadow, lingkaran non-aktif berwarna abu-abu.
- Informasi transaksional: Skema pembayaran, Nilai Transaksi, Tanda Jadi, Tanggal Booking, dan Tanggal SPK (jika sudah ada).

**D. Solusi Masalah Nyata -- Pencegahan Double-Booking (Auto-Locking System):**

Salah satu masalah paling merugikan yang lazim terjadi di perusahaan developer properti konvensional adalah fenomena **double-booking**, yaitu kondisi di mana dua orang sales yang berbeda berhasil "menjual" satu unit kavling yang sama kepada dua pembeli yang berbeda dalam rentang waktu yang berdekatan. Dalam model operasional manual, ini terjadi karena informasi ketersediaan unit tidak tersinkronisasi secara real-time.

Arsitektur sistem SIMDP menyelesaikan masalah ini melalui mekanisme berikut:

1. Sales B memproses booking untuk unit A-03 pada pukul 10.00 WIB.
2. Status unit A-03 di database inventori langsung berubah menjadi "Booked" secara atomik.
3. Sales A membuka dropdown "Pilih Unit" di form booking pada pukul 10.30 WIB -- unit A-03 **tidak lagi muncul** dalam daftar pilihan karena sistem hanya menampilkan unit berstatus "Tersedia".
4. Jika Sales A membuka halaman site plan, kotak kavling A-03 sudah berubah warna dari hijau menjadi kuning (Booked), memberikan sinyal visual yang tidak mungkin diabaikan.
5. Double-booking terprevensi secara struktural tanpa mengandalkan komunikasi verbal antar sales.

**[SCREENSHOT: Halaman Tabel Riwayat Transaksi menampilkan 4 baris data transaksi dengan kolom ID Transaksi, Nama Pembeli (Hendra Wijaya, Dewi Lestari, Ahmad Fauzi, Siti Nurhaliza), Nomor Unit, Badge Skema (KPR/Tunai/Tunai Bertahap), Nilai Transaksi dalam format Rupiah, Badge Status KPR berwarna, mini progress bar biru, dan Tanggal Booking]**

**Apa nilai urgensi dan dampak bisnisnya:**

- **Pencegahan kerugian finansial langsung** -- Double-booking yang tidak terdeteksi dapat memaksa developer mengembalikan uang tanda jadi kepada salah satu pembeli plus kompensasi, yang nilainya bisa mencapai puluhan juta rupiah.
- **Perlindungan reputasi perusahaan** -- Pembeli yang mengalami double-booking akan kehilangan kepercayaan dan menyebarkan pengalaman negatifnya, merusak citra developer di pasar.
- **Audit trail yang jelas** -- Setiap transaksi memiliki timestamp, ID unik, dan nama PIC, sehingga jika terjadi sengketa, riwayat dapat ditelusuri dengan mudah.
- **Basis data untuk modul hilir** -- Data booking yang terstruktur menjadi input langsung untuk pembuatan invoice di Modul Finance dan pembuatan PPJB di Modul Legal.

---

### 2.5. Sistem Log Aktivitas Sales dan Penjadwalan Follow-Up

**Apa fungsi fitur ini:**

Halaman Aktivitas Sales berfungsi sebagai jurnal digital untuk mencatat setiap interaksi yang dilakukan oleh tim sales dengan prospek pembeli. Dalam praktik penjualan properti, proses closing sebuah transaksi rata-rata membutuhkan 5 hingga 15 kali interaksi yang tersebar selama berminggu-minggu bahkan berbulan-bulan. Seorang sales yang menangani 20-30 prospek secara simultan mustahil mengingat detail percakapan terakhir dengan setiap prospek tanpa bantuan sistem pencatatan yang terstruktur. Halaman ini menjawab kebutuhan tersebut sekaligus memberikan alat bantu manajemen berupa penjadwalan follow-up otomatis.

**Bagaimana alur kerja operasionalnya di sistem:**

Antarmuka Aktivitas Sales menggunakan **layout dua kolom** pada layar desktop:

**Kolom Utama (2/3 lebar layar) -- Timeline Aktivitas:**

Aktivitas ditampilkan dalam format timeline yang dikelompokkan berdasarkan tanggal. Setiap kelompok tanggal diawali dengan separator garis horizontal dan label tanggal di tengah. Di bawah label, kartu-kartu aktivitas tersusun secara vertikal. Setiap kartu aktivitas menampilkan:

- **Ikon tipe aktivitas** -- Ditampilkan dalam kotak berwarna di sisi kiri kartu. Terdapat 5 tipe yang didukung:
  - Telepon (ikon handphone, warna biru)
  - WhatsApp (ikon pesan, warna hijau)
  - Kunjungan (ikon pin lokasi, warna ungu)
  - Email (ikon surat, warna amber)
  - Meeting (ikon orang-orang, warna merah muda)
- **Nama lead** yang dihubungi dan badge tipe aktivitas berwarna.
- **Nama Sales PIC** di pojok kanan atas kartu.
- **Catatan naratif** dari interaksi tersebut (contoh: "Kirim brosur tipe 45/72 dan pricelist").
- **Jadwal Follow-Up** (opsional) -- Jika ditentukan, muncul sebagai label berwarna biru dengan ikon kalender dan tanggal terjadwal.

Di atas timeline, terdapat baris filter yang mencakup:

- **Dropdown Tipe Aktivitas** -- Filter berdasarkan tipe (Telepon, WhatsApp, Kunjungan, Email, Meeting).
- **Dropdown Sales** -- Filter berdasarkan nama sales PIC (Rina, Andi).
- **Tombol "Catat Aktivitas"** -- Membuka form modal untuk mencatat interaksi baru.

Form pencatatan aktivitas baru menyediakan:

- Dropdown pemilihan Lead (siapa yang dihubungi)
- Dropdown pemilihan Tipe aktivitas
- Textarea untuk catatan naratif
- Input tanggal opsional untuk jadwal follow-up berikutnya

**Kolom Sidebar (1/3 lebar layar) -- Widget Informasi:**

Sidebar berisi dua widget yang memberikan informasi ringkas:

- **Widget "Jadwal Follow-Up"** -- Menampilkan daftar aktivitas yang memiliki jadwal tindak lanjut, diurutkan berdasarkan tanggal terdekat. Setiap item menampilkan ikon tipe, nama lead, ringkasan catatan, dan tanggal follow-up. Widget ini memastikan sales tidak pernah melewatkan jadwal follow-up yang sudah ditentukan.

- **Widget "Ringkasan Sales"** -- Menampilkan daftar nama sales beserta total jumlah aktivitas yang tercatat di sistem. Setiap sales ditampilkan sebagai baris dengan avatar inisial berwarna biru dan badge counter aktivitas. Contoh: "Rina -- 4 aktivitas", "Andi -- 4 aktivitas".

**Apa nilai urgensi dan dampak bisnisnya:**

- **Kontinuitas percakapan** -- Ketika Sales Rina cuti atau resign, sales pengganti dapat langsung membaca seluruh riwayat interaksi dengan setiap prospek tanpa kehilangan konteks.
- **Evaluasi kinerja berbasis data** -- Manajer dapat membandingkan jumlah dan kualitas aktivitas antar sales, mengidentifikasi siapa yang paling produktif dan siapa yang perlu coaching.
- **Pencegahan lead yang "dingin"** -- Widget follow-up memastikan tidak ada prospek yang terabaikan terlalu lama, menjaga momentum penjualan tetap hidup.
- **Korelasi aktivitas-konversi** -- Data ini memungkinkan analisis berapa rata-rata jumlah interaksi yang dibutuhkan sebelum seorang lead menjadi pembeli, sehingga strategi sales dapat dioptimalkan.

---

## 3. Evaluasi dan Metrik Pencapaian Mingguan

### 3.1 Persentase Penyelesaian Modul Sales dan Marketing (CRM)

| Sub-Komponen | Status | Estimasi Penyelesaian | Keterangan |
| :--- | :---: | :---: | :--- |
| Dashboard Navigasi CRM | Selesai | 100% | 5 kartu modul + 2 kartu statistik |
| Halaman Leads (CRUD UI) | Selesai | 100% | Tabel, filter, search, form tambah, detail |
| Badge Filter Status Leads | Selesai | 100% | 6 badge interaktif dengan counter |
| Pipeline Kanban Board | Selesai | 100% | 6 kolom, drag-and-drop fungsional |
| Quick Status Move (Pipeline) | Selesai | 100% | Tombol perpindahan cepat di modal detail |
| Manajemen Unit -- Mode Grid | Selesai | 100% | Site plan visual per blok, warna dinamis |
| Manajemen Unit -- Mode Tabel | Selesai | 100% | Tabel data lengkap 8 kolom dengan filter |
| KPI Summary Unit | Selesai | 100% | 4 kartu: Total, Tersedia, Booked, Terjual |
| Form Booking Unit | Selesai | 100% | 6 field terstruktur termasuk DP dan Tenor |
| Tabel Riwayat Transaksi | Selesai | 100% | 8 kolom data + mini progress bar KPR |
| Detail Transaksi + Update KPR | Selesai | 100% | Dropdown interaktif + stepper visual 4 tahap |
| Log Aktivitas Sales (Timeline) | Selesai | 100% | Grouped by date, 5 tipe, filter PIC |
| Widget Jadwal Follow-Up | Selesai | 100% | Auto-sorted by nearest date |
| Widget Ringkasan Sales | Selesai | 100% | Counter aktivitas per PIC |
| Integrasi API Backend | Belum | 0% | Menunggu endpoint NestJS sprint berikutnya |
| Auto-Generate Invoice ke Finance | Belum | 5% | Desain arsitektur selesai, implementasi pending |

**Total Estimasi Fase Frontend CRM: ~90% selesai**

Angka 90% mencerminkan bahwa seluruh antarmuka pengguna dan logika interaksi frontend telah selesai dibangun dan dapat dioperasikan secara fungsional. Sisa 10% adalah integrasi dengan backend API yang akan memastikan data tersimpan secara permanen di database PostgreSQL dan perubahan status unit ter-propagasi secara real-time ke seluruh modul terkait melalui mekanisme event-driven.

### 3.2 Progress Keseluruhan Platform SIMDP

| Aplikasi / Modul | Status | Progress |
| :--- | :---: | :---: |
| Web Admin -- Autentikasi dan RBAC | Selesai Fase Frontend | ~95% |
| Web Admin -- UI Shell (Sidebar dan Topbar) | Selesai | ~100% |
| Web Admin -- Modul Inventori | Selesai Fase Frontend | ~90% |
| Web Admin -- Modul CRM dan Sales | Selesai Fase Frontend | ~90% |
| Web Admin -- Modul Finance | In Progress | ~50% |
| Web Admin -- Modul Legal | In Progress | ~45% |
| Web Admin -- Modul Monitoring Proyek | In Progress | ~30% |
| Backend NestJS + Prisma | Struktur folder | ~10% |
| Website Marketing Publik | Belum dimulai | 0% |
| Customer Portal | Belum dimulai | 0% |
| Mobile App (Lapangan) | In Progress | ~40% |

### 3.3 Kendala Operasional dan Solusi yang Diterapkan

Selama sprint minggu ke-8, terdapat beberapa tantangan logika bisnis yang dihadapi dan berhasil diatasi:

**Kendala 1 -- Sinkronisasi Data Unit Lintas Modul:**

- **Masalah:** Halaman Manajemen Unit di CRM perlu menampilkan data yang identik dengan Modul Inventori, namun dengan perspektif dan interaksi yang berbeda. Tantangannya adalah memastikan kedua halaman merujuk pada sumber data yang sama tanpa duplikasi.
- **Solusi:** Menggunakan file data bersama (`crm-data.ts`) yang diimpor oleh kedua modul. Pada fase backend, ini akan digantikan oleh API endpoint tunggal yang melayani kedua modul.

**Kendala 2 -- Desain Form Booking yang Komprehensif:**

- **Masalah:** Form booking awalnya hanya memiliki 4 field (Lead, Unit, Skema, Tanda Jadi). Setelah analisis alur bisnis, disadari bahwa informasi Nominal DP dan Tenor Cicilan DP sangat diperlukan agar Modul Keuangan dapat men-generate jadwal tagihan secara otomatis.
- **Solusi:** Penambahan 2 field baru tanpa mengorbankan kesederhanaan antarmuka, berkat penggunaan layout grid 2 kolom yang konsisten.

**Kendala 3 -- Logika Progress KPR Non-Linear:**

- **Masalah:** Status KPR tidak selalu bergerak maju secara linear (Pengajuan lalu Proses lalu Disetujui lalu Akad). Dalam praktik nyata, KPR bisa ditolak di tahap manapun dan perlu diajukan ulang ke bank lain.
- **Solusi:** Implementasi dropdown status KPR (bukan tombol "next step" yang kaku) untuk mengakomodasi skenario non-linear, termasuk penambahan opsi "Ditolak" yang mengembalikan progress bar ke 0%.

### 3.4 KPI Sprint Minggu ke-8

| KPI | Target | Realisasi | Status |
| :--- | :---: | :---: | :---: |
| Sub-halaman CRM selesai (UI) | 5 halaman | 5 halaman | Tercapai |
| Form modal fungsional | 3 modal | 4 modal | Melampaui target |
| Fitur drag-and-drop Pipeline | 1 fitur | 1 fitur | Tercapai |
| Integrasi visual data inventori | Ya | Ya (via site plan) | Tercapai |
| Design system konsisten | Amber/Zinc | Teraplikasi penuh | Tercapai |
| Bug critical | 0 | 0 | Aman |
| TypeScript type check | Pass | Pass | Tercapai |

---

## 4. Rencana Tindak Lanjut (Next Sprint Planning -- Minggu ke-9)

Dengan selesainya Modul CRM pada minggu ke-8, platform SIMDP kini telah memiliki dua modul operasional inti yang saling terhubung secara arsitektural: Inventori (penyedia data produk) dan CRM (pengelola data penjualan). Kombinasi ini menghasilkan satu output data yang sangat penting bagi ekosistem: **data booking**. Data booking inilah yang akan menjadi bahan bakar utama bagi dua arah pengembangan pada sprint berikutnya.

**Prioritas 1 -- Penyempurnaan Modul Keuangan (Finance dan Accounting):**

Sprint minggu ke-9 akan difokuskan pada penyempurnaan Modul Keuangan sebagai penerima estafet langsung dari data booking yang dihasilkan Modul CRM. Pekerjaan spesifik yang direncanakan:

- Membangun logika agar ketika tim sales memproses booking dengan kesepakatan DP cicilan 6 kali, sistem secara otomatis membuatkan 6 lembar invoice yang masing-masing memiliki tanggal jatuh tempo berbeda di panel Finance.
- Meningkatkan halaman Tagihan yang saat ini sudah memiliki tombol "Konfirmasi Lunas" fungsional dengan mekanisme upload bukti transfer dari sisi pembeli.
- Menambahkan indikator visual di dashboard Finance yang menunjukkan total piutang yang berasal dari booking aktif versus yang sudah dilunasi.

**Prioritas 2 -- Penyambungan Data Status Unit ke Website Marketing Publik:**

- Tujuannya adalah agar site plan yang ditampilkan di website publik (yang dilihat oleh calon pembeli) secara otomatis mencerminkan perubahan status yang terjadi di panel admin.
- Ketika sales memproses booking untuk unit A-03 di CRM, kotak kavling A-03 di website publik harus langsung berubah warna dari hijau menjadi kuning tanpa intervensi manual dari tim IT.
- Integrasi ini merupakan salah satu pilar utama dari konsep "ekosistem terpadu" yang menjadi inti dari tugas akhir ini, membuktikan bahwa data dapat mengalir secara seamless dari panel operasional internal ke antarmuka publik yang dilihat oleh konsumen akhir.

---

*Dokumen: progress-report-minggu-8-crm.md*  
*Dibuat: 21 Mei 2026*  
*Bagian dari: Dokumentasi Tugas Akhir -- Ekosistem Digital Properti Terpadu*
