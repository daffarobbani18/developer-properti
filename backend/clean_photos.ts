import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const milestones = await prisma.milestone.findMany({
    where: { photoUrls: { isEmpty: false } }
  });
  
  let mCount = 0;
  for (const m of milestones) {
    if (m.photoUrls.some(u => u.includes('blob:'))) {
      await prisma.milestone.update({
        where: { id: m.id },
        data: { photoUrls: m.photoUrls.filter(u => !u.includes('blob:')) }
      });
      mCount++;
    }
  }
  
  const logs = await prisma.milestoneLog.findMany({
    where: { photoUrls: { isEmpty: false } }
  });
  
  let lCount = 0;
  for (const l of logs) {
    if (l.photoUrls.some(u => u.includes('blob:'))) {
      await prisma.milestoneLog.update({
        where: { id: l.id },
        data: { photoUrls: l.photoUrls.filter(u => !u.includes('blob:')) }
      });
      lCount++;
    }
  }

  console.log(`Cleared blob URLs from ${mCount} milestones and ${lCount} logs`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
