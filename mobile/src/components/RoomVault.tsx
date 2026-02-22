import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Room, Photo } from '../types';
import { getVibeSummary } from '../services/geminiService';
import { pickAndUploadMedia } from '../services/mediaService';

interface RoomVaultProps {
  room: Room;
  photos: Photo[];
  onBack: () => void;
  uploaderId: string;
}

const RoomVault: React.FC<RoomVaultProps> = ({ room, photos, onBack, uploaderId }) => {
  const [vibeCheck, setVibeCheck] = useState('Generating vibe check...');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchVibe = async () => {
      const summary = await getVibeSummary(photos.map(p => ({ caption: p.caption, tags: p.aiTags })));
      setVibeCheck(summary);
    };
    fetchVibe();
  }, [photos]);

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const result = await pickAndUploadMedia(room.id, uploaderId);
      if (!result) return;
      Alert.alert('Uploaded', result.type === 'photo' ? 'Photo uploaded.' : 'Video uploaded.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed.';
      Alert.alert('Upload failed', message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View className="absolute inset-0 bg-white">
      <View className="h-64 relative" style={{ backgroundColor: room.color }}>
        <Image source={{ uri: room.coverImage }} className="w-full h-full opacity-50" />
        <View className="absolute inset-0 bg-black/50" />

        <Pressable onPress={onBack} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20 items-center justify-center">
          <FontAwesome6 name="chevron-left" size={16} color="#FFFFFF" />
        </Pressable>

        <View className="absolute bottom-6 left-6 right-6">
          <View className="flex-row items-center mb-2">
            <View className="px-2 py-0.5 bg-white/20 rounded-full border border-white/20">
              <Text className="text-[10px] uppercase tracking-widest font-bold text-white">{room.vibe} VIBE</Text>
            </View>
          </View>
          <Text className="text-3xl font-bold text-white mb-1">{room.name}</Text>
          <Text className="text-white/80 text-sm" numberOfLines={1}>
            {room.description}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}>
        <View className="my-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="font-bold text-gray-900">Room Vibe Check</Text>
            <FontAwesome6 name="sparkles" size={14} color="#F59E0B" />
          </View>
          <Text className="text-gray-600 text-sm italic">"{vibeCheck}"</Text>
        </View>

        <View className="flex-row mb-8">
          <Pressable className="flex-1 py-4 px-2 bg-white rounded-2xl border border-gray-100 items-center justify-center mr-2">
            <FontAwesome6 name="map-location-dot" size={18} color="#6366F1" />
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Shared Map</Text>
          </Pressable>
          <Pressable className="flex-1 py-4 px-2 bg-white rounded-2xl border border-gray-100 items-center justify-center mr-2">
            <FontAwesome6 name="users" size={18} color="#10B981" />
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Members</Text>
          </Pressable>
          <Pressable className="flex-1 py-4 px-2 bg-white rounded-2xl border border-gray-100 items-center justify-center">
            <FontAwesome6 name="book-open" size={18} color="#F59E0B" />
            <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">Annual Book</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-gray-900">The Vault</Text>
          <Text className="text-xs font-bold text-gray-400">{photos.length} MEDIA</Text>
        </View>

        <View className="flex-row flex-wrap">
          {photos.map(p => (
            <View key={p.id} className="w-1/3 p-1">
              <View className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image source={{ uri: p.url }} className="w-full h-full" />
                {p.unlockDate && new Date(p.unlockDate) > new Date() && (
                  <View className="absolute inset-0 bg-black/40 items-center justify-center">
                    <FontAwesome6 name="lock" size={12} color="#E5E7EB" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center"
        onPress={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? <ActivityIndicator color="#FFFFFF" /> : <FontAwesome6 name="plus" size={18} color="#FFFFFF" />}
      </Pressable>
    </View>
  );
};

export default RoomVault;
