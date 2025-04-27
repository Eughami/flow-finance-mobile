
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { ExpensesList } from "@/components/ExpensesList";
import { ExpensesChart } from "@/components/ExpensesChart";
import { Expense } from "@/types/expense";
import { nanoid } from "nanoid";
import { FilterBar } from "@/components/FilterBar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [filterKeyword, setFilterKeyword] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses((prev) => [...prev, { ...newExpense, id: nanoid() }]);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setExpenseToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      setExpenses((prev) => prev.filter((expense) => expense.id !== expenseToDelete));
      setExpenseToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const filteredExpenses = expenses.filter((expense) => {
    const keyword = filterKeyword.toLowerCase();
    return (
      expense.title.toLowerCase().includes(keyword) ||
      expense.description.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <FilterBar keyword={filterKeyword} onKeywordChange={setFilterKeyword} />
        {activeTab === "list" ? (
          <ExpensesList
            expenses={filteredExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteClick}
          />
        ) : (
          <ExpensesChart expenses={filteredExpenses} />
        )}
      </div>

      <Button
        className="fixed bottom-20 right-4 rounded-full w-12 h-12 p-0"
        onClick={() => {
          setEditingExpense(null);
          setIsModalOpen(true);
        }}
      >
        <Plus />
      </Button>

      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t flex">
        <button
          className={`flex-1 flex items-center justify-center ${
            activeTab === "list" ? "text-purple-600" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List
        </button>
        <button
          className={`flex-1 flex items-center justify-center ${
            activeTab === "chart" ? "text-purple-600" : "text-gray-400"
          }`}
          onClick={() => setActiveTab("chart")}
        >
          Chart
        </button>
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
        }}
        onAdd={handleAddExpense}
        expense={editingExpense}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
