import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SlidersHorizontal } from "lucide-react";
import { DateRangePicker } from "./DateRangePicker";

interface LeadFilterDialogProps {
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

export function LeadFilterDialog({ filters, onFiltersChange }: LeadFilterDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Leads</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-new">Show New Leads Only</Label>
            <Switch
              id="show-new"
              checked={filters.showNew}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, showNew: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show-crm">Show In CRM Only</Label>
            <Switch
              id="show-crm"
              checked={filters.showInCRM}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, showInCRM: checked })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Move Date Range</Label>
            <DateRangePicker
              from={filters.dateRange.from}
              to={filters.dateRange.to}
              onSelect={(range) =>
                onFiltersChange({ ...filters, dateRange: range })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}