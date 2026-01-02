export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  date: Date;
  note?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
}

export interface FinancialSummary {
  balance: number;
  totalExpenses: number;
  totalIncome: number;
  difference: number;
}

export interface TimeRange {
  label: string;
  value: 'day' | 'week' | 'month';
}