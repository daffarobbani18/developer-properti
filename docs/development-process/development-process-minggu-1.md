# DEVELOPMENT PROCESS MINGGU KE-1

**Project:** Ekosistem Digital Properti Terpadu
**Periode:** 2026-04-03 - 2026-04-09
**Minggu ke:** 1
**PIC:** Tim Inisiasi Platform (Lintas Aplikasi)

---

## 1. Tujuan Minggu Ini

Pada minggu pertama, tujuan utama adalah membangun fondasi awal proyek agar seluruh anggota tim memiliki arah kerja yang sama. Fokusnya belum pada penyelesaian fitur besar, tetapi pada setup awal, pembagian tugas, dan kesiapan environment untuk pengembangan lanjutan. Tahap ini menjadi dasar penting karena kualitas proses awal sangat menentukan kelancaran development di minggu-minggu berikutnya.

Di fase ini, tim belum dituntut menghasilkan banyak fitur yang terlihat oleh user akhir. Yang lebih penting justru adalah memastikan bahwa proyek sudah punya arah yang jelas, struktur yang rapi, dan pola kerja yang bisa diulang. Jika fondasi di minggu pertama sudah konsisten, maka penambahan fitur pada minggu berikutnya akan jauh lebih cepat dan lebih aman.

Selain itu, minggu pertama juga dipakai untuk menyamakan pemahaman antar anggota tim mengenai bentuk akhir sistem. Karena proyek ini terdiri dari beberapa aplikasi yang saling terhubung, pemahaman awal tentang pembagian area kerja menjadi sangat penting agar tidak terjadi tumpang tindih pekerjaan.

---

## 2. Proses yang Dilakukan

### A. Planning

Pada tahap planning, tim terlebih dahulu menyepakati pembagian scope kerja agar setiap anggota memiliki fokus yang jelas. Pembagian ini bukan hanya soal siapa mengerjakan apa, tetapi juga bagaimana tiap bagian nantinya saling terhubung melalui backend dan alur bisnis yang sama.

Planning juga berfungsi untuk menahan tim agar tidak langsung masuk ke coding tanpa struktur. Dengan perencanaan yang cukup di awal, setiap orang jadi tahu batas kerja masing-masing, tahu dependensi antar sistem, dan tahu bagian mana yang harus diprioritaskan lebih dulu. Ini penting karena proyek properti seperti SIMDP tidak hanya terdiri dari satu tampilan aplikasi, tetapi dari beberapa alur bisnis yang saling berhubungan.

Pada tahap ini tim juga menimbang urutan pengerjaan yang paling masuk akal. Area yang berhubungan dengan data inti dan kontrol sistem diletakkan lebih dulu supaya aplikasi lain bisa mengikuti fondasi yang sama. Dengan begitu, pengembangan tidak berjalan acak dan tidak membuat tim harus mengulang pekerjaan saat struktur sistem berubah.

Tim melakukan pembagian scope kerja menjadi tiga bagian utama:
1. Web Internal + Backend.
2. Website Publik + Portal Customer.
3. Mobile.

**Penjelasan:**
Pembagian ini penting supaya setiap anggota tim memiliki fokus yang jelas dan tidak saling tumpang tindih. Selain itu, struktur kerja juga menjadi lebih mudah dikontrol saat review mingguan. Dengan scope yang jelas sejak awal, koordinasi antar anggota tim menjadi lebih efisien.

**Catatan tambahan:**
Hasil planning minggu pertama bukan hanya pembagian tugas, tetapi juga kesepakatan teknis tentang bagaimana aplikasi akan dipisahkan. Area publik harus tetap ringan dan mudah diakses, portal customer harus aman dan terproteksi, sedangkan web internal harus menjadi pusat pengelolaan data dan operasional.

### B. Setup Awal

Setelah planning selesai, tim masuk ke tahap setup awal. Tahap ini dilakukan untuk memastikan semua project bisa dijalankan dengan konfigurasi yang seragam, baik dari sisi folder, port, maupun environment file.

