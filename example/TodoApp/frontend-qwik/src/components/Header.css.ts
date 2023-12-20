import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const header = style(
  css.merge(
    css.background(
      css.linearGradient({
        direction: "to bottom",
        stops: [
          { color: theme.color.secondaryDarker, position: "10%" },
          { color: theme.color.secondary, position: "50%" },
          { color: theme.color.secondaryLighter, position: "90%" },
        ],
      }),
    ),

    css.size({ width: "100%", height: "100px" }),
    css.grid({
      flow: "row",
      alignContent: "center",
      justifyContent: "center",
    }),

    css.border({
      bottom: {
        width: "3px",
        color: theme.color.secondaryDarker,
        style: "solid",
      },
    }),

    css.font({
      weight: "bolder",
      size: "25px",
    }),
  ),
);
