import { useMemo } from "react";
import { TextStyle, ViewStyle } from "react-native";

// Constants
import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

/**
 * useWelcomeStyles hook
 * - Defines styles for the Welcome screen
 */

export default function useWelcomeStyles() {
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
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: layouts.WELCOME.PADDING_HORIZONTAL,
      } as ViewStyle,

      // ======================= GLOW ACCENTS =======================
      glowTopRight: {
        width: layouts.WELCOME.GLOW_TOP_RIGHT_SIZE,
        height: layouts.WELCOME.GLOW_TOP_RIGHT_SIZE,
        top: layouts.WELCOME.GLOW_TOP_RIGHT_POSITION,
        right: layouts.WELCOME.GLOW_TOP_RIGHT_POSITION,
        opacity: layouts.WELCOME.GLOW_OPACITY,
      } as ViewStyle,

      glowBottomLeft: {
        width: layouts.WELCOME.GLOW_BOTTOM_LEFT_SIZE,
        height: layouts.WELCOME.GLOW_BOTTOM_LEFT_SIZE,
        bottom: layouts.WELCOME.GLOW_BOTTOM_LEFT_POSITION,
        left: layouts.WELCOME.GLOW_BOTTOM_LEFT_POSITION,
        opacity: layouts.WELCOME.GLOW_OPACITY,
      } as ViewStyle,

      // ======================= PRIMARY TEXT =======================
      appName: {
        color: colors.WELCOME.TITLE,
        fontFamily: fonts.family.primary,
        fontSize: fonts.size.welcome.title,
        fontWeight: fonts.weight.light,
        letterSpacing: layouts.LETTER_SPACING_TIGHT,
        marginBottom: layouts.WELCOME.APP_NAME_MARGIN_BOTTOM,
        textAlign: "center",
      } as TextStyle,

      appTagline: {
        color: colors.WELCOME.TAGLINE,
        fontFamily: fonts.family.secondary,
        fontSize: fonts.size.welcome.tagline,
        letterSpacing: layouts.LETTER_SPACING_TAGLINE,
        marginBottom: layouts.WELCOME.TAGLINE_MARGIN_BOTTOM,
        textAlign: "center",
      } as TextStyle,

      // ======================= FOOTER TEXT =======================
      bottomTextWrapper: {
        position: "absolute",
        bottom: layouts.WELCOME.BOTTOM_TEXT_BOTTOM,
        alignSelf: "center",
      } as ViewStyle,

      bottomText: {
        color: colors.WELCOME.BOTTOM_TEXT,
        fontFamily: fonts.family.secondary,
        fontSize: fonts.size.welcome.bottomText,
        letterSpacing: layouts.LETTER_SPACING_CAPS,
        opacity: layouts.WELCOME.BOTTOM_TEXT_OPACITY,
        textAlign: "center",
      } as TextStyle,

      // ======================= PRIMARY ACTION =======================
      buttonWrapper: {
        button: {
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: layouts.WELCOME.BUTTON_PADDING_HORIZONTAL,
          paddingVertical: layouts.WELCOME.BUTTON_PADDING_VERTICAL,
          borderRadius: layouts.WELCOME.BUTTON_BORDER_RADIUS,
          overflow: "hidden",
          backgroundColor: colors.WELCOME.BUTTON_BG,
          borderWidth: layouts.WELCOME.BUTTON_BORDER_WIDTH,
          borderColor: colors.HOME.BORDER_NEUTRAL,
        } as ViewStyle,

        text: {
          color: colors.WELCOME.BUTTON_TITLE,
          fontSize: fonts.size.welcome.button,
          fontWeight: fonts.weight.normal,
        } as TextStyle,
      },
    }),
    [layouts, fonts]
  );

  return styles;
}
