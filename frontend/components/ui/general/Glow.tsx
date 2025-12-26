import React from 'react';
import { View } from 'react-native';

type GlowProps = {
  style?: any;
};

/**
 * Glow
 * - Decorative, glow element for background accents
 */

export default function Glow({ style }: GlowProps) {
  const baseStyle = {
    position: "absolute",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
  };

  return <View pointerEvents="none" style={[baseStyle, style]} />;
}
