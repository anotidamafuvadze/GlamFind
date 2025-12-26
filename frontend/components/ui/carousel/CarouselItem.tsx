import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';

/**
 * CarouselItem
 * - Individual card component for displaying product images in the carousel
 */

type CarouselItemProps = {
  imgSource: ImageSourcePropType;
  style?: ViewStyle | any;
};

export default function CarouselItem({
  imgSource,
  style,
}: CarouselItemProps) {
  return (
    <View style={[style]}>
      <Image
        source={imgSource}
        style={style.carouselImage}
        resizeMode="cover"
      />
    </View>
  );
}
