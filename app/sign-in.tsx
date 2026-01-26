import React, { useState } from 'react';
import { router } from 'expo-router';

import { supabase } from '../backend/services/supabase/supabaseClient';
import SignInScreen from '../frontend/components/screens/SignInScreen';

export function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        if (signInError.message.toLowerCase().includes('invalid')) {
          setError('Invalid email or password.');
        } else {
          setError('Unable to sign in. Please try again.');
        }
        return;
      }

      const user = signInData?.user;

      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError('Failed to fetch profile. Please try again.');
          return;
        }

        router.push('/home');
      }
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    router.push('/register');
  };

  const goBack = () => {
    router.push('/home');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    goToRegister,
    goBack,
  };
}

export default function SignInRoute() {
  const signInProps = useSignIn();
  return <SignInScreen {...signInProps} />;
}
