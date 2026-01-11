import React from 'react';
import {
  View,
  Image,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Glow from '../general/Glow';
import Button from '../general/Button';

type LikesButtonProps = {
  onPress?: () => void;
  style: {
    container: ViewStyle;
    button: ViewStyle;
    glow: ViewStyle;
    text: TextStyle;
    image: ImageStyle;
    activeOpacity: number;
  };
  iconSource: number;
};

/**
 * LikesButton
 * - Icon button for viewing likes
 */

export default function LikesButton({
  onPress,
  style,
  iconSource,
}: LikesButtonProps) {
  return (
    <View style={style.container}>
      <Glow style={style.glow} />

      <Button
        onPress={onPress}
        accessibilityLabel="Likes"
        activeOpacity={style.activeOpacity}
        containerStyle={style.button}
      >
        <Image source={iconSource} style={style.image} resizeMode="contain" />
      </Button>

      <Text pointerEvents="none" style={style.text}>
        View likes
      </Text>
    </View>
  );
}
