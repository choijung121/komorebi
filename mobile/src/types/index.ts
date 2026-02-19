export type Mood = 'Cozy' | 'Adventurous' | 'Peaceful' | 'Nostalgic' | 'Energetic' | 'None';

export interface User {
  id: string;
  name: string;
  avatar: string;
  joinedRooms: string[];
}

export interface Room {
  id: string;
  name: string;
  description: string;
  adminId: string;
  memberIds: string[];
  vibe: Mood;
  color: string;
  coverImage: string;
}

export interface Photo {
  id: string;
  roomId: string;
  uploaderId: string;
  url: string;
  timestamp: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  aiTags: string[];
  caption: string;
  mood?: Mood;
  audioSnippetUrl?: string;
  unlockDate?: string; // For Time Capsule
}

export interface Drop {
  id: string;
  roomId: string;
  name: string;
  active: boolean;
  photoIds: string[];
}

export enum AppTab {
  HOME = 'home',
  ROOMS = 'rooms',
  DROP = 'drop',
  PLAN = 'plan'
}
