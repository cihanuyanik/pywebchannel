import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const todo = style(
  css.merge(
    css.size({ height: "50px" }),
    css.padding({ x: "5px" }),
    css.grid({
      flow: "column",
      template: "auto 1fr auto",
      gap: "5px",
      alignItems: "center",
    }),

    css.borderRadius({ all: "5px" }),

    css.background(
      css.linearGradient({
        direction: "to left",
        stops: [
          { color: theme.color.secondaryDarker, position: "10%" },
          { color: theme.color.secondary, position: "50%" },
          { color: theme.color.secondaryLighter, position: "90%" },
        ],
      }),
      {
        hover: css.linearGradient({
          direction: "to right",
          stops: [
            { color: theme.color.secondaryDarker, position: "10%" },
            { color: theme.color.secondary, position: "50%" },
            { color: theme.color.secondaryLighter, position: "90%" },
          ],
        }),
      },
    ),

    css.boxShadow({
      offsetY: "2px",
      blurRadius: "2px",
      color: theme.color.primaryDarker,
    }),
  ),
);

export const status = style(
  css.merge(
    css.size({ height: "30px", width: "30px" }),
    css.margin({ right: "10px" }),
    css.setBySelector("&:hover svg", css.color(theme.color.tertiaryLighter)),
  ),
);
