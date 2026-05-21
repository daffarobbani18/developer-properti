# LAPORAN KEMAJUAN MINGGUAN -- MINGGU KE-9

**Judul Tugas Akhir:** Ekosistem Digital Properti Terpadu (SIMDP -- Sistem Informasi Manajemen Developer Perumahan)  
**Periode Laporan:** 12 Mei 2026 -- 18 Mei 2026  
**Minggu ke:** 9 (Fase Implementasi Modul Keuangan)  
**Fokus Utama:** Modul Finance dan Accounting -- Tagihan, Cashflow, Pengeluaran, serta Monitoring RAB dan Realisasi Anggaran  
**Status Keseluruhan:** Hijau -- On Track  
**Disusun oleh:** Daffa Robbani  

---

## 1. Ringkasan Eksekutif (Executive Summary)

Pada sprint minggu ke-8, Modul CRM dan Sales berhasil diselesaikan secara menyeluruh pada lapisan antarmuka pengguna. Salah satu output terpenting dari sprint tersebut adalah data booking -- sebuah entitas yang merepresentasikan komitmen transaksi antara developer dan pembeli, yang memuat informasi mengenai unit yang dipilih, skema pembayaran yang disepakati, nominal tanda jadi, besaran uang muka, dan tenor cicilan DP. Data booking ini ibarat "piutang terstruktur" -- ia menyatakan dengan jelas berapa uang yang berhak diterima perusahaan, dari siapa, untuk unit apa, dan kapan seharusnya diterima. Namun data piutang yang belum ditindaklanjuti oleh divisi keuangan tidak memiliki nilai operasional. Pertanyaan yang harus dijawab sprint minggu ke-9 adalah: bagaimana data booking yang dibuat oleh tim sales tersebut dapat diproses, dipantau, dan divalidasi oleh tim Finance secara sistematis, transparan, dan bertanggung jawab?

Minggu ke-9 menjawab pertanyaan tersebut dengan membangun **Modul Finance dan Accounting** secara lengkap -- sebuah modul yang menempati posisi sentral dalam ekosistem SIMDP karena menjadi muara dari seluruh arus uang dalam perusahaan developer properti. Jika Modul Inventori berperan sebagai "gudang produk" dan Modul CRM berperan sebagai "mesin penjualan", maka Modul Keuangan yang dibangun minggu ini berperan sebagai "bendahara digital" yang memastikan setiap rupiah yang masuk dicatat, setiap rupiah yang keluar dipertanggungjawabkan, dan setiap rupiah yang seharusnya masuk tetapi belum masuk segera ditagih. Tanpa modul ini, seorang direktur keuangan tidak memiliki instrumen yang memadai untuk menjawab pertanyaan mendasar seperti: berapa total piutang aktif perusahaan hari ini, apakah cashflow bulan ini positif atau negatif, atau apakah pengeluaran konstruksi sudah melebihi anggaran yang ditetapkan di RAB.

Modul Finance dan Accounting yang diimplementasikan pada minggu ini mencakup empat sub-modul yang saling melengkapi dan membentuk satu ekosistem pengelolaan keuangan yang utuh. Keempat sub-modul tersebut adalah:

- **Sub-modul Tagihan** -- Pengelolaan piutang pembeli dari berbagai jenis tagihan (DP, Angsuran, Pelunasan, dan IPL) beserta mekanisme validasi pembayaran secara real-time.
- **Sub-modul Cashflow** -- Analisis dan visualisasi arus kas pemasukan dan pengeluaran selama 6 bulan terakhir menggunakan grafik interaktif berbasis library Recharts.
- **Sub-modul Pengeluaran** -- Pencatatan, kategorisasi, dan pengelolaan seluruh pengeluaran operasional perusahaan lengkap dengan dukungan upload bukti dokumen.
- **Sub-modul RAB dan Realisasi** -- Pemantauan anggaran biaya proyek (Rencana Anggaran Biaya) versus realisasi aktual secara visual dengan sistem alert otomatis untuk pos yang mendekati batas anggaran.

**[SCREENSHOT: Halaman Dashboard Utama Modul Keuangan menampilkan 4 kartu statistik ringkasan di bagian atas (Pemasukan Bulan Ini: Rp 580 juta, Pengeluaran Bulan Ini: Rp 385 juta, Laba Kotor: Rp 195 juta +33.6% margin, Piutang Belum Bayar: Rp 248 juta) beserta grid 4 kartu navigasi modul (Cashflow, Tagihan, Pengeluaran, RAB & Realisasi) dan panel Ringkasan Keuangan di bagian bawah berisi Status Cashflow, Proyek Aktif, dan Total Tagihan Aktif]**

---

## 2. Penjabaran Detail Fungsionalitas dan Data yang Diselesaikan

Modul Keuangan yang dibangun pada minggu ini terdiri dari **4 sub-modul halaman** operasional yang masing-masing memiliki tanggung jawab spesifik dalam siklus keuangan perusahaan. Berikut adalah penjabaran mendalam dari setiap sub-modul.

