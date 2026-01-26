import React, { useState } from 'react';
import { router } from 'expo-router';

import { supabase } from '../backend/services/supabase/supabaseClient';
import RegisterScreen from '../frontend/components/screens/RegisterScreen';

export function useRegister() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting to sign up with:', { email, password, name });

      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      console.log('Sign-up response:', { signUpData, signUpError });

      if (signUpError) {
        if (signUpError.message.includes('duplicate key value')) {
          setError(
            'This email is already registered. Please use a different email.',
          );
        } else if (signUpError.message.includes('password')) {
          setError('Password is too weak. Please use at least 6 characters.');
        } else {
          setError('An unexpected error occurred. Please try again.');
          console.log('Sign-up error details:', signUpError);
        }
        return;
      }

      const user = signUpData?.user;
      console.log('User created:', user);

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: name })
          .eq('id', user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          setError('Failed to update profile. Please try again.');
          return;
        }

        router.push('/home');
      }
    } catch (err) {
      console.error('Failed to register:', err);
      setError('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToSignIn = () => {
    router.push('/sign-in');
  };

  const goBack = () => {
    router.push('/home');
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    goToSignIn,
    goBack,
  };
}

export default function RegisterRoute() {
  const registerProps = useRegister();
  return <RegisterScreen {...registerProps} />;
}
