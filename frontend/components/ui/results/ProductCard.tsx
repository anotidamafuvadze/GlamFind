import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export type ProductCardProps = {
  image: string;
  brand: string;
  name: string;
  rationale: string;
  onPress?: () => void;
};

export function ProductCard({
  image,
  brand,
  name,
  rationale,
  onPress,
}: ProductCardProps) {
  const [selection, setSelection] = useState<'like' | 'dislike' | null>(null);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      {/* Image (square) */}
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Text */}
      <View style={styles.content}>
        <Text style={styles.brand} numberOfLines={1}>
          {brand}
        </Text>

        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>

        <Text style={styles.rationale} numberOfLines={4}>
          {rationale}
        </Text>

        {/* Like / Dislike actions */}
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() =>
              setSelection(prev => (prev === 'like' ? null : 'like'))
            }
            style={({ pressed }) => [
              styles.actionBtn,
              selection === 'like' && styles.actionBtnActive,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Like"
          >
            <Text
              style={[
                styles.likeText,
                selection === 'like' && styles.actionTextActive,
              ]}
            >
              ♥︎
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setSelection(prev => (prev === 'dislike' ? null : 'dislike'))
            }
            style={({ pressed }) => [
              styles.actionBtn,
              selection === 'dislike' && styles.actionBtnActive,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Dislike"
          >
            <Text
              style={[
                styles.dislikeText,
                selection === 'dislike' && styles.actionTextActive,
              ]}
            >
              ✕
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const COLORS = {
  luxuryBlack: '#111111',
  softGray: '#8B8B8B',
  roseGold: '#C8A19A',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(200,161,154,0.10)',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.96,
  },

  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: 'rgba(246,241,240,1)', // “pearl” fallback
  },
  image: {
    width: '100%',
    height: '100%',
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  brand: {
    color: COLORS.softGray,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    color: COLORS.luxuryBlack,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    // If you load a serif font, set it here:
    // fontFamily: "CormorantGaramond_500Medium",
  },
  rationale: {
    color: COLORS.softGray,
    fontSize: 13,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200,161,154,0.5)',
    marginRight: 12,
  },
  actionBtnActive: {
    backgroundColor: COLORS.roseGold,
    borderColor: 'rgba(200,161,154,0.9)',
  },
  likeText: {
    fontSize: 18,
  },
  dislikeText: {
    fontSize: 18,
  },
  actionTextActive: {
    color: COLORS.white,
  },
});
