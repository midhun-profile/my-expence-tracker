
export type Category = 
  | 'Food & Drinks'
  | 'Transportation'
  | 'Housing & Rent'
  | 'Entertainment'
  | 'Shopping'
  | 'Health'
  | 'Utilities'
  | 'Education'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO format string
}

export interface MonthlySummary {
  month: string;
  total: number;
  byCategory: { category: string; amount: number }[];
}

export interface AIInsight {
  analysis: string;
  recommendations: string[];
}

export interface AppSettings {
  currencySymbol: string;
  currencyFormat: 'standard' | 'space'; // e.g., $100 vs $ 100
  theme: 'light' | 'dark';
  enableAI: boolean;
}
