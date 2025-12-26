import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';

type ButtonProps = {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event?: GestureResponderEvent) => void;
  containerStyle?: any;
  textStyle?: any;
  activeOpacity?: number;
  accessibilityLabel?: string;
  style?: { button?: any; text?: any };
};

/**
 * Button
 * - Reusable touchable button
 */

export default function Button({
  title,
  children,
  onPress,
  containerStyle,
  textStyle,
  activeOpacity = 0.9,
  accessibilityLabel = 'Button',
  style,
}: ButtonProps) {
  const label = title ?? children;
  const container = containerStyle ?? style?.button;
  const text = textStyle ?? style?.text;

  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      onPress={onPress}
      style={container}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={text}>{label}</Text>
    </TouchableOpacity>
  );
}

export { Button };
