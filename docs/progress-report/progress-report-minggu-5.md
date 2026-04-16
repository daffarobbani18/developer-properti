# PROGRESS REPORT MINGGU KE-5

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-05-01 - 2026-05-07  
**Minggu ke:** 5  
**PIC:** Tim Frontend Website Publik

---

## 1. Ringkasan Minggu Ini

Minggu ke-5 difokuskan penuh pada fitur conversion website marketing melalui simulasi KPR real-time. Pekerjaan dilakukan secara iteratif: mulai dari pembuatan kalkulator, integrasi ke halaman detail unit, penyelarasan desain agar sangat dekat dengan referensi, sampai perbaikan route 404 dan perapian CSS akhir.

**Status umum minggu ini:** Hijau

**Ringkasan singkat:**
1. Kalkulator simulasi KPR real-time selesai dengan rumus anuitas standar.
2. Kalkulator dipindahkan ke halaman detail unit agar harga properti terisi otomatis.
3. Desain halaman detail unit direvisi mengikuti referensi visual yang disediakan.
4. Isu 404 pada route unit detail berhasil ditutup dan endpoint tervalidasi sukses.
5. CSS yang sempat kacau sudah dirapikan dan dibangun ulang pada server terbaru.

---

## 2. Progress per Sistem

### A. Web Internal + Backend

Pada minggu ini tidak ada fitur baru web admin/backoffice; fokus tim diarahkan ke website publik untuk peningkatan konversi marketing.

**Pekerjaan yang dilakukan:**
1. Monitoring stabilitas hasil sprint web admin sebelumnya.
2. Tidak ada perubahan fungsional pada dashboard/guard.

**Hasil minggu ini:**
1. Baseline web admin tetap stabil.

**Status:** On Track

### B. Website Publik + Portal Customer

Ini adalah area utama sprint minggu ke-5.

**Pekerjaan yang dilakukan:**
1. Membangun komponen kalkulator KPR real-time:
   - input DP
   - input suku bunga
   - input tenor
   - output cicilan bulanan dan plafon pinjaman
2. Menggunakan rumus anuitas standar perbankan untuk simulasi.
3. Menambahkan halaman simulasi KPR mandiri sebagai iterasi awal.
4. Merevisi implementasi agar kalkulator ditempatkan di halaman detail unit sesuai arahan.
5. Menghubungkan harga unit ke kalkulator secara otomatis dari data unit.
6. Menyesuaikan desain detail unit agar sangat dekat dengan referensi desain yang diberikan:
   - top bar simple fixed
   - breadcrumb premium
   - komposisi galeri utama + thumbnail
   - panel kalkulator sticky
7. Menangani isu route 404 pada unit detail:
   - analisis proses server di port
   - perbaikan pembacaan dynamic params sesuai pola framework
   - restart server dengan build terbaru
8. Menangani CSS kacau pasca revisi besar:
   - rapikan alignment galeri
   - rapikan komposisi panel kanan
   - hilangkan elemen tambahan yang mengganggu hierarki visual
9. Verifikasi endpoint route detail unit dengan respons sukses.

**Hasil minggu ini:**
1. Fitur simulasi KPR siap dipakai user untuk eksplorasi skema cicilan.
2. Experience detail unit meningkat karena user tidak perlu input harga manual.
3. Route unit detail stabil dan dapat diakses normal.
4. Tampilan final kembali rapi pada desktop dan mobile.

**Validasi yang dilakukan:**
1. Build produksi website publik berhasil.
2. Route statis unit detail ter-generate.
3. Uji akses endpoint unit detail menghasilkan status sukses.
4. Uji visual setelah hard refresh pada server terbaru.

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

| Area | Target Minggu 5 | Realisasi | Status |
|------|------------------|-----------|--------|
| Web Internal + Backend | Menjaga stabilitas hasil sprint sebelumnya | Selesai | On Track |
| Website Publik + Portal Customer | Simulasi KPR real-time + integrasi ke detail unit + stabilisasi route/CSS | Selesai | On Track |
| Mobile | Lanjutan implementasi fitur inti | Belum dikerjakan minggu ini | Delayed |

**Penjelasan target:**
Target utama minggu ke-5 tercapai penuh di area website publik: fitur conversion utama (simulasi KPR) sudah selesai dan route detail unit yang sempat bermasalah sudah stabil.

---

## 4. Kendala Minggu Ini

