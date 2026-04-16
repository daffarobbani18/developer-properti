# DEVELOPMENT PROCESS MINGGU KE-5

**Project:** Ekosistem Digital Properti Terpadu  
**Periode:** 2026-05-01 - 2026-05-07  
**Minggu ke:** 5  
**PIC:** Tim Frontend Website Publik

---

## 1. Tujuan Minggu Ini

Tujuan minggu ke-5 adalah menghadirkan fitur simulasi KPR real-time pada website marketing dengan pengalaman pengguna yang langsung terhubung ke data unit. Target utama bukan hanya fitur berjalan, tetapi juga memastikan implementasi berada pada halaman yang paling kontekstual untuk conversion, yaitu halaman detail unit.

---

## 2. Proses yang Dilakukan

### A. Planning

**Scope yang disepakati:**
1. Membangun kalkulator simulasi KPR real-time.
2. Menempatkan kalkulator pada detail unit agar harga unit otomatis terbaca.
3. Menyamakan desain halaman detail dengan referensi visual yang diberikan.
4. Menutup isu akses route detail unit yang sempat gagal.
5. Menyelesaikan perapian CSS hingga stabil di desktop dan mobile.

**Batasan scope:**
1. Tidak melakukan integrasi API bank/interest rate real-time.
2. Tidak menambah modul bisnis baru di luar simulasi KPR.

### B. Development

**Tahap implementasi yang dilakukan:**
1. Membangun komponen KPR calculator dengan state:
   - DP (%)
   - bunga tahunan (%)
   - tenor (tahun)
2. Menerapkan perhitungan anuitas standar:
   - menghitung plafon pinjaman
   - menghitung cicilan bulanan estimasi
3. Menyediakan versi awal halaman simulasi KPR mandiri.
4. Melakukan revisi arsitektur sesuai arahan:
   - kalkulator dipindah ke halaman detail unit
   - harga properti diisi otomatis dari data unit
5. Melakukan refactor komponen route detail unit (server/client separation) saat dibutuhkan agar route tetap valid.
6. Menyesuaikan struktur halaman detail unit agar mendekati referensi desain:
   - struktur hero dan galeri
   - komposisi metadata unit
   - sidebar sticky simulasi
7. Menyelesaikan bug 404 pada route unit detail.
8. Menyelesaikan bug CSS kacau pascarevisi desain.

**Detail penyelesaian bug route/detail:**
1. Mendeteksi bahwa port dipakai proses lama sehingga aplikasi tidak menampilkan versi terbaru.
2. Menghentikan proses lama dan menjalankan server baru.
3. Memastikan dynamic params route terbaca dengan benar pada framework version yang dipakai.
4. Validasi endpoint route unit detail melalui request langsung.

### C. Review & Testing

**Skenario testing:**
1. Build website publik setelah tiap perubahan besar.
2. Uji route:
   - halaman unit list
   - halaman unit detail astoria
   - halaman unit detail bvlgari
3. Uji interaksi slider kalkulator untuk memastikan nilai cicilan berubah real-time.
4. Uji tampilan sticky panel pada viewport desktop.
5. Uji kestabilan layout pada viewport mobile.

**Hasil testing:**
1. Build berhasil.
2. Route unit detail berhasil diakses normal.
3. Kalkulator menghitung output sesuai perubahan input.
4. Layout akhir stabil setelah perapian CSS.

### D. Deployment/Environment

**Environment:** Local production build + local serving

**Temuan environment:**
1. Terjadi EADDRINUSE karena port dipakai proses lama.
2. Restart server diperlukan agar build terbaru aktif.

**Langkah penanganan:**
1. Identifikasi PID proses pada port target.
2. Hentikan proses stale.
3. Start ulang aplikasi.
4. Verifikasi endpoint dengan status respons sukses.

### E. Review Tim

Review akhir minggu menyimpulkan fitur simulasi KPR berhasil delivered sesuai arahan: desain sangat dekat referensi, data unit otomatis terbaca, route stabil, dan tampilan akhir sudah rapi.

---

## 3. Hasil Proses Minggu Ini

