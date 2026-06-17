import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const roles = await prisma.role.findMany();
  
  const spvRole = roles.find(r => r.name === 'Pengawas Lapangan');
  const pmRole = roles.find(r => r.name === 'Project Manager');
  const customerRole = roles.find(r => r.name === 'Customer');
  
  const password = await bcrypt.hash('password123', 10);
  
  if (spvRole) {
    await prisma.user.upsert({
      where: { email: 'spv@erp.com' },
      update: {},
      create: { email: 'spv@erp.com', password, roleId: spvRole.id }
    });
    console.log('Created spv@erp.com');
  }
  
  if (pmRole) {
    await prisma.user.upsert({
      where: { email: 'pm@erp.com' },
      update: {},
      create: { email: 'pm@erp.com', password, roleId: pmRole.id }
    });
    console.log('Created pm@erp.com');
  }
  
  if (customerRole) {
    await prisma.user.upsert({
      where: { email: 'customer@erp.com' },
      update: {},
      create: { email: 'customer@erp.com', password, roleId: customerRole.id }
    });
    console.log('Created customer@erp.com');
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
