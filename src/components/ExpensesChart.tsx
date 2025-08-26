import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
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
import {
  getCustomMonthEnd,
  getCustomMonthStart,
  isInCustomMonth,
} from '@/lib/utils';

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
  //! fix this after
  //! show current month if date.day < 26
  //! else show next month (26 Aug -> Sept 2025)

  const diffDays = (start: Date, end: Date) => {
    const oneDay = 1000 * 60 * 60 * 24;

    const diffInMs = Math.abs(start.getTime() - end.getTime());
    return Math.floor(diffInMs / oneDay);
  };
  const getChartData = () => {
    if (view === 'month') {
      // For custom month (26th to 25th), we need to calculate  difference in days according
      // to the actual dates (for example february should be 28 days and 30/31 days month should be different)
      const start = getCustomMonthStart(currentDate);
      const end = getCustomMonthEnd(currentDate);
      const numOfDays = diffDays(start, end) + 1;
      const dailyData = new Array(numOfDays).fill(0).map((_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return {
          date: date.getDate(),
          amount: 0,
        };
      });

      expenses.forEach((expense) => {
        // Filter expenses based on typeFilter - by default show only expenses
        const shouldInclude =
          typeFilter === 'income'
            ? expense.type === 'income'
            : expense.type === 'expense';

        if (shouldInclude) {
          const expenseDate = new Date(expense.date);
          if (isInCustomMonth(expenseDate, currentDate)) {
            const start = getCustomMonthStart(currentDate);
            const daysDiff = Math.floor(
              (expenseDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
            );
            if (daysDiff >= 0 && daysDiff < numOfDays) {
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
        const shouldInclude =
          typeFilter === 'income'
            ? expense.type === 'income'
            : expense.type === 'expense';

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