1. Fitur simulasi KPR real-time selesai.
2. Integrasi kalkulator ke halaman detail unit selesai.
3. Desain detail unit direvisi dan diselaraskan dengan referensi.
4. Isu 404 pada unit detail selesai.
5. Isu CSS kacau selesai.

---

## 4. Blocker, Risiko, dan Mitigasi

**Blocker:**
1. Port conflict (server stale process).
2. Perubahan desain besar memicu ketidakseimbangan layout.
3. Route detail unit sempat menampilkan not found.

**Risiko:**
1. Jika proses lama tidak dihentikan, user melihat aplikasi versi lama dan mengira bug belum diperbaiki.
2. Revisi cepat pada layout bisa memicu regresi visual antar breakpoint.

**Mitigasi:**
1. Standarisasi prosedur kill/start saat testing hasil build terbaru.
2. Build dan smoke test setelah setiap patch visual besar.
3. Verifikasi endpoint route penting sebelum penutupan sprint.

---

## 5. Keputusan Minggu Ini

1. Penempatan kalkulator di detail unit dipilih sebagai default karena paling relevan untuk conversion.
2. Harga properti dijadikan input otomatis untuk menurunkan friction user.
3. Revisi desain diarahkan mendekati referensi visual prioritas user.
4. Endpoint testing langsung dijadikan bagian wajib saat menutup isu 404.

---

## 6. Action Penutupan Minggu

| Action Item | PIC | Status |
|------------|-----|--------|
| Simulasi KPR real-time selesai | Frontend Web Publik | Closed |
| Integrasi ke halaman detail unit selesai | Frontend Web Publik | Closed |
| Perbaikan 404 route unit detail selesai | Frontend Web Publik | Closed |
| Perapian CSS halaman detail selesai | Frontend Web Publik | Closed |

---

## 7. Rincian Teknis Implementasi

Minggu ke-5 berisi kombinasi delivery fitur dan incident handling, dengan detail engineering sebagai berikut:

1. Rincian Komponen Simulasi KPR:
   - Menyiapkan state DP, bunga, dan tenor sebagai input interaktif.
   - Menyiapkan hasil perhitungan cicilan bulanan dan plafon pinjaman sebagai output utama.
   - Menjaga format angka rupiah agar terbaca jelas oleh user non-teknis.
2. Rincian Formula Perhitungan:
   - Menggunakan formula anuitas standar untuk cicilan bulanan estimasi.
   - Menghubungkan parameter slider langsung ke perhitungan real-time.
3. Rincian Integrasi Detail Unit:
   - Harga properti diambil dari data unit aktif.
   - Komponen kalkulator diubah menjadi props-driven agar reusable pada konteks unit berbeda.
4. Rincian Revisi Layout:
   - Struktur detail unit disesuaikan mengikuti referensi visual prioritas.
   - Komposisi galeri, deskripsi, dan panel simulasi diselaraskan agar fokus user tetap ke keputusan pembelian.
5. Rincian Incident Handling:
   - Menelusuri penyebab route 404 ke masalah process stale dan pembacaan params dinamis.
   - Menstabilkan perilaku route melalui penyesuaian implementasi dan restart server tepat sasaran.
6. Rincian CSS Stabilization:
   - Menyelaraskan ulang grid/spacing setelah perubahan layout besar.
   - Menghilangkan elemen yang mengganggu keseimbangan komposisi visual.

---

## 8. Matrix Pengujian Minggu Ini

| Skenario Uji | Metode | Hasil |
|--------------|--------|-------|
| Perubahan slider DP mengubah cicilan | Manual browser | Pass |
| Perubahan slider bunga mengubah cicilan | Manual browser | Pass |
| Perubahan slider tenor mengubah cicilan | Manual browser | Pass |
| Harga unit otomatis masuk ke kalkulator | Manual browser + data compare | Pass |
| Route detail unit astoria | HTTP/browser check | Pass |
| Route detail unit bvlgari | HTTP/browser check | Pass |
| Build website publik setelah patch desain | Next build | Pass |
| Visual stability setelah hard refresh | Manual browser | Pass |

Catatan matrix:
1. Uji dilakukan berulang setelah setiap patch penting untuk meminimalkan regresi.
2. Endpoint check dipakai sebagai pembuktian objektif untuk penutupan isu 404.

