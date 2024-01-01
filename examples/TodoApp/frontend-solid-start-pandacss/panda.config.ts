import { defineConfig, definePattern, defineUtility } from "@pandacss/dev";
import { colorTokens } from "./panda-css-config/colorTokens";
import { scrollable } from "./panda-css-config/scrollable";
import { flexRow } from "./panda-css-config/flexRow";
import { flexColumn } from "./panda-css-config/flexColumn";
import { bgLinGrad } from "./panda-css-config/bgLinGrad";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Set jsx framework
  jsxFramework: "solid",

  patterns: {
    extend: {
      scrollable,
      flexRow,
      flexColumn,
    },
  },

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: colorTokens.colors,
      },
    },
  },

  utilities: {
    extend: {
      bgLinGrad,
    },
  },

  // The output directory for your css system
  outdir: "panda-css",
});
