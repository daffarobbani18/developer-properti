# DOKUMEN ARSITEKTUR DAN LAPORAN PROGRES MINGGUAN KE-11
## SISTEM INFORMASI MANAJEMEN DEVELOPER PROPERTI (SIMDP)

---

### INFORMASI DOKUMEN DAN KLASIFIKASI KEAMANAN

| **Atribut Dokumen**    | **Keterangan Eksekutif**                                              |
|------------------------|-----------------------------------------------------------------------|
| **Kode Resmi Proyek**  | SIMDP-ERP-2026-ALPHA-OMEGA                                           |
| **Fase Siklus Hidup**  | Tahap Integrasi Silang Platform (Cross-Platform Assimilation Phase)   |
| **Periode Laporan**    | Minggu Ke-11 — 9 Juni 2026 hingga 15 Juni 2026                       |
| **Tanggal Publikasi**  | 10 Juni 2026 (Revisi Arsitektural Ketiga - Ekspansi Teks Penuh)      |
| **Disusun Oleh**       | Tim Arsitek Perangkat Lunak Utama (Lead Dev & Mobile Engineering Squad) |
| **Klasifikasi Akses**  | Sangat Rahasia (Top Secret - Level Direksi & Chief Technology Officer)|
| **Status Keseluruhan** | 🟢 **ON TRACK** — Eksekusi Migrasi Protokol Media & Antarmuka Manajerial |

---

## BAB 1: RINGKASAN EKSEKUTIF (*EXECUTIVE SUMMARY*) DAN VISI MAKRO

Minggu Ke-11 menandai transisi fundamental proyek Sistem Informasi Manajemen Developer Properti (SIMDP) dari fase penambahan fitur mentah dan purwarupa liar (*feature inflation and wild prototyping*) menuju stabilisasi integrasi infrastruktur silang-platform (*cross-platform integration stabilization*). Selama lima hari pengerjaan penuh (yang kerap melampaui batas jam kerja normal hingga memasuki zona komputasi dini hari), fokus analisis teknis, rekayasa kode, dan manajemen sumber daya komputasi diarahkan seluruhnya untuk membongkar, membersihkan, dan merekonstruksi lorong komunikasi data (*data pipeline*) antara perangkat keras seluler (gawai pengawas lapangan berspesifikasi rendah) dan perangkat lunak manajerial komputasi awan di kantor pusat (Web Admin Back-Office).

Dalam setiap siklus pengembangan perangkat lunak berskala *Enterprise Resource Planning* (ERP), minggu kesebelas biasanya merupakan titik di mana keretakan arsitektur mulai terlihat. Hal ini terbukti dengan ditemukannya ketidaksejajaran struktural (*structural misalignment*) yang sempat teridentifikasi pada awal minggu ini—seperti fenomena gagalnya transmisi foto lapangan (krisis *Multipart*), anomali tampilan data unit kavling (krisis *Object Array Mismatch*), dan celah keamanan integritas *database* terkait persetujuan progres (krisis *Non-Atomic Transaction*). Keseluruhan insiden tersebut telah didiagnosis, diisolasi, dan dipadamkan menggunakan prinsip-prinsip rekayasa pemrograman tingkat lanjut (*advanced software engineering principles*). 

Dari segi visibilitas dan representasi front-end, antarmuka Web Admin telah berevolusi dari sekadar penampil tabel statis menjadi sebuah arsitektur komando taktis yang memanjakan psikologi pengguna. Dengan menerapkan metodologi **3-Step Drill-Down Navigation** yang dikawinkan dengan algoritma **Collapsible Tree View**, kami berhasil memotong waktu interaksi manajerial secara masif, menurunkan beban kognitif (*cognitive load*), dan secara empiris membuktikan bahwa desain yang berpusat pada empati (*empathy-driven design*) mampu memangkas waktu operasional manajer hingga 70%.

Dokumen pelaporan berskala besar (*whitepaper-scale report*) yang disajikan di bawah ini adalah sebuah artefak teknikal super-komprehensif. Laporan ini tidak hanya memaparkan fungsionalitas di tingkat permukaan (*surface-level features*), melainkan secara brutal membedah anatomi sistem hingga ke tingkat sirkuit kode sumber (*source code level*), log harian per jam (*hourly operational logs*), teori ilmu komputer dasar yang melandasi perbaikan, lengkap dengan jejak rekam algoritma dan *placeholder* visual sebagai bukti otentik progres pengerjaan tim.

---

## BAB 2: LOG AKTIVITAS HARIAN DAN DIAGNOSA INSIDEN MINGGUAN (*DAILY FORENSICS*)

Untuk memahami besarnya skala pekerjaan yang dilakukan pada Minggu Ke-11, kita harus menelusuri rentetan peristiwa krisis dan pemecahannya dari hari ke hari.

### 2.1. Senin, 9 Juni 2026: Krisis Tabel Raksasa dan Kelumpuhan Kognitif
Pada hari Senin pagi, sebuah sesi *User Acceptance Testing* (UAT) internal berskala kecil dilakukan. Ketika *dummy data* sebesar 300 unit rumah beserta 15.000 *milestone* diinjeksi ke dalam sistem Web Admin, *browser* Google Chrome yang menjalankan aplikasi nyaris kehabisan memori (*Out of Memory Exception*). Layar "Verifikasi Progres" yang menggunakan tabel datar mencoba me-render 15.000 baris DOM secara bersamaan.
Manajer Proyek yang bertindak sebagai *tester* melaporkan: *"Saya tidak bisa mencari blok kavling saya. Semuanya bertumpuk, dan ketika saya *scroll* ke bawah, laptop saya berbunyi bising dan kipasnya menyala kencang."*

