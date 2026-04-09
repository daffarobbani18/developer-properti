# DEVELOPMENT PROCESS MINGGU KE-1

**Project:** Ekosistem Digital Properti Terpadu
**Periode:** [tanggal mulai] - [tanggal selesai]
**Minggu ke:** 1
**PIC:** [nama PIC]

---

## 1. Tujuan Minggu Ini

Pada minggu pertama, tujuan utama adalah membangun fondasi awal proyek agar seluruh anggota tim memiliki arah kerja yang sama. Fokusnya belum pada penyelesaian fitur besar, tetapi pada setup awal, pembagian tugas, dan kesiapan environment untuk pengembangan lanjutan. Tahap ini menjadi dasar penting karena kualitas proses awal sangat menentukan kelancaran development di minggu-minggu berikutnya.

---

## 2. Proses yang Dilakukan

### A. Planning

Pada tahap planning, tim terlebih dahulu menyepakati pembagian scope kerja agar setiap anggota memiliki fokus yang jelas. Pembagian ini bukan hanya soal siapa mengerjakan apa, tetapi juga bagaimana tiap bagian nantinya saling terhubung melalui backend dan alur bisnis yang sama.

Tim melakukan pembagian scope kerja menjadi tiga bagian utama:
1. Web Internal + Backend.
2. Website Publik + Portal Customer.
3. Mobile.

**Penjelasan:**
Pembagian ini penting supaya setiap anggota tim memiliki fokus yang jelas dan tidak saling tumpang tindih. Selain itu, struktur kerja juga menjadi lebih mudah dikontrol saat review mingguan. Dengan scope yang jelas sejak awal, koordinasi antar anggota tim menjadi lebih efisien.

### B. Setup Awal

Setelah planning selesai, tim masuk ke tahap setup awal. Tahap ini dilakukan untuk memastikan semua project bisa dijalankan dengan konfigurasi yang seragam, baik dari sisi folder, port, maupun environment file.

Langkah yang dilakukan pada minggu pertama:
1. Menyiapkan struktur folder proyek.
2. Menentukan port masing-masing sistem.
3. Menyiapkan environment file dasar.
4. Menjalankan dependency install untuk masing-masing sistem.

**Penjelasan:**
Tahap setup awal diperlukan agar semua sistem bisa dijalankan secara lokal dan siap untuk pengembangan fitur berikutnya. Tanpa setup yang benar, tim biasanya akan lebih banyak menghabiskan waktu untuk memperbaiki environment daripada mengembangkan fitur.

### C. Development

Pekerjaan development minggu pertama difokuskan pada pondasi masing-masing sistem. Artinya, yang dikerjakan masih bersifat dasar, belum masuk ke fitur besar. Ini dilakukan agar arah arsitektur dari awal sudah benar dan tidak perlu banyak bongkar ulang di tahap berikutnya.

Pekerjaan development minggu pertama difokuskan pada pondasi masing-masing sistem:
1. Web Internal + Backend: struktur dasar dan persiapan API.
2. Website Publik + Portal Customer: route dasar dan pemisahan area public/portal.
3. Mobile: struktur awal aplikasi dan pemisahan role.

**Penjelasan:**
Di minggu pertama, belum semua fitur selesai. Yang penting adalah fondasi teknisnya sudah benar supaya minggu-minggu berikutnya tinggal melanjutkan implementasi fitur. Karena itu, hasil minggu pertama lebih banyak berupa struktur dan kesiapan sistem dibandingkan output fitur yang sudah lengkap.

### D. Testing

Testing pada minggu pertama dilakukan dalam skala sederhana. Tujuannya bukan untuk menguji seluruh fitur, melainkan untuk memastikan bahwa hasil setup awal benar-benar bisa berjalan.

Yang diuji pada minggu pertama:
1. Apakah masing-masing project bisa diinstall.
2. Apakah port sudah berjalan sesuai rencana.
3. Apakah aplikasi bisa dibuka di browser atau emulator awal.

**Penjelasan:**
Testing awal memastikan bahwa setup yang dibuat tidak bermasalah sebelum masuk ke fitur yang lebih kompleks. Dengan begitu, tim bisa mendeteksi masalah dasar lebih cepat dan menghindari error berulang di tahap selanjutnya.

### E. Review

Di akhir minggu, tim melakukan review untuk melihat apakah hasil kerja sudah sesuai dengan target setup awal. Review ini juga menjadi kesempatan untuk mengecek apakah setiap anggota sudah memahami scope masing-masing.

