import React, { useCallback, useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

// Styles
import useResultsStyles from '../../styles/resultsScreen';

// Constants
import images from '../../constants/images';

// UI Components
import BackButton from '../ui/general/BackButton';
import SearchBar from '../ui/general/SearchBar';
import ProductList from '../ui/results/ProductList';

// Mock data
import {
  MOCK_REFINED_EXPLANATION,
  MOCK_REFINED_PRODUCTS,
} from '../../mock/mockData';

// Types
import { Product } from '../../types/products';
type ProductSelection = 'like' | 'dislike' | null;

type ResultsScreenProps = {
  initialQuery: string;
  onBack: () => void;
  onProductClick: (productId: string) => void;
  products: Product[];
  updateSelections: (productId: string, selection: ProductSelection) => void;
};

/**
 * ResultsScreen component
 * - Displays AI-curated product results
 * - Allows users to refine results via follow-up search
 * 
 * @param initialQuery - The original search query that triggered these results
 * @param onBack - Callback function triggered when back button is pressed
 * @param onProductClick - Callback function triggered when a product is clicked
 * @param products - Array of product data to display
 * @param updateSelections - Function to update user's like/dislike selections
 * @returns React component for the results screen
 */

export function ResultsScreen({
  initialQuery,
  onBack,
  onProductClick,
  products,
  updateSelections,
}: ResultsScreenProps) {
  const styles = useResultsStyles();

  const [baseQuery, setBaseQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState('');
  const [refinedProducts, setRefinedProducts] = useState(products);

  const listData = useMemo(() => refinedProducts, [refinedProducts]);

  // TODO: Implement refined search handler
  const handleRefinedSearch = useCallback(
    async (rawQuery: string) => {
      const trimmedQuery = rawQuery.trim();
      if (!trimmedQuery) return;

      // const { products: fetchedProducts, explanation } =
      //   await fetchRefinedProductsFromBackend(baseQuery, trimmedQuery);
      // setRefinedProducts(fetchedProducts);
      // setRefinedExplanation(explanation);

      // setRefinedProducts(MOCK_REFINED_PRODUCTS);

      setBaseQuery(trimmedQuery);
      setSearchQuery('');
    },
    [baseQuery]
  );

  return (
    <ImageBackground
      source={images.backgrounds.resultsScreen}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      {/* Header */}
      <View style={styles.header.container}>
        <BackButton onPress={onBack} style={styles.backButton} />
        <Text style={styles.header.title}>Curated for You</Text>
      </View>

      {/* Product Results */}
      <ProductList
        products={listData}
        onProductPress={onProductClick}
        updateSelections={updateSelections}
        style={styles.products}
        cardStyle={styles.productCard}
      />

      {/* Search Refinement */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmit={() => handleRefinedSearch(searchQuery)}
        placeholder="Refine your search..."
        iconSource={images.icons.search}
        style={styles.searchBar}
      />
    </ImageBackground>
  );
}