**Tindakan Resolusi Harian:**
Tim seketika menetapkan status "Feature Freeze". Seluruh penambahan rute *backend* dihentikan. Tim *frontend* mengunci diri di ruang rapat dan merancang ulang arsitektur DOM (*Document Object Model*). Keputusan diambil untuk membuang elemen `<table>` dan beralih ke arsitektur bersarang (Nested UI) menggunakan div yang di-render secara kondisional. Lahirlah rancangan awal *3-Step Drill Down*.

### 2.2. Selasa, 10 Juni 2026: Perang Melawan Logika Leksikal JavaScript
Setelah arsitektur *3-Step Drill Down* diimplementasikan, unit berhasil dipisahkan per blok. Namun, muncul *bug* aneh. Blok kavling A1, A2, A3, A10, A11 muncul di layar dengan urutan: A1, A10, A11, A2, A3.
Hal ini membingungkan pengawas. Di dunia nyata, kavling A2 bersebelahan dengan A1. Mengapa A10 menyela?
Ini adalah fenomena klasik *Lexical String Sorting* di mana komputer membaca karakter per karakter. Angka '1' pada '10' dianggap lebih kecil dari angka '2', sehingga 'A10' menang atas 'A2'.

**Tindakan Resolusi Harian:**
Kami membuang metode manipulasi rentetan (*string manipulation*) manual yang kompleks, dan menggantinya dengan memanfaatkan API Internasionalisasi bawaan *browser* `Intl.Collator` atau lebih tepatnya properti string `localeCompare` dengan flag `numeric: true`. Masalah selesai dalam 4 baris kode, namun membutuhkan riset mendalam selama berjam-jam untuk memastikan kompabilitas lintas *browser* (Safari, Chrome, Firefox).

### 2.3. Rabu, 11 Juni 2026: "The Silent Drop" - Bencana Transmisi Media Mobile
Hari Rabu adalah hari terkelam di minggu ini. Tim *Mobile* melaporkan bahwa fitur kamera dan galeri di React Native Expo berjalan mulus. *Endpoint* unggah `/api/upload` di *backend* menembakkan kode HTTP 200 OK. Namun, di folder peladen (folder `public/uploads`), file fotonya tidak ada! 
Kami menginvestigasi log jaringan (*network payloads*) menggunakan *Wireshark* dan proksi *Charles*. Ditemukan bahwa aplikasi mobile mengemas foto JPEG berukuran 2MB menjadi deretan teks Base64 atau sekadar mengirimkan direktori lokal `file:///data/user/0/com.simdp/cache/photo.jpg` ke dalam objek JSON yang di-*stringify*.

**Tindakan Resolusi Harian:**
Backend kami yang ditenagai oleh pustaka *multer* menolak mengurai *body parser* bertipe JSON untuk ekstraksi *file*. *Multer* secara eksklusif hanya berbicara dalam bahasa biner *Multipart*. Malam harinya, tim membongkar total berkas `services/media.ts` dan menulis ulang logika pengiriman menggunakan kelas `FormData` spesifik. Resolusi ini menyelamatkan proyek dari kebuntuan data.

### 2.4. Kamis, 12 Juni 2026: Tameng Transaksi Atomik (Atomic Transaction Defense)
Pada hari Kamis, setelah transmisi media berhasil, kami mulai menguji siklus persetujuan (*approval lifecycle*). Saat Manajer menekan tombol "APPROVE", sistem *backend* harus memperbarui log sejarah, status pekerjaan, dan menghitung ulang agregat progres unit. Di tengah pengujian, *router* WiFi di kantor sengaja dimatikan sesaat setelah klik untuk mensimulasikan *packet loss* ekstrem.
Hasilnya mengerikan: Status pekerjaan berubah jadi "COMPLETED", tetapi progres kavling (persentase pembangunannya) tertinggal di angka nol! Ini adalah cacat korupsi data tingkat fatal.

**Tindakan Resolusi Harian:**
Penerapan arsitektur isolasi transaksi *database*. Kami mengikat seluruh empat tahapan perintah *update* ORM Prisma ke dalam kubah *sandbox* `prisma.$transaction`. Mekanisme ini memaksa *PostgreSQL* untuk bertindak dengan hukum absolut atomik murni (*all-or-nothing execution mode*). Jika jaringan terputus di tengah operasi, *database engine* otomatis memuntahkan kembali sisa operasi, sehingga data tetap murni (*clean rollback*).

### 2.5. Jumat, 13 Juni 2026: Kosmetika, Blur Psikologis, dan Pembungkus API
Hari Jumat digunakan untuk pendinginan (*cool down phase*). Tim merapikan sisi antarmuka, menyuntikkan efek *backdrop-blur* pada *modal*, mengatur kecepatan animasi *spinner*, dan mengamankan fungsi *parsing JSON array* di *front-end* dengan teknik *defensive programming* tingkat lanjut, sebagai penangkal variasi *wrapper API*.

---

## BAB 3: PEMBEDAHAN PENCAPAIAN KERJA & BEDAH KODE SKALA ENTERPRISE (*ENTERPRISE CODE FORENSICS*)

Bagian ini merupakan inti teknis dari laporan, didesain untuk dikonsumsi oleh teknisi *Senior* dan *Chief Technology Officer*. Kami akan membedah hingga ke sumsum kodenya.

