import React, { useCallback, useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import type { Product } from "../frontend/types/products";
import { ResultsScreen } from "../frontend/components/screens/ResultsScreen";
import { supabase } from "../backend/services/supabase/supabaseClient";
import { fetchRefinedRecommendations } from "../frontend/api/client";

type RefinedRecommendationsResponse = {
  query: string;
  products: Product[];
};

/**
 * useResults
 * - Custom hook for results screen logic
 * - Handles refined searches and product interactions
 */
export function useResults() {
  const [error, setError] = useState<string>("");
  const [baseQuery, setBaseQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refinedProducts, setRefinedProducts] = useState<Product[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const { q, products } = useLocalSearchParams<{
    q?: string;
    products?: string;
  }>();

  const initialQuery = (q ?? "").toString();

  // Parse and sanitize product data from search params
  const parsedProducts: Product[] = useMemo(() => {
    try {
      const raw = products ?? "[]";
      const sanitized =
        typeof raw === "string"
          ? raw.replace(/[\u0000-\u001F]/g, "")
          : String(raw);

      return JSON.parse(sanitized) as Product[];
    } catch {
      return [];
    }
  }, [products]);

  // Initialize state with search params
  useEffect(() => {
    setBaseQuery(initialQuery);
    setRefinedProducts(parsedProducts);
  }, [initialQuery, parsedProducts]);

  // Handle refined search with additional query
  const handleRefinedSearch = useCallback(
    async (rawQuery: string) => {
      const trimmedQuery = rawQuery.trim();
      if (!trimmedQuery) return;

      setError("");
      setIsSearchLoading(true);

      try {
        const response = (await fetchRefinedRecommendations(
          trimmedQuery,
          baseQuery,
        )) as RefinedRecommendationsResponse;

        setRefinedProducts(response.products ?? []);
        setBaseQuery(response.query);
        setSearchQuery("");
      } catch (e) {
        setError((e as any)?.message || "Search failed");
      } finally {
        setIsSearchLoading(false);
      }
    },
    [baseQuery],
  );

  // Handle product like/dislike selection
  const handleProductSelection = useCallback(
    async (productId: string, selection: "like" | "dislike" | null) => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) return;

        const userId = session.user.id;

        if (selection === "like") {
          const { error: insertError } = await supabase
            .from("user_favorites")
            .insert([{ user_id: userId, product_id: productId }]);

          if (insertError) {
            setError("Failed to update favorites. Please try again.");
          }
        } else if (selection === "dislike") {
          const { error: deleteError } = await supabase
            .from("user_favorites")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", productId);

          if (deleteError) {
            setError("Failed to update favorites. Please try again.");
          }
        }
      } catch {
        setError("Failed to update favorites. Please try again.");
      }
    },
    [],
  );

  // Navigate back to home screen
  const onBack = () => {
    router.replace("home");
  };

  return {
    initialQuery: baseQuery,
    products: refinedProducts,
    onBack,
    updateSelections: handleProductSelection,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    isSearchLoading,
    handleRefinedSearch,
  };
}

/**
 * ResultsRoute
 * - Results screen route for displaying search results
 * - Manages product interactions and refined searches
 */
export default function ResultsRoute() {
  const resultsProps = useResults();
  return <ResultsScreen {...resultsProps} />;
}