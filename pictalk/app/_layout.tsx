import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.candy.blue} />
    </View>
  );
}

function RootLayoutNav() {
  const { user, loading } = useAuth();

  // Add debug logging
  console.log('Auth State:', { user, loading });

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.candy.backgroundLight },
      }}
    >
      {/* Public Routes - Always Accessible */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Stack.Screen
        name="auth/sign-in"
        options={{
          title: 'Sign In',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="auth/sign-up"
        options={{
          title: 'Sign Up',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="pairing/scan"
        options={{
          title: 'Scan QR Code',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="pairing/request"
        options={{
          title: 'Pairing Request',
          presentation: 'modal',
        }}
      />

      {/* Protected Routes - Only for authenticated users */}
      {user && (
        <>
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
            }}
          />
        </>
      )}
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.candy.backgroundLight,
  },
});

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
