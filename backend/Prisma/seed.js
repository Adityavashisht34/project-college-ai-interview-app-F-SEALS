import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@user.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@user.com',
      password: '$2a$10$O0b9Dqm2n4JwHqz9uG0zUO7nybZ8T1kQJgD4Q8u5o6GQ9m7hV0qpi', // bcrypt hash for 'password'
      preferences: { topics: ['JavaScript', 'DBMS'], difficulty: 'Easy' }
    }
  });

  console.log('Seeded user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
