export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatMilestoneStatusLabel(
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
): string {
  if (status === "NOT_STARTED") {
    return "Belum Mulai";
  }
  if (status === "IN_PROGRESS") {
    return "Sedang Dikerjakan";
  }
  return "Selesai";
}

export function formatUnitStatusLabel(
  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE"
): string {
  if (status === "NOT_STARTED") {
    return "Belum Mulai";
  }
  if (status === "IN_PROGRESS") {
    return "Dalam Proses";
  }
  return "Selesai";
}

export function formatIssueStatusLabel(
  status: "BARU" | "SEDANG_DITANGANI" | "SELESAI"
): string {
  if (status === "BARU") {
    return "Baru";
  }
  if (status === "SEDANG_DITANGANI") {
    return "Sedang Ditangani";
  }
  return "Selesai";
}

export function formatIssueUrgencyLabel(
  urgency: "RENDAH" | "SEDANG" | "TINGGI" | "KRITIS"
): string {
  if (urgency === "RENDAH") {
    return "Rendah";
  }
  if (urgency === "SEDANG") {
    return "Sedang";
  }
  if (urgency === "TINGGI") {
    return "Tinggi";
  }
  return "Kritis";
}

export function formatInvoiceStatusLabel(
  status: "BELUM_BAYAR" | "JATUH_TEMPO" | "TERLAMBAT" | "MENUNGGU_VERIFIKASI" | "LUNAS"
): string {
  if (status === "BELUM_BAYAR") {
    return "Belum Bayar";
  }
  if (status === "JATUH_TEMPO") {
    return "Jatuh Tempo";
  }
  if (status === "TERLAMBAT") {
    return "Terlambat";
  }
  if (status === "MENUNGGU_VERIFIKASI") {
    return "Menunggu Verifikasi";
  }
  return "Lunas";
}

export function formatPaymentStatusLabel(status: "DIKONFIRMASI" | "MENUNGGU_VERIFIKASI"): string {
  if (status === "DIKONFIRMASI") {
    return "Dikonfirmasi";
  }
  return "Menunggu Verifikasi";
}

export function formatTicketStatusLabel(
  status: "BARU" | "SEDANG_DITANGANI" | "SELESAI" | "DITUTUP"
): string {
  if (status === "BARU") {
    return "Baru";
  }
  if (status === "SEDANG_DITANGANI") {
    return "Sedang Ditangani";
  }
  if (status === "SELESAI") {
    return "Selesai";
  }
  return "Ditutup";
}

export function formatDocumentStatusLabel(
  status: "TERSEDIA" | "SEDANG_DIPROSES" | "BELUM_TERSEDIA"
): string {
  if (status === "TERSEDIA") {
    return "Tersedia";
  }
  if (status === "SEDANG_DIPROSES") {
    return "Sedang Diproses";
  }
  return "Belum Tersedia";
}

export function inferBannerTone(
  message: string
): "info" | "success" | "warning" | "danger" {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("gagal") ||
    normalized.includes("tidak valid") ||
    normalized.includes("wajib") ||
    normalized.includes("ditolak") ||
    normalized.includes("error")
  ) {
    return "danger";
  }

  if (
    normalized.includes("offline") ||
    normalized.includes("antrian") ||
    normalized.includes("menunggu") ||
    normalized.includes("peringatan")
  ) {
    return "warning";
  }

  if (
    normalized.includes("berhasil") ||
    normalized.includes("selesai") ||
    normalized.includes("dikonfirmasi") ||
    normalized.includes("disimpan")
  ) {
    return "success";
  }

  return "info";
}
