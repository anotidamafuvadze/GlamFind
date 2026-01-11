
import { useMemo } from "react";
import { 
  ImageStyle, 
  TextInputProps, 
  TextStyle, 
  ViewStyle 
} from "react-native";

// Constants
import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

/**
 * useHomeStyles hook
 * - Defines Home screen styles
 */

export default function useHomeStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  const styles = useMemo(
    () => ({
      // ======================= BACKGROUND =======================
      background: {
        flex: layouts.ONE,
      } as ViewStyle,

      // ======================= CONTENT LAYOUT =======================
      content: {
        flex: layouts.ONE,
        justifyContent: "space-between",
        paddingHorizontal: layouts.HOME.PADDING_HORIZONTAL,
        paddingTop: layouts.HOME.PADDING_TOP,
      } as ViewStyle,

      // ======================= TITLE =======================
      title: {
        alignItems: "center",
        color: colors.LUXURY_BLACK,
        fontFamily: fonts.family.primary,
        fontSize: fonts.size.home.title,
        fontWeight: fonts.weight.light,
        lineHeight: fonts.size.home.lineHeight,
        paddingBottom: layouts.HOME.HEADER_PADDING_BOTTOM,
        paddingTop: layouts.HOME.HEADER_PADDING_TOP,
        textAlign: "center",
      } as TextStyle,

      // ======================= HEADER ACTIONS =======================
      headerActions: {
        position: "absolute",
        top: layouts.HOME.HEADER_ACTIONS_TOP,
        right: layouts.HOME.HEADER_ACTIONS_RIGHT,
        flexDirection: "row",
        alignItems: "center",
      } as ViewStyle,

      // ======================= SETTINGS BUTTON =======================
      settingsButton: {
        container: {
          position: "absolute",
          top: layouts.HOME.SETTINGS_BUTTON_TOP,
          left: layouts.HOME.SETTINGS_BUTTON_LEFT,
          alignItems: "center",
        } as ViewStyle,

        image: {
          width: layouts.HOME.SETTINGS_BUTTON_IMAGE_WIDTH,
          height: layouts.HOME.SETTINGS_BUTTON_IMAGE_HEIGHT,
        } as ImageStyle,

        opacity: layouts.HOME.SETTINGS_BUTTON_PRESSED_OPACITY,
      },

      // ======================= LIKES BUTTON =======================
      likesButton: {
        activeOpacity: layouts.HOME.LIKES_BUTTON_ACTIVE_OPACITY,

        container: {
          alignItems: "center",
          marginRight: layouts.HOME.LIKES_BUTTON_MARGIN_RIGHT,
        } as ViewStyle,

        button: {
          width: layouts.HOME.LIKES_BUTTON_WIDTH,
          height: layouts.HOME.LIKES_BUTTON_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          zIndex: layouts.HOME.LIKES_BUTTON_ZINDEX,
        } as ViewStyle,

        glow: {
          position: "absolute",
          top: layouts.HOME.LIKES_BUTTON_GLOW_TOP,
          right: layouts.HOME.LIKES_BUTTON_GLOW_RIGHT,
          width: layouts.HOME.LIKES_BUTTON_GLOW_WIDTH,
          height: layouts.HOME.LIKES_BUTTON_GLOW_HEIGHT,
          opacity: layouts.HOME.LIKES_BUTTON_GLOW_OPACITY,
          zIndex: layouts.HOME.LIKES_BUTTON_GLOW_ZINDEX,
        } as ViewStyle,

        text: {
          color: colors.BLACK,
          fontSize: fonts.size.home.likesButtonText,
          fontWeight: fonts.weight.light,
          marginTop: layouts.HOME.LIKES_BUTTON_TEXT_MARGIN_TOP,
        } as TextStyle,

        image: {
          width: layouts.HOME.LIKES_BUTTON_WIDTH,
          height: layouts.HOME.LIKES_BUTTON_HEIGHT,
        } as ImageStyle,
      },

      // ======================= SIGN IN BUTTON =======================
      signInButton: {
        activeOpacity: layouts.HOME.SIGNIN_BUTTON_ACTIVE_OPACITY,

        container: {
          alignItems: "center",
        } as ViewStyle,

        button: {
          width: layouts.HOME.SIGNIN_BUTTON_WIDTH,
          height: layouts.HOME.SIGNIN_BUTTON_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          zIndex: layouts.HOME.SIGNIN_BUTTON_ZINDEX,
        } as ViewStyle,

        text: {
          color: colors.BLACK,
          fontSize: fonts.size.home.signInButtonText,
          fontWeight: fonts.weight.light,
          marginTop: layouts.HOME.SIGNIN_BUTTON_TEXT_MARGIN_TOP,
        } as TextStyle,

        image: {
          width: layouts.HOME.SIGNIN_BUTTON_WIDTH,
          height: layouts.HOME.SIGNIN_BUTTON_HEIGHT,
        } as ImageStyle,
      },

      // ======================= SEARCH BAR =======================
      searchBar: {
        container: {
          position: "relative",
          width: layouts.HOME.WIDTH,
          alignSelf: "center",
          justifyContent: "center",
          marginBottom: layouts.HOME.SEARCH_SECTION_MARGIN_BOTTOM,
        } as ViewStyle,

        input: {
          width: "100%",
          backgroundColor: colors.HOME.INPUT_BG,
          borderColor: colors.HOME.BORDER_NEUTRAL,
          borderRadius: layouts.HOME.INPUT_RADIUS,
          borderWidth: layouts.BORDER_WIDTH,
          color: colors.LUXURY_BLACK,
          fontFamily: fonts.family.secondary,
          fontSize: fonts.size.home.searchInput,
          paddingLeft: layouts.HOME.INPUT_PADDING_LEFT,
          paddingRight: layouts.HOME.INPUT_PADDING_RIGHT,
          paddingVertical: layouts.HOME.INPUT_PADDING_VERTICAL,
          shadowColor: colors.BLACK,
          shadowOffset: {
            width: layouts.HOME.INPUT_SHADOW_OFFSET_WIDTH,
            height: layouts.HOME.INPUT_SHADOW_OFFSET_HEIGHT,
          },
          shadowOpacity: layouts.HOME.INPUT_SHADOW_OPACITY,
          shadowRadius: layouts.HOME.INPUT_SHADOW_RADIUS,
          elevation: layouts.HOME.INPUT_ELEVATION,
        } as TextStyle,

        inputProps: {
          autoCapitalize: "none",
          autoCorrect: false,
          returnKeyType: "search",
          scrollEnabled: true,
          textAlignVertical: "top",
        } as TextInputProps,

        button: {
          position: "absolute",
          top: layouts.HOME.SEARCH_BUTTON_TOP,
          right: layouts.HOME.SEARCH_BUTTON_RIGHT,
          width: layouts.HOME.SEARCH_BUTTON_SIZE,
          height: layouts.HOME.SEARCH_BUTTON_SIZE,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.HOME.SEARCH_BUTTON_BG,
          borderColor: colors.HOME.SEARCH_BUTTON_BORDER,
          borderRadius: layouts.HOME.INPUT_RADIUS,
          borderWidth: layouts.HOME.SEARCH_BUTTON_BORDER_WIDTH,
          shadowColor: colors.ROSE_GOLD,
          shadowOffset: {
            width: layouts.HOME.SEARCH_BUTTON_SHADOW_OFFSET_WIDTH,
            height: layouts.HOME.SEARCH_BUTTON_SHADOW_OFFSET_HEIGHT,
          },
          shadowOpacity: layouts.HOME.SEARCH_BUTTON_SHADOW_OPACITY,
          shadowRadius: layouts.HOME.SEARCH_BUTTON_SHADOW_RADIUS,
          elevation: layouts.HOME.SEARCH_BUTTON_ELEVATION,
        } as ViewStyle,

        pressed: {
          transform: [{ scale: layouts.HOME.PRESSED_SCALE }],
          opacity: layouts.HOME.PRESSED_OPACITY,
        } as ViewStyle,

        icon: {
          width: layouts.HOME.SEARCH_ICON_SIZE,
          height: layouts.HOME.SEARCH_ICON_SIZE,
          marginLeft: layouts.HOME.SEARCH_ICON_MARGIN_LEFT,
          marginTop: layouts.HOME.SEARCH_ICON_MARGIN_TOP,
          tintColor: colors.WHITE,
        } as ImageStyle,
      },

      // ======================= POPULAR QUERIES =======================
      popularQueries: {
        container: {
          width: "100%",
          alignSelf: "center",
          maxWidth: layouts.HOME.EXAMPLES_MAX_WIDTH,
        } as ViewStyle,

        label: {
          color: colors.LUXURY_BLACK,
          fontFamily: fonts.family.secondary,
          fontSize: fonts.size.home.exampleLabel,
          letterSpacing: layouts.LETTER_SPACING_CAPS,
          marginBottom: layouts.HOME.EXAMPLES_LABEL_MARGIN_BOTTOM,
          textAlign: "center",
        } as TextStyle,

        list: {
          gap: layouts.HOME.EXAMPLES_GAP,
        } as ViewStyle,

        item: {
          backgroundColor: colors.HOME.EXAMPLE_CARD_BG,
          borderColor: colors.HOME.BORDER_NEUTRAL,
          borderRadius: layouts.HOME.EXAMPLE_CARD_RADIUS,
          borderWidth: layouts.BORDER_WIDTH,
          paddingHorizontal: layouts.HOME.EXAMPLE_CARD_PADDING_HORIZONTAL,
          paddingVertical: layouts.HOME.EXAMPLE_CARD_PADDING_VERTICAL,
        } as ViewStyle,

        itemPressed: {
          backgroundColor: colors.HOME.EXAMPLE_PRESSED_BG,
          borderColor: colors.HOME.EXAMPLE_PRESSED_BORDER,
        } as ViewStyle,

        itemText: {
          color: colors.LUXURY_BLACK,
          fontFamily: fonts.family.secondary,
          fontSize: fonts.size.home.exampleText,
          fontWeight: fonts.weight.regular,
          textAlign: "center",
        } as TextStyle,
      },

      // ======================= CAROUSEL =======================
      carousel: {
        speed: layouts.HOME.CAROUSEL_SPEED,

        container: {
          height: layouts.HOME.CAROUSEL_WRAP_HEIGHT,
          marginTop: layouts.HOME.CAROUSEL_MARGIN_TOP,
          paddingBottom: layouts.HOME.CAROUSEL_PADDING_BOTTOM,
        } as ViewStyle,

        track: {
          flexDirection: "row",
          alignItems: "center",
        } as ViewStyle,

        card: {
          width: layouts.HOME.CAROUSEL_CARD_WIDTH,
          marginRight: layouts.HOME.CAROUSEL_GAP,
          borderRadius: layouts.HOME.CAROUSEL_CARD_BORDER_RADIUS,
          borderWidth: layouts.BORDER_WIDTH,
          overflow: "hidden",
          backgroundColor: colors.WHITE,

          image: {
            width: "100%",
            height: layouts.HOME.CAROUSEL_CARD_IMAGE_HEIGHT,
          } as ImageStyle,
        } as ViewStyle & {
          width: number;
          marginRight: number;
          image: ImageStyle;
        },
      },
    }),
    [layouts, fonts]
  );

  return styles;
}
