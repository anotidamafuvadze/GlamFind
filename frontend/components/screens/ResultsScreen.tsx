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

// Types
import { Product } from '../../types/products';

// Mock data
import {
  MOCK_REFINED_EXPLANATION,
  MOCK_REFINED_PRODUCTS,
} from '../../mock/mockData';

type ProductSelection = 'like' | 'dislike' | null;

type ResultsScreenProps = {
  initialQuery: string;
  initialExplanation: string;
  onBack: () => void;
  onProductClick: (productId: string) => void;
  products: Product[];
  updateSelections: (productId: string, selection: ProductSelection) => void;
};

/**
 * ResultsScreen
 * - Displays AI-curated product results
 * - Allows users to refine results via follow-up search
 */
export function ResultsScreen({
  initialQuery,
  initialExplanation,
  onBack,
  onProductClick,
  products,
  updateSelections,
}: ResultsScreenProps) {
  const styles = useResultsStyles();

  const [baseQuery, setBaseQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState('');
  const [refinedExplanation, setRefinedExplanation] = useState(initialExplanation);
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

      setRefinedProducts(MOCK_REFINED_PRODUCTS);
      setRefinedExplanation(MOCK_REFINED_EXPLANATION);

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
        explanation={refinedExplanation}
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
