import React from 'react';
import { Pressable, Text, TextStyle, ViewStyle } from 'react-native';

type LikeButtonProps = {
  selected: boolean;
  onPress: () => void;
  style: {
    button: ViewStyle;
    selected: ViewStyle;
    text: TextStyle;
    selectedText: TextStyle;
  };
};

/**
 * LikeButton component
 * - Renders a pressable “like” action
 */

export function LikeButton({
  selected,
  onPress,
  style,
}: LikeButtonProps) {
  const accessibilityLabel = selected ? 'Remove like' : 'Like';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        style.button,
        selected && style.selected,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      hitSlop={10}
    >
      <Text style={[
        style.text,
        selected && style.selectedText,
      ]}>
        ♥︎
      </Text>
    </Pressable>
  );
}