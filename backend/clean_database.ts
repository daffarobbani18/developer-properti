/**
 * Script: Bersihkan seluruh database kecuali User owner.
 * Jalankan: npx tsx clean_database.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Memulai pembersihan database...\n");

  // Hapus dalam urutan yang benar (child → parent) untuk menghindari FK constraint

  // 1. Leaf tables (no dependents)
  const milestoneLog = await prisma.milestoneLog.deleteMany();
  console.log(`  ✓ MilestoneLog: ${milestoneLog.count} dihapus`);

  const milestone = await prisma.milestone.deleteMany();
  console.log(`  ✓ Milestone: ${milestone.count} dihapus`);

  const milestoneTemplate = await prisma.milestoneTemplate.deleteMany();
  console.log(`  ✓ MilestoneTemplate: ${milestoneTemplate.count} dihapus`);

  const constructionProgress = await prisma.constructionProgress.deleteMany();
  console.log(`  ✓ ConstructionProgress: ${constructionProgress.count} dihapus`);

  // 2. Booking children
  const defects = await prisma.defectComplaint.deleteMany();
  console.log(`  ✓ DefectComplaint: ${defects.count} dihapus`);

  const kprDocs = await prisma.kprDocument.deleteMany();
  console.log(`  ✓ KprDocument: ${kprDocs.count} dihapus`);

  const kprApps = await prisma.kprApplication.deleteMany();
  console.log(`  ✓ KprApplication: ${kprApps.count} dihapus`);

  const commissions = await prisma.commission.deleteMany();
  console.log(`  ✓ Commission: ${commissions.count} dihapus`);

  const bast = await prisma.bast.deleteMany();
  console.log(`  ✓ Bast: ${bast.count} dihapus`);

  const legalDocs = await prisma.legalDocument.deleteMany();
  console.log(`  ✓ LegalDocument: ${legalDocs.count} dihapus`);

  const payments = await prisma.payment.deleteMany();
  console.log(`  ✓ Payment: ${payments.count} dihapus`);

  const invoices = await prisma.invoice.deleteMany();
  console.log(`  ✓ Invoice: ${invoices.count} dihapus`);

  const expenses = await prisma.expense.deleteMany();
  console.log(`  ✓ Expense: ${expenses.count} dihapus`);

  // 3. Booking itself
  const bookings = await prisma.booking.deleteMany();
  console.log(`  ✓ Booking: ${bookings.count} dihapus`);

  // 4. Activities (depends on Lead & User)
  const activities = await prisma.activity.deleteMany();
  console.log(`  ✓ Activity: ${activities.count} dihapus`);

  // 5. Leads
  const leads = await prisma.lead.deleteMany();
  console.log(`  ✓ Lead: ${leads.count} dihapus`);

  // 6. Units (depends on Project, PropertyType, Spk)
  const units = await prisma.unit.deleteMany();
  console.log(`  ✓ Unit: ${units.count} dihapus`);

  // 7. SPK
  const spks = await prisma.spk.deleteMany();
  console.log(`  ✓ Spk: ${spks.count} dihapus`);

  // 8. SitePlan
  const sitePlans = await prisma.sitePlan.deleteMany();
  console.log(`  ✓ SitePlan: ${sitePlans.count} dihapus`);

  // 9. PropertyType
  const propertyTypes = await prisma.propertyType.deleteMany();
  console.log(`  ✓ PropertyType: ${propertyTypes.count} dihapus`);

  // 10. Projects
  const projects = await prisma.project.deleteMany();
  console.log(`  ✓ Project: ${projects.count} dihapus`);

  // 11. KPR Settings
  const kprSettings = await prisma.kprSetting.deleteMany();
  console.log(`  ✓ KprSetting: ${kprSettings.count} dihapus`);

  // 12. Users — hapus semua KECUALI Owner
  const ownerRole = await prisma.role.findFirst({ where: { name: "Owner" } });
  if (ownerRole) {
    const deletedUsers = await prisma.user.deleteMany({
      where: { roleId: { not: ownerRole.id } },
    });
    console.log(`  ✓ User (non-Owner): ${deletedUsers.count} dihapus`);
  } else {
    console.log("  ⚠ Role 'Owner' tidak ditemukan. Tidak ada user yang dihapus.");
  }

  // 13. Roles — hapus semua kecuali Owner
  const deletedRoles = await prisma.role.deleteMany({
    where: { name: { not: "Owner" } },
  });
  console.log(`  ✓ Role (non-Owner): ${deletedRoles.count} dihapus`);

  // Verifikasi sisa data
  const remainingUsers = await prisma.user.findMany({ include: { role: true } });
  console.log("\n✅ Pembersihan selesai!");
  console.log(`   Sisa User: ${remainingUsers.length}`);
  remainingUsers.forEach((u) => {
    console.log(`   → ${u.email} (${u.role.name})`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Gagal membersihkan database:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
