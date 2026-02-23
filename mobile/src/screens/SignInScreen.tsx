import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';
import SafeAreaContainer from '../components/SafeAreaContainer';
import styles from './authStyles';

interface SignInScreenProps {
  onCreateAccount: () => void;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ onCreateAccount }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const resetErrors = () => {
    setError(null);
    setFieldErrors({ email: '', password: '' });
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const handleSignIn = async () => {
    resetErrors();
    const nextErrors = { email: '', password: '' };
    if (!email.trim()) nextErrors.email = 'Please enter your email.';
    if (!password) nextErrors.password = 'Your password must be at least 10 characters.';
    if (email.trim() && !validateEmail(email)) nextErrors.email = 'Please enter a valid email address.';
    if (password && password.length < 10) nextErrors.password = 'Your password must be at least 10 characters.';
    if (nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (signInError) {
      const message = signInError.message.toLowerCase();
      if (
        message.includes('invalid login credentials') ||
        message.includes('invalid credentials') ||
        message.includes('user not found')
      ) {
        setError("Sorry, this account doesn't exists");
      } else {
        setError(signInError.message);
      }
    }
    setLoading(false);
  };

  return (
    <SafeAreaContainer style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={styles.title}>Komorebi</Text>
              <Text style={styles.subtitle}>Sign in to your private rooms</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
              />
              {fieldErrors.password ? <Text style={styles.fieldError}>{fieldErrors.password}</Text> : null}
            </View>

            {error && (
              <View style={styles.errorWrap}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <Pressable
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.primaryText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
            </Pressable>

            <Pressable
              style={[styles.secondaryButton, loading && styles.buttonDisabled]}
              onPress={onCreateAccount}
              disabled={loading}
            >
              <Text style={styles.secondaryText}>Create Account</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default SignInScreen;
