import { Router } from "express";
import { InventoryController } from "./inventory.controller.js";
import { verifyToken, requireRole } from "../../core/middlewares/auth.middleware.js";
import { validate } from "../../core/middlewares/validate.middleware.js";
import { createPropertyTypeDto, createUnitDto } from "./dto/inventory.dto.js";

const router = Router();

// Melindungi semua rute di file ini dengan middleware token & role
router.use(verifyToken, requireRole(["Admin Inventory"]));

/**
 * @swagger
 * /api/inventory/types:
 *   post:
 *     summary: Membuat Tipe Properti / Master Rumah baru
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - name
 *               - basePrice
 *             properties:
 *               projectId:
 *                 type: string
 *               name:
 *                 type: string
 *               luasTanah:
 *                 type: number
 *               luasBangunan:
 *                 type: number
 *               kamarTidur:
 *                 type: number
 *               kamarMandi:
 *                 type: number
 *               basePrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Property Type berhasil dibuat
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Admin Inventory)
 */
router.post("/types", validate(createPropertyTypeDto), InventoryController.createType);

/**
 * @swagger
 * /api/inventory/types:
 *   get:
 *     summary: Mendapatkan semua Tipe Properti
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil data tipe properti
 */
router.get("/types", InventoryController.getAllTypes);

/**
 * @swagger
 * /api/inventory/units:
 *   post:
 *     summary: Mendaftarkan Unit Kavling baru
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - propertyTypeId
 *               - kawasan
 *               - blok
 *               - nomor
 *             properties:
 *               projectId:
 *                 type: string
 *               propertyTypeId:
 *                 type: string
 *               kawasan:
 *                 type: string
 *               blok:
 *                 type: string
 *               nomor:
 *                 type: string
 *               statusPembangunan:
 *                 type: string
 *                 example: "Pesan Bangun"
 *               statusPenjualan:
 *                 type: string
 *                 example: "Tersedia"
 *               priceMarkup:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Unit Kavling berhasil didaftarkan
 *       400:
 *         description: Duplikasi blok dan nomor di kawasan yang sama, atau input tidak valid
 */
router.post("/units", validate(createUnitDto), InventoryController.createUnit);

/**
 * @swagger
 * /api/inventory/units:
 *   get:
 *     summary: Mendapatkan semua Unit Kavling
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statusPenjualan
 *         schema:
 *           type: string
 *         description: Filter berdasarkan status penjualan (contoh Tersedia, Booked, Terjual)
 *       - in: query
 *         name: kawasan
 *         schema:
 *           type: string
 *         description: Filter berdasarkan nama kawasan
 *     responses:
 *       200:
 *         description: Berhasil mengambil data unit kavling
 */
router.get("/units", InventoryController.getAllUnits);

export default router;
