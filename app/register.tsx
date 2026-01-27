import React, { useState } from "react";
import { router } from "expo-router";
import { supabase } from "../backend/services/supabase/supabaseClient";
import RegisterScreen from "../frontend/components/screens/RegisterScreen";

/**
 * useRegister
 * - Custom hook for user registration logic
 * - Manages form state and Supabase authentication
 * - Handles error states and profile creation
 */
export function useRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle registration form submission
  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (signUpError) {
        if (signUpError.message.includes("duplicate key value")) {
          setError(
            "This email is already registered. Please use a different email.",
          );
        } else if (signUpError.message.includes("password")) {
          setError("Password is too weak. Please use at least 6 characters.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
        return;
      }

      const user = signUpData?.user;

      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ full_name: name })
          .eq("id", user.id);

        if (profileError) {
          setError("Failed to update profile. Please try again.");
          return;
        }

        router.push("/home");
      }
    } catch (err) {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to sign-in screen
  const goToSignIn = () => {
    router.push("/sign-in");
  };

  // Navigate back to home screen
  const goBack = () => {
    router.push("/home");
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

/**
 * RegisterRoute
 * - Registration screen route component
 * - Connects useRegister hook to RegisterScreen UI
 */
export default function RegisterRoute() {
  const registerProps = useRegister();
  return <RegisterScreen {...registerProps} />;
}