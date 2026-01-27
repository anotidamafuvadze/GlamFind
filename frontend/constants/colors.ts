/**
 * colors.ts
 *
 * Color tokens for the entire application.
 * Centralized color definitions for consistent theming.
 */

const colors = {
  // ======================= GLOBAL =======================
  BLACK: "rgba(0, 0, 0, 1)",
  WHITE: "rgba(255, 255, 255, 1)",

  // ======================= BRAND PALETTE =======================
  LUXURY_BLACK: "rgba(28, 27, 26, 1)",
  SOFT_GREY: "rgba(139, 139, 139, 1)",

  // ----------------------- WELCOME SCREEN -----------------------
  WELCOME: {
    TITLE: "rgb(28, 27, 26)",
    TAGLINE: "rgb(28, 27, 26)",
    BOTTOM_TEXT: "rgba(0, 0, 0, 1)",
    BUTTON_TITLE: "rgb(55, 52, 49)",
    BUTTON_BG: "rgba(255, 250, 236, 0.8)",
    GLOW: "rgba(255, 255, 255, 1)",
  },

  // ----------------------- HOME SCREEN -----------------------
  HOME: {
    TITLE: "rgb(28, 27, 26)",
    SUBTITLE: "rgb(28, 27, 26)",
    INPUT_BG: "rgba(255, 255, 255, 0.82)",
    BORDER_NEUTRAL: "rgba(73, 70, 67, 1)",
    SEARCH_BUTTON_BG: "rgba(209, 205, 194, 0.8)",
    SEARCH_BUTTON_BORDER: "rgba(0, 0, 0, 0.3)",
    EXAMPLE_CARD_BG: "rgba(255, 255, 255, 0.6)",
    EXAMPLE_PRESSED_BG: "rgba(255, 255, 255, 0.85)",
    EXAMPLE_PRESSED_BORDER: "rgba(200, 161, 154, 0.3)",
    BUTTON_TITLE: "rgb(55, 52, 49)",
  },

  // ----------------------- RESULTS SCREEN -----------------------
  RESULTS: {
    TITLE: "rgba(25, 24, 23, 1)",
    HEADER_BG: "rgba(255, 255, 255, 0.55)",
    HEADER_BORDER: "rgba(213, 178, 171, 0.1)",
    BACK_BTN_BG: "rgba(255, 255, 255, 0.7)",
    BACK_BTN_BORDER: "rgba(0, 0, 0, 1)",
    CARD_BG: "rgba(255, 255, 255, 1)",
    CARD_BORDER: "rgba(200, 161, 154, 0.9)",
    INPUT_BG: "rgba(255, 255, 255, 0.82)",
    INPUT_BORDER: "rgba(0, 0, 0, 0.9)",
    FOOTER_BORDER: "rgba(200, 161, 154, 0.1)",
    SEARCH_BUTTON_BG: "rgba(158, 153, 153, 0.8)",
    SEARCH_BUTTON_BORDER: "rgb(73, 73, 73)",
  },

  // ----------------------- RESULTS COMPONENT-SPECIFIC -----------------------
  RESULTS_EXTRA: {
    IMAGE_BG: "rgb(255, 255, 255)",
    CARD_BORDER_LIGHT: "rgba(200, 161, 154, 0.1)",
    ACTION_BUTTON_BG: "rgba(255, 255, 255, 0.92)",
    ACTION_BUTTON_BORDER: "rgba(0, 0, 0, 0.5)",
    ACTION_BUTTON_BORDER_SELECTED: "rgba(137, 129, 129, 0.8)",
    ACTION_BUTTON_SELECTED_BG: "rgba(137, 129, 129, 0.8)",
  },

  // ----------------------- SIGN IN SCREEN -----------------------
  SIGNIN: {
    TITLE: "rgb(28, 27, 26)",
    SUBTITLE: "black",
    BACK_BUTTON_BG: "rgba(255, 255, 255, 0.7)",
    BACK_BUTTON_BORDER: "rgba(0, 0, 0, 1)",
    BACK_ICON_TINT: "#1F2937",
    CARD_BG: "rgba(255, 255, 255, 0.8)",
    CARD_TITLE: "#1F2937",
    INPUT_BG: "rgba(250, 243, 224, 0.8)",
    INPUT_BORDER: "#646464",
    INPUT_TEXT: "#000000",
    ERROR_TEXT: "#DC2626",
    ERROR_BG: "#FEF2F2",
    BUTTON_BG: "rgba(250, 243, 224, 0.8)",
    BUTTON_BORDER: "#656565",
    BUTTON_TEXT: "#000000",
    FOOTER_TEXT: "#374151",
    LINK: "#000000",
  },

  // ----------------------- REGISTER SCREEN -----------------------
  REGISTER: {
    TITLE: "rgb(28, 27, 26)",
    SUBTITLE: "black",
    BACK_BUTTON_BG: "rgba(255, 255, 255, 0.7)",
    BACK_BUTTON_BORDER: "rgba(0, 0, 0, 1)",
    BACK_ICON_TINT: "#1F2937",
    CARD_BG: "rgba(255, 255, 255, 0.8)",
    CARD_TITLE: "#1F2937",
    INPUT_BG: "rgba(250, 243, 224, 0.8)",
    INPUT_BORDER: "#656565",
    INPUT_TEXT: "#000000",
    ERROR_TEXT: "#DC2626",
    ERROR_BG: "#FEF2F2",
    BUTTON_BG: "rgba(250, 243, 224, 0.8)",
    BUTTON_BORDER: "#656565",
    BUTTON_TEXT: "#000000",
    FOOTER_TEXT: "#374151",
    LINK: "#000000",
  },

  // ----------------------- LIKES SCREEN -----------------------
  LIKES_SCREEN: {
    BACKGROUND: "rgba(255, 255, 255, 1)",
    HEADER_BG: "rgba(255, 255, 255, 0.55)",
    HEADER_BORDER: "rgba(213, 178, 171, 0.1)",
    TITLE: "rgba(25, 24, 23, 1)",
    BACK_BTN_BG: "rgba(255, 255, 255, 0.7)",
    BACK_BTN_BORDER: "rgba(0, 0, 0, 1)",
    CARD_BG: "rgba(255, 255, 255, 1)",
    CARD_BORDER: "rgba(200, 161, 154, 0.1)",
    IMAGE_BG: "rgba(246, 241, 240, 1)",
    ACTION_BUTTON_BG: "rgba(255, 255, 255, 0.92)",
    ACTION_BUTTON_BORDER: "rgba(200, 161, 154, 0.5)",
    ACTION_BUTTON_BORDER_SELECTED: "rgba(200, 161, 154, 0.9)",
  },
};

export default colors;