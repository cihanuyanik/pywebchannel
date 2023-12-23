import { style } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";
import { StyleBuilder } from "~/style/utils.css";

export const dialog = new StyleBuilder()
  .position({ type: "absolute", top: "50%", left: "50%", zIndex: 9999 })
  .combine({ transform: "translate(-50%, -50%)" })
  .size({ width: "400px" })
  .outline("none")
  .border("none")
  .borderRadius({ all: "10px" })
  .color(theme.color.text)
  .background("transparent", {
    customSelectors: [{ selector: "&::backdrop", style: "rgba(0, 0, 0, 0.5)" }]
  })
  .boxShadow({ blurRadius: "10px", spreadRadius: "8px", color: theme.color.primaryDarker })
  .font({ size: "18px", weight: "bolder" })
  .build("dialog");

export const busyDialogContent = new StyleBuilder()
  .grid({ flow: "row", alignContent: "center", justifyContent: "center" })
  .backgroundColor(theme.color.primary)
  .opacity("70%")
  .build("busyDialogContent");

export const messageBoxContent = new StyleBuilder()
  .grid({ flow: "row" })
  .backgroundColor(theme.color.secondary)
  .build("messageBoxContent");

export const title = style({
  // @ts-ignore
  selectors: {
    [`${messageBoxContent} &`]: new StyleBuilder()
      .size({ height: "36px" })
      .grid({ flow: "row", alignContent: "center", justifyContent: "center" })
      .border({ bottom: { width: "3px", style: "solid", color: theme.color.secondaryDarker } })
      .get()
  }
});

export const imageMessage = style({
  // @ts-ignore
  selectors: {
    [`${messageBoxContent} &`]: new StyleBuilder()
      .margin("4px")
      .padding({ xy: ["12px", "4px"] })
      .border({ bottom: { width: "3px", style: "solid", color: theme.color.secondaryDarker } })
      .backgroundColor(theme.color.tertiary)
      .grid({ flow: "column", alignItems: "center" })
      .font({ size: "15px" })
      // @ts-ignore
      .combine({ ["& img"]: { height: "70px", width: "70px", marginRight: "10px" } })
      .get()
  }
});

export const controls = style({
  // @ts-ignore
  selectors: {
    [`${messageBoxContent} &`]: new StyleBuilder()
      .flex({ direction: "row", alignItems: "center", justifyContent: "center" })
      .padding("4px")
      .combine({
        // @ts-ignore
        ["& button"]: new StyleBuilder()
          .combine({ flex: 1 })
          .borderRadius({ all: "4px" })
          .size({ height: "26px" })
          .flex({ direction: "row", alignItems: "center", justifyContent: "center", gap: "4px" })
          .font({ size: "15px", weight: "bolder" })
          // @ts-ignore
          .combine({ [`& svg`]: { height: "24px", width: "24px", color: "green" } })
          .get()
      })
      .get()
  }
});