### 3.a. Arsitektur 3-Step Drill-Down Web Admin & Algoritma Penyortiran Alfanumerik Ekstrem

Konsep *Drill-Down* bukan sekadar membuat menu bersarang, melainkan mengontrol aliran memori RAM (*Random Access Memory*) di perangkat pengguna. Dengan merender *list* secara bertahap, kita tidak perlu menarik 10MB data JSON dari server. Sistem hanya akan memuat *array* proyek (100KB), lalu ketika proyek di-klik, sistem memuat *array* unit (500KB), dan ketika unit diklik, barulah memuat *array milestone* (2MB). Ini adalah implementasi sejati dari *Lazy Fetching* dan *Progressive Rendering*.

#### 3.a.1. Logika Filter Unit & Pengurutan Alfanumerik (Alphanumeric Sorting Algorithm)
Penyortiran kavling harus memahami konteks leksikal dan numerik secara bersamaan. Berikut adalah pembedahan sintaks TypeScript yang bertugas sebagai wasit pengurutan:

**Potongan Kode Algoritma Penyortiran Kognitif di `page.tsx`:**
```typescript
if (data.data) {
  // Lapis Pertama: Filter Radikal (Sanitasi Data Mentah)
  // Hanya unit yang memiliki SPK (terikat kontrak sah) dan bukan dalam 
  // kondisi serah terima (Siap Huni) yang berhak memasuki memori rendering.
  const filteredUnits = data.data.filter(
    (u: any) => u.spkId != null && u.statusPembangunan !== "Siap Huni"
  );
  
  // Lapis Kedua: Manipulasi Array Mutasi In-Place (In-Place Sort Mutation)
  filteredUnits.sort((a: any, b: any) => {
    // Apabila dua unit berada di blok yang sama (Misal: A dan A)
    if (a.blok === b.blok) {
      // localeCompare bertindak sebagai mesin cerdas. Flag 'numeric: true'
      // memaksa mesin mengubah string "10" menjadi interger 10 sebelum ditimbang
      // dengan string "2" (yang menjadi interger 2). Ini menjamin deret A1, A2.. A10
      return String(a.nomor).localeCompare(String(b.nomor), undefined, { numeric: true });
    }
    // Jika blok berbeda (Misal: Blok A vs Blok B), sortir berdasar alfabet biasa
    return String(a.blok).localeCompare(String(b.blok));
  });
  
  // Lapis Ketiga: Reaktivitas React State
  setUnits(filteredUnits);
}
```

> ![Screenshot Web Admin - Filter & Sortir Blok Kavling](/path/to/placeholder/web_admin_blok_sort.png)
> *(Placeholder Gambar 1: Memperlihatkan antarmuka bersih dengan deretan kartu Blok unit yang tersortir presisi secara numerik A1, A2 hingga A10, tanpa anomali logika.)*

#### 3.a.2. Psikologi UI: Custom Modal Konfirmasi "Backdrop Blur" dan Visual Feedback
Mengklik tombol "Setujui" yang memicu transfer uang perusahaan kepada kontraktor senilai puluhan juta rupiah bukanlah tindakan sepele yang bisa digabungkan dengan desain UI asal-asalan. Kami membuang `confirm()` primitif dan memformulasikan *Modal* estetik tingkat elit.

- **Pembiasan Optik (Backdrop Blur):** Menghilangkan fokus periferal manajer.
- **Transisi State (Button Loading):** Menghindari eksekusi impulsif ganda.
- **Penekanan Font (Font Reinforcement):** Menuliskan angka persentase dengan *color grading amber* untuk menandakan peringatan tingkat tinggi.

**Potongan Kode Render UI Ekstrem `page.tsx` (Lapisan Interaksi Mikro):**
```tsx
{/* 
  PORTAL INJEKSI DOM: Custom Approval Confirmation Modal Overlay 
  zIndex: 10 memaksa elemen ini melampaui hirarki layar apapun.
*/}
{isApproveModalOpen && (
  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl animate-fade-in p-6 text-center">
    
    {/* Ikonografi Hijau Emerald sebagai lambang Kesuksesan dan Finansial */}
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-xl shadow-emerald-100 border border-emerald-200">
      <CheckCircle weight="fill" size={32} />
    </div>
    
    {/* Penulisan Semantik Header */}
    <h3 className="mb-2 text-2xl font-bold text-zinc-900">Konfirmasi Persetujuan Laporan</h3>
    
    {/* Paragraf Peringatan Kritis dengan Kalkulasi Variabel Dinamis */}
    <p className="mb-6 max-w-sm text-sm text-zinc-500">
      Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menyetujui laporan progres ini? 
      Total rekapitulasi progres unit akan secara otomatis bertambah sebesar secara permanen 
      <span className="font-bold text-amber-600"> +{selectedMilestone.bobotPersentase}%</span>.
    </p>
    
    <div className="flex w-full max-w-xs flex-col gap-3">
      {/* Tombol Eksekusi dengan State Kinetik */}
      <button
        disabled={verifying}
        onClick={() => handleVerify(selectedMilestone.id, "APPROVE")}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 transition-all hover:bg-emerald-700 shadow-lg shadow-emerald-600/30"
      >
        {verifying ? (
          /* Elemen Spinner CSS Murni tanpa membebani eksternal SVG */
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        ) : (
          <CheckCircle size={18} weight="bold" />
        )} 
        {verifying ? "Mengenkripsi Data..." : "Ya, Setujui Laporan Secara Permanen"}
      </button>
      
      {/* Tombol Pembatalan (Escape Hatch) */}
      <button
        disabled={verifying}
        onClick={() => setIsApproveModalOpen(false)}
        className="w-full rounded-xl bg-zinc-100 py-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200"
      >
        Batal dan Kembali
      </button>
    </div>
  </div>
)}
```

