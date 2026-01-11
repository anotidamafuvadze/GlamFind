/**
 * Color tokens
 * - Centralizes colors
 */

const colors = {
  // ======================= GLOBAL =======================
  BLACK: "rgba(0, 0, 0, 1)",
  WHITE: "rgba(255, 255, 255, 1)",

  // ======================= BRAND PALETTE =======================
  LUXURY_BLACK: "rgba(28, 27, 26, 1)",
  SOFT_GREY: "rgba(139, 139, 139, 1)",

  PEARL: "rgba(247, 241, 234, 1)",
  ROSE_GOLD: "rgba(201, 162, 126, 1)",
  DUSTY_ROSE: "rgba(200, 161, 154, 1)",

  BLUSH_LIGHT: "rgba(252, 231, 239, 1)",
  BLUSH_SOFT: "rgba(247, 220, 230, 1)",

  // ======================= WELCOME SCREEN =======================
  WELCOME: {
    TITLE: "rgb(28, 27, 26)",
    TAGLINE: "rgb(28, 27, 26)",
    BOTTOM_TEXT: "rgba(0, 0, 0, 1)",

    BUTTON_TITLE: "rgb(55, 52, 49)",
    BUTTON_BG: "rgba(250, 243, 224, 0.8)",

    GLOW: "rgba(255, 255, 255, 1)",
  },

  // ======================= HOME SCREEN =======================
  HOME: {
    TITLE: "rgb(28, 27, 26)",
    SUBTITLE: "rgb(28, 27, 26)",

    INPUT_BG: "rgba(255,255,255,0.82)",
    BORDER_NEUTRAL: "rgba(73, 70, 67, 1)",

    SEARCH_BUTTON_BG: "rgba(213, 189, 183, 1)",
    SEARCH_BUTTON_BORDER: "rgba(0, 0, 0, 0.3)",

    EXAMPLE_CARD_BG: "rgba(255,255,255,0.6)",
    EXAMPLE_PRESSED_BG: "rgba(255,255,255,0.85)",
    EXAMPLE_PRESSED_BORDER: "rgba(200,161,154,0.30)",

    BUTTON_TITLE: "rgb(55, 52, 49)",
  },

  // ======================= RESULTS SCREEN =======================
  RESULTS: {
    TITLE: "rgba(25, 24, 23, 1)",

    HEADER_BG: "rgba(255,255,255,0.55)",
    HEADER_BORDER: "rgba(213, 178, 171, 0.1)",

    BACK_BTN_BG: "rgba(255,255,255,0.70)",
    BACK_BTN_BORDER: "rgba(0, 0, 0, 0.3)",

    CARD_BG: "rgba(255, 255, 255, 1)",
    CARD_BORDER: "rgba(200,161,154,0.90)",

    INPUT_BG: "rgba(255,255,255,0.82)",
    INPUT_BORDER: "rgba(200,161,154,0.20)",

    FOOTER_BORDER: "rgba(200,161,154,0.10)",
  },

  // ======================= RESULTS (EXTRA / COMPONENT-SPECIFIC) =======================
  RESULTS_EXTRA: {
    IMAGE_BG: "rgba(246,241,240,1)",

    CARD_BORDER_LIGHT: "rgba(200,161,154,0.10)",

    ACTION_BUTTON_BG: "rgba(255,255,255,0.92)",
    ACTION_BUTTON_BORDER: "rgba(200,161,154,0.5)",
    ACTION_BUTTON_BORDER_SELECTED: "rgba(200,161,154,0.9)",
  },
};

export default colors;
