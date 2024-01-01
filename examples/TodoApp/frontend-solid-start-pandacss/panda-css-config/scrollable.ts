import { definePattern } from "@pandacss/dev";

export const scrollable = definePattern({
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
