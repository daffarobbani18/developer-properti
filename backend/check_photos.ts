import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const milestones = await prisma.milestone.findMany({
    where: {
      photoUrls: {
        isEmpty: false
      }
    }
  });
  
  console.log(`Found ${milestones.length} milestones with photos`);
  milestones.forEach(m => {
    console.log(`- ${m.name}:`, m.photoUrls.map(u => u.substring(0, 50) + "..."));
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
