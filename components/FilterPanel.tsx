import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useFlightStore } from '@/src/store/flightStore';

interface FilterPanelProps {
  visible?: boolean;
}

export default function FilterPanel({ visible = true }: FilterPanelProps) {
  const { filters, setFilters } = useFlightStore();
  const slideAnim = useRef(new Animated.Value(visible ? 0 : -300)).current;
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: visible ? 0 : -300,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  const filterOptions = {
    status: [
      { label: 'All', value: '' },
      { label: 'En Route', value: 'en-route' },
      { label: 'Landed', value: 'landed' },
      { label: 'Scheduled', value: 'scheduled' },
    ],
    altitude: [
      { label: 'All', value: '' },
      { label: 'Low (< 20,000 ft)', value: 'low' },
      { label: 'Medium (20,000 - 35,000 ft)', value: 'medium' },
      { label: 'High (> 35,000 ft)', value: 'high' },
    ],
  };

  const updateFilter = (filterType: 'status' | 'altitude', value: string) => {
    setFilters({ [filterType]: value });
  };

  const clearFilters = () => {
    setFilters({ airline: '', status: '', altitude: '' });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.optionsContainer}>
            {filterOptions.status.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  filters.status === option.value && styles.selectedOption,
                ]}
                onPress={() => updateFilter('status', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.status === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Altitude</Text>
          <View style={styles.optionsContainer}>
            {filterOptions.altitude.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  filters.altitude === option.value && styles.selectedOption,
                ]}
                onPress={() => updateFilter('altitude', option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    filters.altitude === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 140,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 15,
    maxHeight: 300,
    zIndex: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontWeight: '400',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: 'rgba(255, 255, 255, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowOpacity: 0.8,
  },
  optionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '400',
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
