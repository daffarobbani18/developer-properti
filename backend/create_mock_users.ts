import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Mencari roles...");
  const roles = await prisma.role.findMany();
  
  const roleMap: Record<string, string> = {};
  for (const r of roles) {
    roleMap[r.name] = r.id;
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  const usersToAdd = [
    {
      email: "spv@erp.com",
      name: "Rizky Wahyudi",
      role: "Pengawas Lapangan"
    },
    {
      email: "pm@erp.com",
      name: "Dimas Satria",
      role: "Project Manager"
    },
    {
      email: "customer@erp.com",
      name: "Alya Puspita",
      role: "Customer"
    }
  ];

  for (const u of usersToAdd) {
    const roleId = roleMap[u.role];
    if (!roleId) {
      console.log(`Role ${u.role} tidak ditemukan!`);
      continue;
    }

    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: u.email,
          password: passwordHash,
          roleId: roleId,
        }
      });
      console.log(`User ${u.email} berhasil dibuat.`);
    } else {
      console.log(`User ${u.email} sudah ada.`);
    }
  }

  console.log("Mock users berhasil disiapkan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
