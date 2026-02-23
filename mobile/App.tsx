import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome6 } from '@expo/vector-icons';
import { AppTab } from './src/types';
import { currentUser, mockPhotos, mockRooms } from './src/data/mockData';
import FeedCard from './src/components/FeedCard';
import RoomVault from './src/components/RoomVault';
import ArchitecturePlan from './src/components/ArchitecturePlan';
import { AuthScreen } from './src/screens';
import { supabase } from './src/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import SafeAreaContainer from './src/components/SafeAreaContainer';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setAuthLoading(false);
    };
    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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

  if (isLoading || authLoading) {
    return (
      <SafeAreaContainer style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.splashLogo}>
          <Text style={styles.splashLogoText}>K</Text>
        </View>
        <View style={styles.splashCopy}>
          <Text style={styles.splashTitle}>Komorebi</Text>
          <Text style={styles.splashSubtitle}>Capturing light between leaves...</Text>
        </View>
      </SafeAreaContainer>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.PLAN:
        return <ArchitecturePlan />;
      case AppTab.ROOMS:
        return (
          <ScrollView style={styles.flex} contentContainerStyle={styles.screenPaddingBottom}>
            <View style={styles.screenHeader}>
              <Text style={styles.screenTitle}>My Rooms</Text>
              <Text style={styles.screenSubtitle}>Your private sanctuaries</Text>
            </View>
            <View>
              {mockRooms.map(room => (
                <Pressable
                  key={room.id}
                  onPress={() => setSelectedRoomId(room.id)}
                  style={styles.roomCard}
                >
                  <View style={styles.roomCardMedia}>
                    <Image source={{ uri: room.coverImage }} style={styles.roomImage} />
                    <View style={styles.roomOverlay} />
                    <View style={styles.roomCardContent}>
                      <View>
                        <Text style={styles.roomName}>{room.name}</Text>
                        <View style={styles.roomMetaRow}>
                          <FontAwesome6 name="user-group" size={10} color="#FFFFFF" />
                          <Text style={styles.roomMetaText}>
                            {room.memberIds.length} Members • {room.vibe}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.roomChevron}>
                        <FontAwesome6 name="arrow-right" size={16} color="#FFFFFF" />
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
              <Pressable style={styles.newRoomCard}>
                <View style={styles.newRoomIconWrap}>
                  <FontAwesome6 name="plus" size={16} color="#9CA3AF" />
                </View>
                <Text style={styles.newRoomText}>New Private Room</Text>
              </Pressable>
            </View>
          </ScrollView>
        );
      case AppTab.DROP:
        return (
          <ScrollView style={styles.flex} contentContainerStyle={styles.screenPaddingBottom}>
            <View style={styles.dropHero}>
              <View style={styles.dropIconWrap}>
                <FontAwesome6 name="bolt-lightning" size={40} color="#F59E0B" />
              </View>
              <Text style={styles.dropTitle}>Start a Drop</Text>
              <Text style={styles.dropSubtitle}>
                Instantly share photos with everyone at your current location for a limited time.
              </Text>
            </View>
            <View>
              {mockRooms.map(room => (
                <Pressable key={room.id} style={styles.dropRoomCard}>
                  <Image source={{ uri: room.coverImage }} style={styles.dropRoomImage} />
                  <View style={styles.dropRoomTextWrap}>
                    <Text style={styles.dropRoomName}>{room.name}</Text>
                    <Text style={styles.dropRoomStatus}>Ready for Drop</Text>
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
          <ScrollView style={styles.flex} contentContainerStyle={styles.homePaddingBottom}>
            <View style={styles.homeHeader}>
              <View style={styles.brandRow}>
                <View style={styles.brandLogo}>
                  <Text style={styles.brandLogoText}>K</Text>
                </View>
                <View>
                  <Text style={styles.brandTitle}>Komorebi</Text>
                  <Text style={styles.brandSubtitle}>Daily Summary</Text>
                </View>
              </View>
              <Pressable onPress={() => supabase.auth.signOut()}>
                <Image source={{ uri: currentUser.avatar }} style={styles.avatarLarge} />
                <View style={styles.avatarDot} />
              </Pressable>
            </View>

            <View style={styles.homeBody}>
              {flashbacks.length > 0 && (
                <View style={styles.flashbackSection}>
                  <View style={styles.flashbackHeader}>
                    <Text style={styles.flashbackTitle}>Flashbacks</Text>
                    <View style={styles.flashbackBadge}>
                      <Text style={styles.flashbackBadgeText}>Past Memories</Text>
                    </View>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.flashbackScroll}>
                    {flashbacks.map(photo => (
                      <View key={photo.id} style={styles.flashbackCard}>
                        <Image source={{ uri: photo.url }} style={styles.flashbackImage} />
                        <View style={styles.flashbackOverlay} />
                        <View style={styles.flashbackIcon}>
                          <FontAwesome6 name="clock-rotate-left" size={12} color="#FFFFFF" />
                        </View>
                        <View style={styles.flashbackCopy}>
                          <Text style={styles.flashbackDate}>
                            {new Date(photo.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Text>
                          <Text style={styles.flashbackCaption} numberOfLines={2}>
                            {photo.caption}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.storyHeader}>
                <View style={styles.storyTitleRow}>
                  <Text style={styles.storyTitle}>Today's Story</Text>
                  <View style={styles.storyDot} />
                </View>
                <Pressable>
                  <Text style={styles.storyLink}>View All</Text>
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
                <View style={styles.emptyState}>
                  <View style={styles.emptyIcon}>
                    <FontAwesome6 name="camera-retro" size={20} color="#D1D5DB" />
                  </View>
                  <Text style={styles.emptyTitle}>Nothing shared yet today.</Text>
                  <Text style={styles.emptySubtitle}>Start a conversation with a photo.</Text>
                </View>
              )}
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <SafeAreaContainer style={styles.safe}>
      <StatusBar style="dark" />
      <View style={styles.flex}>{renderContent()}</View>

      <View style={styles.tabBar}>
        <Pressable onPress={() => { setActiveTab(AppTab.HOME); setSelectedRoomId(null); }} style={styles.tabItem}>
          <FontAwesome6 name="house-chimney" size={20} color={activeTab === AppTab.HOME ? '#111827' : '#D1D5DB'} />
          <Text style={[styles.tabLabel, activeTab === AppTab.HOME ? styles.tabLabelActive : styles.tabLabelInactive]}>Feed</Text>
        </Pressable>
        <Pressable onPress={() => { setActiveTab(AppTab.ROOMS); setSelectedRoomId(null); }} style={styles.tabItem}>
          <FontAwesome6 name="shapes" size={20} color={activeTab === AppTab.ROOMS ? '#111827' : '#D1D5DB'} />
          <Text style={[styles.tabLabel, activeTab === AppTab.ROOMS ? styles.tabLabelActive : styles.tabLabelInactive]}>Rooms</Text>
        </Pressable>
        <Pressable onPress={() => { setActiveTab(AppTab.DROP); setSelectedRoomId(null); }} style={styles.tabItem}>
          <FontAwesome6 name="bolt-lightning" size={20} color="#F59E0B" />
          <Text style={[styles.tabLabel, styles.tabLabelAccent]}>Drop</Text>
        </Pressable>
        <Pressable onPress={() => { setActiveTab(AppTab.PLAN); setSelectedRoomId(null); }} style={styles.tabItem}>
          <FontAwesome6 name="mobile-screen-button" size={20} color={activeTab === AppTab.PLAN ? '#111827' : '#D1D5DB'} />
          <Text style={[styles.tabLabel, activeTab === AppTab.PLAN ? styles.tabLabelActive : styles.tabLabelInactive]}>Dev</Text>
        </Pressable>
      </View>

      {selectedRoom && session && (
        <RoomVault
          room={selectedRoom}
          photos={roomPhotos}
          onBack={() => setSelectedRoomId(null)}
          uploaderId={session.user.id}
        />
      )}
    </SafeAreaContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  flex: {
    flex: 1
  },
  splashLogo: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32
  },
  splashLogoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800'
  },
  splashCopy: {
    alignItems: 'center'
  },
  splashTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827'
  },
  splashSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF'
  },
  screenPaddingBottom: {
    paddingHorizontal: 24,
    paddingBottom: 120
  },
  homePaddingBottom: {
    paddingBottom: 120
  },
  screenHeader: {
    marginBottom: 32
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8
  },
  screenSubtitle: {
    color: '#6B7280'
  },
  roomCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden'
  },
  roomCardMedia: {
    height: 192
  },
  roomImage: {
    width: '100%',
    height: '100%'
  },
  roomOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  roomCardContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  roomName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  roomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roomMetaText: {
    marginLeft: 8,
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  roomChevron: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  newRoomCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  newRoomIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  newRoomText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#9CA3AF'
  },
  dropHero: {
    alignItems: 'center',
    marginBottom: 32
  },
  dropIconWrap: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32
  },
  dropTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12
  },
  dropSubtitle: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 14
  },
  dropRoomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
    backgroundColor: '#FFFFFF'
  },
  dropRoomImage: {
    width: 56,
    height: 56,
    borderRadius: 16
  },
  dropRoomTextWrap: {
    flex: 1,
    marginLeft: 16
  },
  dropRoomName: {
    fontWeight: '700',
    color: '#1F2937'
  },
  dropRoomStatus: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#10B981'
  },
  homeHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  brandLogoText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800'
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4
  },
  avatarLarge: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  avatarDot: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  homeBody: {
    paddingHorizontal: 24,
    paddingVertical: 24
  },
  flashbackSection: {
    marginBottom: 48
  },
  flashbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  flashbackTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827'
  },
  flashbackBadge: {
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  flashbackBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#F59E0B'
  },
  flashbackScroll: {
    paddingHorizontal: 8
  },
  flashbackCard: {
    width: 176,
    height: 256,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 20
  },
  flashbackImage: {
    width: '100%',
    height: '100%'
  },
  flashbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  flashbackIcon: {
    position: 'absolute',
    top: 12,
    right: 12
  },
  flashbackCopy: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16
  },
  flashbackDate: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  flashbackCaption: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32
  },
  storyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  storyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827'
  },
  storyDot: {
    marginLeft: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981'
  },
  storyLink: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#9CA3AF'
  },
  emptyState: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#F3F4F6',
    borderRadius: 24,
    paddingVertical: 48,
    alignItems: 'center'
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24
  },
  emptyTitle: {
    fontWeight: '700',
    color: '#6B7280'
  },
  emptySubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF'
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#F9FAFB',
    paddingHorizontal: 40,
    paddingTop: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  tabItem: {
    alignItems: 'center'
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  tabLabelActive: {
    color: '#111827'
  },
  tabLabelInactive: {
    color: '#D1D5DB'
  },
  tabLabelAccent: {
    color: '#D97706'
  }
});
