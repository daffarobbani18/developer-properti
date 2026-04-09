"use client";

import { FormEvent, useState } from "react";

import { simulateKpr } from "../lib/api";
import { formatCurrency } from "../lib/format";

export function KprCalculator() {
  const [result, setResult] = useState<{
    dpAmount: number;
    principal: number;
    monthlyInstallment: number;
    installments: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    const price = Number(formData.get("price") ?? 0);
    const dpPercent = Number(formData.get("dpPercent") ?? 0);
    const tenorYears = Number(formData.get("tenorYears") ?? 0);
    const interestPercent = Number(formData.get("interestPercent") ?? 0);

    try {
      const data = await simulateKpr({
        price,
        dpPercent,
        tenorYears,
        interestPercent
      });
      setResult(data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal menghitung simulasi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kpr-card">
      <form className="kpr-form" onSubmit={handleCalculate}>
        <label>
          Harga Properti
          <input name="price" type="number" defaultValue={550000000} min={1} required />
        </label>
        <label>
          DP (%)
          <input name="dpPercent" type="number" defaultValue={20} min={0} max={100} required />
        </label>
        <label>
          Tenor (tahun)
          <input name="tenorYears" type="number" defaultValue={15} min={1} required />
        </label>
        <label>
          Suku Bunga (%)
          <input name="interestPercent" type="number" defaultValue={8.5} min={0} step={0.1} required />
        </label>
        <button className="cta-button" type="submit" disabled={loading}>
          {loading ? "Menghitung..." : "Hitung Simulasi"}
        </button>
      </form>

      {result ? (
        <div className="kpr-result">
          <h3>Hasil Simulasi</h3>
          <ul>
            <li>Jumlah DP: {formatCurrency(result.dpAmount)}</li>
            <li>Sisa Pinjaman: {formatCurrency(result.principal)}</li>
            <li>Perkiraan Cicilan/Bulan: {formatCurrency(result.monthlyInstallment)}</li>
            <li>Total Angsuran: {result.installments} bulan</li>
          </ul>
        </div>
      ) : null}

      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </div>
  );
}