---

### 2.1. Sub-modul Tagihan (Invoice dan Validasi Pembayaran)

**Apa fungsi fitur ini:**

Halaman Tagihan adalah jantung dari seluruh operasional tim Finance di platform SIMDP. Di halaman inilah seluruh catatan piutang pembeli dikelola -- mulai dari tagihan uang muka (DP), tagihan angsuran bulanan, tagihan pelunasan sisa pembayaran, hingga tagihan Iuran Pengelolaan Lingkungan (IPL) yang bersifat rutin. Dalam konteks bisnis developer properti yang sering kali mengelola ratusan pembeli dengan jadwal cicilan yang berbeda-beda, sistem manajemen tagihan yang terstruktur adalah kebutuhan mutlak yang tidak bisa digantikan dengan catatan manual atau spreadsheet. Kekacauan dalam pengelolaan tagihan dapat berujung pada kerugian finansial yang serius: tagihan yang tidak tertagih karena terlewat, pembayaran yang tidak tervalidasi sehingga statusnya tetap "belum bayar" meskipun uang sudah masuk ke rekening, atau tagihan terlambat yang tidak mendapat tindak lanjut sehingga developer kehilangan daya negosiasi dengan pembeli.

**Bagaimana alur kerja operasionalnya di sistem:**

Halaman Tagihan dibangun dengan arsitektur yang memungkinkan tim Finance untuk melakukan pengawasan, pencarian, dan validasi secara efisien. Komponen-komponen utama yang diimplementasikan:

**A. Kartu Statistik Ringkasan di Header**

Di bagian paling atas halaman, terdapat tiga kartu KPI yang memberikan snapshot kondisi piutang secara instan:

- **Total Belum Bayar** -- Jumlah total nominal tagihan yang statusnya masih "Belum Bayar" dalam format Rupiah. Nilai ini dihitung secara otomatis dari seluruh tagihan dengan status `belum_bayar` menggunakan fungsi helper `getTotalByStatus`.
- **Terlambat** -- Total nominal tagihan yang sudah melewati tanggal jatuh tempo namun belum dibayar, ditampilkan dengan warna merah sebagai tanda urgensi. Jika tidak ada tagihan terlambat, indikator berubah menjadi hijau bertuliskan "Semua Lancar".
- **Lunas Bulan Ini** -- Total nominal tagihan yang sudah divalidasi pembayarannya oleh tim Finance pada bulan berjalan.

**B. Sistem Filter dan Pencarian**

Terdapat tiga mekanisme penyaringan data yang dapat dikombinasikan:

- **Search Bar** -- Pencarian berdasarkan nama pelanggan, nomor invoice (contoh: INV/2024/01/001), atau nomor unit (contoh: A-12, B-08).
- **Dropdown Filter Status** -- Empat pilihan: Semua, Belum Bayar, Lunas, Terlambat, dan Cicilan.
- **Dropdown Filter Tipe** -- Empat pilihan: Semua, DP (Uang Muka), Angsuran (cicilan bulanan), Pelunasan (sisa pembayaran), dan IPL (Iuran Pengelolaan Lingkungan).

**C. Tabel Daftar Tagihan**

Tabel utama menampilkan seluruh tagihan dengan kolom-kolom berikut:

- **Nomor Tagihan** -- Format kode unik dalam pola `INV/TAHUN/BULAN/URUTAN`, memudahkan referensi lintas divisi.
- **Pelanggan & Unit** -- Nama pembeli dan nomor kavling yang dirujuk tagihan tersebut.
- **Tipe Tagihan** -- Badge berwarna yang membedakan jenis tagihan (DP berwarna biru, Angsuran berwarna abu-abu, Pelunasan berwarna hijau, IPL berwarna ungu).
- **Cicilan** -- Informasi cicilan ke berapa dari total berapa (misalnya "Cicilan ke-3 dari 12").
- **Nominal** -- Nilai tagihan dalam format Rupiah.
- **Jatuh Tempo** -- Tanggal tenggat pembayaran. Sistem menampilkan tanggal ini dengan warna merah jika sudah terlewati dan tagihan belum lunas.
- **Status** -- Badge berwarna berdasarkan status: kuning untuk "Belum Bayar", merah untuk "Terlambat", hijau untuk "Lunas".
- **Aksi** -- Tombol ikon mata untuk membuka modal detail tagihan.

**D. Modal Detail Tagihan dan Mekanisme Konfirmasi Pembayaran**

Klik pada baris tagihan atau ikon mata akan membuka modal detail yang menampilkan informasi lengkap. Di dalam modal ini terdapat dua kondisi tampilan yang berbeda berdasarkan status tagihan:

