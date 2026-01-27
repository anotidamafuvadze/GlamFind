import React from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import images from "../../constants/images";
import useSignInStyles from "../../styles/signInScreenStyles";
import BackButton from "../ui/general/BackButton";

type SignInScreenProps = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  loading: boolean;
  handleSubmit: () => void;
  goToRegister: () => void;
  goBack: () => void;
};

/**
 * SignInScreen component
 * - User authentication and sign-in screen
 *
 * @param email - Email input value
 * @param setEmail - Function to update email value
 * @param password - Password input value
 * @param setPassword - Function to update password value
 * @param error - Error message to display (if any)
 * @param loading - Whether sign-in is in progress
 * @param handleSubmit - Callback function for sign-in submission
 * @param goToRegister - Callback function to navigate to registration screen
 * @param goBack - Callback function to navigate back
 * @returns React component for the sign-in screen
 */
export default function SignInScreen({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  handleSubmit,
  goToRegister,
  goBack,
}: SignInScreenProps) {
  const styles = useSignInStyles();

  return (
    <ImageBackground
      source={images.backgrounds.signInScreen}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.content}>
        {/* Back button */}
        <BackButton
          onPress={goBack}
          style={{
            button: styles.backButton,
            pressed: styles.backButtonPressed,
            icon: styles.backIcon,
          }}
        />

        {/* Header section */}
        <View style={styles.headerBlock}>
          <Text style={styles.title}>GLAM QUERY</Text>
          <Text style={styles.subtitle}>
            Find beauty products that suit you
          </Text>
        </View>

        {/* Sign-in form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <View style={styles.spacer} />

          {/* Email input */}
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email Address"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={styles.input}
            placeholderTextColor="#000000"
          />

          {/* Password input */}
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            style={styles.input}
            placeholderTextColor="#000000"
          />

          {/* Error message */}
          {!!error && <Text style={styles.error}>{error}</Text>}

          {/* Submit button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Registration link */}
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={goToRegister}>
              Create one
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}