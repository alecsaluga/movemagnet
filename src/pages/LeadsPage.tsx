import { useState } from 'react';
import { LeadCard } from '@/components/leads/LeadCard';
import { MarketSelector } from '@/components/leads/MarketSelector';
import { LeadFilters } from '@/components/leads/LeadFilters';
import { LeadStats } from '@/components/leads/LeadStats';
import { AddLeadDialog } from '@/components/leads/AddLeadDialog';
import { Building2 } from 'lucide-react';
import { useLeads } from '@/hooks/useLeads';
import { parseDate } from '@/lib/dates';

export function LeadsPage() {
  const [selectedMarket, setSelectedMarket] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    showNew: false,
    showInCRM: false,
    dateRange: { from: undefined, to: undefined },
  });

  const { leads, loading, toggleCRM, deleteLead, refreshLeads } = useLeads(selectedMarket);

  const filteredLeads = leads.filter(lead => {
    // Text search
    const matchesSearch = 
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.address.street.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filters
    const matchesNew = !filters.showNew || lead.isNew;
    const matchesCRM = !filters.showInCRM || lead.inCRM;

    // Date range filter
    const moveDate = lead.predictedMoveDate ? parseDate(lead.predictedMoveDate) : null;
    const matchesDateRange = 
      !moveDate || // Include leads without move dates
      (!filters.dateRange.from || moveDate >= filters.dateRange.from) &&
      (!filters.dateRange.to || moveDate <= filters.dateRange.to);

    return matchesSearch && matchesNew && matchesCRM && matchesDateRange;
  });

  const stats = {
    totalLeads: leads.length,
    newLeads: leads.filter(lead => lead.isNew).length,
    inCRM: leads.filter(lead => lead.inCRM).length,
    upcomingMoves: leads.filter(lead => {
      const moveDate = lead.predictedMoveDate ? parseDate(lead.predictedMoveDate) : null;
      if (!moveDate) return false;
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      return moveDate > now && moveDate < thirtyDaysFromNow;
    }).length,
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Your Leads</h1>
        </div>
        <div className="flex items-center gap-4">
          <MarketSelector
            selectedMarket={selectedMarket}
            onMarketChange={setSelectedMarket}
          />
          {selectedMarket && (
            <AddLeadDialog 
              marketId={selectedMarket}
              onLeadAdded={refreshLeads}
            />
          )}
        </div>
      </div>

      <LeadStats {...stats} />

      <LeadFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredLeads.length > 0 ? (
        <div className="grid gap-4">
          {filteredLeads.map(lead => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onToggleCRM={toggleCRM}
              onDelete={deleteLead}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedMarket ? 'No leads found for this market' : 'Select a market to view leads'}
          </p>
        </div>
      )}
    </div>
  );
}