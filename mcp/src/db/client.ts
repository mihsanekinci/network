import { PrismaClient } from "@prisma/client";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NetWork SQLite veritabanının mutlak yolu (server/prisma/dev.db)
const defaultDbPath = path.resolve(__dirname, "../../../server/prisma/dev.db");
const databaseUrl = process.env.DATABASE_URL || `file:${defaultDbPath}`;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});
