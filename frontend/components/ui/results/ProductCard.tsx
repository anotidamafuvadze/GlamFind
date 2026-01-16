import React, { useMemo, useState } from 'react';
import {
  ImageStyle,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';

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

/**
 * ProductCard component
 * - Displays a product image, details, and AI-generated rationale
 * - Fix 2: Use react-native-fast-image for better caching + more reliable remote loading
 * - Keeps diagnostic logs for image load success / failure
 *
 * Install (npm):
 *   npm install react-native-fast-image
 *   cd ios && pod install && cd ..
 */

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
  style,
  updateSelections,
}: ProductCardProps) {
  const [selection, setSelection] = useState<'like' | 'dislike' | null>(null);

  const normalizedImageUrl = useMemo(
    () => (image_url || '').trim(),
    [image_url],
  );

  // ---- IMAGE DIAGNOSTICS ----
  const hasImageUrl = !!normalizedImageUrl;
  console.log(
    'ProductCard image_url:',
    normalizedImageUrl,
    'exists?',
    hasImageUrl,
  );

  const handleSelection = (next: 'like' | 'dislike') => {
    const newSelection = selection === next ? null : next;
    setSelection(newSelection);
    updateSelections(id, newSelection);
  };

  return (
    <Pressable
      onPress={() => onPress && onPress(id)}
      style={({ pressed }) => [style.card, pressed && style.pressed]}
      accessibilityRole="button"
    >
      {/* ===================== */}
      {/* PRODUCT IMAGE HEADER */}
      {/* ===================== */}
      {hasImageUrl && (
        <View style={style.imageWrap}>
          <FastImage
            style={[style.image as any]}
            source={{
              uri: normalizedImageUrl,
              // Helps when you have many images in a list
              priority: FastImage.priority.normal,
              // Good default for CDN URLs that don't change often
              cache: FastImage.cacheControl.immutable,
            }}
            resizeMode={FastImage.resizeMode.contain} // Changed from "cover" to "contain"
            onLoad={() =>
              console.log('Image loaded successfully:', normalizedImageUrl)
            }
            onError={e => {
              console.log('FastImage error:', {
                url: normalizedImageUrl,
                nativeEvent: e?.nativeEvent,
              });
            }}
          />
        </View>
      )}

      {/* ================= */}
      {/* PRODUCT DETAILS */}
      {/* ================= */}
      <View style={style.content}>
        <Text style={style.brand}>{brand}</Text>
        <Text style={style.name}>{name}</Text>
        <Text style={style.rationale}>{explanation}</Text>

        {/* Price and Rating */}
        <View
          style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}
        >
          {price && <Text style={style.brand}>{price}</Text>}
          {rating > 0 && (
            <Text style={[style.brand, { marginLeft: 12 }]}>
              ★ {rating.toFixed(1)} ({rating_count})
            </Text>
          )}
        </View>

        {/* Source */}
        {source_name && (
          <Text style={[style.rationale, { fontSize: 11, marginTop: 4 }]}>
            From {source_name}
          </Text>
        )}

        {/* Web link - hidden but accessible via onPress */}
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
