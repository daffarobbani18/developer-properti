# PROGRESS REPORT MINGGU KE-3

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-04-17 - 2026-04-23  
**Minggu ke:** 3  
**PIC:** Tim Frontend Web Admin

---

## 1. Ringkasan Minggu Ini

Minggu ke-3 berfokus pada penguatan kontrol akses agar role-based flow tidak hanya berhenti di UI, tetapi juga aman pada level route. Pekerjaan inti yang diselesaikan adalah implementasi guard berbasis role di proxy, pembatasan prefix route per role, penambahan logout dengan konfirmasi, serta perbaikan bug routing dashboard yang sempat melempar user kembali ke login.

**Status umum minggu ini:** Hijau

**Ringkasan singkat:**
1. Akses URL langsung yang tidak sesuai role sudah diblok dan diarahkan ke halaman yang tepat.
2. Root route sudah menjadi role-aware redirect, sehingga tidak lagi menimbulkan loop ke login.
3. Fitur logout selesai dengan alur pembersihan session yang jelas dan aman.

---

## 2. Progress per Sistem

### A. Web Internal + Backend

Fokus utama minggu ini adalah hardening alur otorisasi route pada web admin.

**Pekerjaan yang dilakukan:**
1. Memindahkan mekanisme guard ke file proxy agar sejalan dengan praktik Next.js terbaru.
2. Menambahkan pemetaan role ke home route role masing-masing.
3. Menambahkan daftar prefix route yang diizinkan untuk setiap role.
4. Menambahkan validasi cookie role untuk route yang dilindungi.
5. Menambahkan fallback redirect saat role mencoba mengakses route yang tidak diizinkan.
6. Menambahkan tombol logout pada sidebar dengan dialog konfirmasi.
7. Menambahkan proses logout yang membersihkan:
   - localStorage
   - sessionStorage
   - cookie session
8. Memperbaiki bug dashboard menu yang sebelumnya dapat mendorong user keluar ke halaman login.

**Hasil minggu ini:**
1. Guard route role-based aktif dan bekerja sesuai skenario.
2. Akses manual URL lintas role tidak lagi lolos.
3. Root route langsung mengarahkan user ke dashboard role tanpa loop.
4. Logout flow selesai dan tidak menyisakan session residual.

**Validasi yang dilakukan:**
1. Uji role admin mengakses route role lain.
2. Uji role non-admin mengakses route admin.
3. Uji refresh, direct URL access, dan logout-login ulang.
4. Uji klik menu Dashboard berulang dari sidebar.

**Status:** On Track

### B. Website Publik + Portal Customer

Pada minggu ini belum ada implementasi fitur baru di website publik/portal. Fokus tim tetap pada stabilisasi akses dan keamanan route di web admin.

**Pekerjaan yang dilakukan:**
1. Tidak ada perubahan fitur publik.
2. Monitoring stabilitas route publik yang sudah berjalan.

**Hasil minggu ini:**
1. Tidak ditemukan dampak regresi dari perubahan web admin.

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

| Area | Target Minggu 3 | Realisasi | Status |
|------|------------------|-----------|--------|
| Web Internal + Backend | Menambahkan route guard role-based + logout flow | Selesai | On Track |
| Website Publik + Portal Customer | Menjaga stabilitas layanan yang sudah ada | Selesai | On Track |
| Mobile | Mulai implementasi fitur role-based mobile | Belum dikerjakan minggu ini | Delayed |

**Penjelasan target:**
Target sprint minggu ke-3 tercapai untuk domain web admin. Fondasi otorisasi sudah siap sehingga pengembangan dashboard per role dapat dilanjutkan dengan risiko akses yang lebih rendah.

---

## 4. Kendala Minggu Ini

1. Muncul warning terkait pendekatan middleware lama pada framework.
2. Bug routing: klik dashboard dari sidebar sempat mengarah ke root lalu kembali ke login.
3. Potensi ketidaksinkronan antara sumber role di cookie dan storage browser.

