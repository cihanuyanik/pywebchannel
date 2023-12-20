import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const todoList = style(
  css.merge(
    css.padding({ xy: ["40px", "25px"] }),
    css.size({ width: "100%" }),
    css.backgroundColor(theme.color.tertiary),
    css.grid({
      flow: "row",
      alignContent: "start",
      justifyContent: "stretch",
      gap: "4px",
    }),
    css.setByName("overflowY", "auto"),
    css.setByName("scrollbarGutter", "stable both-edges"),
  ),
);
