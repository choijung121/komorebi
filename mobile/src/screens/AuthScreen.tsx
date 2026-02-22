import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '../lib/supabase';

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });
    if (signInError) setError(signInError.message);
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password
    });
    if (signUpError) setError(signUpError.message);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <View className="flex-1 px-6 justify-center">
        <View className="mb-10">
          <Text className="text-3xl font-black text-gray-900">Komorebi</Text>
          <Text className="text-gray-500 mt-2">Sign in to your private rooms</Text>
        </View>

        <View className="mb-4">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email</Text>
          <TextInput
            className="border border-gray-200 rounded-2xl px-4 py-3 text-base"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View className="mb-6">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</Text>
          <TextInput
            className="border border-gray-200 rounded-2xl px-4 py-3 text-base"
            secureTextEntry
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && (
          <View className="mb-4">
            <Text className="text-sm text-red-500">{error}</Text>
          </View>
        )}

        <Pressable
          className="bg-black rounded-2xl py-4 items-center mb-3"
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white font-bold">{loading ? 'Signing in...' : 'Sign In'}</Text>
        </Pressable>

        <Pressable
          className="border border-gray-200 rounded-2xl py-4 items-center"
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-gray-700 font-bold">Create Account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
