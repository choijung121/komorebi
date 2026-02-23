import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const ArchitecturePlan: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native Plan</Text>
        <Text style={styles.subtitle}>Komorebi Mobile Core Architecture</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconWrap, styles.iconIndigo]}>
            <FontAwesome6 name="code-branch" size={12} color="#FFFFFF" />
          </View>
          <Text style={styles.sectionTitle}>Project Structure</Text>
        </View>
        <View style={styles.card}>
          {[
            'src/navigation/ // Stack & Tab Navigators',
            'src/screens/ // Feed, Vault, Drop, Profile',
            'src/components/ // Atom & Molecule UI',
            'src/store/ // Zustand/Redux for Room data',
            'src/hooks/ // usePhotos, useRoomVibe',
            'src/services/ // Gemini API & Firebase Bridge'
          ].map(row => (
            <View key={row} style={styles.listRow}>
              <FontAwesome6 name="folder" size={12} color="#F59E0B" />
              <Text style={styles.listText}>{row}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconWrap, styles.iconEmerald]}>
            <FontAwesome6 name="cube" size={12} color="#FFFFFF" />
          </View>
          <Text style={styles.sectionTitle}>Native Modules</Text>
        </View>
        <View style={styles.grid}>
          {[
            { name: 'expo-image', desc: 'Blurred placeholders' },
            { name: 'react-navigation', desc: 'Native Transitions' },
            { name: 'react-native-reanimated', desc: '60fps UI Logic' },
            { name: 'expo-av', desc: 'Audio Snippets' },
            { name: 'react-native-maps', desc: 'Shared Room Map' },
            { name: 'expo-haptics', desc: 'Mood Reactions' }
          ].map(lib => (
            <View key={lib.name} style={styles.gridItem}>
              <Text style={styles.gridTitle}>{lib.name}</Text>
              <Text style={styles.gridSubtitle}>{lib.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconWrap, styles.iconDark]}>
            <FontAwesome6 name="brackets-curly" size={12} color="#FFFFFF" />
          </View>
          <Text style={styles.sectionTitle}>State Schema (Zustand)</Text>
        </View>
        <View style={styles.codeCard}>
          <Text style={styles.codeText}>
            {`interface KomorebiState {\n  user: UserProfile;\n  activeRooms: Room[];\n  currentDrop: Drop | null;\n\n  // Actions\n  fetchDailyFeed: () => Promise<void>;\n  contributeToRoom: (photo: Photo) => void;\n  unlockCapsule: (photoId: string) => void;\n  updateVibe: (roomId: string, mood: Mood) => void;\n}`}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Deployment Target</Text>
        <Text style={styles.footerText}>Optimized for iOS 15+ & Android 12 (API 31)</Text>
      </View>
    </ScrollView>
  );
};

export default ArchitecturePlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  content: {
    padding: 24,
    paddingBottom: 120
  },
  header: {
    marginBottom: 40
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8
  },
  subtitle: {
    color: '#6B7280'
  },
  section: {
    marginBottom: 40
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconIndigo: {
    backgroundColor: '#4F46E5'
  },
  iconEmerald: {
    backgroundColor: '#10B981'
  },
  iconDark: {
    backgroundColor: '#111827'
  },
  sectionTitle: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 20,
    padding: 20
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  listText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  gridItem: {
    width: '50%',
    padding: 8
  },
  gridTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4
  },
  gridSubtitle: {
    fontSize: 10,
    color: '#6B7280'
  },
  codeCard: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20
  },
  codeText: {
    color: '#6EE7B7',
    fontSize: 10,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace'
  },
  footer: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems: 'center'
  },
  footerLabel: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#B45309',
    marginBottom: 4
  },
  footerText: {
    fontSize: 14,
    color: '#92400E'
  }
});
