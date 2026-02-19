import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import { AppTab } from './src/types';
import { currentUser, mockPhotos, mockRooms } from './src/data/mockData';
import FeedCard from './src/components/FeedCard';
import RoomVault from './src/components/RoomVault';
import ArchitecturePlan from './src/components/ArchitecturePlan';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const todayPhotos = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return mockPhotos.filter(p => p.timestamp.startsWith(today));
  }, []);

  const flashbacks = useMemo(() => {
    const today = new Date();
    return mockPhotos.filter(p => {
      const pDate = new Date(p.timestamp);
      return (
        pDate.getDate() === today.getDate() &&
        pDate.getMonth() === today.getMonth() &&
        pDate.getFullYear() < today.getFullYear()
      );
    });
  }, []);

  const selectedRoom = useMemo(() => mockRooms.find(r => r.id === selectedRoomId), [selectedRoomId]);
  const roomPhotos = useMemo(() => mockPhotos.filter(p => p.roomId === selectedRoomId), [selectedRoomId]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <StatusBar style="dark" />
        <View className="w-24 h-24 bg-black rounded-3xl items-center justify-center mb-8">
          <Text className="text-white font-black text-4xl">K</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-900">Komorebi</Text>
          <Text className="text-gray-400 text-sm mt-1">Capturing light between leaves...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.PLAN:
        return <ArchitecturePlan />;
      case AppTab.ROOMS:
        return (
          <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
            <View className="mb-8">
              <Text className="text-3xl font-extrabold text-gray-900 mb-2">My Rooms</Text>
              <Text className="text-gray-500">Your private sanctuaries</Text>
            </View>
            <View>
              {mockRooms.map(room => (
                <Pressable
                  key={room.id}
                  onPress={() => setSelectedRoomId(room.id)}
                  className="mb-5 rounded-3xl overflow-hidden"
                >
                  <View className="h-48">
                    <Image source={{ uri: room.coverImage }} className="w-full h-full" />
                    <View className="absolute inset-0 bg-black/50" />
                    <View className="absolute bottom-6 left-6 right-6 flex-row items-end justify-between">
                      <View>
                        <Text className="text-2xl font-bold text-white mb-1">{room.name}</Text>
                        <View className="flex-row items-center">
                          <FontAwesome6 name="user-group" size={10} color="#FFFFFF" />
                          <Text className="text-white/70 text-xs font-bold uppercase tracking-widest ml-2">
                            {room.memberIds.length} Members • {room.vibe}
                          </Text>
                        </View>
                      </View>
                      <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                        <FontAwesome6 name="arrow-right" size={16} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
              <Pressable className="w-full py-8 border-2 border-dashed border-gray-200 rounded-3xl items-center justify-center">
                <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mb-3">
                  <FontAwesome6 name="plus" size={16} color="#9CA3AF" />
                </View>
                <Text className="text-xs font-bold uppercase tracking-widest text-gray-400">New Private Room</Text>
              </Pressable>
            </View>
          </ScrollView>
        );
      case AppTab.DROP:
        return (
          <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
            <View className="items-center mb-8">
              <View className="w-32 h-32 bg-amber-50 rounded-full items-center justify-center mb-8">
                <FontAwesome6 name="bolt-lightning" size={40} color="#F59E0B" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-3">Start a Drop</Text>
              <Text className="text-gray-500 text-sm text-center max-w-xs">
                Instantly share photos with everyone at your current location for a limited time.
              </Text>
            </View>
            <View>
              {mockRooms.map(room => (
                <Pressable key={room.id} className="w-full p-5 bg-white border border-gray-100 rounded-3xl flex-row items-center mb-3">
                  <Image source={{ uri: room.coverImage }} className="w-14 h-14 rounded-2xl" />
                  <View className="ml-4 flex-1">
                    <Text className="font-bold text-gray-800">{room.name}</Text>
                    <Text className="text-xs text-emerald-500 font-bold uppercase tracking-widest mt-1">Ready for Drop</Text>
                  </View>
                  <FontAwesome6 name="circle-play" size={22} color="#E5E7EB" />
                </Pressable>
              ))}
            </View>
          </ScrollView>
        );
      case AppTab.HOME:
      default:
        return (
          <ScrollView className="flex-1 bg-white" contentContainerStyle={{ paddingBottom: 120 }}>
            <View className="px-6 py-5 flex-row items-center justify-between border-b border-gray-50">
              <View className="flex-row items-center">
                <View className="w-9 h-9 bg-black rounded-xl items-center justify-center mr-3">
                  <Text className="text-white font-black text-xl">K</Text>
                </View>
                <View>
                  <Text className="text-xl font-black tracking-tight text-gray-900">Komorebi</Text>
                  <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Daily Summary</Text>
                </View>
              </View>
              <View>
                <Image source={{ uri: currentUser.avatar }} className="w-10 h-10 rounded-full" />
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
              </View>
            </View>

            <View className="px-6 py-6">
              {flashbacks.length > 0 && (
                <View className="mb-12">
                  <View className="flex-row items-center justify-between mb-5">
                    <Text className="text-2xl font-bold text-gray-900">Flashbacks</Text>
                    <View className="bg-amber-50 px-2 py-1 rounded-md">
                      <Text className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Past Memories</Text>
                    </View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2" contentContainerStyle={{ paddingHorizontal: 8 }}>
                    {flashbacks.map(photo => (
                      <View key={photo.id} className="w-44 h-64 rounded-3xl overflow-hidden mr-5">
                        <Image source={{ uri: photo.url }} className="w-full h-full" />
                        <View className="absolute inset-0 bg-black/50" />
                        <View className="absolute top-3 right-3">
                          <FontAwesome6 name="clock-rotate-left" size={12} color="#FFFFFF" />
                        </View>
                        <View className="absolute bottom-4 left-4 right-4">
                          <Text className="text-[10px] font-black text-white/60 mb-1 uppercase tracking-tighter">
                            {new Date(photo.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Text>
                          <Text className="text-sm font-bold text-white" numberOfLines={2}>
                            {photo.caption}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                  <Text className="text-2xl font-bold text-gray-900">Today's Story</Text>
                  <View className="ml-3 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                </View>
                <Pressable>
                  <Text className="text-[10px] font-black text-gray-400 uppercase tracking-widest">View All</Text>
                </Pressable>
              </View>

              {todayPhotos.length > 0 ? (
                todayPhotos.map(photo => (
                  <FeedCard
                    key={photo.id}
                    photo={photo}
                    room={mockRooms.find(r => r.id === photo.roomId)}
                    uploader={
                      photo.uploaderId === currentUser.id
                        ? currentUser
                        : { id: 'u-2', name: 'Sam Chen', avatar: 'https://picsum.photos/seed/u2/200/200', joinedRooms: [] }
                    }
                  />
                ))
              ) : (
                <View className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                  <View className="w-16 h-16 bg-white rounded-full items-center justify-center mx-auto mb-6">
                    <FontAwesome6 name="camera-retro" size={20} color="#D1D5DB" />
                  </View>
                  <Text className="text-gray-500 font-bold text-sm">Nothing shared yet today.</Text>
                  <Text className="text-gray-400 text-xs mt-1">Start a conversation with a photo.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1">
        {renderContent()}
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-gray-50 px-10 pt-4 pb-8 flex-row items-center justify-between">
        <Pressable onPress={() => { setActiveTab(AppTab.HOME); setSelectedRoomId(null); }} className="items-center">
          <FontAwesome6 name="house-chimney" size={20} color={activeTab === AppTab.HOME ? '#111827' : '#D1D5DB'} />
          <Text className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: activeTab === AppTab.HOME ? '#111827' : '#D1D5DB' }}>Feed</Text>
        </Pressable>
        <Pressable onPress={() => { setActiveTab(AppTab.ROOMS); setSelectedRoomId(null); }} className="items-center">
          <FontAwesome6 name="shapes" size={20} color={activeTab === AppTab.ROOMS ? '#111827' : '#D1D5DB'} />
          <Text className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: activeTab === AppTab.ROOMS ? '#111827' : '#D1D5DB' }}>Rooms</Text>
        </Pressable>
        <Pressable onPress={() => { setActiveTab(AppTab.DROP); setSelectedRoomId(null); }} className="items-center">
          <FontAwesome6 name="bolt-lightning" size={20} color="#F59E0B" />
          <Text className="text-[9px] font-black uppercase tracking-widest mt-1 text-amber-600">Drop</Text>
        </Pressable>
        <Pressable onPress={() => { setActiveTab(AppTab.PLAN); setSelectedRoomId(null); }} className="items-center">
          <FontAwesome6 name="mobile-screen-button" size={20} color={activeTab === AppTab.PLAN ? '#111827' : '#D1D5DB'} />
          <Text className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: activeTab === AppTab.PLAN ? '#111827' : '#D1D5DB' }}>Dev</Text>
        </Pressable>
      </View>

      {selectedRoom && (
        <RoomVault room={selectedRoom} photos={roomPhotos} onBack={() => setSelectedRoomId(null)} />
      )}
    </SafeAreaView>
  );
};

export default App;
