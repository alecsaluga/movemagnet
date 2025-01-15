import { MarketConfig } from './types';

export const marketConfigs: MarketConfig[] = [
  {
    id: 'denver',
    name: 'Denver',
    state: 'CO',
    baseUrl: 'https://www.loopnet.com',
    searchPath: '/search/for-lease/denver-co',
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    state: 'AZ',
    baseUrl: 'https://www.loopnet.com',
    searchPath: '/search/for-lease/phoenix-az',
  },
  // Add more markets as needed
];