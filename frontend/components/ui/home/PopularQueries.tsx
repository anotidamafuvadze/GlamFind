import React from 'react';
import { View, Text, Pressable } from 'react-native';

type PopularQueriesProps = {
  onSelect: (query: string) => void;
  popularQueries: string[];
  style: any;
};

/**
 * PopularQueries
 * - Displays a list of suggested search queries for quick selection
 */

export default function PopularQueries({
  onSelect,
  popularQueries,
  style,
}: PopularQueriesProps) {
  return (
    <View style={style.container}>
      <Text style={style.label}>POPULAR QUERIES</Text>

      <View style={style.list}>
        {popularQueries.map((q, idx) => (
          <Pressable
            key={`${q}-${idx}`}
            onPress={() => onSelect(q)}
            style={({ pressed }) => [style.item, pressed && style.itemPressed]}
            accessibilityRole="button"
          >
            <Text style={style.itemText}>{q}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
