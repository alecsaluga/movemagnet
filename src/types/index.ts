export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface MarketFeature {
  title: string;
  description?: string;
}

export interface Market {
  id: string;
  name: string;
  state: string;
  totalLeads: number;
  price: number;
  trial_days?: number;
  features?: MarketFeature[];
  isSubscribed: boolean;
}

export interface Address {
  street: string;
  suite?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Lead {
  id: string;
  businessName: string;
  address: Address;
  predictedMoveDate?: string;
  contact1_name?: string;
  contact1_role?: string;
  contact1_email?: string;
  contact1_phone?: string;
  contact2_name?: string;
  contact2_role?: string;
  contact2_email?: string;
  contact2_phone?: string;
  contact3_name?: string;
  contact3_role?: string;
  contact3_email?: string;
  contact3_phone?: string;
  isNew: boolean;
  inCRM: boolean;
  addedAt: string;
}