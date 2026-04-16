"use client";

import { useState, useMemo } from "react";
import { Calculator, Info, ShieldCheck, ArrowRight } from "lucide-react";

interface KPRCalculatorProps {
  propertyPrice: number;
  unitName?: string;
}

interface KPRCalculation {
  dpPercent: number;
  dpAmount: number;
  loanAmount: number;
  tenor: number;
  interestRate: number;
  monthlyPayment: number;
}

const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export function KPRCalculator({ propertyPrice, unitName = "Unit Properti" }: KPRCalculatorProps) {
  const [dpPercent, setDpPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [tenorYears, setTenorYears] = useState<number>(15);

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

    return {
      dpPercent,
      dpAmount,
      loanAmount: principal,
      tenor: tenorYears,
      interestRate,
      monthlyPayment,
    };
  }, [propertyPrice, dpPercent, interestRate, tenorYears]);

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-sm p-8 md:p-10 shadow-2xl shadow-zinc-200/50">
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
              <p className="text-xs text-amber-600 font-medium">{formatRupiah(calculation.dpAmount)}</p>
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
            <span className="text-lg font-bold text-zinc-900">
              {interestRate.toFixed(2)}%<span className="text-xs font-light text-zinc-400 ml-1">p.a.</span>
            </span>
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
          <div className="flex justify-between text-[10px] text-zinc-400 mt-2">
            <span>1%</span>
            <span>15%</span>
          </div>
        </div>

        {/* Slider Tenor */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xs text-zinc-500 uppercase tracking-widest font-medium">
              Lama Pinjaman (Tenor)
            </label>
            <span className="text-lg font-bold text-zinc-900">
              {tenorYears} <span className="text-sm font-light text-zinc-500">Tahun</span>
            </span>
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
          <h2 className="text-3xl md:text-4xl font-serif text-white">{formatRupiah(calculation.monthlyPayment)}</h2>
          <span className="text-zinc-500 text-sm font-light">/bln</span>
        </div>

        {/* Breakdown Plafon */}
        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
              Plafon Pinjaman (Kredit Bank)
            </p>
            <p className="text-sm font-medium text-zinc-300">{formatRupiah(calculation.loanAmount)}</p>
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
          Kalkulator ini hanya sebagai alat bantu simulasi estimasi. Angka cicilan riil akan menyesuaikan dengan suku
          bunga aktual (fixed/floating) dari bank penyedia KPR saat akad kredit.
        </p>
      </div>
    </div>
  );
}
