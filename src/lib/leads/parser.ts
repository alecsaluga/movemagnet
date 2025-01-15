import { parse } from 'date-fns';

export interface ParsedLead {
  propertyUrl: string;
  address: string;
  suite: string | null;
  city: string;
  state: string;
  zip: string;
  size: string;
  availableDate: string;
  moveDate: string;
}

export function parseCSV(csvContent: string): ParsedLead[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index]?.trim() || '';
    });

    // Parse address components
    const addressParts = record.address.split(',').map(p => p.trim());
    const [street, city, stateZip] = addressParts;
    const [state, zip] = stateZip?.split(' ') || [];

    // Extract suite from space field if present
    const suiteMatch = record.space?.match(/suite\s+(\d+)/i);
    const suite = suiteMatch ? suiteMatch[1] : null;

    // Calculate move date (30 days before available)
    const availableDate = parse(record.available, 'MMMM d, yyyy', new Date());
    const moveDate = new Date(availableDate);
    moveDate.setDate(moveDate.getDate() - 30);

    return {
      propertyUrl: record['property url'],
      address: street,
      suite,
      city,
      state,
      zip,
      size: record.size,
      availableDate: availableDate.toISOString(),
      moveDate: moveDate.toISOString(),
    };
  });
}