**Kondisi 1 -- Tagihan Belum Lunas:**
- Informasi detail tagihan: nomor invoice, pelanggan, unit, tipe, nominal, dan jatuh tempo.
- Area placeholder untuk bukti pembayaran dengan tombol "Upload Bukti Transfer".
- Tombol aksi utama berwarna hijau: **"Konfirmasi Lunas"**.
- Saat tombol ini diklik, sistem langsung memproses validasi:
  1. Status tagihan berubah dari `belum_bayar` atau `terlambat` menjadi `lunas`.
  2. Field `tanggalBayar` diisi otomatis dengan tanggal hari ini.
  3. Kartu statistik di header halaman (Total Belum Bayar dan Lunas Bulan Ini) langsung ter-update secara real-time tanpa refresh halaman.
  4. Badge status di tabel utama berubah dari kuning/merah menjadi hijau.

**Kondisi 2 -- Tagihan Sudah Lunas:**
- Modal menampilkan kotak sukses berwarna hijau bertuliskan "Tagihan Sudah Lunas".
- Informasi tanggal pembayaran ditampilkan secara prominan.
- Tombol aksi upload dan konfirmasi disembunyikan karena transaksi sudah selesai.

**[SCREENSHOT: Halaman Daftar Tagihan menampilkan header dengan 3 kartu KPI (Total Belum Bayar, Terlambat berwarna merah, Lunas Bulan Ini), baris filter dengan search bar dan 2 dropdown, serta tabel tagihan 8 baris dengan kolom Nomor Invoice, Pelanggan, Tipe (badge berwarna), Nominal, Jatuh Tempo, dan Badge Status -- beberapa baris berwarna merah (terlambat), kuning (belum bayar), dan hijau (lunas)]**

**Apa nilai urgensi dan dampak bisnisnya:**

Mekanisme validasi pembayaran yang dibangun dalam sub-modul ini memiliki dampak bisnis yang signifikan dan langsung terasa:

- **Eliminasi gap informasi antara bank dan sistem** -- Tanpa validasi manual oleh Finance, sistem tidak pernah tahu kapan pembayaran benar-benar masuk. Konfirmasi Lunas adalah titik di mana informasi "uang sudah di rekening" diterjemahkan menjadi status formal di sistem.
- **Jejak audit yang terstruktur** -- Setiap tagihan yang divalidasi memiliki tanggal bayar yang tercatat, memudahkan audit keuangan akhir tahun atau audit dari investor/bank.
- **Input untuk laporan cashflow** -- Setiap tagihan yang divalidasi lunas secara otomatis berkontribusi pada data pemasukan di grafik cashflow bulan berjalan.
- **Notifikasi lintas modul** -- Data pembayaran terlambat yang tampak di kartu KPI menjadi sinyal bagi manajer keuangan untuk segera menghubungi pembeli atau mengenakan denda keterlambatan sesuai perjanjian di PPJB.

---

### 2.2. Sub-modul Cashflow (Analisis dan Visualisasi Arus Kas)

**Apa fungsi fitur ini:**

Halaman Cashflow adalah instrumen analitik tertinggi dalam Modul Keuangan -- ia merangkum seluruh pergerakan uang perusahaan dalam satu tampilan terpadu yang mudah dibaca oleh Direktur Keuangan maupun pemilik perusahaan. Dalam konteks developer properti, cashflow yang negatif -- yaitu kondisi di mana pengeluaran lebih besar daripada pemasukan dalam satu periode -- adalah sinyal bahaya yang harus segera diatasi. Sebuah developer yang memiliki aset properti triliunan rupiah tetapi cashflow negatif dapat mengalami gagal bayar kepada kontraktor, yang akan menghentikan proses konstruksi, yang pada akhirnya membuat developer tidak bisa memenuhi janji serah terima kepada pembeli yang sudah membayar. Halaman Cashflow di SIMDP dirancang sebagai "dasbor kesehatan keuangan" yang memungkinkan deteksi dini terhadap kondisi-kondisi berbahaya tersebut.

**Bagaimana alur kerja operasionalnya di sistem:**

**A. Empat Kartu KPI Ringkasan**

Di bagian atas halaman, empat kartu memberikan angka-angka kunci dalam hitungan detik:

- **Total Pemasukan** -- Akumulasi seluruh pemasukan selama 6 bulan terakhir (Rp 2,985 miliar), ditampilkan dengan ikon tren naik berwarna hijau.
- **Total Pengeluaran** -- Akumulasi seluruh pengeluaran selama 6 bulan terakhir (Rp 1,697 miliar), dengan ikon tren turun berwarna merah.
- **Saldo Bulan Ini** -- Saldo bersih bulan terakhir (Rp 185,5 juta) beserta persentase saldo terhadap pemasukan bulan tersebut.
- **Rata-rata Saldo** -- Nilai rata-rata saldo bersih per bulan dari seluruh periode yang ditampilkan.

**B. Grafik Area -- Tren Cashflow 6 Bulan Terakhir**

Grafik utama menggunakan komponen `AreaChart` dari library Recharts dengan dua area yang ditumpuk:

