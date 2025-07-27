import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface PeriodNavigationProps {
  view: 'month' | 'year';
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
  income: number;
  expenses: number;
  total: number;
}

export function PeriodNavigation({
  view,
  currentDate,
  onNavigate,
  income,
  expenses,
  total,
}: PeriodNavigationProps) {
  const title =
    view === 'month'
      ? format(currentDate, 'MMMM yyyy')
      : format(currentDate, 'yyyy');

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate('prev')}
        className="h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="text-sm space-y-1">
          <div className="flex justify-center gap-4">
            <span className="text-green-600">+{income.toFixed(2)} FDJ</span>
            <span className="text-red-600">-{expenses.toFixed(2)} FDJ</span>
          </div>
          <p
            className={`font-medium ${
              total >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            Net: {total.toFixed(2)} FDJ
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onNavigate('next')}
        className="h-8 w-8"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
