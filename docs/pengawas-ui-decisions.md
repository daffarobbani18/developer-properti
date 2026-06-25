# Pengawas Lapangan — UI/UX Decision Log

> **Role**: Pengawas Lapangan (Field Supervisor)  
> **Screens dalam scope**: FieldHomeScreen, FieldMilestonesScreen, FieldDailyReportScreen, InspectionUnitsScreen  
> **Last Updated**: 2026-06-25  
> **Version**: 1.6  
> **State**: Stable — Governance Active  
> **Prinsip utama**: Workflow dan efisiensi operasional lebih penting daripada kesamaan visual dengan Customer.

### Klasifikasi Item dalam Dokumen Ini

Setiap item dalam dokumen ini diklasifikasikan ke salah satu dari:

| Kategori | Arti |
|---|---|
| **Final Decision** | Keputusan sudah diambil, diverifikasi, dan diimplementasikan. Tidak boleh dibuka kembali tanpa data baru. |
| **Monitoring Backlog** | Kebutuhan teridentifikasi tapi belum diimplementasikan. Ada threshold konkret yang harus terpenuhi. |
| **Waiting for Production Data** | Keputusan tidak dapat diambil karena data produksi belum tersedia. |
| **Waiting for User Validation** | Keputusan memerlukan observasi atau pengujian pengguna nyata sebelum dapat diambil. |
| **Waiting for Architecture Decision** | Keputusan tidak dapat dilanjutkan sampai ada kesepakatan atau spesifikasi arsitektur dari tim terkait (backend, frontend, infra, security, dsb). Tidak dapat diselesaikan melalui analytics, UAT, observasi pengguna, maupun data produksi. |
| **Hypothesis** | Asumsi kerja berdasarkan analisis kode atau logika UX. Belum diverifikasi dengan data atau pengguna. |

### Evidence Type

Setiap bukti dalam dokumen ini dikategorikan ke salah satu dari:

| Evidence Type | Apa yang Dibuktikan | Kekuatan |
|---|---|---|
| **Code Verification** | Kondisi terjadi di kode — dapat direproduksi siapa saja dengan membaca file yang sama | Tinggi untuk masalah teknis |
| **Production Data** | Kondisi terjadi pada penggunaan nyata di lingkungan produksi | Tertinggi untuk keputusan skala dan volume |
| **UAT Result** | Pengguna mengalami masalah dalam skenario pengujian terstruktur | Tinggi untuk usability |
| **Field Observation** | Pengguna mengalami masalah dalam kondisi kerja nyata di lapangan | Tertinggi untuk operational UX |
| **Analytics** | Pola penggunaan terukur dari event tracking atau log | Tinggi untuk keputusan frekuensi dan navigasi |
| **User Interview** | Pengguna menyatakan kebutuhan atau masalah secara langsung | Tinggi untuk kebutuhan yang belum terlihat dari kode |

Catatan: **Code Verification** membuktikan bahwa masalah ada di kode. **Production Data** atau **Field Observation** membuktikan bahwa masalah benar-benar dirasakan pengguna. Keduanya diperlukan untuk keputusan yang paling kuat.

---

## Prinsip Kerja

Setiap perubahan harus memiliki minimal satu dari:
- Bukti dari kode yang dapat diverifikasi
- Data produksi aktual
- Hasil pengujian pengguna nyata
- Masalah yang dapat direproduksi

Hindari siklus: ubah UI → ubah lagi → ubah lagi → tanpa data baru.

Gunakan proses: temukan masalah nyata → verifikasi → perbaiki → dokumentasikan → lanjut ke masalah berikutnya.

---

## Assumptions & Validation Status

### Sudah Terverifikasi dari Kode dan Diimplementasikan

- **FieldMilestonesScreen empty state — dibedakan dua kondisi** — `!selectedUnitId` → instruksi memilih unit; `selectedUnitId && milestones.length === 0` → informasi tidak ada milestone. `FieldMilestonesScreen.tsx:451-455`. 2026-06-25.
- **Progress Summary Bar — dijadikan tappable, scroll ke milestone IN_PROGRESS** — `milestoneRowRefs` di-reset setiap pergantian unit/reload. Jika lebih dari satu IN_PROGRESS, scroll ke `orderNo` terendah. 2026-06-25.
- **Touch target chip dan updateBtn — dinaikkan ke 44px minimum** — `chip.paddingVertical: 12`, `updateBtn.paddingVertical: 12`. 2026-06-25.
- **False affordance riwayat jurnal dihilangkan** — shadow dihapus, borderRadius dikurangi ke 16. Struktur JSX tidak berubah sehingga mudah dikembalikan jika history dibuat interaktif. 2026-06-25.
- **Offline banner FieldMilestonesScreen — diganti ke shared OfflineBanner component** — hanya screen dengan workflow offline queue yang menampilkan banner. 2026-06-25.
- **Status laporan hari ini di HomeScreen** — `getFieldDailyReports` dipanggil via `Promise.all` bersama `getFieldProjects`. Row status muncul dengan CTA navigasi langsung ke tab Laporan. `useFocusEffect` memastikan status terupdate setelah kembali dari tab lain. 2026-06-25.
- **Emergency draft autosave untuk laporan harian** — debounce 2 detik ke `AsyncStorage` key `simdp-daily-report-draft`. Restore saat modal dibuka jika tanggal cocok. Hapus setelah submit berhasil. `returnKeyType` dan `blurOnSubmit` diperbaiki. 2026-06-25.

### Sudah Terverifikasi dari Kode

