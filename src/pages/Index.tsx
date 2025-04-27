
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddExpenseModal } from "@/components/AddExpenseModal";
import { ExpensesList } from "@/components/ExpensesList";
import { ExpensesChart } from "@/components/ExpensesChart";
import { Expense } from "@/types/expense";
import { nanoid } from "nanoid";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"list" | "chart">("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleAddExpense = (newExpense: Omit<Expense, "id">) => {
    setExpenses((prev) => [...prev, { ...newExpense, id: nanoid() }]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        {activeTab === "list" ? (
          <ExpensesList expenses={expenses} />
        ) : (
          <ExpensesChart expenses={expenses} />
        )}
      </div>

      <Button
        className="fixed bottom-20 right-4 rounded-full w-12 h-12 p-0"
        onClick={() => setIsModalOpen(true)}
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
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddExpense}
      />
    </div>
  );
};

export default Index;
