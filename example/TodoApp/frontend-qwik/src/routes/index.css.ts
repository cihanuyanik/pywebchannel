import { globalStyle } from "@vanilla-extract/css";
import { theme } from "~/style/theme.css";

globalStyle("body", {
  fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
sans-serif`,
  MozOsxFontSmoothing: "grayscale",
});

/*  1. Use a more-intuitive box-sizing model. */

globalStyle("*, *::before, *::after", {
  boxSizing: "border-box",
});

/* 2. Remove default margin */
globalStyle("*", {
  margin: 0,
  padding: 0,
});

/*  Typographic tweaks!
  3. Add accessible line-height
  4. Improve text rendering
*/
globalStyle("body", {
  lineHeight: 1.5,
  WebkitFontSmoothing: "antialiased",
});

/*
  5. Improve media defaults
*/
globalStyle("img, picture, video, canvas, svg", {
  display: "block",
  maxWidth: "100%",
});

/*
  6. Remove built-in form typography styles
*/
globalStyle("input, button, textarea, select", {
  font: "inherit",
});

/*
  7. Avoid text overflows
*/
globalStyle("p, h1, h2, h3, h4, h5, h6", {
  overflowWrap: "break-word",
});

/*
  8. Create a root stacking context
*/
globalStyle("#root, #__next", {
  isolation: "isolate",
});

/*
  9. Remove default button styling
*/
globalStyle("button", {
  border: "none",
  outline: "none",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  transition: "background 200ms ease",
});

/*
  10. Remove default list styling
*/
globalStyle("ul, ol", {
  listStyle: "none",
});

/*
  11. Remove default quote styling
*/
globalStyle("blockquote, q", {
  quotes: "none",
});

/*
  12. Remove default table styling
*/
globalStyle("table", {
  borderCollapse: "collapse",
  borderSpacing: 0,
});

// Common SVG styles
globalStyle("svg", {
  height: 32,
  color: theme.color.text,
  transition: "color 200ms ease",
});

// Common button styles
globalStyle("button", {
  height: "36px",
  width: "36px",
  borderRadius: "50%",
  color: theme.color.text,

  backgroundColor: theme.color.primary,
  // @ts-ignore
  ["&:hover"]: {
    backgroundColor: theme.color.primaryLighter,
  },
});

// Common input styles
globalStyle("input", {
  outline: "none",
  border: "none",
});
