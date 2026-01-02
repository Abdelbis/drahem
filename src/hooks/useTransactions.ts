import { useEffect } from "react";
import useTransactionStore from "@/store/useTransactionStore";
import { Transaction } from "@/types";

export const useTransactions = () => {
  const {
    transactions,
    summary,
    dailySummary,
    weeklySummary,
    monthlySummary,
    categoryExpenses,
    initializeTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useTransactionStore();
  
  // Initialize transactions from localStorage on first load
  useEffect(() => {
    if (transactions.length === 0) {
      const saved = localStorage.getItem("budget_transactions");
      if (saved) {
        try {
          const parsedTransactions = JSON.parse(saved).map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }));
          initializeTransactions(parsedTransactions);
        } catch (e) {
          console.error("Failed to parse transactions from localStorage", e);
        }
      }
    }
  }, []);
  
  // Sync with localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("budget_transactions", JSON.stringify(transactions));
  }, [transactions]);

  return {
    transactions,
    summary,
    dailySummary,
    weeklySummary,
    monthlySummary,
    categoryExpenses,
    addTransaction,
    updateTransaction,
    deleteTransaction
  };
};