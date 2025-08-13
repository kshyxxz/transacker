#!/usr/bin/env node
import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { config } from "dotenv";
import * as schema from "./shared/schema.ts";

config();

async function setupDatabase() {
  console.log("Setting up database...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool, { schema });

  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./migrations" });
    console.log("✅ Database setup complete!");
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    process.exit(1);
  }
}

setupDatabase().catch(console.error);
