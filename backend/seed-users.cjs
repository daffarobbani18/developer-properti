const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function addTestUsers() {
  const roles = await prisma.role.findMany();
  
  const siteEngineerRole = roles.find(r => r.name === 'Pengawas Lapangan');
  const projectManagerRole = roles.find(r => r.name === 'Project Manager');
  const customerRole = roles.find(r => r.name === 'Customer');

  const passwordHash = await bcrypt.hash("password123", 10);

  if (siteEngineerRole) {
    await prisma.user.upsert({
      where: { email: "andi.site@developer.com" },
      update: {},
      create: {
        email: "andi.site@developer.com",
        password: passwordHash,
        roleId: siteEngineerRole.id
      }
    });
    console.log("Created Site Engineer: andi.site@developer.com");
  }

  if (projectManagerRole) {
    await prisma.user.upsert({
      where: { email: "pm@developer.com" },
      update: {},
      create: {
        email: "pm@developer.com",
        password: passwordHash,
        roleId: projectManagerRole.id
      }
    });
    console.log("Created Project Manager: pm@developer.com");
  }

  if (customerRole) {
    await prisma.user.upsert({
      where: { email: "budi.cust@developer.com" },
      update: {},
      create: {
        email: "budi.cust@developer.com",
        password: passwordHash,
        roleId: customerRole.id
      }
    });
    console.log("Created Customer: budi.cust@developer.com");
  }

  // Seeding some dummy data for /mobile/field/projects, etc?
  // Actually, creating a project to test endpoints
  const project = await prisma.project.create({
    data: {
      name: "Cluster Magnolia",
      location: "Cibubur",
      totalUnits: 150,
      status: "In Progress"
    }
  });

  console.log("Created test project.");
}

addTestUsers().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
