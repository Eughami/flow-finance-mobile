
import { format } from "date-fns";
import { Expense } from "@/types/expense";

interface ExpensesListProps {
  expenses: Expense[];
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <div className="space-y-4 p-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg p-4 shadow-sm space-y-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg">{expense.title}</h3>
              {expense.description && (
                <p className="text-sm text-gray-500">{expense.description}</p>
              )}
            </div>
            <span className="text-lg font-semibold text-red-500">
              -${expense.amount.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            {format(new Date(expense.date), "MMM d, yyyy")}
          </div>
        </div>
      ))}
    </div>
  );
}
