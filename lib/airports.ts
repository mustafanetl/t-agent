import airportsData from '@/data/airports.json';

export type Airport = {
  iata: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const airports = airportsData as Airport[];
