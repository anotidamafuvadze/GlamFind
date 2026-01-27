import React, { useMemo } from "react";
import { ImageBackground, Text, View } from "react-native";
import images from "../../constants/images";
import { Product } from "../../types/products";
import useLikesStyles from "../../styles/likesScreenStyles";
import BackButton from "../ui/general/BackButton";
import ProductList from "../ui/results/ProductList";

type LikesScreenProps = {
  likedProducts: Product[];
  isLoading: boolean;
  isLoggedIn: boolean;
  updateSelections: (
    productId: string,
    selection: "like" | "dislike" | null,
  ) => void;
  goBack: () => void;
  error: string;
};

/**
 * LikesScreen component
 * - Displays user's liked/favorited products
 *
 * @param likedProducts - Array of liked product objects
 * @param isLoading - Whether data is currently loading
 * @param isLoggedIn - Whether user is authenticated
 * @param updateSelections - Callback function for product like/dislike actions
 * @param goBack - Callback function to navigate back
 * @param error - Error message to display (if any)
 * @returns React component for the likes screen
 */
export default function LikesScreen({
  likedProducts,
  isLoading,
  isLoggedIn,
  updateSelections,
  goBack,
  error,
}: LikesScreenProps) {
  const listData = useMemo(() => likedProducts, [likedProducts]);
  const styles = useLikesStyles();

  // Error display
  const renderError = () =>
    error ? (
      <View
        style={{
          backgroundColor: "#ffcccc",
          padding: 8,
          margin: 8,
          borderRadius: 6,
          top: 50,
        }}
      >
        <Text style={{ color: "#a00", textAlign: "center" }}>{error}</Text>
      </View>
    ) : null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ImageBackground
      source={images.backgrounds.likesScreen}
      resizeMode="cover"
      style={styles.background}
    >
      {renderError()}

      {/* Header */}
      <View style={styles.headerContainer}>
        <BackButton
          onPress={goBack}
          style={{
            button: styles.backButton,
            pressed: styles.backButtonPressed,
            icon: styles.backButtonIcon,
          }}
        />
        <Text style={styles.headerTitle}>Your Likes</Text>
      </View>

      {/* Product List */}
      {listData.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            {isLoggedIn
              ? "No products favorited yet. Start exploring and like your favorites!"
              : "Please sign in or sign up to view your liked products."}
          </Text>
        </View>
      ) : (
        <ProductList
          products={listData}
          updateSelections={updateSelections}
          style={{ listContent: styles.listContent }}
          cardStyle={{
            card: styles.productCard,
            pressed: styles.productCardPressed,
            imageWrap: styles.productImageWrap,
            image: styles.productImage,
            content: styles.productContent,
            brand: styles.productBrand,
            name: styles.productName,
            rationale: styles.productRationale,
            actionsRow: styles.actionsRow,
            actionButton: {
              button: styles.actionButton,
              selected: styles.actionButtonSelected,
              text: styles.actionButtonText,
              selectedText: styles.actionButtonSelectedText,
            },
          }}
        />
      )}
    </ImageBackground>
  );
}