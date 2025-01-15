import { parse } from 'date-fns';
import { ScrapedProperty, ProcessedLead } from './types';

export function processCsvData(csvContent: string): ScrapedProperty[] {
  // Split CSV content into lines and process
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      propertyUrl: values[0],
      name: values[1],
      address: values[2],
      space: values[3],
      size: values[4],
      availableDate: values[9], // 'Available' column
    };
  });
}

export function calculateMoveDate(availableDate: string): string {
  try {
    const date = parse(availableDate, 'MMMM dd, yyyy', new Date());
    date.setDate(date.getDate() - 30); // Subtract 30 days
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error calculating move date:', error);
    return '';
  }
}

export function parseAddress(address: string): {
  street: string;
  city: string;
  state: string;
  zip: string;
} {
  // Example: "123 Main St, San Diego, CA 92101"
  const parts = address.split(',').map(part => part.trim());
  const street = parts[0];
  const city = parts[1];
  const stateZip = parts[2]?.split(' ') || [];
  
  return {
    street,
    city,
    state: stateZip[0] || '',
    zip: stateZip[1] || '',
  };
}

export function processLeads(properties: ScrapedProperty[]): ProcessedLead[] {
  return properties.map(property => {
    const address = parseAddress(property.address);
    const moveDate = calculateMoveDate(property.availableDate);
    
    // Extract suite number from space field if available
    const suiteParts = property.space.match(/Suite\s+(\d+)/i);
    const suite = suiteParts ? suiteParts[1] : '';

    return {
      propertyUrl: property.propertyUrl,
      address: address.street,
      suite,
      city: address.city,
      state: address.state,
      zip: address.zip,
      moveDate,
      availableDate: property.availableDate,
      isProcessed: false,
    };
  });
}