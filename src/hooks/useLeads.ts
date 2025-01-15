import { useState, useEffect, useCallback } from 'react';
import { Lead } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useLeads(marketId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    if (!user || !marketId) {
      setLeads([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('market_id', marketId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLeads: Lead[] = data.map(lead => ({
        id: lead.id,
        businessName: lead.business_name,
        address: {
          street: lead.address, // Changed from lead.street to lead.address
          suite: lead.suite || undefined,
          city: lead.city,
          state: lead.state,
          zip: lead.zip,
        },
        predictedMoveDate: lead.move_date || lead.predicted_move_date,
        contact1_name: lead.contact1_name,
        contact1_role: lead.contact1_role,
        contact1_email: lead.contact1_email,
        contact1_phone: lead.contact1_phone,
        contact2_name: lead.contact2_name,
        contact2_role: lead.contact2_role,
        contact2_email: lead.contact2_email,
        contact2_phone: lead.contact2_phone,
        contact3_name: lead.contact3_name,
        contact3_role: lead.contact3_role,
        contact3_email: lead.contact3_email,
        contact3_phone: lead.contact3_phone,
        isNew: lead.is_new,
        inCRM: lead.in_crm,
        addedAt: lead.created_at,
      }));

      setLeads(formattedLeads);
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
  }, [user, marketId, toast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const toggleCRM = async (leadId: string) => {
    try {
      const lead = leads.find(l => l.id === leadId);
      if (!lead) return;

      const { error } = await supabase
        .from('leads')
        .update({ in_crm: !lead.inCRM })
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev =>
        prev.map(lead =>
          lead.id === leadId
            ? { ...lead, inCRM: !lead.inCRM }
            : lead
        )
      );
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      });
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== leadId));

      toast({
        title: 'Success',
        description: 'Lead deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete lead',
        variant: 'destructive',
      });
    }
  };

  return {
    leads,
    loading,
    toggleCRM,
    deleteLead,
    refreshLeads: fetchLeads,
  };
}