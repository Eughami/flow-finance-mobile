import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper functions for custom month periods (26th to 25th)
export const getCustomMonthStart = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(year, month - 1, 26);
};

export const getCustomMonthEnd = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return new Date(Date.UTC(year, month, 25, 20, 59, 59, 999));
};

export const isInCustomMonth = (expenseDate: Date, currentDate: Date) => {
  const start = getCustomMonthStart(currentDate);
  const end = getCustomMonthEnd(currentDate);
  return expenseDate >= start && expenseDate <= end;
};

export const getDateOrNextMonth = () => {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  const day = new Date().getDate();

  if (day >= 26) return new Date(year, month + 1, 1);
  return new Date();
};
