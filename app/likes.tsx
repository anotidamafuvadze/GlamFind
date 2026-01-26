import React, { useEffect, useMemo, useState } from 'react';
import { router } from 'expo-router';
import LikesScreen from '../frontend/components/screens/LikesScreen';
import { supabase } from '../backend/services/supabase/supabaseClient';
import { Product } from '../frontend/types/products';

export default function LikesRoute() {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      setIsLoading(true);
      try {
        // Check if the user is logged in
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error('User not authenticated', sessionError);
          setLikedProducts([]);
          setIsLoggedIn(false);
          return;
        }

        setIsLoggedIn(true);

        // Fetch liked products for the current user
        const userId = session.user.id;
        const { data, error } = await supabase
          .from('user_favorites')
          .select(
            `product_id, products:product_id (id, name, brand, product_url, image_url, price, rating, rating_count, source_name, explanation)`,
          )
          .eq('user_id', userId);

        if (error) {
          console.error('Error fetching liked products:', error);
          setLikedProducts([]);
        } else {
          const products = data.flatMap(item => item.products);
          setLikedProducts(products);
        }
      } catch (err) {
        console.error('Failed to fetch liked products:', err);
        setLikedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

  const handleProductClick = useMemo(
    () => (productId: string) => {
      // TODO: Navigate to product details or external link
    },
    [],
  );

  const goBack = () => {
    router.push('/home');
  };

  const handleProductSelection = useMemo(
    () => async (productId: string, selection: 'like' | 'dislike' | null) => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error('User not authenticated', sessionError);
          return;
        }

        const userId = session.user.id;

        if (selection === 'like') {
          const { error: insertError } = await supabase
            .from('user_favorites')
            .insert([{ user_id: userId, product_id: productId }]);

          if (
            insertError &&
            !insertError.message.toLowerCase().includes('duplicate')
          ) {
            console.error('Error adding favorite:', insertError);
          }
        } else if (selection === 'dislike') {
          const { error: deleteError } = await supabase
            .from('user_favorites')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

          if (deleteError) {
            console.error('Error removing favorite:', deleteError);
          }
        }
      } catch (err) {
        console.error('Favorite selection error:', err);
      }
    },
    [],
  );

  const likesProps = {
    likedProducts,
    isLoading,
    isLoggedIn,
    onProductClick: handleProductClick,
    updateSelections: handleProductSelection,
    goBack,
  };

  return <LikesScreen {...likesProps} />;
}
