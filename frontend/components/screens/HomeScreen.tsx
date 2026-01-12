import React, { useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';

// Styles
import useHomeStyles from '../../styles/homeScreen';

// Constants
import images from '../../constants/images';

// UI Components
import SearchBar from '../ui/general/SearchBar';
import AutoplayCarousel from '../ui/carousel/AutoplayCarousel';
import PopularQueries from '../ui/home/PopularQueries';
import SettingsButton from '../ui/home/SettingsButton';
import LikesButton from '../ui/home/LikesButton';
import SignInButton from '../ui/home/SignInButton';

type HomeScreenProps = {
  onSearch: (query: string) => void;
  onLikesPress: () => void;
  onSettingsPress: () => void;
  onSignInPress: () => void;
  popularQueries: string[];
  isSearchLoading?: boolean;
};

/**
 * HomeScreen component
 * - Main search screen and discovery entry point
 *
 * @param onSearch - Callback function triggered when user performs a search
 * @param onLikesPress - Callback function triggered when likes button is pressed
 * @param onSettingsPress - Callback function triggered when settings button is pressed
 * @param onSignInPress - Callback function triggered when sign in button is pressed
 * @param popularQueries - Array of popular search queries to display
 * @param isSearchLoading - Whether a search request is currently in flight
 * @returns React component for the home screen
 */

export function HomeScreen({
  onSearch,
  onLikesPress,
  onSettingsPress,
  onSignInPress,
  popularQueries,
  isSearchLoading = false,
}: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const styles = useHomeStyles();

  return (
    <ImageBackground
      source={images.backgrounds.homeScreen}
      resizeMode="cover"
      style={styles.background}
    >
      {/* Header Buttons */}
      <SettingsButton
        iconSource={images.icons.settings}
        onPress={onSettingsPress}
        style={styles.settingsButton}
      />

      <View style={styles.headerActions}>
        <LikesButton
          iconSource={images.icons.likes}
          onPress={onLikesPress}
          style={styles.likesButton}
        />
        <SignInButton
          iconSource={images.icons.profile}
          onPress={onSignInPress}
          style={styles.signInButton}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.title}>What are you{'\n'}looking for?</Text>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmit={() => onSearch(searchQuery)}
          placeholder="A lightweight concealer that doesn’t crease"
          iconSource={images.icons.search}
          style={styles.searchBar}
          isLoading={isSearchLoading}
        />

        <PopularQueries
          popularQueries={popularQueries}
          onSelect={query => onSearch(query)}
          style={styles.popularQueries}
        />

        <AutoplayCarousel style={styles.carousel} />
      </View>
    </ImageBackground>
  );
}
