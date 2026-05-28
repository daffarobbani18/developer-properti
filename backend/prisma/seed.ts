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

  console.log("Menambahkan data baru...");

  // 1. Roles
  const roles = [
    "Superadmin",
    "Director",
    "Admin Inventory",
    "Sales",
    "Finance & Accounting",
    "Project Manager",
    "Tim Legal",
    "HR"
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
    { email: "sales@erp.com", roleId: roleMap["Sales"] },
    { email: "finance@erp.com", roleId: roleMap["Finance & Accounting"] },
    { email: "pm@erp.com", roleId: roleMap["Project Manager"] },
    { email: "legal@erp.com", roleId: roleMap["Tim Legal"] }
  ];

  const userMap: Record<string, string> = {};
  for (const u of users) {
    const user = await prisma.user.create({
      data: {
        email: u.email,
        password: passwordHash,
        roleId: u.roleId,
      },
    });
    // Simpan id untuk keperluan relation (misal Sales atau PM)
    userMap[u.email] = user.id;
  }

  // 3. Project
  const project = await prisma.project.create({
    data: {
      name: "Perumahan Indah Asri",
      location: "Kawasan Bogor, Jawa Barat",
      totalUnits: 50,
      targetSelesai: new Date("2026-12-31"),
      status: "konstruksi",
    },
  });

  // 4. Property Types
  const type36 = await prisma.propertyType.create({
    data: {
      projectId: project.id,
      name: "Tipe 36/72 (Minimalis)",
      luasTanah: 72,
      luasBangunan: 36,
      bedrooms: 2,
      bathrooms: 1,
      price: 450000000,
      kamarTidur: 2,
      kamarMandi: 1,
      basePrice: 450000000,
    },
  });

  const type45 = await prisma.propertyType.create({
    data: {
      projectId: project.id,
      name: "Tipe 45/90 (Eksklusif)",
      luasTanah: 90,
      luasBangunan: 45,
      bedrooms: 3,
      bathrooms: 2,
      price: 650000000,
      kamarTidur: 3,
      kamarMandi: 2,
      basePrice: 650000000,
    },
  });

  // 5. Units (Kavling)
  const unitsData = [
    { blok: "A", nomor: "01", propertyTypeId: type36.id, kawasan: "Boulevard", statusPenjualan: "Tersedia", status: "Tersedia", price: 450000000, totalPrice: 450000000 },
    { blok: "A", nomor: "02", propertyTypeId: type36.id, kawasan: "Boulevard", statusPenjualan: "Tersedia", status: "Tersedia", price: 450000000, totalPrice: 450000000 },
    { blok: "B", nomor: "01", propertyTypeId: type45.id, kawasan: "Premium", statusPenjualan: "Terjual", status: "Terjual", price: 650000000, totalPrice: 650000000 },
    { blok: "B", nomor: "02", propertyTypeId: type45.id, kawasan: "Premium", statusPenjualan: "Booked", status: "Booked", price: 650000000, totalPrice: 650000000 },
  ];

  const createdUnits = [];
  for (const u of unitsData) {
    const unit = await prisma.unit.create({
      data: {
        projectId: project.id,
        propertyTypeId: u.propertyTypeId,
        blok: u.blok,
        nomor: u.nomor,
        nomorUnit: `${u.blok}-${u.nomor}`,
        kawasan: u.kawasan,
        statusPenjualan: u.statusPenjualan,
        status: u.status,
        price: u.price,
        totalPrice: u.totalPrice,
      },
    });
    createdUnits.push(unit);
  }

  // 6. Lead & Booking
  const lead1 = await prisma.lead.create({
    data: {
      name: "Budi Santoso",
      phone: "08123456789",
      email: "budi@example.com",
      source: "Instagram",
      statusCrm: "Booking",
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      name: "Siti Aminah",
      phone: "08987654321",
      source: "Brosur",
      statusCrm: "Booking",
    },
  });

  // B-01 Terjual (Approved)
  const booking1 = await prisma.booking.create({
    data: {
      leadId: lead1.id,
      unitId: createdUnits[2].id, // B-01
      bookingFee: 5000000,
      paymentMethod: "Transfer Bank BCA",
      status: "Approved",
      verifiedAt: new Date(),
    },
  });

  // B-02 Booked (Pending)
  const booking2 = await prisma.booking.create({
    data: {
      leadId: lead2.id,
      unitId: createdUnits[3].id, // B-02
      bookingFee: 5000000,
      paymentMethod: "Cash",
      status: "Menunggu Verifikasi",
    },
  });

  // 7. Invoice & Payment (untuk B-01 yang sudah Approved)
  const invoiceDP = await prisma.invoice.create({
    data: {
      bookingId: booking1.id,
      invoiceNumber: "INV-DP-001",
      invoiceType: "DP",
      amountDue: 100000000,
      dueDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 hari
      status: "Paid",
    },
  });

  await prisma.payment.create({
    data: {
      invoiceId: invoiceDP.id,
      amountPaid: 100000000,
      paymentDate: new Date(),
      paymentMethod: "Transfer Bank Mandiri",
      referenceNumber: "TRX-998877",
      status: "Verified",
    },
  });

  console.log("Seeding selesai!");
  console.log("--- Akun Dummy ---");
  console.log("Email: director@erp.com | Password: password123 (Dashboard, Approve Komisi)");
  console.log("Email: sales@erp.com | Password: password123 (Lead, Booking, Kalkulasi Komisi)");
  console.log("Email: finance@erp.com | Password: password123 (Approve Booking, Invoice, Payment, Disburse Komisi)");
  console.log("Email: inventory@erp.com | Password: password123 (Project, Unit)");
  console.log("Email: pm@erp.com | Password: password123 (Construction Progress)");
  console.log("Email: legal@erp.com | Password: password123 (Legal Docs, BAST)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