- **Badge defect selalu menampilkan "Siap" — data integrity failure** — Diverifikasi dari `InspectionUnitsScreen.tsx:146-147` dan `api.ts:614-617`. `getInspectionBookings` tidak mengembalikan field `defects`. `item.defects` selalu `undefined`. Badge "Siap" selalu tampil meskipun unit memiliki defect aktif. Mitigasi Opsi C aktif (badge dihapus dari list). Target final: defect summary tersedia di list tanpa masuk ke detail. 2026-06-25.
- **Offline queue tidak memiliki deduplication** — Diverifikasi dari `storage.ts:81-84`. `pushOfflineQueue` hanya append tanpa cek duplikasi. Jika dua item dengan `milestoneId` yang sama ada di queue, keduanya akan disubmit sequential. Keputusan model queue (command history vs latest state snapshot) belum ditetapkan dan harus didokumentasikan. 2026-06-25.
- **Silent sync failure — return value flushQueue tidak dikonsumsi** — Diverifikasi dari `useOfflineQueue.ts:77-80` dan `FieldHomeScreen.tsx`. `flushQueue` return `{ synced, failed }` tapi tidak digunakan di manapun. Pengguna tidak tahu jika ada item yang gagal sync. 2026-06-25.
- **Tab tidak unmount saat switch — state dipertahankan** — Diverifikasi dari `AppNavigator.tsx:88`. Tidak ada `unmountOnBlur`. State `useState` dipertahankan antar tab switch. Loading cascade hanya terjadi pada cold start. 2026-06-25.
- **Tidak ada context persistence antar cold start** — Diverifikasi dari `storage.ts` (hanya 4 key: auth, queue, inactive, biometric). Tidak ada key untuk lastProjectId, lastUnitId, lastMilestoneId. Setiap cold start mulai dari `useState(null)`. 2026-06-25.
- **History laporan harian tidak bisa dibuka (gap fungsional)** — Diverifikasi dari `FieldDailyReportScreen.tsx:247` (View, bukan Pressable) dan `AppNavigator.tsx:58` (tidak ada screen DailyReportDetail di stack). Tidak ada navigasi ke detail laporan lama. Dicatat sebagai gap fungsional yang perlu screen baru. 2026-06-25.
- **Tombol back di tab screens** — Diverifikasi dari `AppNavigator.tsx:127-129`. FieldMilestonesScreen, FieldDailyReportScreen, InspectionUnitsScreen adalah bottom tab screens, bukan pushed screens. Tombol back sudah dihapus. 2026-06-25.
- **FieldDailyReportScreen overlap issue** — Diverifikasi dari struktur render aktual (`LinearGradient` → `subHeaderRow` → `overlapContainer`). Sudah diperbaiki. `FieldDailyReportScreen.tsx:190`.
- **FieldMilestonesScreen blank loading state** — Diverifikasi dari kondisi render (`isLoading && projects.length > 0`). Sudah diperbaiki. `FieldMilestonesScreen.tsx:119-169`.
- **Header height inconsistency** — Diverifikasi dari nilai `height: 200` vs `minHeight: 240` dan konten dinamis di dalam gradient. Sudah diperbaiki.

### Menunggu Data Produksi

- **Search InspectionUnitsScreen** — Belum ada data volume unit siap inspeksi di produksi.
- **Filter milestone berdasarkan status** — Belum ada data rata-rata milestone per unit di produksi.
- **Relevansi offline queue indicator di HomeScreen** — Belum ada analytics rata-rata nilai queue dalam kondisi lapangan.
- **Shortcut ke pekerjaan aktif dari HomeScreen** — Belum ada data frekuensi navigasi aktual.

### Menunggu Pengujian Pengguna

- **Efektivitas aggregate stats card di InspectionUnitsScreen**
  - Pertanyaan: Apakah pengawas membaca angka aggregate sebelum masuk ke list, atau langsung scroll ke item spesifik?
  - Metode validasi: UAT minimal 5 pengawas lapangan ATAU 3 sesi observasi lapangan (screen recording atau shadow session)
  - Kondisi resolusi: Jika mayoritas pengguna mengabaikan stats card dan langsung ke list, pertimbangkan menghapus atau menyederhanakan card. Jika stats card digunakan untuk membuat keputusan ("ada 3 defect, perlu tindakan"), pertahankan.

- **Efektivitas shortcut pekerjaan aktif dari HomeScreen**
  - Pertanyaan: Apakah pengguna menggunakan HomeScreen sebagai titik navigasi, atau langsung membuka tab yang relevan?
  - Metode validasi: Analytics event tracking (screen_open per session) ATAU observasi 5 sesi pengguna nyata
  - Kondisi resolusi: Jika analytics menunjukkan >60% sesi dimulai dari tab langsung (bukan HomeScreen), shortcut dari HomeScreen prioritasnya turun. Jika HomeScreen sering digunakan sebagai titik awal, shortcut menjadi bernilai.

- **Pola navigasi paling sering digunakan Pengawas Lapangan**
  - Pertanyaan: Screen mana yang dibuka pertama setelah app launch? Tab mana yang paling sering dibuka?
  - Metode validasi: Analytics event tracking `screen_open` dengan timestamp per session — minimal 2 minggu data produksi
  - Kondisi resolusi: Data tersedia dan menunjukkan pola yang konsisten (>70% sesi menuju screen yang sama). Hasil digunakan untuk merevisi prioritas optimasi navigasi.

---

## Keputusan yang Sudah Diselesaikan

### InspectionUnitsScreen — Badge Defect Mitigasi (Opsi C)

**Keputusan**: Badge defect dihapus dari list. Semua unit tidak lagi menampilkan badge "Siap" palsu. Stat "withDefects" diganti dengan "scheduled" yang datanya tersedia.

**Alasan**: `getInspectionBookings` tidak mengembalikan data defects. `item.defects` selalu `undefined`. Menampilkan "Siap" untuk semua unit adalah data integrity failure yang menyebabkan kesalahan prioritas operasional.

**Ini adalah mitigasi, bukan solusi final.** Target akhir: defect summary tersedia di list view tanpa perlu masuk ke detail per unit. Roadmap: koordinasikan dengan backend untuk join defects ke booking response (Opsi A), atau parallel fetch client-side (Opsi B).

**Bukti**:
- Type: Code Verification
- Source: `InspectionUnitsScreen.tsx:146-147` — `item.defects?.filter(...)` selalu `undefined`. `api.ts:614-617` — `mockBookings` tidak memiliki field `defects`. `api.ts:625-641` — endpoint tidak join defects.

**A. Kondisi untuk mengimplementasikan solusi final (menutup mitigasi Opsi C):**
- Backend menyediakan data defects dalam response booking (Opsi A), ATAU
- Parallel fetch client-side `getInspectionDefects` diimplementasikan setelah `getInspectionBookings` selesai (Opsi B)
- Diverifikasi melalui code review dan pengujian bahwa badge defect menampilkan angka yang benar

**B. Kondisi untuk evaluasi ulang mitigasi sebelum solusi final tersedia:**
- Hasil UAT, field observation, atau analytics menunjukkan bahwa tidak adanya indikator defect di list view menyebabkan pengawas masuk ke unit yang sebenarnya tidak perlu diprioritaskan
- Minimal: 3 kejadian terdokumentasi atau feedback eksplisit dari pengguna lapangan
- Jika kondisi ini terpenuhi, pertimbangkan interim solution (misalnya: tampilkan label "Cek Detail" alih-alih badge status)

**Klasifikasi**: Final Decision (mitigasi Opsi C) + Monitoring Backlog (solusi final Opsi A/B)

**Status**: Mitigasi selesai — 2026-06-25. Solusi final menunggu koordinasi backend.

---

### Tab Screens — Penghapusan Tombol Back

**Keputusan**: Menghapus tombol back dari FieldMilestonesScreen, FieldDailyReportScreen, dan InspectionUnitsScreen.

**Alasan**: Ketiga screen adalah bottom tab screens, bukan pushed screens. Tab screens tidak memiliki screen sebelumnya dalam stack untuk kembali. Tombol back tidak valid secara navigasi dan menyesatkan pengguna.

