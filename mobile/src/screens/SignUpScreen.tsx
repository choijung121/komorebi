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

interface SignUpScreenProps {
  onBackToSignIn: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBackToSignIn }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [confirmed, setConfirmed] = useState(false);

  const resetErrors = () => {
    setError(null);
    setFieldErrors({ firstName: '', lastName: '', email: '', password: '' });
  };

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const handleSignUp = async () => {
    resetErrors();
    const nextErrors = { firstName: '', lastName: '', email: '', password: '' };
    if (!firstName.trim()) nextErrors.firstName = 'Please enter your first name.';
    if (!lastName.trim()) nextErrors.lastName = 'Please enter your last name.';
    if (!email.trim()) nextErrors.email = 'Please enter your email.';
    if (!password) nextErrors.password = 'Your password must be at least 10 characters.';
    if (email.trim() && !validateEmail(email)) nextErrors.email = 'Please enter a valid email address.';
    if (password && password.length < 8) nextErrors.password = 'Your password must be at least 8 characters.';
    if (nextErrors.firstName || nextErrors.lastName || nextErrors.email || nextErrors.password) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          full_name: `${firstName.trim()} ${lastName.trim()}`.trim()
        }
      }
    });
    if (signUpError) {
      const message = signUpError.message.toLowerCase();
      if (message.includes('already registered') || message.includes('already exists')) {
        setError('this email is already being used');
      } else {
        setError(signUpError.message);
      }
    } else {
      setConfirmed(true);
    }
    setLoading(false);
  };

  if (confirmed) {
    return (
      <SafeAreaContainer style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <StatusBar style="dark" />
          <View style={styles.container}>
            <View style={styles.form}>
              <View style={styles.header}>
                <Text style={styles.title}>Komorebi</Text>
                <Text style={styles.subtitle}>Confirm your email</Text>
              </View>

              <View style={styles.confirmCard}>
                <Text style={styles.confirmTitle}>Confirm your email</Text>
                <Text style={styles.confirmBody}>
                  We sent a confirmation link to {email || 'your email'}. Please verify to continue.
                </Text>
                <Pressable
                  style={[styles.secondaryButton, loading && styles.buttonDisabled]}
                  onPress={onBackToSignIn}
                  disabled={loading}
                >
                  <Text style={styles.secondaryText}>Back to Sign In</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaContainer>
    );
  }

  return (
    <SafeAreaContainer style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          <View style={styles.form}>
            <View style={styles.header}>
              <Text style={styles.title}>Komorebi</Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>

            <View style={styles.nameRow}>
              <View style={[styles.field, styles.nameField]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="James"
                  value={firstName}
                  onChangeText={setFirstName}
                />
                {fieldErrors.firstName ? <Text style={styles.fieldError}>{fieldErrors.firstName}</Text> : null}
              </View>
              <View style={[styles.field, styles.nameField]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Choi"
                  value={lastName}
                  onChangeText={setLastName}
                />
                {fieldErrors.lastName ? <Text style={styles.fieldError}>{fieldErrors.lastName}</Text> : null}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
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
                placeholder="Password (at least 8 characters)"
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
              onPress={handleSignUp}
              disabled={loading}
            >
              <Text style={styles.primaryText}>{loading ? 'Creating...' : 'Create Account'}</Text>
            </Pressable>

            <Pressable
              style={[styles.secondaryButton, loading && styles.buttonDisabled]}
              onPress={onBackToSignIn}
              disabled={loading}
            >
              <Text style={styles.secondaryText}>Back to Sign In</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default SignUpScreen;
