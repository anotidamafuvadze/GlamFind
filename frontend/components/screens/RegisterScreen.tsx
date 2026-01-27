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
import useRegisterStyles from "../../styles/registerScreenStyles";
import BackButton from "../ui/general/BackButton";

type RegisterScreenProps = {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string | null;
  loading: boolean;
  handleSubmit: () => void;
  goToSignIn: () => void;
  goBack: () => void;
};

/**
 * RegisterScreen component
 * - User registration and account creation screen
 *
 * @param name - Full name input value
 * @param setName - Function to update name value
 * @param email - Email input value
 * @param setEmail - Function to update email value
 * @param password - Password input value
 * @param setPassword - Function to update password value
 * @param error - Error message to display (if any)
 * @param loading - Whether registration is in progress
 * @param handleSubmit - Callback function for registration submission
 * @param goToSignIn - Callback function to navigate to sign-in screen
 * @param goBack - Callback function to navigate back
 * @returns React component for the registration screen
 */
export default function RegisterScreen({
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
}: RegisterScreenProps) {
  const styles = useRegisterStyles();

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

        {/* Registration form */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>
          <View style={styles.spacer} />

          {/* Name input */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
            style={styles.input}
            placeholderTextColor="#000000"
          />

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
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {/* Sign-in link */}
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Text style={styles.link} onPress={goToSignIn}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}