- **Area Hijau** -- Merepresentasikan pemasukan (Pemasukan) dengan warna hijau dan gradient dari atas ke bawah yang memudar menjadi transparan.
- **Area Merah** -- Merepresentasikan pengeluaran dengan warna merah dan gradient serupa.
- Sumbu X menampilkan label bulan (September, Oktober, November, Desember, Januari, Februari).
- Sumbu Y menampilkan nilai dalam format "jutaan rupiah" (contoh: "580jt", "385jt").
- Tooltip interaktif muncul saat kursor diarahkan ke titik data, menampilkan nilai pemasukan, pengeluaran, dan saldo bersih untuk bulan tersebut.

**C. Grafik Bar -- Saldo Bersih Per Bulan**

Grafik kedua menggunakan komponen `BarChart` yang menampilkan saldo bersih (pemasukan dikurangi pengeluaran) per bulan dalam bentuk batang vertikal berwarna biru. Setiap batang memiliki sudut atas yang membulat untuk estetika modern. Grafik ini memudahkan identifikasi visual tentang bulan mana saldo paling tinggi dan bulan mana yang perlu diperhatikan.

**D. Tabel Detail Cashflow**

Di bawah kedua grafik, terdapat tabel detail yang merangkum angka per bulan:

- Kolom: Bulan, Pemasukan (hijau), Pengeluaran (merah), Saldo (biru), dan Margin (persentase saldo terhadap pemasukan).
- Kolom Margin dilengkapi ikon tren naik/turun berwarna sesuai kondisi: hijau jika margin di atas 30%, biru jika 15-30%, dan amber jika di bawah 15%.
- Baris footer menampilkan total kumulatif semua kolom.
- Tombol "Export PDF" di header memungkinkan laporan diunduh untuk kebutuhan rapat atau dokumentasi.

**E. Sistem Alert Otomatis Cashflow Negatif**

Jika saldo bulan terakhir bernilai negatif, sistem secara otomatis menampilkan banner peringatan berwarna merah di bawah kartu KPI yang berisi: nama bulan yang bermasalah, nilai negatif dalam format Rupiah, dan rekomendasi tindakan (segera tindak lanjuti penagihan atau tunda pengeluaran non-prioritas).

**[SCREENSHOT: Halaman Cashflow menampilkan 4 kartu KPI di atas, diikuti grafik Area Chart "Tren Cashflow 6 Bulan Terakhir" dengan dua area warna hijau (pemasukan) dan merah (pengeluaran) yang bertumpuk, beserta tooltip interaktif yang muncul menunjukkan data Oktober 2023 dengan pemasukan Rp 420 juta, pengeluaran Rp 215 juta, saldo Rp 205 juta. Di bawahnya terdapat Bar Chart biru "Saldo Bersih Per Bulan" dan tabel detail dengan kolom Bulan, Pemasukan, Pengeluaran, Saldo, dan Margin dengan ikon tren]**

**Apa nilai urgensi dan dampak bisnisnya:**

- **Perencanaan arus kas** -- Dengan melihat pola 6 bulan terakhir, tim keuangan dapat mengantisipasi bulan-bulan dengan kebutuhan likuiditas tinggi (misalnya bulan di mana termin pembayaran kontraktor jatuh tempo).
- **Dasar pengambilan keputusan investasi** -- Direktur dapat menilai apakah perusahaan memiliki kapasitas untuk membuka blok baru atau perlu menahan ekspansi sementara menunggu piutang cair.
- **Laporan untuk investor dan bank** -- Data cashflow yang tersaji rapi dalam grafik dan tabel dapat diekspor menjadi lampiran laporan keuangan untuk kebutuhan negosiasi kredit atau presentasi kepada investor.
- **Deteksi dini masalah likuiditas** -- Alert otomatis cashflow negatif memastikan tidak ada kondisi berbahaya yang luput dari perhatian tim keuangan.

---

### 2.3. Sub-modul Pengeluaran (Pencatatan dan Kategorisasi Biaya Operasional)

**Apa fungsi fitur ini:**

Halaman Pengeluaran adalah tempat di mana seluruh arus uang yang keluar dari perusahaan -- baik untuk kebutuhan konstruksi, bahan material, gaji karyawan, biaya pemasaran, pengurusan perizinan, maupun kebutuhan operasional lainnya -- dicatat secara tertib dan terkategori. Dalam bisnis developer properti, pengeluaran memiliki karakteristik yang sangat beragam dan sering kali dalam jumlah yang sangat besar. Pembayaran termin kepada kontraktor bisa mencapai ratusan juta rupiah untuk satu transaksi, pembelian material besi beton bisa puluhan ton sekaligus, dan pengeluaran ini harus bisa diaudit, dipertanggungjawabkan, dan dilacak kembali ke dokumen fisiknya. Sistem pencatatan pengeluaran yang baik adalah fondasi dari akuntabilitas keuangan perusahaan.

**Bagaimana alur kerja operasionalnya di sistem:**

**A. Empat Kartu KPI Pengeluaran**

Di bagian atas halaman, empat kartu menampilkan ringkasan pengeluaran berdasarkan kategori terbesar:

