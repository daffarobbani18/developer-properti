# PROGRESS REPORT MINGGU KE-4

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-04-24 - 2026-04-30  
**Minggu ke:** 4  
**PIC:** Tim Frontend Web Admin

---

## 1. Ringkasan Minggu Ini

Minggu ke-4 difokuskan pada penyelesaian dashboard berbasis role agar setiap role memiliki halaman ringkasan kerja yang relevan. Selain implementasi dashboard, minggu ini juga mencakup validasi build menyeluruh dan troubleshooting deployment issue yang muncul saat percobaan rilis ke Vercel.

**Status umum minggu ini:** Hijau

**Ringkasan singkat:**
1. Dashboard per role selesai untuk 6 role utama.
2. KPI dashboard sudah menggunakan data dummy nyata dari modul CRM, Keuangan, dan Proyek.
3. Build web admin berhasil dan route statis per role berhasil diprerender.
4. Masalah DEPLOYMENT_NOT_FOUND pada environment deployment berhasil diidentifikasi akar masalahnya.

---

## 2. Progress per Sistem

### A. Web Internal + Backend

Fokus minggu ini adalah delivery dashboard role-specific yang siap dipakai demo operasional internal.

**Pekerjaan yang dilakukan:**
1. Membuat route dashboard dinamis berbasis role: dashboard/[role].
2. Menyediakan halaman dashboard untuk role:
   - admin
   - inventory
   - sales
   - finance
   - legal
   - supervisor
3. Menyusun konfigurasi konten dashboard per role (judul, subtitle, quick links, KPI).
4. Menghubungkan KPI dashboard ke data dummy modul:
   - CRM (lead, transaksi, unit)
   - Keuangan (cashflow, tagihan)
   - Proyek (progress, kendala)
5. Menambahkan snapshot section agar user melihat prioritas data inti tanpa membuka modul detail.
6. Perbaikan kontras visual pada komponen statistik agar terbaca di semua kondisi warna kartu.
7. Build validation dari direktori aplikasi yang benar untuk memastikan artifact produksi valid.

**Hasil minggu ini:**
1. Dashboard role-based siap dipakai dan lebih kontekstual per role.
2. KPI tidak lagi statis murni; sudah ditarik dari source data dummy modul.
3. UI dashboard lebih rapi, konsisten, dan responsif di mobile maupun desktop.
4. Build berhasil dengan status generate static pages penuh.

**Validasi yang dilakukan:**
1. Uji akses ke seluruh route dashboard per role.
2. Uji konsistensi data snapshot terhadap dataset modul.
3. Uji build produksi web admin hingga selesai.
4. Uji fallback route guard dan redirect role setelah login.

**Status:** On Track

### B. Website Publik + Portal Customer

Minggu ini belum ada implementasi fitur publik baru; namun ada aktivitas penting pada sisi deployment readiness lintas aplikasi.

**Pekerjaan yang dilakukan:**
1. Meninjau konfigurasi deployment untuk web admin dan web publik.
2. Menganalisis issue DEPLOYMENT_NOT_FOUND pada URL hasil deploy.
3. Memastikan strategi pemisahan root directory sesuai struktur monorepo.

**Hasil minggu ini:**
1. Akar masalah deployment teridentifikasi: kesalahan target project/root directory.
2. Langkah deployment untuk web admin dan web publik menjadi jelas.

**Status:** On Track

### C. Mobile

Belum ada aktivitas implementasi mobile pada minggu ini.

**Pekerjaan yang dilakukan:**
1. Tidak ada perubahan kode.

**Hasil minggu ini:**
1. Tidak ada progres teknis baru.

**Status:** Delayed

---

## 3. Progress Berdasarkan Target

| Area | Target Minggu 4 | Realisasi | Status |
|------|------------------|-----------|--------|
| Web Internal + Backend | Dashboard per role + KPI dari data dummy + build validasi | Selesai | On Track |
| Website Publik + Portal Customer | Persiapan deployment lintas project | Selesai | On Track |
| Mobile | Melanjutkan implementasi fitur inti | Belum dikerjakan minggu ini | Delayed |

**Penjelasan target:**
Target utama minggu ke-4 tercapai dengan delivery dashboard role-based yang siap presentasi. Penyelesaian deployment issue juga menurunkan risiko rilis minggu berikutnya.

