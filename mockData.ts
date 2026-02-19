
import { User, Room, Photo, Mood } from './types';

export const currentUser: User = {
  id: 'u-1',
  name: 'Alex Rivera',
  avatar: 'https://picsum.photos/seed/user1/200/200',
  joinedRooms: ['r-1', 'r-2', 'r-3'],
};

export const mockRooms: Room[] = [
  {
    id: 'r-1',
    name: 'The Found Tribe',
    description: 'Our annual camping crew',
    adminId: 'u-1',
    memberIds: ['u-1', 'u-2', 'u-3'],
    vibe: 'Adventurous',
    color: '#3B82F6',
    coverImage: 'https://picsum.photos/seed/camping/800/400',
  },
  {
    id: 'r-2',
    name: 'Sunday Brunchers',
    description: 'Weekly caffeine and gossip',
    adminId: 'u-2',
    memberIds: ['u-1', 'u-2'],
    vibe: 'Cozy',
    color: '#F97316',
    coverImage: 'https://picsum.photos/seed/brunch/800/400',
  },
  {
    id: 'r-3',
    name: 'Family Heritage',
    description: 'Scanning the old boxes',
    adminId: 'u-3',
    memberIds: ['u-1', 'u-3', 'u-4'],
    vibe: 'Nostalgic',
    color: '#8B5CF6',
    coverImage: 'https://picsum.photos/seed/oldphotos/800/400',
  },
];

const today = new Date().toISOString().split('T')[0];
const lastYear = new Date();
lastYear.setFullYear(lastYear.getFullYear() - 1);
const lastYearStr = lastYear.toISOString().split('T')[0];

export const mockPhotos: Photo[] = [
  {
    id: 'p-1',
    roomId: 'r-1',
    uploaderId: 'u-1',
    url: 'https://picsum.photos/seed/mountain/1080/1080',
    timestamp: today + 'T10:00:00Z',
    location: { lat: 45.523, lng: -122.676, name: 'Mt. Hood' },
    aiTags: ['Mountain', 'Sunrise', 'Fog'],
    caption: 'Waking up above the clouds.',
    mood: 'Adventurous',
  },
  {
    id: 'p-2',
    roomId: 'r-2',
    uploaderId: 'u-2',
    url: 'https://picsum.photos/seed/coffee/1080/1080',
    timestamp: today + 'T12:30:00Z',
    aiTags: ['Coffee', 'Pastry', 'Table'],
    caption: 'Finally trying that new bakery!',
    mood: 'Cozy',
  },
  {
    id: 'p-3',
    roomId: 'r-3',
    uploaderId: 'u-1',
    url: 'https://picsum.photos/seed/vintage/1080/1080',
    timestamp: lastYearStr + 'T15:00:00Z',
    aiTags: ['Vintage', 'Garden', 'Portrait'],
    caption: 'Grandma in her element, exactly 1 year ago.',
    mood: 'Nostalgic',
  },
  {
    id: 'p-4',
    roomId: 'r-1',
    uploaderId: 'u-1',
    url: 'https://picsum.photos/seed/stars/1080/1080',
    timestamp: today + 'T22:00:00Z',
    aiTags: ['Stars', 'Night', 'Long Exposure'],
    caption: 'Midnight sky over the camp.',
    mood: 'Peaceful',
    unlockDate: '2025-12-25', // Future unlock
  }
];
