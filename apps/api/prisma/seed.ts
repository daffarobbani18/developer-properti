import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearData() {
  await prisma.notification.deleteMany();
  await prisma.complaintMessage.deleteMany();
  await prisma.complaintTicket.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.legalDocument.deleteMany();
  await prisma.vendorInvoice.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.fieldIssue.deleteMany();
  await prisma.milestonePhoto.deleteMany();
  await prisma.unitMilestone.deleteMany();
  await prisma.milestoneTemplate.deleteMany();
  await prisma.saleTransaction.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.unit.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
}

async function seed() {
  await clearData();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "direktur@simdp.local",
        fullName: "Direktur Utama",
        role: "DIRECTOR",
        passwordHash,
        phone: "0811111111"
      }
    }),
    prisma.user.create({
      data: {
        email: "sales.manager@simdp.local",
        fullName: "Manajer Sales",
        role: "SALES_MANAGER",
        passwordHash,
        phone: "0811111112"
      }
    }),
    prisma.user.create({
      data: {
        email: "sales@simdp.local",
        fullName: "Sales Eksekutif",
        role: "SALES",
        passwordHash,
        phone: "0811111113"
      }
    }),
    prisma.user.create({
      data: {
        email: "finance.manager@simdp.local",
        fullName: "Manajer Finance",
        role: "FINANCE_MANAGER",
        passwordHash,
        phone: "0811111114"
      }
    }),
    prisma.user.create({
      data: {
        email: "finance@simdp.local",
        fullName: "Admin Finance",
        role: "FINANCE_ADMIN",
        passwordHash,
        phone: "0811111115"
      }
    }),
    prisma.user.create({
      data: {
        email: "pm@simdp.local",
        fullName: "Manajer Proyek",
        role: "PROJECT_MANAGER",
        passwordHash,
        phone: "0811111116"
      }
    }),
    prisma.user.create({
      data: {
        email: "engineer@simdp.local",
        fullName: "Site Engineer",
        role: "SITE_ENGINEER",
        passwordHash,
        phone: "0811111117"
      }
    }),
    prisma.user.create({
      data: {
        email: "legal@simdp.local",
        fullName: "Admin Legal",
        role: "LEGAL_ADMIN",
        passwordHash,
        phone: "0811111118"
      }
    }),
    prisma.user.create({
      data: {
        email: "customer@simdp.local",
        fullName: "Budi Santoso",
        role: "CUSTOMER",
        passwordHash,
        phone: "0812222333"
      }
    })
  ]);

  const userByEmail = Object.fromEntries(users.map((user) => [user.email, user]));

  const project = await prisma.project.create({
    data: {
      name: "Graha Mutiara Cikarang",
      slug: "graha-mutiara-cikarang",
      location: "Cikarang, Jawa Barat",
      description: "Perumahan modern dengan akses tol dan fasilitas lengkap"
    }
  });

  const units = await Promise.all([
    prisma.unit.create({
      data: {
        projectId: project.id,
        code: "A1",
        typeName: "Tipe 45/90",
        landArea: 90,
        buildingArea: 45,
        price: 550000000,
        status: "SOLD",
        progress: 72
      }
    }),
    prisma.unit.create({
      data: {
        projectId: project.id,
        code: "A2",
        typeName: "Tipe 45/90",
        landArea: 90,
        buildingArea: 45,
        price: 560000000,
        status: "BOOKED",
        progress: 41
      }
    }),
    prisma.unit.create({
      data: {
        projectId: project.id,
        code: "B1",
        typeName: "Tipe 60/120",
        landArea: 120,
        buildingArea: 60,
        price: 720000000,
        status: "AVAILABLE",
        progress: 0
      }
    }),
    prisma.unit.create({
      data: {
        projectId: project.id,
        code: "B2",
        typeName: "Tipe 60/120",
        landArea: 120,
        buildingArea: 60,
        price: 725000000,
        status: "INDENT",
        progress: 5
      }
    })
  ]);

  const templates = await Promise.all(
    ["Pondasi", "Struktur", "Dinding", "Atap", "MEP", "Finishing"].map((name, index) =>
      prisma.milestoneTemplate.create({ data: { name, orderNo: index + 1 } })
    )
  );

  for (const unit of units) {
    for (const template of templates) {
      const completedCount = unit.code === "A1" ? 4 : unit.code === "A2" ? 2 : 0;
      const status =
        template.orderNo <= completedCount
          ? "COMPLETED"
          : template.orderNo === completedCount + 1 && completedCount > 0
            ? "IN_PROGRESS"
            : "NOT_STARTED";

      await prisma.unitMilestone.create({
        data: {
          unitId: unit.id,
          milestoneTemplateId: template.id,
          status,
          targetDate: new Date(Date.now() + template.orderNo * 1000 * 60 * 60 * 24 * 14),
          actualDate: status === "COMPLETED" ? new Date() : null,
          updatedById: userByEmail["engineer@simdp.local"].id,
          note:
            status === "COMPLETED"
              ? `${template.name} selesai sesuai jadwal`
              : status === "IN_PROGRESS"
                ? `${template.name} sedang berjalan`
                : "Menunggu tahap sebelumnya selesai"
        }
      });
    }
  }

  const leadWebsite = await prisma.lead.create({
    data: {
      projectId: project.id,
      name: "Andi Pratama",
      phone: "0813123123",
      email: "andi@mail.com",
      source: "website",
      interestedUnitType: "Tipe 45/90",
      status: "NEW",
      assignedToId: userByEmail["sales@simdp.local"].id
    }
  });

  const leadPameran = await prisma.lead.create({
    data: {
      projectId: project.id,
      name: "Rina Putri",
      phone: "0813555666",
      source: "pameran",
      interestedUnitType: "Tipe 60/120",
      status: "FOLLOW_UP",
      assignedToId: userByEmail["sales@simdp.local"].id
    }
  });

  const soldLead = await prisma.lead.create({
    data: {
      projectId: project.id,
      name: "Budi Santoso",
      phone: "0812222333",
      email: "customer@simdp.local",
      source: "instagram_ads",
      interestedUnitType: "Tipe 45/90",
      status: "SPK",
      assignedToId: userByEmail["sales.manager@simdp.local"].id,
      unitId: units[0].id
    }
  });

  await prisma.leadActivity.createMany({
    data: [
      {
        leadId: leadWebsite.id,
        userId: userByEmail["sales@simdp.local"].id,
        activityType: "CALL",
        note: "Pengenalan produk dan jadwal follow-up"
      },
      {
        leadId: leadPameran.id,
        userId: userByEmail["sales@simdp.local"].id,
        activityType: "WHATSAPP",
        note: "Kirim brosur dan simulasi KPR"
      },
      {
        leadId: soldLead.id,
        userId: userByEmail["sales.manager@simdp.local"].id,
        activityType: "MEETING",
        note: "Finalisasi SPK dan jadwal akad"
      }
    ]
  });

  await prisma.saleTransaction.create({
    data: {
      leadId: soldLead.id,
      unitId: units[0].id,
      paymentScheme: "KPR",
      bookingFee: 10000000,
      kprStatus: "DISETUJUI",
      spkDocumentUrl: "https://files.simdp.local/spk-budi.pdf"
    }
  });

  const customerProfile = await prisma.customerProfile.create({
    data: {
      userId: userByEmail["customer@simdp.local"].id,
      unitId: units[0].id
    }
  });

  const paidInvoice = await prisma.invoice.create({
    data: {
      customerId: customerProfile.id,
      unitId: units[0].id,
      type: "DP",
      amount: 110000000,
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      status: "PAID",
      description: "DP Tahap 1"
    }
  });

  await prisma.payment.create({
    data: {
      invoiceId: paidInvoice.id,
      amount: 110000000,
      method: "TRANSFER",
      proofUrl: "https://files.simdp.local/payment-dp-budi.jpg",
      verifiedById: userByEmail["finance@simdp.local"].id
    }
  });

  await prisma.invoice.create({
    data: {
      customerId: customerProfile.id,
      unitId: units[0].id,
      type: "INSTALLMENT",
      amount: 7500000,
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      status: "UNPAID",
      description: "Cicilan ke-3"
    }
  });

  await prisma.legalDocument.createMany({
    data: [
      {
        projectId: project.id,
        category: "PBG",
        title: "PBG Proyek Graha Mutiara",
        number: "PBG-2026-001",
        issuedAt: new Date("2026-01-15"),
        expiresAt: new Date("2028-01-15"),
        status: "AVAILABLE",
        storageUrl: "https://files.simdp.local/pbg-graha.pdf"
      },
      {
        unitId: units[0].id,
        category: "AJB",
        title: "AJB Unit A1 - Budi Santoso",
        number: "AJB-A1-2026",
        issuedAt: new Date("2026-03-20"),
        status: "AVAILABLE",
        storageUrl: "https://files.simdp.local/ajb-a1.pdf"
      }
    ]
  });

  const vendor = await prisma.vendor.create({
    data: {
      name: "PT Beton Nusantara",
      contactPerson: "Surya Wijaya",
      phone: "0819000111",
      serviceType: "Pekerjaan Struktur",
      rating: 4
    }
  });

  const milestoneForInvoice = await prisma.unitMilestone.findFirstOrThrow({
    where: {
      unitId: units[1].id,
      status: "COMPLETED"
    }
  });

  await prisma.vendorInvoice.createMany({
    data: [
      {
        vendorId: vendor.id,
        projectId: project.id,
        milestoneId: milestoneForInvoice.id,
        amount: 42000000,
        description: "Termin pekerjaan struktur blok A",
        status: "PENDING",
        submittedById: userByEmail["pm@simdp.local"].id
      },
      {
        vendorId: vendor.id,
        projectId: project.id,
        milestoneId: milestoneForInvoice.id,
        amount: 61000000,
        description: "Termin finishing tahap 1",
        status: "APPROVED",
        submittedById: userByEmail["pm@simdp.local"].id,
        approvedById: userByEmail["direktur@simdp.local"].id,
        approvedAt: new Date()
      }
    ]
  });

  await prisma.fieldIssue.create({
    data: {
      projectId: project.id,
      unitId: units[1].id,
      title: "Keterlambatan material atap",
      category: "Jadwal Molor",
      urgency: "HIGH",
      description: "Material atap datang terlambat 2 hari, perlu reposisi jadwal kerja.",
      status: "IN_PROGRESS",
      reportedById: userByEmail["engineer@simdp.local"].id,
      assigneeId: userByEmail["pm@simdp.local"].id
    }
  });

  const complaint = await prisma.complaintTicket.create({
    data: {
      customerId: customerProfile.id,
      category: "Progres",
      subject: "Mohon update estimasi serah terima",
      description: "Ingin memastikan estimasi serah terima unit A1 sesuai rencana.",
      status: "IN_PROGRESS"
    }
  });

  await prisma.complaintMessage.createMany({
    data: [
      {
        ticketId: complaint.id,
        senderId: userByEmail["customer@simdp.local"].id,
        message: "Mohon diinformasikan estimasi tanggal serah terima terbaru."
      },
      {
        ticketId: complaint.id,
        senderId: userByEmail["sales.manager@simdp.local"].id,
        message: "Estimasi serah terima saat ini minggu kedua Juni 2026."
      }
    ]
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: userByEmail["sales@simdp.local"].id,
        title: "Leads Baru dari Website",
        body: "Lead Andi Pratama masuk dari landing page.",
        type: "LEAD"
      },
      {
        userId: userByEmail["finance.manager@simdp.local"].id,
        title: "Approval Termin Menunggu",
        body: "Tagihan termin Rp42.000.000 menunggu approval.",
        type: "VENDOR_APPROVAL"
      },
      {
        userId: userByEmail["customer@simdp.local"].id,
        title: "Update Progres Unit",
        body: "Milestone atap unit A1 telah selesai.",
        type: "PROGRESS"
      }
    ]
  });

  console.log("Seed completed.");
  console.table(
    users.map((user) => ({
      email: user.email,
      role: user.role,
      password: "Password123!"
    }))
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
