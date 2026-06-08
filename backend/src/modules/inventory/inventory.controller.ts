import { Request, Response } from "express";
import { InventoryService } from "./inventory.service.js";

export class InventoryController {
  static async createType(req: Request, res: Response): Promise<void> {
    try {
      const {
        projectId,
        name,
        luasTanah,
        luasBangunan,
        kamarTidur,
        kamarMandi,
        basePrice,
        estimasiRab,
        facilities,
        milestoneTemplates,
      } = req.body;

      if (!projectId || !name || !basePrice) {
        res.status(400).json({ error: "projectId, name, dan basePrice wajib diisi" });
        return;
      }

      const propertyType = await InventoryService.createPropertyType({
        projectId: String(projectId),
        name: String(name),
        luasTanah: Number(luasTanah || 0),
        luasBangunan: Number(luasBangunan || 0),
        kamarTidur: Number(kamarTidur || 0),
        kamarMandi: Number(kamarMandi || 0),
        basePrice: Number(basePrice),
        estimasiRab: Number(estimasiRab || 0),
        imageUrl: req.body.imageUrl || null,
        facilities: facilities ? String(facilities) : null,
        milestoneTemplates: Array.isArray(milestoneTemplates) ? milestoneTemplates : [],
      });

      res.status(201).json({
        message: "Property Type berhasil dibuat",
        data: propertyType,
      });
    } catch (error: any) {
      console.error("createType error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }

  static async updateType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const {
        projectId,
        name,
        luasTanah,
        luasBangunan,
        kamarTidur,
        kamarMandi,
        basePrice,
        estimasiRab,
        imageUrl,
        facilities,
        milestoneTemplates,
      } = req.body;

      const propertyType = await InventoryService.updatePropertyType(id as string, {
        projectId: projectId ? String(projectId) : undefined,
        name: name ? String(name) : undefined,
        luasTanah: luasTanah !== undefined ? Number(luasTanah) : undefined,
        luasBangunan: luasBangunan !== undefined ? Number(luasBangunan) : undefined,
        kamarTidur: kamarTidur !== undefined ? Number(kamarTidur) : undefined,
        kamarMandi: kamarMandi !== undefined ? Number(kamarMandi) : undefined,
        basePrice: basePrice !== undefined ? Number(basePrice) : undefined,
        estimasiRab: estimasiRab !== undefined ? Number(estimasiRab) : undefined,
        imageUrl: imageUrl !== undefined ? String(imageUrl) : undefined,
        facilities: facilities !== undefined ? (facilities ? String(facilities) : null) : undefined,
        milestoneTemplates: milestoneTemplates !== undefined && Array.isArray(milestoneTemplates) ? (milestoneTemplates as { category: string; name: string; bobotPersentase: number }[]) : [],
      });

      res.status(200).json({
        message: "Property Type berhasil diupdate",
        data: propertyType,
      });
    } catch (error: any) {
      console.error("updateType error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }

  static async deleteType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await InventoryService.deletePropertyType(id as string);

      res.status(200).json({
        message: "Property Type berhasil dihapus",
      });
    } catch (error: any) {
      console.error("deleteType error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }

  static async getAllTypes(req: Request, res: Response): Promise<void> {
    try {
      const propertyTypes = await InventoryService.getAllPropertyTypes();
      res.status(200).json({
        message: "Berhasil mengambil data tipe properti",
        data: propertyTypes,
      });
    } catch (error: any) {
      console.error("getAllTypes error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async createUnit(req: Request, res: Response): Promise<void> {
    try {
      const {
        projectId,
        propertyTypeId,
        kawasan,
        blok,
        nomor,
        statusPembangunan,
        statusPenjualan,
        priceMarkup,
      } = req.body;

      if (!projectId || !propertyTypeId || !blok || !nomor) {
        res.status(400).json({ error: "Data wajib (projectId, propertyTypeId, blok, nomor) harus diisi" });
        return;
      }

      const unit = await InventoryService.createKavlingUnit({
        projectId,
        propertyTypeId,
        kawasan: kawasan || "",
        blok,
        nomor,
        statusPembangunan: statusPembangunan || "Pesan Bangun",
        statusPenjualan: statusPenjualan || "Tersedia",
        priceMarkup: Number(priceMarkup) || 0,
        nomorUnit: `${blok}-${nomor}`,
      });

      res.status(201).json({
        message: "Unit Kavling berhasil didaftarkan",
        data: unit,
      });
    } catch (error: any) {
      if (error.message.includes("sudah ada") || error.message.includes("tidak ditemukan")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("createUnit error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  static async bulkCreateUnits(req: Request, res: Response): Promise<void> {
    try {
      const {
        projectId,
        propertyTypeId,
        kawasan,
        blok,
        startNumber,
        endNumber,
        skipNumbers,
        statusPembangunan,
        statusPenjualan,
        priceMarkup,
      } = req.body;

      if (!projectId || !propertyTypeId || !blok || !startNumber || !endNumber) {
        res.status(400).json({ error: "Data wajib (projectId, propertyTypeId, blok, startNumber, endNumber) harus diisi" });
        return;
      }

      const count = await InventoryService.createBulkKavlingUnits({
        projectId,
        propertyTypeId,
        kawasan: kawasan || "",
        blok,
        startNumber: Number(startNumber),
        endNumber: Number(endNumber),
        skipNumbers,
        statusPembangunan: statusPembangunan || "Pesan Bangun",
        statusPenjualan: statusPenjualan || "Tersedia",
        priceMarkup: Number(priceMarkup) || 0,
      });

      res.status(201).json({
        message: `Berhasil mendaftarkan ${count} Unit Kavling`,
        count,
      });
    } catch (error: any) {
      if (error.message.includes("sudah ada") || error.message.includes("tidak ditemukan")) {
        res.status(400).json({ error: error.message });
      } else {
        console.error("bulkCreateUnits error:", error);
        res.status(500).json({ error: "Terjadi kesalahan pada server" });
      }
    }
  }

  static async getAllUnits(req: Request, res: Response): Promise<void> {
    try {
      const { statusPenjualan, kawasan } = req.query;

      const filters: any = {};
      if (statusPenjualan) filters.statusPenjualan = String(statusPenjualan);
      if (kawasan) filters.kawasan = String(kawasan);

      const units = await InventoryService.getAllKavlingUnits(filters);
      res.status(200).json({
        message: "Berhasil mengambil data unit kavling",
        data: units,
      });
    } catch (error: any) {
      console.error("getAllUnits error:", error);
      res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }
  }

  static async updateUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const unit = await InventoryService.updateKavlingUnit(String(id), data);
      res.status(200).json({
        message: "Unit Kavling berhasil diupdate",
        data: unit,
      });
    } catch (error: any) {
      console.error("updateUnit error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }

  static async deleteUnit(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await InventoryService.deleteKavlingUnit(String(id));
      res.status(200).json({
        message: "Unit Kavling berhasil dihapus",
      });
    } catch (error: any) {
      console.error("deleteUnit error:", error);
      res.status(500).json({ error: error.message || "Terjadi kesalahan pada server" });
    }
  }
}
