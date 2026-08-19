import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  const email = "recruiter@test.com";
  const password = "Test@12345";

  // =====================================================
  // HASH PASSWORD
  // =====================================================

  const hashedPassword = await bcrypt.hash(password, 10);

  // =====================================================
  // CREATE / UPDATE RECRUITER USER
  // =====================================================

  const recruiter = await prisma.user.upsert({
    where: {
      email,
    },

    update: {
      name: "Test Recruiter",
      password: hashedPassword,
      role: "RECRUITER",
    },

    create: {
      name: "Test Recruiter",
      email,
      password: hashedPassword,
      role: "RECRUITER",
    },
  });

  console.log("✅ Recruiter user ready");
  console.log("Email:", recruiter.email);
  console.log("User ID:", recruiter.id);

  // =====================================================
  // CREATE / UPDATE RECRUITER PROFILE
  // =====================================================

  const recruiterProfile =
    await prisma.recruiterProfile.upsert({
      where: {
        userId: recruiter.id,
      },

      update: {
        companyName: "DevHire Technologies",
        companyUrl: "https://devhire.example.com",
        description:
          "Technology company focused on software development and AI-powered hiring solutions.",
      },

      create: {
        userId: recruiter.id,
        companyName: "DevHire Technologies",
        companyUrl: "https://devhire.example.com",
        description:
          "Technology company focused on software development and AI-powered hiring solutions.",
      },
    });

  console.log("✅ Recruiter profile ready");
  console.log(
    "Recruiter Profile ID:",
    recruiterProfile.id
  );

  // =====================================================
  // COMPLETE
  // =====================================================

  console.log("");
  console.log("========================================");
  console.log("       DEVHIRE RECRUITER ACCOUNT");
  console.log("========================================");
  console.log("Email    :", email);
  console.log("Password :", password);
  console.log("Role     :", recruiter.role);
  console.log("User ID  :", recruiter.id);
  console.log("Profile  :", recruiterProfile.id);
  console.log("Company  :", recruiterProfile.companyName);
  console.log("========================================");
  console.log("");
  console.log("🎉 Recruiter seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ SEED FAILED");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });