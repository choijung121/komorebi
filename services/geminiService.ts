
import { GoogleGenAI, Type } from "@google/genai";
import { Mood } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePhoto = async (imageUrl: string): Promise<{ tags: string[], mood: Mood, caption: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          text: `Analyze this photo and provide:
          1. 3-5 tags.
          2. A dominant mood from: Cozy, Adventurous, Peaceful, Nostalgic, Energetic.
          3. A short poetic caption.
          Return as JSON.`
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            mood: { type: Type.STRING },
            caption: { type: Type.STRING }
          },
          required: ["tags", "mood", "caption"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      tags: result.tags,
      mood: result.mood as Mood,
      caption: result.caption
    };
  } catch (error) {
    console.error("AI Analysis failed", error);
    return {
      tags: ['Photo'],
      mood: 'Peaceful',
      caption: 'A captured moment.'
    };
  }
};

export const getVibeSummary = async (photos: { caption: string, tags: string[] }[]): Promise<string> => {
  try {
    const text = photos.map(p => `${p.caption} (${p.tags.join(', ')})`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on these photos in a private room, write a one-sentence "vibe check" for the group:\n${text}`
    });
    return response.text;
  } catch (error) {
    return "The room is full of warmth and shared moments.";
  }
};
