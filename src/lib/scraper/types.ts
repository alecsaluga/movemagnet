export interface ScrapedProperty {
  propertyUrl: string;
  name: string;
  address: string;
  space: string;
  size: string;
  availableDate: string;
}

export interface ProcessedLead {
  propertyUrl: string;
  address: string;
  suite: string;
  city: string;
  state: string;
  zip: string;
  moveDate: string;
  availableDate: string;
  businessName?: string;
  contactPhone?: string;
  isProcessed: boolean;
}

export interface GooglePlacesResult {
  businessName: string;
  phoneNumber: string;
}