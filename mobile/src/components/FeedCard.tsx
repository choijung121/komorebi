import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
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
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: uploader?.avatar }} style={styles.avatar} />
            <View style={styles.statusDot} />
          </View>
          <View style={styles.userMeta}>
            <Text style={styles.userName}>{uploader?.name}</Text>
            <Text style={styles.roomName}>{room?.name}</Text>
          </View>
        </View>
        <Pressable style={styles.iconButton}>
          <FontAwesome6 name="ellipsis" size={16} color="#D1D5DB" />
        </Pressable>
      </View>

      <View style={styles.mediaWrap}>
        <Image source={{ uri: photo.url }} style={styles.media} />

        {isLocked && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockBadge}>
              <FontAwesome6 name="hourglass-half" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.lockTitle}>Time Capsule</Text>
            <Text style={styles.lockSubtitle}>
              Unlocks {new Date(photo.unlockDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        )}

        {photo.audioSnippetUrl && !isLocked && (
          <Pressable style={styles.audioButton}>
            <FontAwesome6 name="volume-high" size={18} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      {!isLocked && (
        <View style={styles.footer}>
          <View style={styles.actionsRow}>
            <Pressable style={styles.actionItem}>
              <FontAwesome6 name="heart" size={18} color="#9CA3AF" />
              <Text style={styles.actionText}>12</Text>
            </Pressable>
            <Pressable style={styles.actionItem}>
              <FontAwesome6 name="comment" size={18} color="#9CA3AF" />
              <Text style={styles.actionText}>4</Text>
            </Pressable>
            <Pressable style={styles.actionSpacer}>
              <FontAwesome6 name="bookmark" size={18} color="#9CA3AF" />
            </Pressable>
          </View>

          <Text style={styles.caption}>
            <Text style={styles.captionName}>{uploader?.name} </Text>
            {photo.caption}
          </Text>

          <View style={styles.tagsRow}>
            {photo.aiTags.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag.toLowerCase()}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(243,244,246,0.6)',
    overflow: 'hidden',
    marginBottom: 32
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarWrap: {
    position: 'relative'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  statusDot: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  userMeta: {
    marginLeft: 12
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827'
  },
  roomName: {
    marginTop: 2,
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  mediaWrap: {
    marginHorizontal: 8,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB'
  },
  media: {
    width: '100%',
    aspectRatio: 1
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  lockBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  lockTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4
  },
  lockSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  audioButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20
  },
  actionText: {
    marginLeft: 8,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#9CA3AF'
  },
  actionSpacer: {
    marginLeft: 'auto'
  },
  caption: {
    fontSize: 14,
    color: '#1F2937',
    lineHeight: 20,
    fontWeight: '500'
  },
  captionName: {
    fontWeight: '800',
    color: '#111827'
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12
  },
  tag: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8
  },
  tagText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  }
});
