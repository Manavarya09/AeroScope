# AeroScope - Real-Time Flight Tracker

A sophisticated, real-time global flight tracking application built with React Native and Expo. AeroScope provides a calm, fluid, and visually precise experience for monitoring aircraft positions, movements, and flight details using the OpenSky Network API.

## ✨ Features

### 🗺️ Interactive Map View
- **Real-time flight data** from OpenSky Network API (Free, no API key required)
- **Mapbox GL integration** with dark theme styling
- **Animated flight paths** with subtle trail effects using Reanimated
- **Interactive flight markers** with flight information displays
- **GPS-based radar pulse** animation at user location
- **Smooth camera transitions** and map interactions

### 📱 Enhanced Flight Details
- **Glassmorphic bottom sheet** with comprehensive flight information
- **Live altitude charts** using Victory Native with realistic flight profiles
- **Complete flight data**: airline, origin, destination, altitude, speed, heading, ETA, status
- **Smooth animations** and transitions throughout
- **Interactive favorite toggle** with instant notifications

### 🔍 Advanced Search & Filter
- **Real-time search** with instant filtering by airline or flight number
- **Advanced filtering system** by airline, status, and altitude ranges
- **Glassmorphic filter panel** with smooth slide animations
- **Clear visual feedback** for active filters

### ⭐ Enhanced Favorites System
- **Save favorite flights** with persistent storage using Zustand
- **Beautiful favorites list** with detailed flight cards
- **Staggered animations** for list item entrance
- **Comprehensive flight details** in favorites view
- **Instant notifications** when flights are favorited

### 🤖 AI Command Bar
- **Natural language command interface** with terminal-style design
- **Smart command parsing** for flight-related queries
- **Command history** and response display
- **Monospace typography** for authentic terminal feel
- **Examples**: "Track Emirates 215", "Show flights above Dubai", "Find all Emirates flights"

### 🔔 Smart Notifications
- **Flight favorited alerts** with immediate notifications
- **Framework ready** for landing/departure notifications
- **Silent notifications** optimized for flight tracking
- **Expo Notifications** integration

### 🎨 Premium Design System
- **Pure black background** (#000000) for true dark mode
- **Glassmorphic effects** with subtle shadows and opacity layers
- **Inter typography** with proper font weights
- **Grid-based spacing** (16px multiples)
- **Smooth animations** (400-600ms easeInOut)
- **Zero visual clutter** - data-focused interface

## 🛠️ Technical Implementation

### Core Technologies
- **React Native** with Expo SDK 54
- **TypeScript** for complete type safety
- **Mapbox GL** for advanced mapping and performance
- **Victory Native** for beautiful data visualization
- **Zustand** for efficient state management
- **React Native Reanimated** for smooth animations
- **Expo Notifications** for push notifications

### APIs & Data Sources
- **OpenSky Network API** - Primary real-time flight data (Free)
- **AviationStack API** - Backup data source
- **Enhanced mock data** with 50+ realistic flights for development

### Performance Optimizations
- **Bounds-based API calls** to reduce data usage
- **Efficient state updates** with minimal re-renders
- **Background data fetching** every 10 seconds
- **Optimized animations** using native driver
- **Smart component memoization**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android device/emulator

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**
   - **iOS**: `npm run ios` or press `i` in terminal
   - **Android**: `npm run android` or press `a` in terminal
   - **Web**: `npm run web` or press `w` in terminal

### Configuration
No API keys required! The app uses OpenSky Network API which is completely free.

## 📁 Project Structure

```
src/
├── api/
│   └── aviationStack.ts          # OpenSky Network integration with enhanced mock data
├── components/
│   ├── AltitudeChart.tsx         # Victory Native altitude visualization
│   ├── BottomSheetDetails.tsx    # Enhanced flight details modal with animations
│   ├── CommandBar.tsx           # AI command interface with terminal styling
│   ├── FilterPanel.tsx          # Advanced filtering with glassmorphic design
│   ├── RadarPulse.tsx           # GPS location radar animation
│   └── SearchBar.tsx            # Enhanced search with focus animations
├── screens/
│   ├── HomeScreen.tsx           # Main map interface with Mapbox integration
│   └── FavoritesScreen.tsx      # Enhanced favorites list with animations
├── store/
│   └── flightStore.ts           # Zustand state management with persistence
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    ├── formatters.ts            # Data formatting utilities
    ├── mapbox.ts               # Mapbox configuration
    └── notifications.ts         # Enhanced notification system
```

## 🌟 Key Features Implemented

### ✅ Real-Time Data Integration
- **OpenSky Network API** integration with automatic fallback to enhanced mock data
- **Smart data fetching** based on map bounds for optimal performance
- **Real-time updates** every 10 seconds with error handling

### ✅ Enhanced UI/UX
- **Complete glassmorphic design** throughout the application
- **Smooth animations** using React Native Reanimated
- **Interactive elements** with proper feedback states
- **Responsive design** optimized for all screen sizes

### ✅ Advanced Map Features
- **Mapbox GL integration** with dark theme styling
- **Animated flight paths** with realistic trail effects
- **Interactive markers** with flight information
- **Camera animations** for smooth transitions

### ✅ Smart Search & Filtering
- **Real-time search** with instant results
- **Multi-criteria filtering** (airline, status, altitude)
- **Visual filter feedback** with glassmorphic panels

### ✅ AI Command System
- **Terminal-style interface** with command history
- **Natural language parsing** for flight queries
- **Smart command execution** with visual feedback

### ✅ Enhanced Favorites
- **Persistent storage** using Zustand
- **Beautiful list design** with detailed cards
- **Animated interactions** and smooth transitions
- **Instant notifications** when flights are favorited

## 🔧 Configuration Options

### Mapbox (Optional)
For enhanced mapping features, add a Mapbox token:
```bash
# Create .env file
echo "EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here" > .env
```

### API Endpoints
The app automatically configures:
- **OpenSky Network**: `https://opensky-network.org/api/states/all`
- **Fallback**: Enhanced mock data with 50+ realistic flights

## 📱 Screenshots

[Add screenshots of the implemented features]

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-enhancement`
3. Commit your changes: `git commit -m 'Add amazing enhancement'`
4. Push to the branch: `git push origin feature/amazing-enhancement`
5. Open a Pull Request

## 📄 License

MIT License - feel free to modify and enhance for your own projects!

## 🙏 Acknowledgments

- **OpenSky Network** for providing free, comprehensive flight data
- **Mapbox** for excellent mapping services and documentation
- **Expo Team** for the amazing development platform
- **Victory Native** for beautiful, performant charts

---

**AeroScope demonstrates the perfect balance of technical sophistication and design clarity. Built for aviation enthusiasts who appreciate precision, performance, and beautiful user experiences.**
