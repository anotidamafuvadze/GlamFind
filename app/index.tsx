import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { router } from 'expo-router';

// Screens
import { WelcomeScreen } from '../frontend/components/screens/WelcomeScreen';

export default function IndexRoute() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WelcomeScreen onGetStarted={() => router.replace('home')} />
    </>
  );
}
