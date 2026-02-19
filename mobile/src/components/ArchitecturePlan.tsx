import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const ArchitecturePlan: React.FC = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
      <View className="mb-10">
        <Text className="text-3xl font-extrabold text-gray-900 mb-2">React Native Plan</Text>
        <Text className="text-gray-500">Komorebi Mobile Core Architecture</Text>
      </View>

      <View className="mb-10">
        <View className="flex-row items-center mb-4">
          <View className="w-8 h-8 rounded-lg bg-indigo-600 items-center justify-center">
            <FontAwesome6 name="code-branch" size={12} color="#FFFFFF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 ml-2">Project Structure</Text>
        </View>
        <View className="bg-white border border-gray-100 rounded-2xl p-6">
          {[
            'src/navigation/ // Stack & Tab Navigators',
            'src/screens/ // Feed, Vault, Drop, Profile',
            'src/components/ // Atom & Molecule UI',
            'src/store/ // Zustand/Redux for Room data',
            'src/hooks/ // usePhotos, useRoomVibe',
            'src/services/ // Gemini API & Firebase Bridge'
          ].map(row => (
            <View key={row} className="flex-row items-center mb-3">
              <FontAwesome6 name="folder" size={12} color="#F59E0B" />
              <Text className="text-sm text-gray-600 ml-2 font-mono">{row}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-10">
        <View className="flex-row items-center mb-4">
          <View className="w-8 h-8 rounded-lg bg-emerald-500 items-center justify-center">
            <FontAwesome6 name="cube" size={12} color="#FFFFFF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 ml-2">Native Modules</Text>
        </View>
        <View className="flex-row flex-wrap">
          {[
            { name: 'expo-image', desc: 'Blurred placeholders' },
            { name: 'react-navigation', desc: 'Native Transitions' },
            { name: 'react-native-reanimated', desc: '60fps UI Logic' },
            { name: 'expo-av', desc: 'Audio Snippets' },
            { name: 'react-native-maps', desc: 'Shared Room Map' },
            { name: 'expo-haptics', desc: 'Mood Reactions' }
          ].map(lib => (
            <View key={lib.name} className="w-1/2 p-2">
              <View className="p-4 bg-white border border-gray-100 rounded-xl">
                <Text className="text-xs font-bold text-gray-900 mb-1">{lib.name}</Text>
                <Text className="text-[10px] text-gray-500">{lib.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="mb-10">
        <View className="flex-row items-center mb-4">
          <View className="w-8 h-8 rounded-lg bg-gray-900 items-center justify-center">
            <FontAwesome6 name="brackets-curly" size={12} color="#FFFFFF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 ml-2">State Schema (Zustand)</Text>
        </View>
        <View className="bg-gray-900 rounded-2xl p-6">
          <Text className="text-emerald-400 text-[10px] leading-relaxed font-mono">
            {`interface KomorebiState {\n  user: UserProfile;\n  activeRooms: Room[];\n  currentDrop: Drop | null;\n\n  // Actions\n  fetchDailyFeed: () => Promise<void>;\n  contributeToRoom: (photo: Photo) => void;\n  unlockCapsule: (photoId: string) => void;\n  updateVibe: (roomId: string, mood: Mood) => void;\n}`}
          </Text>
        </View>
      </View>

      <View className="p-4 bg-amber-50 rounded-2xl border border-amber-100 items-center">
        <Text className="text-[10px] text-amber-700 font-bold uppercase tracking-widest mb-1">Deployment Target</Text>
        <Text className="text-sm text-amber-900">Optimized for iOS 15+ & Android 12 (API 31)</Text>
      </View>
    </ScrollView>
  );
};

export default ArchitecturePlan;