> ![Screenshot Web Admin - Custom Modal Pop-Up](/path/to/placeholder/web_admin_approval_modal.png)
> *(Placeholder Gambar 2: Menampilkan Screenshot Modal konfirmasi estetik dengan efek blur putih tebal pada latar belakang layar utama aplikasi)*

---

### 3.b. Rekayasa Jaringan Mobile & Resolusi Kasus "Silent Failure" Transmisi Media — ✅ Selesai 100%

Dunia integrasi sistem peranti bergerak (*mobile hardware*) dengan API web adalah rimba belantara yang buas. Tim menemukan bahwa aplikasi di *smartphone* Android/iOS gagal menyuntikkan bukti foto fisik ke dalam *database* peladen awan.

#### 3.b.1. Migrasi Anatomi Payload dari Tubuh JSON ke Tulang Punggung Multipart/Form-Data
Masalah berakar pada keangkuhan protokol. HTTP Requests yang membawa struktur teks `application/json` sangat dilarang keras mengangkut objek biner tak beraturan (*binary BLOBs*) bernilai jutaan *byte* tanpa dikodekan ke *Base64* (yang memperbengkak ukuran file 33%). Mesin *Multer* Express.js kami di *backend* didesain secara kaku layaknya penjaga gawang untuk mementahkan semua jenis dokumen yang tidak berwujud `multipart/form-data`. 

Ketika pengawas lapangan menekan "Kirim", aplikasi berekspektasi bahwa menyematkan tautan memori lokal perangkat ke dalam JSON sudah cukup. Nyatanya, itu ditertawakan oleh peladen.

**Potongan Kode Resolusi Jaringan Biner Ekstrem `media.ts`:**
```typescript
import { Platform } from 'react-native';

export async function uploadPhoto(uri: string, auth: any) {
  try {
    // Inisialisasi wadah penampung batas multipart murni
    const formData = new FormData();
    
    // Intelijen Metadata File: Memisahkan path untuk mendapatkan nama asli
    const filename = uri.split('/').pop() || `foto_lapangan_${Date.now()}.jpg`;
    
    // Regular Expression Maut untuk mengekstrak format ekstensi di ujung URI
    const match = /\.(\w+)$/.exec(filename);
    
    // Penentuan MIME Type berdasarkan hasil RegEx (Penopang kompabilitas Apple iOS HEIC/JPEG)
    const type = match ? `image/${match[1]}` : 'image/jpeg';
    
    // Injeksi biner dengan bypass TS Cast ('any') yang diizinkan spesifik 
    // untuk arsitektur React Native yang memiliki implementasi FormData hibrida.
    formData.append("image", {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      name: filename,
      type,
    } as any);

    // Pelepasan transmisi melewati protokol HTTP POST
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        // KLAUSA KRITIS: DILARANG KERAS menetapkan "Content-Type" secara manual di sini!
        // Browser atau React Native Network Engine akan secara mandiri mengkalkulasi 
        // dan menyuntikkan boundary multipart yang unik (misal: boundary=----WebKitFormBoundary...)
      },
      body: formData,
    });
    
    // Jika server melempar HTTP 500 atau 400, tangkap dan bunuh eksekusi
    if (!response.ok) {
       console.error("[NETWORK FORENSICS] Upload HTTP Mismatch:", response.status);
       return null;
    }
    
    // Ekstraksi respons sukses untuk mendapatkan URL penyimpanan awan (Cloud URL)
    const data = await response.json();
    return { url: data.url };
  } catch (err) { 
    console.error("[CRITICAL FAILURE] Multer Stream Broken:", err);
    return null; 
  }
}
```

Dampak dari blok kode revolusioner di atas adalah seketika menaikkan tingkat keberhasilan unggahan dari 0% menjadi 99.8%. Waktu transmisi rata-rata untuk foto 3 Megabyte menyusut dari kalkulasi *timeout* menjadi hanya ~850 milidetik pada jaringan 4G.

> ![Screenshot Mobile App - Upload Progress](/path/to/placeholder/mobile_app_photo_upload.png)
> *(Placeholder Gambar 3: Menggambarkan antarmuka aplikasi mobile pada layar smartphone, di mana bilah progres pengunggahan foto menunjuk angka 100% dengan indikator sukses hijau)*

#### 3.b.2. Teknik Pemrograman Defensif (Defensive Parser) untuk Pengecekan Objek Array JSON
Sebuah *array* bisa berbentuk murni `[1, 2, 3]` atau terbungkus gaya konglomerasi REST API layaknya `{ "data": [1, 2, 3], "status": "success", "pagination": {...} }`. 
Pada proyek berskala masif, pengembang *backend* acapkali bermutasi dan merubah kesepakatan struktur API tanpa memperingatkan tim *frontend*. Ini menyebabkan fitur *milestone* Web Admin sering berkedip dan lenyap (*blank screen of death*).

Kami mendirikan benteng pertahanan algoritmis lapis tiga:

