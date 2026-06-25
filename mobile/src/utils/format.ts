export function formatCurrency(value: number): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
  return formatted.replace(/\s/g, "");
}

/**
 * Format tanggal panjang dengan hari: "Rabu, 25 Juni 2026"
 * Digunakan untuk header utama yang perlu konteks hari.
 */
export function formatDateFull(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
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
  status: "NOT_STARTED" | "IN_PROGRESS" | "WAITING_APPROVAL" | "REJECTED" | "COMPLETED" | "PENDING"
): string {
  if (status === "NOT_STARTED" || status === "PENDING") {
    return "Belum Mulai";
  }
  if (status === "IN_PROGRESS") {
    return "Sedang Dikerjakan";
  }
  if (status === "WAITING_APPROVAL") {
    return "Menunggu Verifikasi";
  }
  if (status === "REJECTED") {
    return "Ditolak (Revisi)";
  }
  return "Selesai";
}

export function formatUnitStatusLabel(
  status: string
): string {
  if (status === "NOT_STARTED") {
    return "Belum Mulai";
  }
  if (status === "IN_PROGRESS") {
    return "Dalam Proses";
  }
  if (status === "DONE") {
    return "Selesai";
  }
  return status;
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
  status: string
): string {
  if (status === "DIPROSES" || status === "SEDANG_DITANGANI") {
    return "Diproses";
  }
  if (status === "MENUNGGU_TINDAKAN_CUSTOMER") {
    return "Menunggu Anda";
  }
  if (status === "SELESAI") {
    return "Selesai";
  }
  if (status === "DITUTUP") {
    return "Ditutup";
  }
  return "Baru";
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

export function formatErrorMessage(error: unknown): string {
   if (error instanceof Error) {
     if (error.message.includes("Network") || error.message.includes("network")) {
       return "Tidak dapat terhubung ke server. Periksa koneksi internet.";
     }
     if (error.message.includes("timeout") || error.message.includes("Timeout")) {
       return "Permintaan habis waktu. Coba lagi nanti.";
     }
     return error.message;
   }
   return "Terjadi kesalahan yang tidak diketahui.";
 }