**Perubahan**: `heroNavRow` yang berisi `Pressable arrow-back + title + spacer` diganti menjadi title-only row di ketiga screen.

**Bukti**:
- Type: Code Verification
- Source: `AppNavigator.tsx:127-129` — FieldMilestones, FieldDailyReport, InspectionUnits terdaftar sebagai `FieldTab.Screen`, bukan `FieldStack.Screen`.

**Kondisi untuk membuka kembali**: Jika salah satu screen ini juga perlu diakses via stack push (deep link, notifikasi), tombol back perlu ditampilkan kondisional berdasarkan `navigation.canGoBack()`.

**Klasifikasi**: Final Decision

**Status**: Selesai — 2026-06-25

---

### FieldDailyReportScreen — Penghapusan Overlap Pattern

**Keputusan**: Menghapus `marginTop: -40` pada `overlapContainer`.

**Alasan teknis**: Struktur layout berbeda dengan CustomerHomeScreen yang menjadi referensi asli pattern ini. `overlapContainer` berada setelah `subHeaderRow` (baris tanggal dengan background `c.neutral50` dan teks `c.neutral900`), bukan langsung setelah hero gradient. Efek `-40` dalam konteks ini menyebabkan `journalCard` overlap ke teks tanggal, bukan ke gradient biru. Ini tidak pernah merupakan intent desain yang benar.

**Perubahan**: `marginTop: -40` → `marginTop: 16`

**Bukti**:
- Type: Code Verification
- Source: `FieldDailyReportScreen.tsx:172-190` — urutan render `LinearGradient` → `subHeaderRow` → `overlapContainer`. Tidak ada gradient di atas `overlapContainer`.

**Kondisi untuk membuka kembali**: Jika `subHeaderRow` dipindahkan kembali ke dalam `LinearGradient`, maka `marginTop: -40` dapat dipertimbangkan kembali.

**Klasifikasi**: Final Decision

**Status**: Selesai — 2026-06-24

---

### FieldMilestonesScreen — Loading State Blank Screen

**Keputusan**: SkeletonList ditampilkan pada seluruh fase loading, bukan hanya saat `projects.length > 0`.

**Alasan teknis**: Ada 3 loading stage yang cascade: (1) load projects, (2) load units setelah project dipilih, (3) load milestones setelah unit dipilih. Kondisi sebelumnya `isLoading && projects.length > 0` menyebabkan stage pertama tidak menampilkan skeleton karena `projects` masih `[]`. Pengguna melihat blank screen tanpa indikasi bahwa data sedang dimuat.

**Perubahan dua bagian**:
1. `SkeletonList` kondisi: `isLoading && projects.length > 0` → `isLoading`
2. `RefreshControl.refreshing`: `isLoading && projects.length > 0` → `isLoading`

**Bukti**:
- Type: Code Verification
- Source: `FieldMilestonesScreen.tsx:119-169` — tiga `useEffect` terpisah dengan `setIsLoading(true/false)` independen. Kondisi `isLoading && projects.length > 0` di baris 271 terbukti tidak menampilkan skeleton saat stage pertama.

**Kondisi untuk membuka kembali**: Tidak perlu dibuka kembali kecuali loading architecture berubah fundamental.

**Klasifikasi**: Final Decision

**Status**: Selesai — 2026-06-24

---

### Header Height Consistency

**Keputusan**: Semua 4 halaman Pengawas menggunakan `minHeight: 240` + `paddingBottom: 60` + `borderRadius: 32` yang identik.

**Alasan teknis**: Sebelumnya campuran antara `height: 200` (fixed) dan `minHeight: 240` menyebabkan tinggi visual header berbeda saat berpindah tab. Konten dinamis (date row, chip selector) yang ditempatkan di dalam gradient menyebabkan `minHeight` mengembang tidak terkontrol.

**Pendekatan**: Konten dinamis (tanggal di DailyReport, chip selector di Milestones) dipindahkan keluar dari LinearGradient ke area di bawah header. Header hanya berisi elemen navigasi fixed.

**Bukti**:
- Type: Code Verification
- Source: `FieldHomeScreen.tsx:220-225`, `FieldMilestonesScreen.tsx:532-538`, `FieldDailyReportScreen.tsx:326-332`, `InspectionUnitsScreen.tsx:205-211` — semua menunjukkan `minHeight: 240, paddingBottom: 60, borderBottomLeftRadius: 32, borderBottomRightRadius: 32`.

**Kondisi untuk membuka kembali**: Jika ada perubahan desain intentional yang membutuhkan header dengan tinggi berbeda per halaman, atau jika konten header perlu diubah sehingga fixed height tidak lagi feasible.

**Klasifikasi**: Final Decision

**Status**: Selesai — 2026-06-24

---

## Backlog yang Dipantau

Item-item berikut **belum diperlukan berdasarkan data saat ini** tetapi dicatat sebagai kandidat roadmap.

### Offline Queue Model — Command History vs Latest State Snapshot

**Keputusan yang diperlukan**: Apakah offline queue menyimpan (A) command history — semua perubahan disimpan urut, atau (B) latest state snapshot — hanya state terakhir per item yang disimpan.

**Implikasi model A (command history):**
- Semua perubahan dikirim ke server secara urut
- Server dapat merekonstruksi riwayat perubahan
- Risk: jika ada dua update untuk milestone yang sama, keduanya disubmit
- Cocok jika server membutuhkan audit trail

**Implikasi model B (latest state snapshot):**
- Queue hanya menyimpan state terbaru per `milestoneId`
- Deduplication: item lama diganti jika `milestoneId` sama
- Informasi riwayat perubahan hilang
- Cocok jika server hanya butuh state final
- Lebih aman untuk mencegah data conflict

**Status saat ini**: Model A secara de-facto (append-only, tidak ada deduplication di `pushOfflineQueue`). Belum ada keputusan eksplisit.

**Bukti**:
- Type: Code Verification
- Source: `storage.ts:81-84` — `pushOfflineQueue` hanya append. `useOfflineQueue.ts:56-70` — iterasi sequential tanpa deduplication.

**Tindakan yang diperlukan**: Tim backend dan frontend harus menyepakati model sebelum production. Keputusan ini memengaruhi conflict resolution strategy.

**Klasifikasi**: Waiting for Architecture Decision

> Keputusan ini merupakan keputusan arsitektur sistem, bukan keputusan UX atau observasi penggunaan. Tidak akan pernah dijawab oleh analytics atau data produksi. Memerlukan alignment eksplisit antara tim frontend dan backend sebelum implementasi apapun dapat dimulai.

**Status**: Belum diputuskan — 2026-06-25

---

### Silent Sync Failure — Queue Health Visibility

