import React from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';

type DislikeButtonProps = {
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
 * DislikeButton component
 * - Renders a pressable “dislike” action
 */

export function DislikeButton({
  selected,
  onPress,
  style,
}: DislikeButtonProps) {
  const accessibilityLabel = selected ? 'Remove dislike' : 'Dislike';

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
      <Text style={[style.text, selected && style.selectedText]}>
        ✕
      </Text>
    </Pressable>
  );
}
