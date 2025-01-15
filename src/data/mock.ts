import { Market, Lead, User } from '@/types';

export const currentUser: User = {
  name: 'John Doe',
  email: 'john@example.com',
};

export const markets: Market[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'San Diego',
    state: 'CA',
    totalLeads: 156,
    price: 0, // Free market
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Los Angeles',
    state: 'CA',
    totalLeads: 234,
    price: 299,
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'San Francisco',
    state: 'CA',
    totalLeads: 187,
    price: 349,
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'New York',
    state: 'NY',
    totalLeads: 312,
    price: 399,
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174004',
    name: 'Chicago',
    state: 'IL',
    totalLeads: 178,
    price: 299,
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174005',
    name: 'Miami',
    state: 'FL',
    totalLeads: 145,
    price: 299,
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174006',
    name: 'Houston',
    state: 'TX',
    totalLeads: 167,
    price: 299,
    isSubscribed: false,
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174007',
    name: 'Seattle',
    state: 'WA',
    totalLeads: 143,
    price: 299,
    isSubscribed: false,
  }
];

export const leads: Lead[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174008',
    businessName: 'Azith Inc',
    address: {
      street: '123 Sunset Blvd',
      suite: '#123',
      city: 'Denver',
      state: 'CO',
      zip: '80201',
    },
    moveDate: '2024-02-31',
    contact: {
      name: 'Mary Lee',
      phone: '303.111.1111',
    },
    isNew: true,
    inCRM: false,
    addedAt: '2024-01-15T08:00:00Z',
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174009',
    businessName: 'TechFlow Solutions',
    address: {
      street: '456 Innovation Way',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
    },
    moveDate: '2024-03-15',
    contact: {
      name: 'James Wilson',
      phone: '303.222.2222',
    },
    isNew: false,
    inCRM: true,
    addedAt: '2024-01-10T10:30:00Z',
  },
];