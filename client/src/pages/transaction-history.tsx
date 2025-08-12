import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Search, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Transaction } from "@shared/schema";
import FloatingActionButton from "@/components/ui/floating-action-button";

export default function TransactionHistory() {
  const [searchDate, setSearchDate] = useState("");

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  // Filter transactions based on search date
  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchDate) return true;
    const transactionDate = new Date(transaction.createdAt).toISOString().split('T')[0];
    return transactionDate === searchDate;
  });

  // Calculate monthly stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.createdAt);
    return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
  });

  const totalProfit = monthlyTransactions
    .filter((t) => t.type === "credit" && t.profit)
    .reduce((sum, t) => sum + (t.profit || 0), 0);

  const formatAmount = (amount: number) => {
    return `NPR ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-deep-charcoal min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <div className="text-pure-white">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-deep-charcoal min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 glass-effect border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-pure-white/70 hover:text-pure-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-pure-white">Transaction History</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-pure-white/70 hover:text-pure-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Date Filter */}
        <div className="flex space-x-2">
          <Input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="flex-1 bg-dark-gray border-white/20 rounded-lg text-pure-white"
          />
          <Button variant="outline" size="icon" className="bg-dark-gray border-white/20 text-pure-white/70 hover:text-pure-white">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-6 py-4">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-pure-white/60 py-12">
            <p>No transactions found</p>
            {searchDate && (
              <p className="text-sm mt-2">Try adjusting your date filter</p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`transaction-row rounded-xl p-4 border border-white/10 ${
                  index % 2 === 0 ? 'bg-dark-gray/50' : 'bg-dark-gray/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          transaction.type === "credit"
                            ? "bg-success/20 text-success"
                            : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {transaction.type.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-pure-white">
                        {transaction.subType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-pure-white/60">
                        {formatDate(transaction.createdAt.toString())}
                      </span>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-pure-white">
                          {formatAmount(transaction.amount)}
                        </div>
                        {transaction.type === "credit" && transaction.profit && (
                          <div className="text-xs text-success">
                            +{formatAmount(transaction.profit)} profit
                          </div>
                        )}
                        {transaction.type === "debit" && transaction.quantity && (
                          <div className="text-xs text-pure-white/40">
                            Qty: {transaction.quantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="px-6 py-4">
        <div className="bg-dark-gray/50 rounded-xl p-4 border border-white/10">
          <h3 className="text-sm font-medium text-pure-white/80 mb-3">This Month</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-pure-white/60">Total Profit</div>
              <div className="text-lg font-semibold text-success">
                {formatAmount(totalProfit)}
              </div>
            </div>
            <div>
              <div className="text-xs text-pure-white/60">Transactions</div>
              <div className="text-lg font-semibold text-pure-white">
                {monthlyTransactions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
