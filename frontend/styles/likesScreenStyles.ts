import { useMemo } from "react";
import { ViewStyle, TextStyle, ImageStyle } from "react-native";

import useLayouts from "../constants/layouts";
import colors from "../constants/colors";
import useFonts from "../constants/fonts";

/**
 * useLikesStyles hook
 * - Defines Likes screen styles
 */
export default function useLikesStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  const styles = useMemo(
    () => ({
      // ----------------------- BACKGROUND -----------------------
      background: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      } as ViewStyle,

      // ----------------------- LOADING STATES -----------------------
      loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.LIKES_SCREEN.BACKGROUND,
      } as ViewStyle,

      // ----------------------- AUTHENTICATION STATES -----------------------
      notLoggedInContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: layouts.LIKES_SCREEN.PADDING_HORIZONTAL,
      } as ViewStyle,

      notLoggedInText: {
        fontSize: fonts.size.likesScreen.subtitle,
        color: colors.SOFT_GREY,
        textAlign: "center",
      } as TextStyle,

      // ----------------------- HEADER -----------------------
      headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.LIKES_SCREEN.HEADER_BG,
        borderBottomWidth: 1,
        borderBottomColor: colors.LIKES_SCREEN.HEADER_BORDER,
        paddingVertical: layouts.LIKES_SCREEN.HEADER_PADDING_VERTICAL,
      } as ViewStyle,

      headerTitle: {
        fontSize: fonts.size.likesScreen.title,
        fontFamily: fonts.family.primary,
        fontWeight: fonts.weight.light,
        textAlign: "center",
        color: colors.LIKES_SCREEN.TITLE,
        top: layouts.LIKES_SCREEN.HEADER_TITLE_TOP,
      } as TextStyle,

      // ----------------------- BACK BUTTON -----------------------
      backButton: {
        position: "absolute",
        left: layouts.LIKES_SCREEN.BACK_BUTTON_LEFT,
        width: layouts.LIKES_SCREEN.BACK_BUTTON_SIZE,
        height: layouts.LIKES_SCREEN.BACK_BUTTON_SIZE,
        borderRadius: layouts.LIKES_SCREEN.BACK_BUTTON_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.LIKES_SCREEN.BACK_BTN_BG,
        borderWidth: layouts.LIKES_SCREEN.BACK_BUTTON_BORDER_WIDTH,
        borderColor: colors.LIKES_SCREEN.BACK_BTN_BORDER,
        marginTop: layouts.LIKES_SCREEN.BACK_BUTTON_MARGIN_TOP,
      } as ViewStyle,

      backButtonPressed: {
        opacity: layouts.LIKES_SCREEN.ACTION_BUTTON_PRESSED_OPACITY,
      } as ViewStyle,

      backButtonIcon: {
        width: layouts.LIKES_SCREEN.BACK_BUTTON_ICON_SIZE,
        height: layouts.LIKES_SCREEN.BACK_BUTTON_ICON_SIZE,
      } as ImageStyle,

      // ----------------------- EMPTY STATE -----------------------
      emptyStateContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: layouts.LIKES_SCREEN.PADDING_HORIZONTAL,
      } as ViewStyle,

      emptyStateText: {
        fontFamily: fonts.family.primary,
        fontWeight: fonts.weight.light,
        fontSize: fonts.size.likesScreen.title,
        color: colors.BLACK,
        textAlign: "center",
      } as TextStyle,

      // ----------------------- LIST LAYOUT -----------------------
      listContent: {
        paddingHorizontal: layouts.LIKES_SCREEN.LIST_PADDING_HORIZONTAL,
        paddingTop: layouts.LIKES_SCREEN.LIST_PADDING_TOP,
        paddingBottom: layouts.LIKES_SCREEN.LIST_PADDING_BOTTOM,
      } as ViewStyle,

      // ----------------------- PRODUCT CARD -----------------------
      productCard: {
        backgroundColor: colors.LIKES_SCREEN.CARD_BG,
        borderRadius: layouts.LIKES_SCREEN.CARD_BORDER_RADIUS,
        overflow: "hidden",
        borderWidth: layouts.LIKES_SCREEN.CARD_BORDER_WIDTH,
        borderColor: colors.LIKES_SCREEN.CARD_BORDER,
        shadowColor: colors.BLACK,
        shadowOffset: layouts.LIKES_SCREEN.CARD_SHADOW_OFFSET,
        shadowOpacity: layouts.LIKES_SCREEN.CARD_SHADOW_OPACITY,
        shadowRadius: layouts.LIKES_SCREEN.CARD_SHADOW_RADIUS,
        elevation: layouts.LIKES_SCREEN.CARD_ELEVATION,
      } as ViewStyle,

      productCardPressed: {
        transform: [{ scale: layouts.LIKES_SCREEN.CARD_PRESSED_SCALE }],
        opacity: layouts.LIKES_SCREEN.CARD_PRESSED_OPACITY,
      } as ViewStyle,

      // ----------------------- PRODUCT IMAGERY -----------------------
      productImageWrap: {
        width: "100%",
        aspectRatio: layouts.LIKES_SCREEN.IMAGE_ASPECT_RATIO,
        backgroundColor: colors.LIKES_SCREEN.IMAGE_BG,
      } as ViewStyle,

      productImage: {
        width: "100%",
        height: "100%",
      } as ImageStyle,

      // ----------------------- PRODUCT CONTENT -----------------------
      productContent: {
        paddingHorizontal: layouts.LIKES_SCREEN.CONTENT_PADDING_HORIZONTAL,
        paddingVertical: layouts.LIKES_SCREEN.CONTENT_PADDING_VERTICAL,
      } as ViewStyle,

      productBrand: {
        marginBottom: layouts.LIKES_SCREEN.BRAND_MARGIN_BOTTOM,
        color: colors.SOFT_GREY,
        fontSize: fonts.size.likesScreen.brand,
        letterSpacing: layouts.LIKES_SCREEN.BRAND_LETTER_SPACING,
        textTransform: "uppercase",
      } as TextStyle,

      productName: {
        marginBottom: layouts.LIKES_SCREEN.NAME_MARGIN_BOTTOM,
        color: colors.LUXURY_BLACK,
        fontSize: fonts.size.likesScreen.name,
        fontWeight: fonts.weight.semiBold,
      } as TextStyle,

      productRationale: {
        color: colors.SOFT_GREY,
        fontSize: fonts.size.likesScreen.rationale,
        lineHeight: layouts.LIKES_SCREEN.RATIONALE_LINE_HEIGHT,
      } as TextStyle,

      // ----------------------- ACTION BUTTONS -----------------------
      actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: layouts.LIKES_SCREEN.ACTIONS_ROW_MARGIN_TOP,
      } as ViewStyle,

      actionButton: {
        width: layouts.LIKES_SCREEN.ACTION_BUTTON_SIZE,
        height: layouts.LIKES_SCREEN.ACTION_BUTTON_SIZE,
        borderRadius: layouts.LIKES_SCREEN.ACTION_BUTTON_RADIUS,
        alignItems: "center",
        justifyContent: "center",
        marginRight: layouts.LIKES_SCREEN.ACTION_BUTTON_MARGIN_RIGHT,
        backgroundColor: colors.LIKES_SCREEN.ACTION_BUTTON_BG,
        borderWidth: layouts.LIKES_SCREEN.ACTION_BUTTON_BORDER_WIDTH,
        borderColor: colors.LIKES_SCREEN.ACTION_BUTTON_BORDER,
      } as ViewStyle,

      actionButtonSelected: {
        opacity: layouts.LIKES_SCREEN.ACTION_BUTTON_PRESSED_OPACITY,
        backgroundColor: colors.LIKES_SCREEN.ACTION_BUTTON_BORDER_SELECTED,
        borderColor: colors.LIKES_SCREEN.ACTION_BUTTON_BORDER_SELECTED,
      } as ViewStyle,

      actionButtonText: {
        color: colors.LUXURY_BLACK,
      } as TextStyle,

      actionButtonSelectedText: {
        color: colors.WHITE,
      } as TextStyle,
    }),
    [layouts, fonts],
  );

  return styles;
}