Tim melakukan review terhadap:
1. Hasil setup awal.
2. Pembagian tugas.
3. Kesiapan masing-masing sistem untuk minggu berikutnya.

**Penjelasan:**
Review dilakukan agar semua anggota memahami progress yang sudah tercapai dan apa yang masih harus dilanjutkan. Dari sini, tim bisa menentukan prioritas minggu kedua dengan lebih tepat.

---

## 3. Hasil Proses Minggu Ini

### Web Internal + Backend

Pada sisi web internal dan backend, hasil minggu pertama sudah terlihat pada struktur dasar dan kesiapan pondasi API. Backend diposisikan sebagai pusat data utama yang akan diakses oleh seluruh aplikasi, sedangkan web internal menjadi ERP/back-office untuk operasional tim internal.

- Struktur awal sudah dibuat.
- Backend dipersiapkan sebagai pusat data utama.
- Web internal diposisikan sebagai ERP/back-office.

### Website Publik + Portal Customer

Untuk website publik, hasil minggu pertama adalah pemisahan area publik dan portal customer. Hal ini penting karena website publik harus ringan dan mudah dipahami pengunjung, sedangkan portal customer membutuhkan akses terbatas dan data yang lebih personal.

- Struktur website publik sudah dipisahkan dari portal customer.
- Route awal sudah disiapkan.
- Website publik diposisikan sebagai media marketing dan lead capture.

### Mobile

Pada sisi mobile, minggu pertama baru sampai ke tahap setup awal dan pemisahan role. Mobile memang belum selesai, tetapi arah pengembangannya sudah mulai terbentuk sehingga minggu berikutnya tim bisa langsung masuk ke screen dan flow utama.

- Struktur awal mobile sudah dibuat.
- Role pengawas dan customer sudah dipisahkan secara konsep.
- Namun mobile masih belum selesai pada minggu pertama.

---

## 4. Screenshot / Bukti Proses

Untuk mendokumentasikan proses minggu pertama, beberapa screenshot yang relevan bisa dilampirkan sebagai bukti bahwa setup dan pengembangan memang sudah berjalan.

- [screenshoot setup backend]
- [screenshoot halaman landing]
- [screenshoot struktur portal customer]
- [screenshoot halaman awal mobile]

**Penjelasan:**
Bagian screenshot digunakan sebagai bukti bahwa setup dan development proses memang sudah berjalan pada minggu pertama. Selain untuk dokumentasi, screenshot juga membantu tim lain melihat progress tanpa harus membuka source code secara langsung.

---

## 5. Kendala

Pada minggu pertama, kendala yang muncul masih tergolong normal karena proyek masih berada di fase inisialisasi. Beberapa penyesuaian teknis memang dibutuhkan agar semua sistem bisa berjalan dengan setup yang konsisten.

1. Mobile belum selesai pada minggu pertama.
2. Ada kebutuhan sinkronisasi port dan struktur folder.
3. Penyesuaian environment awal masih dilakukan.

**Penjelasan:**
Kendala awal seperti ini umum terjadi pada fase init project, terutama saat tim baru memulai struktur aplikasi dan belum masuk ke fitur inti. Karena itu, kendala minggu pertama masih dapat ditoleransi selama tidak menghambat progress utama.

---

## 6. Kesimpulan

Minggu pertama berfokus pada setup dan fondasi teknis. Secara umum, proses pengembangan sudah dimulai dengan pembagian yang jelas antara web internal + backend, website publik + portal customer, dan mobile. Walaupun mobile masih belum selesai, progress awal sudah cukup untuk menjadi dasar pekerjaan minggu berikutnya.

---

## 7. Rencana Minggu Berikutnya

Minggu berikutnya akan diarahkan ke pengembangan fitur yang lebih terlihat dan mulai mengarah ke penggunaan nyata. Fokusnya tidak lagi hanya pada setup, tetapi pada kelanjutan implementasi inti.

1. Melanjutkan implementasi fitur awal web internal dan backend.
2. Mengerjakan halaman publik utama dan portal customer.
3. Melanjutkan setup mobile sampai screen utama siap.
4. Menyiapkan integrasi antar sistem.

---

**Catatan:** Dokumen ini dapat langsung dicopy ke Word dan diisi sesuai hasil aktual minggu pertama.