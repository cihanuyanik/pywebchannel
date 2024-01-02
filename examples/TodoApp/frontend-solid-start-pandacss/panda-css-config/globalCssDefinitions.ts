import { defineGlobalStyles } from "@pandacss/dev";

export const bodyCss = defineGlobalStyles({
  body: {
    fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
    mozOsxFontSmoothing: "grayscale",
    lineHeight: 1.5,
    webkitFontSmoothing: "antialiased",
  },
});

export const todoItemCss = defineGlobalStyles({
  ".todo-item": {
    transition: "all 250ms ease-in-out",
  },

  ".todo-item-enter": {
    opacity: 1,
    transform: "translateX(-100%)",
  },
  ".todo-item-exit-to": {
    opacity: 0,
    transform: "translateX(100%)",
  },
});
