import React, { useState, useEffect } from 'react';
import { 
  Home, MapPin, BedDouble, Bath, Maximize, 
  ChevronRight, Calculator, Info, ArrowRight,
  ShieldCheck, Check
} from 'lucide-react';

export default function App() {
  // === STATE UNTUK SIMULASI KPR ===
  const propertyPrice = 2800000000; // Rp 2.8 Miliar (The Astoria)
  const [dpPercent, setDpPercent] = useState(20); // Uang Muka (%)
  const [interestRate, setInterestRate] = useState(5.5); // Bunga (%) per tahun
  const [tenorYears, setTenorYears] = useState(15); // Tenor (Tahun)
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  // Fungsi Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  // Logika Kalkulasi KPR (Anuitas Standar Perbankan)
  useEffect(() => {
    const dpAmount = propertyPrice * (dpPercent / 100);
    const principal = propertyPrice - dpAmount; // Pokok Pinjaman (Plafon)
    setLoanAmount(principal);

    const monthlyInterestRate = interestRate / 100 / 12;
    const totalMonths = tenorYears * 12;

    if (monthlyInterestRate > 0) {
      // Rumus Anuitas: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
      const payment = principal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths)) / (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment(principal / totalMonths);
    }
  }, [propertyPrice, dpPercent, interestRate, tenorYears]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-zinc-900 selection:bg-amber-200 selection:text-amber-900">
      
      {/* NAVBAR SIMPLE */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center border-2 border-amber-600 rounded-sm transform rotate-45">
              <span className="font-serif font-bold text-sm transform -rotate-45 text-zinc-900">G</span>
            </div>
            <span className="font-serif tracking-widest uppercase text-zinc-900 font-medium">Griya<span className="font-light">Persada</span></span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-widest text-zinc-500 hover:text-amber-600 cursor-pointer transition-colors flex items-center gap-2">
            Kembali ke Katalog <ChevronRight size={14} />
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-6">
            <span className="hover:text-zinc-900 cursor-pointer">Beranda</span>
            <span>/</span>
            <span className="hover:text-zinc-900 cursor-pointer">Koleksi Premium</span>
            <span>/</span>
            <span className="text-amber-600">The Astoria</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* KIRI: DETAIL PROPERTI (Gambar & Spesifikasi) */}
            <div className="lg:col-span-7">
              {/* Gambar Utama */}
              <div className="relative h-[400px] md:h-[500px] rounded-sm overflow-hidden mb-4 group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
                  alt="The Astoria" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute top-6 left-6 flex gap-2 z-10">
                  <span className="bg-zinc-900/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm">Tipe Signature</span>
                  <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-sm">Tersedia 3 Unit</span>
                </div>
              </div>

              {/* Thumbnail Gallery (Mockup) */}
              <div className="grid grid-cols-4 gap-4 mb-10">
                {[
                  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                ].map((img, idx) => (
                  <div key={idx} className="h-24 rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="h-24 rounded-sm overflow-hidden cursor-pointer bg-zinc-900 flex items-center justify-center flex-col text-white hover:bg-amber-600 transition-colors">
                  <span className="text-lg font-light">+8</span>
                  <span className="text-[10px] uppercase tracking-widest mt-1">Foto Lainnya</span>
                </div>
              </div>

              {/* Info Utama */}
              <div className="mb-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">The Astoria</h1>
                    <div className="flex items-center gap-2 text-zinc-500 font-light text-sm">
                      <MapPin size={16} className="text-amber-600" />
                      Blok A, Griya Persada Boulevard, Padang
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Harga Mulai</p>
                    <p className="text-3xl font-serif text-amber-600">{formatRupiah(propertyPrice)}</p>
                  </div>
                </div>

                {/* Fitur Utama */}
                <div className="flex flex-wrap gap-8 py-6 border-y border-zinc-200 mb-8">
                  <div className="flex items-center gap-3">
                    <BedDouble size={24} className="text-zinc-400 font-light" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Kamar Tidur</p>
                      <p className="text-lg font-serif text-zinc-900">4 + 1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bath size={24} className="text-zinc-400 font-light" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Kamar Mandi</p>
                      <p className="text-lg font-serif text-zinc-900">3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Maximize size={24} className="text-zinc-400 font-light" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Luas Bangunan</p>
                      <p className="text-lg font-serif text-zinc-900">150 m²</p>
                    </div>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-4">Deskripsi Properti</h3>
                  <p className="text-zinc-600 font-light leading-relaxed mb-4">
                    The Astoria merepresentasikan puncak kemewahan hidup modern. Dirancang dengan konsep *open-plan* yang memaksimalkan sirkulasi udara dan cahaya alami. Material lantai menggunakan marmer premium impor, sementara fasad bangunan didominasi kaca *low-E* dan aksen kayu ulin.
                  </p>
                  <p className="text-zinc-600 font-light leading-relaxed">
                    Setiap unit dilengkapi dengan *smart home system* terintegrasi, kanopi *solar panel*, dan garasi ganda. Berada di cluster terdepan yang hanya berjarak beberapa langkah dari *Clubhouse* utama.
                  </p>
                </div>
              </div>
            </div>

            {/* KANAN: WIDGET SIMULASI KPR (Sticky Panel) */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32 bg-white border border-zinc-200 rounded-sm p-8 md:p-10 shadow-2xl shadow-zinc-200/50">
                
                {/* Header Widget */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-50 rounded-sm flex items-center justify-center">
                    <Calculator className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-zinc-900">Simulasi KPR</h3>
                    <p className="text-xs text-zinc-500 font-light">Kalkulator estimasi cicilan per bulan</p>
                  </div>
                </div>

                {/* Harga Properti (Read Only) */}
                <div className="mb-8 pb-6 border-b border-zinc-100">
                  <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2 font-medium">Harga Properti</p>
                  <p className="text-3xl font-bold text-zinc-900">{formatRupiah(propertyPrice)}</p>
                </div>

                {/* SLIDER CONTROLS */}
                <div className="space-y-8 mb-10">
                  
                  {/* Slider Uang Muka (DP) */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Uang Muka (DP)</label>
                      <div className="text-right">
                        <span className="text-lg font-bold text-zinc-900">{dpPercent}%</span>
                        <p className="text-xs text-amber-600 font-medium">{formatRupiah(propertyPrice * (dpPercent / 100))}</p>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      step="5"
                      value={dpPercent}
                      onChange={(e) => setDpPercent(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Slider Suku Bunga */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Suku Bunga</label>
                      <span className="text-lg font-bold text-zinc-900">{interestRate.toFixed(2)}%<span className="text-xs font-light text-zinc-400 ml-1">p.a.</span></span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="15" 
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>

                  {/* Slider Tenor */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <label className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Lama Pinjaman (Tenor)</label>
                      <span className="text-lg font-bold text-zinc-900">{tenorYears} <span className="text-sm font-light text-zinc-500">Tahun</span></span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="25" 
                      step="1"
                      value={tenorYears}
                      onChange={(e) => setTenorYears(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
                      <span>5 thn</span>
                      <span>25 thn</span>
                    </div>
                  </div>
                </div>

                {/* HASIL KALKULASI */}
                <div className="bg-zinc-950 p-6 rounded-sm mb-6 relative overflow-hidden">
                  {/* Ornamen Garis Emas */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-600"></div>
                  
                  <p className="text-xs text-zinc-400 uppercase tracking-widest mb-2">Estimasi Cicilan</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <h2 className="text-3xl md:text-4xl font-serif text-white">{formatRupiah(monthlyPayment)}</h2>
                    <span className="text-zinc-500 text-sm font-light">/bln</span>
                  </div>

                  {/* Breakdown Plafon */}
                  <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Plafon Pinjaman (Kredit Bank)</p>
                      <p className="text-sm font-medium text-zinc-300">{formatRupiah(loanAmount)}</p>
                    </div>
                    <ShieldCheck className="text-amber-600/50" size={20} />
                  </div>
                </div>

                {/* Call To Action Buttons */}
                <div className="space-y-3">
                  <button className="w-full py-4 bg-amber-600 text-white font-bold text-sm uppercase tracking-widest hover:bg-amber-500 transition-colors rounded-sm flex items-center justify-center gap-2 group shadow-[0_10px_20px_rgba(245,158,11,0.2)]">
                    Minta Penawaran Resmi
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full py-4 border border-zinc-200 bg-white text-zinc-700 font-bold text-sm uppercase tracking-widest hover:bg-zinc-50 transition-colors rounded-sm flex items-center justify-center gap-2">
                    Tanya Sales via WhatsApp
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 flex items-start gap-2 bg-zinc-50 p-3 rounded-sm border border-zinc-100">
                  <Info size={14} className="text-zinc-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-light">
                    Kalkulator ini hanya sebagai alat bantu simulasi estimasi. Angka cicilan riil akan menyesuaikan dengan suku bunga aktual (fixed/floating) dari bank penyedia KPR saat akad kredit.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}