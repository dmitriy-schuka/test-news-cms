import { ADMIN_SEED } from '~/constants/db';
import { prisma } from '~/db/prisma.server';
import { hashPassword } from '~/utils/hash.server';

async function seed() {
    const admin = await prisma.user.findUnique({
        where: { email: ADMIN_SEED.email },
    });

    if (!admin) {
        await prisma.user.create({
            data: {
                firstName: ADMIN_SEED.firstName,
                lastName: ADMIN_SEED.lastName,
                email: ADMIN_SEED.email,
                password: await hashPassword(ADMIN_SEED.defaultPassword),
                role: ADMIN_SEED.role,
            },
        });
    }

    console.log('Admin user seeded.');
}

seed()
    .then(() => {
        console.log('Seed created');
    })
    .catch((e) => {
        console.error('Error creating seed: ', e);
        process.exit(1);
    })
    .finally(async () => await prisma.$disconnect());
