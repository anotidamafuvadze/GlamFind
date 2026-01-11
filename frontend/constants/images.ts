/**
 * Image assets
 * - Central registry for static image imports
 * - Organized by usage category (backgrounds, icons, branding)
 * - Prefer referencing images from this file over inline requires
 */

const images = {
  // ======================= BACKGROUNDS =======================
  backgrounds: {
    onboardingScreen: require("../assets/images/backgrounds/onboarding-screen-background.png"),
    homeScreen: require("../assets/images/backgrounds/home-screen-background.png"),
    resultsScreen: require("../assets/images/backgrounds/results-screen-background.png"),
  },

  // ======================= ICONS =======================
  icons: {
    search: require("../assets/images/icons/search-icon.png"),
    back: require("../assets/images/icons/back-icon.png"),
    profile: require("../assets/images/icons/profile-icon.png"),
    likes: require("../assets/images/icons/likes-icon.png"),
    settings: require("../assets/images/icons/settings-icon.png"),
  },

  // ======================= BRANDING =======================
  branding: {
    // logo: require("../assets/images/branding/logo.png"),
  },
};

export default images;
