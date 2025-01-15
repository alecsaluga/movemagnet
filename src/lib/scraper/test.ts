import { supabase } from '@/lib/supabase';
import { scrapeLoopnet } from './loopnet';

export async function runTestScrape(marketId: string) {
  try {
    // Get market URL
    const { data: market } = await supabase
      .from('markets')
      .select('url')
      .eq('id', marketId)
      .single();

    if (!market?.url) {
      throw new Error('Market URL not found');
    }

    // Run scraper
    console.log('Starting test scrape for:', market.url);
    const leads = await scrapeLoopnet(market.url);
    
    console.log('Scraping complete. Found leads:', leads.length);
    return leads;

  } catch (error) {
    console.error('Test scrape failed:', error);
    throw error;
  }
}