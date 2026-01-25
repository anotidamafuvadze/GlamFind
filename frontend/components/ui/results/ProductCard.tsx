import React, { useMemo, useState } from 'react';
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
  id: string;
  image_url: string;
  brand: string;
  name: string;
  product_url: string;
  price: string;
  rating: number;
  rating_count: number;
  source_name: string;
  explanation: string;

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

export function ProductCard({
  id,
  image_url,
  brand,
  name,
  product_url,
  price,
  rating,
  rating_count,
  source_name,
  explanation,
  onPress,
  updateSelections,
  style,
}: ProductCardProps) {
  const [selection, setSelection] = useState<'like' | 'dislike' | null>(null);

  const normalizedImageUrl = useMemo(() => {
    return (image_url || '').trim();
  }, [image_url]);

  const handleSelection = (next: 'like' | 'dislike') => {
    const newSelection = selection === next ? null : next;
    setSelection(newSelection);
    updateSelections(id, newSelection);
  };

  return (
    <Pressable
      onPress={() => onPress(id)}
      style={({ pressed }) => [style.card, pressed && style.pressed]}
      accessibilityRole="button"
    >
      {/* IMAGE */}
      {normalizedImageUrl && (
        <View style={style.imageWrap}>
          <Image
            style={style.image}
            source={{ uri: normalizedImageUrl }}
            resizeMode="contain"
          />
        </View>
      )}

      {/* CONTENT */}
      <View style={style.content}>
        <Text style={style.brand}>{brand}</Text>
        <Text style={style.name}>{name}</Text>
        <Text style={style.rationale}>{explanation}</Text>

        {/* PRICE + RATING */}
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {price && <Text style={style.brand}>{price}</Text>}
          {rating > 0 && (
            <Text style={[style.brand, { marginLeft: 12 }]}>
              ★ {rating.toFixed(1)} ({rating_count})
            </Text>
          )}
        </View>

        {/* SOURCE */}
        {source_name && (
          <Text style={[style.rationale, { fontSize: 11, marginTop: 4 }]}>
            From {source_name}
          </Text>
        )}

        {/* LINK */}
        {product_url && (
          <Text
            style={[
              style.rationale,
              { fontSize: 10, marginTop: 2, opacity: 0.7 },
            ]}
            numberOfLines={1}
          >
            {product_url}
          </Text>
        )}

        {/* ACTIONS */}
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
