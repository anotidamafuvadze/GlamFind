import React, { useMemo, useState } from 'react';
import { ImageBackground, Text, View, StyleSheet } from 'react-native';
import ProductList from '../ui/results/ProductList';
import { ProductCard } from '../ui/results/ProductCard';
import BackButton from '../ui/general/BackButton';
import SearchBar from '../ui/general/SearchBar';
import images from '../../constants/images';
import useResultsStyles from '../../styles/resultsScreen';

export type Product = {
  id: string;
  image: string;
  brand: string;
  name: string;
  rationale: string;
};

type ResultsScreenProps = {
  initialQuery: string;
  initialExplanation: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
  products: Product[];
};

/**
 * ResultsScreen
 * - Displays AI-curated product results with refinement capability
 */

export function ResultsScreen({
  initialExplanation,
  onBack,
  onProductClick,
  products,
}: ResultsScreenProps) {
  const style = useResultsStyles();
  const [input, setInput] = useState('');

  // TODO: Replace with real explanation from backend
  const [explanation, setExplanation] = useState(initialExplanation);
  const listData = useMemo(() => products, [products]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;

    // TODO: Replace with real explanation from backend
    setTimeout(() => {
      setExplanation(
        "I've refined your results based on your additional preferences. These selections now emphasize enhanced hydration properties and are particularly suited for warm undertones with superior lasting power.",
      );
    }, 800);

    setInput('');
  };

  return (
    <ImageBackground
      source={images.backgrounds.resultsScreen}
      resizeMode="cover"
      style={StyleSheet.absoluteFill}
    >
      {/* Header */}
      <View style={style.header}>
        <View style={style.headerRow}>
          <BackButton
            onPress={onBack}
            style={style.backBtn}
            pressedStyle={style.pressed}
            iconStyle={style.icon}
          />

          <View style={style.headerTitleWrap}>
            <Text style={style.headerTitle}>Curated for You</Text>
          </View>
        </View>
      </View>

      {/* Products */}
      <ProductList
        products={listData}
        explanation={explanation}
        onProductPress={onProductClick}
        style={style}
      />

      {/* Input area (fixed bottom) */}
      <View style={style.inputBar}>
        <SearchBar
          value={input}
          onChangeText={setInput}
          onSubmit={handleSend}
          placeholder="Refine your search..."
          containerStyle={style.inputRow}
          inputStyle={style.input}
          buttonStyle={style.sendBtn}
          buttonIconStyle={[style.sendIcon, { tintColor: '#FFFFFF' }]}
          pressedStyle={style.pressed}
          inputProps={{ returnKeyType: 'send' }}
          iconSource={images.icons.searchIcon}
        />
      </View>
    </ImageBackground>
  );
}
