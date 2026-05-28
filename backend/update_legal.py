import os

service_path = 'd:/Website/developer-properti/backend/src/modules/legal/legal.service.ts'
with open(service_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getAllLegalStatuses' not in content:
    new_method = '''
  /**
   * Mengambil semua status legal dari booking
   */
  static async getAllLegalStatuses() {
    return await prisma.booking.findMany({
      include: {
        lead: { select: { name: true } },
        unit: { select: { blok: true, nomor: true, kawasan: true } },
        legalDocuments: true,
        basts: true
      },
      orderBy: { createdAt: "desc" }
    });
  }
'''
    content = content.replace('export class LegalService {', 'export class LegalService {' + new_method)
    with open(service_path, 'w', encoding='utf-8') as f:
        f.write(content)

controller_path = 'd:/Website/developer-properti/backend/src/modules/legal/legal.controller.ts'
with open(controller_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getAllLegalStatuses' not in content:
    new_method = '''
  static async getAllLegalStatuses(req: Request, res: Response): Promise<void> {
    try {
      const statuses = await LegalService.getAllLegalStatuses();
      res.status(200).json({ message: "Berhasil mengambil semua status legal", data: statuses });
    } catch (error: any) {
      res.status(500).json({ error: "Gagal mengambil data legal" });
    }
  }
'''
    content = content.replace('export class LegalController {', 'export class LegalController {' + new_method)
    with open(controller_path, 'w', encoding='utf-8') as f:
        f.write(content)

routes_path = 'd:/Website/developer-properti/backend/src/modules/legal/legal.routes.ts'
with open(routes_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'router.get("/status"' not in content:
    new_route = '''
/**
 * @swagger
 * /api/legal/status:
 *   get:
 *     summary: Mendapatkan semua status legalitas unit
 *     tags: [Legal]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/status", LegalController.getAllLegalStatuses);
'''
    content = content.replace('export default router;', new_route + '\nexport default router;')
    with open(routes_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated legal backend")