- **Total Pengeluaran** -- Jumlah akumulatif semua pengeluaran yang tercatat, beserta jumlah transaksi ("7 transaksi bulan ini").
- **Material** -- Total pengeluaran untuk kategori material bangunan (besi, semen, batu, dll), ditampilkan dengan persentase terhadap total ("X% dari total").
- **Kontraktor** -- Total pembayaran termin kepada kontraktor pelaksana.
- **Operasional** -- Total pengeluaran untuk kategori operasional (gaji, utilitas, kantor).

**B. Filter dan Pencarian**

- **Search Bar** -- Pencarian berdasarkan keterangan pengeluaran, nomor bukti, atau nama vendor.
- **Dropdown Filter Kategori** -- Enam pilihan kategori: Material, Kontraktor, Marketing, Perizinan, Operasional, dan Lainnya.
- Footer filter menampilkan informasi "Menampilkan X dari Y pengeluaran" yang berubah dinamis sesuai filter aktif.

**C. Tabel Daftar Pengeluaran**

Tabel utama memiliki kolom-kolom berikut:

- **Tanggal** -- Tanggal transaksi pengeluaran dalam format singkat (contoh: "1 Feb 2024").
- **Nomor Bukti** -- Kode unik dokumen dalam format `KKL/TAHUN/BULAN/URUTAN`. Jika ada file bukti yang diunggah, akan muncul label "Ada bukti" berwarna biru di bawah nomor bukti.
- **Kategori** -- Badge berwarna berdasarkan kategori: kuning untuk Material, biru untuk Kontraktor, ungu untuk Marketing, hijau untuk Perizinan, abu-abu untuk Operasional.
- **Keterangan** -- Deskripsi singkat pengeluaran (contoh: "Pembelian besi beton 50 ton", "Termin 2 - Pondasi Blok A").
- **Vendor** -- Nama pemasok atau penerima pembayaran.
- **Nominal** -- Nilai pengeluaran dalam format Rupiah berwarna merah.
- **Disetujui Oleh** -- Nama pejabat yang memberikan persetujuan pengeluaran (Direktur, Manajer Proyek, dll).
- Footer tabel menampilkan total nominal dari semua baris yang sedang ditampilkan.

**D. Form Tambah Pengeluaran Baru**

Tombol "Tambah" di header membuka form modal yang terstruktur dalam layout grid dua kolom:

- **Baris 1:** Tanggal (date picker) dan Nomor Bukti (text input)
- **Baris 2:** Kategori (dropdown) dan Nominal (number input)
- **Baris 3:** Vendor / Penerima (text input, full width)
- **Baris 4:** Keterangan (textarea, full width)
- **Baris 5:** Upload Bukti (file input yang menerima format JPG, PNG, PDF maksimal 5MB) dengan tombol upload terpisah
- **Baris 6:** Tombol Batal dan Simpan Pengeluaran

**[SCREENSHOT: Halaman Pengeluaran menampilkan 4 kartu KPI di atas, diikuti filter bar dengan search dan dropdown kategori, serta tabel pengeluaran 7 baris. Baris pertama menampilkan data: "1 Feb 2024 | KKL/2024/01/001 | Ada bukti | Badge Material (kuning) | Pembelian besi beton 50 ton | UD Baja Sejahtera | Rp 85.000.000 | Direktur". Terlihat pula modal form "Tambah Pengeluaran" yang terbuka di overlay dengan semua field terisi sebagai contoh]**

**Apa nilai urgensi dan dampak bisnisnya:**

Pencatatan pengeluaran yang tertib memberikan manfaat nyata di berbagai dimensi operasional:

- **Kontrol pengeluaran real-time** -- Manajer keuangan tidak perlu menunggu laporan akhir bulan untuk mengetahui berapa yang sudah dikeluarkan. Data tersedia setiap saat.
- **Verifikasi vendor** -- Catatan nama vendor dan nomor bukti memudahkan verifikasi silang dengan rekening koran bank untuk memastikan pembayaran sudah benar-benar tersalurkan.
- **Pendeteksian pengeluaran tidak wajar** -- Pengeluaran dalam jumlah besar yang tidak memiliki bukti atau disetujui oleh pejabat yang tidak berwenang dapat teridentifikasi lebih cepat.
- **Data input untuk RAB** -- Setiap pengeluaran yang dicatat secara kategori menjadi bahan perbandingan terhadap anggaran yang ditetapkan di sub-modul RAB.
- **Dokumentasi untuk audit** -- Field "Upload Bukti" memastikan setiap pengeluaran memiliki dokumen pendukung yang tersimpan di sistem, bukan hanya di laci meja.

---

### 2.4. Sub-modul RAB dan Realisasi (Monitoring Anggaran Proyek)

**Apa fungsi fitur ini:**