**Penanganan:**
1. Migrasi guard ke proxy sesuai pola framework terbaru.
2. Menetapkan root redirect berbasis role.
3. Menjaga konsistensi role pada cookie dan storage saat login/logout.

---

## 5. Kesimpulan Minggu Ini

Minggu ke-3 berhasil menutup gap terbesar pada sisi keamanan navigasi: route guard role-based, redirect root yang benar, dan logout flow yang aman. Dengan hasil ini, web admin siap masuk ke fase visualisasi dashboard per role menggunakan data operasional.

---

## 6. Rencana Minggu Berikutnya

1. Menyelesaikan dashboard per role untuk semua role utama.
2. Menghubungkan KPI dashboard ke data dummy modul CRM, Keuangan, dan Proyek.
3. Menambah section snapshot agar tiap role melihat prioritas kerja secara cepat.
4. Menjalankan build validasi dan menyiapkan proses deployment web admin.

---

## 7. Lampiran Screenshot

1. Konfigurasi proxy role-based route guard.
2. Dialog konfirmasi logout di sidebar.
3. Bukti redirect root ke dashboard role.
4. Bukti akses URL terblok saat role tidak sesuai.

---

## 8. Rincian Aktivitas Mingguan (Kronologis)

Rangkaian aktivitas minggu ke-3 disusun berurutan agar transisi dari pembatasan UI ke pembatasan route dapat berjalan aman:

1. Hari 1:
   - Meninjau celah akses yang masih mungkin terjadi melalui direct URL.
   - Menetapkan kebutuhan guard pada lapisan route handling, bukan hanya pada komponen navigasi.
2. Hari 2:
   - Menyiapkan mapping role ke route home dan daftar prefix route yang diizinkan.
   - Menentukan fallback behavior jika role mengakses route di luar scope.
3. Hari 3:
   - Implementasi guard berbasis proxy dengan validasi role dari cookie session.
   - Menambahkan redirect root agar langsung role-aware.
4. Hari 4:
   - Menambahkan fitur logout dengan konfirmasi di sidebar.
   - Menutup alur cleanup session agar state tidak tersisa setelah logout.
5. Hari 5:
   - Menyelesaikan bug routing dashboard yang sempat menyebabkan user kembali ke halaman login.
   - Menjalankan retest lintas role untuk memastikan redirect/fallback konsisten.

---

## 9. Detail Deliverable Teknis Minggu Ini

Seluruh deliverable berikut selesai pada minggu ini dan dipakai sebagai baseline keamanan navigasi:

1. Deliverable Guard Route:
   - Guard role-based aktif pada route terproteksi.
   - Akses route lintas role yang tidak berizin otomatis ditolak.
2. Deliverable Redirect Root:
   - Route root tidak lagi generik.
   - Root route secara otomatis mengarah ke dashboard role yang valid.
3. Deliverable Logout Flow:
   - Tersedia dialog konfirmasi logout di sidebar.
   - Proses logout membersihkan semua artefak session yang relevan.
4. Deliverable Stabilitas Routing:
   - Bug loop dashboard ke login berhasil ditutup.
   - Perilaku navigasi antar menu menjadi lebih stabil.

---

## 10. Dampak Progres Terhadap Operasional Produk

Pekerjaan minggu ke-3 berdampak besar pada reliability sistem dan keamanan akses:

1. Dampak pada keamanan akses:
   - Menu tersembunyi saja tidak lagi menjadi satu-satunya pengaman.
   - URL manual yang tidak sah sudah terblok pada level route.
2. Dampak pada pengalaman pengguna:
   - Pengguna tidak lagi terpental ke login saat klik dashboard dalam kondisi valid.
   - Alur keluar aplikasi menjadi lebih aman dan jelas.
3. Dampak pada kesiapan pengembangan:
   - Guard yang stabil memberi landasan aman untuk ekspansi dashboard role-based minggu berikutnya.

---

