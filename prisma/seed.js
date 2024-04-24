const prismaClient = require('@prisma/client');
const bycrpt = require('bcrypt');

const prisma = new prismaClient.PrismaClient();
async function main() {
  const users = await prisma.user.count();
  if (!!users) {
    console.log('Already Seeded');
    return;
  }

  const hashPassword = await bycrpt.hash(
    process.env.DEFAULT_PASSWORD ?? 'password',
    5,
  );

  const alice = await prisma.user.create({
    data: {
      username: process.env.DEFAULT_USERNAME ?? 'root',
      role: 'ADMIN',
      password: hashPassword,
    },
  });

  console.log({ alice });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    console.log('exiting');
    await prisma.$disconnect();
    process.exit(1);
  });
