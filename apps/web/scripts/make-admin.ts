import { config } from "dotenv";
config({ path: "./.env.local" });

import { prisma } from "../src/server/db";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: pnpm -C apps/web tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
    select: { email: true, role: true },
  });

  console.log(`✅ Updated: ${user.email} → ${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
