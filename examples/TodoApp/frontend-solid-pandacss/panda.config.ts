import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
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

        gradients: {
          secondaryToBottom: {
            value: {
              type: "linear",
              placement: "to bottom",
              stops: [
                "token(colors.secondaryDarker)",
                "token(colors.secondaryLighter)",
              ],
            },
          },
          secondaryToLeft: {
            value: {
              type: "linear",
              placement: "to left",
              stops: [
                "token(colors.secondaryDarker)",
                "token(colors.secondaryLighter)",
              ],
            },
          },
          secondaryToRight: {
            value: {
              type: "linear",
              placement: "to right",
              stops: [
                "token(colors.secondaryDarker)",
                "token(colors.secondaryLighter)",
              ],
            },
          },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
