import React from 'react';
import { 
  Pressable, 
  Image, 
  ImageStyle, 
  ViewStyle } from 'react-native';

// Constants
import images from '../../../constants/images';

type BackButtonProps = {
  onPress: () => void;
  style: {
    button: ViewStyle;
    pressed: ViewStyle;
    icon: ImageStyle;
  };    
};

/**
 * BackButton component
 * - Reusable navigation button for returning to the previous screen
 */
export function BackButton({
  onPress,
  style,
}: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={'Go back'}
      style={({ pressed }) => [style.button, pressed && style.pressed]}
    >
      <Image
        source={images.icons.back}
        resizeMode="contain"
        style={style.icon}
      />
    </Pressable>
  );
}

export default BackButton;
