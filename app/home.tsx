import React, { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";

import type { Product } from "../frontend/types/products";
import { HomeScreen } from "../frontend/components/screens/HomeScreen";
import { supabase } from "../backend/services/supabase/supabaseClient";
import { fetchRecommendations } from "../frontend/api/client";

type RecommendationsResponse = {
  query: string;
  products: Product[];
};

/**
 * useHome
 * - Custom hook for home screen logic
 * - Manages user authentication, search, and popular queries
 */
export function useHome() {
  const [popularQueries, setPopularQueries] = useState<string[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (!profileError) {
        setDisplayName(profile?.full_name ?? null);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle search query submission
  const handleSearch = useCallback(async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    try {
      setIsSearchLoading(true);
      const response = (await fetchRecommendations(trimmed)) as RecommendationsResponse;
      const products: Product[] = response.products ?? [];

      router.push({
        pathname: "results",
        params: { q: trimmed, products: JSON.stringify(products) },
      });
    } catch {
      // TODO: show error to user
    } finally {
      setIsSearchLoading(false);
    }
  }, []);

  // Fetch popular search queries (temporary mock implementation)
  const fetchPopularQueries = useCallback(async (): Promise<string[]> => {
    return [
      "Lipstick for dry lips",
      "Moisturizer for sensitive skin",
      "Long-lasting foundation",
    ];
  }, []);

  // Load popular queries on component mount
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

  const onLikesPress = () => router.push("likes");
  const onSettingsPress = () => router.push("settings");
  const onSignInPress = () => router.push("sign-in");

  return {
    popularQueries,
    isSearchLoading,
    displayName,
    onSearch: handleSearch,
    onLikesPress,
    onSettingsPress,
    onSignInPress,
  };
}

/**
 * HomeRoute
 * - Main home screen route that handles user authentication, search functionality,
 *   and popular queries display
 */
export default function HomeRoute() {
  const homeProps = useHome();
  return <HomeScreen {...homeProps} />;
}