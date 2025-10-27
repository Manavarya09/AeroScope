import { FlightData } from '../types';

const OPENSKY_BASE_URL = 'https://opensky-network.org/api';

export const fetchFlights = async (bounds?: { minLat: number; maxLat: number; minLon: number; maxLon: number }): Promise<FlightData[]> => {
  try {
    let url = `${OPENSKY_BASE_URL}/states/all`;

    // If bounds are provided, filter flights within the map bounds
    if (bounds) {
      url += `?lamin=${bounds.minLat}&lomin=${bounds.minLon}&lamax=${bounds.maxLat}&lomax=${bounds.maxLon}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.states) {
      console.error('Invalid response from OpenSky API');
      return [];
    }

    return data.states.map((flight: any) => ({
      id: flight[0] || Math.random().toString(36).substr(2, 9), // ICAO24 as ID
      flightNumber: flight[1] || 'Unknown', // Callsign
      airline: flight[1] ? flight[1].substring(0, 3) : 'Unknown', // First 3 letters as airline code
      origin: flight[2] || 'Unknown', // Origin country
      destination: flight[3] || 'Unknown', // Destination country
      altitude: flight[7] ? Math.round(flight[7] * 3.28084).toString() : '0', // Convert meters to feet
      speed: flight[9] ? Math.round(flight[9] * 1.94384).toString() : '0', // Convert m/s to knots
      status: flight[8] > 0 ? 'En Route' : 'Grounded', // True airspeed > 0 means flying
      eta: 'Unknown', // OpenSky doesn't provide ETA
      latitude: flight[6] || 0,
      longitude: flight[5] || 0,
      heading: flight[10] || 0,
    })).filter((flight: FlightData) =>
      flight.latitude !== 0 &&
      flight.longitude !== 0 &&
      flight.latitude >= -90 &&
      flight.latitude <= 90 &&
      flight.longitude >= -180 &&
      flight.longitude <= 180
    );
  } catch (error) {
    console.error('Error fetching flights from OpenSky:', error);
    return getMockFlights();
  }
};

// Enhanced mock data with more realistic flight patterns
export const getMockFlights = (): FlightData[] => {
  const airlines = [
    'Emirates', 'British Airways', 'Singapore Airlines', 'Lufthansa', 'Air France',
    'Delta', 'United', 'American Airlines', 'KLM', 'Qatar Airways',
    'Turkish Airlines', 'Etihad', 'Cathay Pacific', 'Japan Airlines', 'Korean Air'
  ];

  const airports = [
    { code: 'DXB', name: 'Dubai', lat: 25.2532, lon: 55.3657 },
    { code: 'LHR', name: 'London Heathrow', lat: 51.4700, lon: -0.4543 },
    { code: 'SIN', name: 'Singapore', lat: 1.3644, lon: 103.9915 },
    { code: 'FRA', name: 'Frankfurt', lat: 50.0333, lon: 8.5706 },
    { code: 'CDG', name: 'Paris Charles de Gaulle', lat: 49.0097, lon: 2.5479 },
    { code: 'JFK', name: 'New York JFK', lat: 40.6413, lon: -73.7781 },
    { code: 'SFO', name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
    { code: 'ICN', name: 'Seoul Incheon', lat: 37.4602, lon: 126.4407 },
    { code: 'NRT', name: 'Tokyo Narita', lat: 35.7653, lon: 140.3856 },
    { code: 'DOH', name: 'Doha', lat: 25.2731, lon: 51.6081 }
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const origin = airports[Math.floor(Math.random() * airports.length)];
    const destination = airports[Math.floor(Math.random() * airports.length)];

    // Create realistic flight paths
    const progress = Math.random();
    const lat = origin.lat + (destination.lat - origin.lat) * progress + (Math.random() - 0.5) * 0.2;
    const lon = origin.lon + (destination.lon - origin.lon) * progress + (Math.random() - 0.5) * 0.2;

    const altitude = 30000 + Math.random() * 10000;
    const speed = 450 + Math.random() * 100;

    return {
      id: `mock-${i}`,
      flightNumber: `${airline.substring(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
      airline,
      origin: origin.code,
      destination: destination.code,
      altitude: Math.round(altitude).toString(),
      speed: Math.round(speed).toString(),
      status: progress > 0.95 ? 'Landing' : 'En Route',
      eta: `${Math.floor(1 + Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      latitude: Math.max(-85, Math.min(85, lat)), // Clamp to valid lat range
      longitude: Math.max(-180, Math.min(180, lon)), // Clamp to valid lon range
      heading: Math.floor(Math.random() * 360),
    };
  });
};

// Get flights within map bounds for better performance
export const fetchFlightsInBounds = async (bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number }): Promise<FlightData[]> => {
  return fetchFlights(bounds);
};

// Get specific flight details (OpenSky doesn't provide detailed flight info, so we'll use mock data)
export const getFlightDetails = async (flightId: string): Promise<any> => {
  // OpenSky doesn't provide detailed flight info, return mock data for now
  const flights = getMockFlights();
  return flights.find(f => f.id === flightId) || null;
};
