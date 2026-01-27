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

// TODO: polish

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

  useEffect(() => {
    setBaseQuery(initialQuery);
    setRefinedProducts(parsedProducts);
  }, [initialQuery, parsedProducts]);

  const handleRefinedSearch = useCallback(
    async (rawQuery: string) => {
      const trimmedQuery = rawQuery.trim();
      if (!trimmedQuery) return;

      setError("");
      setIsSearchLoading(true);

      try {
        const response = (await fetchRefinedRecommendations(trimmedQuery, baseQuery)) as RefinedRecommendationsResponse;

        setRefinedProducts(response.products ?? []);
        setBaseQuery(response.query);
        setSearchQuery("");
      } catch (e) {
        setError((e as any)?.message || "Search failed");
      } finally {
        setIsSearchLoading(false);
      }
    },
    [baseQuery]
  );

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
    []
  );

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

export default function ResultsRoute() {
  const resultsProps = useResults();
  return <ResultsScreen {...resultsProps} />;
}