**Kebutuhan**: Pengguna lapangan perlu mengetahui:
1. Berapa item yang sedang menunggu sinkronisasi
2. Berapa item yang gagal disubmit
3. Berapa lama item tertua sudah menunggu (queue age)

**Contoh pesan yang bermakna**: "5 data menunggu sinkronisasi (tertua 3 jam)" atau "2 update gagal terkirim — ketuk untuk coba lagi"

**Mengapa queue age penting**: Queue dengan 0 failed dan 12 pending yang tertua 18 jam adalah kondisi yang jauh lebih berbahaya dari queue dengan 2 failed yang baru terjadi.

**Bukti masalah**:
- Type: Code Verification
- Source: `useOfflineQueue.ts:77-80` — `flushQueue` return `{ synced, failed }` tidak dikonsumsi di manapun. Pengguna tidak mendapat feedback jika sync gagal.

**Desain feedback yang sudah ditetapkan**:

| Kondisi | Pesan | Tone |
|---|---|---|
| Sync berhasil semua | "N perubahan berhasil disinkronkan" | success (ringan, auto-dismiss) |
| Sukses sebagian | "N berhasil disinkronkan, M masih dalam antrean" | warning |
| Gagal total | "Gagal melakukan sinkronisasi. Data tetap tersimpan dan akan dicoba kembali." | danger |

**Implementasi yang diperlukan** (harus dilakukan dalam satu sprint, tidak boleh dicampur dengan perubahan UI lain):
- Konsumsi return value `flushQueue` di level yang terlihat pengguna
- Tambahkan `oldestItemAt` ke `PendingQueueItem` type
- Tampilkan queue health di HomeScreen saat queue > 0 atau failed > 0
- Tambahkan retry action manual

**Catatan implementasi**: Menyentuh `useOfflineQueue` hook dan consumer screens. Harus ditest di kondisi jaringan simulasi (airplane mode → reconnect) sebelum merge.

**Kondisi untuk Menutup Item**:
- `flushQueue` return value dikonsumsi dan ditampilkan ke pengguna
- Semua tiga kondisi feedback (sukses, parsial, gagal) berfungsi
- Queue age ditampilkan jika item tertua > 1 jam
- Diverifikasi melalui code review dan pengujian manual pada kondisi offline simulasi

**Kondisi untuk De-prioritize**: Jika production data menunjukkan `failed` selalu 0 dalam kondisi normal lapangan dan queue age tidak pernah melampaui 30 menit.

**Klasifikasi**: Monitoring Backlog (P1 — implementasikan dalam sprint berikutnya, pisah dari perubahan UI)

**Status**: Belum diimplementasikan — 2026-06-25. Desain feedback ditetapkan 2026-06-25.

---

### Context Persistence — Workflow Continuity

**Kebutuhan**: Saat cold start (app killed oleh OS), pengguna harus dapat melanjutkan pekerjaan terakhir tanpa memilih ulang project dan unit.

**Scope context yang perlu disimpan**:
- `lastProjectId` — project terakhir yang dipilih di Milestones
- `lastUnitId` — unit terakhir yang dipilih di Milestones
- `lastMilestoneId` (opsional) — untuk "resume last work" di HomeScreen
- Draft laporan (sudah tersimpan sebagai `isDraft: true` di server)
- `lastInspectionFilter` (masa depan, jika filter tersedia)

**Implementasi minimal**:
```
AsyncStorage keys baru:
  simdp-last-project-id
  simdp-last-unit-id
```
Simpan saat `setSelectedProjectId` / `setSelectedUnitId` dipanggil.
Restore saat cold start mount.

**Dependency**: Context persistence adalah prerequisite untuk "Milestone Aktif" card di HomeScreen (Fase 2).

**Bukti masalah**:
- Type: Code Verification
- Source: `storage.ts` — hanya 4 key. `FieldMilestonesScreen.tsx:54-56` — state default `null` setiap cold start.

**Kondisi untuk Menutup Item**:
- `lastProjectId` dan `lastUnitId` tersimpan di `AsyncStorage` saat `setSelectedProjectId`/`setSelectedUnitId` dipanggil
- Nilai direstore saat cold start mount di `FieldMilestonesScreen`
- Diverifikasi melalui code review dan pengujian manual: kill app → reopen → verifikasi project dan unit terakhir terpilih otomatis

**Kondisi untuk De-prioritize**: Jika field observation menunjukkan pengawas tidak pernah mengalami cold start yang disruptif karena OS kill (penggunaan app intensif sepanjang hari kerja).

**Klasifikasi**: Monitoring Backlog (P1)

**Status**: Belum diimplementasikan — 2026-06-25

---

### HomeScreen Dashboard — Operational Visibility (3 Fase)

**Kebutuhan**: HomeScreen harus menjawab dalam < 3 detik:
- Apa pekerjaan saya berikutnya?
- Apa yang overdue?
- Apa yang gagal disinkronkan?
- Sudahkah saya membuat laporan hari ini?

**Severity**: P1 (High Business Value, bukan P0 karena pengguna masih dapat menyelesaikan tugas tanpa HomeScreen yang optimal)

**Dependency Analysis**:

| Data | Tersedia? | Dependency |
|---|---|---|
| Laporan hari ini sudah/belum | Ya | `getFieldDailyReports` sudah ada di DailyReport screen |
| Status sinkronisasi | Ya | `useOfflineQueue` tersedia |
| Milestone aktif saat ini | Parsial | Perlu context persistence (lastUnitId) |
| Milestone overdue | **Belum diverifikasi** | Perlu verifikasi: (1) apakah field `targetDate` tersedia di response `getUnitMilestones`, (2) apakah formatnya konsisten dan dapat dibandingkan dengan `new Date()`, (3) apakah definisi "overdue" terdokumentasi. Jangan diperlakukan sebagai dependency tersedia sebelum Code Verification selesai. |
| Unit terjadwal inspeksi hari ini | Ya | `getInspectionBookings` + filter `scheduleDate` |

**Roadmap 3 Fase**:

Fase 1 (tanpa API baru, tanpa dependency):
- Tampilkan status laporan hari ini: "Sudah dibuat" / "Belum dibuat"
- Tampilkan queue health jika ada item pending/failed

Fase 2 (setelah context persistence tersedia):
- Tampilkan card "Milestone Aktif" berdasarkan lastUnitId
- Jika ada milestone IN_PROGRESS, tampilkan nama + CTA "Update"

Fase 3 (opsional, koordinasi backend):
- Dashboard penuh dengan milestone overdue + unit inspeksi hari ini

**Kondisi untuk Menutup Fase 1**:
- Status laporan hari ini tampil di HomeScreen (sudah/belum dibuat) berdasarkan data `getFieldDailyReports`
- Queue health ditampilkan saat `queueCount > 0` atau `failed > 0`
- Diverifikasi melalui code review dan pengujian manual

