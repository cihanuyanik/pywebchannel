import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const appContainer = style(
  css.merge(
    css.color(theme.color.text),
    css.position({ type: "relative" }),
    css.size({ width: "100%", height: "100vh" }),
    css.grid({ flow: "row", template: "auto 1fr" }),
  ),
);
