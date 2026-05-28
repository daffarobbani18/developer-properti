import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Menghapus data lama...");
  // Hapus dari hirarki paling bawah agar tidak kena Foreign Key constraint
  await prisma.commission.deleteMany();
  await prisma.bast.deleteMany();
  await prisma.legalDocument.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.constructionProgress.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.propertyType.deleteMany();
  await prisma.sitePlan.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log("Menambahkan data akun dummy baru...");

  // 1. Roles
  const roles = [
    "Superadmin",
    "Director",
    "Admin Inventory",
    "Sales & Marketing",
    "Finance & Accounting",
    "Project Manager",
    "Tim Legal",
    "Pengawas Lapangan"
  ];

  const roleMap: Record<string, string> = {};
  for (const roleName of roles) {
    const role = await prisma.role.create({
      data: { name: roleName },
    });
    roleMap[roleName] = role.id;
  }

  // 2. Users
  const passwordHash = await bcrypt.hash("password123", 10);
  
  const users = [
    { email: "superadmin@erp.com", roleId: roleMap["Superadmin"] },
    { email: "director@erp.com", roleId: roleMap["Director"] },
    { email: "inventory@erp.com", roleId: roleMap["Admin Inventory"] },
    { email: "sales@erp.com", roleId: roleMap["Sales & Marketing"] },
    { email: "finance@erp.com", roleId: roleMap["Finance & Accounting"] },
    { email: "pm@erp.com", roleId: roleMap["Project Manager"] },
    { email: "legal@erp.com", roleId: roleMap["Tim Legal"] },
    { email: "spv@erp.com", roleId: roleMap["Pengawas Lapangan"] }
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        email: u.email,
        password: passwordHash,
        roleId: u.roleId,
      },
    });
  }

  console.log("Seeding akun selesai!");
  console.log("Semua data transaksi (Lead, Booking, Invoice, Unit) telah dikosongkan.");
  console.log("--- Akun Dummy Tersedia ---");
  console.log("Email: director@erp.com | Password: password123");
  console.log("Email: sales@erp.com | Password: password123");
  console.log("Email: finance@erp.com | Password: password123");
  console.log("Email: inventory@erp.com | Password: password123");
  console.log("Email: pm@erp.com | Password: password123");
  console.log("Email: legal@erp.com | Password: password123");
  console.log("Email: spv@erp.com | Password: password123");
  console.log("Email: superadmin@erp.com | Password: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
