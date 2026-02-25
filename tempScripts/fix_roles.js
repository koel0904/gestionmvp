import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Fixing user roles in database...");
  const result = await prisma.user.updateMany({
    where: {
      role: {
        notIn: ["admin", "user"],
      },
    },
    data: {
      role: "user",
    },
  });

  console.log(`Updated ${result.count} users to strictly use 'user' role.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
