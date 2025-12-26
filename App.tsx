/**
 * App
 * - Root entry point that renders onboarding, home, and results screens
 */

import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

import { HomeScreen } from './frontend/components/screens/HomeScreen';
import { ResultsScreen } from './frontend/components/screens/ResultsScreen';
import { OnboardingScreen } from './frontend/components/screens/OnboardingScreen';

type Screen = 'onboarding' | 'home' | 'results';

interface Product {
  id: string;
  image: string;
  brand: string;
  name: string;
  rationale: string;
  description?: string;
  keyAttributes?: string[];
  reviews?: string[];
}

// TODO: Replace mock products with real data from backend
const mockProducts: Product[] = [
  {
    id: '1',
    image:
      'https://images.unsplash.com/photo-1706821750093-c32649b934ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXBzdGljayUyMHJvc2UlMjBnb2xkfGVufDF8fHx8MTc2NjU2NTcwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    brand: 'Charlotte Tilbury',
    name: 'Hyaluronic Happikiss Lipstick Balm',
    rationale:
      'Deeply moisturizing formula with hyaluronic acid, designed specifically for dry lips with warm undertones.',
  },
  {
    id: '2',
    image:
      'https://images.unsplash.com/photo-1674672524653-ebfea176496b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBibHVzaCUyMGNvbXBhY3R8ZW58MXx8fHwxNzY2NTY1NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    brand: 'Dior',
    name: 'Rouge Dior Forever Liquid',
    rationale:
      'Transfer-proof liquid lipstick with 16-hour wear and comfortable, conditioning feel for sensitive lips.',
  },
];

const explanationText =
  "Based on your search for lipstick suitable for dry lips, I've curated these deeply moisturizing formulas with nourishing ingredients like hyaluronic acid and vitamin E.";

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.app}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </View>
  );
}

/**
 * AppContent
 * - Simple in-memory screen router (onboarding → home → results)
 */
function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');

  const products = useMemo(() => mockProducts, []);

  const goHome = useCallback(() => setCurrentScreen('home'), []);
  const goResults = useCallback(() => setCurrentScreen('results'), []);

  if (currentScreen === 'home') {
    return <HomeScreen onSearch={goResults} />;
  }

  if (currentScreen === 'results') {
    return (
      <ResultsScreen
        initialQuery=""
        initialExplanation={explanationText}
        products={products}
        onBack={goHome}
        onProductClick={() => {}}
      />
    );
  }

  return <OnboardingScreen onGetStarted={goHome} />;
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
