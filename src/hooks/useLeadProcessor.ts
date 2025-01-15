import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { processCsvData, processLeads } from '@/lib/scraper/csv-processor';
import { findBusinessInfo } from '@/lib/scraper/places-api';
import { ProcessedLead } from '@/lib/scraper/types';

export function useLeadProcessor() {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processAndSaveLeads = async (csvContent: string, marketId: string) => {
    if (!user) return;
    
    setProcessing(true);
    setError(null);

    try {
      // Process CSV data
      const properties = processCsvData(csvContent);
      const processedLeads = processLeads(properties);

      // Process each lead
      for (const lead of processedLeads) {
        // Check if lead already exists
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('property_url', lead.propertyUrl)
          .eq('market_id', marketId)
          .single();

        if (existingLead) continue;

        // Get business info from Google Places
        const fullAddress = `${lead.address}${lead.suite ? ` Suite ${lead.suite}` : ''}, ${lead.city}, ${lead.state} ${lead.zip}`;
        const businessInfo = await findBusinessInfo(fullAddress);

        // Save to database
        await supabase.from('leads').insert({
          market_id: marketId,
          property_url: lead.propertyUrl,
          street: lead.address,
          suite: lead.suite,
          city: lead.city,
          state: lead.state,
          zip: lead.zip,
          move_date: lead.moveDate,
          available_date: lead.availableDate,
          business_name: businessInfo.businessName,
          contact_phone: businessInfo.phoneNumber,
          is_new: true,
          user_id: user.id,
        });
      }

      return processedLeads;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process leads';
      setError(message);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  return {
    processAndSaveLeads,
    processing,
    error,
  };
}