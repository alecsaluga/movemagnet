import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CsvUploadDialogProps {
  marketId: string;
  onUploaded: () => void;
}

export function CsvUploadDialog({ marketId, onUploaded }: CsvUploadDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const processCSV = async (text: string) => {
    const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
    const headers = rows[0].map(header => header.toLowerCase());

    // Validate required columns
    const requiredColumns = ['business_name', 'address', 'city', 'state', 'zip'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
    }

    // Process each row
    const leads = rows.slice(1).filter(row => row.length === headers.length).map(row => {
      const lead: Record<string, any> = {
        market_id: marketId,
        is_new: true,
        in_crm: false
      };

      headers.forEach((header, index) => {
        if (row[index]) {
          switch (header) {
            case 'business_name':
            case 'address':
            case 'suite':
            case 'city':
            case 'state':
            case 'zip':
              lead[header] = row[index];
              break;
            case 'move_date':
              lead.move_date = row[index] ? new Date(row[index]).toISOString() : null;
              break;
            case 'contact1_name':
            case 'contact1_role':
            case 'contact1_email':
            case 'contact1_phone':
            case 'contact2_name':
            case 'contact2_role':
            case 'contact2_email':
            case 'contact2_phone':
            case 'contact3_name':
            case 'contact3_role':
            case 'contact3_email':
            case 'contact3_phone':
              lead[header] = row[index] || null;
              break;
          }
        }
      });

      return lead;
    });

    return leads;
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: 'Error',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const text = await file.text();
      const leads = await processCSV(text);

      if (leads.length === 0) {
        throw new Error('No valid leads found in CSV');
      }

      const { error } = await supabase.from('leads').insert(leads);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${leads.length} leads imported successfully`,
      });

      setOpen(false);
      onUploaded();
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process CSV file',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Leads from CSV</DialogTitle>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            CSV must include these columns: business_name, address, city, state, zip
          </AlertDescription>
        </Alert>

        <div
          className={`
            mt-4 border-2 border-dashed rounded-lg p-8
            ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          `}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <FileUp className={`h-8 w-8 ${dragActive ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Drag and drop your CSV file here, or{' '}
                <label className="text-primary hover:underline cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    onChange={handleChange}
                    disabled={loading}
                  />
                </label>
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mt-4">
          <p>Optional columns:</p>
          <ul className="list-disc list-inside mt-2">
            <li>suite</li>
            <li>move_date (YYYY-MM-DD format)</li>
            <li>contact1_name, contact1_role, contact1_email, contact1_phone</li>
            <li>contact2_name, contact2_role, contact2_email, contact2_phone</li>
            <li>contact3_name, contact3_role, contact3_email, contact3_phone</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}