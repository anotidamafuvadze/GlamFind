import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export default function useLayouts() {
  const { width, height } = useWindowDimensions();
  const BASE_HEIGHT = 926;
  const BASE_WIDTH = 428;

  const scaleHeight = height / BASE_HEIGHT;
  const scaleWidth = width / BASE_WIDTH;
  const isTablet = Math.min(width, height) >= 768;
  const isPortrait = height > width;

  return useMemo(
    () => ({
      // ======================= GLOBAL CONFIGURATION =======================
      IS_TABLET: isTablet,
      IS_PORTRAIT: isPortrait,
      SCALE_HEIGHT: scaleHeight,
      SCALE_WIDTH: scaleWidth,

      // ======================= COMMON VALUES =======================
      BORDER_WIDTH: 1,
      ZERO: 0,
      
      // ======================= LETTER SPACING =======================
      LETTER_SPACING_TIGHT: -1,
      LETTER_SPACING_TAGLINE: 0.6,
      LETTER_SPACING_CAPS: 2,

      // ======================= ONBOARDING SCREEN =======================
      ONBOARDING: {
        PADDING_HORIZONTAL: 24 * scaleWidth,
        
        // Glow Elements
        GLOW_TOP_RIGHT_POSITION: 40 * scaleWidth,
        GLOW_TOP_RIGHT_SIZE: 128 * scaleWidth,
        GLOW_BOTTOM_LEFT_POSITION: 40 * scaleWidth,
        GLOW_BOTTOM_LEFT_SIZE: 160 * scaleWidth,
        
        // Typography
        APP_NAME_MARGIN_BOTTOM: 10 * scaleHeight,
        TAGLINE_MARGIN_BOTTOM: 64 * scaleHeight,
        BOTTOM_TEXT_BOTTOM: 48 * scaleHeight,
        BOTTOM_TEXT_OPACITY: 0.5,
        
        // Button
        BUTTON_MARGIN_TOP: 12 * scaleHeight,
        BUTTON_WIDTH: "70%",
        BUTTON_ELEVATION: 3,
      },

      // ======================= HOME SCREEN =======================
      HOME: {
        PADDING_HORIZONTAL: 24 * scaleWidth,
        WIDTH: "100%",
        
        // Header
        PADDING_TOP: 70 * scaleHeight,
        HEADER_PADDING_TOP: 100 * scaleHeight,
        HEADER_PADDING_BOTTOM: -10 * scaleHeight,
        
        // Title Typography
        TITLE_FONT_SIZE: 42 * scaleHeight,
        TITLE_FONT_WEIGHT: 300,
        TITLE_LINE_HEIGHT: 46 * scaleHeight,
        
        // Search Section
        SEARCH_SECTION_MARGIN_BOTTOM: 40 * scaleHeight,
        
        // Search Input
        INPUT_PADDING_VERTICAL: 18 * scaleHeight,
        INPUT_PADDING_LEFT: 22 * scaleWidth,
        INPUT_PADDING_RIGHT: 62 * scaleWidth,
        INPUT_RADIUS: 999 * scaleWidth,
        INPUT_SHADOW_OPACITY: 0.06,
        INPUT_SHADOW_RADIUS: 12 * scaleHeight,
        INPUT_SHADOW_OFFSET_WIDTH: 0 * scaleWidth,
        INPUT_SHADOW_OFFSET_HEIGHT: 8 * scaleHeight,
        INPUT_ELEVATION: 2,
        
        // Search Button
        SEARCH_BUTTON_SIZE: 44 * scaleWidth,
        SEARCH_BUTTON_RIGHT: 10 * scaleWidth,
        SEARCH_BUTTON_TOP: 8 * scaleHeight,
        SEARCH_BUTTON_BORDER_WIDTH: 0.5,
        SEARCH_BUTTON_SHADOW_RADIUS: 10 * scaleHeight,
        SEARCH_BUTTON_SHADOW_OPACITY: 0,
        SEARCH_BUTTON_SHADOW_OFFSET_WIDTH: 0 * scaleWidth,
        SEARCH_BUTTON_SHADOW_OFFSET_HEIGHT: 6 * scaleHeight,
        SEARCH_BUTTON_ELEVATION: 4,
        PRESSED_SCALE: 0.98,
        PRESSED_OPACITY: 0.95,
        
        // Search Icon
        SEARCH_ICON_SIZE: 45 * scaleWidth,
        SEARCH_ICON_MARGIN_TOP: 3 * scaleHeight,
        SEARCH_ICON_MARGIN_LEFT: 3 * scaleWidth,
        
        // Example Queries
        EXAMPLES_MAX_WIDTH: 310 * scaleWidth,
        EXAMPLES_LABEL_MARGIN_BOTTOM: 20 * scaleHeight,
        EXAMPLES_GAP: 12 * scaleHeight,
        EXAMPLE_CARD_PADDING_VERTICAL: 16 * scaleHeight,
        EXAMPLE_CARD_PADDING_HORIZONTAL: 18 * scaleWidth,
        EXAMPLE_CARD_RADIUS: 25 * scaleWidth,
        
        // Carousel
        CAROUSEL_MARGIN_TOP: 18 * scaleHeight,
        CAROUSEL_PADDING_BOTTOM: 24 * scaleHeight,
        CAROUSEL_WRAP_HEIGHT: 180 * scaleHeight,
        
        // Glow Elements
        GLOW_TOPLEFT_TOP: 120 * scaleHeight,
        GLOW_TOPLEFT_LEFT: 70 * scaleWidth,
        GLOW_TOPLEFT_WIDTH: 96 * scaleWidth,
        GLOW_TOPLEFT_HEIGHT: 96 * scaleHeight,
        GLOW_BOTTOMRIGHT_BOTTOM: 96 * scaleHeight,
        GLOW_BOTTOMRIGHT_RIGHT: 40 * scaleWidth,
        GLOW_BOTTOMRIGHT_WIDTH: 128 * scaleWidth,
        GLOW_BOTTOMRIGHT_HEIGHT: 128 * scaleHeight,
        
        // Bottom Text
        BOTTOM_TEXT_BOTTOM: 30 * scaleHeight,
        BOTTOM_TEXT_OPACITY: 0.8,

        // Carousel
        CAROUSEL_CARD_WIDTH: 160 * scaleWidth,
        CAROUSEL_GAP: 20 * scaleWidth,
        CAROUSEL_SPEED: 0.08,

      },
    }),
    [width, height]
  );
}