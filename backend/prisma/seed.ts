import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses pembersihan database...");
  
  // Hapus semua data dari yang child paling bawah hingga parent
  await prisma.defectComplaint.deleteMany();
  await prisma.milestoneLog.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.milestoneTemplate.deleteMany();
  await prisma.kprDocument.deleteMany();
  await prisma.kprApplication.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.bast.deleteMany();
  await prisma.legalDocument.deleteMany();
  await prisma.constructionProgress.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.spk.deleteMany();
  await prisma.propertyType.deleteMany();
  await prisma.sitePlan.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("Database berhasil dibersihkan!");

  console.log("Membuat Role...");

  // 1. Roles
  const roleNames = [
    "Superadmin",
    "Owner",
    "Admin Inventory",
    "Sales & Marketing",
    "Finance & Accounting",
    "Project Manager",
    "Tim Legal",
    "Pengawas Lapangan",
    "Customer"
  ];

  const roleMap: Record<string, string> = {};
  for (const roleName of roleNames) {
    const role = await prisma.role.create({
      data: { name: roleName },
    });
    roleMap[roleName] = role.id;
  }

  // 2. User Owner
  console.log("Membuat User Owner...");
  const passwordHash = await bcrypt.hash("password123", 10);
  
  await prisma.user.create({
    data: {
      email: "owner@erp.com",
      password: passwordHash,
      roleId: roleMap["Owner"],
    },
  });

  console.log("--- SEEDING SELESAI ---");
  console.log("Semua data telah dihapus kecuali User Owner.");
  console.log("Email Owner       : owner@erp.com");
  console.log("Password Owner    : password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