---

## 9. Artefak Output Engineering

1. Komponen kalkulator KPR real-time siap pakai.
2. Integrasi kalkulator pada halaman detail unit dengan harga otomatis.
3. Revisi desain detail unit mendekati referensi prioritas.
4. Patch penyelesaian route 404 detail unit.
5. Patch perapian CSS final.
6. Bukti build sukses dan endpoint sukses.

Artefak ini membentuk baseline stabil untuk fase pengembangan website marketing berikutnya.

---

## 10. Lessons Learned Minggu Ini

1. Perubahan visual besar perlu disertai checkpoint QA antar breakpoint agar tidak memicu CSS cascade issue.
2. Pada incident 404, validasi process yang aktif di port sama pentingnya dengan validasi kode.
3. Rebuild tanpa memastikan server memakai artifact terbaru dapat menghasilkan false diagnosis.
4. Integrasi fitur finansial paling efektif ketika ditempatkan langsung pada konteks produk (detail unit), bukan halaman terpisah saja.

---

## 11. Cuplikan Source Code Penting Minggu Ini

### A. Formula Simulasi KPR Real-Time (Anuitas)

File: `frontend/web-public-portal/src/components/kpr-calculator.tsx`

```tsx
const calculation = useMemo<KPRCalculation>(() => {
   const dpAmount = propertyPrice * (dpPercent / 100);
   const principal = propertyPrice - dpAmount;
   const monthlyInterestRate = interestRate / 100 / 12;
   const totalMonths = tenorYears * 12;

   let monthlyPayment = 0;
   if (monthlyInterestRate > 0) {
      const numerator = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths));
      const denominator = Math.pow(1 + monthlyInterestRate, totalMonths) - 1;
      monthlyPayment = numerator / denominator;
   } else {
      monthlyPayment = principal / totalMonths;
   }

   return { dpPercent, dpAmount, loanAmount: principal, tenor: tenorYears, interestRate, monthlyPayment };
}, [propertyPrice, dpPercent, interestRate, tenorYears]);
```

Penjelasan singkat:
1. Snippet ini adalah inti kalkulasi cicilan KPR yang berubah real-time.
2. Semua slider input terhubung langsung ke hasil estimasi cicilan.

### B. Integrasi Harga Unit Otomatis + Dynamic Params Route

File: `frontend/web-public-portal/src/app/unit/[slug]/page.tsx`

```tsx
function parsePriceToNumber(priceStr: string): number {
   const cleaned = priceStr.replace(/[^\d.,]/g, "").replace(",", ".");
   const value = parseFloat(cleaned);
   const normalized = priceStr.toLowerCase();
   if (normalized.includes("miliar") || normalized.includes(" m")) return value * 1000000000;
   if (normalized.includes("juta") || normalized.includes(" jt")) return value * 1000000;
   return value;
}

export default async function UnitDetailPage({ params }: { params: Promise<Params> }) {
   const resolvedParams = await params;
   const unit = getUnitBySlug(resolvedParams.slug);

   if (!unit) {
      notFound();
   }

   const propertyPriceNumeric = parsePriceToNumber(unit.price);
   return <DetailContent unit={unit} propertyPriceNumeric={propertyPriceNumeric} />;
}
```

Penjelasan singkat:
1. Harga string pada data unit diubah ke angka rupiah agar bisa dipakai langsung kalkulator.
2. Pola async params dipakai untuk menjaga route detail unit tetap valid.

### C. Penempatan Kalkulator di Detail Unit (Layout Akhir)

File: `frontend/web-public-portal/src/app/unit/[slug]/detail-content.tsx`

```tsx
<div className="lg:col-span-5 relative">
   <div className="sticky top-32">
      <KPRCalculator propertyPrice={propertyPriceNumeric} unitName={unit.name} />
   </div>
</div>
```

Penjelasan singkat:
1. Kalkulator ditempatkan langsung pada detail unit agar konteks conversion lebih kuat.
2. Panel sticky memastikan simulasi tetap terlihat saat user menelusuri konten properti.

---

**Catatan:** Dokumen ini hanya memuat proses yang benar-benar sudah terjadi pada minggu ke-5.