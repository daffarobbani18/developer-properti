import { formatAttendanceStatusLabel } from "../../src/utils/format";

describe("Attendance Formatting Utilities", () => {
  describe("formatAttendanceStatusLabel", () => {
    it("returns correct label for HADIR status", () => {
      expect(formatAttendanceStatusLabel("HADIR")).toBe("Hadir");
    });

    it("returns correct label for TERLAMBAT status", () => {
      expect(formatAttendanceStatusLabel("TERLAMBAT")).toBe("Terlambat");
    });

    it("returns correct label for IZIN status", () => {
      expect(formatAttendanceStatusLabel("IZIN")).toBe("Izin");
    });

    it("returns correct label for SAKIT status", () => {
      expect(formatAttendanceStatusLabel("SAKIT")).toBe("Sakit");
    });

    it("returns correct label for ALPHA status", () => {
      expect(formatAttendanceStatusLabel("ALPHA")).toBe("Tanpa Keterangan");
    });
  });
});