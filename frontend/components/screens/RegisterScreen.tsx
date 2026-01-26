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
import useRegisterStyles from '../../styles/registerScreenStyles';

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
          <Text style={styles.cardTitle}>Create Account</Text>
          <View style={styles.spacer} />

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
            style={styles.input}
            placeholderTextColor="#000000"
          />
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
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={goToSignIn}>
              Sign in
            </Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}
