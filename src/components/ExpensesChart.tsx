
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Expense } from '@/types/expense';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameMonth,
  isSameYear,
} from 'date-fns';

interface ExpensesChartProps {
  expenses: Expense[];
  view: 'month' | 'year';
  onViewChange: (view: 'month' | 'year') => void;
  currentDate: Date;
}

export function ExpensesChart({
  expenses,
  view,
  onViewChange,
  currentDate,
}: ExpensesChartProps) {
  const getChartData = () => {
    const start = view === 'month' ? startOfMonth(currentDate) : startOfYear(currentDate);
    const end = view === 'month' ? endOfMonth(currentDate) : endOfYear(currentDate);

    if (view === 'month') {
      const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      ).getDate();

      const dailyData = new Array(daysInMonth).fill(0).map((_, i) => ({
        date: i + 1,
        amount: 0,
      }));

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        if (isSameMonth(expenseDate, currentDate)) {
          const day = expenseDate.getDate();
          dailyData[day - 1].amount += expense.amount;
        }
      });

      return dailyData;
    } else {
      const monthlyData = new Array(12).fill(0).map((_, i) => ({
        date: format(new Date(currentDate.getFullYear(), i), 'MMM'),
        amount: 0,
      }));

      expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        if (isSameYear(expenseDate, currentDate)) {
          const month = expenseDate.getMonth();
          monthlyData[month].amount += expense.amount;
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