---

## 4. Kendala Minggu Ini

1. Percobaan build awal dilakukan dari direktori yang tidak tepat sehingga proses gagal.
2. Muncul error DEPLOYMENT_NOT_FOUND setelah login pada URL deploy.
3. Perlu sinkronisasi route dashboard agar tidak bentrok dengan redirect root.

**Penanganan:**
1. Menjalankan build dari direktori aplikasi web admin yang benar.
2. Menetapkan root directory deployment sesuai target aplikasi pada monorepo.
3. Menyesuaikan route dan redirect agar konsisten dengan role home mapping.

---

## 5. Kesimpulan Minggu Ini

Minggu ke-4 menghasilkan lompatan fungsional terbesar pada web admin: dashboard per role selesai dengan data yang lebih bermakna dan validasi produksi berhasil. Risiko deployment juga turun karena akar masalah konfigurasi sudah ditemukan dan didokumentasikan.

---

## 6. Rencana Minggu Berikutnya

1. Mengembangkan fitur marketing website publik: simulasi KPR real-time.
2. Menempatkan kalkulator simulasi KPR pada halaman detail unit agar harga terisi otomatis.
3. Menyesuaikan desain detail unit agar sama dengan referensi visual yang disediakan.
4. Melakukan stabilisasi final route publik detail unit dan validasi endpoint.

---

## 7. Lampiran Screenshot

1. Dashboard role admin, sales, finance, legal, inventory, supervisor.
2. Snapshot data per role pada halaman dashboard.
3. Hasil build web admin yang menampilkan route role prerendered.
4. Bukti analisis error deployment dan perbaikan konfigurasi root project.

---

## 8. Rincian Aktivitas Mingguan (Kronologis)

Berikut urutan aktivitas utama minggu ke-4 yang mengarah pada penyelesaian dashboard role-based:

1. Hari 1:
   - Menentukan kerangka dashboard dinamis berbasis parameter role.
   - Mendefinisikan kebutuhan konten per role: KPI, quick actions, dan ringkasan prioritas.
2. Hari 2:
   - Implementasi route dashboard per role.
   - Menyiapkan konfigurasi dashboard agar mudah dipelihara untuk 6 role utama.
3. Hari 3:
   - Integrasi data dummy lintas modul (CRM, Keuangan, Proyek).
   - Menyusun logika perhitungan KPI dari dataset yang tersedia.
4. Hari 4:
   - Menambahkan section snapshot untuk menampilkan item prioritas per role.
   - Melakukan polishing UI: jarak antarkartu, kontras teks, dan responsivitas grid.
5. Hari 5:
   - Build validation produksi.
   - Troubleshooting error deployment dan dokumentasi langkah koreksi konfigurasi.

---

## 9. Detail Deliverable Teknis Minggu Ini

Output teknis yang diselesaikan minggu ini:

1. Deliverable Dashboard Per Role:
   - Halaman dashboard tersedia untuk admin, inventory, sales, finance, legal, dan supervisor.
   - Route role-specific terintegrasi dengan alur guard yang sudah dibuat pada sprint sebelumnya.
2. Deliverable KPI Data Layer:
   - KPI tidak lagi murni hardcoded tampilan.
   - Nilai KPI diturunkan dari dataset dummy modul agar lebih realistis untuk demo operasional.
3. Deliverable Snapshot Prioritas:
   - Tiap role memiliki ringkasan data yang paling relevan dengan pekerjaan hariannya.
   - User mendapat konteks awal tanpa harus membuka banyak halaman modul.
4. Deliverable Build dan Readiness:
   - Build produksi berhasil pada direktori aplikasi yang benar.
   - Daftar route prerender terverifikasi sesuai ekspektasi.

---

## 10. Dampak Progres Terhadap Operasional Produk

Dampak minggu ke-4 tidak hanya pada UI, tetapi juga pada kesiapan presentasi dan operasional internal:

1. Dampak pada visibilitas kerja role:
   - Setiap role langsung melihat metrik yang berhubungan dengan tanggung jawabnya.
   - Dashboard menjadi titik masuk yang lebih informatif.
2. Dampak pada kualitas keputusan harian:
   - Snapshot prioritas mempercepat identifikasi item yang perlu tindakan.
   - Mengurangi waktu navigasi awal sebelum user masuk ke modul detail.
