import {
  defineConfig,
  definePattern,
  defineTokens,
  defineUtility,
} from "@pandacss/dev";

const colorTokens = defineTokens({
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

const scrollable = definePattern({
  description: "A container that allows for scrolling",
  properties: {
    direction: { type: "enum", value: ["horizontal", "vertical"] },
    hideScrollbar: { type: "boolean" },
  },

  blocklist: ["overflow"],
  transform(props) {
    const { direction, hideScrollbar, ...rest } = props;
    return {
      overflow: "auto",
      height: direction === "horizontal" ? "100%" : "auto",
      width: direction === "vertical" ? "100%" : "auto",
      scrollbarWidth: hideScrollbar ? "none" : "auto",
      WebkitOverflowScrolling: "touch",
      "&::-webkit-scrollbar": {
        display: hideScrollbar ? "none" : "auto",
      },
      scrollbarGutter: "stable both-edges",
      ...rest,
    };
  },
});

const flexRow = definePattern({
  description: "A flex container that aligns items horizontally",
  properties: {
    reverse: { type: "boolean" },
    wrap: { type: "boolean" },
    align: {
      type: "enum",
      value: [
        "center",
        "start",
        "end",
        "flex-start",
        "flex-end",
        "self-start",
        "self-end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center",
        "between",
        "around",
        "stretch",
        "normal",
      ],
    },
    justify: {
      type: "enum",
      value: [
        "center",
        "start",
        "end",
        "left",
        "right",
        "normal",
        "between",
        "around",
        "evenly",
        "stretch",
        "safe center",
        "unsafe center",
      ],
    },
  },
  jsxName: "FlexRow",
  blocklist: ["display"],
  transform(props) {
    const { reverse, wrap, align, justify, ...rest } = props;
    return {
      display: "flex",
      flexDirection: reverse ? "row-reverse" : "row",
      flexWrap: wrap ? "wrap" : "nowrap",
      alignItems: align || "center",
      justifyContent: justify || "center",
      ...rest,
    };
  },
});

const flexColumn = definePattern({
  description: "A flex container that aligns items vertically",
  properties: {
    reverse: { type: "boolean" },
    wrap: { type: "boolean" },
    align: {
      type: "enum",
      value: [
        "center",
        "start",
        "end",
        "flex-start",
        "flex-end",
        "self-start",
        "self-end",
        "baseline",
        "first baseline",
        "last baseline",
        "safe center",
        "unsafe center",
        "between",
        "around",
        "stretch",
        "normal",
      ],
    },
    justify: {
      type: "enum",
      value: [
        "center",
        "start",
        "end",
        "left",
        "right",
        "normal",
        "between",
        "around",
        "evenly",
        "stretch",
        "safe center",
        "unsafe center",
      ],
    },
  },
  jsxName: "FlexColumn",

  blocklist: ["display"],
  transform(props) {
    const { reverse, wrap, align, justify, ...rest } = props;
    return {
      display: "flex",
      flexDirection: reverse ? "column-reverse" : "column",
      flexWrap: wrap ? "wrap" : "nowrap",
      alignItems: align || "center",
      justifyContent: justify || "center",
      ...rest,
    };
  },
});

const bgLinGrad = defineUtility({
  values: {
    type: "string",
  },

  transform: (value: string, { token }) => {
    let [dir, from, to] = value.split(" ");

    if (dir.indexOf("deg") === -1) {
      switch (dir) {
        case "tb":
          dir = "to bottom";
          break;
        case "tt":
          dir = "to top";
          break;
        case "tl":
          dir = "to left";
          break;
        case "tr":
          dir = "to right";
          break;
        default:
          dir = "to bottom";
          break;
      }
    }

    from = token(from) || token(`colors.${from}`) || from;
    to = token(to) || token(`colors.${to}`) || to;

    return {
      background: `linear-gradient(${dir}, ${from}, ${to})`,
    };
  },
});

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
        ...colorTokens,
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
