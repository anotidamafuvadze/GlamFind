import React from 'react';
import { FlatList, View, Text } from 'react-native';
import { ProductCard } from '../results/ProductCard';

type Product = {
  id: string;
  image: string;
  brand: string;
  name: string;
  rationale: string;
};

type Props = {
  products: Product[];
  explanation?: string;
  onProductPress: (p: Product) => void;
  style?: any;
};

/**
 * ProductList
 * - Renders an explained list of recommended products using a scrollable list
 */

export default function ProductList({
  products,
  explanation,
  onProductPress,
  style,
}: Props) {
  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id}
      contentContainerStyle={style.listContent}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View style={style.topBlock}>
          <View style={style.explainCard}>
            <View style={style.explainRow}>
              <View style={style.aiBadge}>
                <Text style={style.aiBadgeText}>✦</Text>
              </View>

              <View style={style.explainTextWrap}>
                <Text style={style.explainTitle}>Why These Products</Text>
                <Text style={style.explainBody}>{explanation}</Text>
              </View>
            </View>
          </View>

          <Text style={style.sectionLabel}>PRODUCTS</Text>
        </View>
      }
      renderItem={({ item }) => (
        <View style={style.productRow}>
          <ProductCard
            image={item.image}
            brand={item.brand}
            name={item.name}
            rationale={item.rationale}
            onPress={() => onProductPress(item)}
          />
        </View>
      )}
      ListFooterComponent={<View style={{ height: 120 }} />}
    />
  );
}
