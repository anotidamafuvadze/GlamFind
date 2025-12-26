import React from 'react';
import { Pressable, Image } from 'react-native';
import images from '../../../constants/images';

type BackButtonProps = {
  onPress: () => void;
  style?: any;
  pressedStyle?: any;
  iconStyle?: any;
  accessibilityLabel?: string;
};

/**
 * BackButton
 * - Reusable navigation button for returning to the previous screen
 */

export function BackButton({
  onPress,
  style,
  pressedStyle,
  iconStyle,
  accessibilityLabel = 'Go back',
}: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [style, pressed && pressedStyle]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Image
        source={images.icons.backIcon}
        style={iconStyle}
        resizeMode="contain"
      />
    </Pressable>
  );
}

export default BackButton;
