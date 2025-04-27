
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  keyword: string;
  onKeywordChange: (value: string) => void;
}

export function FilterBar({ keyword, onKeywordChange }: FilterBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Filter expenses..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
