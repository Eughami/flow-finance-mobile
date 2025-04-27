
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Expense } from "@/types/expense";
import { Button } from "@/components/ui/button";

interface ExpensesListProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
}

export function ExpensesList({ expenses, onEdit, onDelete }: ExpensesListProps) {
  return (
    <div className="space-y-4 p-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg p-4 shadow-sm space-y-2"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{expense.title}</h3>
              {expense.description && (
                <p className="text-sm text-gray-500">{expense.description}</p>
              )}
            </div>
            <span className="text-lg font-semibold text-red-500 mx-4">
              -${expense.amount.toFixed(2)}
            </span>
            <div className="flex gap-2 items-start">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit?.(expense)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-600"
                onClick={() => onDelete?.(expense.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            {format(new Date(expense.date), "MMM d, yyyy")}
          </div>
        </div>
      ))}
    </div>
  );
}
