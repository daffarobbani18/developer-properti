import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  console.log("Mencari role Customer...");
  const customerRole = await prisma.role.findFirst({ where: { name: 'Customer' } });
  if (!customerRole) {
    console.log('Role Customer not found');
    return;
  }
  
  const leads = await prisma.lead.findMany({ where: { email: { not: null } } });
  const passwordHash = await bcrypt.hash('password123', 10);
  
  for (const lead of leads) {
    if (!lead.email) continue;
    const existingUser = await prisma.user.findUnique({ where: { email: lead.email } });
    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: lead.email,
          password: passwordHash,
          roleId: customerRole.id
        }
      });
      console.log('Created user for ' + lead.email);
    }
  }
}

run().catch(console.error).finally(() => prisma.$disconnect());