## 11. Checklist Verifikasi dan Kualitas

Checklist quality gate yang dipakai sebelum penutupan sprint:

1. [x] Role admin ditolak saat mengakses route khusus role lain yang tidak diizinkan.
2. [x] Role non-admin ditolak saat mengakses route admin.
3. [x] Root route redirect ke dashboard role yang benar.
4. [x] Logout menghapus session dan mencegah akses ulang route protected.
5. [x] Klik menu dashboard tidak memicu loop ke login.
6. [x] Build dan runtime tidak menunjukkan error baru akibat guard.

---

## 12. Analisis Capaian vs Komitmen Sprint

Analisis ini menilai tingkat ketercapaian komitmen sprint minggu ke-3 dari sudut pandang keamanan navigasi dan kestabilan session.

1. Komitmen utama sprint:
   - Menutup celah akses URL langsung lintas role.
   - Menstabilkan redirect root agar tidak memicu loop.
   - Menyelesaikan alur logout yang aman.
2. Capaian aktual:
   - Guard route role-based selesai dan tervalidasi.
   - Root route sudah role-aware redirect.
   - Logout membersihkan session lintas storage dan cookie.
3. Deviasi yang tercatat:
   - Tidak ada deviasi mayor pada target domain web admin.
   - Scope publik dan mobile tetap ditahan sesuai prioritas sprint.
4. Evaluasi umum:
   - Sprint ini berhasil menutup risiko akses terbesar sebelum dashboard diperdalam.
   - Keputusan fokus keamanan lebih dulu terbukti menurunkan risiko bug di sprint lanjutan.

---

## 13. Metrik Operasional Mingguan

1. Indikator Keamanan Akses:
   - Skenario direct URL lintas role menghasilkan fallback/penolakan sesuai desain.
   - Route protected tidak lagi dapat diakses tanpa role valid.
2. Indikator Stabilitas Routing:
   - Perilaku root route konsisten setelah login.
   - Bug menu dashboard kembali ke login tidak muncul pada retest akhir.
3. Indikator Kebersihan Session:
   - Logout flow menutup sesi aktif tanpa residu state.
   - Akses ulang route protected pasca-logout berhasil ditolak.
4. Indikator Kesiapan Sprint Lanjutan:
   - Fondasi akses route siap dipakai untuk ekspansi dashboard role-based.
   - Risiko refactor access control pada minggu ke-4 menurun signifikan.

---

## 14. Risiko Lanjutan dan Mitigasi Minggu Ke-4

1. Risiko ketidakkonsistenan konten dashboard antar role:
   - Mitigasi: struktur konfigurasi dashboard dipusatkan dalam satu mapping role.
2. Risiko KPI sulit diverifikasi saat data terlalu statis:
   - Mitigasi: menghubungkan dashboard ke dataset dummy lintas modul agar angka lebih realistis.
3. Risiko build/deploy mismatch pada monorepo:
   - Mitigasi: validasi build per direktori aplikasi sebelum proses deployment.
4. Risiko regresi setelah penambahan route dashboard baru:
   - Mitigasi: pengujian lintas role terhadap guard + dashboard setelah implementasi selesai.

---

## 15. Keputusan Sprint dan Dukungan Lintas Tim

1. Keputusan teknis:
   - Guard proxy role-based ditetapkan sebagai baseline keamanan navigasi.
   - Root redirect role-aware dijadikan pola standar untuk semua role.
2. Keputusan operasional:
   - QA lintas role menjadi langkah wajib sebelum penutupan sprint.
   - Logout verification dimasukkan ke checklist regresi dasar.
3. Dukungan yang dibutuhkan:
   - Konsistensi data role di sisi frontend agar dashboard minggu ke-4 mudah ditautkan.
   - Sinkronisasi cepat antar tim untuk review mapping dashboard per role.

---

**Catatan:** Laporan ini hanya memuat pekerjaan yang sudah selesai dikerjakan pada minggu ke-3.
