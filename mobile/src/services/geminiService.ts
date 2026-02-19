import { Mood } from '../types';

// NOTE: For RN/Expo, avoid shipping a private API key in the client.
// Replace with a secure backend call when ready.

export const analyzePhoto = async (_imageUrl: string): Promise<{ tags: string[]; mood: Mood; caption: string }> => {
  return {
    tags: ['Photo'],
    mood: 'Peaceful',
    caption: 'A captured moment.'
  };
};

export const getVibeSummary = async (_photos: { caption: string; tags: string[] }[]): Promise<string> => {
  return 'The room is full of warmth and shared moments.';
};