Setup awal ini juga menjadi momen untuk menyelaraskan ekspektasi antar aplikasi. Setiap project perlu punya tempatnya sendiri, tetapi tetap memakai aturan dasar yang sama, seperti penamaan folder, port development, dan struktur environment. Kalau bagian ini berantakan dari awal, biasanya masalah kecil akan terus muncul di tahap berikutnya.

Pada proyek ini, setup awal tidak hanya dipahami sebagai instalasi dependency. Lebih jauh dari itu, setup berarti menyiapkan kondisi agar tim bisa mulai mengerjakan fitur tanpa harus sibuk memperbaiki hal-hal dasar seperti path, port bentrok, atau file konfigurasi yang belum tersedia.

Langkah yang dilakukan pada minggu pertama:
1. Menyiapkan struktur folder proyek.
2. Menentukan port masing-masing sistem.
3. Menyiapkan environment file dasar.
4. Menjalankan dependency install untuk masing-masing sistem.

**Penjelasan:**
Tahap setup awal diperlukan agar semua sistem bisa dijalankan secara lokal dan siap untuk pengembangan fitur berikutnya. Tanpa setup yang benar, tim biasanya akan lebih banyak menghabiskan waktu untuk memperbaiki environment daripada mengembangkan fitur.

**Catatan tambahan:**
Konsistensi setup sangat penting agar semua anggota tim bisa menjalankan project yang sama di mesin masing-masing. Ini mengurangi miskomunikasi saat debugging dan membuat review progress lebih mudah dilakukan karena semua orang melihat kondisi sistem yang serupa.

### C. Development

Pekerjaan development minggu pertama difokuskan pada pondasi masing-masing sistem. Artinya, yang dikerjakan masih bersifat dasar, belum masuk ke fitur besar. Ini dilakukan agar arah arsitektur dari awal sudah benar dan tidak perlu banyak bongkar ulang di tahap berikutnya.

Pada tahap development, tim mulai menerjemahkan hasil planning ke bentuk struktur aplikasi yang nyata. Walaupun belum ada fitur bisnis yang lengkap, bagian ini penting karena menjadi tempat pertama untuk memastikan apakah arah arsitektur yang dipilih sudah cocok dengan kebutuhan sistem. Jika pondasi awal sudah benar, maka modul-modul berikutnya akan lebih mudah ditempelkan.

Tahap ini juga menjadi validasi pertama bahwa pembagian sistem memang masuk akal untuk dikerjakan secara terpisah. Web internal, website publik, portal customer, dan mobile masing-masing punya kebutuhan berbeda, tetapi semuanya tetap harus mengarah ke sumber data dan logika bisnis yang sama.

Pekerjaan development minggu pertama difokuskan pada pondasi masing-masing sistem:
1. Web Internal + Backend: struktur dasar dan persiapan API.
2. Website Publik + Portal Customer: route dasar dan pemisahan area public/portal.
3. Mobile: struktur awal aplikasi dan pemisahan role.

**Penjelasan:**
Di minggu pertama, belum semua fitur selesai. Yang penting adalah fondasi teknisnya sudah benar supaya minggu-minggu berikutnya tinggal melanjutkan implementasi fitur. Karena itu, hasil minggu pertama lebih banyak berupa struktur dan kesiapan sistem dibandingkan output fitur yang sudah lengkap.

**Catatan tambahan:**
Pendekatan seperti ini sengaja dipilih supaya pengembangan tidak terlalu berat di awal. Dengan memulai dari dasar, tim bisa menilai lebih cepat apakah ada bagian yang perlu disederhanakan, dipisah lagi, atau digabung agar lebih efisien untuk jangka panjang.

### D. Testing

Testing pada minggu pertama dilakukan dalam skala sederhana. Tujuannya bukan untuk menguji seluruh fitur, melainkan untuk memastikan bahwa hasil setup awal benar-benar bisa berjalan.

Walaupun masih tahap awal, testing tetap penting karena di sinilah kesalahan paling dasar biasanya muncul. Misalnya port yang salah, dependency yang belum terpasang, konfigurasi yang belum terbaca, atau halaman yang belum bisa dibuka. Jika masalah seperti ini langsung ditemukan di minggu pertama, perbaikannya akan jauh lebih murah dibandingkan saat project sudah besar.

Testing sederhana juga membantu tim memastikan bahwa pekerjaan setup memang menghasilkan output yang nyata. Jadi bukan sekadar folder sudah dibuat, tetapi benar-benar bisa dijalankan dan diakses.

Yang diuji pada minggu pertama:
1. Apakah masing-masing project bisa diinstall.
2. Apakah port sudah berjalan sesuai rencana.
3. Apakah aplikasi bisa dibuka di browser atau emulator awal.

**Penjelasan:**
Testing awal memastikan bahwa setup yang dibuat tidak bermasalah sebelum masuk ke fitur yang lebih kompleks. Dengan begitu, tim bisa mendeteksi masalah dasar lebih cepat dan menghindari error berulang di tahap selanjutnya.

**Catatan tambahan:**
Hasil testing minggu pertama lebih difokuskan pada kesiapan teknis. Karena itu, bila ada komponen yang belum sempurna, fokusnya adalah memastikan akar masalahnya diketahui sejak awal agar tidak mengganggu implementasi berikutnya.

### E. Review

Di akhir minggu, tim melakukan review untuk melihat apakah hasil kerja sudah sesuai dengan target setup awal. Review ini juga menjadi kesempatan untuk mengecek apakah setiap anggota sudah memahami scope masing-masing.

Review di akhir minggu berfungsi sebagai titik kontrol. Pada fase awal proyek, review bukan hanya memeriksa apakah task selesai atau belum, tetapi juga menilai apakah struktur kerja yang dipilih memang efektif. Dari sini tim bisa melihat apakah ada bagian yang terlalu besar, terlalu kecil, atau perlu penyesuaian sebelum masuk ke minggu kedua.

Selain itu, review membantu tim menyatukan persepsi. Mungkin ada anggota yang lebih fokus ke frontend, ada yang ke backend, dan ada yang ke mobile. Tanpa review yang teratur, tiap bagian bisa bergerak sendiri-sendiri dan akhirnya sulit disatukan saat integrasi.

Tim melakukan review terhadap:
1. Hasil setup awal.
2. Pembagian tugas.
3. Kesiapan masing-masing sistem untuk minggu berikutnya.

**Penjelasan:**
Review dilakukan agar semua anggota memahami progress yang sudah tercapai dan apa yang masih harus dilanjutkan. Dari sini, tim bisa menentukan prioritas minggu kedua dengan lebih tepat.

**Catatan tambahan:**
Hasil review juga menjadi bahan untuk memperbaiki ritme kerja tim. Jika ada bagian yang masih kurang matang, maka minggu berikutnya bisa langsung diarahkan untuk menutup celah tersebut sebelum pengembangan fitur lebih jauh dimulai.

---

## 3. Hasil Proses Minggu Ini

### Web Internal + Backend

Pada sisi web internal dan backend, hasil minggu pertama sudah terlihat pada struktur dasar dan kesiapan pondasi API. Backend diposisikan sebagai pusat data utama yang akan diakses oleh seluruh aplikasi, sedangkan web internal menjadi ERP/back-office untuk operasional tim internal.

Di sisi ini, tujuan utamanya memang membangun fondasi yang bisa dipakai banyak modul sekaligus. Karena backend akan menjadi pusat data untuk semua aplikasi, maka rancangan awalnya harus cukup rapi agar nanti tidak menyulitkan saat modul CRM, transaksi, progress proyek, legal, dan after-sales mulai ditambahkan.