Sub-modul RAB (Rencana Anggaran Biaya) dan Realisasi adalah instrumen pemantauan anggaran proyek yang bekerja di atas data pengeluaran yang sudah dicatat pada sub-modul sebelumnya. Dalam setiap proyek konstruksi developer properti, di awal proyek sudah ditetapkan target anggaran untuk setiap pos biaya -- berapa maksimal yang boleh dibelanjakan untuk material, berapa untuk kontraktor, berapa untuk marketing, dan seterusnya. RAB adalah "peta anggaran" yang menjadi acuan pengendalian biaya sepanjang proyek berlangsung. Masalah yang sering terjadi tanpa sistem monitoring yang baik adalah "pembengkakan biaya yang tidak terdeteksi" -- di mana pengeluaran untuk satu pos sudah melampaui anggaran namun baru diketahui saat laporan keuangan akhir kuartal keluar, padahal solusinya sudah terlambat untuk diterapkan.

**Bagaimana alur kerja operasionalnya di sistem:**

**A. Empat Kartu KPI Global**

Di bagian paling atas, empat kartu menyajikan gambaran anggaran secara keseluruhan:

- **Total Anggaran (RAB)** -- Total nilai seluruh pos anggaran yang ditetapkan (Rp 6,2 miliar untuk 6 pos anggaran).
- **Total Realisasi** -- Total pengeluaran aktual yang sudah terjadi (Rp 3,89 miliar), beserta persentase serapan terhadap RAB total (62,8%).
- **Sisa Anggaran** -- Selisih antara RAB dan realisasi (Rp 2,31 miliar), atau berapa persen yang masih tersedia.
- **Pos Peringatan** -- Jumlah pos anggaran yang sudah menyerap lebih dari 80% dari RAB-nya (dalam contoh data: 2 pos).

**B. Progress Bar Realisasi Global**

Sebuah progress bar besar menampilkan persentase penyerapan anggaran secara keseluruhan -- misalnya 62.8% -- dengan warna bar yang berubah sesuai tingkat penyerapan:

- Hijau: penyerapan di bawah 60% (aman)
- Biru: penyerapan 60-79% (normal)
- Amber: penyerapan 80-89% (perlu perhatian)
- Merah: penyerapan 90% ke atas (darurat)

**C. Filter Tab Tiga Kondisi**

Pengguna dapat memfilter tampilan grid pos anggaran berdasarkan kondisi:

- **Semua** -- Menampilkan seluruh pos anggaran.
- **Peringatan** -- Hanya menampilkan pos yang penyerapannya sudah 80% atau lebih.
- **Aman** -- Hanya menampilkan pos yang penyerapannya di bawah 80%.

**D. Grid Kartu Per Pos Anggaran**

Setiap pos anggaran ditampilkan sebagai kartu tersendiri dalam layout dua kolom (desktop). Setiap kartu berisi:

- **Nama Pos** -- Judul pos anggaran (Struktur dan Pondasi, Material Bangunan, Perizinan dan Legal, Marketing dan Promosi, Operasional dan Gaji, Finishing dan Interior).
- **Badge Kategori** -- Badge berwarna yang mengklasifikasikan pos (Kontraktor, Material, Perizinan, Marketing, Operasional).
- **Badge Persentase** -- Persentase penyerapan ditampilkan di sudut kanan atas kartu dengan warna yang mencerminkan tingkat kritis.
- **Progress Bar** -- Bar horizontal yang secara visual menggambarkan proporsi realisasi terhadap RAB. Warna bar berubah sesuai tingkat penyerapan (hijau, biru, amber, merah).
- **Tiga Kolom Angka** -- RAB (target anggaran), Realisasi (aktual), dan Sisa (selisih).
- **Banner Peringatan Otomatis** -- Jika penyerapan sudah 90% ke atas, muncul banner merah: "Anggaran hampir habis! Perlu persetujuan untuk pengeluaran tambahan di pos ini." Jika penyerapan 80-89%, muncul banner amber: "Mendekati batas anggaran. Pantau pengeluaran di pos ini."

**E. Tabel Detail RAB vs Realisasi**

Di bawah grid kartu, terdapat tabel ringkasan yang menampilkan seluruh pos dalam format tabular untuk kemudahan perbandingan antar pos:

- Kolom: Pos, Kategori, Anggaran (RAB), Realisasi, Sisa, Progress (mini bar + persentase), dan Status (ikon centang hijau atau ikon peringatan amber).
- Tombol "Export Laporan" memungkinkan data diekspor untuk kebutuhan presentasi kepada Direktur atau bank.

**[SCREENSHOT: Halaman RAB dan Realisasi menampilkan 4 kartu KPI di atas, progress bar global besar di tengah bertuliskan "Progress Realisasi Global: 62.8%", diikuti 3 tombol filter tab (Semua, Peringatan, Aman), lalu grid 2 kolom berisi 6 kartu pos anggaran. Kartu "Perizinan & Legal" memiliki border amber dengan banner peringatan di bawah progress bar, kartu "Finishing & Interior" menampilkan progress bar hijau dengan realisasi hanya 24%, dan badge persentase di pojok kanan atas setiap kartu berwarna berbeda-beda sesuai kondisi]**

**Apa nilai urgensi dan dampak bisnisnya:**

