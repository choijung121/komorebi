# Komorebi (木漏れ日)

Komorebi is a private, room-based photo and video sharing mobile application designed for high-intimacy social interactions. Unlike traditional social media, Komorebi focuses on "contributing" to shared spaces rather than building a public profile.

## 🚀 Tech Stack (Mobile-Only)

- **Mobile**: [Expo](https://expo.dev/) (React Native)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing for data safety)
- **Styling**: [NativeWind](https://www.nativewind.dev/)
- **Backend**: [Supabase](https://supabase.com/) (Postgres, Auth, Storage, RLS)
- **Icons**: [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- **Architecture**: Mobile app lives in `/mobile`

## ✨ Key Features

- **Room + Group Segmentation**: Users belong to only one group per room.
- **Multi-Admin Rooms**: Multiple admins per room.
- **Media Upload**: Photos (JPEG, compressed) + Videos (MP4 H.264, <= 2 min) with thumbnails.
- **Segmented Comments/Reactions**: Group-scoped visibility.
- **Chronological Feed**: `created_at DESC`.
- **Download Toggle**: Admin-controlled.
- **Archive Mode**: Read-only room.
- **Secure Invite Links**: Token-based, forced signup.

## ✅ PRD Milestones (Source of Truth)

- **Milestone 1**: Database schema + RLS + invite RPC + backend test validation (Completed)
- **Milestone 2**: Expo setup + Supabase auth integration (Completed)
- **Milestone 3**: Media upload flow (photo + video compression) (In Progress)
- **Milestone 4**: Segmented comments + reactions (Planned)
- **Milestone 5**: Feed + gallery screens (Planned)
- **Milestone 6**: Download toggle + archive mode enforcement (Planned)

## 🎯 Next Milestone Focus

- **Current focus**: Milestone 3 — Media upload flow (photo compression + video upload + thumbnail)
- **Blocking items**:
  - Supabase Storage buckets `media` and `media-thumbs` created and accessible
  - Expo permissions tested on device/simulator

## 🛠️ Running Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### 2. Mobile (Expo + NativeWind)
The React Native app lives in `mobile/`.

```bash
cd mobile

# Install dependencies
npm install

# Start Expo
npx expo start
```

Create `mobile/.env` with your Supabase credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

> Note: The mobile app currently uses a stubbed Gemini service to avoid shipping private API keys in the client. Replace it with a secure backend call when ready.

### 3. Supabase Schema (Milestone 1)
Apply the SQL in `mobile/supabase/schema.sql` using the Supabase SQL Editor. This sets up the MVP tables, RLS policies, and the `accept_invite` RPC.

### 4. Media Upload (Milestone 3)
Create two Supabase Storage buckets:
- `media` (for original photos/videos)
- `media-thumbs` (for video thumbnails)

For MVP, set these buckets to public or add RLS policies to allow authenticated users to read/write.

### 5. Native Capabilities
For native permissions (camera, microphone, geolocation), use the Expo app or a local simulator.

## 📂 Project Structure (Mobile)

- `mobile/App.tsx`: Root app shell.
- `mobile/src/components/`: RN UI modules.
- `mobile/src/services/`: Mobile service layer (Gemini stubbed).
- `mobile/src/data/`: Mock data.
- `mobile/src/types/`: Shared type definitions.
- `mobile/supabase/schema.sql`: Database schema + RLS + invite RPC.

---

*“Capturing the light as it filters through the leaves.”*
