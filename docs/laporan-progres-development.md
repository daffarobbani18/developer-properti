# LAPORAN PROGRES PROYEK
# PROYEK INTEGRASI SISTEM
# "SIMDP: Website Marketing Perumahan Berbasis Web"

---

## DOSEN PENGAMPU

Dr. Muhammad Adri, S.Pd., M.T

---

## OLEH

1. Athallah Budiman Devia Putra | 23076028
2. Daffa Robbani | 23076007
3. Milla Hanifa | 23076041

---

## PROGRAM STUDI PENDIDIKAN TEKNIK INFORMATIKA
## DEPARTEMEN TEKNIK ELEKTRONIKA
## FAKULTAS TEKNIK
## UNIVERSITAS NEGERI PADANG
## 2026

---

# Laporan Progres Development
## SIMDP - Website Marketing Frontend

Proyek: Website Marketing Perumahan Grand Harmoni  
Tech Stack: Next.js 16.1.6, TypeScript, Tailwind CSS v4, App Router  
Lokasi Kode: web-marketing/frontend/

---

## A. Metadata Laporan

| Item | Detail |
|---|---|
| Judul Dokumen | Laporan Progres Development SIMDP - Website Marketing Frontend |
| Jenis Dokumen | Progress Report Berkelanjutan (4 Laporan/Fase) |
| Versi | v1.0 (Kompilasi Fase 1-4) |
| Tanggal Kompilasi | 09/04/2026 |
| Periode Pengerjaan | 12/03/2026 - 09/04/2026 |
| Lokasi File | docs/laporan-progres-development.md |
| Status Dokumen | Final Internal |
| Kanal Distribusi | Dokumentasi internal proyek |

### Informasi Unduh
- Format file: Markdown (.md)
- Nama file unduhan: laporan-progres-development.md
- Keterangan: Dokumen siap diunduh dari repository/workspace untuk kebutuhan review manajemen atau handover tim.

---

## B. Informasi Penulis dan Editor Ditugaskan

| Peran | Nama | Tugas Utama |
|---|---|---|
| Penulis Laporan | Tim Frontend Engineer | Menyusun progres teknis, milestone, dan status implementasi |
| Editor Teknis | Tech Lead Frontend | Review akurasi teknis, konsistensi istilah, dan kelengkapan fase |
| Reviewer Produk | Project Manager | Validasi kesesuaian dengan roadmap fase pengembangan |
| Approver | Admin Proyek | Persetujuan final dokumen untuk arsip dan monitoring |

Catatan: Penamaan personel dapat disesuaikan dengan struktur tim aktual pada saat distribusi dokumen final.

---

## C. Riwayat Aktivitas Laporan

| Tanggal | Aktivitas | Pelaksana | Hasil |
|---|---|---|---|
| 12/03/2026 | Penyusunan laporan fase awal (fondasi proyek) | Penulis | Progress Report 1 dibuat |
| 26/03/2026 | Pembaruan laporan berdasarkan hasil implementasi landing page | Penulis + Editor | Progress Report 2 ditambahkan |
| 02/04/2026 | Pembaruan laporan fase katalog dan detail unit | Penulis + Editor | Progress Report 3 ditambahkan |
| 09/04/2026 | Finalisasi laporan fase halaman pendukung dan kompilasi 4 laporan | Penulis + Editor + Admin | Progress Report 4 final, dokumen siap distribusi |

---

## D. Panel Statistik Progres

| Metrik | Nilai |
|---|---|
| Total fase dalam roadmap | 7 fase |
| Fase selesai (sampai 09/04/2026) | 4 fase |
| Persentase progres keseluruhan | 57% |
| Jumlah progress report tersusun | 4 laporan |
| Build produksi terakhir | Berhasil |
| Status TypeScript terakhir | Tanpa error |
| Halaman publik aktif | Beranda, Tipe Rumah, Detail Unit, Galeri, Fasilitas, Lokasi, Simulasi KPR, Kontak, Promo |

---

## E. Alur Lengkap Progress Report Berkelanjutan

### 1) Progress Report 1 - 12/03/2026
### Fase 1 - Setup Proyek dan Design System

Pada tahap pertama ini, tim memfokuskan pekerjaan pada fondasi teknis agar seluruh fase berikutnya dapat berkembang tanpa friksi arsitektur. Pekerjaan tidak diarahkan pada visual final halaman, melainkan pada kestabilan struktur, konsistensi desain, dan kesiapan komponen reusable.