1. Port aplikasi sempat dipakai proses lama sehingga server tidak membaca perubahan terbaru.
2. Route detail unit sempat 404 karena kombinasi server stale dan pembacaan params dinamis.
3. Revisi desain besar memunculkan ketidakseimbangan CSS pada beberapa bagian layout.

**Penanganan:**
1. Terminasi proses lama dan menjalankan ulang server dari build terbaru.
2. Menyesuaikan implementasi dynamic params sesuai kebutuhan framework.
3. Melakukan perapian CSS bertahap hingga layout kembali stabil.

---

## 5. Kesimpulan Minggu Ini

Minggu ke-5 berhasil menutup fitur marketing paling penting pada fase ini: simulasi KPR real-time di detail unit dengan harga otomatis. Selain itu, masalah teknis kritikal (404 route dan CSS kacau) juga berhasil diselesaikan pada minggu yang sama sehingga output akhir tetap siap pakai.

---

## 6. Rencana Minggu Berikutnya

1. Tidak ada rencana tambahan dimasukkan pada dokumen ini karena cakupan laporan diminta sampai minggu ke-5.
2. Seluruh poin di laporan ini adalah pekerjaan yang sudah dikerjakan dan sudah divalidasi.

---

## 7. Lampiran Screenshot

1. Detail unit final dengan panel simulasi KPR sticky.
2. Slider DP, suku bunga, tenor dengan hasil cicilan real-time.
3. Bukti build website publik berhasil.
4. Bukti endpoint unit detail dapat diakses normal (status sukses).
5. Perbandingan sebelum/sesudah perapian CSS.

---

## 8. Rincian Aktivitas Mingguan (Kronologis)

Minggu ke-5 berjalan dengan pola iteratif cepat karena ada kombinasi pengembangan fitur dan penanganan isu produksi lokal:

1. Hari 1:
   - Menyusun requirement simulasi KPR berdasarkan kebutuhan user marketing.
   - Menentukan parameter perhitungan utama: DP, bunga tahunan, tenor.
2. Hari 2:
   - Implementasi komponen kalkulator KPR real-time.
   - Implementasi formula anuitas dan format output rupiah.
3. Hari 3:
   - Integrasi kalkulator ke halaman simulasi KPR mandiri sebagai baseline validasi fitur.
   - Penyesuaian komponen agar menerima data harga unit sebagai properti dinamis.
4. Hari 4:
   - Relokasi kalkulator ke halaman detail unit sesuai arahan.
   - Revisi desain detail unit agar mendekati referensi visual yang diberikan.
   - Penanganan awal isu route 404 pada detail unit.
5. Hari 5:
   - Investigasi process stale pada port aplikasi.
   - Restart server pada build terbaru.
   - Perapian CSS akhir setelah revisi besar layout.
   - Verifikasi endpoint detail unit menghasilkan status sukses.

---

## 9. Detail Deliverable Teknis Minggu Ini

Deliverable yang sudah selesai pada sprint ini:

1. Deliverable Fitur Simulasi KPR:
   - Input parameter interaktif (DP, bunga, tenor).
   - Output cicilan bulanan yang berubah real-time.
   - Output plafon pinjaman untuk transparansi estimasi.
2. Deliverable Integrasi Detail Unit:
   - Harga properti otomatis dibaca dari data unit.
   - User tidak perlu memasukkan harga secara manual.
   - Pengalaman simulasi menjadi lebih natural pada konteks keputusan pembelian.
3. Deliverable Revisi Visual:
   - Struktur halaman detail unit dirombak untuk mendekati referensi.
   - Komposisi galeri, informasi properti, dan panel simulasi dibuat lebih konsisten.
4. Deliverable Stabilitas Route dan Runtime:
   - Route detail unit yang sempat 404 sudah normal kembali.
   - Endpoint tervalidasi dengan respons sukses setelah server diperbarui.
5. Deliverable Stabilisasi CSS:
   - Alignment komponen utama dirapikan.
   - Hierarki visual diperjelas untuk desktop dan mobile.

---

## 10. Dampak Progres Terhadap Operasional Produk

Dampak sprint minggu ke-5 sangat terasa pada sisi conversion funnel marketing:

1. Dampak pada conversion intent:
   - User bisa langsung mengukur estimasi cicilan dari unit yang sedang dilihat.
   - Friksi pengguna berkurang karena harga terisi otomatis.
2. Dampak pada kualitas presentasi produk:
   - Detail unit menjadi lebih persuasif dengan kombinasi informasi properti dan simulasi finansial dalam satu layar.
   - Tim marketing memiliki materi demo yang lebih kuat untuk calon pembeli.
