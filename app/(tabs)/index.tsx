import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import MapboxGL from '@/src/utils/mapbox';
import { useFlightStore } from '@/src/store/flightStore';
import { fetchFlights, getMockFlights } from '@/src/api/aviationStack';
import BottomSheetDetails from '@/components/BottomSheetDetails';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import CommandBar from '@/components/CommandBar';
import RadarPulse from '@/components/RadarPulse';
import { FlightData } from '@/src/types';

const { width, height } = Dimensions.get('window');

// Airport coordinates mapping
const getAirportCoordinates = (airportCode: string) => {
  const airportMap: { [key: string]: { lat: number; lon: number } } = {
    'DXB': { lat: 25.2532, lon: 55.3657 },
    'LHR': { lat: 51.4700, lon: -0.4543 },
    'SIN': { lat: 1.3644, lon: 103.9915 },
    'FRA': { lat: 50.0333, lon: 8.5706 },
    'CDG': { lat: 49.0097, lon: 2.5479 },
    'JFK': { lat: 40.6413, lon: -73.7781 },
    'SFO': { lat: 37.7749, lon: -122.4194 },
    'ICN': { lat: 37.4602, lon: 126.4407 },
    'NRT': { lat: 35.7653, lon: 140.3856 },
    'DOH': { lat: 25.2731, lon: 51.6081 },
    'Unknown': { lat: 40.7128, lon: -74.0060 }, // Default to NYC
  };

  return airportMap[airportCode] || airportMap['Unknown'];
};

export default function HomeScreen() {
  const { flights, setFlights, selectedFlight, setSelectedFlight, getFilteredFlights } = useFlightStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showCommandBar, setShowCommandBar] = useState(false);
  const [mapBounds, setMapBounds] = useState<{
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  } | null>(null);

  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  useEffect(() => {
    // In development, use mock data
    // In production, use fetchFlights()
    const mockData = getMockFlights();
    setFlights(mockData);

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      updateFlights();
    }, 10000); // Update every 10 seconds for better performance

    return () => clearInterval(interval);
  }, [setFlights]);

  const updateFlights = async () => {
    try {
      let flightsData: FlightData[];

      if (mapBounds) {
        // Use real API with bounds when available
        flightsData = await fetchFlights(mapBounds);
      } else {
        // Use mock data as fallback
        flightsData = getMockFlights();
      }

      setFlights(flightsData);
    } catch (error) {
      console.error('Error updating flights:', error);
      // Fallback to mock data on error
      setFlights(getMockFlights());
    }
  };

  const filteredFlights = getFilteredFlights();

  const handleMapRegionChange = (region: any) => {
    if (region && region.latitude && region.longitude) {
      const bounds = {
        minLat: region.latitude - region.latitudeDelta / 2,
        maxLat: region.latitude + region.latitudeDelta / 2,
        minLon: region.longitude - region.longitudeDelta / 2,
        maxLon: region.longitude + region.longitudeDelta / 2,
      };
      setMapBounds(bounds);
    }
  };

  const handleMarkerPress = (flight: FlightData) => {
    setSelectedFlight(flight);
    // Center map on selected flight
    if (cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [flight.longitude, flight.latitude],
        zoomLevel: 8,
        animationDuration: 1000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Dark}
        onRegionDidChange={handleMapRegionChange}
        compassEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={[-74.0060, 40.7128]}
          zoomLevel={2}
          animationMode="flyTo"
          animationDuration={2000}
        />

        {/* Flight markers */}
        {filteredFlights.map((flight) => (
          <MapboxGL.PointAnnotation
            key={flight.id}
            id={flight.id}
            coordinate={[flight.longitude, flight.latitude]}
            onSelected={() => handleMarkerPress(flight)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.planeMarker}>
                <Text style={styles.markerText}>{flight.flightNumber}</Text>
              </View>
            </View>
          </MapboxGL.PointAnnotation>
        ))}

        {/* Animated flight paths with trails */}
        {filteredFlights.map((flight, index) => {
          const originCoords = getAirportCoordinates(flight.origin);
          const destCoords = getAirportCoordinates(flight.destination);

          return (
            <MapboxGL.ShapeSource
              key={`path-${flight.id}`}
              id={`path-${flight.id}`}
              shape={{
                type: 'LineString',
                coordinates: [
                  [originCoords.lon, originCoords.lat],
                  [flight.longitude, flight.latitude],
                  [destCoords.lon, destCoords.lat],
                ],
              }}
            >
              <MapboxGL.LineLayer
                id={`path-layer-${flight.id}`}
                style={{
                  lineColor: 'rgba(255, 255, 255, 0.4)',
                  lineWidth: 2,
                  lineOpacity: 0.8,
                  lineDasharray: [2, 2],
                }}
              />

              {/* Animated trail effect */}
              <MapboxGL.LineLayer
                id={`trail-layer-${flight.id}`}
                style={{
                  lineColor: 'rgba(255, 255, 255, 0.6)',
                  lineWidth: 3,
                  lineOpacity: 0.5,
                  lineDasharray: [0, 4, 2],
                  lineTranslate: ['literal', [0, 0]],
                  lineTranslateAnchor: 'map',
                }}
              />
            </MapboxGL.ShapeSource>
          );
        })}
      </MapboxGL.MapView>

      <View style={styles.topContainer}>
        <SearchBar />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonText}>FILTER</Text>
        </TouchableOpacity>
      </View>

      <FilterPanel visible={showFilters} />

      <TouchableOpacity
        style={styles.commandButton}
        onPress={() => setShowCommandBar(true)}
      >
        <Text style={styles.commandButtonText}>AI</Text>
      </TouchableOpacity>

      <CommandBar
        visible={showCommandBar}
        onClose={() => setShowCommandBar(false)}
      />

      {/* Radar pulse at user location */}
      <RadarPulse visible={true} />

      <BottomSheetDetails
        flight={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  planeMarker: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 60,
    alignItems: 'center',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  markerText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  topContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
  },
  filterButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commandButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: 'rgba(0, 255, 0, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.3)',
    shadowColor: 'rgba(0, 255, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  commandButtonText: {
    color: '#00FF00',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});
