import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Photo, Room, User } from '../types';

interface FeedCardProps {
  photo: Photo;
  room?: Room;
  uploader?: User;
}

const FeedCard: React.FC<FeedCardProps> = ({ photo, room, uploader }) => {
  const isLocked = photo.unlockDate && new Date(photo.unlockDate) > new Date();

  return (
    <View className="bg-white rounded-3xl border border-gray-100/50 overflow-hidden mb-8">
      <View className="p-5 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="relative">
            <Image source={{ uri: uploader?.avatar }} className="w-10 h-10 rounded-full" />
            <View className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
          </View>
          <View className="ml-3">
            <Text className="text-sm font-bold text-gray-900">{uploader?.name}</Text>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{room?.name}</Text>
          </View>
        </View>
        <Pressable className="w-8 h-8 rounded-full items-center justify-center">
          <FontAwesome6 name="ellipsis" size={16} color="#D1D5DB" />
        </Pressable>
      </View>

      <View className="relative bg-gray-50 mx-2 rounded-3xl overflow-hidden">
        <Image source={{ uri: photo.url }} className="w-full aspect-square" />

        {isLocked && (
          <View className="absolute inset-0 items-center justify-center p-8 bg-black/40">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-5">
              <FontAwesome6 name="hourglass-half" size={20} color="#FFFFFF" />
            </View>
            <Text className="text-white font-black text-xl mb-1">Time Capsule</Text>
            <Text className="text-white/80 text-xs font-bold uppercase tracking-widest">
              Unlocks {new Date(photo.unlockDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        )}

        {photo.audioSnippetUrl && !isLocked && (
          <Pressable className="absolute bottom-5 right-5 w-12 h-12 bg-black/50 rounded-full items-center justify-center">
            <FontAwesome6 name="volume-high" size={18} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      {!isLocked && (
        <View className="p-5">
          <View className="flex-row items-center mb-5">
            <Pressable className="flex-row items-center mr-5">
              <FontAwesome6 name="heart" size={18} color="#9CA3AF" />
              <Text className="text-[10px] font-black uppercase ml-2 text-gray-400">12</Text>
            </Pressable>
            <Pressable className="flex-row items-center mr-5">
              <FontAwesome6 name="comment" size={18} color="#9CA3AF" />
              <Text className="text-[10px] font-black uppercase ml-2 text-gray-400">4</Text>
            </Pressable>
            <Pressable className="ml-auto">
              <FontAwesome6 name="bookmark" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text className="text-sm text-gray-800 leading-relaxed font-medium">
            <Text className="font-black text-gray-900">{uploader?.name} </Text>
            {photo.caption}
          </Text>

          <View className="flex-row flex-wrap mt-4">
            {photo.aiTags.map(tag => (
              <View key={tag} className="bg-gray-50 px-2 py-0.5 rounded mr-2 mb-2">
                <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  #{tag.toLowerCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default FeedCard;
