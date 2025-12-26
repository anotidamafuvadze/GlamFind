import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

import images from '../../constants/images';
import useOnboardingStyles from '../../styles/onboardingScreen';
import Button from '../ui/general/Button';
import Glow from '../ui/general/Glow';
import { useSound } from '../../context/SoundContext';

type OnboardingScreenProps = {
  onGetStarted: () => void;
};

/**
 * OnboardingScreen
 * - Welcome screen: app introduction and primary call-to-action
 */

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const style = useOnboardingStyles();
  const { playClickSound } = useSound();

  const handleGetStartedPress = () => {
    playClickSound();
    onGetStarted();
  };

  return (
    <ImageBackground
      source={images.backgrounds.onboardingScreen}
      style={style.background}
      resizeMode="cover"
    >
      {/* Decorative glow elements */}
      <Glow style={[style.glowTopRight]} />
      <Glow style={[style.glowBottomLeft]} />

      <View style={style.content}>
        {/* App Name and Tagline */}
        <Text style={style.appName}>GlamFind</Text>
        <Text style={style.tagline}>Beauty, intelligently curated.</Text>

        {/* Welcome Button */}
        <Button
          title="Discover Your Glam"
          onPress={handleGetStartedPress}
          containerStyle={style.buttonWrapper.button}
          textStyle={style.buttonWrapper.text}
          accessibilityLabel="Begin using GlamFind app"
        />
      </View>

      {/* Bottom text */}
      <View style={style.bottomTextWrapper}>
        <Text style={style.bottomText}>AI-POWERED RECOMMENDATIONS</Text>
      </View>
    </ImageBackground>
  );
}