3. Dampak pada kesiapan rilis:
   - Build produksi tervalidasi.
   - Risiko deployment menurun karena akar masalah DEPLOYMENT_NOT_FOUND telah diketahui.

---

## 11. Checklist Verifikasi dan Kualitas

Checklist verifikasi yang dijalankan:

1. [x] Dashboard role admin dapat diakses dan menampilkan KPI.
2. [x] Dashboard role inventory dapat diakses dan menampilkan KPI.
3. [x] Dashboard role sales dapat diakses dan menampilkan KPI.
4. [x] Dashboard role finance/legal/supervisor dapat diakses dan menampilkan KPI.
5. [x] Snapshot section tampil sesuai konteks role.
6. [x] Build produksi berhasil hingga tahap prerender route.
7. [x] Tidak ada error TypeScript baru dari perubahan minggu ini.

---

## 12. Analisis Capaian vs Komitmen Sprint

1. Komitmen utama sprint:
   - Menyelesaikan dashboard berbasis role untuk seluruh role utama.
   - Menghubungkan KPI dashboard ke data dummy modul operasional.
   - Menjalankan build produksi dan memvalidasi readiness rilis.
2. Capaian aktual:
   - Dashboard 6 role selesai sesuai target.
   - KPI dan snapshot per role sudah menggunakan sumber data lintas modul.
   - Build produksi berhasil dan route penting tervalidasi.
3. Deviasi yang tercatat:
   - Tidak ada deviasi kritikal pada scope inti.
   - Fokus mobile tetap ditunda karena prioritas sprint dipusatkan ke readiness web admin.
4. Evaluasi umum:
   - Sprint ini menutup kebutuhan visibilitas operasional per role.
   - Tim berhasil menurunkan risiko rilis melalui identifikasi dini isu deployment.

---

## 13. Metrik Operasional Mingguan

1. Indikator Cakupan Role Dashboard:
   - Seluruh role utama memiliki halaman dashboard yang dapat diakses.
   - Tidak ada role inti yang tertinggal dari baseline fitur.
2. Indikator Relevansi Informasi:
   - KPI tidak lagi generik dan sudah terhubung ke konteks data modul.
   - Snapshot prioritas membantu pembacaan status kerja tanpa navigasi panjang.
3. Indikator Kesiapan Produksi:
   - Build aplikasi berhasil diselesaikan hingga tahap prerender route.
   - Temuan deployment terdokumentasi sebagai bahan perbaikan proses rilis.
4. Indikator Stabilitas Arsitektur:
   - Integrasi dashboard tetap kompatibel dengan guard role yang sudah stabil.
   - Tidak muncul error TypeScript baru dari perubahan sprint ini.

---

## 14. Risiko Lanjutan dan Mitigasi Minggu Ke-5

1. Risiko pergeseran fokus dari web admin ke web publik menyebabkan context switching tinggi:
   - Mitigasi: dokumentasi handoff dashboard diselesaikan sebelum pindah fokus sprint.
2. Risiko perubahan visual besar di website publik memicu regresi layout:
   - Mitigasi: pendekatan iteratif dengan build + smoke test setelah patch besar.
3. Risiko route publik bermasalah saat integrasi fitur baru:
   - Mitigasi: validasi route kunci sebagai bagian wajib penutupan task.
4. Risiko timeline mobile makin tertinggal:
   - Mitigasi: menjaga backlog mobile tetap terpetakan agar mudah diaktifkan kembali pada fase berikutnya.

---

## 15. Keputusan Sprint dan Dukungan Lintas Tim

1. Keputusan teknis:
   - Dashboard role-based ditetapkan sebagai baseline operasional web admin.
   - Root directory deployment diperlakukan sebagai parameter wajib pada checklist rilis.
2. Keputusan operasional:
   - Sprint berikutnya diprioritaskan untuk fitur conversion website publik.
   - Verifikasi build dan route menjadi quality gate minimum sebelum demonstrasi.
3. Dukungan yang dibutuhkan:
   - Sinkronisasi cepat antar tim saat peralihan domain kerja ke website publik.
   - Penyelarasan ekspektasi visual referensi agar revisi UI tidak berulang panjang.

---

**Catatan:** Laporan ini hanya memuat pekerjaan yang sudah selesai dikerjakan pada minggu ke-4.