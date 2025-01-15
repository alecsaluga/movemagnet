import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export function useScraperSchedule() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const updateSchedule = async (marketId: string, frequencyDays: number, isActive: boolean) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('scraper_schedules')
        .upsert({
          market_id: marketId,
          frequency_days: frequencyDays,
          is_active: isActive,
          user_id: user.id,
        });

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  const getSchedule = async (marketId: string) => {
    if (!user) return null;

    const { data } = await supabase
      .from('scraper_schedules')
      .select('*')
      .eq('market_id', marketId)
      .eq('user_id', user.id)
      .maybeSingle();

    return data;
  };

  return {
    updateSchedule,
    getSchedule,
    loading,
  };
}