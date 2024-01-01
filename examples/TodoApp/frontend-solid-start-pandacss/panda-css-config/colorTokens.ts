import { defineTokens } from "@pandacss/dev";

export const colorTokens = defineTokens({
  colors: {
    primary: { value: "#4d1d83", description: "Primary color" },
    primaryLighter: {
      value: "#74449d",
      description: "Primary color lighter",
    },
    primaryDarker: {
      value: "#260548",
      description: "Primary color darker",
    },
    secondary: { value: "#0c0979", description: "Secondary color" },
    secondaryLighter: {
      value: "#534ef2",
      description: "Secondary color lighter",
    },
    secondaryDarker: {
      value: "#06043c",
      description: "Secondary color darker",
    },
    tertiary: { value: "#4e8fcd", description: "Tertiary color" },
    tertiaryLighter: {
      value: "#a6c7e6",
      description: "Tertiary color lighter",
    },
    tertiaryDarker: {
      value: "#1f486e",
      description: "Tertiary color darker",
    },
    text: { value: "#ffffff", description: "Text color" },
    black: { value: "#000000", description: "Black color" },
  },
});
