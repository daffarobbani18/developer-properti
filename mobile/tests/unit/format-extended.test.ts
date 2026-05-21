import {
  formatCurrency,
  formatDate,
  formatIssueStatusLabel,
  formatIssueUrgencyLabel,
  formatMilestoneStatusLabel,
  formatTicketStatusLabel,
  formatUnitStatusLabel,
  formatInvoiceStatusLabel,
  formatPaymentStatusLabel,
  formatDocumentStatusLabel,
  inferBannerTone,
} from "../../src/utils/format";

describe("Format Utilities - Extended Coverage", () => {
  describe("formatCurrency", () => {
    it("handles negative values", () => {
      expect(formatCurrency(-1000000)).toBe("-Rp1.000.000");
    });

    it("handles decimal values", () => {
      expect(formatCurrency(1500000.5)).toBe("Rp1.500.001");
    });
  });

  describe("formatDate", () => {
    it("formats full date with time correctly", () => {
      const result = formatDate("2026-03-10T14:30:00Z");
      expect(result).toMatch(/10 Mar 2026/);
    });

    it("handles leap year dates", () => {
      expect(formatDate("2024-02-29")).toBe("29 Feb 2024");
    });

    it("handles edge case: year boundary", () => {
      expect(formatDate("2026-01-01")).toBe("01 Jan 2026");
    });
  });

  describe("formatIssueStatusLabel", () => {
    it("returns correct labels for issue status", () => {
      expect(formatIssueStatusLabel("BARU")).toBe("Baru");
      expect(formatIssueStatusLabel("SEDANG_DITANGANI")).toBe("Sedang Ditangani");
      expect(formatIssueStatusLabel("SELESAI")).toBe("Selesai");
    });
  });

  describe("formatIssueUrgencyLabel", () => {
    it("returns correct labels for urgency levels", () => {
      expect(formatIssueUrgencyLabel("RENDAH")).toBe("Rendah");
      expect(formatIssueUrgencyLabel("SEDANG")).toBe("Sedang");
      expect(formatIssueUrgencyLabel("TINGGI")).toBe("Tinggi");
      expect(formatIssueUrgencyLabel("KRITIS")).toBe("Kritis");
    });
  });

  describe("formatTicketStatusLabel", () => {
    it("returns correct labels for ticket status", () => {
      expect(formatTicketStatusLabel("BARU")).toBe("Baru");
      expect(formatTicketStatusLabel("SEDANG_DITANGANI")).toBe("Sedang Ditangani");
      expect(formatTicketStatusLabel("SELESAI")).toBe("Selesai");
      expect(formatTicketStatusLabel("DITUTUP")).toBe("Ditutup");
    });
  });

  describe("formatInvoiceStatusLabel", () => {
    it("returns correct labels for invoice status", () => {
      expect(formatInvoiceStatusLabel("BELUM_BAYAR")).toBe("Belum Bayar");
      expect(formatInvoiceStatusLabel("JATUH_TEMPO")).toBe("Jatuh Tempo");
      expect(formatInvoiceStatusLabel("TERLAMBAT")).toBe("Terlambat");
      expect(formatInvoiceStatusLabel("MENUNGGU_VERIFIKASI")).toBe("Menunggu Verifikasi");
      expect(formatInvoiceStatusLabel("LUNAS")).toBe("Lunas");
    });
  });

  describe("formatPaymentStatusLabel", () => {
    it("returns correct labels for payment status", () => {
      expect(formatPaymentStatusLabel("DIKONFIRMASI")).toBe("Dikonfirmasi");
      expect(formatPaymentStatusLabel("MENUNGGU_VERIFIKASI")).toBe("Menunggu Verifikasi");
    });
  });

  describe("formatDocumentStatusLabel", () => {
    it("returns correct labels for document status", () => {
      expect(formatDocumentStatusLabel("TERSEDIA")).toBe("Tersedia");
      expect(formatDocumentStatusLabel("SEDANG_DIPROSES")).toBe("Sedang Diproses");
      expect(formatDocumentStatusLabel("BELUM_TERSEDIA")).toBe("Belum Tersedia");
    });
  });

  describe("inferBannerTone", () => {
    it("returns danger for negative keywords", () => {
      expect(inferBannerTone("Gagal menyimpan data")).toBe("danger");
      expect(inferBannerTone("Error pada server")).toBe("danger");
      expect(inferBannerTone("Data ditolak")).toBe("danger");
      expect(inferBannerTone("Wajib diisi")).toBe("danger");
    });

    it("returns warning for warning keywords", () => {
      expect(inferBannerTone("Mode offline aktif")).toBe("warning");
      expect(inferBannerTone("Item dalam antrian")).toBe("warning");
      expect(inferBannerTone("Peringatan penting")).toBe("warning");
    });

    it("returns success for positive keywords", () => {
      expect(inferBannerTone("Berhasil disimpan")).toBe("success");
      expect(inferBannerTone("Proses selesai")).toBe("success");
      expect(inferBannerTone("Data dikonfirmasi")).toBe("success");
    });

    it("returns info for neutral messages", () => {
      expect(inferBannerTone("Informasi update")).toBe("info");
      expect(inferBannerTone("Status proses")).toBe("info");
    });
  });
});