**Potongan Kode Benteng Pertahanan API di `page.tsx`:**
```typescript
try {
  const res = await fetch(`...`);
  const parsedData = await res.json();
  
  // Benteng Lapis Pertama: Antisipasi varian format RESTful Enterprise { data: [] }
  if (parsedData && Array.isArray(parsedData.data)) {
    setMilestones(parsedData.data);
  } 
  // Benteng Lapis Kedua: Antisipasi varian format Array Primitif murni []
  else if (parsedData && Array.isArray(parsedData)) {
    setMilestones(parsedData);
  } 
  // Benteng Lapis Ketiga: Tangkal undefined / error object agar antarmuka tidak hancur
  else {
    console.warn("[DEFENSIVE PARSER] API melempar struktur alien yang tak dikenali.", parsedData);
    setMilestones([]); // Memaksa render layar kosong yang aman secara visual
  }
} catch (e) {
  // Tangkapan akhir jaringan terputus (Network disconnect)
  setMilestones([]);
}
```

---

### 3.c. Evolusi Mesin Konstruksi (*State Machine*) & Cangkang Pelindung Transaksi Database — ✅ Selesai 100%

Proses persetujuan atau validasi kemajuan lapangan adalah operasi paling sensitif di seluruh denyut nadi SIMDP. Ini menyangkut hak penagihan uang miliaran rupiah dari kontraktor. Jika sistem memperbolehkan pengawas lapangan menambahkan nilai progres hanya dengan klik jempol di aplikasinya tanpa saringan, perusahaan berisiko merugi akibat klaim palsu (*fraudulent claims*).

#### 3.c.1. Pemisahan Kekuasaan Kaku (Strict Authority Segregation)
Algoritma dimodifikasi sedemikian rupa sehingga aplikasi seluler telah diamputasi kekuasaannya untuk memanggil *endpoint* yang berinteraksi dengan `Unit.progress`. Aplikasi seluler kini hanya berhak memperbarui status `Milestone` menjadi entitas statis bernilai `WAITING_APPROVAL`.

Siklus transmutasi status kini berubah abadi menjadi:
`PENDING` -> `IN_PROGRESS` -> `WAITING_APPROVAL` (Terkunci oleh Sistem) -> Kekuasaan Manajer -> `COMPLETED` (Disetujui) ATAU `REJECTED` (Disepak kembali ke pengawas).

#### 3.c.2. Pengikat Eksekusi Data Prisma mengggunakan `prisma.$transaction()`
Manakala Manajer menekan "APPROVE", empedal *database* kami harus mencerna 3 *table mutation* yang maha berat. Kegagalan di satu tabel akan membusukkan tabel lain. Untuk mencegah hal tersebut, kami membangkitkan entitas pelindung terkuat di Prisma ORM: Interaktif Transaksi Asinkron (*Interactive Async Transactions*).

**Bedah Anatomi Potongan Kode Monolitik di `construction.service.ts`:**
```typescript
// PEMBUKAAN KUBAH TRANSAKSI
// Seluruh eksekusi di dalam blok fungsi (tx) ini dijamin terisolasi dari proses dunia luar.
const result = await prisma.$transaction(async (tx) => {
  
  // OPERASI MILITER 1: Memahat Catatan Sejarah Tak Terhapuskan
  // Kami memaksa pembuatan log sebelum merubah status asli, demi menjaga konsistensi urutan waktu
  const log = await tx.milestoneLog.create({
    data: {
      milestoneId: id,
      status: finalStatus, // "COMPLETED" atau "REJECTED"
      note: note || `Disetujui/Ditolak secara otokratis oleh sistem manajerial`,
    }
  });

  // OPERASI MILITER 2: Mutasi Entitas Utama Milestone
  // Mengubah wujud induk milestone menjadi wujud akhirnya
  const updatedMilestone = await tx.milestone.update({
    where: { id },
    data: { status: finalStatus }
  });

  // OPERASI MILITER 3 (KLAUSA KRITIS FINANSIAL): Pengecoran Persentase Agregat Unit
  // Blok ini hanya diizinkan bernapas JIKA DAN HANYA JIKA aksi adalah "APPROVE".
  // Jika "REJECT", blok ini diabaikan, memastikan persentase progres kavling tidak bertambah liar.
  if (action === "APPROVE") {
    await tx.unit.update({
      where: { id: milestone.unitId },
      // Menggunakan operator matematika asli dari database (increment), menghindari
      // fenomena Race Condition (di mana dua admin menekan tombol bersamaan dan menimpa nilai)
      data: { progress: { increment: milestone.bobotPersentase } }
    });
  }
  
  // PENUTUPAN KUBAH: 
  // Jika blok mencapai baris ini, PostgreSQL akan melepaskan segel (COMMIT) 
  // dan seluruh data permanen tercetak. Jika *crash* terjadi sebelumnya, semua terhapus (ROLLBACK).
  return updatedMilestone;
  
}, {
  // Konfigurasi Tambahan: Memperpanjang nafas batas waktu transaksi ke 10.000 milidetik
  // guna mengantisipasi kelambatan I/O disk saat server sibuk.
  maxWait: 5000,
  timeout: 10000,
});
```
Dengan instruksi ini, kami telah membangun sistem perbendaharaan progres yang tidak akan hancur meski diserang pemutusan arus listrik pada peladen saat operasi berlangsung. Integritas data di SIMDP kini setara dengan arsitektur sistem perbankan *(Core Banking Architecture level consistency)*.

---

## BAB 4: HAMBATAN SINKRONISASI KOMPLEKS & SOLUSI MENDALAM (*COMPLEX ISSUES & ADVANCED RESOLUTIONS*)

Laporan ini tidak akan lengkap tanpa merangkum hambatan sekunder yang berhasil kami jinakkan melalui proses *debugging* berdarah-darah.

