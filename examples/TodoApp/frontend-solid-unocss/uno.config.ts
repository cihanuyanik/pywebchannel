import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    {
      grid: "grid",
    },
    [/^grid-(.*)$/, ([, dir]) => `grid grid-flow-${dir.slice(0, 3)}`],
    [/^grid-(.*)-(.*)$/, ([, dir, template]) => `grid grid-${dir}-${template}`],
    [
      /^bg-gradient-(.*)_(.*)_(.*)$/,
      ([, dir, beginColor, endColor]) =>
        `bg-gradient-${dir} from-${beginColor} to-${endColor}`,
    ],
  ],
  theme: {
    colors: {
      primary: "#4d1d83",
      primaryLighter: "#74449d",
      primaryDarker: "#260548",
      secondary: "#0c0979",
      secondaryLighter: "#534ef2",
      secondaryDarker: "#06043c",
      tertiary: "#4e8fcd",
      tertiaryLighter: "#a6c7e6",
      tertiaryDarker: "#1f486e",
      text: "#ffffff",
      black: "#000000",
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  rules: [["sb-stable-both", { "scrollbar-gutter": "stable both-edges" }]],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
