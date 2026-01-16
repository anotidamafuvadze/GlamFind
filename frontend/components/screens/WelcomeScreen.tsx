import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

// Styles
import useWelcomeStyles from '../../styles/welcomeScreenStyles';

// Constants
import images from '../../constants/images';

// UI Components
import Button from '../ui/general/Button';
import Glow from '../ui/general/Glow';

type WelcomeScreenProps = {
  onGetStarted: () => void;
};

/**
 * WelcomeScreen component
 * - Welcome screen with app introduction
 * 
 * @param onGetStarted - Callback function triggered when user taps "Get Started"
 * @returns React component for the welcome screen
 */

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const styles = useWelcomeStyles();

  return (
    <ImageBackground
      source={images.backgrounds.onboardingScreen}
      resizeMode="cover"
      style={styles.background}
    >
      {/* Decorative Glow Elements */}
      <Glow style={styles.glowTopRight} />
      <Glow style={styles.glowBottomLeft} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.appName}>GlamFind</Text>
        <Text style={styles.appTagline}>Beauty, intelligently curated.</Text>

        <Button
          title="Discover Your Glam"
          onPress={onGetStarted}
          accessibilityLabel="Begin using GlamFind app"
          containerStyle={styles.buttonWrapper.button}
          textStyle={styles.buttonWrapper.text}
        />
      </View>

      {/* Footer */}
      <View style={styles.bottomTextWrapper}>
        <Text style={styles.bottomText}>AI-POWERED RECOMMENDATIONS</Text>
      </View>
    </ImageBackground>
  );
}
