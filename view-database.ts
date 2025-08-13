import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { transactions } from "./shared/schema";
import { config } from "dotenv";

config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function viewData() {
  try {
    console.log("🔍 Fetching all transactions...\n");
    
    const allTransactions = await db.select().from(transactions);
    
    if (allTransactions.length === 0) {
      console.log("📭 No transactions found in database");
    } else {
      console.log(`📊 Found ${allTransactions.length} transactions:\n`);
      
      allTransactions.forEach((transaction, index) => {
        console.log(`--- Transaction ${index + 1} ---`);
        console.log(`ID: ${transaction.id}`);
        console.log(`Type: ${transaction.type}`);
        console.log(`Sub Type: ${transaction.subType}`);
        console.log(`Amount: ${transaction.amount}`);
        console.log(`Created: ${transaction.createdAt}`);
        
        if (transaction.type === 'credit') {
          console.log(`Index: ${transaction.index}`);
          console.log(`Rate: ${transaction.rate}`);
          console.log(`Profit: ${transaction.profit}`);
        } else if (transaction.type === 'debit') {
          console.log(`Quantity: ${transaction.quantity}`);
        }
        
        console.log(""); // Empty line for readability
      });
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
}

viewData();
