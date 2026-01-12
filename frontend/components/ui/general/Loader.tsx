import React from 'react';
import { ActivityIndicator, StyleSheet, ImageStyle, View } from 'react-native';

type LoadingSpinnerProps = {
  style: ImageStyle;
};

/**
 * LoadingSpinner
 * - Animated loading spinner component
 * - Displays continuously to indicate loading state
 * - Replaces search icon while request is in flight
 */

export function LoadingSpinner({ style }: LoadingSpinnerProps) {
  return (
    <View style={[styles.spinnerContainer, style]}>
      <ActivityIndicator size="small" color="#ffffffff" />
    </View>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
