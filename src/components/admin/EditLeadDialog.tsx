import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

interface Lead {
  id: string;
  business_name: string;
  address: string;
  suite: string | null;
  city: string;
  state: string;
  zip: string;
  move_date: string | null;
  predicted_move_date: string | null;
  contact1_name: string | null;
  contact1_role: string | null;
  contact1_email: string | null;
  contact1_phone: string | null;
  contact2_name: string | null;
  contact2_role: string | null;
  contact2_email: string | null;
  contact2_phone: string | null;
  contact3_name: string | null;
  contact3_role: string | null;
  contact3_email: string | null;
  contact3_phone: string | null;
  is_new: boolean;
  in_crm: boolean;
}

interface EditLeadDialogProps {
  lead: Lead;
  onLeadUpdated: () => void;
}

export function EditLeadDialog({ lead, onLeadUpdated }: EditLeadDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: lead.business_name,
    address: lead.address,
    suite: lead.suite || '',
    city: lead.city,
    state: lead.state,
    zip: lead.zip,
    moveDate: lead.move_date || '',
    predictedMoveDate: lead.predicted_move_date || '',
    contact1Name: lead.contact1_name || '',
    contact1Role: lead.contact1_role || '',
    contact1Email: lead.contact1_email || '',
    contact1Phone: lead.contact1_phone || '',
    contact2Name: lead.contact2_name || '',
    contact2Role: lead.contact2_role || '',
    contact2Email: lead.contact2_email || '',
    contact2Phone: lead.contact2_phone || '',
    contact3Name: lead.contact3_name || '',
    contact3Role: lead.contact3_role || '',
    contact3Email: lead.contact3_email || '',
    contact3Phone: lead.contact3_phone || '',
    isNew: lead.is_new,
    inCRM: lead.in_crm,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          business_name: formData.businessName,
          address: formData.address,
          suite: formData.suite || null,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          move_date: formData.moveDate || null,
          predicted_move_date: formData.predictedMoveDate || null,
          contact1_name: formData.contact1Name || null,
          contact1_role: formData.contact1Role || null,
          contact1_email: formData.contact1Email || null,
          contact1_phone: formData.contact1Phone || null,
          contact2_name: formData.contact2Name || null,
          contact2_role: formData.contact2Role || null,
          contact2_email: formData.contact2Email || null,
          contact2_phone: formData.contact2Phone || null,
          contact3_name: formData.contact3Name || null,
          contact3_role: formData.contact3Role || null,
          contact3_email: formData.contact3Email || null,
          contact3_phone: formData.contact3Phone || null,
          is_new: formData.isNew,
          in_crm: formData.inCRM,
        })
        .eq('id', lead.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Lead updated successfully',
      });

      setOpen(false);
      onLeadUpdated();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: 'Error',
        description: 'Failed to update lead',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
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
                  <Label>Secondary Contact</Label>
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
                  <Label>Tertiary Contact</Label>
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}