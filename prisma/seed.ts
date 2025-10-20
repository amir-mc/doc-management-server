import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // ایجاد کاربر ادمین
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { nationalCode: '1234567890' },
    update: {},
    create: {
      nationalCode: '1234567890',
      firstName: 'مدیر',
      lastName: 'سیستم',
      fatherName: 'پدر',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', {
    id: admin.id,
    nationalCode: admin.nationalCode,
    role: admin.role
  });

  // ایجاد یک کاربر عادی نمونه
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { nationalCode: '0987654321' },
    update: {},
    create: {
      nationalCode: '0987654321',
      firstName: 'امین',
      lastName: 'رضایی',
      fatherName: 'محمد',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('Regular user created:', {
    id: user.id,
    nationalCode: user.nationalCode,
    role: user.role
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });