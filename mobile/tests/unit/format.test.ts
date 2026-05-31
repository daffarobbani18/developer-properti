import { formatCurrency, formatDate, formatMilestoneStatusLabel, formatUnitStatusLabel } from "../../src/utils/format";

describe("Format Utilities", () => {
  describe("formatCurrency", () => {
    it("formats number to Indonesian Rupiah", () => {
      expect(formatCurrency(1000000)).toBe("Rp1.000.000");
      expect(formatCurrency(50000000)).toBe("Rp50.000.000");
    });

    it("handles zero value", () => {
      expect(formatCurrency(0)).toBe("Rp0");
    });
  });

  describe("formatDate", () => {
    it("formats ISO date string to Indonesian format", () => {
      expect(formatDate("2026-03-10")).toBe("10 Mar 2026");
      expect(formatDate("2026-01-15")).toBe("15 Jan 2026");
    });

    it("returns original value for invalid date", () => {
      expect(formatDate("invalid")).toBe("invalid");
    });
  });

  describe("formatMilestoneStatusLabel", () => {
    it("returns correct labels for milestone status", () => {
      expect(formatMilestoneStatusLabel("NOT_STARTED")).toBe("Belum Mulai");
      expect(formatMilestoneStatusLabel("IN_PROGRESS")).toBe("Sedang Dikerjakan");
      expect(formatMilestoneStatusLabel("COMPLETED")).toBe("Selesai");
    });
  });

  describe("formatUnitStatusLabel", () => {
    it("returns correct labels for unit status", () => {
      expect(formatUnitStatusLabel("NOT_STARTED")).toBe("Belum Mulai");
      expect(formatUnitStatusLabel("IN_PROGRESS")).toBe("Dalam Proses");
      expect(formatUnitStatusLabel("DONE")).toBe("Selesai");
    });
  });
});