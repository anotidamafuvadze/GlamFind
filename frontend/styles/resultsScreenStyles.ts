
import { useMemo } from "react";
import {
  ImageStyle,
  Platform,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

// Constants
import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

/**
 * useResultsStyles hook
 * - Defines Results screen styles
 */

export default function useResultsStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  const styles = useMemo(
    () => ({
      // ======================= FLEX LAYOUTS =======================
      flex: {
        flex: layouts.ONE,
      } as ViewStyle,

      safe: {
        flex: layouts.ONE,
      } as ViewStyle,

      // ======================= BACKGROUND =======================
      background: {
        position: "absolute",
        top: layouts.ZERO,
        right: layouts.ZERO,
        bottom: layouts.ZERO,
        left: layouts.ZERO,
      } as ViewStyle,

      // ======================= HEADER =======================
      header: {
        container: {
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.RESULTS.GAP_SMALL,
          paddingHorizontal: layouts.RESULTS.HEADER_PADDING_HORIZONTAL,
          paddingVertical: layouts.RESULTS.HEADER_PADDING_VERTICAL,
          backgroundColor: colors.RESULTS.HEADER_BG,
          borderBottomWidth: layouts.BORDER_WIDTH,
          borderBottomColor: colors.RESULTS.HEADER_BORDER,
        } as ViewStyle,

        title: {
          flex: layouts.ONE,
          top: layouts.RESULTS.HEADER_TITLE_TOP,
          color: colors.RESULTS.TITLE,
          fontFamily: fonts.family.primary,
          fontSize: fonts.size.results.title,
          fontWeight: fonts.weight.normal,
        } as TextStyle,

        subtitle: {
          marginTop: layouts.RESULTS.SUBTITLE_MARGIN_TOP,
          color: colors.RESULTS.TITLE,
          fontFamily: fonts.family.secondary,
          fontSize: fonts.size.results.subtitle,
          letterSpacing: layouts.RESULTS.SUBTITLE_LETTER_SPACING,
          textTransform: "uppercase",
        } as TextStyle,
      },

      // ======================= HEADER BUTTONS =======================
      backButton: {
        button: {
          top: layouts.RESULTS.BACK_BUTTON_TOP,
          width: layouts.RESULTS.BACK_BUTTON_SIZE,
          height: layouts.RESULTS.BACK_BUTTON_SIZE,
          borderRadius: layouts.RESULTS.BACK_BUTTON_BORDER_RADIUS,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.RESULTS.BACK_BTN_BG,
          borderWidth: layouts.RESULTS.BACK_BUTTON_BORDER_WIDTH,
          borderColor: colors.RESULTS.BACK_BTN_BORDER,
        } as ViewStyle,

        pressed: {
          opacity: layouts.RESULTS.BACK_BUTTON_PRESSED_OPACITY,
        } as ViewStyle,

        icon: {
          width: layouts.RESULTS.BACK_BUTTON_SIZE,
          height: layouts.RESULTS.BACK_BUTTON_SIZE,
        } as ImageStyle,
      },

      // ======================= PRODUCTS LIST =======================
      products: {
        listContent: {
          paddingHorizontal: layouts.RESULTS.LIST_PADDING_HORIZONTAL,
          paddingTop: layouts.RESULTS.LIST_PADDING_TOP,
          paddingBottom: layouts.ZERO,
        } as ViewStyle,

        label: {
          color: colors.RESULTS.TITLE,
          fontFamily: fonts.family.secondary,
          fontSize: fonts.size.results.rationale,
          letterSpacing: layouts.LETTER_SPACING_CAPS,
          marginBottom: layouts.RESULTS.LABEL_MARGIN_BOTTOM,
          textTransform: "uppercase",
        } as TextStyle,

        row: {
          marginBottom: layouts.RESULTS.ROW_MARGIN_BOTTOM,
        } as ViewStyle,

        explanation: {
          card: {
            flex: layouts.ONE,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: layouts.RESULTS.GAP_SMALL,
            marginBottom: layouts.RESULTS.EXPLANATION_CARD_MARGIN_BOTTOM,
            padding: layouts.RESULTS.EXPLANATION_CARD_PADDING,
            paddingBottom: layouts.RESULTS.EXPLANATION_CARD_PADDING_BOTTOM,
            backgroundColor: colors.RESULTS.CARD_BG,
            borderRadius: layouts.RESULTS.EXPLANATION_CARD_BORDER_RADIUS,
            borderWidth: layouts.RESULTS.CARD_BORDER_WIDTH,
            borderColor: colors.RESULTS.CARD_BORDER,
            shadowColor: colors.BLACK,
            shadowOffset: { width: layouts.ZERO, height: layouts.RESULTS.EXPLANATION_CARD_SHADOW_OFFSET_HEIGHT },
            shadowOpacity: layouts.RESULTS.EXPLANATION_CARD_SHADOW_OPACITY,
            shadowRadius: layouts.RESULTS.EXPLANATION_CARD_SHADOW_RADIUS,
            elevation: layouts.RESULTS.EXPLANATION_CARD_ELEVATION,
          } as ViewStyle,

          aiBadge: {
            width: layouts.RESULTS.AI_BADGE_SIZE,
            height: layouts.RESULTS.AI_BADGE_SIZE,
            borderRadius: layouts.ROUNDED_MAX,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.DUSTY_ROSE,
          } as ViewStyle,

          aiBadgeText: {
            color: colors.WHITE,
            fontSize: fonts.size.results.aiBadgeText,
            fontWeight: fonts.weight.bold,
            letterSpacing: layouts.RESULTS.AI_BADGE_LETTER_SPACING,
          } as TextStyle,

          textWrapper: {
            flex: layouts.ONE,
          } as ViewStyle,

          title: {
            marginBottom: layouts.RESULTS.EXPLANATION_TITLE_MARGIN_BOTTOM,
            color: colors.RESULTS.TITLE,
            fontFamily: fonts.family.secondary,
            fontSize: fonts.size.results.explanationTitle,
            fontWeight: fonts.weight.semiBold,
          } as TextStyle,

          body: {
            color: colors.SOFT_GREY,
            fontFamily: fonts.family.secondary,
            fontSize: fonts.size.results.explanationBody,
            lineHeight: layouts.RESULTS.EXPLANATION_BODY_LINE_HEIGHT,
          } as TextStyle,
        },
      },

      // ======================= PRODUCT CARD =======================
      productCard: {
        card: {
          backgroundColor: colors.WHITE,
          borderRadius: layouts.RESULTS.CARD_BORDER_RADIUS,
          overflow: "hidden",
          borderWidth: layouts.RESULTS.CARD_BORDER_WIDTH,
          borderColor: colors.RESULTS_EXTRA.CARD_BORDER_LIGHT,
          shadowColor: colors.BLACK,
          shadowOffset: { width: layouts.ZERO, height: layouts.RESULTS.CARD_SHADOW_OFFSET_HEIGHT },
          shadowOpacity: layouts.RESULTS.CARD_SHADOW_OPACITY,
          shadowRadius: layouts.RESULTS.CARD_SHADOW_RADIUS,
          elevation: layouts.RESULTS.CARD_ELEVATION,
        } as ViewStyle,

        pressed: {
          transform: [{ scale: layouts.RESULTS.CARD_PRESSED_SCALE }],
          opacity: layouts.RESULTS.CARD_PRESSED_OPACITY,
        } as ViewStyle,

        imageWrap: {
          width: "100%",
          aspectRatio: layouts.RESULTS.IMAGE_WRAP_ASPECT_RATIO,
          backgroundColor: colors.RESULTS_EXTRA.IMAGE_BG,
        } as ViewStyle,

        image: {
          width: "100%",
          height: "100%",
        } as ImageStyle,

        content: {
          paddingHorizontal: layouts.RESULTS.CONTENT_PADDING_HORIZONTAL,
          paddingVertical: layouts.RESULTS.CONTENT_PADDING_VERTICAL,
        } as ViewStyle,

        brand: {
          marginBottom: layouts.RESULTS.BRAND_MARGIN_BOTTOM,
          color: colors.SOFT_GREY,
          fontSize: fonts.size.results.brand,
          letterSpacing: layouts.LETTER_SPACING_CAPS,
          textTransform: "uppercase",
        } as TextStyle,

        name: {
          marginBottom: layouts.RESULTS.NAME_MARGIN_BOTTOM,
          color: colors.LUXURY_BLACK,
          fontSize: fonts.size.results.name,
          fontWeight: fonts.weight.semiBold,
        } as TextStyle,

        rationale: {
          color: colors.SOFT_GREY,
          fontSize: fonts.size.results.rationale,
          lineHeight: layouts.RESULTS.RATIONALE_LINE_HEIGHT,
        } as TextStyle,

        actionsRow: {
          flexDirection: "row",
          alignItems: "center",
          marginTop: layouts.RESULTS.ACTIONS_ROW_MARGIN_TOP,
        } as ViewStyle,

        actionButton: {
          button: {
            width: layouts.RESULTS.ACTION_BUTTON_SIZE,
            height: layouts.RESULTS.ACTION_BUTTON_SIZE,
            borderRadius: layouts.RESULTS.ACTION_BUTTON_BORDER_RADIUS,
            alignItems: "center",
            justifyContent: "center",
            marginRight: layouts.RESULTS.ACTION_BUTTON_MARGIN_RIGHT,
            backgroundColor: colors.RESULTS_EXTRA.ACTION_BUTTON_BG,
            borderWidth: layouts.RESULTS.ACTION_BUTTON_BORDER_WIDTH,
            borderColor: colors.RESULTS_EXTRA.ACTION_BUTTON_BORDER,
          } as ViewStyle,

          selected: {
            opacity: layouts.RESULTS.ACTION_BUTTON_SELECTED_OPACITY,
            backgroundColor: colors.DUSTY_ROSE,
            borderColor: colors.RESULTS_EXTRA.ACTION_BUTTON_BORDER_SELECTED,
          } as ViewStyle,

          text: {
            color: colors.LUXURY_BLACK,
          } as TextStyle,

          selectedText: {
            color: colors.WHITE,
          } as TextStyle,
        },
      },

      // ======================= FOOTER SEARCH BAR =======================
      searchBar: {
        container: {
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.RESULTS.GAP_TINY,
          paddingHorizontal: layouts.RESULTS.SEARCHBAR_PADDING_HORIZONTAL,
          paddingTop: layouts.RESULTS.SEARCHBAR_PADDING_TOP,
          paddingBottom:
            Platform.OS === "ios"
              ? layouts.RESULTS.SEARCHBAR_PADDING_BOTTOM_IOS
              : layouts.RESULTS.SEARCHBAR_PADDING_BOTTOM_ANDROID,
          backgroundColor: colors.RESULTS.HEADER_BG,
          borderTopWidth: layouts.BORDER_WIDTH,
          borderTopColor: colors.RESULTS.FOOTER_BORDER,
        } as ViewStyle,

        input: {
          flex: layouts.ONE,
          paddingVertical: layouts.RESULTS.INPUT_PADDING_VERTICAL,
          paddingHorizontal: layouts.RESULTS.INPUT_PADDING_HORIZONTAL,
          borderRadius: layouts.RESULTS.INPUT_BORDER_RADIUS,
          backgroundColor: colors.RESULTS.INPUT_BG,
          borderWidth: layouts.BORDER_WIDTH,
          borderColor: colors.RESULTS.INPUT_BORDER,
          color: colors.RESULTS.TITLE,
          fontFamily: fonts.family.secondary,
          fontSize: fonts.size.results.searchInput,
        } as TextStyle,

        inputProps: {
          autoCapitalize: "none",
          autoCorrect: false,
          returnKeyType: "search",
          scrollEnabled: true,
          textAlignVertical: "top",
        } as TextInputProps,

        button: {
          width: layouts.RESULTS.SEARCH_BUTTON_SIZE,
          height: layouts.RESULTS.SEARCH_BUTTON_SIZE,
          borderRadius: layouts.RESULTS.ACTION_BUTTON_BORDER_RADIUS,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.DUSTY_ROSE,
          shadowColor: colors.DUSTY_ROSE,
          shadowOffset: { width: layouts.ZERO, height: layouts.RESULTS.SEARCH_BUTTON_SHADOW_OFFSET_HEIGHT },
          shadowOpacity: layouts.RESULTS.SEARCH_BUTTON_SHADOW_OPACITY,
          shadowRadius: layouts.RESULTS.SEARCH_BUTTON_SHADOW_RADIUS,
          elevation: layouts.RESULTS.SEARCH_BUTTON_ELEVATION,
        } as ViewStyle,

        icon: {
          width: layouts.RESULTS.SEARCH_BUTTON_ICON_SIZE,
          height: layouts.RESULTS.SEARCH_BUTTON_ICON_SIZE,
          top: layouts.RESULTS.SEARCH_BUTTON_ICON_TOP,
          left: layouts.RESULTS.SEARCH_BUTTON_ICON_LEFT,
          tintColor: colors.WHITE,
        } as ImageStyle,

        pressed: {
          transform: [{ scale: layouts.RESULTS.PRESSED_SCALE }],
          opacity: layouts.RESULTS.PRESSED_OPACITY,
        } as ViewStyle,
      },
    }),
    [layouts, fonts]
  );

  return styles;
}
