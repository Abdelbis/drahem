import { Category } from "@/types";

export const expenseCategories: Category[] = [
  { id: 'food', name: 'Alimentation', type: 'expense', icon: '🍽️' },
  { id: 'transport', name: 'Transport', type: 'expense', icon: '🚗' },
  { id: 'housing', name: 'Logement', type: 'expense', icon: '🏠' },
  { id: 'utilities', name: 'Internet & Téléphone', type: 'expense', icon: '📱' },
  { id: 'health', name: 'Santé', type: 'expense', icon: '⚕️' },
  { id: 'entertainment', name: 'Loisirs', type: 'expense', icon: '🎬' },
  { id: 'other-expense', name: 'Autres', type: 'expense', icon: '📦' },
];

export const incomeCategories: Category[] = [
  { id: 'salary', name: 'Salaire', type: 'income', icon: '💼' },
  { id: 'freelance', name: 'Freelance', type: 'income', icon: '💻' },
  { id: 'sale', name: 'Vente', type: 'income', icon: '💰' },
  { id: 'other-income', name: 'Autres', type: 'income', icon: '🎁' },
];

export const allCategories = [...expenseCategories, ...incomeCategories];