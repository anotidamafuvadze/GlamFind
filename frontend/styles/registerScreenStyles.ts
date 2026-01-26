import { useMemo } from "react";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

/**
 * useRegisterStyles hook
 * - Defines Register screen styles
 */
export default function useRegisterStyles() {
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
        paddingHorizontal: layouts.REGISTER.CONTENT_PADDING_HORIZONTAL,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,

      // ======================= BACK BUTTON =======================
      backButton: {
        position: "absolute",
        top: layouts.REGISTER.BACK_BUTTON_TOP,
        left: layouts.REGISTER.BACK_BUTTON_MARGIN_LEFT,
        width: layouts.REGISTER.BACK_BUTTON_SIZE,
        height: layouts.REGISTER.BACK_BUTTON_SIZE,
        backgroundColor: colors.REGISTER.BACK_BUTTON_BG,
        borderRadius: layouts.REGISTER.BACK_BUTTON_RADIUS,
        padding: layouts.REGISTER.BACK_BUTTON_PADDING,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: layouts.REGISTER.BACK_BUTTON_BORDER_WIDTH,
        borderColor: colors.REGISTER.BACK_BUTTON_BORDER,
      } as ViewStyle,
      backButtonPressed: {
        opacity: layouts.REGISTER.BACK_BUTTON_PRESSED_OPACITY,
      } as ViewStyle,
      backIcon: {
        width: layouts.REGISTER.BACK_ICON_WIDTH,
        height: layouts.REGISTER.BACK_ICON_HEIGHT,
        tintColor: colors.REGISTER.BACK_ICON_TINT,
      } as ImageStyle,

      // ======================= HEADER =======================
      headerBlock: {
        alignItems: "center",
        marginBottom: layouts.REGISTER.HEADER_MARGIN_BOTTOM,
      } as ViewStyle,
      title: {
        fontSize: fonts.size.register.title,
        fontWeight: fonts.weight.light,
        color: colors.REGISTER.TITLE,
        letterSpacing: layouts.LETTER_SPACING_TIGHT,
        marginBottom: layouts.REGISTER.APP_NAME_MARGIN_BOTTOM,
        textAlign: "center",
    
      } as TextStyle,
      subtitle: {
        fontSize: fonts.size.register.subtitle,
        fontFamily: fonts.family.secondary,
        color: colors.REGISTER.SUBTITLE,
        letterSpacing: layouts.LETTER_SPACING_TAGLINE,
      } as TextStyle,

      // ======================= CARD =======================
      card: {
        width: layouts.REGISTER.CARD_WIDTH,
        maxWidth: layouts.REGISTER.CARD_MAX_WIDTH,
        backgroundColor: colors.REGISTER.CARD_BG,
        borderRadius: layouts.REGISTER.CARD_RADIUS,
        padding: layouts.REGISTER.CARD_PADDING,
        borderWidth: layouts.BORDER_WIDTH,
      } as ViewStyle,
      cardTitle: {
        fontSize: fonts.size.register.cardTitle,
        fontWeight: fonts.weight.light,
        textAlign: "center",
        color: colors.REGISTER.CARD_TITLE,
      } as TextStyle,

      // ======================= SPACER =======================
      spacer: { height: layouts.REGISTER.SPACER_HEIGHT } as ViewStyle,

      // ======================= INPUT =======================
      input: {
        height: layouts.REGISTER.INPUT_HEIGHT,
        borderWidth: layouts.BORDER_WIDTH,
        borderColor: colors.REGISTER.INPUT_BORDER,
        borderRadius: layouts.REGISTER.INPUT_RADIUS,
        paddingHorizontal: layouts.REGISTER.INPUT_PADDING_HORIZONTAL,
        backgroundColor: colors.REGISTER.INPUT_BG,
        marginTop: layouts.REGISTER.INPUT_MARGIN_TOP,
        color: colors.REGISTER.INPUT_TEXT,
        alignContent: "center",
        justifyContent: "center",
        marginRight: layouts.REGISTER.MARGIN_RIGHT_LEFT, 
        marginLeft: layouts.REGISTER.MARGIN_RIGHT_LEFT,
      } as TextStyle,

      // ======================= ERROR =======================
      error: {
        marginTop: layouts.REGISTER.ERROR_MARGIN_TOP,
        color: colors.REGISTER.ERROR_TEXT,
        backgroundColor: colors.REGISTER.ERROR_BG,
        padding: layouts.REGISTER.ERROR_PADDING,
        borderRadius: layouts.REGISTER.ERROR_RADIUS,
        textAlign: "center",
      } as TextStyle,

      // ======================= BUTTON =======================
      button: {
        marginTop: layouts.REGISTER.BUTTON_MARGIN_TOP,
        backgroundColor: colors.REGISTER.BUTTON_BG,
        paddingVertical: layouts.REGISTER.BUTTON_PADDING_VERTICAL,
        borderRadius: layouts.REGISTER.BUTTON_RADIUS,
        borderWidth: layouts.BORDER_WIDTH,
        borderColor: colors.REGISTER.BUTTON_BORDER,
        maxWidth: layouts.REGISTER.BUTTON_MAX_WIDTH,
        paddingHorizontal: layouts.REGISTER.BUTTON_PADDING_HORIZONTAL,
        marginRight: layouts.REGISTER.MARGIN_RIGHT_LEFT,
        marginLeft: layouts.REGISTER.MARGIN_RIGHT_LEFT,
        alignItems: "center",
      } as ViewStyle,
      buttonText: {
        color: colors.REGISTER.BUTTON_TEXT,
        fontWeight: fonts.weight.light,
        fontSize: fonts.size.register.buttonText,
      } as TextStyle,

      // ======================= FOOTER =======================
      footerText: {
        marginTop: layouts.REGISTER.FOOTER_MARGIN_TOP,
        textAlign: "center",
        color: colors.REGISTER.FOOTER_TEXT,
      } as TextStyle,
      link: {
        color: colors.REGISTER.LINK,
        fontWeight: fonts.weight.semiBold,
      } as TextStyle,
    }),
    [layouts, fonts]
  );

  return styles;
}