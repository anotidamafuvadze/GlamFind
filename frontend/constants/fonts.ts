import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export default function useFonts() {
  const { width, height } = useWindowDimensions();

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
        light: "300",
        regular: "400",
        semiBold: "600",
        bold: "700",
      },

      // ======================= FONT SIZES =======================
      size: {
        onboarding: {
          title: 65 * scale + (isTablet ? 6 : 0),
          tagline: 20 * scale,
          button: 25 * scale,
          bottomText: 13 * scale,
        },

        home: {
          title: 50 * scale,
          lineHeight: 55 * scale,
          searchInput: 20 * scale,
          searchIcon: 45 * scale,
          exampleText: 18 * scale,
          exampleLabel: 14 * scale,
          button: 27 * scale,
          bottomText: 11 * scale,
        },

        results: {

        }

      },

      // ======================= SHADOWS =======================
      shadow: {
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

        offset: {
          splash: { width: 0, height: 1 },
          onboardingButton: { width: 0, height: 10 },
          menuButton: { width: 0, height: 6 },
          wordPackButton: { width: 0, height: 6 },
          homeButton: { width: 0, height: 4 },
        },
      },
    }),
    [width, height, scale, isTablet]
  );
}