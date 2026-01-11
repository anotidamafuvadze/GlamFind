import React from 'react';
import {
  View,
  Image,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Button from '../general/Button';

type SignInButtonProps = {
  onPress?: () => void;
  style: {
    container: ViewStyle;
    button: ViewStyle;
    text?: TextStyle;
    image?: ImageStyle;
    activeOpacity?: number;
  };
  iconSource: number;
};

/**
 * SignInButton
 * - Icon button for sign-in
 */

export default function SignInButton({
  onPress,
  style,
  iconSource,
}: SignInButtonProps) {
  return (
    <View style={style.container}>
      <Button
        onPress={onPress}
        accessibilityLabel="Sign in"
        activeOpacity={style.activeOpacity}
        containerStyle={style.button}
      >
        <Image source={iconSource} style={style.image} resizeMode="contain" />
      </Button>

      <Text pointerEvents="none" style={style.text}>
        Sign in
      </Text>
    </View>
  );
}
