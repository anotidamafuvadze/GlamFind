import React from 'react';
import { View, Image, ViewStyle, ImageStyle } from 'react-native';
import Button from '../general/Button';

type SettingsButtonProps = {
  onPress?: () => void;
  style: {
    container: ViewStyle;
    image: ImageStyle;
    opacity: number;
  };
  iconSource: number;
};

/**
 * SettingsButton
 * - Icon button for settings
 */

export default function SettingsButton({
  onPress,
  style,
  iconSource,
}: SettingsButtonProps) {
  return (
    <View style={style.container}>
      <Button
        onPress={onPress}
        accessibilityLabel={'Settings'}
        activeOpacity={style.opacity}
      >
        <Image source={iconSource} style={style.image} resizeMode="contain" />
      </Button>
    </View>
  );
}
