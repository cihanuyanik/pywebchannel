import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const dialog = style(
  css.merge(
    css.color(theme.color.text),
    css.background("transparent", {
      customSelectors: [
        { selector: "&::backdrop", style: "rgba(0, 0, 0, 0.5)" },
      ],
    }),
    css.boxShadow({
      offsetX: "0px",
      offsetY: "0px",
      blurRadius: "10px",
      spreadRadius: "8px",
      color: theme.color.primaryDarker,
    }),

    css.size({ width: "400px" }),
    css.position({
      type: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 9999,
    }),
    css.transform("translate(-50%, -50%)"),

    css.font({
      size: "18px",
      weight: "bolder",
    }),

    css.outline("none"),
    css.border({ all: "none" }),
    css.borderRadius({ all: "10px" }),
  ),
);

export const busyDialogContent = style(
  css.merge(
    css.grid({
      flow: "row",
      alignContent: "center",
      justifyContent: "center",
    }),
    css.backgroundColor(theme.color.primary),
    css.opacity("70%"),
  ),
);

export const messageBoxContent = style(
  css.merge(
    css.grid({ flow: "row" }),
    css.backgroundColor(theme.color.secondary),
  ),
);

export const title = style({
  selectors: css.setBySelector(
    `${messageBoxContent} &`,
    css.size({ height: "36px" }),
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
  ),
});

export const imageMessage = style({
  selectors: css.setBySelector(
    `${messageBoxContent} &`,
    css.margin({ x: "4px" }),
    css.padding({ xy: ["12px", "4px"] }),

    css.border({
      bottom: {
        width: "2px",
        color: theme.color.secondaryDarker,
        style: "solid",
      },
    }),

    css.backgroundColor(theme.color.tertiary),

    css.grid({
      flow: "column",
      alignItems: "center",
    }),

    css.font({ size: "15px" }),
    css.setBySelector(
      "& img",
      css.size({ height: "70px", width: "70px" }),
      css.margin({ right: "10px" }),
    ),
  ),

  // selectors: {
  //   [`${messageBoxContent} &`]: css.merge(
  //     css.margin({ x: "4px" }),
  //     css.padding({ xy: ["12px", "4px"] }),
  //
  //     css.border({
  //       bottom: {
  //         width: "2px",
  //         color: theme.color.secondaryDarker,
  //         style: "solid",
  //       },
  //     }),
  //
  //     css.backgroundColor(theme.color.tertiary),
  //
  //     css.grid({
  //       flow: "column",
  //       alignItems: "center",
  //     }),
  //
  //     css.font({ size: "15px" }),
  //     css.setBySelector(
  //       "& img",
  //       css.size({ height: "70px", width: "70px" }),
  //       css.margin({ right: "10px" }),
  //     ),
  //   ),
  // },
});

export const controls = style({
  selectors: css.setBySelector(
    `${messageBoxContent} &`,
    css.flex({
      direction: "row",
      alignItems: "center",
      justifyContent: "center",
    }),
    css.padding({ all: "4px" }),

    css.setBySelector(
      "& button",
      css.setByName("flex", 1),
      css.font({ size: "15px", weight: "bolder" }),
      css.borderRadius({ all: "4px" }),
      css.size({ height: "26px" }),
      css.flex({
        direction: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      }),
      css.setBySelector(
        "& svg",
        css.size({ height: "24px", width: "24px" }),
        css.color("green"),
      ),
    ),
  ),
});
