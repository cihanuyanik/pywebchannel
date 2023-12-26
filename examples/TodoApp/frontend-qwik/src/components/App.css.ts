import { theme } from "~/style/theme.css";
import { StyleBuilder } from "~/style/utils.css";

export const appContainer = new StyleBuilder()
  .size({ width: "100%", height: "100vh" })
  .grid({ flow: "row", template: "auto 1fr" })
  .combine({ color: theme.color.text, position: "relative" })
  .build("appContainer");