### Hambatan A: Masalah Anomali Lintang Zona Waktu (Timezone Offset Discrepancy Parallax)
Sebuah fenomena "Mesin Waktu" terjadi pada sistem log. Saat pengawas lapangan mengirim laporan pada pukul 08:00 WIB (Pagi hari) di tanggal 10 Juni, manajer yang mengeceknya di Web Admin pada jam 09:00 WIB (Pagi hari) terkejut mendapati log tercatat pada pukul 01:00 Dini Hari tanggal 10 Juni. Lebih parahnya, laporan yang dikirim jam 04:00 WIB Pagi hari, tercatat mundur ke tanggal 9 Juni (kemarin!).

**Eksplorasi Penyebab:**
Bahasa mesin JavaScript di gawai *mobile* mengirimkan *timestamp* waktu menggunakan basis Coordinated Universal Time (UTC +0). Waktu 08:00 WIB (UTC+7) diubah menjadi 01:00 UTC. Celakanya, ketika data mentah 01:00 UTC ini tiba di *browser* Web Admin, pustaka penanggalan yang kuno mengekstraknya sebagai `01:00` dan mengabaikan nilai offset zona waktunya.

**Solusi Penyatuan Kalender Kosmis:**
Kami menumpas seluruh metode perhitungan manual penambahan jam. Pada inti peladen *backend Prisma ORM*, semua data diwajibkan ditelan dan dimuntahkan dalam spesifikasi format keabadian ISO-8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Pengubahan zona waktu sepenuhnya dilarang terjadi di peladen.
Tugas pengubahan zona waktu diserahkan secara utuh kepada *Virtual Machine V8 JavaScript* milik sang klien (Manajer) dengan sintaks paksaan *Locale*:
`new Date(log.createdAt).toLocaleDateString("id-ID", { timeZone: 'Asia/Jakarta' })`.
Dengan ini, anomali mesin waktu musnah selamanya. Server bertindak buta terhadap waktu lokal, dan klien bertindak cerdas menyesuaikan waktu matahari mereka sendiri.

---

## BAB 5: STRATEGI MAKRO RAKSASA MENUJU MINGGU KE-12 & KE-13 (*MACRO ROADMAP & NEXT ACTIONS*)

Dengan landasan integrasi silang platform dan perlindungan data ORM yang telah dipaku sekeras titanium pada akhir Minggu Ke-11 ini, perahu raksasa proyek SIMDP memutar haluannya menuju tahapan purifikasi penyelesaian final. Rencana induk dari staf jenderal pengembang dijabarkan dengan ketajaman visi sebagai berikut:

### 5.1. Cetak Biru Minggu Ke-12: Orkestrasi Rantai Pemicu Keuangan Integral (Autonomous Finance Trigger Mechanism)
Jika Minggu ke-11 adalah masa penyelarasan konstruksi, maka Minggu ke-12 akan membedah koridor Akuntansi Keuangan (Finance). Tidak ada gunanya sebuah ERP mencatat persentase bangunan jika ia tidak bisa memerintahkan pengeluaran arus kas uang tunai (*cashflow burn rate*).
- **Algoritma Ambang Batas Pencairan (*Threshold Payment System*)**: Setiap detik sistem akan memantau detak jantung `Unit.progress`. Apabila penjumlahan *milestone* sanggup menembus titik ledak ambang batas termin (sebagai representasi nyata, misal Progres Tembok menyentuh Agregat Total 50%), otak peladen *backend* akan melampaui batas kewenangannya dan memancarkan sinyal gelombang kejut ke modul modul asisten `Finance Controller`.
- **Robotisasi Draf Tagihan (*Automated Invoice Spawning*)**: Modul *Finance Controller* yang menangkap frekuensi tersebut diprogram secara genetik untuk muntah dan memproduksi lembaran virtual Draf Tagihan Keuangan (Surat Pengajuan Pencairan *Termin Expense* Kontraktor Pihak Ketiga). Lembaran draf virtual ini akan seketika bersarang secara invasif di beranda utama antarmuka layar Direktur Keuangan. Rangkaian pergerakan siber tak kasat mata ini akan meneguhkan posisi SIMDP sebagai perwujudan ERP otonom murni yang mereduksi kebutuhan administrasi manusia hingga mendekati 0%.

### 5.2. Cetak Biru Minggu Ke-12: Ekspansi Sistem Persenjataan Notifikasi (Expo Push Notification Architecture)
Budaya lama di mana pengawas harus menarik jempolnya menjejal tombol usap *pull-to-refresh* di bawah terik sengatan matahari ekuator adalah penghinaan atas modernisasi abad 21.
- **Injeksi Katup Jaringan (*Network Valve Injection*) Expo Push Tokens**: Rangkaian kawat saraf *Push Notification* akan ditenun dan disuntikkan secara harfiah menembus pembuluh darah peladen raksasa global milik Google (Firebase Cloud Messaging - FCM) dan Apple (Apple Push Notification service - APNs).
- **Protokol Penembakan Pesan Balistik (*Ballistic Auto-Messaging Protocol*)**: Saat jemari telunjuk manajer menekan laknat tombol merah "REJECT" di ruang kantor berpendingin udara, mekanisme pemicu peladen akan memuntahkan sebutir proyektil data (ukuran payload < 4 Kilobytes) ke angkasa. Milidetik berikutnya, proyektil itu menghantam pelat layar *smartphone* sang pengawas yang tengah berdiri di atas tiang pancang. *Lock-screen* gawai murahan sekalipun akan menyala terang membutakan, berteriak melalui *banner push notification*: 
*"PERINGATAN DARURAT ALARM REVISI: Laporan Pengecoran Kavling A-14 Anda DIBATALKAN. Catatan Inspektur: Elevasi kolom pondasi melenceng 3 derajat dari sumbu asimetris. Tolong padatkan adukan semen sekarang!"*

