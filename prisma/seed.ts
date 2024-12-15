import { prisma } from "~/db/db.server";

async function seed() {
  await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@gmail.com',
      password: 'admin_hashed_password_here',
    },
  });
}

seed()
  .then(() => {
    console.log('Seed created')
  })
  .catch((e) => {
    console.error('Error creating seed: ', e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());