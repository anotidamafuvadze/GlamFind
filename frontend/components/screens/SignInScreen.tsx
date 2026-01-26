import React from 'react';
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import images from '../../constants/images';
import BackButton from '../ui/general/BackButton';
import useSignInStyles from '../../styles/signInScreenStyles';

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
        {/* Back button at the top */}
        <BackButton
          onPress={goBack}
          style={{
            button: styles.backButton,
            pressed: styles.backButtonPressed,
            icon: styles.backIcon,
          }}
        />
        <View style={styles.headerBlock}>
          <Text style={styles.title}>GLAM QUERY</Text>
          <Text style={styles.subtitle}>
            Find beauty products that suit you
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back</Text>
          <View style={styles.spacer} />

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
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            textContentType="password"
            style={styles.input}
            placeholderTextColor="#000000"
          />

          {!!error && <Text style={styles.error}>{error}</Text>}

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

          <Text style={styles.footerText}>
            Don't have an account?{' '}
            <Text style={styles.link} onPress={goToRegister}>
              Create one
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