Sub-modul RAB adalah alat pengendalian biaya proyek yang sangat kritis:

- **Pencegahan cost overrun** -- Banner peringatan otomatis saat penyerapan mencapai 80% memberikan waktu kepada manajemen untuk mengambil tindakan pencegahan sebelum anggaran benar-benar habis.
- **Dasar persetujuan pengeluaran tambahan** -- Jika suatu pos sudah melampaui RAB dan tim lapangan membutuhkan tambahan anggaran, data di halaman ini menjadi dokumen pendukung yang dibahas dalam rapat dengan Direktur.
- **Evaluasi efisiensi per pos** -- Perbandingan realisasi vs RAB memungkinkan analisis pos mana yang cenderung lebih hemat dari perkiraan (bisa menjadi patokan estimasi biaya proyek berikutnya) dan pos mana yang selalu overbudget (perlu revisi metodologi estimasi).
- **Transparansi kepada investor** -- Data RAB vs Realisasi yang tersaji rapi dan dapat diekspor meningkatkan kepercayaan investor atau mitra perbankan yang ingin melihat pengendalian biaya proyek.

---

## 3. Evaluasi dan Metrik Pencapaian Mingguan

### 3.1 Persentase Penyelesaian Modul Finance dan Accounting

| Sub-Komponen | Status | Estimasi Penyelesaian | Keterangan |
| :--- | :---: | :---: | :--- |
| Dashboard Keuangan (KPI + Navigasi) | Selesai | 100% | 4 kartu statistik dinamis + ringkasan panel |
| Halaman Tagihan (Tabel + Filter) | Selesai | 100% | Search, filter status dan tipe, tabel 8 kolom |
| Modal Detail Tagihan | Selesai | 100% | Dua kondisi: belum bayar dan lunas |
| Konfirmasi Lunas (Real-time Update) | Selesai | 100% | Status berubah instan, statistik ter-update |
| Area Chart Cashflow Trend | Selesai | 100% | Recharts AreaChart dengan tooltip kustom |
| Bar Chart Saldo Bersih | Selesai | 100% | Recharts BarChart dengan radius sudut |
| Tabel Detail Cashflow + Margin | Selesai | 100% | 5 kolom + indikator ikon tren |
| Alert Cashflow Negatif Otomatis | Selesai | 100% | Kondisional, muncul otomatis jika saldo negatif |
| Export PDF Button (UI) | Selesai | 80% | Tombol tersedia, fungsi export menunggu backend |
| Halaman Pengeluaran (Tabel + Filter) | Selesai | 100% | Search, filter kategori, 7 kolom tabel |
| Form Tambah Pengeluaran | Selesai | 100% | 6 field termasuk upload bukti |
| Kartu KPI Pengeluaran per Kategori | Selesai | 100% | 4 kartu: Total, Material, Kontraktor, Operasional |
| Halaman RAB & Realisasi | Selesai | 100% | Kartu KPI, progress bar global, filter tab |
| Grid Kartu Per Pos Anggaran | Selesai | 100% | 6 kartu dengan progress bar dan banner alert |
| Tabel Detail RAB vs Realisasi | Selesai | 100% | 7 kolom termasuk mini progress bar |
| Integrasi API Backend | Belum | 0% | Menunggu endpoint NestJS sprint berikutnya |

**Total Estimasi Fase Frontend Finance: ~95% selesai**

Angka 95% mencerminkan bahwa hampir seluruh antarmuka pengguna dan logika interaksi frontend telah selesai diimplementasikan. Sisa 5% terutama mencakup integrasi dengan backend API untuk persistensi data dan beberapa fitur export laporan yang membutuhkan server-side processing.

### 3.2 Progress Keseluruhan Platform SIMDP

| Aplikasi / Modul | Status | Progress |
| :--- | :---: | :---: |
| Web Admin -- Autentikasi dan RBAC | Selesai Fase Frontend | ~95% |
| Web Admin -- UI Shell (Sidebar dan Topbar) | Selesai | ~100% |
| Web Admin -- Modul Inventori | Selesai Fase Frontend | ~90% |
| Web Admin -- Modul CRM dan Sales | Selesai Fase Frontend | ~90% |
| Web Admin -- Modul Finance | Selesai Fase Frontend | ~95% |
| Web Admin -- Modul Legal | In Progress | ~55% |
| Web Admin -- Modul Monitoring Proyek | In Progress | ~30% |
| Backend NestJS + Prisma | Struktur folder | ~10% |
| Website Marketing Publik | Belum dimulai | 0% |
| Customer Portal | Belum dimulai | 0% |
| Mobile App (Lapangan) | In Progress | ~40% |

### 3.3 Kendala Operasional dan Solusi yang Diterapkan

**Kendala 1 -- Visualisasi Data Keuangan dengan Library Recharts:**

- **Masalah:** Library Recharts membutuhkan konfigurasi tambahan untuk menampilkan tooltip dengan format Rupiah yang benar, karena format Intl.NumberFormat bawaan Indonesia perlu diintegrasikan ke dalam callback kustom Recharts.
- **Solusi:** Membuat komponen Tooltip kustom yang memanggil fungsi `formatRupiah()` yang sudah tersedia di `keuangan-data.ts`, sehingga tampilan angka di grafik konsisten dengan format di seluruh halaman.

**Kendala 2 -- Real-time Update Statistik Setelah Konfirmasi Pembayaran:**

- **Masalah:** Setelah tombol "Konfirmasi Lunas" diklik, kartu KPI di header halaman harus ter-update secara instan tanpa refresh. Ini memerlukan manajemen state yang cermat karena ada 3 nilai yang harus diperbarui secara bersamaan (totalBelumBayar, totalLunas, dan status tagihan di tabel).
- **Solusi:** Menggunakan `useState` pada level komponen halaman untuk menyimpan array tagihan sebagai local state. Fungsi `handleKonfirmasiPembayaran` memperbarui state dengan cara memetakan seluruh array dan memodifikasi hanya objek tagihan yang relevan, memicu re-render menyeluruh yang secara otomatis menghitung ulang semua nilai KPI.

**Kendala 3 -- Sistem Warna Dinamis Berdasarkan Persentase RAB:**

- **Masalah:** Progress bar dan badge persentase di halaman RAB perlu menampilkan warna berbeda (hijau, biru, amber, merah) berdasarkan nilai persentase, dan logika ini harus konsisten antara tampilan kartu grid dan tabel detail.
- **Solusi:** Membuat tiga fungsi helper terpusat (`getStatusColor`, `getStatusIcon`, `getProgressColor`) yang masing-masing menerima nilai persentase sebagai parameter dan mengembalikan class CSS yang sesuai, memastikan konsistensi tampilan di seluruh komponen.

### 3.4 KPI Sprint Minggu ke-9

| KPI | Target | Realisasi | Status |
| :--- | :---: | :---: | :---: |
| Sub-halaman Finance selesai (UI) | 4 halaman | 5 halaman (termasuk dashboard) | Melampaui target |
| Grafik interaktif (Recharts) | 1 grafik | 2 grafik (Area + Bar Chart) | Melampaui target |
| Form modal fungsional | 2 modal | 2 modal (Tagihan detail + Tambah Pengeluaran) | Tercapai |
| Real-time update setelah validasi | Ya | Ya (useState terpusat) | Tercapai |
| Alert otomatis RAB | Ya | Ya (kondisional 80% dan 90%) | Tercapai |
| Design system konsisten | Amber/Zinc | Teraplikasi penuh | Tercapai |
| Bug critical | 0 | 0 | Aman |
| TypeScript type check | Pass | Pass | Tercapai |

---

## 4. Rencana Tindak Lanjut (Next Sprint Planning -- Minggu ke-10)

Dengan selesainya Modul Finance pada minggu ke-9, tiga modul utama yang membentuk inti operasional perusahaan -- Inventori, CRM, dan Finance -- kini telah selesai dibangun pada lapisan antarmuka. Data mengalir secara konseptual dari produk (Inventori) ke transaksi (CRM) ke pengelolaan uang (Finance). Pada sprint minggu ke-10, pengembangan akan bergerak ke Modul Legal dan Perizinan yang merupakan fondasi hukum dari seluruh transaksi properti.

**Prioritas 1 -- Penyelesaian Modul Legal dan Perizinan:**

Sprint minggu ke-10 akan melanjutkan dan menyempurnakan Modul Legal yang sudah memiliki fondasi awal. Pekerjaan yang direncanakan:

- Melengkapi Tab "Dokumen Induk" dengan fungsi tambah dokumen perizinan baru (modal form dengan field nama dokumen, instansi, nomor surat, tanggal terbit, dan tanggal expired).
- Memperkaya Tab "Legalitas Unit" dengan kemampuan update status per tahap (PPJB, Pecah Sertifikat, AJB, BBN) secara langsung dari antarmuka -- saat ini tabel masih read-only.
- Menambahkan notifikasi visual untuk dokumen yang akan expired dalam 30 hari atau kurang.
- Menyempurnakan logika keterhubungan antara modul Legal dan data pembeli di modul CRM.

**Prioritas 2 -- Inisiasi Modul Monitoring Proyek (Pengawas Lapangan):**

Selain Legal, sprint ke-10 juga akan mulai membangun antarmuka untuk Modul Monitoring Proyek yang diperuntukkan bagi Pengawas Lapangan. Fitur yang akan dibangun:

- Dashboard milestone konstruksi per unit/blok.
- Formulir update progress pekerjaan (fondasi, struktur, atap, finishing) beserta persentase penyelesaian.
- Galeri foto lapangan dengan sistem upload per checkpoint.

---

*Dokumen: progress-report-minggu-9-finance.md*  
*Dibuat: 21 Mei 2026*  
*Bagian dari: Dokumentasi Tugas Akhir -- Ekosistem Digital Properti Terpadu*
