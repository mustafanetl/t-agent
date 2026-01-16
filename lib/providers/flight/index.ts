import type { Deal, SearchInput } from '@/lib/types';
import { mockProvider } from '@/lib/providers/flight/mock';
import { amadeusProvider } from '@/lib/providers/flight/amadeus';

export type FlightProvider = {
  name: string;
  searchDeals: (input: SearchInput) => Promise<Deal[]>;
};

export const getFlightProvider = (): FlightProvider => {
  if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    return amadeusProvider;
  }
  return mockProvider;
};
