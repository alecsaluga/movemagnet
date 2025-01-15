import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
  marketName: string;
  onLeadAdded?: () => void;
}

const initialFormData = {
  businessName: '',
  address: '',
  suite: '',
  city: '',
  state: '',
  zip: '',
  moveDate: '',
  predictedMoveDate: '',
  isNew: true,
  inCRM: false,
  contact1Name: '',
  contact1Role: '',
  contact1Email: '',
  contact1Phone: '',
  contact2Name: '',
  contact2Role: '',
  contact2Email: '',
  contact2Phone: '',
  contact3Name: '',
  contact3Role: '',
  contact3Email: '',
  contact3Phone: '',
};

export function AddLeadDialog({ marketId, marketName, onLeadAdded }: AddLeadDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add leads',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Validate required fields
      if (!formData.businessName.trim()) {
        throw new Error('Business name is required');
      }
      if (!formData.address.trim()) {
        throw new Error('Street address is required');
      }
      if (!formData.city.trim()) {
        throw new Error('City is required');
      }
      if (!formData.state.trim()) {
        throw new Error('State is required');
      }
      if (!formData.zip.trim()) {
        throw new Error('ZIP code is required');
      }

      // Format dates properly for PostgreSQL
      const moveDate = formData.moveDate ? new Date(formData.moveDate).toISOString() : null;
      const predictedMoveDate = formData.predictedMoveDate 
        ? new Date(formData.predictedMoveDate).toISOString() 
        : null;

      const { data, error } = await supabase.from('leads').insert({
        market_id: marketId,
        business_name: formData.businessName.trim(),
        address: formData.address.trim(),
        suite: formData.suite.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip: formData.zip.trim(),
        move_date: moveDate,
        predicted_move_date: predictedMoveDate,
        is_new: formData.isNew,
        in_crm: formData.inCRM,
        contact1_name: formData.contact1Name.trim() || null,
        contact1_role: formData.contact1Role.trim() || null,
        contact1_email: formData.contact1Email.trim() || null,
        contact1_phone: formData.contact1Phone.trim() || null,
        contact2_name: formData.contact2Name.trim() || null,
        contact2_role: formData.contact2Role.trim() || null,
        contact2_email: formData.contact2Email.trim() || null,
        contact2_phone: formData.contact2Phone.trim() || null,
        contact3_name: formData.contact3Name.trim() || null,
        contact3_role: formData.contact3Role.trim() || null,
        contact3_email: formData.contact3Email.trim() || null,
        contact3_phone: formData.contact3Phone.trim() || null,
        user_id: user.id
      }).select().single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A lead with this business name already exists in this market');
        } else if (error.code === '23503') {
          throw new Error('Invalid market selected');
        } else {
          console.error('Supabase error:', error);
          throw new Error(error.message);
        }
      }

      toast({
        title: 'Success',
        description: 'Lead added successfully',
      });

      setFormData(initialFormData);
      setOpen(false);
      onLeadAdded?.();
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
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Lead to {marketName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <Label>Business Information</Label>
              <div className="grid gap-4 mt-2">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="suite">Suite/Unit (Optional)</Label>
                    <Input
                      id="suite"
                      value={formData.suite}
                      onChange={(e) => setFormData({ ...formData, suite: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label>Additional Information</Label>
              <div className="grid gap-4 mt-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="moveDate">Move Date</Label>
                    <Input
                      id="moveDate"
                      type="date"
                      value={formData.moveDate}
                      onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="predictedMoveDate">Predicted Move Date</Label>
                    <Input
                      id="predictedMoveDate"
                      type="date"
                      value={formData.predictedMoveDate}
                      onChange={(e) => setFormData({ ...formData, predictedMoveDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isNew"
                      checked={formData.isNew}
                      onCheckedChange={(checked) => setFormData({ ...formData, isNew: checked })}
                    />
                    <Label htmlFor="isNew">New Lead</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="inCRM"
                      checked={formData.inCRM}
                      onCheckedChange={(checked) => setFormData({ ...formData, inCRM: checked })}
                    />
                    <Label htmlFor="inCRM">In CRM</Label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label>Contact Information</Label>
              <div className="space-y-4 mt-2">
                {/* Primary Contact */}
                <div className="space-y-4">
                  <Label>Primary Contact</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact1Name">Name</Label>
                      <Input
                        id="contact1Name"
                        value={formData.contact1Name}
                        onChange={(e) => setFormData({ ...formData, contact1Name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact1Role">Role</Label>
                      <Input
                        id="contact1Role"
                        value={formData.contact1Role}
                        onChange={(e) => setFormData({ ...formData, contact1Role: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact1Email">Email</Label>
                      <Input
                        id="contact1Email"
                        type="email"
                        value={formData.contact1Email}
                        onChange={(e) => setFormData({ ...formData, contact1Email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact1Phone">Phone</Label>
                      <Input
                        id="contact1Phone"
                        type="tel"
                        value={formData.contact1Phone}
                        onChange={(e) => setFormData({ ...formData, contact1Phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Secondary Contact */}
                <div className="space-y-4">
                  <Label>Secondary Contact (Optional)</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact2Name">Name</Label>
                      <Input
                        id="contact2Name"
                        value={formData.contact2Name}
                        onChange={(e) => setFormData({ ...formData, contact2Name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact2Role">Role</Label>
                      <Input
                        id="contact2Role"
                        value={formData.contact2Role}
                        onChange={(e) => setFormData({ ...formData, contact2Role: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact2Email">Email</Label>
                      <Input
                        id="contact2Email"
                        type="email"
                        value={formData.contact2Email}
                        onChange={(e) => setFormData({ ...formData, contact2Email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact2Phone">Phone</Label>
                      <Input
                        id="contact2Phone"
                        type="tel"
                        value={formData.contact2Phone}
                        onChange={(e) => setFormData({ ...formData, contact2Phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Tertiary Contact */}
                <div className="space-y-4">
                  <Label>Tertiary Contact (Optional)</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact3Name">Name</Label>
                      <Input
                        id="contact3Name"
                        value={formData.contact3Name}
                        onChange={(e) => setFormData({ ...formData, contact3Name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact3Role">Role</Label>
                      <Input
                        id="contact3Role"
                        value={formData.contact3Role}
                        onChange={(e) => setFormData({ ...formData, contact3Role: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="contact3Email">Email</Label>
                      <Input
                        id="contact3Email"
                        type="email"
                        value={formData.contact3Email}
                        onChange={(e) => setFormData({ ...formData, contact3Email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact3Phone">Phone</Label>
                      <Input
                        id="contact3Phone"
                        type="tel"
                        value={formData.contact3Phone}
                        onChange={(e) => setFormData({ ...formData, contact3Phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
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