import type { FlightProvider } from '@/lib/providers/flight';
import { mockDeals } from '@/lib/mock-data';

export const amadeusProvider: FlightProvider = {
  name: 'amadeus',
  async searchDeals() {
    // TODO: integrate Amadeus API. Returning mock data for now.
    return mockDeals.slice(0, 12);
  }
};
