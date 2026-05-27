import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.upsert({
    where: { id: "PRJ001" },
    update: {},
    create: {
      id: "PRJ001",
      name: "Griya Persada",
      location: "Jakarta Selatan",
      totalUnits: 150,
      targetSelesai: new Date("2026-12-31"),
      status: "konstruksi",
    },
  });
  console.log("Database seeded with default project (PRJ001)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
