import { theme } from "~/style/theme.css";
import { linearGradient, StyleBuilder } from "~/style/utils.css";

export const todo = new StyleBuilder()
  .size({ height: "50px" })
  .padding({ x: "5px" })
  .grid({ flow: "column", template: "auto 1fr auto", gap: "5px", alignItems: "center" })
  .borderRadius({ all: "5px" })
  .boxShadow({ offsetY: "2px", blurRadius: "2px", color: theme.color.primaryDarker })
  .background(
    linearGradient({
      direction: "to left",
      stops: [
        { color: theme.color.secondaryDarker, position: "10%" },
        { color: theme.color.secondary, position: "50%" },
        { color: theme.color.secondaryLighter, position: "90%" }
      ]
    }),
    {
      hover: linearGradient({
        direction: "to right",
        stops: [
          { color: theme.color.secondaryDarker, position: "10%" },
          { color: theme.color.secondary, position: "50%" },
          { color: theme.color.secondaryLighter, position: "90%" }
        ]
      })
    }
  )
  .scale(1, { hover: 1.01, transition: { duration: 0.2, function: "ease-in-out" } })
  .build("todo");

export const status = new StyleBuilder()
  .size({ height: "30px", width: "30px" })
  .margin({ right: "10px" })
  // @ts-ignore
  .combine({ ["&:hover svg"]: { color: theme.color.tertiaryLighter } })
  .build("status");
