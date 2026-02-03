import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@blog.com'; // <--- EASY TO REMEMBER
  const password = 'password123'; // <--- EASY TO REMEMBER
  
  console.log(`\n🔍 Checking if ${email} exists...`);

  // 1. Check if user exists so we don't crash if you run this twice
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log("✨ Creating new Admin user...");
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prisma.user.create({
      data: { email, password: hashedPassword, name: "Admin" },
    });
    console.log("✅ User created successfully.");
  } else {
    console.log("ℹ️  User already exists. You can login now.");
  }

  console.log("\n🔑 LOGIN CREDENTIALS (USE THESE):");
  console.log("=================================");
  console.log("Email:    " + email);
  console.log("Password: " + password);
  console.log("=================================\n");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());