Web internal juga tidak disiapkan sebagai halaman biasa. Aplikasi ini akan menjadi area operasional yang sifatnya lebih kompleks dibanding website publik. Karena itu, pada minggu pertama tim lebih fokus pada dasar-dasar struktur dan alur kerja internal daripada tampilan yang detail.

- Struktur awal sudah dibuat.
- Backend dipersiapkan sebagai pusat data utama.
- Web internal diposisikan sebagai ERP/back-office.

**Catatan:**
Dengan menempatkan backend sebagai pusat data sejak awal, tim mengurangi risiko duplikasi logika di berbagai aplikasi. Semua aplikasi nantinya cukup mengikuti aturan data yang sama, sehingga pemeliharaan sistem menjadi lebih mudah.

### Website Publik + Portal Customer

Untuk website publik, hasil minggu pertama adalah pemisahan area publik dan portal customer. Hal ini penting karena website publik harus ringan dan mudah dipahami pengunjung, sedangkan portal customer membutuhkan akses terbatas dan data yang lebih personal.

Pada area publik, fokus awal bukan hanya menampilkan informasi proyek, tetapi juga membangun jalur masuk bagi calon pembeli. Artinya, website harus bisa menjadi media promosi yang jelas sekaligus alat pengumpul leads. Sementara itu, portal customer harus diposisikan sebagai area yang aman untuk pelanggan yang sudah terdata.

Pemisahan ini juga membuat pengalaman pengguna lebih rapi. Pengunjung umum tidak perlu melihat halaman yang terlalu rumit, sedangkan customer yang sudah login bisa langsung masuk ke layanan yang relevan seperti progres, tagihan, dan dokumen.

- Struktur website publik sudah dipisahkan dari portal customer.
- Route awal sudah disiapkan.
- Website publik diposisikan sebagai media marketing dan lead capture.

**Catatan:**
Dengan pendekatan satu website tetapi dua area yang jelas, tim bisa menjaga efisiensi pengembangan tanpa mengorbankan pemisahan akses dan tujuan penggunaan masing-masing area.

### Mobile

Pada sisi mobile, minggu pertama baru sampai ke tahap setup awal dan pemisahan role. Mobile memang belum selesai, tetapi arah pengembangannya sudah mulai terbentuk sehingga minggu berikutnya tim bisa langsung masuk ke screen dan flow utama.

Bagian mobile perlu diberi perhatian khusus karena nantinya akan dipakai oleh role yang berbeda, misalnya pengawas dan customer. Masing-masing role punya kebutuhan informasi yang tidak sama, sehingga struktur awal aplikasi harus sejak awal memikirkan perbedaan itu. Dengan begitu, screen yang dibuat nantinya tidak saling tumpang tindih.

Di minggu pertama, mobile masih diposisikan sebagai fondasi. Yang utama adalah memastikan aplikasi siap dikembangkan secara bertahap, bukan langsung lengkap dalam satu kali pengerjaan.

- Struktur awal mobile sudah dibuat.
- Role pengawas dan customer sudah dipisahkan secara konsep.
- Namun mobile masih belum selesai pada minggu pertama.

**Catatan:**
Walaupun belum selesai, hasil minggu pertama tetap penting karena sudah memberi arah yang jelas untuk pengembangan role-based flow pada minggu berikutnya.

---

## 4. Screenshot / Bukti Proses

Untuk mendokumentasikan proses minggu pertama, beberapa screenshot yang relevan bisa dilampirkan sebagai bukti bahwa setup dan pengembangan memang sudah berjalan.

Screenshot di bagian ini sebaiknya diisi dengan gambar yang benar-benar menunjukkan progress aktual. Tujuannya bukan hanya mempercantik laporan, tetapi juga memberi bukti bahwa setiap tahap memang sudah dikerjakan dan diuji. Bagi tim internal, bagian ini membantu saat ingin meninjau ulang progress tanpa harus membuka source code.

- [screenshoot setup backend]
- [screenshoot halaman landing]
- [screenshoot struktur portal customer]
- [screenshoot halaman awal mobile]

