import React, { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, View, ViewStyle } from 'react-native';

import { ProductCard } from './ProductCard';
import { Product } from '../../../types/products';

type ProductSelection = 'like' | 'dislike' | null;

type ProductListProps = {
  products: Product[];
  onProductPress: (productId: string) => void;
  updateSelections: (productId: string, selection: ProductSelection) => void;
  style: {
    listContent: ViewStyle;
  };
  cardStyle: React.ComponentProps<typeof ProductCard>['style'];
};

const FOOTER_HEIGHT = 120;
const CARD_SPACING = 40;

// Fix A throttling props (this is the one that reduces concurrent image downloads)
const INITIAL_NUM_TO_RENDER = 4;
const MAX_TO_RENDER_PER_BATCH = 4;
const UPDATE_CELLS_BATCHING_PERIOD = 50;
const WINDOW_SIZE = 6;

export default function ProductList({
  products,
  onProductPress,
  updateSelections,
  style,
  cardStyle,
}: ProductListProps) {
  const keyExtractor = useCallback((item: Product) => item.id, []);

  const renderItem = useCallback<ListRenderItem<Product>>(
    ({ item }) => (
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
        updateSelections={updateSelections}
        style={cardStyle}
      />
    ),
    [onProductPress, updateSelections, cardStyle],
  );

  const listFooter = useMemo(
    () => <View style={{ height: FOOTER_HEIGHT }} />,
    [],
  );

  return (
    <FlatList
      data={products}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.listContent}
      ListFooterComponent={listFooter}
      initialNumToRender={INITIAL_NUM_TO_RENDER}
      maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
      updateCellsBatchingPeriod={UPDATE_CELLS_BATCHING_PERIOD}
      windowSize={WINDOW_SIZE}
      ItemSeparatorComponent={() => <View style={{ height: CARD_SPACING }} />}
      removeClippedSubviews
    />
  );
}
