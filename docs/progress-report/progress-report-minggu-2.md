# PROGRESS REPORT MINGGU KE-2

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-04-10 - 2026-04-16  
**Minggu ke:** 2  
**PIC:** Tim Frontend Web Admin

---

## 1. Ringkasan Minggu Ini

Minggu ke-2 difokuskan pada penguatan alur autentikasi dan pengalaman login untuk web admin agar siap dipakai lintas role. Pekerjaan utama yang diselesaikan adalah restorasi desain halaman login sesuai referensi visual, implementasi direct login berdasarkan role, serta pembatasan menu sidebar berdasarkan role aktif.

**Status umum minggu ini:** Hijau

**Ringkasan singkat:**
1. Halaman login web admin sudah direstorasi ke gaya desain yang disepakati (dark premium) dan tetap mempertahankan dev mode untuk percepatan QA internal.
2. Setelah login, user langsung diarahkan ke dashboard role masing-masing.
3. Sidebar sudah menampilkan menu sesuai role sehingga akses UI lebih terarah.

---

## 2. Progress per Sistem

### A. Web Internal + Backend

Fokus minggu ini adalah penguatan fondasi autentikasi sisi frontend web internal (web admin) agar siap dipakai pada tahap route guard minggu berikutnya.

**Pekerjaan yang dilakukan:**
1. Restorasi desain halaman login agar kembali sama dengan referensi awal (dark premium layout).
2. Menjaga mode development account tetap aktif untuk kebutuhan demo dan pengujian cepat.
3. Menambahkan mekanisme pemetaan akun dev ke role:
   - admin
   - inventory
   - sales
   - finance
   - legal
   - supervisor
4. Menambahkan direct redirect setelah login ke route dashboard role.
5. Menyimpan state role dan email ke penyimpanan browser untuk kebutuhan session continuity.
6. Menyelaraskan pembacaan role di komponen sidebar agar menu tampil sesuai role.

**Hasil minggu ini:**
1. Halaman login sudah konsisten secara visual dengan referensi.
2. User tidak perlu memilih manual halaman dashboard setelah login.
3. Navigasi sidebar menjadi relevan per role dan mengurangi risiko user membuka menu yang tidak sesuai.

**Validasi yang dilakukan:**
1. Uji login dengan beberapa akun dev lintas role.
2. Uji perpindahan route otomatis setelah submit login.
3. Uji menu sidebar pada setiap role utama.

**Status:** On Track

**Catatan:**
Pekerjaan minggu ini masih berfokus pada frontend flow. Penguatan akses level route server-side dijadwalkan dan diselesaikan pada minggu berikutnya.

### B. Website Publik + Portal Customer

Pada minggu ke-2 belum ada implementasi fitur baru untuk area website publik/portal customer karena prioritas tim diarahkan ke stabilisasi role flow web admin.

**Pekerjaan yang dilakukan:**
1. Monitoring stabilitas route publik yang sudah ada.
2. Menjaga baseline UI agar tidak terdampak perubahan di aplikasi web admin.

**Hasil minggu ini:**
1. Tidak ada regresi fitur publik yang terdeteksi.
2. Scope publik tetap aman sambil menunggu implementasi fitur marketing lanjutan.

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

| Area | Target Minggu 2 | Realisasi | Status |
|------|------------------|-----------|--------|
| Web Internal + Backend | Restorasi UI login dan role-based login flow | Selesai | On Track |
| Website Publik + Portal Customer | Menjaga stabilitas baseline publik | Selesai | On Track |
| Mobile | Mulai implementasi screen utama | Belum dikerjakan minggu ini | Delayed |

**Penjelasan target:**
Target utama minggu ini untuk web admin tercapai penuh. Pilar lain dipertahankan pada kondisi stabil tanpa perubahan besar agar fokus sprint tidak pecah.

---

## 4. Kendala Minggu Ini

1. Inkonsistensi state role saat berpindah mode penyimpanan session (sessionStorage vs localStorage).
2. Potensi mismatch tampilan login antara desain referensi dan implementasi awal.
3. Risiko menu tidak sinkron dengan role aktif saat refresh browser.

**Penanganan:**
1. Menyeragamkan key penyimpanan role/email.
2. Menyesuaikan ulang style login hingga mendekati referensi final.
3. Menambahkan pembacaan ulang role saat komponen layout dimuat.

---

## 5. Kesimpulan Minggu Ini

Minggu ke-2 berhasil menyelesaikan fondasi autentikasi UI untuk web admin secara end-to-end pada sisi frontend: login, redirect role, dan pembatasan menu role. Hasil ini menjadi prasyarat penting untuk implementasi route guard server-side pada minggu ke-3.

