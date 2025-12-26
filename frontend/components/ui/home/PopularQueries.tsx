import React, { useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';

type PopularQueriesProps = {
  onSelect: (query: string) => void;
  style?: any;
};

/**
 * PopularQueries
 * - Displays a list of suggested search queries for quick selection
 */

export default function PopularQueries({
  onSelect,
  style,
}: PopularQueriesProps) {

  // TODO: Replace mock data with backend call for popular queries
  const popularQueries = useMemo(
    () => [
      'Lipstick for dry lips',
      'Moisturizer for sensitive skin',
      'Long-lasting foundation',
    ],
    [],
  );

  return (
    <View style={style.examples}>
      <Text style={style.examplesLabel}>POPULAR QUERIES</Text>

      <View style={style.examplesList}>
        
        {popularQueries.map((q, idx) => (
          <Pressable
            key={`${q}-${idx}`}
            onPress={() => onSelect(q)}
            style={({ pressed }) => [
              style.exampleCard,
              pressed && style.examplePressed,
            ]}
            accessibilityRole="button"
          >
            <Text style={style.exampleText}>{q}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
