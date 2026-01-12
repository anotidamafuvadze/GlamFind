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
  name: string;
  brand: string;
  product_url: string;
  image_url: string;
  price: string;
  rating: number;
  rating_count: number;
  source_name: string;
  explanation: string;
};

type ProductListProps = {
  products: Product[];
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
  onProductPress,
  style,
  cardStyle,
  updateSelections,
}: ProductListProps) {
  const renderHeader = () => (
    <View>
      <Text style={style.label}>PRODUCTS</Text>
    </View>
  );
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={style.row}>
      <ProductCard
        id={item.id}
        image_url={item.image_url}
        brand={item.brand}
        name={item.name}
        product_url={item.product_url}
        price={item.price}
        rating={item.rating}
        rating_count={item.rating_count}
        source_name={item.source_name}
        explanation={item.explanation}
        onPress={onProductPress}
        style={cardStyle}
        updateSelections={updateSelections}
      />
  </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => {
        const stableId =
          item.id?.trim() ||
          item.product_url?.trim() ||
          `${item.brand}|${item.name}`;
        return `${stableId}-${index}`;
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.listContent}
      renderItem={renderProduct}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={<View style={{ height: 120 }} />}
    />
  );
}
