import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, FinancialSummary } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TransactionState {
  transactions: Transaction[];
  summary: FinancialSummary;
  dailySummary: { income: number; expenses: number };
  weeklySummary: { income: number; expenses: number };
  monthlySummary: { income: number; expenses: number };
  categoryExpenses: { category: string; amount: number }[];
  initializeTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updatedTransaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  calculateSummaries: () => void;
}

const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      summary: {
        balance: 0,
        totalExpenses: 0,
        totalIncome: 0,
        difference: 0
      },
      dailySummary: { income: 0, expenses: 0 },
      weeklySummary: { income: 0, expenses: 0 },
      monthlySummary: { income: 0, expenses: 0 },
      categoryExpenses: [],
      
      initializeTransactions: (transactions) => {
        set({ transactions });
        get().calculateSummaries();
      },
      
      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions]
        }));
        
        get().calculateSummaries();
      },
      
      updateTransaction: (id, updatedTransaction) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updatedTransaction } : t
          )
        }));
        
        get().calculateSummaries();
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }));
        
        get().calculateSummaries();
      },
      
      calculateSummaries: () => {
        const { transactions } = get();
        
        // Calculate financial summary
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const summary = {
          balance: totalIncome - totalExpenses,
          totalIncome,
          totalExpenses,
          difference: totalIncome - totalExpenses
        };
        
        // Calculate daily summary
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          transactionDate.setHours(0, 0, 0, 0);
          return transactionDate.getTime() === today.getTime();
        });
        
        const dailyIncome = todayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const dailyExpenses = todayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const dailySummary = { income: dailyIncome, expenses: dailyExpenses };
        
        // Calculate weekly summary
        const now = new Date();
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        const weekTransactions = transactions.filter(t => new Date(t.date) >= startOfWeek);
        
        const weeklyIncome = weekTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const weeklyExpenses = weekTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const weeklySummary = { income: weeklyIncome, expenses: weeklyExpenses };
        
        // Calculate monthly summary
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
        
        const monthlyIncome = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlySummary = { income: monthlyIncome, expenses: monthlyExpenses };
        
        // Calculate category expenses
        const expenses = transactions.filter(t => t.type === 'expense');
        const categoryTotals: Record<string, number> = {};
        
        expenses.forEach(t => {
          if (!categoryTotals[t.category]) {
            categoryTotals[t.category] = 0;
          }
          categoryTotals[t.category] += t.amount;
        });
        
        const categoryExpenses = Object.entries(categoryTotals).map(([category, amount]) => ({
          category,
          amount
        }));
        
        set({
          summary,
          dailySummary,
          weeklySummary,
          monthlySummary,
          categoryExpenses
        });
      }
    }),
    {
      name: 'budget-transactions',
      partialize: (state) => ({ 
        transactions: state.transactions,
        summary: state.summary,
        dailySummary: state.dailySummary,
        weeklySummary: state.weeklySummary,
        monthlySummary: state.monthlySummary,
        categoryExpenses: state.categoryExpenses
      })
    }
  )
);

export default useTransactionStore;