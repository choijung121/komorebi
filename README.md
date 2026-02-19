# Komorebi (木漏れ日)

Komorebi is a private, room-based photo-sharing application designed for high-intimacy social interactions. Unlike traditional social media, Komorebi focuses on "contributing" to shared spaces rather than building a public profile.

## 🚀 Tech Stack

- **Web Prototype**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Mobile**: [Expo](https://expo.dev/) (React Native)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing for data safety)
- **Styling**:
  - Web: [Tailwind CSS](https://tailwindcss.com/)
  - Mobile: [NativeWind](https://www.nativewind.dev/)
- **AI Integration**: [Google Gemini API (@google/genai)](https://ai.google.dev/)
  - **Gemini 3 Flash**: Used for real-time photo analysis, AI-generated captions, and "Vibe Checks."
- **Icons**:
  - Web: [Font Awesome 6](https://fontawesome.com/)
  - Mobile: [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- **Architecture**: React Native port in `/mobile` + web prototype in root.

## ✨ Key Features

- **Daily Feed (Home)**: Aggregated "Today" scroll from all joined private rooms.
- **The Vault (Rooms)**: Deep-dive galleries with AI-driven "Vibe Meters."
- **Flashbacks**: Context-aware memories surfaced on the anniversary of the photo.
- **Time Capsules**: Blurred photos that only reveal themselves on a specific future date.
- **Live Drops**: Real-time collaborative albums for events and physical gatherings.

## 🛠️ Running Locally

Follow these steps to run either the web prototype or the Expo mobile app.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A valid **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Setup (Web Prototype)
Create a `.env` file in the root directory and add your API key:
```bash
API_KEY=your_gemini_api_key_here
```

### 3. Web Prototype (Root)
Since this project uses ES modules and Vite, run it from the repo root.

**Using Vite (Recommended):**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Mobile (Expo + NativeWind)
The React Native app lives in `mobile/`.

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npx expo start
```

> Note: The mobile app currently uses a stubbed Gemini service to avoid shipping private API keys in the client. Replace it with a secure backend call when ready.

### 5. Native Capabilities
For native permissions (camera, microphone, geolocation), use the Expo app or a local simulator.

## 📂 Project Structure

- **Web Prototype (root)**:
  - `App.tsx`: Main navigation logic and tab state management.
  - `types.ts`: Core data models (User, Room, Photo, Mood).
  - `services/`: AI logic and external API integrations.
  - `components/`: UI modules (FeedCards, RoomVaults, Architecture documentation).
  - `mockData.ts`: Initial prototype dataset.
- **Mobile (Expo)**:
  - `mobile/App.tsx`: Root app shell.
  - `mobile/src/components/`: RN UI modules.
  - `mobile/src/services/`: Mobile service layer (Gemini stubbed).
  - `mobile/src/data/`: Mock data.
  - `mobile/src/types/`: Shared type definitions.

---

*“Capturing the light as it filters through the leaves.”*
