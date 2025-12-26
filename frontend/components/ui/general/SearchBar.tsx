import React from 'react';
import { View, TextInput, Pressable, Image } from 'react-native';
import images from '../../../constants/images';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  containerStyle?: any;
  inputStyle?: any;
  buttonStyle?: any;
  buttonIconStyle?: any;
  pressedStyle?: any;
  inputProps?: any;
  iconSource?: any;
  accessibilityLabel?: string;
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
  containerStyle,
  inputStyle,
  buttonStyle,
  buttonIconStyle,
  pressedStyle,
  inputProps,
  iconSource,
  accessibilityLabel = 'Search',
}: SearchBarProps) {
  return (
    <View style={containerStyle}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={'grey'}
        style={inputStyle}
        onSubmitEditing={onSubmit}
        {...inputProps}
      />

      <Pressable
        onPress={onSubmit}
        style={({ pressed }) => [buttonStyle, pressed && pressedStyle]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <Image
          source={iconSource ?? images.icons.searchIcon}
          style={buttonIconStyle}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
