
export interface Expense {
  id: string;
  title: string;
  description: string;
  amount: number;
  date: Date;
  type: 'income' | 'expense';
}
