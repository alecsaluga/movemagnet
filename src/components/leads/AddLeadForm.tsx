import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateMarketLeadCount } from '@/lib/markets';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

// ... rest of the imports

export function AddLeadForm({ marketId, onLeadAdded }: AddLeadFormProps) {
  // ... existing state and other code

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('leads').insert({
        market_id: marketId,
        business_name: formData.businessName,
        street: formData.street,
        suite: formData.suite || null,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        move_date: formData.moveDate,
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        is_new: true,
        user_id: user.id,
      });

      if (error) throw error;

      // Update market lead count
      await updateMarketLeadCount(marketId);

      toast({
        title: 'Success',
        description: 'Lead added successfully',
      });

      setOpen(false);
      onLeadAdded?.();
      setFormData({
        businessName: '',
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        moveDate: '',
        contactName: '',
        contactPhone: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component
}