3. Dampak pada stabilitas teknis:
   - Isu 404 dan CSS kacau yang berpotensi menurunkan trust user sudah diselesaikan.
   - Build serta endpoint check memperkuat confidence sebelum tahap lanjutan.

---

## 11. Checklist Verifikasi dan Kualitas

Checklist validasi akhir minggu:

1. [x] Komponen simulasi KPR menghitung cicilan real-time saat slider berubah.
2. [x] Harga unit pada kalkulator terisi otomatis dari data detail unit.
3. [x] Route detail unit astoria dapat diakses normal.
4. [x] Route detail unit bvlgari dapat diakses normal.
5. [x] Build website publik berhasil.
6. [x] Server berjalan pada build terbaru (bukan process stale).
7. [x] Layout akhir tampil stabil setelah perapian CSS.

---

## 12. Analisis Capaian vs Komitmen Sprint

1. Komitmen utama sprint:
   - Menyelesaikan fitur simulasi KPR real-time pada website publik.
   - Menempatkan kalkulator pada konteks detail unit dengan harga otomatis.
   - Menutup isu route 404 dan merapikan CSS pascarevisi desain besar.
2. Capaian aktual:
   - Fitur simulasi KPR selesai dan interaksi slider berjalan real-time.
   - Integrasi ke detail unit berhasil dengan pembacaan harga otomatis.
   - Isu 404 dan ketidakseimbangan layout berhasil ditutup dalam sprint yang sama.
3. Deviasi yang tercatat:
   - Tidak ada deviasi mayor terhadap target inti minggu ke-5.
   - Fokus tim sengaja dipusatkan pada domain web publik sehingga area lain bersifat maintenance.
4. Evaluasi umum:
   - Sprint ini menghasilkan dampak conversion paling nyata dibanding sprint sebelumnya.
   - Kombinasi delivery fitur dan incident closure berjalan efektif karena validasi build/endpoint dilakukan disiplin.

---

## 13. Metrik Operasional Mingguan

1. Indikator Kematangan Fitur:
   - Simulasi merespons perubahan parameter tanpa perlu refresh halaman.
   - Input harga properti terisi otomatis sehingga mengurangi langkah manual user.
2. Indikator Stabilitas Route:
   - Route unit detail penting dapat diakses kembali setelah perbaikan.
   - Verifikasi endpoint dipakai sebagai bukti objektif penutupan isu routing.
3. Indikator Kualitas Visual:
   - Perapian CSS menormalkan kembali komposisi layout desktop dan mobile.
   - Elemen visual pengganggu yang menurunkan hierarki informasi telah dihilangkan.
4. Indikator Readiness Produk:
   - Build website publik lulus setelah perubahan fitur dan desain.
   - Hasil sprint siap dipakai untuk demo alur conversion berbasis detail unit.

---

## 14. Risiko Lanjutan dan Mitigasi Pasca Sprint

1. Risiko regresi visual saat ada revisi lanjutan pada detail unit:
   - Mitigasi: melakukan visual regression check bertahap pada breakpoint utama.
2. Risiko perhitungan simulasi disalahartikan sebagai angka final bank:
   - Mitigasi: mempertahankan disclaimer estimasi pada panel simulasi.
3. Risiko incident server stale terulang saat validasi lokal:
   - Mitigasi: checklist kill/start process sebelum melakukan verifikasi endpoint penting.
4. Risiko scope conversion berikutnya meluas tanpa baseline performa:
   - Mitigasi: menetapkan baseline metrik interaksi halaman sebelum menambah fitur baru.

---

## 15. Keputusan Sprint dan Arah Lanjutan

1. Keputusan teknis:
   - Integrasi simulasi KPR pada detail unit dipertahankan sebagai pendekatan utama.
   - Endpoint check dijadikan prosedur wajib untuk menutup bug route publik.
2. Keputusan produk:
   - Fitur simulasi diposisikan sebagai komponen conversion inti pada website marketing.
   - Konsistensi visual detail unit tetap diprioritaskan agar trust pengguna terjaga.
3. Arah lanjutan:
   - Sprint berikutnya dapat difokuskan pada refinement conversion funnel tanpa mengulang fondasi yang sudah stabil.
   - Dokumentasi pengujian route dan visual perlu terus diperbarui setiap iterasi besar.

---

**Catatan:** Laporan ini hanya memuat pekerjaan yang sudah selesai dikerjakan pada minggu ke-5.