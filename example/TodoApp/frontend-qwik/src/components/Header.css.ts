import { theme } from "~/style/theme.css";
import { linearGradient, StyleBuilder } from "~/style/utils.css";

export const header = new StyleBuilder()
  .background(
    linearGradient({
      direction: "to bottom",
      stops: [
        { color: theme.color.secondaryDarker, position: "10%" },
        { color: theme.color.secondary, position: "50%" },
        { color: theme.color.secondaryLighter, position: "90%" }
      ]
    })
  )
  .size({ width: "100%", height: "100px" })
  .grid({ flow: "column", alignItems: "center", justifyContent: "center", gap: "5px" })
  .font({ weight: "bolder", size: "25px" })
  .border({ bottom: { width: "3px", style: "solid", color: theme.color.secondaryDarker } })
  .build("header");