**Kondisi untuk Menutup Fase 2**:
- Context Persistence (lastUnitId) sudah diimplementasikan dan diverifikasi
- Card "Milestone Aktif" tampil di HomeScreen dengan data yang benar

**Kondisi untuk Menutup Fase 3**:
- Backend menyediakan endpoint atau data milestone overdue
- Field `targetDate` terverifikasi tersedia dan formatnya konsisten (lihat catatan Temuan 8)

**Kondisi untuk De-prioritize Fase 1**: Jika UAT menunjukkan pengawas tidak menggunakan HomeScreen sebagai titik orientasi kerja harian dan langsung membuka tab yang relevan.

**Klasifikasi**: Monitoring Backlog (Fase 1 dapat dimulai, Fase 2 butuh Context Persistence selesai dulu, Fase 3 butuh koordinasi backend)

**Status**: Belum diimplementasikan — 2026-06-25

---

### Touch Target Lapangan — Field-Condition Usability

**Standar yang ditetapkan untuk role Pengawas Lapangan**:
- Critical CTA (submit, simpan): minimum tinggi **52px**
- Standard button/action: minimum tinggi **48px**
- Chip dan filter: minimum tinggi **44px**
- Icon-only button: minimum **44×44px**

**Alasan**: Pengawas bekerja dengan sarung tangan tipis, layar di bawah sinar matahari, sering berpindah lokasi. Standar WCAG 44px minimum tidak cukup untuk kondisi ini.

**Temuan saat ini**:
- `chip` di Milestones: `paddingVertical: 8` → ~36px — **di bawah standar**
- `updateBtn` di milestone card: `paddingVertical: 8` → ~36px — **di bawah standar**
- Progress bar `progressSummaryTrack`: 6px — **di bawah rekomendasi 8px untuk outdoor**

**Bukti**:
- Type: Code Verification
- Source: `FieldMilestonesScreen.tsx:551,578` — `chip paddingVertical: 8`, `updateBtn paddingVertical: 8`

**Kondisi untuk Menutup Item**:
- `chip paddingVertical` dinaikan ke minimum 10px (menghasilkan ~44px tinggi total)
- `updateBtn paddingVertical` dinaikan ke minimum 10px
- `progressSummaryTrack` height dinaikan ke 8px
- Diverifikasi melalui code review. Validasi lapangan direkomendasikan via UAT dengan perangkat fisik.

**Kondisi untuk De-prioritize**: Jika UAT menunjukkan tidak ada mis-tap yang dilaporkan pengguna pada chip dan updateBtn dalam kondisi pengujian simulasi lapangan.

**Klasifikasi**: Monitoring Backlog (P1 untuk chip dan updateBtn, P2 untuk progress bar)

**Status**: Belum diimplementasikan — 2026-06-25

---

### Quick Action — Shortcut ke Pekerjaan Aktif

**Hipotesis** (bukan analisis berbasis data): Berdasarkan domain konstruksi, update milestone diperkirakan adalah tugas harian tertinggi frekuensinya. Belum didukung telemetry usage, analytics, atau field observation.

**Masalah yang diidentifikasi dari kode**: Saat ini dari HomeScreen, pengawas perlu tap project → FieldUnits → pilih tab Progres atau Inspeksi. Tidak ada shortcut langsung ke milestone IN_PROGRESS. Jumlah tap minimum: 3–4 tap + 2 screen transition.

**Catatan penting**: Sebelum mengimplementasikan quick action apapun, frekuensi tugas aktual harus tersedia dari analytics atau field observation. Jangan implementasikan berdasarkan hipotesis domain.

**Opsi implementasi yang dapat dipertimbangkan setelah data tersedia**:
1. Progress summary bar di Milestones dijadikan tappable — scroll otomatis ke milestone IN_PROGRESS
2. Card "Lanjutkan" di HomeScreen setelah context persistence tersedia

**Dependency**: Opsi 2 memerlukan Context Persistence (lastUnitId) sebagai prerequisite.

**Data yang dibutuhkan sebelum implementasi**: Frekuensi navigasi aktual — apakah pengawas lebih sering masuk melalui bottom tab langsung atau melalui HomeScreen project card. Lihat tabel Data Produksi yang Belum Tersedia.

**Bukti masalah**:
- Type: Code Verification
- Source: `AppNavigator.tsx:126-129` — tidak ada shortcut screen di stack. `FieldHomeScreen.tsx` — project card navigasi ke `FieldUnits`, bukan langsung ke milestone.

**Kondisi untuk implementasi**: Frekuensi navigasi aktual tersedia (Analytics) DAN menunjukkan pola yang mendukung kebutuhan shortcut.

**Klasifikasi**: Hypothesis — perlu validasi usage pattern sebelum implementasi

**Status**: Menunggu data navigasi aktual — 2026-06-25

---

### Offline Conflict Management

**Risiko yang teridentifikasi**:

Skenario 1 (multi-user): Pengawas A update milestone offline, Pengawas B update milestone yang sama online, A sync belakangan — update A menimpa update B tanpa warning.

Skenario 2 (self-conflict): Pengguna update milestone dua kali karena tidak yakin update pertama tersimpan — dua item di queue untuk milestoneId yang sama.

**Status saat ini**: Tidak ada conflict detection. Server menerima semua update secara sequential. Perilaku akhir tergantung implementasi server (belum diverifikasi).

**Yang perlu diputuskan bersama backend**:
- Apakah server mendukung optimistic locking / version field?
- Apakah server reject update jika version tidak match?
- Apakah perlu `updatedAt` timestamp di setiap queue item untuk comparison?

**Bukti**:
- Type: Code Verification
- Source: `useOfflineQueue.ts:56-70` — iterasi queue sequential tanpa version check. `storage.ts:81-84` — append tanpa deduplication.

**Klasifikasi**: Waiting for Architecture Decision

> Item ini memerlukan verifikasi API spec backend (optimistic locking, versioning, conflict resolution) dan tidak bergantung pada analytics atau observasi pengguna. Tidak dapat diselesaikan dari sisi frontend tanpa keputusan eksplisit dari backend.

**Status**: Belum ada strategi — 2026-06-25

---

### Production Readiness Assessment — 2026-06-25 (Final Update)

> **Disclaimer Metodologi**: Skor berikut adalah estimasi kualitatif berdasarkan analisis kode tanpa UAT, field observation, atau production analytics. Skor tidak dapat direproduksi secara independen dan **tidak boleh digunakan sebagai dasar keputusan Go/No-Go Production**.
>
> Keputusan Go/No-Go Production harus berbasis:
> - Seluruh item P0 sudah ditutup
> - Seluruh item P1 sudah ditutup atau mitigasinya diterima
> - Hasil UAT dengan pengguna nyata
> - Production testing di environment yang representatif
> - Konfirmasi backend readiness

