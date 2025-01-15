import { Lead } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Building, Calendar, Phone, Mail, Trash2, CheckCircle2, UserCircle2, Users } from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/lib/dates';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface LeadCardProps {
  lead: Lead;
  onToggleCRM: (leadId: string) => void;
  onDelete: (leadId: string) => void;
}

export function LeadCard({ lead, onToggleCRM, onDelete }: LeadCardProps) {
  // Get number of contacts
  const contactCount = [
    lead.contact1_name,
    lead.contact2_name,
    lead.contact3_name
  ].filter(Boolean).length;

  // Format address parts
  const addressParts = [
    lead.address.street, // Main street address
    lead.address.suite, // Suite number
    `${lead.address.city}, ${lead.address.state} ${lead.address.zip}` // City, state, zip
  ].filter(Boolean);

  // Helper function to render a contact
  const renderContact = (
    name?: string,
    role?: string,
    email?: string,
    phone?: string
  ) => {
    if (!name) return null;

    return (
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-2">
          <UserCircle2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{name}</span>
          {role && <span className="text-sm text-muted-foreground">({role})</span>}
        </div>
        <div className="ml-6 space-y-1 text-sm">
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            </div>
          )}
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
                {phone}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Building className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">{lead.businessName}</h3>
          {lead.isNew && (
            <Badge variant="default" className="bg-green-500">NEW</Badge>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Lead</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this lead? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(lead.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {addressParts.length > 0 && (
          <div className="space-y-1">
            {addressParts.map((part, index) => (
              <p key={index} className="text-sm text-muted-foreground">{part}</p>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                {contactCount} Contact{contactCount !== 1 ? 's' : ''}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contacts</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 divide-y">
                {renderContact(
                  lead.contact1_name,
                  lead.contact1_role,
                  lead.contact1_email,
                  lead.contact1_phone
                )}
                {renderContact(
                  lead.contact2_name,
                  lead.contact2_role,
                  lead.contact2_email,
                  lead.contact2_phone
                )}
                {renderContact(
                  lead.contact3_name,
                  lead.contact3_role,
                  lead.contact3_email,
                  lead.contact3_phone
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Predicted Move Date: {lead.predictedMoveDate ? formatDate(lead.predictedMoveDate) : 'Not set'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <p className="text-xs text-muted-foreground">
          Added {formatRelativeDate(lead.addedAt)}
        </p>
        <Button
          variant={lead.inCRM ? "secondary" : "outline"}
          onClick={() => onToggleCRM(lead.id)}
          className="gap-2"
        >
          {lead.inCRM ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              In CRM
            </>
          ) : (
            'In CRM?'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}