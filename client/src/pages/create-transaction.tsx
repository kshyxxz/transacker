import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { History, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertTransactionSchema, type InsertTransaction } from "@shared/schema";
import { z } from "zod";

const creditTypes = [
  { value: "161", display: "Weekly", index: 161 },
  { value: "800", display: "Monthly", index: 800 },
  { value: "80", display: "115💎", index: 80 },
  { value: "160", display: "240💎", index: 160 },
  { value: "240", display: "355💎", index: 240 },
  { value: "320", display: "480💎", index: 320 },
  { value: "405", display: "610💎", index: 405 },
  { value: "485", display: "725💎", index: 485 },
  { value: "565", display: "850💎", index: 565 },
  { value: "645", display: "965💎", index: 645 },
  { value: "725", display: "1090💎", index: 725 },
  { value: "810", display: "1240💎", index: 810 },
  { value: "970", display: "1480💎", index: 970 },
  { value: "1050", display: "1595💎", index: 1050 },
  { value: "1130", display: "1720💎", index: 1130 },
  { value: "1290", display: "1960💎", index: 1290 },
  { value: "1375", display: "2090💎", index: 1375 },
  { value: "1625", display: "2530💎", index: 1625 },
  { value: "3250", display: "5060💎", index: 3250 },
];

const debitTypes = [
  { value: "esewa", display: "eSewa" },
  { value: "bank", display: "Bank" },
];

