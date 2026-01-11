import React from 'react';
import { 
  View, 
  TextInput, 
  Pressable, 
  Image, 
  ViewStyle, 
  TextStyle, 
  ImageStyle, 
  TextInputProps 
} from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder: string;
  style: {
    container: ViewStyle;
    input: TextStyle;
    inputProps: TextInputProps;
    button: ViewStyle;
    pressed: ViewStyle;
    icon: ImageStyle;
  };
  iconSource: number;
};

/**
 * SearchBar
 * - Reusable search input with submit button for query-based navigation
 */

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  style,
  iconSource,
}: SearchBarProps) {
  return (
    <View style={style.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'grey'}
        style={style.input}
        onSubmitEditing={onSubmit}
        {...style.inputProps}
      />

      <Pressable
        onPress={onSubmit}
        style={({ pressed }) => [style.button, pressed && style.pressed]}
        accessibilityRole="button"
        accessibilityLabel={'Search'}
      >
        <Image
          source={iconSource}
          style={style.icon}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
