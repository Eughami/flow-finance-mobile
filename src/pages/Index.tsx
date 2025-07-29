import { useState } from 'react';
import { Plus, SortAsc, SortDesc, Download, Upload, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddExpenseModal } from '@/components/AddExpenseModal';
import { ExpensesList } from '@/components/ExpensesList';
import { ExpensesChart } from '@/components/ExpensesChart';
import { Expense } from '@/types/expense';
import { nanoid } from 'nanoid';
import { FilterBar } from '@/components/FilterBar';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { PeriodNavigation } from '@/components/PeriodNavigation';
import { toast } from 'sonner';
import {
  addMonths,
  addYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameMonth,
  isSameYear,
  setDate,
} from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const [view, setView] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortType, setSortType] = useState<'date' | 'amount'>('date');
  const [showActions, setShowActions] = useState(false);

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

  const handleNavigate = (direction: 'prev' | 'next') => {
    setCurrentDate((current) => {
      if (view === 'month') {
        return direction === 'next' ? addMonths(current, 1) : addMonths(current, -1);
      } else {
        return direction === 'next' ? addYears(current, 1) : addYears(current, -1);
      }
    });
  };

  const handleAddExpense = (newExpense: Expense) => {
    if (newExpense.id) {
      setExpenses((prev) =>
        prev.map((ex) => (ex.id === newExpense.id ? newExpense : ex))
      );
    } else {
      setExpenses((prev) => [...prev, { ...newExpense, id: nanoid() }]);
    }
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
      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== expenseToDelete)
      );
      setExpenseToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(expenses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Expenses exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export expenses');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedExpenses = JSON.parse(content);
        
        // Validate that it's an array of expenses
        if (!Array.isArray(importedExpenses)) {
          throw new Error('Invalid file format');
        }

        // Validate each expense has required fields
        const validExpenses = importedExpenses.filter((expense: any) => 
          expense.title && expense.amount !== undefined && expense.date
        ).map((expense: any) => ({
          ...expense,
          id: expense.id || nanoid(),
          date: new Date(expense.date),
          type: expense.type || 'expense'
        }));

        if (validExpenses.length === 0) {
          throw new Error('No valid expenses found in file');
        }

        setExpenses(validExpenses);
        toast.success(`Imported ${validExpenses.length} expenses successfully!`);
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Failed to import expenses. Please check file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      const keyword = filterKeyword.toLowerCase();
      const matchesKeyword =
        expense.title.toLowerCase().includes(keyword) ||
        expense.description.toLowerCase().includes(keyword);

      const matchesType = typeFilter === 'all' || expense.type === typeFilter;

      const expenseDate = new Date(expense.date);
      
      const isInPeriod = view === 'month'
        ? isInCustomMonth(expenseDate, currentDate)
        : isSameYear(expenseDate, currentDate);

      return matchesKeyword && matchesType && isInPeriod;
    })
    .sort((a, b) => {
      if (sortType === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });

  const periodIncome = filteredAndSortedExpenses
    .filter(expense => expense.type === 'income')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const periodExpenses = filteredAndSortedExpenses
    .filter(expense => expense.type === 'expense')
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const periodTotal = periodIncome - periodExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white shadow-sm space-y-2">
          <div className="p-4 flex items-center gap-2">
            <div className="flex-1">
              <FilterBar 
                keyword={filterKeyword} 
                onKeywordChange={setFilterKeyword}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActions(!showActions)}
              className="h-10 w-10"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          {showActions && (
            <div className="px-4 pb-2 flex items-center gap-2 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortType(sortType === 'date' ? 'amount' : 'date')}
                  className="h-8"
                >
                  {sortType === 'date' ? 'Date' : 'Amount'}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
                  }
                  className="h-8 w-8"
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="h-4 w-px bg-gray-300 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExport}
                className="h-8"
              >
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('import-file')?.click()}
                className="h-8"
              >
                <Upload className="h-4 w-4 mr-1" />
                Import
              </Button>
            </div>
          )}
          <PeriodNavigation
            view={view}
            currentDate={currentDate}
            onNavigate={handleNavigate}
            income={periodIncome}
            expenses={periodExpenses}
            total={periodTotal}
          />
        </div>

        <div className="space-y-4 p-4">
          <ExpensesChart
            expenses={filteredAndSortedExpenses}
            view={view}
            onViewChange={setView}
            currentDate={currentDate}
            typeFilter={typeFilter}
          />
          <ExpensesList
            expenses={filteredAndSortedExpenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0"
        onClick={() => {
          setEditingExpense(null);
          setIsModalOpen(true);
        }}
      >
        <Plus />
      </Button>

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
              This action cannot be undone. This will permanently delete the
              expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setExpenseToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
