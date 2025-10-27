import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FlightData } from '../types';

interface FlightStore {
  flights: FlightData[];
  favorites: string[];
  selectedFlight: FlightData | null;
  filters: {
    airline: string;
    status: string;
    altitude: string;
  };
  setFlights: (flights: FlightData[]) => void;
  setSelectedFlight: (flight: FlightData | null) => void;
  toggleFavorite: (flightId: string) => void;
  setFilters: (filters: Partial<FlightStore['filters']>) => void;
  getFilteredFlights: () => FlightData[];
}

export const useFlightStore = create<FlightStore>()(
  persist(
    (set, get) => ({
      flights: [],
      favorites: [],
      selectedFlight: null,
      filters: {
        airline: '',
        status: '',
        altitude: '',
      },
      setFlights: (flights) => set({ flights }),
      setSelectedFlight: (flight) => set({ selectedFlight: flight }),
      toggleFavorite: (flightId) => {
        const { favorites } = get();
        if (favorites.includes(flightId)) {
          set({ favorites: favorites.filter(id => id !== flightId) });
        } else {
          set({ favorites: [...favorites, flightId] });
        }
      },
      setFilters: (newFilters) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },
      getFilteredFlights: () => {
        const { flights, filters } = get();
        return flights.filter(flight => {
          if (filters.airline && !flight.airline.toLowerCase().includes(filters.airline.toLowerCase())) {
            return false;
          }
          if (filters.status && flight.status !== filters.status) {
            return false;
          }
          if (filters.altitude) {
            const altitude = parseInt(flight.altitude);
            if (filters.altitude === 'low' && altitude > 20000) return false;
            if (filters.altitude === 'medium' && (altitude < 20000 || altitude > 35000)) return false;
            if (filters.altitude === 'high' && altitude < 35000) return false;
          }
          return true;
        });
      },
    }),
    {
      name: 'flight-store',
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
