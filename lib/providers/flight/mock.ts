import type { FlightProvider } from '@/lib/providers/flight';
import { mockDeals } from '@/lib/mock-data';

export const mockProvider: FlightProvider = {
  name: 'mock',
  async searchDeals() {
    return mockDeals.slice(0, 15);
  }
};
