import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface ScraperJob {
  id: string;
  market_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  total_leads?: number;
  new_leads?: number;
  error?: string;
}

export function useScraperJobs(marketId?: string) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<ScraperJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const query = supabase
      .from('scraper_jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('started_at', { ascending: false });

    if (marketId) {
      query.eq('market_id', marketId);
    }

    const subscription = query.on('*', payload => {
      setJobs(current => {
        const updated = [...current];
        const index = updated.findIndex(job => job.id === payload.new.id);
        if (index >= 0) {
          updated[index] = payload.new;
        } else {
          updated.unshift(payload.new);
        }
        return updated;
      });
    }).subscribe();

    // Initial fetch
    query.then(({ data }) => {
      if (data) setJobs(data);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user, marketId]);

  return {
    jobs,
    loading,
  };
}