import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function reset() {
  console.log("🛠️  Fixing Admin Account...");

  const email = 'admin@blog.com';
  const password = 'password123';

  // 1. Delete existing admin if they exist (to clear bad data)
  try {
    await prisma.user.delete({ where: { email } });
    console.log("🗑️  Old admin deleted.");
  } catch (e) {
    // It's okay if user didn't exist
  }

  // 2. Create the user fresh
  const hashedPassword = await bcrypt.hash(password, 10);
  
  await prisma.user.create({
    data: { 
      email, 
      password: hashedPassword, 
      name: "Admin User" 
    },
  });

  console.log("\n✅ ADMIN RESET SUCCESSFUL");
  console.log("--------------------------------");
  console.log("📧 Email:    " + email);
  console.log("🔑 Password: " + password);
  console.log("--------------------------------\n");
}

reset()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());