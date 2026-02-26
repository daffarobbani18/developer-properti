# Draf Rancangan Sistem Informasi Manajemen Developer Perumahan (SIMDP)

> Dokumen ini menjelaskan rancangan lengkap sistem terintegrasi untuk developer perumahan,
> mencakup seluruh modul, penjelasan istilah, fitur detail, dan alur kerja masing-masing modul.

---

## Daftar Isi

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Modul 1 — CRM & Sales Management](#modul-1--crm--sales-management)
3. [Modul 2 — Marketing & Media](#modul-2--marketing--media)
4. [Modul 3 — Legal & Perizinan](#modul-3--legal--perizinan)
5. [Modul 4 — Project Management & Konstruksi](#modul-4--project-management--konstruksi)
6. [Modul 5 — Procurement & Gudang](#modul-5--procurement--gudang)
7. [Modul 6 — Keuangan & Cashflow](#modul-6--keuangan--cashflow)
8. [Modul 7 — Customer Portal](#modul-7--customer-portal)
9. [Modul 8 — QA/QC & Handover](#modul-8--qaqc--handover)
10. [Modul 9 — After-Sales & Estate Management](#modul-9--after-sales--estate-management)
11. [Modul 10 — Executive Dashboard](#modul-10--executive-dashboard)
12. [Ringkasan Aplikasi](#ringkasan-aplikasi)
13. [Prioritas Implementasi](#prioritas-implementasi)

---

## 1. Gambaran Umum Sistem

Sistem Informasi Manajemen Developer Perumahan (SIMDP) adalah platform digital terintegrasi yang dirancang untuk membantu perusahaan developer perumahan mengelola seluruh proses bisnisnya — mulai dari pemasaran dan penjualan unit rumah, pengawasan pembangunan, pengelolaan keuangan, hingga layanan purna jual kepada warga.

### Mengapa Sistem Ini Dibutuhkan?

Tanpa sistem yang terintegrasi, developer perumahan biasanya menghadapi masalah-masalah berikut:

- Data calon pembeli tersebar di WhatsApp, Excel, buku catatan — mudah hilang dan tidak terorganisir
- Tidak bisa memantau progres pembangunan secara real-time dari kantor
- Keuangan proyek tidak terkontrol, sering kali overbudget baru diketahui setelah terlambat
- Pembeli sering menghubungi CS hanya untuk tanya "rumah saya sudah sampai mana?"
- Dokumen perizinan hilang atau habis masa berlaku tanpa ada yang menyadari
- Laporan untuk pimpinan harus dikumpulkan manual dari berbagai divisi — lambat dan tidak akurat

### Struktur Aplikasi

Sistem ini terdiri dari **4 aplikasi** yang saling terhubung:

| No | Nama Aplikasi | Jenis | Digunakan Oleh |
|----|---------------|-------|----------------|
| 1 | Web Admin (Back Office) | Website (browser) | Tim internal: sales, finance, manajer proyek, direksi |
| 2 | Mobile Lapangan | Aplikasi HP (Android/iOS) | Mandor, site engineer, petugas inspeksi |
| 3 | Customer Portal | Website + Aplikasi HP | Pembeli rumah dan warga perumahan |
| 4 | Website Marketing | Website publik | Masyarakat umum / calon pembeli |

---

## Modul 1 — CRM & Sales Management
### "Sistem Pencatatan & Pengelolaan Calon Pembeli"

### Apa Itu CRM?

**CRM** singkatan dari **Customer Relationship Management**, yang dalam bahasa Indonesia berarti **Sistem Pengelolaan Hubungan dengan Pelanggan**. Intinya adalah sistem untuk mencatat, memantau, dan mengelola semua interaksi dengan calon pembeli — dari pertama kali mereka tertarik hingga akhirnya menandatangani akad jual beli.

Bayangkan ada 100 orang yang tertarik beli rumah di perumahan kita. Mereka datang dari berbagai tempat — ada yang nanya lewat WhatsApp, ada yang lihat di Instagram, ada yang datang ke pameran properti.

### Masalah yang Diselesaikan

Tanpa sistem CRM, sales (tim penjualan) developer biasanya:
- Mencatat data calon pembeli di HP masing-masing atau Excel
- Lupa menghubungi kembali calon pembeli yang sudah survey
- Tidak tahu calon pembeli mana yang paling potensial untuk ditindaklanjuti
- Ketika sales mengundurkan diri, semua data calon pembeli ikut hilang
- Tidak ada laporan yang jelas berapa banyak calon pembeli yang masuk setiap bulan

### Alur Kerja (Pipeline Penjualan)

**Pipeline** adalah jalur atau tahapan yang dilalui calon pembeli dari pertama kali tertarik hingga akhirnya membeli. Berikut tahapannya:

```
[LEADS] → [FOLLOW-UP] → [SURVEY LOKASI] → [NEGOSIASI] → [BOOKING] → [SPK] → [KPR/AKAD]
```

**Penjelasan setiap tahap:**

1. **Leads** — Calon pembeli yang baru menunjukkan ketertarikan (nanya via WhatsApp, isi form di website, datang ke pameran). Belum tentu jadi beli.
2. **Follow-up** — Sales menghubungi leads untuk memberikan informasi lebih lanjut, mengajak survey ke lokasi, atau menjawab pertanyaan.
3. **Survey Lokasi** — Calon pembeli datang langsung melihat lokasi perumahan dan unit yang ditawarkan.
4. **Negosiasi** — Proses tawar-menawar harga, diskusi skema pembayaran (KPR atau tunai), dan pemilihan unit/kavling.
5. **Booking** — Calon pembeli membayar uang tanda jadi (biasanya Rp 1–5 juta) untuk "memesan" unit tertentu agar tidak diambil orang lain.
6. **SPK (Surat Pesanan/Pemesanan Kavling)** — Surat perjanjian awal antara pembeli dan developer yang menyatakan unit mana yang dipesan, berapa harganya, dan skema pembayarannya.
7. **KPR / Akad** — Tahap final:
   - Jika bayar KPR: pembeli mengajukan kredit ke bank, bank membayar developer, pembeli mencicil ke bank
   - Jika tunai: pembeli melunasi langsung ke developer
   - **Akad** = penandatanganan perjanjian jual beli resmi di hadapan notaris/PPAT

### Fitur Detail Modul CRM

**A. Manajemen Leads**
- Form pendaftaran terintegrasi dengan website, WhatsApp, dan media sosial
- Setiap leads otomatis tercatat dengan sumber asalnya (dari mana dia tahu perumahan ini)
- Notifikasi ke sales ketika ada leads baru masuk
- Leads bisa didistribusikan otomatis ke sales tertentu berdasarkan area atau giliran

**B. Pipeline Visual**
- Tampilan papan (seperti Kanban/Trello) yang menampilkan semua calon pembeli per tahap
- Drag-and-drop untuk pindahkan calon pembeli ke tahap berikutnya
- Warna berbeda untuk calon pembeli yang sudah lama tidak ditindaklanjuti

**C. Reminder & Notifikasi Otomatis**
- Sistem mengingatkan sales: "Budi Santoso belum dihubungi selama 3 hari"
- Notifikasi jatuh tempo dokumen atau janji temu
- Pengiriman pesan WhatsApp/email otomatis untuk follow-up

**D. Histori Komunikasi**
- Semua WhatsApp, telepon, email, dan pertemuan dengan calon pembeli tercatat
- Sales baru bisa langsung tahu riwayat komunikasi sebelumnya tanpa harus bertanya ke rekan

**E. Manajemen Unit & Kavling**
- Denah perumahan interaktif — klik kavling untuk lihat status (tersedia/dipesan/terjual)
- Info detail per unit: luas tanah, luas bangunan, harga, tipe rumah

**F. Komisi Agen**
- Rekap otomatis komisi agen properti eksternal berdasarkan unit yang berhasil dijual
- Laporan pembayaran komisi per periode

**G. Laporan Sales**
- Jumlah leads masuk per bulan
- Tingkat konversi (dari 100 leads, berapa yang jadi pembeli)
- Performa per sales: siapa yang paling produktif
- Proyeksi penjualan bulan depan
---

## Modul 2 — Marketing & Media
### "Sistem Pemasaran Digital"

### Penjelasan Umum

Modul ini adalah sistem untuk mengelola semua kegiatan pemasaran dan promosi perumahan secara digital. Tujuannya bukan hanya menarik calon pembeli sebanyak-banyaknya, tapi juga **mengukur efektivitas setiap kegiatan promosi** agar anggaran marketing tidak terbuang sia-sia.

### Istilah Penting

- **Landing Page** — Halaman website khusus untuk satu proyek perumahan. Berisi informasi lengkap, foto, harga, dan form pendaftaran.
- **ROI (Return on Investment)** — Ukuran seberapa menguntungkan sebuah investasi iklan. Contoh: keluar Rp 10 juta untuk iklan Facebook, berapa pembeli yang didapat?
- **Leads Tracking** — Sistem pelacakan asal-usul setiap calon pembeli. Contoh: si A dari Instagram, si B dari Google, si C dari pameran.
- **Virtual Tour** — Tur keliling rumah secara virtual menggunakan teknologi 360 derajat, calon pembeli bisa "melihat" rumah dari layar HP/laptop tanpa harus datang ke lokasi.
- **KPR (Kredit Pemilikan Rumah)** — Skema pembelian rumah di mana pembeli mencicil lewat bank.
- **CPL (Cost Per Lead)** — Biaya yang dikeluarkan untuk mendapatkan 1 calon pembeli. Misalnya: iklan habis Rp 5 juta, menghasilkan 50 leads → CPL = Rp 100.000.

### Masalah yang Diselesaikan

- Developer pasang iklan di Google, Facebook, Instagram — tapi tidak tahu iklan mana yang menghasilkan pembeli
- Habis uang banyak untuk iklan tapi tidak bisa diukur hasilnya
- Website perumahan statis, tidak ada interaksi dengan calon pembeli

### Fitur Detail

**A. Landing Page Per Proyek**
- Halaman web menarik khusus untuk setiap perumahan yang dikembangkan
- Berisi: deskripsi lokasi, tipe rumah, harga, fasilitas kawasan, galeri foto, denah rumah
- Form pendaftaran yang terhubung langsung ke modul CRM
- Tombol WhatsApp langsung terhubung ke tim sales

**B. Galeri & Virtual Tour**
- Upload foto eksterior, interior, fasilitas kawasan
- Virtual tour 360 derajat untuk rumah contoh
- Video profil proyek perumahan

**C. Simulasi KPR Online**
- Calon pembeli bisa hitung estimasi cicilan KPR sendiri
- Input: harga rumah, uang muka (DP), tenor (lama cicilan), suku bunga
- Output: estimasi cicilan per bulan
- Tampil otomatis rekomendasi bank partner

**D. Tracking Sumber Leads**
- Setiap iklan (Google Ads, Facebook/Instagram Ads, Rumah123, OLX) diberi kode unik
- Laporan: "Dari 50 leads bulan ini, 20 dari Instagram, 15 dari Google, 10 dari Rumah123, 5 dari pameran"

**E. Analitik Kampanye**
- Dashboard performa semua kampanye iklan dalam satu layar
- Biaya per leads (CPL) dan biaya per penjualan otomatis terhitung

**F. Manajemen Konten**
- Jadwal posting media sosial (Instagram, Facebook, TikTok)
- Template desain untuk brosur digital dan konten promosi
- Arsip semua materi iklan
---

## Modul 3 — Legal & Perizinan
### "Sistem Pengelolaan Dokumen Izin"

### Penjelasan Umum

Developer perumahan wajib mengurus sangat banyak dokumen legal dan izin dari pemerintah sebelum dan selama proyek berjalan. Modul ini memastikan tidak ada dokumen yang terlewat, hilang, atau habis masa berlakunya.

### Istilah Penting

- **PBG (Persetujuan Bangunan Gedung)** — Izin resmi dari pemerintah daerah untuk mendirikan bangunan. Menggantikan IMB sejak 2021. Wajib ada sebelum mulai konstruksi.
- **IMB (Izin Mendirikan Bangunan)** — Sebutan lama dari PBG. Masih banyak developer yang menggunakan istilah ini.
- **Site Plan** — Gambar denah keseluruhan kawasan perumahan (tata letak rumah, jalan, fasilitas) yang sudah disetujui dinas tata ruang.
- **AMDAL (Analisis Mengenai Dampak Lingkungan)** — Kajian resmi tentang dampak proyek terhadap lingkungan sekitar. Wajib untuk proyek skala besar.
- **UKL-UPL** — Versi lebih sederhana dari AMDAL untuk proyek skala menengah.
- **BPN (Badan Pertanahan Nasional)** — Lembaga pemerintah yang mengurus sertifikat tanah.
- **SHM (Sertifikat Hak Milik)** — Bukti kepemilikan tanah yang paling kuat secara hukum. Ini yang diberikan ke pembeli setelah lunas.
- **HGB (Hak Guna Bangunan)** — Hak mendirikan bangunan di atas tanah untuk jangka waktu tertentu (biasanya 30 tahun). Developer sering pakai ini dulu, lalu diubah ke SHM untuk pembeli.
- **Notaris/PPAT (Pejabat Pembuat Akta Tanah)** — Pejabat resmi yang berwenang membuat akta jual beli tanah/bangunan secara hukum.
- **Due Diligence** — Proses pemeriksaan menyeluruh terhadap legalitas suatu lahan sebelum dibeli.

### Masalah yang Diselesaikan

- Dokumen izin tersebar di berbagai folder, susah dicari
- Izin ada masa berlakunya — kalau lupa perpanjang, proyek bisa kena masalah hukum
- Tidak tahu sudah di tahap mana proses pengurusan izinnya

### Fitur Detail

**A. Repositori Dokumen Digital**
- Semua dokumen legal discan dan disimpan di sistem (tidak lagi dalam map fisik yang mudah hilang)
- Kategorisasi dokumen: per proyek, per tipe izin
- Pencarian dokumen cepat berdasarkan nama, nomor dokumen, atau tanggal

**B. Tracker Status Perizinan**
- Tampilan status setiap izin: Belum Diajukan → Sedang Diproses → Sudah Terbit → Perlu Perpanjangan
- Catatan per izin: sudah diajukan ke instansi mana, tanggal pengajuan, estimasi selesai
- Penanggungjawab per dokumen

**C. Notifikasi Masa Berlaku**
- Sistem otomatis mengirim peringatan:
  - 90 hari sebelum izin habis masa berlaku
  - 30 hari sebelum habis (peringatan kedua)
  - 7 hari sebelum habis (peringatan darurat)
- Notifikasi dikirim via email dan aplikasi

**D. Checklist Perizinan Per Proyek**
- Template checklist standar dokumen yang dibutuhkan untuk satu proyek perumahan
- Progress persentase: "Proyek A — Perizinan 70% lengkap"

**E. Manajemen Vendor Legal**
- Data notaris, pengacara, dan konsultan perizinan yang digunakan
- Histori pekerjaan dan biaya per vendor
---

## Modul 4 — Project Management & Konstruksi
### "Sistem Pengawasan Pembangunan"

### Penjelasan Umum

Modul ini adalah sistem untuk merencanakan, memantau, dan mengendalikan jalannya pembangunan perumahan dari awal konstruksi hingga rumah siap diserahkan ke pembeli.

### Istilah Penting

- **RAB (Rencana Anggaran Biaya)** — Daftar rincian biaya yang dibutuhkan untuk membangun proyek, dibuat sebelum konstruksi dimulai. Menjadi acuan batas pengeluaran.
- **Milestone** — Titik pencapaian penting dalam jadwal proyek. Contoh: "Pondasi selesai", "Struktur selesai", "Finishing selesai".
- **S-Curve** — Grafik berbentuk huruf S yang menggambarkan kemajuan pekerjaan (%) terhadap waktu. Digunakan untuk membandingkan progres rencana vs realisasi.
- **Deviasi** — Perbedaan antara rencana dan realisasi. Contoh: "Deviasi -10%" artinya proyek terlambat 10% dari rencana.
- **Subkontraktor** — Perusahaan/individu yang dikontrak untuk mengerjakan bagian tertentu dari proyek (misal: khusus instalasi listrik, atau khusus pekerjaan atap).
- **Mandor** — Kepala/pengawas lapangan yang memimpin kelompok pekerja konstruksi.
- **MEP (Mechanical, Electrical, Plumbing)** — Pekerjaan instalasi mekanikal (ventilasi), elektrikal (listrik), dan plumbing (pipa air bersih/kotor).
- **K3 (Kesehatan dan Keselamatan Kerja)** — Standar keselamatan yang wajib diterapkan di lokasi konstruksi (helm, sepatu safety, jaring pengaman, dll.).
- **VO (Variation Order)** — Perubahan pekerjaan dari kontrak asal. Misalnya pembeli minta ubah desain kamar mandi — ini menghasilkan VO yang mempengaruhi biaya dan jadwal.
- **Site Engineer** — Insinyur teknik yang bertugas mengawasi dan memastikan pembangunan di lapangan sesuai gambar dan spesifikasi teknis.
- **Real-time** — Data yang diperbarui secara langsung/instan, sehingga apa yang ditampilkan adalah kondisi terkini.

### Masalah yang Diselesaikan

- Manajer proyek di kantor tidak tahu kondisi di lapangan secara real-time
- Jadwal meleset tapi baru ketahuan setelah telat berminggu-minggu
- Laporan progres dibuat manual di Word/Excel, lambat dan sering tidak akurat
- Kalau ada masalah di lapangan, pelaporan lambat sampai ke atasan

### Fitur Detail

**A. Manajemen Jadwal (Timeline/Gantt Chart)**
- Pembuatan jadwal proyek dengan Gantt Chart (diagram batang waktu)
- Penentuan milestone dan hubungan antar pekerjaan
- Update jadwal aktual vs rencana secara real-time

**B. Laporan Progres Harian**
- Form digital di aplikasi mobile untuk mandor/site engineer
- Upload foto progres langsung dari lokasi proyek
- Isi laporan: pekerjaan hari ini, jumlah pekerja hadir, kendala yang dihadapi
- Sistem otomatis merangkum laporan harian menjadi laporan mingguan dan bulanan

**C. Dashboard Progres Visual**
- Denah kawasan perumahan interaktif
- Status per unit: Belum Mulai (merah) → Sedang Dibangun (kuning) → Selesai (hijau)
- S-Curve otomatis: grafik rencana vs realisasi progres keseluruhan

**D. Manajemen Tenaga Kerja**
- Daftar kontraktor, subkontraktor, dan mandor per proyek
- Jadwal kehadiran pekerja
- Evaluasi kinerja kontraktor

**E. Kontrol Anggaran Konstruksi**
- Perbandingan RAB vs realisasi biaya per item pekerjaan
- Alert ketika biaya mendekati atau melebihi anggaran
- Histori perubahan anggaran (VO)

**F. Manajemen Issue/Kendala**
- Pelaporan masalah lapangan (material kurang, alat rusak, cuaca buruk, dll.)
- Eskalasi otomatis ke pihak terkait
- Tracking penyelesaian setiap masalah
---

## Modul 5 — Procurement & Gudang
### "Sistem Pembelian Material & Stok"

### Penjelasan Umum

Modul ini mengelola seluruh proses pengadaan (pembelian) material dan peralatan untuk konstruksi, mulai dari pemilihan vendor/supplier, proses pemesanan, penerimaan barang, hingga pengelolaan stok di gudang.

### Istilah Penting

- **Procurement** — Proses pengadaan barang/jasa yang dibutuhkan perusahaan, mulai dari perencanaan kebutuhan hingga pembayaran ke supplier.
- **Vendor/Supplier** — Perusahaan atau individu yang menyediakan/menjual material atau jasa kepada developer.
- **PO (Purchase Order)** — Surat pesanan resmi dari developer ke supplier yang berisi: jenis barang, jumlah, harga, dan tanggal pengiriman. Dokumen ini mengikat kedua belah pihak secara hukum.
- **Tender** — Proses meminta penawaran harga dari beberapa vendor sekaligus untuk mendapatkan harga dan kualitas terbaik.
- **GR (Good Receipt)** — Bukti bahwa barang yang dipesan sudah diterima di gudang, sesuai jenis dan jumlahnya.
- **Stok Opname** — Kegiatan menghitung dan mencocokkan jumlah fisik barang di gudang dengan catatan di sistem.
- **Buffer Stock** — Stok cadangan minimum yang harus selalu tersedia di gudang agar pembangunan tidak terhenti.
- **Approval (Persetujuan)** — Proses di mana atasan menyetujui atau menolak sebuah pengajuan pembelian sebelum dilaksanakan.

### Masalah yang Diselesaikan

- Material datang terlambat → pembangunan terhenti → jadwal mundur
- Pembelian material tidak terkontrol → harga beli mahal karena tidak ada negosiasi
- Stok di gudang tidak tercatat → beli material dobel, boros anggaran
- Supplier kirim barang kurang/kualitas jelek, tidak ada bukti untuk komplain

### Fitur Detail

**A. Manajemen Vendor**
- Database semua vendor/supplier beserta kontak, produk, dan rekam jejak kinerja
- Penilaian vendor: ketepatan waktu, kualitas barang, harga
- Blacklist vendor bermasalah

**B. Proses Pengadaan**
- Pengajuan kebutuhan material dari lapangan
- Persetujuan berjenjang: kepala lapangan → manajer proyek → finance → direktur (sesuai nilai)
- Proses tender digital untuk pengadaan senilai di atas batas tertentu

**C. Purchase Order (PO)**
- Pembuatan PO digital yang terstandar
- Status PO: Draft → Disetujui → Dikirim ke Supplier → Sebagian Diterima → Lunas

**D. Penerimaan Barang (GR)**
- Petugas gudang konfirmasi penerimaan barang via mobile
- Foto bukti penerimaan
- Sistem otomatis bandingkan barang yang diterima vs yang dipesan di PO
- Laporan ketidaksesuaian (barang kurang, rusak, salah spesifikasi)

**E. Manajemen Stok Gudang**
- Stok real-time per material per gudang/proyek
- Notifikasi ketika stok di bawah batas minimum
- Riwayat masuk-keluar material

**F. Rekap Pengeluaran**
- Total pembelian per vendor, per kategori material, per proyek
- Analisis tren harga material
---

## Modul 6 — Keuangan & Cashflow
### "Sistem Keuangan Proyek"

### Penjelasan Umum

Ini adalah modul paling kritis dalam bisnis developer perumahan. Banyak proyek perumahan gagal bukan karena tidak ada pembeli, tapi karena pengelolaan keuangan yang buruk — cashflow habis di tengah jalan, konstruksi terhenti, dan akhirnya proyek mangkrak (terbengkalai).

### Istilah Penting

- **Cashflow** — Aliran uang masuk dan keluar dalam periode tertentu. Cashflow positif = lebih banyak uang masuk daripada keluar. Cashflow negatif = pengeluaran lebih besar dari pemasukan, berbahaya bagi kelangsungan bisnis.
- **KPR (Kredit Pemilikan Rumah)** — Pinjaman dari bank untuk pembeli membeli rumah. Bank membayar developer lunas, pembeli mencicil ke bank.
- **FLPP (Fasilitas Likuiditas Pembiayaan Perumahan)** — Program KPR subsidi dari pemerintah untuk masyarakat berpenghasilan rendah. Cicilan lebih murah karena ada subsidi bunga.
- **DP (Down Payment / Uang Muka)** — Pembayaran pertama yang dilakukan pembeli, biasanya 10–30% dari harga rumah.
- **Kredit Konstruksi** — Pinjaman dari bank khusus untuk membiayai pembangunan proyek. Berbeda dengan KPR pembeli.
- **AR (Account Receivable / Piutang)** — Uang yang seharusnya kita terima tapi belum dibayar. Contoh: pembeli yang menunggak cicilan.
- **AP (Account Payable / Hutang Usaha)** — Uang yang harus kita bayar ke pihak lain. Contoh: tagihan dari kontraktor yang belum dibayar.
- **Retensi** — Sebagian pembayaran ke kontraktor yang sengaja ditahan (biasanya 5%) sampai masa pemeliharaan selesai, sebagai jaminan pekerjaan sudah benar.
- **Laba Rugi (P&L)** — Laporan keuangan yang menunjukkan apakah bisnis menghasilkan keuntungan atau kerugian dalam periode tertentu.
- **BEP (Break Even Point)** — Titik impas, yaitu kondisi di mana pendapatan sudah cukup untuk menutup semua biaya (belum untung, belum rugi).
- **Overbudget** — Kondisi di mana biaya aktual melebihi anggaran yang sudah direncanakan.
- **Mangkrak** — Istilah populer untuk proyek yang terbengkalai/berhenti di tengah jalan karena kehabisan dana.

### Masalah yang Diselesaikan

- Developer tidak tahu persis berapa uang yang tersisa untuk bangun rumah
- Pembeli menunggak cicilan tapi tidak ada sistem pengingat otomatis
- Biaya konstruksi membengkak jauh dari rencana, baru ketahuan setelah parah
- Bank cair KPR pembeli tapi tidak tercatat dengan baik

### Fitur Detail

**A. Budget Proyek**
- Input anggaran (RAB) per proyek saat awal
- Pemecahan budget per kategori: biaya tanah, perizinan, konstruksi, marketing, operasional
- Update realisasi biaya secara berkala
- Alert ketika realisasi mendekati/melebihi budget

**B. Manajemen Pendapatan Penjualan**
- Rekap semua unit yang sudah terjual beserta harga dan skema pembayaran
- Status pembayaran per pembeli: DP sudah, cicilan bulan berapa, KPR sudah cair belum
- Notifikasi otomatis untuk cicilan yang jatuh tempo
- Pencatatan pembayaran masuk

**C. Tagihan & Pembayaran ke Vendor/Kontraktor**
- Tagihan dari kontraktor/supplier masuk ke sistem untuk diproses
- Persetujuan pembayaran berjenjang
- Tracking status pembayaran: Menunggu Persetujuan → Disetujui → Sudah Dibayar
- Rekap hutang usaha (AP) yang belum dibayar

**D. Integrasi KPR Bank**
- Notifikasi dari bank ketika KPR pembeli sudah disetujui
- Pencatatan pencairan dana KPR dari bank ke developer
- Monitoring status pengajuan KPR per pembeli

**E. Dashboard Cashflow**
- Proyeksi cashflow bulan ini, 3 bulan ke depan, 6 bulan ke depan
- Grafik uang masuk vs uang keluar per bulan
- Alert dini ketika proyeksi cashflow menunjukkan potensi defisit

**F. Laporan Keuangan**
- Laporan Laba Rugi per proyek
- Laporan Cashflow aktual
- Laporan piutang (siapa yang menunggak, berapa lama)
- Export ke format Excel/PDF
---

## Modul 7 — Customer Portal
### "Aplikasi Khusus untuk Pembeli Rumah"

### Penjelasan Umum

Customer Portal adalah aplikasi khusus yang bisa diakses oleh pembeli rumah untuk memantau semua hal terkait pembelian dan pembangunan unit mereka secara mandiri — tanpa perlu menghubungi CS setiap kali ingin tahu informasi terbaru.

### Istilah Penting

- **CS (Customer Service)** — Tim layanan pelanggan yang bertugas menjawab pertanyaan dan keluhan pembeli.
- **Portal** — Pintu masuk digital (website/aplikasi) yang memberikan akses ke berbagai informasi dan layanan untuk pengguna tertentu.
- **Login** — Proses masuk ke sistem menggunakan username dan password.
- **Notifikasi Push** — Pesan yang muncul di layar HP walaupun aplikasinya tidak sedang dibuka.
- **Transparansi** — Keterbukaan informasi, sehingga pembeli bisa tahu kondisi sebenarnya tanpa harus bertanya.

### Masalah yang Diselesaikan

- Pembeli sering nelpon/WA tanya "rumah saya sudah sampai mana?"
- CS developer kewalahan menjawab pertanyaan yang sama berulang-ulang
- Dokumen penting (surat akad, sertifikat) sering hilang di pembeli
- Jadwal serah terima berubah tapi pembeli tidak diberitahu

### Fitur Detail

**A. Akun Pribadi Pembeli**
- Setiap pembeli mendapat username dan password untuk login
- Profil pembeli: data diri, data unit yang dibeli, data KPR
- Keamanan: verifikasi dua langkah (two-factor authentication)

**B. Progres Pembangunan**
- Foto pembangunan unit milik pembeli, diupdate secara berkala oleh tim lapangan
- Persentase progres penyelesaian
- Timeline: kapan pondasi selesai, kapan struktur selesai, estimasi selesai keseluruhan
- Notifikasi push/email setiap ada update progres

**C. Riwayat & Tagihan Pembayaran**
- Semua transaksi pembayaran tercatat: tanggal, jumlah, metode
- Tagihan berikutnya: berapa yang harus dibayar, kapan jatuh temponya
- Unduh bukti pembayaran dan kwitansi

**D. Dokumen Digital**
- Unduh semua dokumen penting kapan saja:
  - SPK (Surat Pesanan Kavling)
  - Akad Jual Beli
  - Sertifikat (SHM) setelah selesai proses
  - PBG/IMB
  - Bukti serah terima (BAST)

**E. Pengajuan Komplain & Permintaan**
- Form pengajuan komplain digital dengan kategori (kerusakan bangunan, dokumen, pembayaran, dll.)
- Nomor tiket untuk setiap komplain
- Status penanganan: Diterima → Sedang Ditangani → Selesai
- History semua komplain yang pernah diajukan

**F. Notifikasi & Pengumuman**
- Notifikasi real-time untuk informasi penting dari developer
- Pengumuman jadwal serah terima, perubahan jadwal, info terbaru perumahan
---

## Modul 8 — QA/QC & Handover
### "Sistem Inspeksi & Serah Terima Rumah"

### Penjelasan Umum

Sebelum rumah diserahkan ke pembeli, harus ada proses pemeriksaan kualitas yang ketat. Modul ini mengelola seluruh proses inspeksi, pencatatan cacat bangunan, perbaikan, hingga serah terima kunci secara resmi.

### Istilah Penting

- **QA (Quality Assurance)** — Proses memastikan standar kualitas diterapkan sejak awal selama proses pembangunan. Sifatnya preventif (mencegah masalah terjadi).
- **QC (Quality Control)** — Proses memeriksa hasil pekerjaan untuk menemukan apakah ada yang tidak sesuai standar. Sifatnya detektif (menemukan masalah yang sudah terjadi).
- **Defect / Cacat** — Kerusakan atau ketidaksesuaian pada bangunan yang harus diperbaiki sebelum diserahkan ke pembeli. Contoh: dinding retak, cat mengelupas, pintu tidak bisa dikunci, atap bocor.
- **Punch List / Defect List** — Daftar lengkap semua cacat/kerusakan yang ditemukan saat inspeksi dan harus diperbaiki.
- **Handover** — Proses penyerahan kunci dan kepemilikan rumah dari developer ke pembeli.
- **BAST (Berita Acara Serah Terima)** — Dokumen resmi yang ditandatangani kedua belah pihak sebagai bukti bahwa rumah sudah diserahkan dan diterima dalam kondisi yang disepakati.
- **Garansi Bangunan** — Jaminan dari developer bahwa jika ada kerusakan struktural dalam periode tertentu (biasanya 1 tahun), developer siap memperbaiki dengan biaya sendiri.
- **SLA (Service Level Agreement)** — Kesepakatan batas waktu penanganan. Contoh: "semua cacat cat wajib diperbaiki maksimal 7 hari setelah dilaporkan".
- **E-Signature (Tanda Tangan Digital)** — Tanda tangan yang dilakukan secara digital lewat HP atau tablet, memiliki kekuatan hukum yang sama dengan tanda tangan fisik.

### Masalah yang Diselesaikan

- Daftar kerusakan dicatat di kertas, mudah hilang
- Perbaikan tidak ada yang pantau — kadang sudah lama tapi belum dikerjakan
- Saat serah terima, pembeli komplain ada yang rusak tapi developer bilang sudah dicek — tidak ada bukti
- Dokumen serah terima sering tanda tangan fisik, ribet dan lambat

### Fitur Detail

**A. Checklist Inspeksi Digital**
- Template checklist standar untuk setiap tipe rumah
- Checklist mencakup semua area: pondasi, struktur, dinding, atap, kusen pintu/jendela, instalasi listrik, instalasi air, finishing
- Petugas mengisi checklist via HP di lokasi

**B. Pencatatan Defect**
- Setiap cacat bisa difoto langsung dari HP
- Kategorisasi defect: major (serius, harus diperbaiki sebelum handover) vs minor
- Keterangan lokasi cacat: di ruangan mana, bagian apa
- Assignment: cacat ini tanggung jawab kontraktor mana

**C. Tracking Perbaikan**
- Status per defect: Ditemukan → Ditugaskan → Sedang Diperbaiki → Selesai → Diverifikasi
- SLA timer: hitung mundur batas waktu perbaikan
- Notifikasi ke kontraktor yang ditugaskan
- Eskalasi otomatis jika perbaikan melebihi SLA

**D. Proses Handover**
- Jadwal serah terima unit, terkoordinasi dengan data pembeli di CRM
- Checklist handover digital yang diisi bersama pembeli saat kunci diserahkan
- Foto kondisi rumah saat diserahkan sebagai dokumentasi

**E. BAST Digital**
- Berita Acara Serah Terima dibuat otomatis oleh sistem berdasarkan data yang sudah ada
- Tanda tangan digital (e-signature) oleh developer dan pembeli
- Disimpan otomatis di customer portal pembeli dan arsip developer
---

## Modul 9 — After-Sales & Estate Management
### "Sistem Layanan Purna Jual & Pengelolaan Perumahan"

### Penjelasan Umum

Tanggung jawab developer tidak selesai saat kunci diserahkan. Ada dua hal yang masih harus dikelola: (1) layanan purna jual dan garansi bangunan, dan (2) pengelolaan lingkungan kawasan perumahan agar tetap nyaman bagi seluruh warga.

### Istilah Penting

- **After-Sales** — Layanan yang diberikan kepada pembeli setelah transaksi selesai dan rumah diserahkan. Termasuk garansi dan penanganan komplain.
- **Estate Management / Pengelolaan Kawasan** — Kegiatan mengelola fasilitas dan lingkungan kawasan perumahan: keamanan (satpam), kebersihan, perawatan taman, perbaikan fasilitas umum.
- **IPL (Iuran Pengelolaan Lingkungan)** — Iuran bulanan yang dibayar oleh setiap warga untuk membiayai operasional pengelolaan kawasan (gaji satpam, cleaning service, perawatan taman, dll.).
- **Virtual Account** — Nomor rekening unik yang diberikan ke setiap warga untuk memudahkan pembayaran dan identifikasi otomatis siapa yang sudah bayar.
- **Ticketing System** — Sistem pencatatan komplain yang memberikan nomor tiket unik untuk setiap pengaduan, agar mudah dilacak progres penanganannya.
- **Fasilitas Umum (Fasum)** — Fasilitas yang digunakan bersama oleh seluruh warga: jalan, taman, pos satpam, masjid/mushola, tempat sampah.
- **Fasilitas Sosial (Fasos)** — Fasilitas untuk kegiatan sosial warga: balai warga, lapangan olahraga, ruang bermain anak.
- **QRIS** — QR Code Indonesian Standard, metode pembayaran digital menggunakan scan QR dari berbagai dompet digital/bank.

### Masalah yang Diselesaikan

- Warga komplain ada yang rusak, tapi komplainnya via WA ke banyak orang, tidak jelas siapa yang harus tanggung jawab
- Iuran bulanan (IPL) ditagih manual, banyak yang menunggak
- Pengumuman ke warga dilakukan door-to-door atau tempel kertas di pos satpam

### Fitur Detail

**A. Manajemen Garansi**
- Data garansi per unit: tanggal mulai, tanggal berakhir, ruang lingkup (apa saja yang dijamin)
- Notifikasi ke tim ketika masa garansi unit tertentu akan habis
- Rekap klaim garansi yang sudah diproses dan yang sedang berjalan

**B. Ticketing Komplain**
- Warga ajukan komplain via Customer Portal (mobile/web)
- Setiap komplain mendapat nomor tiket unik
- Kategorisasi: kerusakan struktural (masuk garansi), kerusakan fasilitas umum, gangguan warga
- Assignment ke teknisi/petugas yang bertanggung jawab
- SLA per kategori: "kerusakan bocor atap harus ditangani maksimal 24 jam"
- Warga bisa pantau status penanganan komplainnya

**C. Tagihan & Pembayaran IPL**
- Tagihan IPL digenerate otomatis setiap bulan
- Pengiriman tagihan via email/WhatsApp/notifikasi aplikasi
- Metode pembayaran: transfer bank, virtual account, QRIS
- Konfirmasi pembayaran otomatis
- Laporan tunggakan: siapa yang belum bayar berapa bulan
- Notifikasi reminder ke warga yang menunggak

**D. Manajemen Fasilitas**
- Jadwal perawatan rutin fasilitas (servis genset, potong rumput, cat pagar, dll.)
- Laporan kondisi fasilitas
- Permintaan perbaikan fasilitas umum dari warga

**E. Komunikasi Warga**
- Pengumuman resmi dari pengelola ke seluruh warga dalam satu klik
- Forum/grup diskusi warga digital
- Voting/survei warga untuk keputusan bersama

**F. Laporan Operasional**
- Rekap pengeluaran operasional vs pemasukan IPL
- Laporan keuangan pengelolaan kawasan secara transparan kepada warga
---

## Modul 10 — Executive Dashboard
### "Layar Kontrol untuk Pimpinan"

### Penjelasan Umum

Executive Dashboard adalah tampilan ringkasan satu halaman yang memberikan gambaran menyeluruh tentang kondisi bisnis developer kepada level pimpinan (direktur, manajer senior) tanpa harus membuka banyak laporan dari banyak divisi.

### Istilah Penting

- **KPI (Key Performance Indicator)** — Indikator utama yang digunakan untuk mengukur keberhasilan suatu proses atau bisnis. Contoh KPI developer: jumlah unit terjual per bulan, persentase konstruksi tepat waktu, persentase piutang macet.
- **Dashboard** — Tampilan visual yang merangkum data penting dalam bentuk grafik, angka, dan indikator warna agar mudah dipahami sekilas pandang.
- **Real-time** — Data yang diperbarui secara langsung/instan, sehingga apa yang ditampilkan adalah kondisi terkini, bukan data kemarin atau minggu lalu.
- **Alert** — Tanda peringatan otomatis yang muncul ketika sesuatu membutuhkan perhatian segera. Contoh: "Proyek B cashflow tinggal 15% dari budget".
- **Forecast** — Proyeksi atau prediksi kondisi di masa depan berdasarkan data yang ada. Contoh: "Berdasarkan tren penjualan, target semester ini kemungkinan tercapai 87%".
- **Drill-down** — Kemampuan untuk mengklik suatu angka ringkasan dan masuk ke detail data yang membentuk angka tersebut.
- **Threshold** — Batas nilai tertentu yang jika dilewati akan memicu peringatan/alert.

### Masalah yang Diselesaikan

- Untuk tahu kondisi bisnis, pimpinan harus kumpulkan laporan dari banyak divisi — butuh waktu berhari-hari
- Keputusan diambil berdasarkan feeling, bukan data
- Masalah besar (keuangan seret, proyek terlambat) baru ketahuan setelah parah

### Fitur Detail

**A. Overview Bisnis**
- Total proyek aktif
- Total unit tersedia vs sudah terjual vs masih stok
- Pendapatan bulan ini vs target
- Grafik tren penjualan 12 bulan terakhir

**B. Monitoring Per Proyek**
- Card per proyek dengan indikator:
  - Progres konstruksi (%)
  - Penjualan (% unit terjual)
  - Kondisi cashflow (hijau/kuning/merah)
  - Status perizinan
- Klik satu proyek untuk masuk ke detail lengkap (drill-down)

**C. Kondisi Keuangan**
- Total cashflow perusahaan hari ini
- Piutang yang belum masuk
- Hutang yang harus dibayar dalam 30 hari ke depan
- Forecast cashflow 3/6 bulan ke depan

**D. Alert & Risk Radar**
- Daftar item yang perlu perhatian segera:
  - Proyek yang terlambat lebih dari X%
  - Unit yang pembelinya menunggak lebih dari 60 hari
  - Izin yang akan habis dalam 30 hari
  - Budget yang melebihi threshold tertentu

**E. Laporan Otomatis**
- Laporan ringkasan mingguan dikirim otomatis ke email direksi setiap Senin
- Laporan bulanan komprehensif di-generate otomatis
- Export laporan ke PDF/Excel untuk rapat

**F. Perbandingan Antar Proyek**
- Bandingkan kinerja beberapa proyek sekaligus
- Identifikasi proyek mana yang paling menguntungkan, mana yang bermasalah

---

## Ringkasan Aplikasi

Semua 10 modul di atas tidak perlu dibuat dalam 10 aplikasi terpisah. Cukup dikelompokkan menjadi **4 aplikasi** berdasarkan pengguna:

### Aplikasi 1 — Web Admin (Back Office)
- **Pengguna:** Seluruh tim internal developer
- **Modul:** CRM, Marketing, Legal, Project Management, Procurement, Keuangan, QA/Handover, After-Sales, Executive Dashboard
- **Akses:** Via browser di laptop/PC
- **Catatan:** Setiap pengguna hanya bisa akses menu sesuai jabatannya (role-based access / hak akses)

### Aplikasi 2 — Mobile Lapangan
- **Pengguna:** Mandor, site engineer, petugas gudang, petugas inspeksi
- **Modul:** Laporan progres harian, upload foto, checklist inspeksi defect, penerimaan material gudang
- **Akses:** Aplikasi Android/iOS di HP
- **Catatan:** Desain sederhana, bisa digunakan di lokasi proyek (mode offline jika sinyal buruk)

### Aplikasi 3 — Customer Portal
- **Pengguna:** Pembeli rumah dan warga perumahan
- **Modul:** Pantau progres unit, tagihan & pembayaran, unduh dokumen, komplain, pengumuman, IPL
- **Akses:** Web browser + Aplikasi Android/iOS
- **Catatan:** Tampilan ramah pengguna umum (tidak perlu background teknis)

### Aplikasi 4 — Website Marketing
- **Pengguna:** Masyarakat umum / calon pembeli
- **Modul:** Landing page, galeri, simulasi KPR, form leads
- **Akses:** Website publik (bisa diakses siapa saja)
- **Catatan:** Terhubung otomatis ke modul CRM di Web Admin

---

## Prioritas Implementasi

Mengingat tidak semua modul perlu dibangun sekaligus, berikut rekomendasi urutan pengembangan:

### Fase 1 — Fondasi Bisnis (Bulan 1–4)
| Modul | Alasan Prioritas |
|-------|-----------------|
| CRM & Sales | Jantung bisnis, langsung berdampak pada pendapatan |
| Keuangan & Cashflow | Mencegah krisis keuangan proyek |
| Customer Portal (dasar) | Pembeda kompetitif, tingkatkan kepercayaan pembeli |
| Website Marketing | Sumber leads utama |

### Fase 2 — Operasional Proyek (Bulan 5–8)
| Modul | Alasan Prioritas |
|-------|-----------------|
| Project Management | Kendali konstruksi dari jarak jauh |
| Procurement & Gudang | Kontrol biaya material |
| Legal & Perizinan | Mitigasi risiko hukum |

### Fase 3 — Kualitas & Layanan (Bulan 9–12)
| Modul | Alasan Prioritas |
|-------|-----------------|
| QA/QC & Handover | Standarisasi kualitas serah terima |
| After-Sales & Estate Management | Retensi dan kepuasan warga jangka panjang |

### Fase 4 — Intelijen Bisnis (Bulan 13+)
| Modul | Alasan Prioritas |
|-------|-----------------|
| Executive Dashboard | Pengambilan keputusan berbasis data |
| Marketing Analytics | Optimasi anggaran promosi |

---

## Ringkasan Singkat Semua Modul

| Modul | Inti Fungsi | Masalah Utama yang Diselesaikan |
|-------|-------------|--------------------------------|
| CRM & Sales | Kelola calon pembeli sampai akad | Leads hilang, follow-up lupa, data tidak terorganisir |
| Marketing | Ukur efektivitas iklan & promosi | Tidak tahu iklan mana yang efektif, anggaran terbuang |
| Legal & Perizinan | Pantau dokumen izin proyek | Izin habis tidak ketahuan, dokumen hilang |
| Konstruksi | Awasi pembangunan dari jarak jauh | Tidak tahu kondisi lapangan, jadwal meleset |
| Procurement | Kontrol pembelian material | Material telat, stok tidak terkontrol, overbudget |
| Keuangan | Pantau uang masuk & keluar | Cashflow tidak terprediksi, piutang macet |
| Customer Portal | Aplikasi untuk pembeli | Pembeli tidak transparan, CS kewalahan |
| QA/Handover | Inspeksi & serah terima rumah | Defect tidak tercatat, perbaikan tidak terpantau |
| After-Sales | Layanan komplain & iuran warga | Komplain lambat ditangani, IPL ditagih manual |
| Executive Dashboard | Laporan besar untuk pimpinan | Keputusan tidak based on data, masalah terlambat ketahuan |

---

*Dokumen ini adalah draf awal rancangan sistem. Setiap modul akan didetailkan lebih lanjut dalam dokumen terpisah berisi wireframe (sketsa tampilan), alur data, spesifikasi teknis, dan estimasi waktu pengembangan.*