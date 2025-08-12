import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "credit" or "debit"
  subType: text("sub_type").notNull(), // "Weekly", "240💎", "esewa", "bank", etc.
  index: integer("index"), // only for credit transactions
  rate: real("rate"), // only for credit transactions
  amount: real("amount").notNull(),
  profit: real("profit"), // calculated for credit transactions
  quantity: integer("quantity"), // only for debit transactions
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
