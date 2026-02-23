import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  const insets = useSafeAreaInsets();

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.hero, { backgroundColor: room.color, height: 256 + insets.top }]}>
        <Image source={{ uri: room.coverImage }} style={styles.heroImage} />
        <View style={styles.heroOverlay} />

        <Pressable onPress={onBack} style={[styles.backButton, { top: 24 + insets.top }]}>
          <FontAwesome6 name="chevron-left" size={16} color="#FFFFFF" />
        </Pressable>

        <View style={styles.heroCopy}>
          <View style={styles.vibePill}>
            <Text style={styles.vibeText}>{room.vibe} VIBE</Text>
          </View>
          <Text style={styles.heroTitle}>{room.name}</Text>
          <Text style={styles.heroSubtitle} numberOfLines={1}>
            {room.description}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent}>
        <View style={styles.vibeCard}>
          <View style={styles.vibeHeader}>
            <Text style={styles.vibeHeaderText}>Room Vibe Check</Text>
            <FontAwesome6 name="sparkles" size={14} color="#F59E0B" />
          </View>
          <Text style={styles.vibeBody}>&quot;{vibeCheck}&quot;</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionCard}>
            <FontAwesome6 name="map-location-dot" size={18} color="#6366F1" />
            <Text style={styles.actionText}>Shared Map</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <FontAwesome6 name="users" size={18} color="#10B981" />
            <Text style={styles.actionText}>Members</Text>
          </Pressable>
          <Pressable style={styles.actionCard}>
            <FontAwesome6 name="book-open" size={18} color="#F59E0B" />
            <Text style={styles.actionText}>Annual Book</Text>
          </Pressable>
        </View>

        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>The Vault</Text>
          <Text style={styles.galleryCount}>{photos.length} MEDIA</Text>
        </View>

        <View style={styles.galleryGrid}>
          {photos.map(p => (
            <View key={p.id} style={styles.galleryItem}>
              <View style={styles.galleryMedia}>
                <Image source={{ uri: p.url }} style={styles.galleryImage} />
                {p.unlockDate && new Date(p.unlockDate) > new Date() && (
                  <View style={styles.lockOverlay}>
                    <FontAwesome6 name="lock" size={12} color="#E5E7EB" />
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.uploadButton} onPress={handleUpload} disabled={isUploading}>
        {isUploading ? <ActivityIndicator color="#FFFFFF" /> : <FontAwesome6 name="plus" size={18} color="#FFFFFF" />}
      </Pressable>
    </View>
  );
};

export default RoomVault;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF'
  },
  flex: {
    flex: 1
  },
  hero: {
    height: 256
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.5
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroCopy: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24
  },
  vibePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 8
  },
  vibeText: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#FFFFFF',
    fontWeight: '700'
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120
  },
  vibeCard: {
    marginTop: 32,
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  vibeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  vibeHeaderText: {
    fontWeight: '700',
    color: '#111827'
  },
  vibeBody: {
    fontStyle: 'italic',
    color: '#6B7280'
  },
  actionRow: {
    flexDirection: 'row',
    marginBottom: 32,
    marginTop: 8
  },
  actionCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF'
  },
  actionText: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#6B7280'
  },
  galleryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  galleryCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF'
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  galleryItem: {
    width: '33.3333%',
    padding: 4
  },
  galleryMedia: {
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6'
  },
  galleryImage: {
    width: '100%',
    height: '100%'
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
