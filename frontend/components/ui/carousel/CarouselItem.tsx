import React from 'react';
import {
  View,
  Image,
  ViewStyle,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

type CarouselItemProps = {
  imgSource: ImageSourcePropType;
  style: ViewStyle & { image: ImageStyle };
};

/**
 * CarouselItem component
 * - Individual card component for displaying product images in the carousel
 */
export default function CarouselItem({ imgSource, style }: CarouselItemProps) {
  return (
    <View style={style}>
      <Image
        source={imgSource}
        resizeMode="cover"
        style={style.image}
      />
    </View>
  );
}
