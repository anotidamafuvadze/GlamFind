import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/**
 * useFonts hook
 * - Centralizes typography constants with responsive scaling
 */

export default function useFonts() {
  const { width, height } = useWindowDimensions();

  // ======================= RESPONSIVE SCALING =======================
  const BASE_WIDTH = 428;
  const scale = width / BASE_WIDTH;
  const isTablet = Math.min(width, height) >= 768;

  return useMemo(
    () => ({
      // ======================= FONT FAMILIES =======================
      family: {
        primary: "CormorantGaramond-Light",
        secondary: "System",
      },

      // ======================= FONT WEIGHTS =======================
      weight: {
        light: "200",
        regular: "300",
        normal: "400",
        semiBold: "600",
        bold: "700",
      },

      // ======================= FONT SIZES =======================
      size: {
        // ----------------------- WELCOME SCREEN -----------------------
        welcome: {
          title: 65 * scale + (isTablet ? 6 : 0),
          tagline: 20 * scale,
          button: 23 * scale,
          bottomText: 13 * scale,
        },

        // ----------------------- HOME SCREEN -----------------------
        home: {
          title: 50 * scale,
          lineHeight: 55 * scale,
          likesButtonText: 14 * scale,
          signInButtonText: 14 * scale,
          searchInput: 20 * scale,
          searchIcon: 45 * scale,
          exampleLabel: 14 * scale,
          exampleText: 18 * scale,
          button: 27 * scale,
          bottomText: 11 * scale,
        },

        // ----------------------- RESULTS SCREEN -----------------------
        results: {
          title: 28 * scale,
          subtitle: 12 * scale,
          brand: 10 * scale,
          name: 16 * scale,
          rationale: 13 * scale,
          searchInput: 18 * scale,
          actionButtonText: 14 * scale,
          iconSize: 45 * scale,
          small: 12 * scale,
        },

        // ----------------------- SIGN IN SCREEN -----------------------
        signIn: {
          title: 52 * scale,
          subtitle: 20 * scale,
          cardTitle: 24 * scale,
          buttonText: 18 * scale,
        },

        // ----------------------- REGISTER SCREEN -----------------------
        register: {
          title: 48 * scale,
          subtitle: 18 * scale,
          cardTitle: 24 * scale,
          buttonText: 20 * scale,
        },

        // ----------------------- LIKES SCREEN -----------------------
        likesScreen: {
          title: 28 * scale,
          subtitle: 16 * scale,
          brand: 10 * scale,
          name: 16 * scale,
          rationale: 13 * scale,
          actionButtonText: 14 * scale,
        },
      },

      // ======================= SHADOW STYLES =======================
      shadow: {
        // ----------------------- PRESET SHADOWS -----------------------
        onboardingButton: {
          color: "rgba(255, 255, 255, 0.7)",
          opacity: 0.7,
          radius: 14,
        },

        homeButton: {
          color: "rgba(74, 71, 71, 0.9)",
          opacity: 0.9,
          radius: 0,
        },

        // ----------------------- SHADOW OFFSETS -----------------------
        offset: {
          splash: { width: 0, height: 1 },
          onboardingButton: { width: 0, height: 10 },
          menuButton: { width: 0, height: 6 },
          wordPackButton: { width: 0, height: 6 },
          homeButton: { width: 0, height: 4 },
        },
      },
    }),
    [scale, isTablet]
  );
}