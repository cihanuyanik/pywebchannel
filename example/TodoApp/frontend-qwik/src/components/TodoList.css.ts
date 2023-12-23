import { theme } from "~/style/theme.css";
import { StyleBuilder } from "~/style/utils.css";

export const todoList = new StyleBuilder()
  .backgroundColor(theme.color.tertiary)
  .padding({ xy: ["40px", "25px"] })
  .grid({ flow: "row", alignContent: "start", gap: "4px" })
  .size({ width: "100%" })
  .combine({ overflowY: "auto", scrollbarGutter: "stable both-edges" })
  .build("todoList");
