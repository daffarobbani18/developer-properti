"use client";

import { FormEvent, useState } from "react";

import { submitLead } from "../lib/api";

type LeadFormProps = {
  defaultInterest?: string;
};

export function LeadForm({ defaultInterest }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? "") || undefined,
      interestedUnitType:
        String(formData.get("interestedUnitType") ?? "") || defaultInterest || undefined,
      notes: String(formData.get("notes") ?? "") || undefined,
      source: "website_marketing"
    };

    try {
      await submitLead(payload);
      setSuccessMessage("Terima kasih. Tim sales akan menghubungi Anda maksimal 1x24 jam.");
      event.currentTarget.reset();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Gagal mengirim data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <label>
        Nama Lengkap
        <input name="name" required placeholder="Nama Anda" />
      </label>
      <label>
        Nomor WhatsApp
        <input name="phone" required placeholder="08xxxxxxxxxx" />
      </label>
      <label>
        Email
        <input name="email" type="email" placeholder="opsional@mail.com" />
      </label>
      <label>
        Tipe Rumah Diminati
        <input
          name="interestedUnitType"
          defaultValue={defaultInterest}
          placeholder="Contoh: Tipe 45/90"
        />
      </label>
      <label>
        Pesan
        <textarea name="notes" rows={3} placeholder="Tuliskan kebutuhan Anda" />
      </label>

      <button className="cta-button" type="submit" disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Minat"}
      </button>

      {successMessage ? <p className="success-message">{successMessage}</p> : null}
      {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
    </form>
  );
}
