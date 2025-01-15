import { supabase } from '@/lib/supabase';

export async function updateMarketLeadCount(marketId: string) {
  try {
    // Get the count of leads for this market
    const { count, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('market_id', marketId);

    if (countError) throw countError;

    // The total_leads will be updated automatically by the database trigger
    // We don't need to manually update it anymore
    
    return count;
  } catch (error) {
    console.error('Error getting market lead count:', error);
    throw error;
  }
}