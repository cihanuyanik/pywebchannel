import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const header = style({
  ...css.background(
    css.linearGradient({
      direction: "to bottom",
      stops: [
        { color: theme.color.secondaryDarker, position: "10%" },
        { color: theme.color.secondary, position: "50%" },
        { color: theme.color.secondaryLighter, position: "90%" },
      ],
    }),
  ),

  ...css.size({ width: "100%", height: "100px" }),
  ...css.grid({
    flow: "row",
    alignContent: "center",
    justifyContent: "center",
  }),

  borderBottom: `3px solid ${theme.color.secondaryDarker}`,

  ...css.font({ weight: "bolder", size: "25px" }),
});
