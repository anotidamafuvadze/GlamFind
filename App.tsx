import React, { useCallback, useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';

// API
import { fetchRecommendations } from './frontend/api/recommendations';

// Types
import { Product } from './frontend/types/products';
type APIResponse = {
  query: string;
  products: Product[];
};
// Mock data
// import {
//   MOCK_PRODUCTS,
//   MOCK_RESULTS_EXPLANATION,
// } from './frontend/mock/mockData';

// Screens
import { HomeScreen } from './frontend/components/screens/HomeScreen';
import { ResultsScreen } from './frontend/components/screens/ResultsScreen';
import { WelcomeScreen } from './frontend/components/screens/WelcomeScreen';

type AppScreen = 'onboarding' | 'home' | 'results';
type ProductSelection = 'like' | 'dislike' | null;

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </View>
  );
}

/**
 * Main App component
 * - Root component for the GlamFind application
 * - Manages overall app state and screen navigation
 * - Coordinates data flow between screens and API
 *
 * @returns React component serving as the application entry point
 */

function AppContent() {
  // ----------------------- Navigation -----------------------
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding');

  const navigateToHome = useCallback(() => setCurrentScreen('home'), []);
  const navigateToResults = useCallback(() => setCurrentScreen('results'), []);

  // TODO: Implement navigation handlers
  const navigateToLikes = useCallback(() => {}, []);
  const navigateToSettings = useCallback(() => {}, []);
  const navigateToSignIn = useCallback(() => {}, []);

  // ----------------------- Data -----------------------
  const [popularQueries, setPopularQueries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  // ----------------------- Search -----------------------
  const handleSearch = useCallback(
    async (rawQuery: string) => {
      const trimmed = rawQuery.trim();
      if (!trimmed) return;

      try {
        setSearchQuery(trimmed);
        const response: APIResponse = await fetchRecommendations(trimmed);
        setProducts(response.products ?? []);
        navigateToResults();
      } catch (e) {
        console.error('Search failed:', e);
        // TODO: Show user-friendly error message
      }
    },
    [navigateToResults],
  );

  // ----------------------- Product interactions -----------------------
  // TODO: Implement product selection handler
  const handleProductSelection = useCallback(
    (productId: string, selection: ProductSelection) => {
      void productId;
      void selection;
      // Update product selection state / persist to backend
    },
    [],
  );

  // TODO: Implement product click handler
  const handleProductClick = useCallback((productId: string) => {
    void productId;
    // Open product detail / website / modal
  }, []);

  // ----------------------- Popular queries -----------------------
  const fetchPopularQueries = useCallback(async (): Promise<string[]> => {
    // Backend should refresh queries weekly and enforce character limits
    return [
      'Lipstick for dry lips',
      'Moisturizer for sensitive skin',
      'Long-lasting foundation',
    ];
  }, []);

  useEffect(() => {
    if (currentScreen !== 'home') return;
    let cancelled = false;

    const loadPopularQueries = async () => {
      const queries = await fetchPopularQueries();
      if (!cancelled) setPopularQueries(queries);
    };

    loadPopularQueries();
    return () => {
      cancelled = true;
    };
  }, [currentScreen, fetchPopularQueries]);

  // ----------------------- Screen routing -----------------------
  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onSearch={handleSearch}
        onLikesPress={navigateToLikes}
        onSettingsPress={navigateToSettings}
        onSignInPress={navigateToSignIn}
        popularQueries={popularQueries}
      />
    );
  }

  // TODO: Convert to react navigation stack
  if (currentScreen === 'results') {
    return (
      <ResultsScreen
        initialQuery={searchQuery}
        products={products}
        onBack={navigateToHome}
        onProductClick={handleProductClick}
        updateSelections={handleProductSelection}
      />
    );
  }

  return <WelcomeScreen onGetStarted={navigateToHome} />;
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
});
