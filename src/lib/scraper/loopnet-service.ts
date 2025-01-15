import { supabase } from '@/lib/supabase';
import { parse } from 'date-fns';
import { findBusinessAtAddress } from '@/lib/google/places';

interface ScrapedLead {
  propertyUrl: string;
  address: string;
  suite?: string;
  size: string;
  availableDate: string;
}

export class LoopnetService {
  private async processLeads(leads: ScrapedLead[], marketId: string, userId: string) {
    for (const lead of leads) {
      // Check if lead already exists
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('property_url', lead.propertyUrl)
        .eq('market_id', marketId)
        .single();

      if (existingLead) continue;

      // Calculate move date (30 days before available date)
      const availableDate = parse(lead.availableDate, 'MMMM dd, yyyy', new Date());
      const moveDate = new Date(availableDate);
      moveDate.setDate(moveDate.getDate() - 30);

      // Get business info from Google Places
      const fullAddress = `${lead.address}${lead.suite ? ` Suite ${lead.suite}` : ''}`;
      const businessInfo = await findBusinessAtAddress(fullAddress);

      // Save to database
      await supabase.from('leads').insert({
        market_id: marketId,
        property_url: lead.propertyUrl,
        street: lead.address,
        suite: lead.suite,
        size: lead.size,
        move_date: moveDate.toISOString(),
        available_date: availableDate.toISOString(),
        business_name: businessInfo.businessName,
        contact_phone: businessInfo.phoneNumber,
        is_new: true,
        user_id: userId
      });
    }
  }

  async runScraper(marketId: string, userId: string) {
    try {
      // Log scraper job start
      const { data: job } = await supabase
        .from('scraper_jobs')
        .insert({
          market_id: marketId,
          status: 'running',
          user_id: userId
        })
        .select()
        .single();

      // Get market URL
      const { data: market } = await supabase
        .from('markets')
        .select('url')
        .eq('id', marketId)
        .single();

      if (!market?.url) {
        throw new Error('Market URL not found');
      }

      // Run Python scraper
      const { spawn } = require('child_process');
      const scraper = spawn('python', ['scraper.py', market.url]);

      let scrapedData = '';
      scraper.stdout.on('data', (data: Buffer) => {
        scrapedData += data.toString();
      });

      await new Promise((resolve, reject) => {
        scraper.on('close', (code: number) => {
          if (code === 0) resolve(null);
          else reject(new Error(`Scraper exited with code ${code}`));
        });
      });

      // Parse scraped data
      const leads = JSON.parse(scrapedData);

      // Process and save leads
      await this.processLeads(leads, marketId, userId);

      // Update job status
      await supabase
        .from('scraper_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_leads: leads.length
        })
        .eq('id', job.id);

    } catch (error) {
      console.error('Scraper error:', error);
      
      // Log error in scraper job
      await supabase
        .from('scraper_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', marketId);

      throw error;
    }
  }
}