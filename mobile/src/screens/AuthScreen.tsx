import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import styles from './authStyles';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [transitioning, setTransitioning] = useState(false);

  const switchMode = (next: 'signin' | 'signup') => {
    setTransitioning(true);
    setTimeout(() => {
      setMode(next);
      setTransitioning(false);
    }, 300);
  };

  if (transitioning) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  if (mode === 'signin') {
    return <SignInScreen onCreateAccount={() => switchMode('signup')} />;
  }

  return <SignUpScreen onBackToSignIn={() => switchMode('signin')} />;
};

export default AuthScreen;
