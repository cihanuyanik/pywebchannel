import { defineUtility } from "@pandacss/dev";

export const bgLinGrad = defineUtility({
  values: {
    type: "string",
  },

  transform: (value: string, { token }) => {
    let [dir, from, to] = value.split(" ");

    if (dir.indexOf("deg") === -1) {
      switch (dir) {
        case "tb":
          dir = "to bottom";
          break;
        case "tt":
          dir = "to top";
          break;
        case "tl":
          dir = "to left";
          break;
        case "tr":
          dir = "to right";
          break;
        default:
          dir = "to bottom";
          break;
      }
    }

    from = token(from) || token(`colors.${from}`) || from;
    to = token(to) || token(`colors.${to}`) || to;

    return {
      background: `linear-gradient(${dir}, ${from}, ${to})`,
    };
  },
});
