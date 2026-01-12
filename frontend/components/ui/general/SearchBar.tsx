import React from 'react';
import {
  View,
  TextInput,
  Pressable,
  Image,
  ViewStyle,
  TextStyle,
  ImageStyle,
  TextInputProps,
} from 'react-native';
import { LoadingSpinner } from './Loader';

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
  isLoading?: boolean;
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
  isLoading = false,
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
        editable={!isLoading}
        {...style.inputProps}
        selectionColor="#565656ff"
      />

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        style={({ pressed }) => [style.button, pressed && style.pressed]}
        accessibilityRole="button"
        accessibilityLabel={'Search'}
      >
        {isLoading ? (
          <LoadingSpinner style={style.icon} />
        ) : (
          <Image source={iconSource} style={style.icon} resizeMode="contain" />
        )}
      </Pressable>
    </View>
  );
}
