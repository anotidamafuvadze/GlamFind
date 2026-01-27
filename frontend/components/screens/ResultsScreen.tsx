import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import useResultsStyles from "../../styles/resultsScreenStyles";
import images from "../../constants/images";
import BackButton from "../ui/general/BackButton";
import SearchBar from "../ui/general/SearchBar";
import ProductList from "../ui/results/ProductList";
import { Product } from "../../types/products";

type ProductSelection = "like" | "dislike" | null;

type ResultsScreenProps = {
  initialQuery: string;
  onBack: () => void;
  products: Product[];
  updateSelections: (productId: string, selection: ProductSelection) => void;
  error: string;
  setError: (error: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchLoading: boolean;
  handleRefinedSearch: (query: string) => void;
};

/**
 * ResultsScreen component
 * - Displays AI-curated product results
 * - Allows users to refine results via follow-up search
 *
 * @param initialQuery - The original search query that triggered these results
 * @param onBack - Callback function triggered when back button is pressed
 * @param products - Array of product data to display
 * @param updateSelections - Function to update user's like/dislike selections
 * @param error - Error message to display (if any)
 * @param setError - Function to update error state
 * @param searchQuery - Current refinement search query
 * @param setSearchQuery - Function to update refinement search query
 * @param isSearchLoading - Whether refined search is currently loading
 * @param handleRefinedSearch - Callback function for refined search submission
 * @returns React component for the results screen
 */
export function ResultsScreen({
  initialQuery,
  onBack,
  products,
  updateSelections,
  error,
  setError,
  searchQuery,
  setSearchQuery,
  isSearchLoading,
  handleRefinedSearch,
}: ResultsScreenProps) {
  const styles = useResultsStyles();

  // Error display
  const renderError = () =>
    error ? (
      <View
        style={{
          backgroundColor: "#ffcccc",
          padding: 8,
          margin: 8,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "#a00", textAlign: "center" }}>{error}</Text>
      </View>
    ) : null;

  return (
    <ImageBackground
      source={images.backgrounds.resultsScreen}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      {renderError()}

      {/* Header */}
      <View style={styles.header.container}>
        <BackButton onPress={onBack} style={styles.backButton} />
        <Text style={styles.header.title}>Curated for You</Text>
      </View>

      {/* Product Results */}
      <ProductList
        products={products}
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
        isLoading={isSearchLoading}
      />
    </ImageBackground>
  );
}