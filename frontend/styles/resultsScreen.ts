import { useMemo } from "react";
import { Platform, TextStyle, ViewStyle, ImageStyle } from "react-native";

import colors from "../constants/colors";
import useFonts from "../constants/fonts";
import useLayouts from "../constants/layouts";

export default function useResultsStyles() {
  const layouts = useLayouts();
  const fonts = useFonts();

  // TODO replace with constants
  const styles = useMemo(
    () => ({
      flex: {
        flex: 1,
      } as ViewStyle,

      safe: {
        flex: 1,
      } as ViewStyle,

      background: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      } as ViewStyle,

      // Header
      header: {
        paddingHorizontal: 24,
        paddingVertical: 46,
        borderBottomWidth: 1,
        borderBottomColor: colors.RESULTS.HEADER_BORDER,
        backgroundColor: colors.RESULTS.HEADER_BG,
      } as ViewStyle,

      headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      } as ViewStyle,

      backBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.RESULTS.BACK_BTN_BG,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.7,
        borderColor: colors.RESULTS.BACK_BTN_BORDER,
        top: 20,
      } as ViewStyle,

      headerTitleWrap: {
        flex: 1,
      } as ViewStyle,

      headerTitle: {
        color: colors.RESULTS.TITLE,
        fontSize: 28,
        fontWeight: "400",
        fontFamily: fonts.family.primary,
        top: 23,
      } as TextStyle,

      headerSubtitle: {
        marginTop: 2,
        color: colors.RESULTS.TITLE,
        fontSize: 12,
        letterSpacing: 1.2,
        textTransform: "uppercase",
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      // List
      listContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 0,
      } as ViewStyle,

      topBlock: {
        paddingBottom: 10,
      } as ViewStyle,

      // Explanation card
      explainCard: {
        backgroundColor: colors.RESULTS.CARD_BG,
        borderRadius: 24,
        padding: 18,
        borderWidth: 1,
        borderColor: colors.RESULTS.CARD_BORDER,
        shadowColor: colors.BLACK,
        shadowOpacity: 0.06,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 10 },
        elevation: 3,
        marginBottom: 16,
      } as ViewStyle,

      explainRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
      } as ViewStyle,

      aiBadge: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: colors.DUSTY_ROSE,
        alignItems: "center",
        justifyContent: "center",
      } as ViewStyle,

      aiBadgeText: {
        color: colors.WHITE,
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.6,
      } as TextStyle,

      explainTextWrap: {
        flex: 1,
      } as ViewStyle,

      explainTitle: {
        color: colors.RESULTS.TITLE,
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 6,
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      explainBody: {
        color: colors.SOFT_GREY,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      sectionLabel: {
        color: colors.RESULTS.TITLE,
        fontSize: 13,
        letterSpacing: 2,
        marginBottom: 10,
        textTransform: "uppercase",
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      productRow: {
        marginBottom: 14,
      } as ViewStyle,

      // Input bar
      inputBar: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === "ios" ? 18 : 12,
        borderTopWidth: 1,
        borderTopColor: colors.RESULTS.FOOTER_BORDER,
        backgroundColor: colors.RESULTS.HEADER_BG,
      } as ViewStyle,

      inputRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      } as ViewStyle,

      input: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 999,
        backgroundColor: colors.RESULTS.INPUT_BG,
        borderWidth: 1,
        borderColor: colors.RESULTS.INPUT_BORDER,
        color: colors.RESULTS.TITLE,
        fontSize: 18,
        fontFamily: fonts.family.secondary,
      } as TextStyle,

      sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: colors.DUSTY_ROSE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.DUSTY_ROSE,
        shadowOpacity: 0.22,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
      } as ViewStyle,

      // Icons
      icon: {
        width: 40,
        height: 40,
      } as ImageStyle,

      sendIcon: {
        width: 45,
        height: 45,
        top: 2,
        left: 1,
      } as ImageStyle,

      pressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.95,
      } as ViewStyle,

    }),
    [layouts, fonts]
  );

  return styles;
}
