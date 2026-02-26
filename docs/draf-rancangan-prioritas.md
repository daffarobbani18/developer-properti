# Rancangan Sistem Developer Perumahan — Versi Prioritas

> Dokumen ini adalah versi **pangkas** dari rancangan lengkap.
> Modul dengan prioritas terendah (Fase 3 & 4) dihapus untuk fokus pada
> fitur yang paling berdampak langsung pada bisnis developer perumahan.

---

## Modul yang Dipangkas (Tidak Masuk Versi Ini)

| Modul | Alasan Dipangkas |
|-------|-----------------|
| QA/QC & Handover | Bisa dilakukan manual dulu, dampak bisnis tidak langsung |
| After-Sales & Estate Management | Dibutuhkan setelah proyek selesai dan warga sudah menempati |
| Executive Dashboard | Data belum cukup banyak di awal, bisa ditambah belakangan |
| Marketing Analytics (lanjutan) | Fitur dasar sudah ada di Modul Marketing |

---

## Daftar Isi

1. [Gambaran Umum](#1-gambaran-umum)
2. [Modul 1 — CRM & Sales](#modul-1--crm--sales)
3. [Modul 2 — Keuangan & Cashflow](#modul-2--keuangan--cashflow)
4. [Modul 3 — Customer Portal](#modul-3--customer-portal)
5. [Modul 4 — Website Marketing](#modul-4--website-marketing)
6. [Modul 5 — Monitoring Milestone & Kontraktor](#modul-5--monitoring-milestone--kontraktor)
7. [Modul 6 — Pengeluaran & Vendor](#modul-6--pengeluaran--vendor)
8. [Modul 7 — Legal & Perizinan](#modul-7--legal--perizinan)
9. [Ringkasan Aplikasi](#ringkasan-aplikasi)
10. [Roadmap Pengembangan](#roadmap-pengembangan)

---

## 1. Gambaran Umum

Dari 10 modul rancangan lengkap, versi ini memfokuskan pada **7 modul inti** yang paling berdampak langsung pada kelangsungan bisnis developer perumahan.

### Logika Pemangkasan

```
TETAP MASUK (7 Modul)              DIPANGKAS (3 Modul)
──────────────────────             ──────────────────────
✅ CRM & Sales          →  uang masuk
✅ Keuangan & Cashflow  →  uang tidak bocor        ❌ QA/QC & Handover
✅ Customer Portal      →  pembeli puas            ❌ After-Sales & Estate
✅ Website Marketing    →  sumber leads            ❌ Executive Dashboard
✅ Project Management   →  konstruksi terkontrol
✅ Pengeluaran & Vendor  →  biaya kontraktor terkontrol
✅ Legal & Perizinan    →  bisnis aman hukum
```

### Struktur Aplikasi (Versi Prioritas)

| No | Nama Aplikasi | Jenis | Digunakan Oleh |
|----|---------------|-------|----------------|
| 1 | Web Admin | Website (browser) | Sales, Finance, Manajer Proyek, Admin |
| 2 | Mobile Lapangan | Aplikasi HP (Android/iOS) | Site Engineer, Manajer Proyek |
| 3 | Customer Portal | Website + Aplikasi HP | Pembeli rumah |
| 4 | Website Marketing | Website publik | Calon pembeli umum |

---

## Modul 1 — CRM & Sales
### "Sistem Pencatatan & Pengelolaan Calon Pembeli"

**Prioritas: TERTINGGI** — Ini jantung bisnis. Tanpa penjualan, tidak ada proyek.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **CRM** | Customer Relationship Management — sistem kelola hubungan dengan calon pembeli |
| **Leads** | Calon pembeli yang baru menunjukkan ketertarikan, belum tentu jadi beli |
| **Follow-up** | Menghubungi kembali calon pembeli untuk tindak lanjut |
| **Pipeline** | Alur tahapan penjualan dari leads hingga akad |
| **Booking** | Pembayaran uang tanda jadi untuk "memesan" unit tertentu |
| **SPK** | Surat Pesanan/Pemesanan Kavling — perjanjian awal pembelian unit |
| **KPR** | Kredit Pemilikan Rumah — pembeli cicil rumah lewat bank |
| **Akad** | Penandatanganan perjanjian jual beli resmi di hadapan notaris |
| **Konversi** | Persentase leads yang akhirnya jadi pembeli |
| **PPAT** | Pejabat Pembuat Akta Tanah — notaris khusus properti |

### Masalah yang Diselesaikan

- Sales lupa follow-up → calon pembeli kabur ke kompetitor
- Data calon pembeli tersebar di HP masing-masing sales
- Ketika sales resign, semua data ikut hilang
- Tidak ada laporan berapa leads masuk vs berhasil closing

### Alur Pipeline

```
LEADS → FOLLOW-UP → SURVEY LOKASI → NEGOSIASI → BOOKING → SPK → KPR/AKAD
```

### Fitur Utama

**A. Manajemen Leads**
- Leads masuk otomatis dari website, WhatsApp, marketplace, pameran
- Distribusi leads otomatis ke sales yang bertugas
- Sumber leads tercatat: dari mana calon pembeli tahu perumahan ini

**B. Pipeline Visual**
- Papan Kanban: tampilan semua calon pembeli per tahap
- Warna merah untuk calon pembeli yang sudah lama tidak ditindaklanjuti
- Pindah tahap cukup dengan drag-and-drop

**C. Reminder Otomatis**
- Notifikasi ke sales: "Budi Santoso belum dihubungi 3 hari"
- Pengingat jatuh tempo janji temu atau dokumen
- Pesan follow-up otomatis via WhatsApp/email

**D. Data Pembeli & Unit**
- Histori semua komunikasi dengan setiap calon pembeli
- Denah perumahan interaktif: klik unit untuk lihat status (tersedia/dipesan/terjual)
- Info detail per unit: luas tanah, luas bangunan, harga, tipe

**E. Laporan Sales**
- Jumlah leads masuk per bulan per sumber
- Tingkat konversi (dari 100 leads, berapa yang jadi beli)
- Performa per sales
- Rekap komisi agen properti otomatis

---

## Modul 2 — Keuangan & Cashflow
### "Sistem Keuangan Proyek"

**Prioritas: TERTINGGI** — Mayoritas proyek perumahan gagal karena cashflow, bukan karena tidak ada pembeli.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **Cashflow** | Aliran uang masuk dan keluar. Cashflow negatif = pengeluaran > pemasukan, berbahaya |
| **KPR** | Kredit Pemilikan Rumah — bank bayar developer lunas, pembeli cicil ke bank |
| **FLPP** | KPR subsidi pemerintah untuk masyarakat berpenghasilan rendah |
| **DP (Down Payment)** | Uang muka yang dibayar pembeli di awal, biasanya 10–30% dari harga rumah |
| **Kredit Konstruksi** | Pinjaman bank khusus untuk membiayai pembangunan proyek |
| **AR (Piutang)** | Uang yang harusnya kita terima tapi belum dibayar (cicilan yang menunggak) |
| **AP (Hutang Usaha)** | Uang yang harus kita bayar ke kontraktor/supplier |
| **RAB** | Rencana Anggaran Biaya — rincian biaya proyek sebelum mulai dibangun |
| **Overbudget** | Biaya aktual melebihi anggaran yang direncanakan |
| **Mangkrak** | Proyek terbengkalai karena kehabisan dana di tengah pembangunan |
| **Retensi** | Sebagian pembayaran kontraktor yang ditahan (5%) sebagai jaminan kualitas |
| **BEP** | Break Even Point — titik impas, pendapatan sudah menutup semua biaya |

### Masalah yang Diselesaikan

- Developer tidak tahu persis sisa uang untuk bangun saat ini
- Pembeli menunggak cicilan tapi tidak ada yang mengingatkan
- Biaya konstruksi membengkak, baru ketahuan setelah parah
- Tidak bisa prediksi kondisi keuangan 3–6 bulan ke depan

### Fitur Utama

**A. Budget vs Realisasi**
- Input anggaran (RAB) per proyek di awal
- Update realisasi pengeluaran secara berkala
- Alert otomatis ketika pengeluaran mendekati/melebihi batas

**B. Manajemen Pendapatan**
- Rekap semua unit terjual + skema pembayarannya
- Status pembayaran per pembeli: DP sudah, cicilan ke berapa, KPR cair belum
- Notifikasi otomatis ke pembeli yang menunggak
- Pencatatan setiap pembayaran masuk

**C. Tagihan ke Kontraktor/Supplier**
- Tagihan masuk → proses persetujuan → bayar
- Persetujuan berjenjang sesuai nilai tagihan
- Rekap hutang usaha (AP) yang belum terbayar

**D. Integrasi KPR Bank**
- Notifikasi ketika KPR pembeli disetujui bank
- Pencatatan pencairan dana KPR
- Monitoring status pengajuan KPR per pembeli

**E. Dashboard Cashflow**
- Grafik uang masuk vs keluar per bulan
- Proyeksi cashflow 3 dan 6 bulan ke depan
- Alert dini potensi cashflow defisit

**F. Laporan Keuangan**
- Laporan Laba Rugi per proyek
- Laporan piutang (siapa menunggak, berapa lama)
- Export ke Excel/PDF

---

## Modul 3 — Customer Portal
### "Aplikasi untuk Pembeli Rumah"

**Prioritas: TINGGI** — Pembeda utama dari kompetitor, mengurangi beban CS secara signifikan.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **CS** | Customer Service — tim layanan pelanggan developer |
| **Portal** | Pintu masuk digital (web/aplikasi) untuk mengakses informasi dan layanan |
| **Notifikasi Push** | Pesan yang muncul di layar HP walaupun aplikasinya tidak sedang dibuka |
| **e-Signature** | Tanda tangan digital yang memiliki kekuatan hukum |
| **SHM** | Sertifikat Hak Milik — bukti kepemilikan tanah paling kuat secara hukum |
| **BAST** | Berita Acara Serah Terima — dokumen resmi serah terima rumah |
| **Tiket** | Nomor unik yang diberikan untuk setiap pengajuan komplain |

### Masalah yang Diselesaikan

- Pembeli sering WA/telepon tanya "rumah saya sudah sampai mana?"
- CS kewalahan menjawab pertanyaan yang sama berulang-ulang
- Dokumen penting (akad, sertifikat) hilang di pembeli
- Perubahan jadwal serah terima tidak sampai ke pembeli

### Fitur Utama

**A. Akun Pribadi Pembeli**
- Login khusus per pembeli dengan username & password
- Data diri, data unit yang dibeli, status KPR

**B. Pantau Progres Pembangunan**
- Foto pembangunan unit milik pembeli, diupdate dari lapangan
- Persentase progres penyelesaian
- Timeline: kapan pondasi selesai, kapan struktur selesai, estimasi serah terima
- Notifikasi push/email setiap ada update baru

**C. Riwayat & Tagihan Pembayaran**
- Semua transaksi tercatat: tanggal, jumlah, metode
- Tagihan berikutnya: berapa yang harus dibayar dan kapan jatuh tempo
- Unduh kwitansi & bukti pembayaran

**D. Dokumen Digital**
- Unduh SPK, Akad Jual Beli, SHM, PBG, BAST kapan saja

**E. Pengajuan Komplain**
- Form komplain digital dengan kategori
- Nomor tiket untuk setiap komplain
- Status penanganan: Diterima → Ditangani → Selesai

**F. Notifikasi & Pengumuman**
- Info penting dari developer langsung ke HP pembeli

---

## Modul 4 — Website Marketing
### "Website Publik & Sumber Leads"

**Prioritas: TINGGI** — Pintu masuk utama calon pembeli ke ekosistem sistem.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **Landing Page** | Halaman website khusus untuk satu proyek perumahan |
| **SEO** | Search Engine Optimization — teknik agar website mudah ditemukan di Google |
| **Google Ads / Meta Ads** | Iklan berbayar di Google dan Facebook/Instagram |
| **CPL (Cost Per Lead)** | Biaya yang dikeluarkan untuk mendapat 1 calon pembeli |
| **Virtual Tour** | Tur rumah virtual 360 derajat, tanpa harus datang ke lokasi |
| **DP** | Down Payment / Uang Muka |
| **Tenor** | Jangka waktu cicilan KPR (biasanya 5, 10, 15, 20, atau 30 tahun) |

### Fitur Utama

**A. Landing Page Per Proyek**
- Halaman web menarik khusus tiap perumahan
- Berisi: lokasi, tipe rumah, harga, fasilitas, galeri foto, denah
- Form pendaftaran terhubung otomatis ke modul CRM
- Tombol WhatsApp ke tim sales

**B. Galeri & Virtual Tour**
- Foto eksterior, interior, fasilitas kawasan
- Virtual tour 360 derajat rumah contoh
- Video profil proyek

**C. Simulasi KPR Online**
- Calon pembeli hitung cicilan sendiri
- Input: harga, DP, tenor, suku bunga → Output: estimasi cicilan/bulan
- Tampil rekomendasi bank partner

**D. Tracking Sumber Leads**
- Setiap iklan diberi kode unik
- Laporan otomatis: leads dari Google berapa, Instagram berapa, marketplace berapa, pameran berapa

---

## Modul 5 — Project Management & Konstruksi
### "Sistem Pengawasan Pembangunan"

**Prioritas: MENENGAH-TINGGI** — Mencegah keterlambatan dan pembengkakan biaya konstruksi.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **RAB** | Rencana Anggaran Biaya — rincian biaya pembangunan |
| **Milestone** | Titik pencapaian penting: pondasi selesai, struktur selesai, finishing selesai |
| **S-Curve** | Grafik huruf S yang membandingkan progres rencana vs realisasi |
| **Deviasi** | Selisih antara rencana dan realisasi. Deviasi -10% = terlambat 10% dari rencana |
| **Mandor** | Kepala/pengawas lapangan yang memimpin pekerja konstruksi |
| **Subkontraktor** | Perusahaan yang dikontrak untuk pekerjaan bagian tertentu (listrik, plumbing, dll.) |
| **Site Engineer** | Insinyur pengawas lapangan |
| **K3** | Kesehatan dan Keselamatan Kerja (helm, sepatu safety, dll.) |
| **VO (Variation Order)** | Perubahan pekerjaan dari kontrak asal yang mempengaruhi biaya dan jadwal |
| **Gantt Chart** | Diagram batang waktu untuk merencanakan dan memantau jadwal proyek |

### Masalah yang Diselesaikan

- Manajer di kantor tidak tahu kondisi lapangan secara real-time
- Jadwal meleset tapi baru ketahuan setelah berhari-hari/minggu
- Laporan progres manual di WhatsApp sering terlambat dan tidak akurat
- Biaya konstruksi membengkak tanpa peringatan dini

### Fitur Utama

**A. Jadwal Proyek (Gantt Chart)**
- Rencana jadwal per tahap: gali tanah → pondasi → struktur → dinding → atap → finishing
- Milestone tercatat dan dipantau otomatis
- Status real-time: selesai sesuai jadwal / terlambat / kritis

**B. Laporan Progres Harian (via Mobile)**
- Mandor isi laporan dari HP di lokasi
- Upload foto progres langsung dari lapangan
- Sistem rangkum laporan harian menjadi laporan mingguan/bulanan otomatis

**C. Dashboard Progres Visual**
- Denah kawasan: setiap unit berwarna sesuai status (Belum Mulai/Sedang Dibangun/Selesai)
- S-Curve otomatis: grafik rencana vs realisasi progres keseluruhan

**D. Kontrol Anggaran**
- Perbandingan RAB vs realisasi biaya per item
- Alert ketika biaya mendekati/melebihi batas anggaran

**E. Manajemen Kendala**
- Pelaporan masalah lapangan: material kurang, alat rusak, cuaca buruk
- Eskalasi otomatis ke pihak terkait
- Tracking penyelesaian tiap masalah

---

## Modul 6 — Procurement & Gudang
### "Sistem Pembelian Material & Stok"

**Prioritas: MENENGAH-TINGGI** — Mencegah terhentinya konstruksi akibat material telat atau stok habis.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **Procurement** | Proses pengadaan barang/jasa dari perencanaan hingga pembayaran |
| **Vendor/Supplier** | Perusahaan/individu yang menjual material ke developer |
| **PO (Purchase Order)** | Surat pesanan resmi ke supplier — mengikat secara hukum |
| **Tender** | Minta penawaran harga dari beberapa vendor untuk dapat harga terbaik |
| **GR (Good Receipt)** | Konfirmasi barang diterima di gudang sesuai pesanan |
| **Buffer Stock** | Stok cadangan minimum agar pembangunan tidak terhenti |
| **Approval** | Proses persetujuan atasan sebelum pembelian dilaksanakan |
| **Stok Opname** | Penghitungan fisik barang di gudang untuk dicocokkan dengan catatan sistem |

### Masalah yang Diselesaikan

- Material telat datang → konstruksi terhenti → jadwal mundur
- Pembelian tidak terkontrol → harga mahal karena tidak ada negosiasi
- Stok gudang tidak tercatat → beli dobel, boros anggaran
- Tidak ada bukti jika supplier kirim barang kurang/kualitas jelek

### Fitur Utama

**A. Manajemen Vendor**
- Database vendor beserta kontak, produk, dan rekam jejak kinerja
- Penilaian vendor: ketepatan waktu, kualitas, harga
- Blacklist vendor bermasalah

**B. Proses Pembelian**
- Pengajuan kebutuhan material dari lapangan
- Persetujuan berjenjang (approval) sebelum PO diterbitkan
- Proses tender digital untuk pembelian di atas nilai tertentu

**C. Purchase Order (PO)**
- PO digital terstandar dengan nomor otomatis
- Status PO dipantau: Draft → Disetujui → Dikirim ke Supplier → Diterima → Lunas

**D. Penerimaan Barang**
- Petugas gudang konfirmasi penerimaan barang via HP
- Foto bukti penerimaan
- Sistem cek otomatis: barang diterima vs yang dipesan di PO
- Laporan jika ada ketidaksesuaian (kurang, rusak, salah spek)

**E. Stok Gudang**
- Stok real-time per material per gudang/lokasi proyek
- Notifikasi ketika stok di bawah batas minimum (buffer stock)
- Riwayat masuk-keluar material

---

## Modul 7 — Legal & Perizinan
### "Sistem Pengelolaan Dokumen Izin"

**Prioritas: MENENGAH** — Bersifat protektif/preventif. Melindungi bisnis dari risiko hukum.

### Istilah Penting

| Istilah | Penjelasan |
|---------|-----------|
| **PBG** | Persetujuan Bangunan Gedung — izin mendirikan bangunan (pengganti IMB sejak 2021) |
| **IMB** | Izin Mendirikan Bangunan — sebutan lama PBG, masih sering digunakan |
| **Site Plan** | Gambar denah keseluruhan kawasan yang disetujui dinas tata ruang |
| **AMDAL** | Analisis Mengenai Dampak Lingkungan — kajian dampak proyek ke lingkungan |
| **UKL-UPL** | Versi lebih sederhana AMDAL untuk proyek skala menengah |
| **BPN** | Badan Pertanahan Nasional — lembaga yang mengurus sertifikat tanah |
| **SHM** | Sertifikat Hak Milik — bukti kepemilikan tanah paling kuat |
| **HGB** | Hak Guna Bangunan — hak mendirikan bangunan untuk jangka waktu tertentu |
| **Due Diligence** | Pemeriksaan menyeluruh legalitas lahan sebelum dibeli |

### Masalah yang Diselesaikan

- Dokumen izin tersebar, susah dicari saat dibutuhkan
- Izin habis masa berlaku tanpa ada yang menyadari → proyek bisa dihentikan paksa
- Tidak tahu sudah sampai tahap mana pengurusan izin

### Fitur Utama

**A. Repositori Dokumen Digital**
- Semua dokumen izin tersimpan rapi secara digital
- Pencarian cepat berdasarkan nama, nomor dokumen, atau tanggal
- Versi terbaru selalu tersedia

**B. Tracker Status Perizinan**
- Status per izin: Belum Diajukan → Sedang Diproses → Sudah Terbit → Perlu Perpanjangan
- Catatan: sudah diajukan ke instansi mana, tanggal pengajuan, estimasi selesai

**C. Notifikasi Masa Berlaku**
- Peringatan 90 hari sebelum izin habis
- Peringatan 30 hari (kedua)
- Peringatan darurat 7 hari sebelum habis
- Notifikasi via email dan aplikasi

**D. Checklist Perizinan**
- Template checklist semua dokumen yang dibutuhkan per proyek
- Progress persentase kelengkapan: "Perizinan Proyek A — 70% lengkap"

---

## Ringkasan Aplikasi

| No | Aplikasi | Jenis | Pengguna | Modul di Dalamnya |
|----|----------|-------|----------|-------------------|
| 1 | **Web Admin** | Website (browser) | Sales, Finance, Manajer Proyek, Admin | CRM, Keuangan, Monitoring Milestone, Pengeluaran & Vendor, Legal |
| 2 | **Mobile Lapangan** | Android/iOS | Site Engineer, Manajer Proyek | Update milestone, upload foto, laporan kendala |
| 3 | **Customer Portal** | Web + Android/iOS | Pembeli rumah | Pantau progres, tagihan, dokumen, komplain |
| 4 | **Website Marketing** | Website publik | Calon pembeli | Landing page, galeri, simulasi KPR, form leads |

---

## Roadmap Pengembangan

```
FASE 1 (Bulan 1–3)        FASE 2 (Bulan 4–6)        FASE 3 (Bulan 7–9)
─────────────────          ─────────────────          ─────────────────
✅ CRM & Sales            ✅ Project Management      ✅ Procurement & Gudang
✅ Keuangan & Cashflow    ✅ Legal & Perizinan
✅ Customer Portal (MVP)
✅ Website Marketing
```

> **MVP (Minimum Viable Product)** = versi paling sederhana dari sebuah produk yang sudah bisa digunakan dan memberikan nilai nyata, sebelum fitur lengkapnya selesai dibuat.

### Detail Fase

**Fase 1 — Fondasi Bisnis (Bulan 1–3)**

| Modul | Target Fitur di Fase 1 |
|-------|------------------------|
| CRM & Sales | Pipeline, leads, reminder, denah unit |
| Keuangan | Budget vs realisasi, pembayaran pembeli, dashboard cashflow |
| Customer Portal | Login, progres pembangunan, dokumen, komplain |
| Website Marketing | Landing page, galeri, form leads, simulasi KPR |

**Fase 2 — Operasional Proyek (Bulan 4–6)**

| Modul | Target Fitur di Fase 2 |
|-------|------------------------|
| Monitoring Milestone | Tracking milestone, foto progres, laporan kendala kontraktor |
| Legal & Perizinan | Repositori dokumen, tracker status, notifikasi masa berlaku |

**Fase 3 — Kontrol Biaya Kontraktor (Bulan 7–9)**

| Modul | Target Fitur di Fase 3 |
|-------|------------------------|
| Pengeluaran & Vendor | Manajemen kontraktor, approval termin, BA digital, RAB vs realisasi |

---

## Perbandingan: Versi Lengkap vs Versi Prioritas

| | Versi Lengkap | Versi Prioritas |
|--|---------------|-----------------|
| Jumlah Modul | 10 modul | 7 modul |
| Durasi Estimasi | 13+ bulan | 9 bulan |
| Kompleksitas | Sangat tinggi | Menengah-tinggi |
| Cocok untuk | Developer yang sudah mature | Developer yang baru digitalisasi |
| Fokus | Bisnis end-to-end lengkap | Penjualan, keuangan, dan konstruksi |

---

*Modul yang dipangkas (QA/QC, After-Sales, Executive Dashboard) dapat ditambahkan sebagai Fase 4 setelah sistem berjalan stabil dan mitra developer sudah familiar menggunakan platform ini.*