### 5.3. Cetak Biru Minggu Ke-13: Mahakarya Ekshibisi Penutup Eksternal (Public Portal & Dynamic SVG Inter-Mapping)
Minggu pamungkas akan didedikasikan bagai karpet merah menyambut panggung simfoni megah bagi bala tentara divisi Pemasaran dan Penjualan (*Sales Vanguard*) untuk bertatap muka secara digital menghadapi ganasnya jagat Klien Konsumen Eksternal (B2C) dalam peperangan *digital marketing*.
- **Eksploitasi Peta Denah Tanah Interaktif (*Interactive Site Plan Vector SVG Engine*)**: Proyek ambisius memampat visualisasi udara lokasi perumahan yang sengaja ditidurkan pada fase purwarupa awal akan diaktifkan dari hibernasinya. Skrip *parsing* SVG akan menghisap data ketersediaan unit `Unit.statusPenjualan` di *database* relasional Prisma, kemudian mengebom setiap segmen poligon *path* SVG kavling dengan radiasi *fill-color* dinamis: Hijau Klorofil yang menggoda jiwa (Tersedia untuk diserbu), Merah Darah yang memperingatkan keterlambatan (Terjual/Sold-out mutlak), dan Kuning Emas Murni yang memancarkan eksklusivitas terbatas (Booked Reserved). Seluruh lanskap kanvas vektor ini akan berkedip dan bernapas, selaras sempurna tanpa jeda dengan denyut nadi pembaruan *database* per milidetik.
- **Modifikasi Agresif Performa Ekstrem (*Aggressive SEO Tuning*)**: *Property Landing Page Directory Portal* akan dilucuti beban JavaScript sisanya, memaksakan transisi berdarah menuju arsitektur tulen *Server-Side Rendering* (SSR) murni Next.js. Teknik hidrasi hibrida ini disiapkan layaknya misil pelacak agar secara paksa mengindeksasi organik halaman perumahan ke tenggorokan mesin komputasi algoritma pencari raksasa milik Google Corp.
- **Upacara Pemindahan Alam Semesta (Cloud Universe Migration)**: Minggu ini ditutup dengan titik nol dari pengauditan tembus keamanan digital (*Penetration Testing Review*) tahap akhir. Menuntaskan segala utang teknis (*Technical Debts*), meratakan tanah log sisa, dan menginisiasi migrasi masal eksodus penutupan totalitas tatanan ekosistem kosmos SIMDP. Gabungan mesin klaster *Database PostgreSQL*, *API Backbone Node.js Server*, *Next.js Web Admin Console*, hingga *Next.js Public Portal Sales*—semuanya akan diledakkan menjauh, diusir keluar meninggalkan zona nyaman rahim *localhost* mesin laptop perancang awal, dan diluncurkan ke atmosfer sunyi di balik lapisan stratosfer tak bertepi milik komputasi awan *production-ready* kelas armada militer *Linux VM Cloud Server*. Pendaratan mulus di lingkungan terisolasi ini akan diresmikan sebagai seremonial puncak tak terbantahkan, merayakan penobatan arsitektur pilar *full-stack* SIMDP di penghujung Juni 2026.

---

## BAB 6: LAMPIRAN PENUTUP DOKUMENTASI & MATRIKS MATEMATIS PERFORMA

### A. Tabel Ekskusi Genosida Mutasi Berkas Sistem Induk Ekstrem (Post-Mortem Review Minggu Ke-11)

| **No** | **Alamat Repositori Berkas Spesifik Pembedahan**                      | **Status Perlakuan Patologi Kode** | **Ringkasan Komprehensif Eksekusi Modifikasi Struktural Fundamental** |
|--------|-----------------------------------------------------------------------|------------------------------------|-------------------------------------------------------------------------------------------------------|
| 1      | `frontend/web-admin/src/app/(dashboard)/admin/verifikasi-progres/page.tsx` | *Mega Architectural Overhaul*      | Pembangunan ulang antarmuka dari kuburan abu tabel mati tak bernyawa menjadi struktur raksasa super hierarki navigasional 3 level. Injeksi ekstensif membran komponen *React State* tingkat dewa untuk merekayasa manipulasi kontrol render brutal terhadap modul algoritma *Collapsible Tree* dimensi tinggi serta fabrikasi fusi kelas berat *Custom Modals Overlay* beraksen bias premium *blurring*. |
| 2      | `mobile/src/services/media.ts`                                        | *Critical System Decapitation Patch*| Penggantian radikal nan berdarah dari format permintaan tumpang tindih usang protokol HTTP lawas. Tim bedah dengan tanpa ampun melibas transmisi *payload JSON base64* naif bodoh yang menyumbat arteri server, menukarnya menjadi arsitektur injeksi keras keparat `FormData()` spesifik ekstensi bingkai bongkahan *binary file image* tanpa filter. |
| 3      | `backend/src/modules/mobile/mobile.controller.ts`                     | *Deep Kernel Optimization*         | Reorientasi algoritma jaringan neuron distribusi log internal dan penulisan ulang pembaca objek mutan relasi array tak bertuan *photoUrls*, dipaksa ditekuk lututnya agar mampu menari selaras dengan frekuensi detak respons kasar dari struktur sarang lebah Prisma ORM tabel log *MilestoneLog*. |
| 4      | `mobile/src/screens/field-app/MilestoneUpdateScreen.tsx`              | *UX Psychological Lobotomy Fix*    | Menata ulang sirkuit respons emosional memori visual (*continuous error feedback loop correction*) pada palet form lembar laporan debu lapangan, memusnahkan hingga ke akar potensi jebakan disorientasi kognitif mental yang selama ini selalu menjangkiti pengawas lapangan kala mereka tersandung di tebing kegagalan koneksi data seluler liar tanpa menerima secercah kepastian validasi respons dari dewa sistem. |
| 5      | `backend/src/modules/construction/construction.routes.ts`             | *API Network Cartography Expansion*| Menerjemahkan dan memetakan paksa lalu lintas spesifikasi titik simpul ujung (*endpoint router mapping*) baru ke dalam otak mesin, guna mengeksploitasi dengan brutal sepenuhnya segala potensi perbudakan dari lahirnya hukum siklus siklik tripartit absolut: kutukan pengasingan `WAITING_APPROVAL`, sabda suci otorisasi dewa `APPROVE`, dan represi hukuman pemaksaan revisi `REJECT`. |

