import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const todo = style({
  height: "50px",
  ...css.padding({ x: "5px" }),
  ...css.grid({
    flow: "column",
    template: "auto 1fr auto",
    gap: "5px",
    alignItems: "center",
  }),

  borderRadius: "5px",

  ...css.boxShadow({
    offsetY: "2px",
    blurRadius: "2px",
    color: theme.color.primaryDarker,
  }),

  ...css.background(
    css.linearGradient({
      direction: "to left",
      stops: [
        { color: theme.color.secondaryDarker, position: "10%" },
        { color: theme.color.secondary, position: "50%" },
        { color: theme.color.secondaryLighter, position: "90%" },
      ],
    }),
  ),

  transition: "scale 0.2s ease-in-out",

  // @ts-ignore
  ["&:hover"]: {
    scale: "1.01",
    background: css.linearGradient({
      direction: "to right",
      stops: [
        { color: theme.color.secondaryDarker, position: "10%" },
        { color: theme.color.secondary, position: "50%" },
        { color: theme.color.secondaryLighter, position: "90%" },
      ],
    }),
  },
});

export const status = style({
  ...css.size({ height: "30px", width: "30px" }),
  marginRight: "10px",

  // @ts-ignore
  ["&:hover svg"]: {
    color: theme.color.tertiaryLighter,
  },
});
