import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaContainerProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const SafeAreaContainer: React.FC<SafeAreaContainerProps> = ({ children, style }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      {children}
    </View>
  );
};

export default SafeAreaContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
