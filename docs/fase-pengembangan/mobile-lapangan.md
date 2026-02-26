# Fase Pengembangan Frontend — Mobile Lapangan
# SIMDP · Sistem Informasi Manajemen Developer Perumahan

---

## Gambaran Umum

Mobile Lapangan adalah aplikasi untuk **tim internal developer yang mengawasi proyek di lokasi**. Bukan untuk mandor atau tukang kontraktor — melainkan untuk **Site Engineer** (pengawas dari developer) dan **Manajer Proyek**. Fokus utamanya adalah melaporkan progres milestone dan foto bukti ke sistem dari lapangan.

- **Teknologi**: React Native (Android & iOS)
- **Target pengguna**: Site Engineer, Manajer Proyek (tim internal developer)
- **Tujuan utama**: Update status milestone, upload foto bukti konstruksi, laporan kendala kontraktor
- **Koneksi**: Data masuk ke Web Admin (Monitoring Milestone & Pengeluaran & Vendor)
- **Prioritas platform**: Android (paling umum digunakan di lapangan)

---

## Ringkasan Fase

| Fase | Nama | Fokus | Output |
|------|------|-------|--------|
| 1 | Setup & Login | Struktur + autentikasi 2 role | Tim bisa login |
| 2 | Update Milestone & Foto | Input status milestone + kamera | Data milestone masuk ke server |
| 3 | Manajemen Unit & Kendala | Pantau semua unit + laporan masalah | Kendala terdokumentasi |
| 4 | Notifikasi & Offline Mode | Push notif + kerja tanpa internet | App bisa dipakai sinyal lemah |
| 5 | Polish & Deployment | UI polish + rilis ke perangkat | App siap distribusi ke tim |

---

## Fase 1 — Setup & Login

### Tujuan
Membangun fondasi aplikasi mobile dan sistem login yang sesuai untuk 2 role tim internal.

### Pekerjaan

#### 1.1 Setup Proyek React Native
- [ ] Inisialisasi proyek dengan Expo (atau bare React Native)
- [ ] Setup navigasi: React Navigation (Stack + Bottom Tab)
- [ ] Konfigurasi NativeWind atau StyleSheet
- [ ] Setup environment variables (API URL, dll.)
- [ ] Konfigurasi ikon aplikasi & splash screen
- [ ] Setup Git repository

#### 1.2 Autentikasi
- [ ] Halaman Login — email + password
- [ ] Simpan token JWT di `SecureStore` (Expo) / `Keychain`
- [ ] Auto-login jika token masih valid
- [ ] Logout

#### 1.3 Pembatasan Akses per Role
- [ ] Login → baca role dari token
- [ ] Tampilkan menu sesuai role:
  - **Site Engineer**: Update Milestone, Upload Foto, Laporan Kendala, Daftar Unit yang ditugaskan
  - **Manajer Proyek**: Akses penuh — semua unit semua proyek + approve BA termin
- [ ] Halaman Unauthorized jika akses menu yang tidak diizinkan

#### 1.4 Halaman Beranda (Home Tab)
- [ ] Sambutan + nama pengguna + jabatan
- [ ] Kartu ringkasan: proyek aktif yang ditugaskan
- [ ] Shortcut ke aksi cepat: Update Milestone, Kamera, Laporan Kendala
- [ ] Milestone yang mendekati deadline — ditampilkan sebagai alert

### Checklist Selesai Fase 1
- [ ] Login dengan 2 role berbeda menghasilkan menu berbeda
- [ ] Auto-login berfungsi setelah restart app
- [ ] Beranda tampil info proyek yang relevan
- [ ] Logout menghapus semua data sesi

---

## Fase 2 — Update Milestone & Foto

### Tujuan
Memudahkan Site Engineer melaporkan selesainya setiap milestone konstruksi dengan foto bukti langsung dari lapangan.

### Pekerjaan

#### 2.1 Pilih Unit & Milestone (`Milestone > Pilih Unit`)
- [ ] Daftar proyek yang ditugaskan ke akun Site Engineer
- [ ] Pilih proyek → list semua unit
- [ ] Klik unit → daftar milestone unit tersebut
- [ ] Status tiap milestone: `Belum Mulai / Sedang / Selesai`

#### 2.2 Update Status Milestone
- [ ] Tombol "Tandai Selesai" per milestone
- [ ] Konfirmasi dialog sebelum disimpan
- [ ] Input catatan (opsional): kondisi aktual, keterangan tambahan
- [ ] Status berubah otomatis di Web Admin & Customer Portal

