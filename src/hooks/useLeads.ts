import { useState, useEffect } from 'react';
import { Lead } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function useLeads(marketId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeads() {
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
            street: lead.address,
            suite: lead.suite || undefined,
            city: lead.city,
            state: lead.state,
            zip: lead.zip,
          },
          predictedMoveDate: lead.predicted_move_date,
          contact: {
            name: lead.contact_name || '',
            phone: lead.contact_phone || '',
          },
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
    }

    fetchLeads();
  }, [user, marketId, toast]);

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
  };
}