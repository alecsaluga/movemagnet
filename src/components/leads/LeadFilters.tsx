import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { LeadFilterDialog } from './LeadFilterDialog';

interface LeadFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filters: {
    showNew: boolean;
    showInCRM: boolean;
    dateRange: { from?: Date; to?: Date };
  };
  onFiltersChange: (filters: {
    showNew: boolean;
    showInCRM: boolean;
    dateRange: { from?: Date; to?: Date };
  }) => void;
}

export function LeadFilters({ 
  searchTerm, 
  onSearchChange,
  filters,
  onFiltersChange 
}: LeadFiltersProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <LeadFilterDialog filters={filters} onFiltersChange={onFiltersChange} />
    </div>
  );
}