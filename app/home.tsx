import React, { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';

// API
import { fetchRecommendations } from '../frontend/api/recommendations';

// Types
import type { Product } from '../frontend/types/products';

// Screens
import { HomeScreen } from '../frontend/components/screens/HomeScreen';

// Supabase
import { supabase } from '../backend/services/supabase/supabaseClient';

export default function HomeRoute() {
  const [popularQueries, setPopularQueries] = useState<string[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setDisplayName(profile.full_name);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleSearch = useCallback(async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    try {
      setIsSearchLoading(true);
      const response = await fetchRecommendations(trimmed);
      const products: Product[] = response.products ?? [];
      router.push({
        pathname: 'results',
        params: { q: trimmed, products: JSON.stringify(products) },
      });
    } catch (e) {
      console.error('Search failed:', e);
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  const fetchPopularQueries = useCallback(async (): Promise<string[]> => {
    // TODO: Replace with real API call to fetch popular queries
    return [
      'Lipstick for dry lips',
      'Moisturizer for sensitive skin',
      'Long-lasting foundation',
    ];
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadPopularQueries = async () => {
      const queries = await fetchPopularQueries();
      if (!cancelled) setPopularQueries(queries);
    };
    loadPopularQueries();
    return () => {
      cancelled = true;
    };
  }, [fetchPopularQueries]);

  return (
    <HomeScreen
      onSearch={handleSearch}
      onLikesPress={() => router.push('likes')}
      onSettingsPress={() => router.push('settings')}
      onSignInPress={() => router.push('sign-in')}
      popularQueries={popularQueries}
      isSearchLoading={isSearchLoading}
      displayName={displayName}
    />
  );
}
