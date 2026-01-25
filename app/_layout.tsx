import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export default function ScreensLayout() {
  function noAnimation(): NativeStackNavigationOptions {
    return { animation: 'none' };
  }

  return (
    <SafeAreaProvider>
      <>
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: '#FBF7EF' }]}
        />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'none',
          }}
        >
          <Stack.Screen name="index" options={noAnimation()} />
          <Stack.Screen name="home" options={noAnimation()} />
          <Stack.Screen name="results" options={noAnimation()} />
          <Stack.Screen name="likes" options={noAnimation()} />
          <Stack.Screen name="settings" options={noAnimation()} />
          <Stack.Screen name="sign-in" options={noAnimation()} />
          <Stack.Screen name="register" options={noAnimation()} />
        </Stack>
      </>
    </SafeAreaProvider>
  );
}