**Skor setelah implementasi perbaikan batch terakhir (indikator diskusi internal):**

| Dimensi | Skor Sebelum | Skor Sesudah | Perubahan |
|---|---|---|---|
| Visual Design | 7.5/10 | 7.5/10 | — |
| Workflow Efficiency | 6.5/10 | 7/10 | Progress Summary tappable, status laporan di HomeScreen |
| Operational Reliability | 5.5/10 | 6/10 | Draft autosave mengurangi risiko kehilangan data |
| Offline Readiness | 6/10 | 6.5/10 | Offline banner semantically correct, draft survive kill |
| Field Usability | 6.5/10 | 7/10 | Touch target chip dan updateBtn ≥ 44px |
| **Production Readiness** | **6.5/10** | **7/10** | Perbaikan mikro selesai, bottleneck utama tersisa |

**Item yang masih memblokir 8/10**:
1. Badge defect — solusi final (Opsi A atau B) — data integrity
2. Silent sync failure — queue health visibility
3. Offline conflict strategy — butuh keputusan arsitektur
4. Discovery workflow — project → unit → milestone masih 3 step loading
5. Context persistence — cold start selalu dari awal

**Fase UI/UX berbasis kode selesai dan dianggap production-ready dari sisi antarmuka.**

Langkah berikutnya bergeser ke:
1. Workflow optimization (context persistence, shortcut navigasi)
2. Reliability & offline experience (silent sync failure feedback, queue observability)
3. Dashboard intelligence berbasis data produksi aktual

Jangan membuka kembali: header, typography, spacing, shadow, radius, chip color, glassCard hierarchy, reportCard hierarchy, empty state styling, loading skeleton — seluruh area tersebut sudah tervalidasi.

**Klasifikasi**: Hypothesis (skor belum divalidasi melalui UAT)

**Status**: Diperbarui 2026-06-25 setelah batch implementasi perbaikan operasional

---

### Filter Milestone Berdasarkan Status

**Kebutuhan potensial**: Jika jumlah milestone per unit meningkat, pengawas perlu cara cepat menemukan milestone yang IN_PROGRESS tanpa scroll dari atas.

**Data saat ini**: Mock data menunjukkan ~4–6 milestone per unit. Tidak ada pagination di API `getUnitMilestones`. Milestone IN_PROGRESS sudah dibedakan secara visual via `workflowCardActive`.

**Threshold untuk implementasi**: Jika rata-rata milestone per unit di produksi melampaui 10, atau jika hasil pengujian pengguna menunjukkan pengawas kesulitan menemukan milestone aktif, filter perlu diimplementasikan.

**Catatan API**: `getUnitMilestones` saat ini tidak mendukung parameter filter server-side. Implementasi filter akan dilakukan client-side atau memerlukan perubahan API.

**Klasifikasi**: Monitoring Backlog

**Status**: Belum diimplementasikan — masuk monitoring roadmap

---

### Search pada InspectionUnitsScreen

**Kebutuhan potensial**: Jika volume unit siap inspeksi meningkat signifikan, pengguna perlu menemukan unit tertentu berdasarkan nomor unit tanpa scroll.

**Data saat ini**: Mock data berisi 2 booking. List sudah pre-filtered client-side (`progress === 100 || statusPembangunan === "Siap Huni"`). Dalam skenario serah terima bertahap, volume realistis diperkirakan 5–20 unit per batch.

**Catatan**: `getUnits()` di mock-data.ts sudah mendukung parameter `search` (filter by code/typeName). Jika search diperlukan, fondasi sudah ada di layer mock — perlu diteruskan ke API call.

**Threshold untuk implementasi**: Jika volume unit siap inspeksi secara bersamaan mencapai 30+ unit, atau jika hasil pengujian menunjukkan pengguna perlu mencari unit spesifik secara rutin.

**Klasifikasi**: Monitoring Backlog

**Status**: Belum diimplementasikan — masuk monitoring roadmap

---

### Relevansi Kartu Statistik Aggregate di InspectionUnitsScreen

**Pertanyaan terbuka**: GlassCard menampilkan `stats.total` dan `stats.withDefects` sebagai aggregate. Apakah dua angka ini cukup bernilai untuk menempati slot overlap card yang prominent, atau pengawas lebih baik langsung melihat list?

**Data yang dibutuhkan**: Apakah pengawas membuat keputusan berdasarkan aggregate ("ada 3 defect, perlu tim tambahan") atau langsung ke item spesifik ("cari unit A-01").

**Klasifikasi**: Waiting for User Validation

**Status**: Hipotesis — menunggu observasi penggunaan nyata

---

### Posisi Offline Queue Indicator di FieldHomeScreen

**Pertanyaan terbuka**: GlassCard di HomeScreen menampilkan "Antrean Offline" sebagai salah satu dari dua metrik utama. Ini adalah system state, bukan task. Apakah informasi ini cukup penting untuk menempati posisi paling prominent?

**Konteks**: Offline queue relevan di lapangan karena pengawas perlu tahu berapa update yang belum terkirim. Namun jika queue selalu 0 (kondisi normal), slot ini tidak memberikan nilai informasi.

**Data yang dibutuhkan**: Rata-rata nilai queue dalam kondisi kerja nyata. Jika queue sering > 0, posisi saat ini justified. Jika hampir selalu 0, slot lebih baik digunakan untuk informasi kerja.

**Klasifikasi**: Waiting for Production Data

**Status**: Hipotesis — menunggu data penggunaan produksi

---

### Analytics Instrumentation Foundation

**Tujuan**: Mengumpulkan data yang saat ini menjadi dependency untuk menyelesaikan banyak item yang berstatus `Waiting for Production Data`. Tanpa mekanisme pengumpulan data ini, sebagian besar item tersebut tidak akan pernah keluar dari status menunggu.

**Masalah saat ini**: Aplikasi tidak memiliki event tracking apapun. Tidak ada data frekuensi, navigasi, queue distribution, atau usage pattern yang tersedia.

**Minimal event yang diperlukan**:

| Event | Tujuan |
|---|---|
| `screen_open` (+ screen name, timestamp) | Menentukan screen mana yang paling sering dibuka |
| `milestone_update` (+ projectId, unitId, status) | Menentukan frekuensi tugas update milestone |
| `daily_report_submit` (+ timestamp) | Mengukur pola pembuatan laporan harian |
| `inspection_open` (+ bookingId) | Mengukur frekuensi akses inspeksi |
| `queue_size` (+ count, timestamp) | Mengukur distribusi ukuran queue |
| `queue_age_oldest` (+ age_minutes) | Mengukur berapa lama item tertua menunggu |
| `sync_success` (+ synced_count) | Mengukur keberhasilan sinkronisasi |
| `sync_failed` (+ failed_count, item_types) | Mengukur kegagalan sinkronisasi per tipe |

