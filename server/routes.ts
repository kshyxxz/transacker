import type { Express } from "express";
import { createServer, type Server } from "http";
import { dbStorage } from "./dbStorage";
import { insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await dbStorage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get a single transaction
  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await dbStorage.getTransaction(id);
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    } catch (error) {
      console.error("Error fetching transaction:", error);
      res.status(500).json({ message: "Failed to fetch transaction" });
    }
  });

  // Create a new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await dbStorage.createTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        console.error("Error creating transaction:", error);
        res.status(500).json({ message: "Failed to create transaction" });
      }
    }
  });

  // Update a transaction
  app.put("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertTransactionSchema.partial().parse(req.body);
      const transaction = await dbStorage.updateTransaction(id, validatedData);
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      } else {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: "Failed to update transaction" });
      }
    }
  });

  // Delete a transaction
  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await dbStorage.deleteTransaction(id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Transaction not found" });
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      res.status(500).json({ message: "Failed to delete transaction" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