**Penjelasan:**
Bagian screenshot digunakan sebagai bukti bahwa setup dan development proses memang sudah berjalan pada minggu pertama. Selain untuk dokumentasi, screenshot juga membantu tim lain melihat progress tanpa harus membuka source code secara langsung.

**Catatan tambahan:**
Jika pada minggu tertentu ada bagian yang belum selesai, screenshot tetap boleh ditampilkan selama memang menggambarkan kondisi terbaru. Dengan begitu, laporan tetap jujur terhadap kondisi proyek dan tidak memberi kesan progress yang tidak sesuai kenyataan.

---

## 5. Kendala

Pada minggu pertama, kendala yang muncul masih tergolong normal karena proyek masih berada di fase inisialisasi. Beberapa penyesuaian teknis memang dibutuhkan agar semua sistem bisa berjalan dengan setup yang konsisten.

Di fase awal seperti ini, kendala biasanya bukan berasal dari fitur bisnis yang rumit, tetapi dari hal-hal dasar yang mengganggu kelancaran kerja. Misalnya perbedaan environment antar komputer, port yang bentrok, atau struktur folder yang belum seragam. Walaupun terlihat sederhana, hal seperti ini bisa menghambat proses kalau tidak dicatat sejak awal.

Mencatat kendala secara rinci juga penting untuk laporan mingguan karena tim bisa melihat pola masalah yang berulang. Dari situ, solusi ke depannya bisa disusun lebih tepat, bukan hanya diselesaikan sementara.

1. Mobile belum selesai pada minggu pertama.
2. Ada kebutuhan sinkronisasi port dan struktur folder.
3. Penyesuaian environment awal masih dilakukan.

**Penjelasan:**
Kendala awal seperti ini umum terjadi pada fase init project, terutama saat tim baru memulai struktur aplikasi dan belum masuk ke fitur inti. Karena itu, kendala minggu pertama masih dapat ditoleransi selama tidak menghambat progress utama.

**Catatan tambahan:**
Dengan mengetahui kendala sejak minggu pertama, tim bisa menyusun strategi kerja yang lebih realistis. Ini jauh lebih baik daripada menunggu masalah membesar di akhir sprint atau setelah beberapa modul sudah terlanjur dibangun.

---

## 6. Kesimpulan

Minggu pertama berfokus pada setup dan fondasi teknis. Secara umum, proses pengembangan sudah dimulai dengan pembagian yang jelas antara web internal + backend, website publik + portal customer, dan mobile. Walaupun mobile masih belum selesai, progress awal sudah cukup untuk menjadi dasar pekerjaan minggu berikutnya.

Secara keseluruhan, hasil minggu pertama menunjukkan bahwa arah proyek sudah mulai stabil. Tim sudah punya gambaran kerja yang lebih jelas, struktur awal sudah terbentuk, dan area prioritas untuk pengembangan berikutnya juga mulai terlihat. Dengan kata lain, minggu pertama berhasil menjalankan fungsinya sebagai fase pondasi.

Jika fondasi ini dijaga dengan konsisten, maka minggu-minggu selanjutnya dapat difokuskan pada penambahan fitur yang lebih nyata tanpa harus terus kembali ke pekerjaan setup dasar.

---

## 7. Rencana Minggu Berikutnya

Minggu berikutnya akan diarahkan ke pengembangan fitur yang lebih terlihat dan mulai mengarah ke penggunaan nyata. Fokusnya tidak lagi hanya pada setup, tetapi pada kelanjutan implementasi inti.

Rencana minggu berikutnya perlu tetap realistis dan bertahap. Karena pondasi awal baru selesai, tim sebaiknya tidak langsung mengejar terlalu banyak fitur sekaligus. Lebih baik memilih beberapa prioritas penting yang bisa menunjukkan kemajuan nyata, lalu memperluasnya secara stabil.

