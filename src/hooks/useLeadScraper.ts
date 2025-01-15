import { useState } from 'react';
import { scrapeMarket } from '@/lib/scraper';
import { ScrapedLead } from '@/lib/scraper/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useLeadScraper() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeAndSaveLeads = async (marketId: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      // Start scraping from page 1
      const result = await scrapeMarket(marketId);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Save leads to database
      const { error: dbError } = await supabase.from('leads').insert(
        result.leads.map(lead => ({
          market_id: marketId,
          property_url: lead.propertyUrl,
          street: lead.address,
          suite: lead.suite,
          size: lead.size,
          available_date: lead.availableDate,
          business_name: lead.businessName,
          contact_name: lead.contactName,
          contact_phone: lead.contactPhone,
          is_new: true,
          user_id: user.id,
        }))
      );

      if (dbError) throw dbError;

      return result.leads;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to scrape leads';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    scrapeAndSaveLeads,
    loading,
    error,
  };
}