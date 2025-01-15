import { supabase } from '@/lib/supabase';
import { LoopnetService } from './loopnet-service';
import { addDays } from 'date-fns';

export class ScraperScheduler {
  private loopnetService: LoopnetService;

  constructor() {
    this.loopnetService = new LoopnetService();
  }

  async scheduleMarketScrape(marketId: string, userId: string, frequencyDays: number) {
    // Create or update schedule
    const nextRun = addDays(new Date(), frequencyDays);

    await supabase
      .from('scraper_schedules')
      .upsert({
        market_id: marketId,
        frequency_days: frequencyDays,
        next_run: nextRun.toISOString(),
        user_id: userId,
        is_active: true
      });
  }

  async runScheduledScrapes() {
    // Get all due schedules
    const { data: schedules } = await supabase
      .from('scraper_schedules')
      .select('*')
      .eq('is_active', true)
      .lte('next_run', new Date().toISOString());

    if (!schedules) return;

    // Run scraper for each due schedule
    for (const schedule of schedules) {
      try {
        await this.loopnetService.runScraper(schedule.market_id, schedule.user_id);

        // Update last run and next run times
        const nextRun = addDays(new Date(), schedule.frequency_days);
        await supabase
          .from('scraper_schedules')
          .update({
            last_run: new Date().toISOString(),
            next_run: nextRun.toISOString()
          })
          .eq('id', schedule.id);

      } catch (error) {
        console.error('Failed to run scheduled scrape:', error);
      }
    }
  }
}