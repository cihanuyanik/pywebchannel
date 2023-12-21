import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { css } from "~/style/utils";

export const dialog = style({
  ...css.position({
    type: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 9999,
  }),

  transform: "translate(-50%, -50%)",

  width: "400px",

  outline: "none",
  border: "none",
  borderRadius: "10px",

  color: theme.color.text,

  ...css.background("transparent", {
    customSelectors: [{ selector: "&::backdrop", style: "rgba(0, 0, 0, 0.5)" }],
  }),

  ...css.boxShadow({
    offsetX: "0px",
    offsetY: "0px",
    blurRadius: "10px",
    spreadRadius: "8px",
    color: theme.color.primaryDarker,
  }),

  ...css.font({
    size: "18px",
    weight: "bolder",
  }),
});

export const busyDialogContent = style({
  ...css.grid({
    flow: "row",
    alignContent: "center",
    justifyContent: "center",
  }),

  backgroundColor: theme.color.primary,
  opacity: "70%",
});

export const messageBoxContent = style({
  ...css.grid({ flow: "row" }),
  backgroundColor: theme.color.secondary,
});

export const title = style({
  selectors: {
    [`${messageBoxContent} &`]: {
      height: "36px",

      ...css.grid({
        flow: "row",
        alignContent: "center",
        justifyContent: "center",
      }),

      borderBottom: `3px solid ${theme.color.secondaryDarker}`,
    },
  },
});

export const imageMessage = style({
  selectors: {
    [`${messageBoxContent} &`]: {
      margin: "4px",
      ...css.padding({ xy: ["12px", "4px"] }),
      borderBottom: `3px solid ${theme.color.secondaryDarker}`,
      backgroundColor: theme.color.tertiary,

      ...css.grid({
        flow: "column",
        alignItems: "center",
      }),

      fontSize: "15px",

      // @ts-ignore
      ["& img"]: {
        ...css.size({ height: "70px", width: "70px" }),
        marginRight: "10px",
      },
    },
  },
});

export const controls = style({
  selectors: {
    [`${messageBoxContent} &`]: {
      ...css.flex({
        direction: "row",
        alignItems: "center",
        justifyContent: "center",
      }),

      padding: "4px",

      // @ts-ignore
      ["& button"]: {
        flex: 1,
        borderRadius: "4px",
        height: "26px",

        ...css.flex({
          direction: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
        }),

        ...css.font({ size: "15px", weight: "bolder" }),

        ["& svg"]: {
          ...css.size({ height: "24px", width: "24px" }),
          color: "green",
        },
      },
    },
  },
});
