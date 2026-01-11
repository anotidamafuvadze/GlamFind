import React from 'react';
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonProps = {
  title?: string;
  children?: React.ReactNode;
  onPress?: (event?: GestureResponderEvent) => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  accessibilityLabel?: string;
  style?: {
    button?: ViewStyle;
    text?: TextStyle;
  };
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
  const label = title ?? (typeof children === 'string' ? children : undefined);

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
      {children && typeof children !== 'string' ? (
        children
      ) : (
        <Text style={text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export { Button };
