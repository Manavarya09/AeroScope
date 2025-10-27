import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import * as Location from 'expo-location';

interface RadarPulseProps {
  visible?: boolean;
}

export default function RadarPulse({ visible = true }: RadarPulseProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [location, setLocation] = React.useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (visible) {
      getLocationPermission();
      startPulseAnimation();
    }
  }, [visible]);

  const getLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation({
          lat: currentLocation.coords.latitude,
          lon: currentLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const startPulseAnimation = () => {
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Restart animation after a delay
        setTimeout(pulseAnimation, 500);
      });
    };

    pulseAnimation();
  };

  if (!visible || !location) return null;

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.5],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <View style={styles.container}>
      {/* Radar pulse rings */}
      <Animated.View
        style={[
          styles.radarRing,
          styles.ring1,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.radarRing,
          styles.ring2,
          {
            transform: [{ scale: scale }],
            opacity: opacity.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.6, 0],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.radarRing,
          styles.ring3,
          {
            transform: [{ scale: scale }],
            opacity: opacity.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0, 0.3, 0],
            }),
          },
        ]}
      />

      {/* Center dot */}
      <View style={styles.centerDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    height: 200,
    marginTop: -100,
    marginLeft: -100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 100,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  ring1: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  ring2: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  ring3: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  centerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
});
