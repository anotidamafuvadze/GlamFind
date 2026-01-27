/**
 * images.ts
 *
 * Image assets registry for the application.
 * Centralized collection of all static image imports.
 * Organized by usage category for consistent reference.
 */

const images = {
  // ----------------------- BACKGROUNDS -----------------------
  backgrounds: {
    onboardingScreen: require("../assets/images/backgrounds/onboarding-screen-background.png"),
    homeScreen: require("../assets/images/backgrounds/home-screen-background.png"),
    resultsScreen: require("../assets/images/backgrounds/results-screen-background.png"),
    signInScreen: require("../assets/images/backgrounds/sign-in-screen-background.png"),
    likesScreen: require("../assets/images/backgrounds/likes-screen-background.png"),
  },

  // ----------------------- ICONS -----------------------
  icons: {
    search: require("../assets/images/icons/search-icon.png"),
    back: require("../assets/images/icons/back-icon.png"),
    profile: require("../assets/images/icons/profile-icon.png"),
    likes: require("../assets/images/icons/likes-icon.png"),
    settings: require("../assets/images/icons/settings-icon.png"),
  },

};

export default images;