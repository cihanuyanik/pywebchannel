import { definePattern } from "@pandacss/dev";
import { alignTokens, justifyTokens } from "./alignJustifyTokens";

export const flexRow = definePattern({
  description: "A flex container that aligns items horizontally",
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
