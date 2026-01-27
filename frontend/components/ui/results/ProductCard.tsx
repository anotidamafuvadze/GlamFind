import React, { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
  ImageStyle,
  Image,
  Linking,
} from "react-native";
import { LikeButton } from "./LikeButton";
import { DislikeButton } from "./DislikeButton";
import { API_BASE_URL } from "../../../api/client"

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
  updateSelections: (
    productId: string,
    selection: "like" | "dislike" | null,
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

// Convert upstream image URL to proxied URL
function toProxiedImageUrl(upstreamUrl: string): string {
  const trimmed = (upstreamUrl || "").trim();
  if (!trimmed) return "";
  if (
    trimmed.includes("/api/image-proxy?url=") ||
    trimmed.includes("/image-proxy?url=")
  ) {
    return trimmed;
  }

  return `${API_BASE_URL}/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
}

/**
 * ProductCard component
 * - Displays individual product information with image, details, and interaction buttons
 *
 * @param id - Unique product identifier
 * @param image_url - Product image URL (will be proxied)
 * @param brand - Product brand name
 * @param name - Product name/title
 * @param product_url - Product page URL
 * @param price - Product price string
 * @param rating - Product rating (0-5)
 * @param rating_count - Number of ratings
 * @param source_name - Source/retailer name
 * @param explanation - AI-generated explanation for recommendation
 * @param updateSelections - Callback for like/dislike actions
 * @param style - Style object for all visual elements
 * @returns React component for product card
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
  updateSelections,
  style,
}: ProductCardProps) {
  const [selection, setSelection] = useState<"like" | "dislike" | null>(null);
  const [imageError, setImageError] = useState(false);

  const proxiedImageUrl = useMemo(() => {
    const proxied = toProxiedImageUrl(image_url);
    return proxied;
  }, [image_url]);

  const handleSelection = useCallback(
    (next: "like" | "dislike") => {
      const newSelection = selection === next ? null : next;
      setSelection(newSelection);
      updateSelections(id, newSelection);
    },
    [id, selection, updateSelections],
  );

  const showImage = proxiedImageUrl && !imageError;

  return (
    <Pressable
      style={({ pressed }) => [style.card, pressed && style.pressed]}
      accessibilityRole="button"
    >
      {/* Image Section */}
      {showImage ? (
        <View style={style.imageWrap}>
          <Image
            style={style.image}
            source={{ uri: proxiedImageUrl }}
            resizeMode="contain"
            onError={() => {
              setImageError(true);
            }}
            onLoad={() => {
              // Image successfully loaded
            }}
          />
        </View>
      ) : (
        <View
          style={[
            style.imageWrap,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text style={{ color: "black", fontSize: 16, textAlign: "center" }}>
            Image not available
          </Text>
        </View>
      )}

      {/* Content Section */}
      <View style={style.content}>
        <Text style={style.brand}>{brand}</Text>
        <Text style={style.name}>{name}</Text>
        <Text style={style.rationale}>{explanation}</Text>

        {/* Price + Rating */}
        <View style={{ flexDirection: "row", marginTop: 8 }}>
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

        {/* Product Link */}
        {product_url && (
          <Text
            style={[style.rationale, { fontSize: 10, marginTop: 2, opacity: 0.7 }]}
            numberOfLines={1}
            onPress={() => Linking.openURL(product_url)}
            accessibilityRole="link"
          >
            {product_url}
          </Text>
        )}

        {/* Action Buttons */}
        <View style={style.actionsRow}>
          <LikeButton
            selected={selection === "like"}
            onPress={() => handleSelection("like")}
            style={style.actionButton}
          />
          <DislikeButton
            selected={selection === "dislike"}
            onPress={() => handleSelection("dislike")}
            style={style.actionButton}
          />
        </View>
      </View>
    </Pressable>
  );
}