#### Step by Step Development
1. Tim menyiapkan proyek Next.js App Router berbasis TypeScript sebagai baseline, termasuk struktur direktori inti agar pemisahan concern jelas antara halaman, komponen, data, utilitas, dan tipe.
2. Tailwind CSS v4 diintegrasikan melalui pendekatan token global pada globals, sehingga warna, tipografi, spacing, radius, dan shadow dapat dipakai seragam lintas halaman.
3. Environment variable dasar disiapkan untuk kebutuhan branding dan integrasi eksternal seperti nama site, nomor WhatsApp, pesan default, serta placeholder integrasi peta dan analytics.
4. Utility layer dibangun untuk mempercepat pengembangan komponen, terutama helper class merge, format rupiah, format luas, dan normalisasi nomor telepon.
5. Komponen UI umum dibangun terlebih dahulu (Button, Badge, Card, Input, Typography, Section Wrapper) agar seluruh fase setelahnya tinggal menyusun komposisi tanpa mengulang styling dasar.
6. Komponen layout global dibentuk (Navbar, Mobile Menu, Footer, WhatsApp Float) untuk memastikan semua route punya shell navigasi dan CTA yang konsisten.
7. Konstanta aplikasi disatukan dalam satu sumber kebenaran seperti NAV_LINKS, info kontak, dan jam operasional, untuk mencegah hardcode tersebar di banyak file.
8. Data statis awal disiapkan (units, facilities, testimonials, promos) dengan struktur API-ready, sehingga migrasi ke backend di fase lanjut tidak memerlukan refactor besar di layer UI.
9. Halaman stub disiapkan untuk route inti agar jalur navigasi sudah terbaca utuh sejak awal, walau konten detailnya dikerjakan di fase berikutnya.
10. Validasi build awal dijalankan untuk memastikan baseline proyek bersih dari error sebelum masuk fase implementasi halaman bisnis.

#### Output Fase 1
- Fondasi proyek stabil dan siap skala.
- Design system terpakai konsisten sebagai acuan lintas fase.
- Komponen reusable siap dipakai ulang pada fase 2, 3, dan 4.

#### Transisi ke Laporan Berikutnya
Karena fondasi sudah kuat, tim melanjutkan ke fase 2 untuk mengisi halaman beranda sebagai pintu masuk utama user.

---

### 2) Progress Report 2 - 26/03/2026
### Fase 2 - Landing Page (Halaman Utama)

Pada tahap kedua ini, fokus bergeser ke pengalaman pengguna awal. Landing page disusun agar mampu menyampaikan nilai jual perumahan, membangun trust, dan mendorong aksi awal calon pembeli.

#### Step by Step Development
1. Tim menyusun urutan section berdasarkan funnel informasi: Hero, Keunggulan, Preview Tipe, Lokasi, Testimoni, dan CTA akhir.
2. Hero section diimplementasikan dengan headline utama, ringkasan value proposition, statistik pendukung, dan tombol aksi yang jelas.
3. Data keunggulan ditambahkan agar diferensiasi proyek dapat dibaca cepat oleh pengunjung baru.
4. Section keunggulan dibangun dalam grid responsif untuk menjaga keterbacaan pada mobile, tablet, dan desktop.
5. Komponen UnitCard dipakai sebagai representasi ringkas produk, memuat status unit, spesifikasi inti, dan harga singkat.
6. Preview tipe rumah dihubungkan ke halaman katalog lengkap agar user dapat melanjutkan eksplorasi dengan satu klik.
7. Section lokasi menampilkan konteks aksesibilitas melalui embed map dan daftar titik penting di sekitar kawasan.
8. Section testimoni dikembangkan sebagai client component dengan dukungan swipe mobile, autoplay, kontrol manual, serta indikator aktif.
9. CTA banner akhir dipasang untuk memastikan user punya jalur aksi langsung menuju WhatsApp atau halaman lanjutan.
10. Uji responsif lintas viewport dilakukan untuk memastikan susunan section tidak rusak pada ukuran layar umum.

#### Output Fase 2
- Landing page lengkap 6 section sudah aktif.
- CTA konversi awal tersedia konsisten.
- Pola visual fase 1 tervalidasi di halaman produksi pertama.

#### Transisi ke Laporan Berikutnya
Setelah akuisisi user dari landing page siap, tim melanjutkan fase 3 untuk memperdalam informasi produk melalui katalog dan detail unit.

---

### 3) Progress Report 3 - 02/04/2026
### Fase 3 - Halaman Produk dan Detail Unit

Pada tahap ketiga ini, alur user diperluas dari eksplorasi umum menjadi evaluasi produk detail. Fase ini berfokus pada kemampuan membandingkan unit, melihat galeri, membaca spesifikasi teknis, hingga mengakses CTA konversi langsung.