Selain itu, minggu kedua juga akan menjadi momen untuk melihat apakah struktur yang sudah dibuat di minggu pertama benar-benar nyaman dipakai. Jika ada bagian yang terasa terlalu rumit atau kurang fleksibel, perbaikan bisa dilakukan lebih cepat sebelum modul yang lebih banyak mulai ditambahkan.

1. Melanjutkan implementasi fitur awal web internal dan backend.
2. Mengerjakan halaman publik utama dan portal customer.
3. Melanjutkan setup mobile sampai screen utama siap.
4. Menyiapkan integrasi antar sistem.

**Catatan tambahan:**
Target minggu berikutnya sebaiknya tetap dibagi per sistem supaya progress mudah dilacak. Dengan cara ini, tim bisa mengukur apakah tiap area bergerak sesuai rencana atau ada bagian yang perlu diberi perhatian lebih besar.

---

## 8. Cuplikan Source Code Penting Minggu Ini

Berikut cuplikan source code yang merepresentasikan hasil setup fondasi minggu pertama (orkestrasi command dan pemisahan port per aplikasi):

### A. Orkestrasi Monorepo dari Root Project

File: `package.json`

```json
{
	"scripts": {
		"dev:web-admin": "npm --prefix frontend/web-admin run dev",
		"dev:web-public": "npm --prefix frontend/web-public-portal run dev",
		"dev:backend": "npm --prefix backend run dev",
		"dev:mobile": "npm --prefix mobile run dev",
		"install:all": "npm run install:web-admin && npm run install:web-public && npm run install:backend && npm run install:mobile"
	}
}
```

Penjelasan singkat:
1. Script root ini menjadi pintu tunggal untuk menjalankan tiap pilar sistem.
2. Tim tidak perlu berpindah-pindah manual ke folder aplikasi hanya untuk menjalankan command dasar.

### B. Port Service per Aplikasi

File: `frontend/web-admin/package.json`

```json
{
	"scripts": {
		"dev": "next dev -p 3001",
		"start": "next start -p 3001"
	}
}
```

File: `frontend/web-public-portal/package.json`

```json
{
	"scripts": {
		"dev": "next dev -p 3002",
		"start": "next start -p 3002"
	}
}
```

File: `backend/package.json`

```json
{
	"scripts": {
		"dev": "tsx watch src/index.ts"
	}
}
```

File: `mobile/package.json`

```json
{
	"scripts": {
		"dev": "expo start --port 8082"
	}
}
```

Penjelasan singkat:
1. Pemisahan port sejak awal mencegah konflik runtime antar aplikasi.
2. Setup ini menjadi fondasi lintas tim untuk debugging dan integrasi minggu berikutnya.

---

## 9. Kronologi Eksekusi Harian (Ringkas)

Kronologi ini melengkapi dokumentasi minggu pertama agar tim memiliki jejak proses yang jelas sejak fase inisiasi, bukan hanya daftar hasil akhir.

### Hari 1 - Inisiasi Scope dan Pembagian Pilar Sistem

1. Menyepakati struktur kerja 3 pilar: web internal + backend, web publik + portal, dan mobile.
2. Menetapkan tujuan minggu pertama sebagai fondasi teknis lintas aplikasi.
3. Menentukan aturan koordinasi agar tidak terjadi overlap pekerjaan.
4. Menetapkan prioritas penyelesaian: struktur dulu, fitur besar belakangan.

### Hari 2 - Setup Struktur Monorepo dan Konvensi Dasar

1. Menyiapkan struktur folder utama per domain aplikasi.
2. Menetapkan pola naming dan lokasi folder agar konsisten.
3. Menentukan aturan eksekusi command dari root project.
4. Menyelaraskan kebutuhan dependency inti per aplikasi.

### Hari 3 - Penetapan Port dan Environment Dasar

1. Menentukan port service agar runtime antar aplikasi tidak bentrok.
2. Menyiapkan file konfigurasi environment dasar.
3. Menjalankan verifikasi awal bahwa setiap aplikasi dapat start.
4. Mencatat isu setup yang perlu distandardkan pada dokumentasi tim.

