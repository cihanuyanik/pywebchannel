import { theme } from "~/style/theme.css";
import { StyleBuilder } from "~/style/utils.css";

export const todoInput = new StyleBuilder()
  .position({ type: "absolute", top: "75px", zIndex: 3 })
  .size({ width: "100%", height: "50px" })
  .padding({ x: "40px" })
  .grid({ flow: "column", template: "1fr auto", gap: "5px", alignItems: "center" })
  .combine({
    // @ts-ignore
    ["& input"]: new StyleBuilder()
      .color(theme.color.primary)
      .backgroundColor(theme.color.tertiaryLighter)
      .borderRadius({ topLeft: "10px", topRight: "10px", bottomLeft: "4px", bottomRight: "4px" })
      .padding("5px")
      .font({ weight: "bolder", textAlign: "center" })
      .boxShadow(
        { color: theme.color.primaryDarker, offsetX: "2px", offsetY: "5px", blurRadius: "10px" },
        {
          transition: { duration: "200ms", function: "ease-in-out" },
          focus: { blurRadius: "10px", spreadRadius: "8px", color: theme.color.primaryLighter }
        }
      )
      .get()
  })

  .build("todoInput");
