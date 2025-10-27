import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  Keyboard,
} from 'react-native';
import { useFlightStore } from '@/src/store/flightStore';

const { width } = Dimensions.get('window');

interface CommandBarProps {
  visible: boolean;
  onClose: () => void;
}

export default function CommandBar({ visible, onClose }: CommandBarProps) {
  const [command, setCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const { setFilters, setSelectedFlight } = useFlightStore();

  const slideAnim = useRef(new Animated.Value(visible ? 0 : 100)).current;
  const fadeAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const processCommand = async (inputCommand: string) => {
    if (!inputCommand.trim()) return;

    setIsProcessing(true);
    const newHistory = [...history, `> ${inputCommand}`];
    setHistory(newHistory);

    try {
      // Simple command parsing (in a real app, this would use OpenAI API)
      const response = await parseCommand(inputCommand);
      setHistory([...newHistory, response.message]);

      // Execute the parsed command
      if (response.action) {
        executeCommand(response.action);
      }
    } catch (error) {
      setHistory([...newHistory, 'Error processing command']);
    }

    setIsProcessing(false);
    setCommand('');
  };

  const parseCommand = async (input: string): Promise<{ message: string; action?: any }> => {
    const lowerInput = input.toLowerCase();

    // Simple pattern matching for common commands
    if (lowerInput.includes('track') && lowerInput.includes('flight')) {
      const flightMatch = input.match(/track\s+(?:flight\s+)?([A-Z0-9]+)/i);
      if (flightMatch) {
        return {
          message: `Tracking flight ${flightMatch[1].toUpperCase()}...`,
          action: { type: 'track_flight', flightNumber: flightMatch[1].toUpperCase() },
        };
      }
    }

    if (lowerInput.includes('show') && lowerInput.includes('above')) {
      const locationMatch = input.match(/above\s+([A-Za-z\s]+)/i);
      if (locationMatch) {
        return {
          message: `Showing flights above ${locationMatch[1].trim()}...`,
          action: { type: 'filter_location', location: locationMatch[1].trim() },
        };
      }
    }

    if (lowerInput.includes('find') && lowerInput.includes('airline')) {
      const airlineMatch = input.match(/airline\s+([A-Za-z\s]+)/i);
      if (airlineMatch) {
        return {
          message: `Finding flights for ${airlineMatch[1].trim()}...`,
          action: { type: 'filter_airline', airline: airlineMatch[1].trim() },
        };
      }
    }

    if (lowerInput.includes('clear') || lowerInput.includes('reset')) {
      return {
        message: 'Clearing all filters...',
        action: { type: 'clear_filters' },
      };
    }

    // Default response for unrecognized commands
    return {
      message: 'Command not recognized. Try: "Track flight EK215", "Show flights above Dubai", "Find Emirates flights", or "Clear filters"',
    };
  };

  const executeCommand = (action: any) => {
    switch (action.type) {
      case 'track_flight':
        // This would search for and select the specific flight
        setFilters({ airline: action.flightNumber });
        break;
      case 'filter_location':
        // This would filter flights above a certain location
        // In a real implementation, this would use location coordinates
        break;
      case 'filter_airline':
        setFilters({ airline: action.airline });
        break;
      case 'clear_filters':
        setFilters({ airline: '', status: '', altitude: '' });
        break;
    }
  };

  const handleSubmit = () => {
    if (command.trim()) {
      processCommand(command);
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Command Terminal</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyContainer}>
          {history.map((item, index) => (
            <Text key={index} style={[
              styles.historyItem,
              item.startsWith('>') ? styles.commandText : styles.responseText,
            ]}>
              {item}
            </Text>
          ))}

          {isProcessing && (
            <Text style={styles.processingText}>Processing...</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.prompt}>$</Text>
          <TextInput
            style={styles.input}
            value={command}
            onChangeText={setCommand}
            placeholder="Type a command..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            autoFocus={true}
            onSubmitEditing={handleSubmit}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, !command.trim() && styles.sendButtonDisabled]}
            onPress={handleSubmit}
            disabled={!command.trim() || isProcessing}
          >
            <Text style={[
              styles.sendText,
              !command.trim() && styles.sendTextDisabled,
            ]}>
              Send
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 25,
    maxHeight: '70%',
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
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
  },
  historyContainer: {
    flex: 1,
    padding: 20,
  },
  historyItem: {
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 8,
    lineHeight: 20,
  },
  commandText: {
    color: '#00FF00',
  },
  responseText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  processingText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontFamily: 'monospace',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  prompt: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#00FF00',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'monospace',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  sendButton: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 0, 0.3)',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sendText: {
    color: '#00FF00',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'monospace',
  },
  sendTextDisabled: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
