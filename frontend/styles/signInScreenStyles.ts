import { useMemo } from "react";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

/**
 * useSignInStyles hook
 * - Defines Sign In screen styles
 */
export default function useSignInStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  const styles = useMemo(
    () => ({
      // ======================= BACKGROUND =======================
      bg: { flex: layouts.ONE } as ViewStyle,
      safe: { flex: layouts.ONE } as ViewStyle,
      flex: { flex: layouts.ONE } as ViewStyle,

      // ======================= CONTENT =======================
      content: {
        flex: layouts.ONE,
        paddingHorizontal: layouts.SIGNIN.CONTENT_PADDING_HORIZONTAL,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,

      // ======================= BACK BUTTON =======================
      backButton: {
        position: "absolute",
        top: layouts.SIGNIN.BACK_BUTTON_TOP,
        left: layouts.SIGNIN.BACK_BUTTON_MARGIN_LEFT,
        width: layouts.SIGNIN.BACK_BUTTON_SIZE,
        height: layouts.SIGNIN.BACK_BUTTON_SIZE,
        borderRadius: layouts.SIGNIN.BACK_BUTTON_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.SIGNIN.BACK_BUTTON_BG,
        borderWidth: layouts.RESULTS.BACK_BUTTON_BORDER_WIDTH,
        borderColor: colors.SIGNIN.BACK_BUTTON_BORDER,
      } as ViewStyle,
      backButtonPressed: {
        opacity: layouts.SIGNIN.BACK_BUTTON_PRESSED_OPACITY,
      } as ViewStyle,
      backIcon: {
        width: layouts.SIGNIN.BACK_ICON_WIDTH,
        height: layouts.SIGNIN.BACK_ICON_HEIGHT,
        tintColor: colors.SIGNIN.BACK_ICON_TINT,
      } as ImageStyle,

      // ======================= HEADER =======================
      headerBlock: {
        alignItems: "center",
        marginBottom: layouts.SIGNIN.HEADER_MARGIN_BOTTOM,
      } as ViewStyle,
      title: {
        fontSize: fonts.size.signIn.title,
        fontWeight: fonts.weight.light,
        fontFamily: fonts.family.primary,
        color: colors.SIGNIN.TITLE,
        letterSpacing: layouts.LETTER_SPACING_TIGHT,
        marginBottom: layouts.SIGNIN.APP_NAME_MARGIN_BOTTOM,
        textAlign: "center",
      } as TextStyle,
      subtitle: {
        fontSize: fonts.size.signIn.subtitle,
        fontFamily: fonts.family.secondary,
        color: colors.SIGNIN.SUBTITLE,
        letterSpacing: layouts.LETTER_SPACING_TAGLINE,
      } as TextStyle,

      // ======================= CARD =======================
      card: {
        width: layouts.SIGNIN.CARD_WIDTH,
        maxWidth: layouts.SIGNIN.CARD_MAX_WIDTH,
        backgroundColor: colors.SIGNIN.CARD_BG,
        borderRadius: layouts.SIGNIN.CARD_RADIUS,
        borderWidth: layouts.BORDER_WIDTH,
        padding: layouts.SIGNIN.CARD_PADDING,
      } as ViewStyle,
      cardTitle: {
        fontSize: fonts.size.signIn.cardTitle,
        fontWeight: fonts.weight.light,
        textAlign: "center",
        color: colors.SIGNIN.CARD_TITLE,
      } as TextStyle,

      // ======================= SPACER =======================
      spacer: { height: layouts.SIGNIN.SPACER_HEIGHT } as ViewStyle,

      // ======================= INPUT =======================
      input: {
        height: layouts.SIGNIN.INPUT_HEIGHT,
        borderWidth: layouts.BORDER_WIDTH,
        borderColor: colors.SIGNIN.INPUT_BORDER,
        borderRadius: layouts.SIGNIN.INPUT_RADIUS,
        paddingHorizontal: layouts.SIGNIN.INPUT_PADDING_HORIZONTAL,
        backgroundColor: colors.SIGNIN.INPUT_BG,
        marginTop: layouts.SIGNIN.INPUT_MARGIN_TOP,
        color: colors.SIGNIN.INPUT_TEXT,
        marginRight: 20,
        marginLeft: 20,
      } as TextStyle,

      // ======================= ERROR =======================
      error: {
        marginTop: layouts.SIGNIN.ERROR_MARGIN_TOP,
        color: colors.SIGNIN.ERROR_TEXT,
        backgroundColor: colors.SIGNIN.ERROR_BG,
        padding: layouts.SIGNIN.ERROR_PADDING,
        borderRadius: layouts.SIGNIN.ERROR_RADIUS,
        textAlign: "center",
      } as TextStyle,

      // ======================= BUTTON =======================
      button: {
        marginTop: layouts.SIGNIN.BUTTON_MARGIN_TOP,
        backgroundColor: colors.SIGNIN.BUTTON_BG,
        paddingHorizontal: layouts.SIGNIN.BUTTON_PADDING_HORIZONTAL,
        paddingVertical: layouts.SIGNIN.BUTTON_PADDING_VERTICAL,
        borderRadius: layouts.SIGNIN.BUTTON_RADIUS,
        alignItems: "center",
        borderWidth: layouts.BORDER_WIDTH,
        borderColor: colors.SIGNIN.BUTTON_BORDER,
        maxWidth: layouts.SIGNIN.BUTTON_MAX_WIDTH,
        alignSelf: "center",
      } as ViewStyle,
      buttonText: {
        fontSize: fonts.size.signIn.buttonText,
        fontWeight: fonts.weight.light,
        color: colors.SIGNIN.BUTTON_TEXT,
      } as TextStyle,

      // ======================= FOOTER =======================
      footerText: {
        marginTop: layouts.SIGNIN.FOOTER_MARGIN_TOP,
        textAlign: "center",
        color: colors.SIGNIN.FOOTER_TEXT,
      } as TextStyle,
      link: {
        color: colors.SIGNIN.LINK,
        fontWeight: fonts.weight.semiBold,
      } as TextStyle,
    }),
    [layouts, fonts]
  );

  return styles;
}