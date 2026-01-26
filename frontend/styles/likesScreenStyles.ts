import { useMemo } from 'react';
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import useLayouts from '../constants/layouts';
import colors from '../constants/colors';
import useFonts from '../constants/fonts';

/**
 * useLikesStyles hook
 * - Defines Likes screen styles
 */
export default function useLikesStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        background: {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        } as ViewStyle,
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.LIKES_SCREEN.BACKGROUND,
        } as ViewStyle,
        notLoggedInContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: layouts.likesScreen.paddingHorizontal,
        } as ViewStyle,
        notLoggedInText: {
          fontSize: fonts.size.likesScreen.subtitle,
          color: colors.SOFT_GREY,
          textAlign: 'center',
        } as TextStyle,
        headerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.LIKES_SCREEN.HEADER_BG,
          borderBottomWidth: 1,
          borderBottomColor: colors.LIKES_SCREEN.HEADER_BORDER,
          paddingVertical: layouts.likesScreen.headerPaddingVertical,
        } as ViewStyle,
        headerTitle: {
          fontSize: fonts.size.likesScreen.title,
          fontFamily: fonts.family.primary,
          fontWeight: fonts.weight.light,
          textAlign: 'center',
          color: colors.LIKES_SCREEN.TITLE,
          top: layouts.likesScreen.headerTitleTop,
        } as TextStyle,
        backButton: {
          position: 'absolute',
          left: layouts.likesScreen.backButtonLeft,
          width: layouts.likesScreen.backButtonSize,
          height: layouts.likesScreen.backButtonSize,
          borderRadius: layouts.likesScreen.backButtonRadius,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.LIKES_SCREEN.BACK_BTN_BG,
          borderWidth: layouts.likesScreen.backButtonBorderWidth,
          borderColor: colors.LIKES_SCREEN.BACK_BTN_BORDER,
          marginTop: layouts.likesScreen.backButtonMarginTop,
        } as ViewStyle,
        backButtonPressed: {
          opacity: layouts.likesScreen.actionButtonPressedOpacity,
        } as ViewStyle,
        backButtonIcon: {
          width: layouts.likesScreen.backButtonIconSize,
          height: layouts.likesScreen.backButtonIconSize,
        } as ImageStyle,
        emptyStateContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: layouts.likesScreen.paddingHorizontal,
        } as ViewStyle,
        emptyStateText: {
          fontFamily: fonts.family.primary,
          fontWeight: fonts.weight.light,
          fontSize: fonts.size.likesScreen.title,
          color: colors.BLACK,
          textAlign: 'center',
        } as TextStyle,
        listContent: {
          paddingHorizontal: layouts.likesScreen.listPaddingHorizontal,
          paddingTop: layouts.likesScreen.listPaddingTop,
          paddingBottom: layouts.likesScreen.listPaddingBottom,
        } as ViewStyle,
        productCard: {
          backgroundColor: colors.LIKES_SCREEN.CARD_BG,
          borderRadius: layouts.likesScreen.cardBorderRadius,
          overflow: 'hidden',
          borderWidth: layouts.likesScreen.cardBorderWidth,
          borderColor: colors.LIKES_SCREEN.CARD_BORDER,
          shadowColor: colors.BLACK,
          shadowOffset: layouts.likesScreen.cardShadowOffset,
          shadowOpacity: layouts.likesScreen.cardShadowOpacity,
          shadowRadius: layouts.likesScreen.cardShadowRadius,
          elevation: layouts.likesScreen.cardElevation,
        } as ViewStyle,
        productCardPressed: {
          transform: [{ scale: layouts.likesScreen.cardPressedScale }],
          opacity: layouts.likesScreen.cardPressedOpacity,
        } as ViewStyle,
        productImageWrap: {
          width: '100%',
          aspectRatio: layouts.likesScreen.imageAspectRatio,
          backgroundColor: colors.LIKES_SCREEN.IMAGE_BG,
        } as ViewStyle,
        productImage: {
          width: '100%',
          height: '100%',
        } as ImageStyle,
        productContent: {
          paddingHorizontal: layouts.likesScreen.contentPaddingHorizontal,
          paddingVertical: layouts.likesScreen.contentPaddingVertical,
        } as ViewStyle,
        productBrand: {
          marginBottom: layouts.likesScreen.brandMarginBottom,
          color: colors.SOFT_GREY,
          fontSize: fonts.size.likesScreen.brand,
          letterSpacing: layouts.likesScreen.brandLetterSpacing,
          textTransform: 'uppercase',
        } as TextStyle,
        productName: {
          marginBottom: layouts.likesScreen.nameMarginBottom,
          color: colors.LUXURY_BLACK,
          fontSize: fonts.size.likesScreen.name,
          fontWeight: fonts.weight.semiBold,
        } as TextStyle,
        productRationale: {
          color: colors.SOFT_GREY,
          fontSize: fonts.size.likesScreen.rationale,
          lineHeight: layouts.likesScreen.rationaleLineHeight,
        } as TextStyle,
        actionsRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: layouts.likesScreen.actionsRowMarginTop,
        } as ViewStyle,
        actionButton: {
          width: layouts.likesScreen.actionButtonSize,
          height: layouts.likesScreen.actionButtonSize,
          borderRadius: layouts.likesScreen.actionButtonRadius,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: layouts.likesScreen.actionButtonMarginRight,
          backgroundColor: colors.LIKES_SCREEN.ACTION_BUTTON_BG,
          borderWidth: layouts.likesScreen.actionButtonBorderWidth,
          borderColor: colors.LIKES_SCREEN.ACTION_BUTTON_BORDER,
        } as ViewStyle,
        actionButtonSelected: {
          opacity: layouts.likesScreen.actionButtonPressedOpacity,
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
    [layouts, fonts]
  );

  return styles;
}