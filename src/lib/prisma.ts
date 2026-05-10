import { PrismaClient } from "../generated/prisma/client";
<<<<<<< HEAD
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbPath = path.resolve(process.cwd(), "dev.db");

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
=======
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

export { prisma };

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
>>>>>>> c032f8c695f8c8adb1ed3ee309ad1b59767e9b95