---

## 6. Rencana Minggu Berikutnya

1. Menambahkan route guard server-side berbasis role.
2. Menutup celah akses langsung URL yang tidak sesuai role.
3. Menambahkan alur logout yang aman dan jelas di sidebar.
4. Menstabilkan route dashboard agar tidak kembali ke login secara tidak terduga.

---

## 7. Lampiran Screenshot

1. Login page dark premium (final revisi).
2. Hasil redirect ke dashboard role.
3. Sidebar role admin vs role non-admin.
4. Bukti uji login lintas role.

---

## 8. Rincian Aktivitas Mingguan (Kronologis)

Untuk memberikan konteks yang lebih jelas terhadap progres minggu ini, berikut rincian aktivitas dari awal hingga akhir sprint:

1. Hari 1:
   - Melakukan audit visual halaman login yang berjalan saat ini.
   - Membandingkan implementasi dengan referensi desain yang sebelumnya disepakati.
   - Menentukan elemen UI yang perlu dipulihkan: tone warna, hierarki typography, spacing, dan komposisi form.
2. Hari 2:
   - Melakukan refactor komponen login untuk mengembalikan visual dark premium.
   - Menjaga mode akun development tetap aktif agar tim QA dan stakeholder tetap bisa simulasi lintas role.
   - Menyusun pemetaan akun dev ke role agar alur redirect dapat ditentukan secara deterministik.
3. Hari 3:
   - Menambahkan logika redirect pasca-login berdasarkan role.
   - Menyesuaikan penyimpanan state role dan email agar konsisten antara local storage dan session storage.
   - Menjalankan pengujian login berulang untuk mendeteksi mismatch state antar sesi.
4. Hari 4:
   - Mengintegrasikan pembacaan role pada komponen sidebar.
   - Menyaring menu berdasarkan role aktif sehingga pengguna hanya melihat menu yang relevan.
   - Menutup gap UI yang membuat menu sempat tampil tidak konsisten saat reload halaman.
5. Hari 5:
   - Melakukan review akhir lintas role.
   - Mendokumentasikan hasil implementasi untuk baseline sprint berikutnya.
   - Menyusun daftar risiko lanjutan untuk fase route guard server-side.

---

## 9. Detail Deliverable Teknis Minggu Ini

Deliverable berikut sudah selesai dan menjadi output nyata minggu ke-2:

1. Deliverable UX Login:
   - Tampilan login kembali ke desain referensi.
   - Komponen form login tidak lagi mengalami deviasi visual mayor.
2. Deliverable Role Mapping:
   - Role user dapat dikenali segera setelah proses login.
   - Setiap role diarahkan ke route dashboard yang sesuai.
3. Deliverable Navigasi Sidebar:
   - Sidebar menampilkan menu sesuai hak akses role.
   - Pengguna tidak lagi melihat menu yang tidak berkaitan dengan pekerjaannya.
4. Deliverable Session Handling:
   - Penyimpanan data session role/email sudah dibakukan.
   - Aplikasi tetap mempertahankan konteks role setelah refresh halaman.

---

## 10. Dampak Progres Terhadap Operasional Produk

Perubahan pada minggu ini memberikan dampak langsung terhadap kualitas pengalaman pengguna internal:

1. Dampak pada kejelasan alur masuk:
   - User tidak lagi bingung memilih dashboard setelah login.
   - Waktu menuju halaman kerja utama menjadi lebih singkat.
2. Dampak pada fokus kerja per role:
   - Sidebar role-based mengurangi gangguan menu yang tidak relevan.
   - Potensi salah klik ke area non-prioritas menurun.
3. Dampak pada kesiapan sprint berikutnya:
   - Fondasi role state sudah cukup matang untuk dipakai di layer guard route.
   - Risiko refactor besar saat implementasi route protection menjadi lebih kecil.

---

## 11. Checklist Verifikasi dan Kualitas

Checklist berikut digunakan untuk memastikan pekerjaan minggu ini benar-benar siap dilanjutkan:

1. [x] Login berhasil untuk akun admin.
2. [x] Login berhasil untuk akun sales.
3. [x] Login berhasil untuk akun finance.
4. [x] Redirect role berjalan sesuai mapping akun.
5. [x] Sidebar menyesuaikan menu berdasarkan role.
6. [x] Refresh halaman tidak menghilangkan konteks role aktif.
7. [x] Tidak ada error build yang berasal dari perubahan minggu ini.

---

**Catatan:** Laporan ini hanya memuat pekerjaan yang sudah selesai dikerjakan pada sprint berjalan.