#### 2.3 Upload Foto Milestone
- [ ] Tombol ambil foto dari kamera langsung
- [ ] Pilih foto dari galeri (multi-pilih, maks. 5 foto per milestone)
- [ ] Preview foto sebelum upload
- [ ] Kompresi otomatis foto sebelum kirim (maks. 1MB per foto)
- [ ] Foto terhubung otomatis ke milestone yang dipilih

#### 2.4 Riwayat Update Milestone (`Milestone > Riwayat`)
- [ ] Daftar semua update yang pernah dikirim (urut terbaru)
- [ ] Status: `Terkirim / Gagal Kirim`
- [ ] Klik → lihat detail update + foto
- [ ] Kirim ulang jika gagal

### Checklist Selesai Fase 2
- [ ] Milestone bisa diupdate status dari HP
- [ ] Foto bisa diambil dari kamera dan terupload ke milestone
- [ ] Update langsung tampil di Web Admin & Customer Portal
- [ ] Riwayat update dapat dilihat

---

## Fase 3 — Manajemen Unit & Kendala

### Tujuan
Memberikan Site Engineer dan Manajer Proyek visibilitas penuh atas semua unit, serta saluran pelaporan masalah yang terstruktur.

### Pekerjaan

#### 3.1 Daftar Unit (`Unit > Semua Unit`)
- [ ] List semua unit dalam proyek yang ditugaskan
- [ ] Progress bar per unit — persentase milestone selesai
- [ ] Status unit: `Belum Mulai / Sedang Dibangun / Selesai`
- [ ] Filter per blok/cluster
- [ ] Search unit by nomor

#### 3.2 Detail Unit
- [ ] Klik unit → halaman detail
- [ ] Daftar semua milestone + status masing-masing
- [ ] Tombol update milestone (shortcut ke Fase 2)
- [ ] Galeri semua foto yang pernah diupload — timeline dari awal hingga terkini
- [ ] Swipe horizontal antar foto

#### 3.3 Laporan Kendala (`Kendala > Buat Laporan`)
- [ ] Form laporan masalah kontraktor / kondisi lapangan
- [ ] Kategori kendala: `Kualitas Pekerjaan / Jadwal Molor / Cuaca / Akses Lokasi / Lainnya`
- [ ] Tingkat urgensi: `Rendah / Sedang / Tinggi / Kritis`
- [ ] Foto kendala (ambil dari kamera atau galeri)
- [ ] Deskripsi masalah + rekomendasi solusi
- [ ] Submit → notifikasi masuk ke Manajer Proyek

#### 3.4 Daftar Kendala (`Kendala > Riwayat`)
- [ ] Semua laporan kendala yang pernah dibuat
- [ ] Status: `Baru / Sedang Ditangani / Selesai`
- [ ] Balasan / tindak lanjut dari Manajer Proyek
- [ ] (Manajer Proyek) Update status kendala

### Checklist Selesai Fase 3
- [ ] Semua unit tampil dengan persentase milestone
- [ ] Galeri foto per unit berfungsi
- [ ] Laporan kendala terkirim dan memicu notifikasi ke manajer
- [ ] Manajer Proyek bisa update status kendala

---

## Fase 4 — Notifikasi & Offline Mode

### Tujuan
Memastikan tim lapangan tetap menerima informasi penting dan bisa bekerja meskipun sinyal lemah di lokasi proyek.

### Pekerjaan

#### 4.1 Push Notification
- [ ] Setup Firebase Cloud Messaging (FCM)
- [ ] Notifikasi masuk ke HP untuk:
  - `Milestone mendekati/melewati target tanggal`
  - `Kendala telah direspons oleh Manajer Proyek`
  - `Tagihan termin kontraktor disetujui/ditolak`
  - `Pesan penting dari Manajer Proyek`
- [ ] Halaman riwayat notifikasi
- [ ] Mark as read / mark all as read

#### 4.2 Offline Mode (Mode Tanpa Internet)
- [ ] Simpan data update milestone yang belum terkirim ke antrian lokal (`AsyncStorage`)
- [ ] Banner indikator di app saat offline
- [ ] Auto sync — kirim data antrian otomatis saat koneksi pulih
- [ ] Foto yang akan diupload tersimpan lokal dulu, upload begitu ada koneksi
- [ ] Cache daftar unit & milestone agar bisa dibaca meski offline

