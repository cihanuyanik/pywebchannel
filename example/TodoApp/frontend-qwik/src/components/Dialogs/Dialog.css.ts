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

export const title = new StyleBuilder()
  .size({ height: "36px" })
  .grid({ flow: "row", alignContent: "center", justifyContent: "center" })
  .border({ bottom: { width: "3px", style: "solid", color: theme.color.secondaryDarker } })
  .build("title");

export const imageMessage = new StyleBuilder()
  .margin({ x: "4px" })
  .padding({ xy: ["12px", "4px"] })
  .border({ bottom: { width: "3px", style: "solid", color: theme.color.secondaryDarker } })
  .backgroundColor(theme.color.tertiary)
  .grid({ flow: "column", alignItems: "center" })
  .font({ size: "15px" })
  // @ts-ignore
  .combine({ ["& img"]: { height: "70px", width: "70px", marginRight: "10px" } })
  .build("imageMessage");

export const controls = new StyleBuilder()
  .flex({ direction: "row", alignItems: "center", justifyContent: "center", gap: "4px" })
  .padding("4px")
  .build("controls");

export const button = new StyleBuilder()
  .combine({ flex: 1 })
  .borderRadius({ all: "4px" })
  .size({ height: "26px" })
  .flex({ direction: "row", alignItems: "center", justifyContent: "center", gap: "4px" })
  .font({ size: "15px", weight: "bolder" })
  .build("button");

export const tickIcon = new StyleBuilder().color("green").size({ height: "20px", width: "20px" }).build("tickIcon");

export const crossIcon = new StyleBuilder().color("red").build("crossIcon");
