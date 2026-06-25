const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.findMany();
  console.log(roles);
  const hasPengawas = roles.find(r => r.name === 'Pengawas Lapangan' || r.name === 'PENGAWAS');
  if (!hasPengawas) {
    console.log('Creating PENGAWAS role...');
    await prisma.role.create({ data: { name: 'PENGAWAS' } });
    console.log('Created!');
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