**Item governance yang terblokir tanpa data ini**:
- Shortcut ke Pekerjaan Aktif (menunggu navigasi frekuensi)
- Posisi Offline Queue Indicator (menunggu distribusi queue)
- Quick Action prioritas (menunggu frekuensi tugas aktual)
- Pola navigasi Pengawas Lapangan (menunggu screen_open analytics)
- Queue Health visibility threshold (menunggu queue_age data)

**Bukti masalah**:
- Type: Code Verification
- Source: Seluruh codebase — tidak ada event tracking library (Segment, Amplitude, Mixpanel, atau custom) yang ditemukan di `package.json` atau `services/`.

**Kondisi untuk Menutup Item**:
- Event tracking tersedia di environment produksi
- Minimal 8 event di atas ter-instrumen
- Data mulai terkumpul selama minimal 2 minggu produksi
- Dashboard atau export tersedia untuk tim

**Klasifikasi**: Monitoring Backlog

**Status**: Belum diimplementasikan — 2026-06-25

---

## Data Produksi yang Belum Tersedia

Audit berikutnya tidak dapat dilakukan secara definitif tanpa data berikut:

| Data | Relevansi | Cara Mengumpulkan |
|---|---|---|
| Rata-rata proyek aktif per pengawas | Menentukan apakah project list di HomeScreen perlu pagination atau sorting | Analytics produksi |
| Rata-rata milestone per unit di proyek nyata | Menentukan apakah filter milestone diperlukan | Query database produksi |
| Rata-rata unit siap inspeksi per batch serah terima | Menentukan apakah search di InspectionUnits diperlukan | Data operasional developer |
| Distribusi ukuran offline queue dalam kondisi lapangan | Menentukan relevansi offline queue indicator di HomeScreen | Log analytics |
| Latency API pada jaringan 3G/4G lemah | Menentukan apakah loading UX perlu perbaikan tambahan | Performance monitoring |
| Screen mana yang paling sering dibuka per hari kerja | Menentukan prioritas optimasi navigasi | Analytics event tracking |
| Frekuensi aktual per tugas (update milestone, buat laporan, inspeksi) | Menentukan quick action mana yang paling bernilai | Analytics event tracking |
| Queue age distribution di kondisi lapangan | Menentukan apakah queue health indicator perlu prominent di HomeScreen | Log analytics |
| Apakah server mendukung version field / optimistic locking | Menentukan strategi offline conflict resolution | Verifikasi API spec backend |

---

## Aturan Audit Berikutnya

1. **Jangan membuka kembali keputusan yang sudah ditetapkan** kecuali ada data baru yang relevan dan dicantumkan secara eksplisit.
2. **Jangan melakukan UI polish tambahan** tanpa temuan yang dapat diverifikasi dari kode, data, atau pengujian.
3. **Jangan menambahkan fitur** berdasarkan asumsi atau dugaan kebutuhan.
4. **Setiap usulan perubahan harus menyertakan**: bukti dari kode, data produksi, hasil pengujian pengguna, atau masalah nyata yang dapat direproduksi.
5. **Bedakan selalu**: keputusan yang sudah final / backlog yang dipantau / hipotesis yang menunggu validasi.
6. **Jangan menyimpulkan "tidak diperlukan"** untuk fitur yang belum diuji di kondisi produksi. Gunakan "belum diperlukan berdasarkan data saat ini".

---

## Aturan Update Dokumen

Setiap keputusan baru yang masuk ke dokumen ini wajib mencantumkan:

| Field | Keterangan |
|---|---|
| **Tanggal** | Tanggal keputusan diambil |
| **Alasan** | Mengapa keputusan ini diambil |
| **Bukti** | Referensi kode (file:line), data, atau hasil pengujian |
| **Evidence Type** | Code Verification / Production Data / UAT Result / Field Observation / Analytics / User Interview |
| **Klasifikasi** | Final Decision / Monitoring Backlog / Waiting for Production Data / Waiting for User Validation / Hypothesis |
| **Kondisi evaluasi ulang** | Kondisi spesifik yang harus terpenuhi sebelum keputusan ini boleh dibuka kembali |

**Keputusan tanpa bukti tidak boleh dimasukkan sebagai Final Decision.**

Jika bukti belum tersedia, klasifikasikan sebagai Hypothesis atau Waiting for Production Data sampai bukti diperoleh.

### Cara Penulisan Bukti

```
# Contoh Code Verification
Bukti:
  Type: Code Verification
  Source: FieldDailyReportScreen.tsx:172-190 — urutan render LinearGradient → subHeaderRow → overlapContainer

# Contoh Production Data
Bukti:
  Type: Production Data
  Source: API Metrics Dashboard — rata-rata milestone per unit = 15, Juni 2026

# Contoh UAT Result
Bukti:
  Type: UAT Result
  Source: UAT Batch #2 Pengawas Lapangan — 6/10 partisipan tidak menemukan milestone aktif tanpa scroll

# Contoh Field Observation
Bukti:
  Type: Field Observation
  Source: Observasi lapangan Proyek XYZ, 2026-07-10 — pengawas tap notifikasi 3x sebelum menemukan info yang dicari
```

---

## Prinsip Visual Alignment

Role Customer adalah **source of truth** untuk seluruh keputusan visual role Pengawas Lapangan:

- Typography hierarchy (fontSize, fontWeight, letterSpacing)
- Spacing system (padding, margin, gap)
- Border radius system
- Shadow / elevation tier
- Warna status (success, warning, danger, info)
- CTA hierarchy dan button treatment
- Header composition
- Card design language
- Visual density
- Information grouping

**Aturan default:** Jika ditemukan perbedaan antara Pengawas Lapangan dan Customer, ikuti Customer kecuali ada kebutuhan operasional yang terdokumentasi.

**Aturan sebelum membuat pola baru:**
1. Cari terlebih dahulu pola terdekat yang sudah ada di Customer
2. Gunakan kembali pola tersebut
3. Hanya buat pola baru jika tidak ada padanan relevan DAN ada alasan operasional yang kuat
4. Setiap perubahan visual harus dapat menjawab: **"Komponen Customer mana yang menjadi referensinya?"**

**Benchmark referensi Customer yang sudah diverifikasi:**

