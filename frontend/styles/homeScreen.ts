import { useMemo } from "react";
import { TextStyle, ViewStyle, ImageStyle } from "react-native";

import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

export default function useHomeStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  // TODO replace with constants
  const styles = useMemo(
    () => ({
      background: {
        flex: 1,
      } as ViewStyle,

      content: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: layouts.HOME.PADDING_HORIZONTAL,
        paddingTop: layouts.HOME.PADDING_TOP,
      } as ViewStyle,

      header: {
        paddingTop: layouts.HOME.HEADER_PADDING_TOP,
        paddingBottom: layouts.HOME.HEADER_PADDING_BOTTOM,
        alignItems: "center",
      } as ViewStyle,

      title: {
        textAlign: "center",
        color: colors.LUXURY_BLACK,
        fontSize: fonts.size.home.title,
        fontWeight: fonts.weight.light,
        lineHeight: fonts.size.home.lineHeight,
        fontFamily: fonts.family.primary,
      } as TextStyle,

      searchSection: {
        marginBottom: layouts.HOME.SEARCH_SECTION_MARGIN_BOTTOM,
      } as ViewStyle,

      searchRow: {
        position: "relative",
        width: layouts.HOME.WIDTH,
        alignSelf: "center",
        justifyContent: "center",
      } as ViewStyle,

      input: {
        width: "100%",
        paddingVertical: layouts.HOME.INPUT_PADDING_VERTICAL,
        paddingLeft: layouts.HOME.INPUT_PADDING_LEFT,
        paddingRight: layouts.HOME.INPUT_PADDING_RIGHT,
        borderRadius: layouts.HOME.INPUT_RADIUS,
        backgroundColor: colors.HOME.INPUT_BG,
        borderWidth: layouts.BORDER_WIDTH,
        borderColor: colors.HOME.BORDER_NEUTRAL,
        color: colors.LUXURY_BLACK,
        fontSize: fonts.size.home.searchInput,
        fontFamily: fonts.family.secondary,
        shadowColor: colors.BLACK,
        shadowOpacity: layouts.HOME.INPUT_SHADOW_OPACITY,
        shadowRadius: layouts.HOME.INPUT_SHADOW_RADIUS,
        shadowOffset: { 
          width: layouts.HOME.INPUT_SHADOW_OFFSET_WIDTH, 
          height: layouts.HOME.INPUT_SHADOW_OFFSET_HEIGHT },
        elevation: layouts.HOME.INPUT_ELEVATION,
      } as TextStyle,

      searchButton: {
        position: "absolute",
        right: layouts.HOME.SEARCH_BUTTON_RIGHT,
        top: layouts.HOME.SEARCH_BUTTON_TOP,
        width: layouts.HOME.SEARCH_BUTTON_SIZE,
        height: layouts.HOME.SEARCH_BUTTON_SIZE,
        borderRadius: layouts.HOME.INPUT_RADIUS,
        borderWidth: layouts.HOME.SEARCH_BUTTON_BORDER_WIDTH,
        borderColor: colors.HOME.SEARCH_BUTTON_BORDER,
        backgroundColor: colors.HOME.SEARCH_BUTTON_BG,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.ROSE_GOLD,
        shadowOpacity: layouts.HOME.SEARCH_BUTTON_SHADOW_OPACITY,
        shadowRadius: layouts.HOME.SEARCH_BUTTON_SHADOW_RADIUS,
        shadowOffset: { 
          width: layouts.HOME.SEARCH_BUTTON_SHADOW_OFFSET_WIDTH, 
          height: layouts.HOME.SEARCH_BUTTON_SHADOW_OFFSET_HEIGHT },
        elevation: layouts.HOME.SEARCH_BUTTON_ELEVATION,
      } as ViewStyle,

      pressed: {
        transform: [{ scale: layouts.HOME.PRESSED_SCALE }],
        opacity: layouts.HOME.PRESSED_OPACITY,
      } as ViewStyle,

      searchIcon: {
        width: layouts.HOME.SEARCH_ICON_SIZE,
        height: layouts.HOME.SEARCH_ICON_SIZE,
        marginTop: layouts.HOME.SEARCH_ICON_MARGIN_TOP,
        marginLeft: layouts.HOME.SEARCH_ICON_MARGIN_LEFT,
        tintColor: colors.WHITE,
      } as ImageStyle,

      examples: {
        width: "100%",
        alignSelf: "center",
        maxWidth: layouts.HOME.EXAMPLES_MAX_WIDTH,
      } as ViewStyle,

      examplesLabel: {
        color: colors.LUXURY_BLACK,
        fontSize: fonts.size.home.exampleLabel,
        letterSpacing: layouts.LETTER_SPACING_CAPS,
        marginBottom: layouts.HOME.EXAMPLES_LABEL_MARGIN_BOTTOM,
        textAlign: "center",
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      examplesList: {
        gap: layouts.HOME.EXAMPLES_GAP,
      } as ViewStyle,

      exampleCard: {
        paddingVertical: layouts.HOME.EXAMPLE_CARD_PADDING_VERTICAL,
        paddingHorizontal: layouts.HOME.EXAMPLE_CARD_PADDING_HORIZONTAL,
        borderRadius: layouts.HOME.EXAMPLE_CARD_RADIUS,
        backgroundColor: colors.HOME.EXAMPLE_CARD_BG,
        borderWidth: layouts.BORDER_WIDTH,
        borderColor: colors.HOME.BORDER_NEUTRAL,
      } as ViewStyle,

      examplePressed: {
        backgroundColor: colors.HOME.EXAMPLE_PRESSED_BG,
        borderColor: colors.HOME.EXAMPLE_PRESSED_BORDER,
      } as ViewStyle,

      exampleText: {
        color: colors.LUXURY_BLACK,
        fontSize: fonts.size.home.exampleText,
        textAlign: "center",
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      carouselWrap: {
        marginTop: layouts.HOME.CAROUSEL_MARGIN_TOP,
        paddingBottom: layouts.HOME.CAROUSEL_PADDING_BOTTOM,
        width: "100%",
        height: layouts.HOME.CAROUSEL_WRAP_HEIGHT,
      } as ViewStyle,

      carousel: {
        speed: layouts.HOME.CAROUSEL_SPEED,
        carouselContainer: {
          width: '100%',
        },
        carouselTrack: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        carouselCard: {
          width: layouts.HOME.CAROUSEL_CARD_WIDTH,
          marginRight: layouts.HOME.CAROUSEL_GAP,
          borderRadius: 18,
          borderWidth: 1,
          overflow: 'hidden',
          backgroundColor: '#fff',
          carouselImage: {
            width: '100%',
            height: 140,
          },
        },
       
      } as ViewStyle,

      glowTopLeft: {
        top: layouts.HOME.GLOW_TOPLEFT_TOP,
        left: layouts.HOME.GLOW_TOPLEFT_LEFT,
        width: layouts.HOME.GLOW_TOPLEFT_WIDTH,
        height: layouts.HOME.GLOW_TOPLEFT_HEIGHT,
      } as ViewStyle,

      glowBottomRight: {
        bottom: layouts.HOME.GLOW_BOTTOMRIGHT_BOTTOM,
        right: layouts.HOME.GLOW_BOTTOMRIGHT_RIGHT,
        width: layouts.HOME.GLOW_BOTTOMRIGHT_WIDTH,
        height: layouts.HOME.GLOW_BOTTOMRIGHT_HEIGHT,
      } as ViewStyle,


    }),
    [layouts, fonts]
  );

  return styles;
}
