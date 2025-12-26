import React, { useState } from 'react';
import { View, Text, ImageBackground } from 'react-native';
import SearchBar from '../ui/general/SearchBar';
import AutoplayCarousel from '../ui/carousel/AutoplayCarousel';
import images from '../../constants/images';
import { useSound } from '../../context/SoundContext';
import useHomeStyles from '../../styles/homeScreen';
import PopularQueries from '../ui/home/PopularQueries';
import Glow from '../ui/general/Glow';

type HomeScreenProps = {
  onSearch: (query: string) => void;
};

/**
 * HomeScreen
 * - Main search screen and discovery entry point
 */

// TODO: Add a sign in button and a your likes button on the top right corner
export function HomeScreen({ onSearch }: HomeScreenProps) {
  const style = useHomeStyles();
  const { playClickSound } = useSound();
  const [searchQuery, setSearchQuery] = useState('');

  const submit = () => {
    const q = searchQuery.trim();
    if (q) {
      playClickSound();
      onSearch(q);
    }
  };

  const handleExampleQueryPress = (query: string) => {
    playClickSound();
    onSearch(query);
  };

  return (
    <ImageBackground
      source={images.backgrounds.homeScreen}
      resizeMode="cover"
      style={style.background}
    >
      {/* Glow elements */}
      <Glow style={[style.glowTopLeft]} />
      <Glow style={[style.glowBottomRight]} />

      <View style={style.content}>
        {/* Header */}
        <View style={style.header}>
          <Text style={style.title}>What are you{'\n'}looking for?</Text>
        </View>

        {/* Search Bar */}
        <View style={style.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={submit}
            placeholder="Find the perfect lipstick for dry skin and warm undertones"
            containerStyle={style.searchRow}
            inputStyle={style.input}
            buttonStyle={style.searchButton}
            buttonIconStyle={style.searchIcon}
            pressedStyle={style.pressed}
            inputProps={{
              textAlignVertical: 'top',
              scrollEnabled: true,
              autoCorrect: false,
              autoCapitalize: 'none',
              returnKeyType: 'search',
            }}
          />
        </View>

        {/* Popular Queries */}
        <PopularQueries onSelect={handleExampleQueryPress} style={style} />

        {/* Autoplay carousel at the bottom */}
        <View style={style.carouselWrap}>
          <AutoplayCarousel style={style.carousel} />
        </View>
      </View>
    </ImageBackground>
  );
}
