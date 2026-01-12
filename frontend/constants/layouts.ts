import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

/**
 * useLayouts hook
 * - Centralizes responsive layout constants 
 */

export default function useLayouts() {
  const { width, height } = useWindowDimensions();

  // ======================= RESPONSIVE SCALING =======================
  const BASE_WIDTH = 428;
  const BASE_HEIGHT = 926;

  const scaleWidth = width / BASE_WIDTH;
  const scaleHeight = height / BASE_HEIGHT;

  const isTablet = Math.min(width, height) >= 768;
  const isPortrait = height > width;

  return useMemo(
    () => ({
      // ======================= DEVICE FLAGS =======================
      IS_TABLET: isTablet,
      IS_PORTRAIT: isPortrait,

      // ======================= SCALE FACTORS =======================
      SCALE_WIDTH: scaleWidth,
      SCALE_HEIGHT: scaleHeight,

      // ======================= COMMON VALUES =======================
      ZERO: 0,
      ONE: 1,
      BORDER_WIDTH: 1,
      ROUNDED_MAX: 999 * scaleWidth,

      // ======================= LETTER SPACING =======================
      LETTER_SPACING_TIGHT: -1,
      LETTER_SPACING_TAGLINE: 0.6,
      LETTER_SPACING_CAPS: 2,

      // ======================= WELCOME SCREEN =======================
      WELCOME: {
        // Layout
        PADDING_HORIZONTAL: 24 * scaleWidth,

        // Glow elements
        GLOW_TOP_RIGHT_POSITION: 40 * scaleWidth,
        GLOW_TOP_RIGHT_SIZE: 128 * scaleWidth,
        GLOW_BOTTOM_LEFT_POSITION: 40 * scaleWidth,
        GLOW_BOTTOM_LEFT_SIZE: 160 * scaleWidth,
        GLOW_OPACITY: 0.2,

        // Typography spacing
        APP_NAME_MARGIN_BOTTOM: 10 * scaleHeight,
        TAGLINE_MARGIN_BOTTOM: 64 * scaleHeight,
        BOTTOM_TEXT_BOTTOM: 48 * scaleHeight,
        BOTTOM_TEXT_OPACITY: 0.5,

        // Primary button
        BUTTON_MARGIN_TOP: 12 * scaleHeight,
        BUTTON_WIDTH: "70%",
        BUTTON_ELEVATION: 3,
        BUTTON_PADDING_HORIZONTAL: 20 * scaleWidth,
        BUTTON_PADDING_VERTICAL: 12 * scaleHeight,
        BUTTON_BORDER_RADIUS: 999 * scaleWidth,
        BUTTON_BORDER_WIDTH: 1,
      },

      // ======================= HOME SCREEN =======================
      HOME: {
        // Layout
        WIDTH: "100%",
        PADDING_HORIZONTAL: 24 * scaleWidth,
        PADDING_TOP: 100 * scaleHeight,

        // Header
        HEADER_PADDING_TOP: 100 * scaleHeight,
        HEADER_PADDING_BOTTOM: -100 * scaleHeight,

        // Header actions
        HEADER_ACTIONS_TOP: 65 * scaleHeight,
        HEADER_ACTIONS_RIGHT: 25 * scaleWidth,

        // Settings button
        SETTINGS_BUTTON_TOP: 45 * scaleHeight,
        SETTINGS_BUTTON_LEFT: -5 * scaleWidth,
        SETTINGS_BUTTON_IMAGE_WIDTH: 130 * scaleWidth,
        SETTINGS_BUTTON_IMAGE_HEIGHT: 130 * scaleHeight,
        SETTINGS_BUTTON_PRESSED_OPACITY: 0.6,

        // Likes & sign-in buttons
        LIKES_BUTTON_ACTIVE_OPACITY: 0.8,
        LIKES_BUTTON_MARGIN_RIGHT: -18 * scaleWidth,
        LIKES_BUTTON_WIDTH: 80 * scaleWidth,
        LIKES_BUTTON_HEIGHT: 80 * scaleHeight,
        LIKES_BUTTON_ZINDEX: 2,
        LIKES_BUTTON_GLOW_TOP: 8 * scaleHeight,
        LIKES_BUTTON_GLOW_RIGHT: -72 * scaleWidth,
        LIKES_BUTTON_GLOW_WIDTH: 163 * scaleWidth,
        LIKES_BUTTON_GLOW_HEIGHT: 88 * scaleHeight,
        LIKES_BUTTON_GLOW_OPACITY: 0.25,
        LIKES_BUTTON_GLOW_ZINDEX: 1,
        LIKES_BUTTON_TEXT_MARGIN_TOP: -15 * scaleHeight,

        SIGNIN_BUTTON_ACTIVE_OPACITY: 0.8,
        SIGNIN_BUTTON_WIDTH: 80 * scaleWidth,
        SIGNIN_BUTTON_HEIGHT: 80 * scaleHeight,
        SIGNIN_BUTTON_ZINDEX: 2,
        SIGNIN_BUTTON_TEXT_MARGIN_TOP: -15 * scaleHeight,

        // Search section
        SEARCH_SECTION_MARGIN_BOTTOM: 20 * scaleHeight,

        // Search input
        INPUT_PADDING_VERTICAL: 18 * scaleHeight,
        INPUT_PADDING_LEFT: 22 * scaleWidth,
        INPUT_PADDING_RIGHT: 62 * scaleWidth,
        INPUT_RADIUS: 999 * scaleWidth,
        INPUT_SHADOW_OPACITY: 0.06,
        INPUT_SHADOW_RADIUS: 12 * scaleHeight,
        INPUT_SHADOW_OFFSET_WIDTH: 0 * scaleWidth,
        INPUT_SHADOW_OFFSET_HEIGHT: 8 * scaleHeight,
        INPUT_ELEVATION: 2,

        // Search button
        SEARCH_BUTTON_SIZE: 44 * scaleWidth,
        SEARCH_BUTTON_RIGHT: 10 * scaleWidth,
        SEARCH_BUTTON_TOP: 8 * scaleHeight,
        SEARCH_BUTTON_BORDER_WIDTH: 0.5,
        SEARCH_BUTTON_SHADOW_RADIUS: 10 * scaleHeight,
        SEARCH_BUTTON_SHADOW_OPACITY: 0,
        SEARCH_BUTTON_SHADOW_OFFSET_WIDTH: 0 * scaleWidth,
        SEARCH_BUTTON_SHADOW_OFFSET_HEIGHT: 6 * scaleHeight,
        SEARCH_BUTTON_ELEVATION: 4,

        // Pressed state
        PRESSED_SCALE: 0.98,
        PRESSED_OPACITY: 0.95,

        // Search icon
        SEARCH_ICON_SIZE: 45 * scaleWidth,
        SEARCH_ICON_MARGIN_TOP: 3 * scaleHeight,
        SEARCH_ICON_MARGIN_LEFT: 3 * scaleWidth,

        // Example queries
        EXAMPLES_MAX_WIDTH: 280 * scaleWidth,
        EXAMPLES_LABEL_MARGIN_BOTTOM: 20 * scaleHeight,
        EXAMPLES_GAP: 12 * scaleHeight,
        EXAMPLE_CARD_PADDING_VERTICAL: 16 * scaleHeight,
        EXAMPLE_CARD_PADDING_HORIZONTAL: 18 * scaleWidth,
        EXAMPLE_CARD_RADIUS: 30 * scaleWidth,

        // Carousel
        CAROUSEL_SPEED: 0.08,
        CAROUSEL_MARGIN_TOP: 18 * scaleHeight,
        CAROUSEL_PADDING_BOTTOM: 24 * scaleHeight,
        CAROUSEL_WRAP_HEIGHT: 180 * scaleHeight,
        CAROUSEL_CARD_WIDTH: 160 * scaleWidth,
        CAROUSEL_GAP: 20 * scaleWidth,
        CAROUSEL_CARD_BORDER_RADIUS: 18 * scaleWidth,
        CAROUSEL_CARD_IMAGE_HEIGHT: 140 * scaleHeight,

        // Glow elements
        GLOW_TOPLEFT_TOP: 180 * scaleHeight,
        GLOW_TOPLEFT_LEFT: 35 * scaleWidth,
        GLOW_TOPLEFT_WIDTH: 360 * scaleWidth,
        GLOW_TOPLEFT_HEIGHT: 150 * scaleHeight,
        GLOW_BOTTOMRIGHT_BOTTOM: 350 * scaleHeight,
        GLOW_BOTTOMRIGHT_RIGHT: 40 * scaleWidth,
        GLOW_BOTTOMRIGHT_WIDTH: 128 * scaleWidth,
        GLOW_BOTTOMRIGHT_HEIGHT: 128 * scaleHeight,

        // Bottom text
        BOTTOM_TEXT_BOTTOM: 30 * scaleHeight,
        BOTTOM_TEXT_OPACITY: 0.8,
      },

      // ======================= RESULTS SCREEN =======================
      RESULTS: {
        // Layout
        PADDING_HORIZONTAL: 24 * scaleWidth,
        HEADER_PADDING_HORIZONTAL: 24 * scaleWidth,
        HEADER_PADDING_VERTICAL: 46 * scaleHeight,

        // Header
        HEADER_TITLE_TOP: 23 * scaleHeight,
        GAP_SMALL: 12 * scaleWidth,
        GAP_TINY: 10 * scaleWidth,

        // Back button
        BACK_BUTTON_TOP: 20 * scaleHeight,
        BACK_BUTTON_SIZE: 40 * scaleWidth,
        BACK_BUTTON_BORDER_RADIUS: 999 * scaleWidth,
        BACK_BUTTON_BORDER_WIDTH: 0.7,
        BACK_BUTTON_PRESSED_OPACITY: 0.6,

        // List
        LIST_PADDING_HORIZONTAL: 24 * scaleWidth,
        LIST_PADDING_TOP: 20 * scaleHeight,
        ROW_MARGIN_BOTTOM: 14 * scaleHeight,

        // Label
        LABEL_FONT_LETTER_SPACING: 2 * scaleWidth,
        LABEL_MARGIN_BOTTOM: 10 * scaleHeight,

        // Subtitle
        SUBTITLE_MARGIN_TOP: 2 * scaleHeight,
        SUBTITLE_LETTER_SPACING: 1.2 * scaleWidth,

        // Explanation card
        EXPLANATION_CARD_MARGIN_BOTTOM: 16 * scaleHeight,
        EXPLANATION_CARD_PADDING: 18 * scaleHeight,
        EXPLANATION_CARD_PADDING_BOTTOM: 10 * scaleHeight,
        EXPLANATION_CARD_BORDER_RADIUS: 24 * scaleWidth,
        EXPLANATION_CARD_SHADOW_OFFSET_HEIGHT: 10 * scaleHeight,
        EXPLANATION_CARD_SHADOW_OPACITY: 0.06,
        EXPLANATION_CARD_SHADOW_RADIUS: 16 * scaleHeight,
        EXPLANATION_CARD_ELEVATION: 3,

        // AI badge
        AI_BADGE_SIZE: 32 * scaleWidth,
        AI_BADGE_LETTER_SPACING: 0.6,

        // Typography line heights
        EXPLANATION_BODY_LINE_HEIGHT: 20 * scaleHeight,
        RATIONALE_LINE_HEIGHT: 18 * scaleHeight,
        EXPLANATION_TITLE_MARGIN_BOTTOM: 6 * scaleHeight,

        // Product card
        CARD_BORDER_RADIUS: 24 * scaleWidth,
        CARD_BORDER_WIDTH: 1,
        CARD_SHADOW_OFFSET_HEIGHT: 10 * scaleHeight,
        CARD_SHADOW_OPACITY: 0.08,
        CARD_SHADOW_RADIUS: 18 * scaleHeight,
        CARD_ELEVATION: 4,
        CARD_PRESSED_SCALE: 0.99,
        CARD_PRESSED_OPACITY: 0.96,

        // Product imagery
        IMAGE_WRAP_ASPECT_RATIO: 1,
        IMAGE_WRAP_BG_OPACITY: 1,

        // Card content
        CONTENT_PADDING_HORIZONTAL: 20 * scaleWidth,
        CONTENT_PADDING_VERTICAL: 18 * scaleHeight,
        BRAND_MARGIN_BOTTOM: 8 * scaleHeight,
        NAME_MARGIN_BOTTOM: 10 * scaleHeight,

        // Card actions
        ACTIONS_ROW_MARGIN_TOP: 12 * scaleHeight,
        ACTION_BUTTON_SIZE: 44 * scaleWidth,
        ACTION_BUTTON_BORDER_RADIUS: 999 * scaleWidth,
        ACTION_BUTTON_MARGIN_RIGHT: 12 * scaleWidth,
        ACTION_BUTTON_BG_OPACITY: 0.92,
        ACTION_BUTTON_BORDER_WIDTH: 1,
        ACTION_BUTTON_SELECTED_OPACITY: 0.7,

        // Footer search bar
        SEARCHBAR_PADDING_HORIZONTAL: 24 * scaleWidth,
        SEARCHBAR_PADDING_TOP: 12 * scaleHeight,
        SEARCHBAR_PADDING_BOTTOM_IOS: 18 * scaleHeight,
        SEARCHBAR_PADDING_BOTTOM_ANDROID: 12 * scaleHeight,

        // Footer input
        INPUT_PADDING_VERTICAL: 12 * scaleHeight,
        INPUT_PADDING_HORIZONTAL: 16 * scaleWidth,
        INPUT_BORDER_RADIUS: 999 * scaleWidth,

        // Footer search button
        SEARCH_BUTTON_SIZE: 44 * scaleWidth,
        SEARCH_BUTTON_ICON_SIZE: 45 * scaleWidth,
        SEARCH_BUTTON_ICON_TOP: 2 * scaleHeight,
        SEARCH_BUTTON_ICON_LEFT: 1 * scaleWidth,
        SEARCH_BUTTON_SHADOW_OFFSET_HEIGHT: 6 * scaleHeight,
        SEARCH_BUTTON_SHADOW_RADIUS: 10 * scaleHeight,
        SEARCH_BUTTON_SHADOW_OPACITY: 0.22,
        SEARCH_BUTTON_ELEVATION: 3,

        // Pressed state
        PRESSED_SCALE: 0.98,
        PRESSED_OPACITY: 0.95,
      },
    }),
    [scaleWidth, scaleHeight, isTablet, isPortrait]
  );
}
