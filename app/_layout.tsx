import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as ScreenOrientation from "expo-screen-orientation";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

/**
 * ScreensLayout
 * - Main layout component that wraps all screens in the app
 * - Enforces portrait orientation and provides consistent styling
 */
export default function ScreensLayout() {
  // Lock screen orientation to portrait on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  // Helper function to disable screen transitions
  function noAnimation(): NativeStackNavigationOptions {
    return { animation: "none" };
  }

  return (
    <SafeAreaProvider>
      <>
        {/* Background layer with app color */}
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: "#FBF7EF" }]}
        />
        
        {/* Navigation stack with shared options */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "none",
          }}
        >
          <Stack.Screen name="index" options={noAnimation()} />
          <Stack.Screen name="home" options={noAnimation()} />
          <Stack.Screen name="results" options={noAnimation()} />
          <Stack.Screen name="likes" options={noAnimation()} />
          <Stack.Screen name="sign-in" options={noAnimation()} />
          <Stack.Screen name="register" options={noAnimation()} />
        </Stack>
      </>
    </SafeAreaProvider>
  );
}