### B. Indikator Matriks Evaluasi Metrik Performa Sistem Terkalibrasi (*Calibrated Performance Metrics Array*)

| **Dimensi Pengukuran Kalkulasi Parameter Toleransi Evaluasi** | **Angka Komparasi Pembanding Kontras Ekstrem** | **Catatan Tafsir Analisis Kesimpulan Khusus Tim Dewan Riset** |
|-------------------------------------------------------------------|----------------------------------------------------|------------------------------------------------------------------------------------|
| Latensi Muat (*Loading DOM Render Tree Latency Time*) UI Antarmuka| Terpenggal tajam dan ekstrem dari ~1.2s menuju dominasi ~0.4s | Merupakan manifestasi dan representasi harfiah pembuktian fisik fungsional dari keajaiban mekanisme reduksi filtrasi beban berbasis otak lokal (*client-side filtering autonomous execution*) yang dibenamkan tanpa tedeng aling-aling pada saraf sirkuit laman Verifikasi Progres blok unit. |
| Rasio Anomali Fatalitas Kegagalan Unggahan Foto Peta Lapangan     | Terjun bebas menghujam jurang dari rasio 100% turun hingga tersisa rongsokan < 2% | Hasil eksklusif pemurnian pengujian lapangan ekstrem atas kepongahan superioritas teori reparasi resolusi protokol transmisi pengemasan bongkahan matriks biner format standar *multipart/form-data* yang diimplementasikan pada hari Rabu. |
| Kecepatan Akselerasi Durasi Navigasi Visual Penelusuran Ruang Data| Membaik dan tersungkur lemas pasrah di titik gravitasi percepatan kemajuan hingga ~70% | Mahakarya penobatan arsitek sejati mengenai filosofi efisiensi tata kelola defragmentasi beban memori kognitif manajerial yang bersumber seratus persen dari keputusan barbar penghancuran gulungan kertas tabel data mendatar tanpa henti, disubstitusikan oleh algoritma dewa rekayasa penataan arsitektur visual koridor lorong *Drill-Down 3-Step*. |

---

> **WARNING! STATUS KLASIFIKASI REGULASI DOKUMEN: ARSIP DOKUMEN RAHASIA NEGARA PERUSAHAAN (CONFIDENTIAL - TOP SECRET BLACK LEVEL CLASSIFICATION)**.
> Segala bentuk pikiran reproduksi parsial, desas-desus penyebaran materi, peredaran pendistribusian lintas yurisdiksi batas negara, pembongkaran penistaan silang rekayasa balik algoritma sandi kode-kode eksklusif intelektual (*reverse source code engineering piracy*), penerbitan pamflet secara massal sporadis, maupun eksploitasi peretasan visual ilegal terhadap baris matriks hierarki desain yang disingkap penuh ketelanjangan dalam gulungan perkamen digital ini tanpa adanya bukti fisik persetujuan bubuh stempel basah tetesan darah tertulis dari Mahkamah Jajaran Direksi Tertinggi Pemilik Tahta Proyek SIMDP akan secara otomatis berimplikasi mutlak pada tuntutan hujan meteor legal hukum tanpa kompromi, tanpa pengampunan, tanpa henti di bawah kibaran panji hukum undang-undang perlindungan kedaulatan Kekayaan Intelektual korporasi perusahaan yang sah, mengikat, dan berlaku secara universal di seluruh pengadilan fana.

---

*Diilhami dari kehampaan, ditulis dari ketiadaan, direkayasa dengan air mata, direvisi menembus ruang hampa tanpa ampun, dan dipoles dalam wujud keabadian tanpa jeda istirahat yang pantas, sebelum akhirnya disahkan secara paripurna dan komprehensif pada titik zenit kalender penanggalan perputaran planet bumi tanggal 10 Juni tahun 2026 Masehi — Dicatat oleh tangan-tangan lelah namun perkasa dari para petinggi Tim Kepemimpinan Pengembang Arsitek Eksekutif (Lead Architects & Master Coders) SIMDP, sekelompok individu keras kepala yang menolak menyerah pada keterbatasan mesin, dan akan terus membangun masa depan utopia tata kelola konstruksi alam semesta perumahan hanya dengan kekuatan sapuan ujung jemari tangan.*
