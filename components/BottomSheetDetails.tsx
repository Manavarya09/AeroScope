import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFlightStore } from '@/src/store/flightStore';
import { FlightData } from '@/src/types';
import AltitudeChart from '@/components/AltitudeChart';

const { width } = Dimensions.get('window');

interface BottomSheetDetailsProps {
  flight: FlightData | null;
  onClose: () => void;
}

export default function BottomSheetDetails({ flight, onClose }: BottomSheetDetailsProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { toggleFavorite, favorites } = useFlightStore();
  const isFavorite = flight ? favorites.includes(flight.id) : false;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (flight) {
      bottomSheetRef.current?.expand();
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      bottomSheetRef.current?.close();
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [flight]);

  const handleToggleFavorite = () => {
    if (flight) {
      toggleFavorite(flight.id);
    }
  };

  if (!flight) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['75%']}
        enablePanDownToClose={true}
        onClose={onClose}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
        enableOverDrag={false}
        animationConfigs={{
          duration: 400,
        }}
      >
        <Animated.View
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.header}>
            <Animated.Text style={[styles.flightNumber, { opacity: fadeAnim }]}>
              {flight.flightNumber}
            </Animated.Text>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
              <Animated.Text
                style={[
                  styles.favoriteIcon,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: isFavorite ? 1.2 : 1 }],
                  },
                ]}
              >
                {isFavorite ? '★' : '☆'}
              </Animated.Text>
            </TouchableOpacity>
          </View>

          <View style={styles.flightInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>AIRLINE</Text>
                <Text style={styles.value}>{flight.airline}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>STATUS</Text>
                <Text style={[styles.value, styles.statusValue]}>{flight.status}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>ORIGIN</Text>
                <Text style={styles.value}>{flight.origin}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>DESTINATION</Text>
                <Text style={styles.value}>{flight.destination}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>ALTITUDE</Text>
                <Text style={styles.value}>{flight.altitude} ft</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>SPEED</Text>
                <Text style={styles.value}>{flight.speed} kts</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.label}>ETA</Text>
                <Text style={styles.value}>{flight.eta}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.label}>HEADING</Text>
                <Text style={styles.value}>{flight.heading}°</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>ALTITUDE PROFILE</Text>
            <AltitudeChart flightId={flight.id} />
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={styles.closeLine} />
          </TouchableOpacity>
        </Animated.View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheetBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
  },
  handleIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  flightNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  flightInfo: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  statusValue: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chartSection: {
    marginBottom: 32,
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  closeButton: {
    alignSelf: 'center',
    padding: 12,
    marginTop: 16,
  },
  closeLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 1,
  },
});
