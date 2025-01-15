import { supabase } from '@/lib/supabase';
import { scrapeMarketLeads } from './api';
import { isValidUUID } from '@/lib/utils';

export async function testScraper(marketId: string) {
  try {
    if (!isValidUUID(marketId)) {
      throw new Error('Invalid market ID format');
    }

    // Get market details
    const { data: market } = await supabase
      .from('markets')
      .select('*')
      .eq('id', marketId)
      .single();
      
    if (!market) {
      throw new Error('Market not found');
    }

    // Run scraper
    const leads = await scrapeMarketLeads(marketId);
    
    return {
      success: true,
      market,
      sampleLeads: leads.slice(0, 5)
    };
    
  } catch (error) {
    console.error('Test scrape failed:', error);
    throw error;
  }
}