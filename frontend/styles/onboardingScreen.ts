import { useMemo } from "react";
import { TextStyle, ViewStyle } from "react-native";

import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

export default function useOnboardingStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  // TODO replace with constants
  const styles = useMemo(
    () => ({
      container: {
        flex: 1,
      } as ViewStyle,

      background: {
        flex: 1,
      } as ViewStyle,

      content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: layouts.ONBOARDING.PADDING_HORIZONTAL,
      } as ViewStyle,

      glowTopRight: {
        width: layouts.ONBOARDING.GLOW_TOP_RIGHT_SIZE,
        height: layouts.ONBOARDING.GLOW_TOP_RIGHT_SIZE,
        top: layouts.ONBOARDING.GLOW_TOP_RIGHT_POSITION,
        right: layouts.ONBOARDING.GLOW_TOP_RIGHT_POSITION,
      } as ViewStyle,

      glowBottomLeft: {
        width: layouts.ONBOARDING.GLOW_BOTTOM_LEFT_SIZE,
        height: layouts.ONBOARDING.GLOW_BOTTOM_LEFT_SIZE,
        bottom: layouts.ONBOARDING.GLOW_BOTTOM_LEFT_POSITION,
        left: layouts.ONBOARDING.GLOW_BOTTOM_LEFT_POSITION,
      } as ViewStyle,

      appName: {
        fontSize: fonts.size.onboarding.title,
        fontFamily: fonts.family.primary,
        fontWeight: fonts.weight.light,
        color: colors.ONBOARDING.TITLE,
        letterSpacing: layouts.LETTER_SPACING_TIGHT,
        marginBottom: layouts.ONBOARDING.APP_NAME_MARGIN_BOTTOM,
        textAlign: "center",
      } as TextStyle,

      tagline: {
        fontSize: fonts.size.onboarding.tagline,
        fontFamily: fonts.family.secondary,
        color: colors.ONBOARDING.TAGLINE,
        letterSpacing: layouts.LETTER_SPACING_TAGLINE,
        marginBottom: layouts.ONBOARDING.TAGLINE_MARGIN_BOTTOM,
        textAlign: "center",
      } as TextStyle,

      // TODO: Replace with constants
      buttonWrapper: {
        button: {
          borderRadius: 999,
          overflow: 'hidden',
          backgroundColor: 'rgba(250, 243, 224, 0.8)',
          paddingHorizontal: 20,
          paddingVertical: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#494643ff',
        } as ViewStyle,
        text: {
          fontSize: 24,
          fontWeight: '400',
          color: '#373431ff',
        } as TextStyle,
      },

      bottomTextWrapper: {
        position: "absolute",
        bottom: layouts.ONBOARDING.BOTTOM_TEXT_BOTTOM,
        alignSelf: "center",
      } as ViewStyle,

      bottomText: {
        fontSize: fonts.size.onboarding.bottomText,
        fontFamily: fonts.family.secondary,
        color: colors.ONBOARDING.BOTTOM_TEXT,
        letterSpacing: layouts.LETTER_SPACING_CAPS,
        opacity: layouts.ONBOARDING.BOTTOM_TEXT_OPACITY,
        textAlign: "center",
      } as TextStyle,


    }),
    [layouts, fonts]
  );

  return styles;
}
