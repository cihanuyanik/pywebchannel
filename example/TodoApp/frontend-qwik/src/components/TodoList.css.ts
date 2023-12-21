import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const todoList = style({
  width: "100%",
  backgroundColor: theme.color.tertiary,
  ...css.padding({ xy: ["40px", "25px"] }),
  ...css.grid({
    flow: "row",
    alignContent: "start",
    justifyContent: "stretch",
    gap: "4px",
  }),
  overflowY: "auto",
  scrollbarGutter: "stable both-edges",
});
