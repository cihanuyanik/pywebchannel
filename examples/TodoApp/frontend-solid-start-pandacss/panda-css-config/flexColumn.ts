import { definePattern } from "@pandacss/dev";
import { alignTokens, justifyTokens } from "./alignJustifyTokens";

export const flexColumn = definePattern({
  description: "A flex container that aligns items vertically",
  properties: {
    reverse: { type: "boolean" },
    wrap: { type: "boolean" },
    align: {
      type: "enum",
      value: alignTokens,
    },
    justify: {
      type: "enum",
      value: justifyTokens,
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
