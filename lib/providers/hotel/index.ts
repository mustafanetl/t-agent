export type HotelProvider = {
  name: string;
  searchHotels: (city: string) => Promise<void>;
};

export const placeholderHotelProvider: HotelProvider = {
  name: 'placeholder',
  async searchHotels() {
    return;
  }
};
