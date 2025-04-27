
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

interface ExpensesChartProps {
  expenses: Expense[];
}

export function ExpensesChart({ expenses }: ExpensesChartProps) {
  const [view, setView] = useState<"month" | "year">("month");

  const getChartData = () => {
    const now = new Date();
    const start = view === "month" ? startOfMonth(now) : startOfYear(now);
    const end = view === "month" ? endOfMonth(now) : endOfYear(now);
    
    const filtered = expenses.filter(
      (expense) => new Date(expense.date) >= start && new Date(expense.date) <= end
    );

    if (view === "month") {
      const dailyData = new Array(31).fill(0).map((_, i) => ({
        date: i + 1,
        amount: 0,
      }));

      filtered.forEach((expense) => {
        const day = new Date(expense.date).getDate();
        dailyData[day - 1].amount += expense.amount;
      });

      return dailyData;
    } else {
      const monthlyData = new Array(12).fill(0).map((_, i) => ({
        date: format(new Date(now.getFullYear(), i), "MMM"),
        amount: 0,
      }));

      filtered.forEach((expense) => {
        const month = new Date(expense.date).getMonth();
        monthlyData[month].amount += expense.amount;
      });

      return monthlyData;
    }
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex gap-2">
        <Button
          variant={view === "month" ? "default" : "outline"}
          onClick={() => setView("month")}
          className="flex-1"
        >
          Month
        </Button>
        <Button
          variant={view === "year" ? "default" : "outline"}
          onClick={() => setView("year")}
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
