import React, { useMemo } from 'react';
import { ImageBackground, Text, View } from 'react-native';
import images from '../../constants/images';
import BackButton from '../ui/general/BackButton';
import ProductList from '../ui/results/ProductList';
import { Product } from '../../types/products';
import useLikesStyles from '../../styles/likesScreenStyles';

type LikesScreenProps = {
  likedProducts: Product[];
  isLoading: boolean;
  isLoggedIn: boolean;
  onProductClick: (productId: string) => void;
  updateSelections: (
    productId: string,
    selection: 'like' | 'dislike' | null,
  ) => void;
  goBack: () => void;
};

export default function LikesScreen({
  likedProducts,
  isLoading,
  isLoggedIn,
  onProductClick,
  updateSelections,
  goBack,
}: LikesScreenProps) {
  const listData = useMemo(() => likedProducts, [likedProducts]);
  const styles = useLikesStyles();

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
              ? 'No products favorited yet. Start exploring and like your favorites!'
              : 'Please sign in or sign up to view your liked products.'}
          </Text>
        </View>
      ) : (
        <ProductList
          products={listData}
          onProductPress={onProductClick}
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
