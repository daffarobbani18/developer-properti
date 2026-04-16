import { PublicTopNav } from "@/components/public/public-top-nav";
import { PublicFooter } from "@/components/public/public-footer";
import { KPRCalculator } from "@/components/kpr-calculator";
import { Calculator, TrendingUp, Zap } from "lucide-react";

export const metadata = {
  title: "Simulasi KPR | SIMDP",
  description: "Kalkulator KPR real-time untuk membantu Anda merencanakan pembelian properti dengan cicilan yang terjangkau.",
};

export default function SimulasiKPRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-900">
      <PublicTopNav />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 border-b border-zinc-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-4">
              Fitur Simulasi
            </p>
            <h1 className="text-4xl md:text-6xl font-serif leading-tight mb-4">
              Simulasi Kredit Properti
            </h1>
            <p className="text-zinc-600 max-w-3xl text-lg font-light leading-relaxed">
              Hitung cicilan bulanan Anda secara real-time. Sesuaikan parameter untuk menemukan skema pembiayaan yang paling sesuai dengan kemampuan Anda.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 bg-zinc-50 border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-amber-100">
                    <Calculator className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Kalkulasi Real-Time</h3>
                  <p className="text-xs text-zinc-600">Hasil update langsung saat Anda mengubah parameter</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Simulasi Fleksibel</h3>
                  <p className="text-xs text-zinc-600">Coba berbagai skenario DP, tenor, dan suku bunga</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
                    <Zap className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">Akurat & Transparan</h3>
                  <p className="text-xs text-zinc-600">Gunakan rumus standar perhitungan KPR bank</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.24em] text-amber-600 font-semibold mb-3">
                Kalkulator KPR
              </p>
              <h2 className="text-3xl md:text-4xl font-serif mb-3">Hitung Cicilan Anda</h2>
            </div>

            <KPRCalculator propertyPrice={2800000000} unitName="Contoh Properti" />
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 md:py-20 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-3xl font-serif mb-8">Panduan Penggunaan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">1. Tentukan Harga Properti</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Masukkan harga properti yang ingin Anda beli. Anda bisa langsung memilih dari unit yang tersedia di katalog kami, atau masukkan estimasi harga properti impian Anda.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">2. Pilih Uang Muka (DP)</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Semakin besar uang muka, semakin kecil cicilan bulanan Anda. Gunakan shortcut tombol (10%, 15%, 20%, dll.) untuk memudahkan simulasi.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">3. Atur Tenor (Durasi)</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Tenor adalah jangka waktu kredit Anda dalam tahun (biasanya 5–30 tahun). Tenor lebih pendek = cicilan lebih besar, tenor lebih panjang = cicilan lebih kecil.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">4. Masukkan Suku Bunga</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Suku bunga adalah biaya pinjaman per tahun (dalam %). Nilai ini bisa berbeda per bank dan kondisi kredit Anda. Minta estimasi dari bank terlebih dahulu.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">5. Lihat Hasil Kalkulasi</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Hasil akan menampilkan cicilan bulanan, total bunga, dan total yang harus Anda bayar. Gunakan ini untuk merencanakan budget keluarga Anda.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">6. Hubungi Sales</h3>
                  <p className="text-sm text-zinc-600 leading-relaxed">
                    Jika Anda sudah menemukan skema yang sesuai, hubungi tim sales kami untuk konsultasi lebih lanjut dan proses pembiayaan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-20 bg-white border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <h2 className="text-3xl font-serif mb-8">Pertanyaan Umum</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <h3 className="font-semibold text-base mb-2">Apakah hasil kalkulasi 100% akurat?</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Kalkulasi ini menggunakan rumus standar KPR. Namun, hasil akhir dapat berbeda karena faktor seperti asuransi, pajak, biaya administrasi, dan kondisi bank yang spesifik.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-base mb-2">Berapa suku bunga yang realistis?</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Suku bunga KPR di Indonesia berkisar 4–8% per tahun tergantung bank, tenor, dan profil debitur Anda. Hubungi bank untuk penawaran yang paling kompetitif.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-base mb-2">Berapakah DP minimal?</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  DP minimal umumnya 10–20% dari harga properti. Namun, beberapa bank atau program khusus mungkin memiliki syarat berbeda.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-base mb-2">Berapa lama proses approval KPR?</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Proses verifikasi dan approval biasanya 3–14 hari kerja, tergantung kelengkapan dokumen dan bank yang Anda pilih.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-base mb-2">Apakah bisa mengubah tenor di tengah cicilan?</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Beberapa bank memungkinkan restrukturisasi kredit (pengubahan tenor) dengan syarat dan biaya tertentu. Hubungi bank Anda untuk rinciannya.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-base mb-2">Apakah cicilan sudah termasuk pajak?</h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  Tidak. Hasil kalkulasi hanya menampilkan cicilan pokok + bunga. Pajak PPNPN dan biaya lainnya dihitung terpisah.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-amber-50 to-yellow-50 border-t border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
            <h2 className="text-3xl font-serif mb-4">Siap Memulai Perjalanan Anda?</h2>
            <p className="text-zinc-600 mb-8 max-w-2xl mx-auto">
              Setelah menemukan skema pembiayaan yang sesuai, tim marketing kami siap membantu Anda dengan informasi unit, proses approval, dan konsultasi lengkap.
            </p>
            <a
              href="/kontak"
              className="inline-block px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Hubungi Tim Sales
            </a>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
