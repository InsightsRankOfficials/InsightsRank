import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding development database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Create or update default development organization
  const organization = await prisma.organization.upsert({
    where: { slug: 'insightsrank-ops' },
    update: {},
    create: {
      name: 'InsightsRank Operations',
      slug: 'insightsrank-ops',
      status: 'ACTIVE',
    },
  });

  console.log(`Organization created/found: ${organization.name} (${organization.id})`);

  // Create default owner user
  const owner = await prisma.user.upsert({
    where: { email: 'ops@insightsrank.com' },
    update: {
      organizationId: organization.id,
      passwordHash,
      role: Role.OWNER,
    },
    create: {
      organizationId: organization.id,
      email: 'ops@insightsrank.com',
      passwordHash,
      firstName: 'InsightsRank',
      lastName: 'Operations',
      role: Role.OWNER,
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log(`Owner user created/found: ${owner.email} (${owner.id})`);

  // Create default admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@insightsrank.com' },
    update: {
      organizationId: organization.id,
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      organizationId: organization.id,
      email: 'admin@insightsrank.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: Role.ADMIN,
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log(`Admin user created/found: ${admin.email} (${admin.id})`);

  // Create default member user
  const member = await prisma.user.upsert({
    where: { email: 'member@insightsrank.com' },
    update: {
      organizationId: organization.id,
      passwordHash,
      role: Role.MEMBER,
    },
    create: {
      organizationId: organization.id,
      email: 'member@insightsrank.com',
      passwordHash,
      firstName: 'Member',
      lastName: 'User',
      role: Role.MEMBER,
      emailVerified: true,
      status: 'ACTIVE',
    },
  });

  console.log(`Member user created/found: ${member.email} (${member.id})`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
