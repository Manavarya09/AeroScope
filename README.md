# AeroScope

AeroScope is a real-time **flight tracking and visualization app** built with **React Native** and **Expo**.  
It provides a clean, data-centric interface for exploring global air traffic, viewing live flight information, and tracking aircraft in motion — all in a minimal **black-and-white aesthetic**.

---

## ✈️ Overview

AeroScope combines **real-time aviation APIs**, **interactive maps**, and **modern mobile UI** to deliver a smooth flight observation experience.  
Users can explore aircraft worldwide, search by airline or flight number, and save flights for instant updates.

Built for performance, design clarity, and developer readability — this project demonstrates advanced React Native capabilities and thoughtful product design.

---

## 🧩 Features

- **Live Global Map**  
  Interactive Mapbox/Google map displaying live aircraft locations and movements.

- **Flight Details Panel**  
  Tap on any plane to view airline, route, altitude, and speed in a clean glassmorphic bottom sheet.

- **Search and Filters**  
  Search flights by flight number or airline and filter by altitude, type, or status.

- **Favorites & Notifications**  
  Save your favorite flights locally and receive push notifications on status changes.

- **Offline Data Cache**  
  Recent flight data stored using AsyncStorage or SQLite for quick reloading.

- **Smooth Animations**  
  Subtle, deliberate motion powered by Reanimated for a refined user experience.

- **Optional AI Command Mode**  
  Text-based command bar powered by OpenAI API — e.g. “Show all Emirates flights above Dubai”.

---

## 🧠 Tech Stack

| Layer | Technology |
|-------|-------------|
| Framework | React Native (Expo SDK) |
| Maps | Mapbox GL / React Native Maps |
| API | OpenSky Network / AviationStack |
| State Management | Zustand |
| Local Storage | AsyncStorage / SQLite |
| Charts | Victory Native |
| Notifications | Expo Notifications |
| Animations | React Native Reanimated |
| Optional AI | OpenAI API |

---

## 🖤 Design Philosophy

AeroScope follows a **black-and-white minimal design language**:
- Typography-focused (Inter / Space Grotesk)
- No icons or colors — clarity through layout and contrast
- Generous spacing, grid-aligned elements
- Subtle shadows, glass effects, and slow transitions
- Zero clutter, zero distractions

Every element has a purpose — to guide the user’s focus and highlight data precision.

---

## ⚙️ Getting Started

### 1. Install dependencies
```bash
npm install
2. Start the development server
npx expo start
3. Run on device or simulator
Android Emulator
iOS Simulator
Expo Go App
4. (Optional) Reset the project
npm run reset-project
This command clears starter files and prepares a fresh environment.

🧭 API Configuration
Create a .env file in the project root and add your credentials:
OPEN_SKY_API=https://opensky-network.org/api/states/all
AVIATION_STACK_KEY=your_api_key_here
OPENAI_API_KEY=your_api_key_here
Ensure you enable location permissions on your device to view nearby flights.

🧱 Folder Structure
/src
 ┣ /components
 ┃ ┣ MapViewContainer.tsx
 ┃ ┣ FlightCard.tsx
 ┃ ┣ SearchBar.tsx
 ┃ ┗ BottomSheetDetails.tsx
 ┣ /screens
 ┃ ┣ HomeScreen.tsx
 ┃ ┗ FavoritesScreen.tsx
 ┣ /store
 ┃ ┗ flightStore.ts
 ┣ /api
 ┃ ┗ opensky.ts
 ┣ /utils
 ┃ ┗ formatters.ts
 ┗ App.tsx
💼 For Your Resume / Portfolio
AeroScope — Real-Time Flight Tracker (React Native, Expo, Mapbox, OpenSky API)
Developed a real-time global flight tracking application with live data visualization, smooth animations, and a glassmorphic black-and-white UI. Implemented flight search, filters, offline caching, and notification systems using modern React Native architecture.
🧰 Future Enhancements
3D flight path visualization
Airport-based filtering
Historical flight replay
Cloud sync of favorite flights
Live weather overlays

To learn more about developing your project with Expo, look at the following resources: - [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides). - [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web. ## Join the community Join our community of developers creating universal apps. - [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute. - [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

🧤 License
This project is released under the MIT License.
Feel free to modify, adapt, and build upon it for personal or educational use.
Crafted with precision and intent — AeroScope reflects design clarity and engineering depth.

---
