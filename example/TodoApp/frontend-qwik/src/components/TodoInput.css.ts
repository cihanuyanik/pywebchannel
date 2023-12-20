import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const todoInput = style(
  css.merge(
    css.position({ type: "absolute", top: "75px", zIndex: 3 }),
    css.size({ width: "100%", height: "50px" }),
    css.padding({ x: "40px" }),
    css.grid({
      flow: "column",
      template: "1fr auto",
      gap: "5px",
      alignContent: "center",
    }),

    css.setBySelector(
      "& input",
      css.color(theme.color.primary),
      css.backgroundColor(theme.color.tertiaryLighter),
      css.borderRadius({
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "4px",
        bottomRight: "4px",
      }),

      css.padding({ all: "5px" }),
      css.font({
        weight: "bolder",
        textAlign: "center",
      }),

      css.boxShadow(
        {
          color: theme.color.primaryDarker,
          offsetX: "2px",
          offsetY: "5px",
          blurRadius: "10px",
        },
        {
          transition: {
            duration: "200ms",
            function: "ease-in-out",
          },
          focus: {
            offsetX: "0px",
            offsetY: "0px",
            blurRadius: "10px",
            spreadRadius: "8px",
            color: theme.color.primaryLighter,
          },
        },
      ),
    ),
  ),
);
