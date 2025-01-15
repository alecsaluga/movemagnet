import { findBusinessAtAddress } from '@/lib/google/places';
import { parseCSV, ParsedLead } from './parser';

export interface ProcessedLead extends ParsedLead {
  businessName: string | null;
  phoneNumber: string | null;
}

export async function processLeads(csvContent: string): Promise<ProcessedLead[]> {
  // Parse CSV data
  const parsedLeads = parseCSV(csvContent);
  
  // Process each lead
  const processedLeads: ProcessedLead[] = [];
  
  for (const lead of parsedLeads) {
    // Build full address for Google Places lookup
    const fullAddress = [
      lead.address,
      lead.suite && `Suite ${lead.suite}`,
      lead.city,
      lead.state,
      lead.zip
    ].filter(Boolean).join(', ');

    // Get business info from Google Places
    const placeInfo = await findBusinessAtAddress(fullAddress);
    
    processedLeads.push({
      ...lead,
      businessName: placeInfo.businessName,
      phoneNumber: placeInfo.phoneNumber,
    });
  }

  return processedLeads;
}