#### Step by Step Development
1. Model data unit ditingkatkan dengan metadata gambar (src, alt, caption) agar galeri lebih kaya, aksesibel, dan siap untuk kebutuhan SEO gambar.
2. Data unit statis diperbarui supaya setiap tipe memiliki set foto yang lengkap untuk kebutuhan listing dan detail.
3. Helper related units dibuat untuk menyediakan rekomendasi unit lain pada halaman detail dan menjaga user tetap di alur browsing.
4. Komponen Lightbox dibangun dengan fullscreen modal, navigasi tombol, dukungan keyboard, swipe mobile, dan lock body scroll.
5. Komponen Gallery Thumbnail dibangun untuk interaksi dua level: thumbnail sebagai pemilih, foto utama sebagai pemicu lightbox.
6. Unit List Client dibuat untuk fitur filter status, sort harga/luas, counter hasil, serta empty state.
7. Halaman tipe rumah diimplementasikan sebagai katalog responsif dengan kontrol filter dan sort di atas grid.
8. Halaman detail per slug diimplementasikan dengan layout dua kolom berisi galeri, info utama, tab spesifikasi, denah, dan daftar fasilitas.
9. Sticky CTA desktop dan mobile ditambahkan agar aksi konsultasi tetap terlihat saat user membaca detail panjang.
10. Related units ditampilkan untuk memperkaya jalur eksplorasi antar-produk.
11. Metadata detail unit ditambahkan untuk dukungan social preview dan keterbacaan mesin pencari.
12. Build validation dijalankan sampai seluruh route statis dan SSG detail unit lolos tanpa error.

#### Output Fase 3
- Halaman katalog unit berfungsi penuh dengan filter-sort.
- Halaman detail unit lengkap dan interaktif.
- Jalur konversi user dipersingkat lewat CTA sticky dan related units.

#### Transisi ke Laporan Berikutnya
Setelah area produk matang, tim melanjutkan fase 4 untuk memperkuat trust melalui halaman pendukung: galeri, fasilitas, dan lokasi.

---

### 4) Progress Report 4 - 09/04/2026
### Fase 4 - Halaman Pendukung (Galeri, Fasilitas, Lokasi)

Pada tahap keempat ini, fokus diarahkan untuk menutup kebutuhan informasi publik inti. Tujuannya adalah memperkuat keyakinan calon pembeli lewat bukti visual proyek, fasilitas komunal, dan akses lokasi strategis.

#### Step by Step Development
1. Data galeri disusun terstruktur berdasarkan kategori utama: eksterior, interior, fasilitas, dan progres pembangunan.
2. Helper filter kategori disiapkan agar komponen galeri mudah dirawat dan mudah diperluas.
3. Gallery Filter Client dibangun dengan active state jelas dan pengalaman pemilihan kategori yang responsif.
4. Gallery Grid dibangun menggunakan layout responsif 3-2-1 kolom, hover overlay, dan optimasi lazy loading gambar.
5. Lightbox dari fase 3 direuse agar pola interaksi antarpages tetap konsisten dan tidak membingungkan pengguna.
6. Halaman galeri disusun end-to-end dari header hingga grid browsing visual berbasis kategori.
7. Data lokasi disusun dalam lima kategori penting: pendidikan, kesehatan, perbelanjaan, transportasi, dan ibadah.
8. Location Card dibangun untuk menampilkan nama tempat, jarak, estimasi waktu, serta aksi langsung ke maps/directions.
9. Komponen Map Embed reusable dibuat untuk menampilkan peta besar dengan pendekatan yang mudah dipakai ulang.
10. Halaman lokasi diimplementasikan dengan kombinasi peta interaktif dan daftar titik penting dalam grid informatif.
11. Facility Card dibangun lalu diintegrasikan ke halaman fasilitas dengan grid 2 kolom desktop dan 1 kolom mobile.
12. Navigasi desktop dan mobile diverifikasi agar tautan ke galeri, fasilitas, dan lokasi konsisten di seluruh breakpoint.
13. Verifikasi build akhir fase dijalankan untuk memastikan seluruh penambahan halaman stabil dan bebas error TypeScript.

#### Output Fase 4
- Halaman galeri, fasilitas, dan lokasi selesai serta terintegrasi dengan sistem UI yang sudah ada.
- Data pendukung proyek tampil lebih kuat untuk kebutuhan trust calon pembeli.
- Konsistensi design system tetap terjaga berkat reuse komponen lintas fase.

#### Status Akhir per 09/04/2026
- Fase 1 sampai Fase 4: selesai.
- Progres roadmap: 4 dari 7 fase (57%).
- Build produksi: berhasil.
- TypeScript: tanpa error.

---

## F. Kesimpulan

Progres pengembangan Website Marketing SIMDP hingga 09/04/2026 menunjukkan kemajuan yang signifikan dan terstruktur. Empat fase awal telah terdokumentasi sebagai empat progress report berkelanjutan dengan alur yang jelas: fondasi teknis, halaman akuisisi, pendalaman produk, lalu penguatan trust melalui halaman pendukung.

Secara implementasi, komponen inti sudah solid, struktur data sudah API-ready, serta rute publik utama telah aktif dan stabil. Kualitas teknis juga terjaga melalui validasi build dan pengecekan TypeScript yang bersih. Dengan kondisi ini, sistem berada pada posisi kuat untuk masuk ke fase 5 (Form Leads, Simulasi KPR, Kontak), dilanjutkan fase 6 (SEO dan performa), dan fase 7 (testing menyeluruh serta deployment).

Tingkat kesiapan saat ini berada pada 57% dari total roadmap, dengan fondasi yang cukup matang untuk mendorong tahap konversi dan produksi final.

---

Laporan diperbarui: 09/04/2026
