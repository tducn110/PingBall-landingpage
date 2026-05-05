import { defineConfig } from "drizzle-kit";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgresql://postgres.fwujartttltlmtojybuz:DQseFZzYIgLMllVM@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres";

export default defineConfig({
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
});
