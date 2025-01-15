import { Lead } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Building, Calendar, Phone, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate, formatRelativeDate } from '@/lib/dates';
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
  // Combine address components with null checks
  const addressParts = {
    line1: lead.address.street,
    line2: lead.address.suite,
    line3: [
      lead.address.city,
      lead.address.state,
      lead.address.zip
    ].filter(Boolean).join(', ')
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
        <div className="space-y-1">
          {addressParts.line1 && (
            <p className="text-sm text-muted-foreground">{addressParts.line1}</p>
          )}
          {addressParts.line2 && (
            <p className="text-sm text-muted-foreground">{addressParts.line2}</p>
          )}
          {addressParts.line3 && (
            <p className="text-sm text-muted-foreground">{addressParts.line3}</p>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Predicted Move Date: {formatDate(lead.predictedMoveDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{lead.contact.name} - {lead.contact.phone}</span>
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