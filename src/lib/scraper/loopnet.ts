import { ProcessedLead } from './types';
import { scrapeMarketLeads } from './api';

export async function scrapeLoopnet(marketUrl: string): Promise<ProcessedLead[]> {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll use mock data
    const leads = await scrapeMarketLeads(marketUrl);
    return leads;
  } catch (error) {
    console.error('Scraper error:', error);
    throw error;
  }
}