import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

interface AltitudeChartProps {
  flightId: string;
}

export default function AltitudeChart({ flightId }: AltitudeChartProps) {
  // Generate realistic altitude data for the flight
  const chartData = useMemo(() => {
    const baseAltitude = 35000 + Math.random() * 5000;
    const dataPoints = 20;
    const data = [];

    for (let i = 0; i < dataPoints; i++) {
      // Simulate realistic altitude changes during flight
      const progress = i / (dataPoints - 1);
      let altitude = baseAltitude;

      // Descent phase (last 20% of flight)
      if (progress > 0.8) {
        altitude = baseAltitude * (1 - (progress - 0.8) * 5);
      }
      // Climb phase (first 20% of flight)
      else if (progress < 0.2) {
        altitude = 10000 + (baseAltitude - 10000) * (progress / 0.2);
      }
      // Cruise phase (middle 60% with minor variations)
      else {
        altitude += (Math.random() - 0.5) * 2000;
      }

      data.push({
        x: i,
        y: Math.max(0, altitude),
      });
    }

    return data;
  }, [flightId]);

  return (
    <View style={styles.container}>
      <VictoryChart
        width={width - 48}
        height={120}
        theme={VictoryTheme.material}
        padding={{ top: 10, bottom: 30, left: 20, right: 20 }}
        domainPadding={{ x: 0, y: 10 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: 'rgba(255, 255, 255, 0.3)' },
            ticks: { stroke: 'rgba(255, 255, 255, 0.3)' },
            tickLabels: {
              fill: 'rgba(255, 255, 255, 0.6)',
              fontSize: 10,
              fontWeight: '300',
            },
            grid: { stroke: 'rgba(255, 255, 255, 0.1)' },
          }}
          tickCount={4}
          tickFormat={(t: number) => `${Math.round(t * 1000)}ft`}
        />
        <VictoryLine
          data={chartData}
          style={{
            data: {
              stroke: 'rgba(255, 255, 255, 0.8)',
              strokeWidth: 2,
            },
            parent: { border: '1px solid #ccc' },
          }}
          interpolation="monotoneX"
          animate={{
            duration: 1000,
            onLoad: { duration: 500 },
          }}
        />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 8,
  },
});