| Elemen | Referensi Customer | Nilai |
|---|---|---|
| heroHeader | CustomerHomeScreen:286-292 | minHeight:240, paddingBottom:60, borderRadius:32 |
| heroSafeArea | CustomerHomeScreen:295-297 | paddingHorizontal:24 |
| overlapContainer | CustomerHomeScreen:347-351 | marginTop:-40, paddingHorizontal:24, zIndex:10 |
| Primary card (glassCard) | CustomerHomeScreen:352-361 | borderRadius:24, padding:24, shadow h:16, opacity:0.1 |
| Secondary card | CustomerHomeScreen invoiceCard | borderRadius:24, padding:24, shadow h:8, opacity:0.04, elevation:3 |
| Stats card | CustomerProgressScreen statsCard | borderRadius:24, padding:24, shadow h:16, opacity:0.06, elevation:8, border:neutral100 |
| Timeline card | CustomerProgressScreen timelineContent | borderRadius:24, padding:20, shadow h:4, opacity:0.04, elevation:2 |
| List container | CustomerBillingScreen cleanList | borderRadius:24, paddingH:20, paddingV:8, shadow h:4, opacity:0.04, elevation:2 |
| sectionTitle | CustomerHomeScreen:429-435 | fontSize:18, fontWeight:"800", color:neutral900, letterSpacing:-1 |
| heroGreeting | CustomerHomeScreen:304-310 | fontSize:18, fontWeight:"600", rgba(255,255,255,0.7) |
| heroTitle (large) | CustomerProgressScreen heroTitle | fontSize:34, fontWeight:"900", letterSpacing:-1.2 |
| metricLabel | CustomerProgressScreen statsSubLabel | fontSize:13, fontWeight:"600", color:neutral500 |
| metricValue primary | CustomerProgressScreen statsMainValue | fontSize:42, fontWeight:"900", letterSpacing:-1.5 |
| metricValue secondary | CustomerProgressScreen statsSubValue | fontSize:18, fontWeight:"800" |
| Progress bar track | CustomerProgressScreen progressBarTrack | height:8, borderRadius:4, backgroundColor:neutral100 |
| Progress bar fill | CustomerHomeScreen progressFill | LinearGradient [primaryLight, primary] atau c.accent |
| Active state color | CustomerProgressScreen timelineContentActive | c.warning.text (border + shadow) |
| CTA button primary | CustomerBillingScreen submitBtn | backgroundColor:c.primary, borderRadius:16, teks putih |
| paddingTop (inline) | CustomerHomeScreen (safeTop pattern) | (safeTop \|\| 45) + 16 |

---

## Konteks Arsitektur Pengawas vs Customer

| Dimensi | Customer | Pengawas Lapangan |
|---|---|---|
| Tipe pengguna | Passive consumer — melihat satu properti miliknya | Active producer — mengelola banyak unit, merekam aktivitas |
| Tujuan utama | "Apa status rumah saya?" | "Apa yang harus saya kerjakan dan sudah saya lakukan?" |
| Jumlah subjek | Selalu 1 (unit milik sendiri) | Banyak (N unit, N milestone, N proyek) |
| Kepadatan data per card | Rendah (3–5 data point, ringkasan) | Tinggi (5–6 data point, operasional) |
| Orientasi aksi | Pasif / read + satu CTA | Aktif / banyak CTA, form submission, inspeksi |
| Kondisi jaringan | Diasumsikan stabil | Tidak stabil — offline queue wajib ada |

**Implikasi**: Mengadopsi design pattern Customer ke Pengawas hanya valid jika struktur konten dan tujuan pengguna serupa. Untuk komponen yang konteksnya berbeda, adaptasi harus mempertimbangkan kepadatan informasi, jumlah item yang bervariasi, dan konteks kerja lapangan.

---

---

## Decision Review Trigger

Dokumen ini hanya boleh direview ulang apabila minimal satu kondisi berikut terpenuhi:

| # | Kondisi | Contoh |
|---|---|---|
| 1 | Perubahan workflow bisnis yang memengaruhi cara Pengawas Lapangan bekerja | Proses serah terima unit berubah, milestone ditambah fase baru, SOP laporan harian direvisi |
| 2 | Data produksi baru yang mengubah asumsi sebelumnya | Rata-rata milestone per unit ternyata 15+, bukan 4–6 |
| 3 | Hasil UAT, field testing, atau observasi pengguna nyata yang menunjukkan masalah baru | Pengawas kesulitan menemukan milestone aktif di lapangan |
| 4 | Perubahan arsitektur aplikasi yang memengaruhi keputusan yang sudah dibuat | API `getUnitMilestones` diubah untuk mendukung filter server-side |
| 5 | Bug, usability issue, atau regresi yang dapat direproduksi secara konsisten | JournalCard tidak muncul setelah update RN version |

Jika tidak ada kondisi di atas yang terpenuhi, keputusan berstatus **Final Decision** tetap dianggap berlaku dan tidak boleh dibuka kembali.

### Yang Bukan Alasan Valid untuk Evaluasi Ulang

Keputusan **tidak boleh** dibuka kembali hanya karena:
- Preferensi visual individu
- Opini tanpa data pendukung
- Asumsi baru yang belum memiliki bukti
- Keinginan melakukan UI polish tambahan
- Perbandingan dengan referensi lain tanpa analisis konteks

Setiap evaluasi ulang harus membuka dokumen ini, menunjuk kondisi trigger yang terpenuhi, dan mencantumkan buktinya sebelum perubahan apapun dilakukan.

---

## Cara Menggunakan Dokumen Ini

Sebelum melakukan perubahan UI pada role Pengawas Lapangan:

1. Buka `docs/pengawas-ui-decisions.md`
2. Cari apakah topik sudah pernah dibahas (gunakan Ctrl+F / judul section)
3. Periksa klasifikasi item — jika **Final Decision**, cek kondisi evaluasi ulang
4. Periksa apakah ada **Decision Review Trigger** yang valid dan dapat dibuktikan
5. Jika ada bukti baru, tambahkan entry baru dengan format lengkap (Tanggal, Alasan, Bukti + Evidence Type, Klasifikasi, Kondisi evaluasi ulang)
6. Jika tidak ada trigger yang valid, jangan lakukan perubahan

---

## Tujuan Akhir Dokumen

Dokumen ini berfungsi sebagai:

1. **Catatan keputusan proyek** — apa yang diputuskan dan kapan
2. **Sumber kebenaran UI/UX Pengawas Lapangan** — referensi tunggal yang tidak ambigu
3. **Referensi audit berikutnya** — mencegah analisis ulang terhadap hal yang sudah diselesaikan
4. **Mekanisme governance** — mencegah perubahan berbasis opini atau preferensi
5. **Dasar pengambilan keputusan saat UAT dan produksi** — team tahu mana yang sudah validated dan mana yang belum

---

*Dokumen ini adalah sumber kebenaran untuk keputusan UI/UX role Pengawas Lapangan.*  
*Update dokumen ini setiap kali keputusan baru diambil, bukan hanya saat ada perubahan kode.*  
*Jangan menempatkan hipotesis pada bagian keputusan final.*  
*Setiap evaluasi ulang wajib menyebutkan Decision Review Trigger yang terpenuhi.*