#### 4.3 Sinkronisasi
- [ ] Pull-to-refresh di semua halaman daftar
- [ ] Indikator loading saat sinkronisasi
- [ ] Konfirmasi sukses saat data berhasil sinkron

### Checklist Selesai Fase 4
- [ ] Push notification diterima oleh HP
- [ ] Update milestone tersimpan lokal saat offline dan terkirim otomatis saat online
- [ ] Tidak ada data yang hilang karena masalah koneksi
- [ ] Indikator offline/online terlihat jelas

---

## Fase 5 — Polish & Deployment

### Tujuan
Memoles tampilan, memperbaiki pengalaman pengguna, dan mendistribusikan aplikasi ke Site Engineer dan Manajer Proyek.

### Pekerjaan

#### 5.1 UI/UX Polish
- [ ] Ukuran tombol cukup besar untuk disentuh dengan jari (min. 44px tap target)
- [ ] Feedback haptic saat submit/update berhasil
- [ ] Loading state (spinner) saat proses upload / submit
- [ ] Empty state dengan ilustrasi (saat belum ada milestone/kendala)
- [ ] Konfirmasi dialog sebelum aksi penting (tandai selesai, kirim laporan)
- [ ] Error message yang jelas dalam Bahasa Indonesia
- [ ] Tampilan adaptif untuk HP kecil (5") hingga besar (6.7")

#### 5.2 Optimasi Foto
- [ ] Kompresi otomatis gambar sebelum upload (maks. 1MB per foto)
- [ ] Upload multi-foto secara paralel dengan progress bar
- [ ] Retry otomatis jika upload gagal

#### 5.3 Keamanan
- [ ] Opsi login biometrik (fingerprint / face ID)
- [ ] Auto-lock setelah 15 menit tidak aktif
- [ ] Token refresh otomatis

#### 5.4 Pengujian
- [ ] Uji di Android versi lama (Android 9+)
- [ ] Uji di iOS (iOS 14+)
- [ ] Uji kondisi jaringan lambat (3G simulation)
- [ ] Uji offline mode — update milestone tanpa internet
- [ ] Bug fix

#### 5.5 Deployment
- [ ] Build APK / AAB untuk Android
- [ ] Build IPA untuk iOS
- [ ] Distribusi internal: via APK langsung (Android) / TestFlight (iOS)
- [ ] Panduan singkat instalasi untuk tim lapangan

### Checklist Selesai Fase 5
- [ ] Semua tombol nyaman disentuh
- [ ] Foto terkompresi dan terupload dengan lancar
- [ ] App berjalan stabil di Android & iOS
- [ ] Site Engineer & Manajer Proyek sudah berhasil install dan login

---

## Ringkasan Fitur per Role

| Fitur | Site Engineer | Manajer Proyek |
|-------|:-------------:|:--------------:|
| Login | ✅ | ✅ |
| Update Status Milestone | ✅ | ✅ |
| Upload Foto Milestone | ✅ | ✅ |
| Laporan Kendala | ✅ | ✅ |
| Lihat Detail Semua Unit | ✅ (unit ditugaskan) | ✅ (semua proyek) |
| Update Status Kendala | ❌ | ✅ |
| Notifikasi | ✅ | ✅ |
| Offline Mode | ✅ | ✅ |

---

## Ringkasan Screens

| Screen | Fase | Prioritas |
|--------|------|-----------|
| Login | 1 | Wajib |
| Beranda | 1 | Wajib |
| Pilih Unit & Milestone | 2 | Wajib |
| Update Status Milestone | 2 | Wajib |
| Upload Foto Milestone | 2 | Wajib |
| Riwayat Update | 2 | Tinggi |
| Daftar Unit | 3 | Wajib |
| Detail Unit + Galeri | 3 | Wajib |
| Form Laporan Kendala | 3 | Wajib |
| Riwayat Kendala | 3 | Tinggi |
| Notifikasi | 4 | Tinggi |
| Offline Queue Indicator | 4 | Tinggi |
| **Total screens** | — | **~12** |

---

*Dokumen: mobile-lapangan.md | Fase Pengembangan Frontend | Versi 2.0 | Februari 2026*
*Direvisi: Disesuaikan untuk skema kontraktor — hanya Site Engineer & Manajer Proyek (tim internal developer)*