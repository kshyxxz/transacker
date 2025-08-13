import { db } from "./db";
import { transactions, type Transaction, type InsertTransaction } from "@shared/schema";
import { eq } from "drizzle-orm";

export class DbStorage {
  async getTransaction(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0];
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const allTransactions = await db.select().from(transactions);
    return allTransactions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(insertTransaction).returning();
    return result[0];
  }

  async deleteTransaction(id: string): Promise<boolean> {
    const result = await db.delete(transactions).where(eq(transactions.id, id));
    // Check if any rows were affected
    const check = await db.select().from(transactions).where(eq(transactions.id, id));
    return check.length === 0;
  }

  async updateTransaction(id: string, updates: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db
      .update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return result[0];
  }
}

export const dbStorage = new DbStorage();
