import React, { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  Image,
  Linking,
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
          return proxied;
  explanation: string;

  onPress: (productId: string) => void;
  updateSelections: (
            return;

  style: {
    card: ViewStyle;
    pressed: ViewStyle;
    imageWrap: ViewStyle;
    image: ImageStyle;
    content: ViewStyle;
    name: TextStyle;
    rationale: TextStyle;
    actionsRow: ViewStyle;
    actionButton: {
      button: ViewStyle;
      selected: ViewStyle;
      text: TextStyle;
    };
  };
};

const IMAGE_PROXY_BASE_URL = 'http://localhost:8000';

function toProxiedImageUrl(upstreamUrl: string): string {
  const trimmed = (upstreamUrl || '').trim();
  if (!trimmed) return '';

  // If it's already proxied, don't double-wrap it
  if (
    trimmed.includes('/api/image-proxy?url=') ||
    trimmed.includes('/image-proxy?url=')
  // ✅ FIX 2: your FastAPI mounts the router under /api
  return `${IMAGE_PROXY_BASE_URL}/api/image-proxy?url=${encodeURIComponent(

export function ProductCard({
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
  const [imageError, setImageError] = useState(false);

  const proxiedImageUrl = useMemo(() => {
    const proxied = toProxiedImageUrl(image_url);
    console.debug(`Proxied image URL for product ${id}: ${proxied}`);
    return proxied;
  }, [image_url, id]);

  useEffect(() => {
    if (imageError) {
      console.error(
        `Image failed to load for product ${id}: ${proxiedImageUrl}`,
      );
    }
  }, [imageError, id, proxiedImageUrl]);

  const handleSelection = (next: 'like' | 'dislike') => {
    const newSelection = selection === next ? null : next;
    setSelection(newSelection);
    updateSelections(id, newSelection);
    console.debug(`Selection updated for product ${id}: ${newSelection}`);
  };

  const showImage = proxiedImageUrl && !imageError;

  return (
    <Pressable
      onPress={() => {
        console.debug(`Product ${id} pressed`);
        onPress(id);
      }}
      style={({ pressed }) => [style.card, pressed && style.pressed]}
      accessibilityRole="button"
    >
      {/* IMAGE */}
      {showImage ? (
        <View style={style.imageWrap}>
          <Image
            style={style.image}
            source={{ uri: proxiedImageUrl }}
            resizeMode="contain"
            onError={e => {
              setImageError(true);
              console.error(
                `Image loading error for product ${id}: ${proxiedImageUrl}`,
                e?.nativeEvent,
              );
            }}
            onLoadStart={() => {
              console.debug(
                `Image loading started for product ${id}: ${proxiedImageUrl}`,
              );
            }}
            onLoad={() => {
              console.debug(
                `Image successfully loaded for product ${id}: ${proxiedImageUrl}`,
              );
            }}
          />
        </View>
      ) : (
        <View
          style={[
            style.imageWrap,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <Text style={{ color: 'black', fontSize: 16, textAlign: 'center' }}>
            Image not available
          </Text>
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
            onPress={() => Linking.openURL(product_url)}
            accessibilityRole="link"
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
