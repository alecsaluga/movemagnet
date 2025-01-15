import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface AddLeadDialogProps {
  marketId: string;
  onLeadAdded?: () => void;
}

export function AddLeadDialog({ marketId, onLeadAdded }: AddLeadDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    street: '',
    suite: '',
    city: '',
    state: '',
    zip: '',
    moveDate: '',
    contact1Name: '',
    contact1Phone: '',
    contact1Email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Validate required fields
      if (!formData.businessName || !formData.street || !formData.city || !formData.state || !formData.zip) {
        throw new Error('Please fill in all required fields');
      }

      // Insert lead with correct field names
      const { error } = await supabase.from('leads').insert({
        market_id: marketId,
        business_name: formData.businessName,
        address: formData.street, // Changed from street to address
        suite: formData.suite || null,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        move_date: formData.moveDate || null,
        contact1_name: formData.contact1Name || null,
        contact1_phone: formData.contact1Phone || null,
        contact1_email: formData.contact1Email || null,
        is_new: true
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: 'Success',
        description: 'Lead added successfully',
      });

      setOpen(false);
      onLeadAdded?.();

      // Reset form
      setFormData({
        businessName: '',
        street: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        moveDate: '',
        contact1Name: '',
        contact1Phone: '',
        contact1Email: '',
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suite">Suite (Optional)</Label>
            <Input
              id="suite"
              value={formData.suite}
              onChange={(e) => setFormData({ ...formData, suite: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP *</Label>
              <Input
                id="zip"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moveDate">Move Date</Label>
            <Input
              id="moveDate"
              type="date"
              value={formData.moveDate}
              onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact1Name">Contact Name</Label>
            <Input
              id="contact1Name"
              value={formData.contact1Name}
              onChange={(e) => setFormData({ ...formData, contact1Name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact1Phone">Phone</Label>
              <Input
                id="contact1Phone"
                type="tel"
                value={formData.contact1Phone}
                onChange={(e) => setFormData({ ...formData, contact1Phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact1Email">Email</Label>
              <Input
                id="contact1Email"
                type="email"
                value={formData.contact1Email}
                onChange={(e) => setFormData({ ...formData, contact1Email: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}