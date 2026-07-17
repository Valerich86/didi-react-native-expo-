import { Platform, StyleSheet } from "react-native";

export const theme = {
  light: "#ffffff",
  dark: "#0D0D0D",
  base: "#9F00F2",
  danger: "#F21105",
  accept: "#5305F2",
  neutral: "#eae4ed",
  neutral2: "#fff7fc",
};

export const fontSizes = {
  default: 18,
  min: 14,
  max: 24,
};

export const offsetX = 16;

export const inputHeight = 50;

export const globalStyles = StyleSheet.create({
  screen: {
    color: theme.dark,
    backgroundColor: theme.light,
    rowGap: 30,
    minHeight: "100%",
    paddingHorizontal: offsetX,
    paddingBottom: 80,
    paddingTop: 16,
  },
  form: { rowGap: 15 },
  card: {
    backgroundColor: theme.light,
    padding: 16,
    borderRadius: 12,
  },
  label: { marginBottom: 5, fontSize: fontSizes.min },
  input: {
    width: "100%",
    height: inputHeight,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: theme.neutral2,
    fontSize: fontSizes.default,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
    }),
  },
  shadow: {
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
    }),
  },
  error: {
    color: theme.danger,
    fontSize: fontSizes.min,
  },
  noInfo: {
    fontSize: fontSizes.default,
    textAlign: "center",
    marginTop: 100,
  },
  listContainer: {
    paddingVertical: 30,
    paddingHorizontal: 3,
    rowGap: 40,
  },
  separator: {
    borderTopWidth: 2,
    borderTopColor: theme.base,
  },
});
