import React from 'react';
import {
  FlatList,
  View,
  Text,
  ViewStyle,
  ImageStyle,
  TextStyle,
} from 'react-native';

// Local imports
import { ProductCard } from './ProductCard';

export type Product = {
  id: string;
  image: string;
  brand: string;
  name: string;
  rationale: string;
};

type ProductListProps = {
  products: Product[];
  explanation: string;
  onProductPress: (productId: string) => void;
  updateSelections: (
    productId: string,
    selection: 'like' | 'dislike' | null,
  ) => void;
  style: {
    listContent: ViewStyle;
    explanation: {
      card: ViewStyle;
      aiBadge: ViewStyle;
      aiBadgeText: TextStyle;
      textWrapper: ViewStyle;
      title: TextStyle;
      body: TextStyle;
    };
    label: TextStyle;
    row: ViewStyle;
  };
  cardStyle: {
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
 * ProductList component
 * - Renders an explained list of recommended products using a scrollable list
 */

export default function ProductList({
  products,
  explanation,
  onProductPress,
  style,
  cardStyle,
  updateSelections,
}: ProductListProps) {
  const renderHeader = () => (
    <View>
      {/* Explanation */}
      <View style={style.explanation.card}>
        <View style={style.explanation.aiBadge}>
          <Text style={style.explanation.aiBadgeText}>✦</Text>
        </View>

        <View style={style.explanation.textWrapper}>
          <Text style={style.explanation.title}>Why These Products</Text>
          <Text style={style.explanation.body}>{explanation}</Text>
        </View>
      </View>

      <Text style={style.label}>PRODUCTS</Text>
    </View>
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={style.row}>
      <ProductCard
        image={item.image}
        brand={item.brand}
        name={item.name}
        rationale={item.rationale}
        onPress={onProductPress}
        style={cardStyle}
        updateSelections={updateSelections}
      />
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.listContent}
      ListHeaderComponent={renderHeader}
      renderItem={renderProduct}
      ListFooterComponent={<View style={{ height: 120 }} />}
    />
  );
}
