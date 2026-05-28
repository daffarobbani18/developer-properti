import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service.js";

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

      if (!projectId || !propertyTypeId || !kawasan || !blok || !nomor) {
        res.status(400).json({ error: "Data wajib (projectId, propertyTypeId, kawasan, blok, nomor) harus diisi" });
        return;
      }

      const unit = await InventoryService.createKavlingUnit({
        projectId: String(projectId),
        propertyTypeId: String(propertyTypeId),
        kawasan: String(kawasan),
        blok: String(blok),
        nomor: String(nomor),
        statusPembangunan: String(statusPembangunan || "Pesan Bangun"),
        statusPenjualan: String(statusPenjualan || "Tersedia"),
        priceMarkup: Number(priceMarkup || 0),
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
}
