import os

service_path = 'd:/Website/developer-properti/backend/src/modules/billing/billing.service.ts'
with open(service_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getAllInvoices' not in content:
    new_method = '''
  /**
   * Mengambil semua invoice
   */
  static async getAllInvoices() {
    return await prisma.invoice.findMany({
      include: {
        booking: {
          include: {
            lead: { select: { name: true, phone: true } },
            unit: { select: { blok: true, nomor: true, kawasan: true } }
          }
        }
      },
      orderBy: { dueDate: "asc" }
    });
  }
'''
    content = content.replace('export class BillingService {', 'export class BillingService {' + new_method)
    with open(service_path, 'w', encoding='utf-8') as f:
        f.write(content)

controller_path = 'd:/Website/developer-properti/backend/src/modules/billing/billing.controller.ts'
with open(controller_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'getAllInvoices' not in content:
    new_method = '''
  static async getAllInvoices(req: Request, res: Response): Promise<void> {
    try {
      const invoices = await BillingService.getAllInvoices();
      res.status(200).json({ message: "Berhasil mengambil tagihan", data: invoices });
    } catch (error: any) {
      res.status(500).json({ error: "Gagal mengambil data tagihan" });
    }
  }
'''
    content = content.replace('export class BillingController {', 'export class BillingController {' + new_method)
    with open(controller_path, 'w', encoding='utf-8') as f:
        f.write(content)

routes_path = 'd:/Website/developer-properti/backend/src/modules/billing/billing.routes.ts'
with open(routes_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'router.get("/invoices"' not in content:
    new_route = '''
/**
 * @swagger
 * /api/billing/invoices:
 *   get:
 *     summary: Mendapatkan semua invoice
 *     tags: [Billing]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/invoices", BillingController.getAllInvoices);
'''
    content = content.replace('export default router;', new_route + '\nexport default router;')
    with open(routes_path, 'w', encoding='utf-8') as f:
        f.write(content)
