import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Search, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/dates';
import { EditLeadDialog } from './EditLeadDialog';
import { CsvUploadDialog } from './CsvUploadDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Lead {
  id: string;
  business_name: string;
  address: string;
  suite: string | null;
  city: string;
  state: string;
  zip: string;
  move_date: string | null;
  predicted_move_date: string | null;
  contact1_name: string | null;
  contact1_role: string | null;
  contact1_email: string | null;
  contact1_phone: string | null;
  contact2_name: string | null;
  contact2_role: string | null;
  contact2_email: string | null;
  contact2_phone: string | null;
  contact3_name: string | null;
  contact3_role: string | null;
  contact3_email: string | null;
  contact3_phone: string | null;
  is_new: boolean;
  in_crm: boolean;
  created_at: string;
}

interface LeadsTableProps {
  marketId: string;
}

export function LeadsTable({ marketId }: LeadsTableProps) {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Fetch leads with search term
  const fetchLeads = async () => {
    try {
      let query = supabase
        .from('leads')
        .select('*')
        .eq('market_id', marketId)
        .order('created_at', { ascending: false });

      // Only apply search if term is not empty
      if (debouncedSearchTerm) {
        query = query.or(
          `business_name.ilike.%${debouncedSearchTerm}%,` +
          `address.ilike.%${debouncedSearchTerm}%,` +
          `city.ilike.%${debouncedSearchTerm}%,` +
          `state.ilike.%${debouncedSearchTerm}%,` +
          `zip.ilike.%${debouncedSearchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch leads when market ID or debounced search term changes
  useEffect(() => {
    setLoading(true);
    fetchLeads();
  }, [marketId, debouncedSearchTerm]);

  const handleDelete = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Lead deleted successfully',
      });

      fetchLeads();
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  const toggleCRM = async (leadId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ in_crm: !currentStatus })
        .eq('id', leadId);

      if (error) throw error;

      fetchLeads();
    } catch (error) {
      console.error('Error updating CRM status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update CRM status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <CsvUploadDialog marketId={marketId} onUploaded={fetchLeads} />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Move Date</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  {searchTerm ? 'No leads found matching your search' : 'No leads found'}
                </TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div className="font-medium">{lead.business_name}</div>
                    {lead.is_new && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        New
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{lead.address}</div>
                    {lead.suite && <div className="text-sm text-muted-foreground">Suite {lead.suite}</div>}
                    <div className="text-sm text-muted-foreground">
                      {lead.city}, {lead.state} {lead.zip}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.move_date ? (
                      formatDate(lead.move_date)
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {!lead.contact1_name && !lead.contact1_phone && !lead.contact1_email ? (
                      <Alert variant="destructive" className="p-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>No contact information</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-1">
                        {lead.contact1_name && (
                          <div className="font-medium">{lead.contact1_name}</div>
                        )}
                        {lead.contact1_phone && (
                          <div className="text-sm">
                            <a href={`tel:${lead.contact1_phone}`} className="text-blue-600 hover:underline">
                              {lead.contact1_phone}
                            </a>
                          </div>
                        )}
                        {lead.contact1_email && (
                          <div className="text-sm">
                            <a href={`mailto:${lead.contact1_email}`} className="text-blue-600 hover:underline">
                              {lead.contact1_email}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => toggleCRM(lead.id, lead.in_crm)}
                    >
                      {lead.in_crm ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          In CRM
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                          Not in CRM
                        </>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EditLeadDialog lead={lead} onLeadUpdated={fetchLeads} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(lead.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}