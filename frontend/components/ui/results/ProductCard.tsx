import React, { useState } from 'react';
import {
  Image,
  ImageStyle,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { LikeButton } from './LikeButton';
import { DislikeButton } from './DislikeButton';

type ProductCardProps = {
  image: string;
  brand: string;
  name: string;
  rationale: string;
  onPress: (productId: string) => void;
  updateSelections: (
    productId: string,
    selection: 'like' | 'dislike' | null,
  ) => void;
  style: {
    card: ViewStyle;
    pressed: ViewStyle;
    imageWrap: ViewStyle;
    image: ImageStyle;
    content: ViewStyle;
    brand: TextStyle;
    name: TextStyle;
    rationale: TextStyle;
    actionsRow: ViewStyle;
    actionButton: {
      button: ViewStyle;
      selected: ViewStyle;
      text: TextStyle;
      selectedText: TextStyle;
    };
  };
};

/**
 * ProductCard component
 * - Displays a product image, details, and AI-generated rationale
 */

export function ProductCard({
  image,
  brand,
  name,
  rationale,
  onPress,
  style,
  updateSelections,
}: ProductCardProps) {
  const [selection, setSelection] = useState<'like' | 'dislike' | null>(null);
  const productId = `${brand}-${name}`;

  const handleSelection = (next: 'like' | 'dislike') => {
    const newSelection = selection === next ? null : next;
    setSelection(newSelection);
    updateSelections(productId, newSelection);
  };

  return (
    <Pressable
      onPress={() => onPress && onPress(productId)}
      style={({ pressed }) => [style.card, pressed && style.pressed]}
      accessibilityRole="button"
    >
      {/* Product image */}
      <View style={style.imageWrap}>
        <Image source={{ uri: image }} style={style.image} resizeMode="cover" />
      </View>

      {/* Product details */}
      <View style={style.content}>
        <Text style={style.brand}>{brand}</Text>
        <Text style={style.name}>{name}</Text>
        <Text style={style.rationale}>{rationale}</Text>

        {/* Like / Dislike actions */}
        <View style={style.actionsRow}>
          <LikeButton
            selected={selection === 'like'}
            onPress={() => handleSelection('like')}
            style={style.actionButton}
          />

          <DislikeButton
            selected={selection === 'dislike'}
            onPress={() => handleSelection('dislike')}
            style={style.actionButton}
          />
        </View>
      </View>
    </Pressable>
  );
}
