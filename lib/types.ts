export type Deal = {
  id: string;
  destination: string;
  cityCode: string;
  minPrice: number;
  currency: string;
  lat: number;
  lng: number;
  departFrom: string;
  departTo: string;
  provider: string;
  deepLink: string;
};

export type SearchInput = {
  origins: string[];
  tripLength: string;
  partyType: string;
  vibeTags: string[];
  budget: number;
  directOnly: boolean;
};
