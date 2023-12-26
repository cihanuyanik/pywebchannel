import { createTheme } from "@vanilla-extract/css";

export const [themeClass, theme] = createTheme({
  color: {
    primary: "#4d1d83",
    primaryLighter: "#74449d",
    primaryDarker: "#260548",

    secondary: "#0c0979",
    secondaryLighter: "#534ef2",
    secondaryDarker: "#06043c",

    tertiary: "#4e8fcd",
    tertiaryLighter: "#a6c7e6",
    tertiaryDarker: "#1f486e",

    text: "#ffffff",
    black: "#000000"
  }
});