### Hari 4 - Validasi Fondasi per Aplikasi

1. Memastikan backend siap menjadi pusat data lintas aplikasi.
2. Memastikan website publik dan portal customer sudah dipisahkan secara struktur.
3. Memastikan mobile memiliki pondasi role-based flow awal.
4. Menutup gap konfigurasi yang menghambat kolaborasi lintas tim.

### Hari 5 - Review Mingguan dan Penutupan Inisiasi

1. Meninjau hasil setup bersama seluruh anggota tim.
2. Memastikan setiap pilar memiliki baseline yang bisa dilanjutkan minggu ke-2.
3. Menyusun daftar risiko awal terkait environment dan integrasi.
4. Menyetujui prioritas sprint lanjutan berdasarkan hasil setup aktual.

---

## 10. Quality Gate dan Acceptance Criteria

### A. Functional Gate

1. Setiap aplikasi utama dapat dijalankan pada environment lokal.
2. Route dasar pada web publik/portal dapat diakses.
3. Struktur dasar backend dapat dipakai sebagai fondasi modul lanjutan.
4. Struktur mobile siap untuk pengembangan screen role-based.

### B. Technical Gate

1. Struktur folder proyek konsisten sesuai pembagian domain.
2. Port antar aplikasi tidak saling konflik saat dijalankan bersamaan.
3. Dependency dasar tiap aplikasi terinstal dan terbaca.
4. Konfigurasi awal dapat direplikasi oleh anggota tim lain.

### C. Operasional Gate

1. Alur setup dapat dijelaskan ulang tanpa asumsi implisit.
2. Tim memiliki titik awal yang sama untuk memulai pengembangan fitur.
3. Kendala init project telah tercatat sebagai bahan mitigasi sprint selanjutnya.

---

## 11. Dampak Operasional Minggu Ini

1. Dampak ke Kecepatan Onboarding Tim:
	- Fondasi yang rapi mempercepat anggota tim masuk ke task teknis tanpa banyak hambatan setup.
	- Perbedaan environment antar mesin menjadi lebih mudah ditangani.
2. Dampak ke Kualitas Integrasi:
	- Pembagian pilar sistem sejak awal menurunkan risiko konflik antar area kerja.
	- Integrasi lintas aplikasi di minggu berikutnya punya landasan yang lebih stabil.
3. Dampak ke Risiko Proyek:
	- Risiko bentrok port dan inkonsistensi struktur sudah diidentifikasi lebih dini.
	- Biaya perbaikan di fase lanjutan berkurang karena masalah dasar ditutup sejak minggu pertama.

---

## 12. Handoff Sprint Minggu Ke-1

### A. Artefak yang Dihandoff

1. Struktur monorepo awal lintas backend, web admin, web publik, dan mobile.
2. Konvensi port development per aplikasi.
3. Script orkestrasi command dari root project.
4. Catatan kendala setup awal dan tindakan perapian.

### B. Pengetahuan yang Diteruskan

1. Kualitas fase inisiasi sangat menentukan kecepatan delivery sprint berikutnya.
2. Setup yang tidak standar akan memunculkan bug operasional berulang.
3. Validasi teknis dasar harus selalu dilakukan sebelum mengerjakan fitur bisnis.

### C. Checklist Penutupan

1. Fondasi lintas aplikasi selesai disiapkan.
2. Pengujian setup dasar berhasil dilakukan.
3. Dokumen proses minggu pertama telah diperbarui.
4. Prioritas kerja minggu kedua sudah disepakati.

---

## 13. Analisis Kematangan Proses Minggu Ke-1

Analisis ini menilai seberapa matang proses kerja tim setelah menyelesaikan fase inisiasi pertama.

1. Dimensi Kejelasan Scope:
	- Nilai: Baik.
	- Alasan: pembagian pilar kerja lintas aplikasi sudah eksplisit dan dipahami tim.
