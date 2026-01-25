import React, { useCallback, useMemo } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

// Types
import type { Product } from '../frontend/types/products';

// Screens
import { ResultsScreen } from '../frontend/components/screens/ResultsScreen';
import { supabase } from '../backend/services/supabase/supabaseClient';

export default function ResultsRoute() {
  const { q, products } = useLocalSearchParams<{
    q?: string;
    products?: string;
  }>();

  const initialQuery = (q ?? '').toString();
  const parsedProducts: Product[] = useMemo(() => {
    try {
      const raw = products ?? '[]';
      const sanitized =
        typeof raw === 'string'
          ? raw.replace(/[\u0000-\u001F]/g, '')
          : String(raw);
      const arr = JSON.parse(sanitized) as Product[];
      console.log('[FRONTEND] Parsed products for ResultsScreen:', arr);
      return arr;
    } catch (err) {
      console.error('[FRONTEND] Error parsing products param:', err, products);
      return [];
    }
  }, [products]);

  // TODO: Fix this
  const handleProductSelection = useCallback(
    async (productId: string, selection: 'like' | 'dislike' | null) => {
      try {
        // Get current user
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
          // Add to favorites (ignore duplicate error)
          const { error: insertError } = await supabase
            .from('user_favorites')
            .insert([{ user_id: userId, product_id: productId }], {
              upsert: false,
            });
          if (insertError && !insertError.message.includes('duplicate')) {
            console.error('Error adding favorite:', insertError);
          }
        } else if (selection === 'dislike') {
          // Remove from favorites
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

  const handleProductClick = useCallback((productId: string) => {
    void productId;
    // TODO: Open detail view or external link
  }, []);

  return (
    <ResultsScreen
      initialQuery={initialQuery}
      products={parsedProducts}
      onBack={() => router.replace('home')}
      onProductClick={handleProductClick}
      updateSelections={handleProductSelection}
    />
  );
}