const formSchema = insertTransactionSchema.extend({
  subType: z.string().min(1, "Type is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  rate: z.coerce.number().positive("Rate must be positive").optional(),
  quantity: z.coerce.number().positive("Quantity must be positive").optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateTransaction() {
  const [transactionType, setTransactionType] = useState<"credit" | "debit">("credit");
  const [selectedCreditType, setSelectedCreditType] = useState<typeof creditTypes[0] | null>(null);
  const [calculatedProfit, setCalculatedProfit] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "credit",
      subType: "",
      amount: 0,
      rate: 0,
      quantity: 0,
      index: 0,
      profit: 0,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      const response = await apiRequest("POST", "/api/transactions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setIsSaved(true);
      toast({
        title: "Success",
        description: "Transaction saved successfully!",
      });
      
      // Reset form after successful save
      setTimeout(() => {
        form.reset();
        setCalculatedProfit(null);
        setSelectedCreditType(null);
        setIsSaved(false);
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      });
    },
  });

  // Calculate profit for credit transactions
  useEffect(() => {
    if (transactionType === "credit" && selectedCreditType) {
      const rate = form.watch("rate");
      const amount = form.watch("amount");
      
      if (rate && amount && rate > 0 && amount > 0) {
        const profit = amount - (rate * selectedCreditType.index);
        setCalculatedProfit(profit);
        form.setValue("profit", profit);
      } else {
        setCalculatedProfit(null);
        form.setValue("profit", 0);
      }
    }
  }, [form.watch("rate"), form.watch("amount"), selectedCreditType, transactionType]);

  const onSubmit = (data: FormData) => {
    const transactionData: InsertTransaction = {
      type: transactionType,
      subType: data.subType,
      amount: data.amount,
      index: transactionType === "credit" ? selectedCreditType?.index || 0 : null,
      rate: transactionType === "credit" ? data.rate || 0 : null,
      profit: transactionType === "credit" ? calculatedProfit || 0 : null,
      quantity: transactionType === "debit" ? data.quantity || 0 : null,
    };

    createMutation.mutate(transactionData);
  };

  const handleTransactionTypeChange = (type: "credit" | "debit") => {
    setTransactionType(type);
    form.setValue("type", type);
    form.reset({
      type,
      subType: "",
      amount: 0,
      rate: 0,
      quantity: 0,
      index: 0,
      profit: 0,
    });
    setCalculatedProfit(null);
    setSelectedCreditType(null);
  };

  const handleCreditTypeChange = (value: string) => {
    const creditType = creditTypes.find(ct => ct.value === value);
    setSelectedCreditType(creditType || null);
    form.setValue("subType", creditType?.display || "");
    form.setValue("index", creditType?.index || 0);
  };

  return (
    <div className="max-w-md mx-auto bg-deep-charcoal min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 glass-effect border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-pure-white">New Transaction</h1>
          <Link href="/history">
            <Button variant="ghost" size="icon" className="text-pure-white/70 hover:text-pure-white">
              <History className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-6">
        {/* Transaction Type Toggle */}
        <div className="px-6 py-6">
          <div className="bg-dark-gray rounded-xl p-1 grid grid-cols-2 gap-1">
            <Button
              type="button"
              onClick={() => handleTransactionTypeChange("credit")}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                transactionType === "credit"
                  ? "bg-pure-white text-black hover:bg-pure-white/90"
                  : "bg-transparent text-pure-white/70 hover:text-pure-white hover:bg-transparent"
              }`}
            >
              Credit
            </Button>
            <Button
              type="button"
              onClick={() => handleTransactionTypeChange("debit")}
              className={`py-3 px-4 rounded-lg font-medium text-sm transition-all ${
                transactionType === "debit"
                  ? "bg-pure-white text-black hover:bg-pure-white/90"
                  : "bg-transparent text-pure-white/70 hover:text-pure-white hover:bg-transparent"
              }`}
            >
              Debit
            </Button>
          </div>
        </div>

        {/* Credit Form */}
        {transactionType === "credit" && (
          <div className="px-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-pure-white/80 mb-2 block">Type</Label>
              <Select onValueChange={handleCreditTypeChange}>
                <SelectTrigger className="w-full bg-dark-gray border-white/20 rounded-xl text-pure-white">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="bg-dark-gray border-white/20">
                  {creditTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="text-pure-white">
                      {type.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-pure-white/80 mb-2 block">Rate</Label>
              <Input
                type="number"
                placeholder="Enter rate..."
                className="bg-dark-gray border-white/20 rounded-xl text-pure-white"
                {...form.register("rate", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-pure-white/80 mb-2 block">Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount..."
                className="bg-dark-gray border-white/20 rounded-xl text-pure-white"
                {...form.register("amount", { valueAsNumber: true })}
              />
            </div>

            {/* Profit Display */}
            {calculatedProfit !== null && (
              <div className="bg-success/10 border border-success/30 rounded-xl p-4 profit-animation">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-pure-white/80">Calculated Profit</span>
                  <span className="text-lg font-semibold text-success">
                    ₹{calculatedProfit.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-pure-white/60 mt-1">
                  Amount - (Rate × Index)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Debit Form */}
        {transactionType === "debit" && (
          <div className="px-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-pure-white/80 mb-2 block">Type</Label>
              <Select onValueChange={(value) => form.setValue("subType", value)}>
                <SelectTrigger className="w-full bg-dark-gray border-white/20 rounded-xl text-pure-white">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="bg-dark-gray border-white/20">
                  {debitTypes.map((type) => (
                    <SelectItem key={type.value} value={type.display} className="text-pure-white">
                      {type.display}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-pure-white/80 mb-2 block">Quantity</Label>
              <Input
                type="number"
                placeholder="Enter quantity..."
                className="bg-dark-gray border-white/20 rounded-xl text-pure-white"
                {...form.register("quantity", { valueAsNumber: true })}
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-pure-white/80 mb-2 block">Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount..."
                className="bg-dark-gray border-white/20 rounded-xl text-pure-white"
                {...form.register("amount", { valueAsNumber: true })}
              />
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="px-6 pt-8">
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className={`w-full font-semibold py-4 rounded-xl transition-all shadow-lg ${
              isSaved
                ? "bg-success text-success-foreground hover:bg-success/90"
                : "bg-pure-white text-black hover:bg-pure-white/90"
            }`}
          >
            {isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Transaction
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
