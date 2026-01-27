import React, { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import LikesScreen from "../frontend/components/screens/LikesScreen";
import { supabase } from "../backend/services/supabase/supabaseClient";
import { Product } from "../frontend/types/products";

/**
 * useLikes
 * - Custom hook for managing liked products
 * - Handles authentication and Supabase favorites syncing
 */
export function useLikes() {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch user's liked products
  useEffect(() => {
    const fetchLikedProducts = async () => {
      setIsLoading(true);
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          setLikedProducts([]);
          setIsLoggedIn(false);
          setError(sessionError?.message || "Failed to get session");
          return;
        }

        setIsLoggedIn(true);

        const userId = session.user.id;
        const { data, error } = await supabase
          .from("user_favorites")
          .select(
            `product_id, products:product_id (id, name, brand, product_url, image_url, price, rating, rating_count, source_name, explanation)`,
          )
          .eq("user_id", userId);

        if (error) {
          setLikedProducts([]);
        } else {
          const products = data.flatMap((item) => item.products);
          setLikedProducts(products);
        }
      } catch (err) {
        setLikedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);


  // Navigate back to home screen
  const goBack = () => {
    router.push("/home");
  };

  // Update product like/dislike selection
  const handleProductSelection = useMemo(
    () => async (productId: string, selection: "like" | "dislike" | null) => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          return;
        }

        const userId = session.user.id;

        if (selection === "like") {
          const { error: insertError } = await supabase
            .from("user_favorites")
            .insert([{ user_id: userId, product_id: productId }]);

          if (
            insertError &&
            !insertError.message.toLowerCase().includes("duplicate")
          ) {
            // Silently handle duplicate insertion error
          }
        } else if (selection === "dislike") {
          const { error: deleteError } = await supabase
            .from("user_favorites")
            .delete()
            .eq("user_id", userId)
            .eq("product_id", productId);
        }
      } catch (err) {
        setError("Failed to update favorites. Please try again.");
      }
    },
    [],
  );

  return {
    likedProducts,
    isLoading,
    isLoggedIn,
    updateSelections: handleProductSelection,
    goBack,
    error,
  };
}

/**
 * LikesRoute
 * - Manages the user's liked/favorited products
 */
export default function LikesRoute() {
  const likesProps = useLikes();
  return <LikesScreen {...likesProps} />;
}