2. Dimensi Kesiapan Teknis:
	- Nilai: Cukup-Baik.
	- Alasan: fondasi backend, web, dan mobile sudah terbentuk, namun mobile belum masuk fitur inti.
3. Dimensi Konsistensi Eksekusi:
	- Nilai: Cukup.
	- Alasan: beberapa penyesuaian environment masih diperlukan agar perilaku command identik di semua mesin.
4. Dimensi Kualitas Dokumentasi:
	- Nilai: Baik.
	- Alasan: keputusan setup, kendala awal, dan prioritas lanjutan sudah terdokumentasi.
5. Kesimpulan kematangan minggu ke-1:
	- Tim sudah melewati fase "proyek baru dibuka" menuju "proyek siap dikembangkan".
	- Fokus minggu ke-2 perlu bergeser dari setup ke delivery fitur nyata agar momentum terjaga.

---

## 14. Risk Register Awal dan Strategi Kontrol

Untuk menjaga stabilitas sprint selanjutnya, berikut risk register yang diangkat dari temuan minggu pertama.

1. Risiko Inkonsistensi Environment Lintas Mesin:
	- Dampak: command gagal sebagian, debugging memanjang, dan produktivitas tim turun.
	- Probabilitas: Sedang.
	- Strategi kontrol: standarisasi script root dan konvensi setup step-by-step.
2. Risiko Konflik Port Antar Aplikasi:
	- Dampak: service tidak dapat dijalankan bersamaan, validasi integrasi tertunda.
	- Probabilitas: Sedang.
	- Strategi kontrol: dokumentasi port baku per aplikasi dan verifikasi sebelum sprint dimulai.
3. Risiko Struktur Folder Tidak Konsisten:
	- Dampak: code ownership kabur, review code lambat.
	- Probabilitas: Sedang.
	- Strategi kontrol: menyepakati konvensi naming/peletakan file dan melakukan review rutin.
4. Risiko Mobile Tertinggal dari Pilar Lain:
	- Dampak: backlog mobile menumpuk dan ketergantungan lintas tim meningkat.
	- Probabilitas: Tinggi pada fase awal.
	- Strategi kontrol: menjaga porsi task mobile minimal setiap sprint agar progres tetap bergerak.
5. Risiko Dokumentasi Setup Tidak Diupdate:
	- Dampak: anggota tim baru sulit mengikuti baseline project.
	- Probabilitas: Sedang.
	- Strategi kontrol: update dokumentasi setup setiap ada perubahan command/struktur.

---

## 15. Rencana Standarisasi Proses Minggu Ke-2

Sebagai tindak lanjut langsung dari hasil minggu pertama, tim menyusun agenda standardisasi berikut:

1. Standardisasi Alur Menjalankan Aplikasi:
	- Menyepakati urutan command yang sama untuk seluruh anggota tim.
	- Menetapkan checklist quick check sebelum memulai task coding harian.
2. Standardisasi Konteks Role dan Navigation Seed:
	- Menyiapkan baseline akun dev untuk simulasi role-based flow.
	- Menyamakan ekspektasi route awal tiap role agar testing terstruktur.
3. Standardisasi Checklist Review Mingguan:
	- Menambah bagian wajib: capaian, kendala, mitigasi, dan keputusan sprint.
	- Menetapkan bukti minimum: build pass, screenshot, dan catatan uji skenario utama.
4. Standardisasi Handoff Antar Sprint:
	- Menentukan format artefak handoff agar sprint berikutnya tidak memulai dari nol.
	- Menambahkan daftar risiko terbuka sebagai bagian wajib penutupan mingguan.
5. Outcome yang diharapkan:
	- Minggu ke-2 dapat langsung fokus ke implementasi login role-based tanpa mengulang masalah setup.
	- Ritme tim meningkat karena proses kerja lebih seragam dan dapat diprediksi.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-1.