
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import {
  format,
  setDate,
  startOfYear,
  endOfYear,
  isSameYear,
  getDaysInMonth,
} from 'date-fns';

interface ExpensesChartProps {
  expenses: Expense[];
  view: 'month' | 'year';
  onViewChange: (view: 'month' | 'year') => void;
  currentDate: Date;
  typeFilter: 'all' | 'income' | 'expense';
}

export function ExpensesChart({
  expenses,
  view,
  onViewChange,
  currentDate,
  typeFilter,
}: ExpensesChartProps) {
  // Helper functions for custom month periods (26th to 25th)
  const getCustomMonthStart = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return setDate(new Date(year, month - 1, 26), 26);
  };

  const getCustomMonthEnd = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return setDate(new Date(year, month, 25), 25);
  };

  const isInCustomMonth = (expenseDate: Date, currentDate: Date) => {
    const start = getCustomMonthStart(currentDate);
    const end = getCustomMonthEnd(currentDate);
    return expenseDate >= start && expenseDate <= end;
  };

  const getChartData = () => {
    if (view === 'month') {
      // For custom month (26th to 25th), we need 30 days with actual dates
      const start = getCustomMonthStart(currentDate);
      const dailyData = new Array(30).fill(0).map((_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return {
          date: date.getDate(),
          amount: 0,
        };
      });

      expenses.forEach((expense) => {
        // Filter expenses based on typeFilter - by default show only expenses
        const shouldInclude = typeFilter === 'income' ? expense.type === 'income' : expense.type === 'expense';
        
        if (shouldInclude) {
          const expenseDate = new Date(expense.date);
          if (isInCustomMonth(expenseDate, currentDate)) {
            const start = getCustomMonthStart(currentDate);
            const daysDiff = Math.floor((expenseDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff >= 0 && daysDiff < 30) {
              dailyData[daysDiff].amount += expense.amount;
            }
          }
        }
      });

      return dailyData;
    } else {
      const monthlyData = new Array(12).fill(0).map((_, i) => ({
        date: format(new Date(currentDate.getFullYear(), i), 'MMM'),
        amount: 0,
      }));

      expenses.forEach((expense) => {
        // Filter expenses based on typeFilter - by default show only expenses
        const shouldInclude = typeFilter === 'income' ? expense.type === 'income' : expense.type === 'expense';
        
        if (shouldInclude) {
          const expenseDate = new Date(expense.date);
          if (isSameYear(expenseDate, currentDate)) {
            const month = expenseDate.getMonth();
            monthlyData[month].amount += expense.amount;
          }
        }
      });

      return monthlyData;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={view === 'month' ? 'default' : 'outline'}
          onClick={() => onViewChange('month')}
          className="flex-1"
        >
          Month
        </Button>
        <Button
          variant={view === 'year' ? 'default' : 'outline'}
          onClick={() => onViewChange('year')}
          className="flex-1"
        >
          Year
        </Button>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={getChartData()}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#9b87f5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
