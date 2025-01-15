export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface Market {
  id: string;
  name: string;
  state: string;
  totalLeads: number;
  price: number;
  trial_days?: number;
  features?: string[];
  isSubscribed: boolean;
}

export interface Address {
  street: string;
  suite?: string;
  city: string;
  state: string;
  zip: string;
}

export interface Contact {
  name: string;
  phone: string;
}

export interface Lead {
  id: string;
  businessName: string;
  address: Address;
  predictedMoveDate?: string;
  contact: Contact;
  isNew: boolean;
  inCRM: boolean;
  addedAt: string;
}