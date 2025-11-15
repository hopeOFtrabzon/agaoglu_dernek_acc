import 'dotenv/config';

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const TEST_USER = {
  email: 'testuser@example.com',
  username: 'testuser',
  password: 'testpass123',
  firstName: 'Test',
  lastName: 'User',
};

async function main() {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
  const existingUser = await prisma.user.findUnique({ where: { email: TEST_USER.email } });
  if (existingUser) {
    console.log('Test user already exists.');
    return;
  }

  const hashedPassword = await bcrypt.hash(TEST_USER.password, saltRounds);
  await prisma.user.create({
    data: {
      email: TEST_USER.email,
      username: TEST_USER.username,
      password: hashedPassword,
      firstName: TEST_USER.firstName,
      lastName: TEST_USER.lastName,
    },
  });
  console.log('Seeded test user.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
