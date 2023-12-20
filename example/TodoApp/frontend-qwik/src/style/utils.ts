import type { ComplexStyleRule } from "@vanilla-extract/css";

export type SizeArgs = {
  width?: string | number;
  height?: string | number;
};

export type PaddingMarginArgs = {
  all?: string | number;
  left?: string | number;
  right?: string | number;
  top?: string | number;
  bottom?: string | number;
  x?: string | number;
  y?: string | number;
  xy?: [string | number, string | number];
};

export type GridArgs = {
  flow?: "row" | "column";
  template?: string;
  gap?: string | number;
  alignItems?: "stretch" | "center" | "start" | "end";
  justifyContent?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "space-around"
    | "space-between";
  alignContent?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "space-around"
    | "space-between"
    | "space-evenly";
  justifyItems?: "stretch" | "center" | "start" | "end";
};

export type FlexArgs = {
  direction?: "row" | "column";
  gap?: string | number;
  alignItems?: "stretch" | "center" | "start" | "end";
  justifyContent?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "space-around"
    | "space-between";
  alignContent?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "space-around"
    | "space-between"
    | "space-evenly";
  justifyItems?: "stretch" | "center" | "start" | "end";
};

export type PositionArgs = {
  type?: "static" | "absolute" | "relative" | "fixed" | "sticky";
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  zIndex?: number;
};

export type TransitionArgs = {
  duration: number | string;
  function?: string;
  delay?: number | string;
};

export type PseudoArgs<T> = {
  hover?: T;
  active?: T;
  focus?: T;
  disabled?: T;
  customSelectors?: [{ selector: string; style: T }];
  transition?: string | TransitionArgs;
};

export type BorderVisualArgs = {
  width?: string | number;
  style?: "none" | "solid" | "dashed" | "dotted";
  color?: string;
};

export type BorderArgs = {
  top?: BorderVisualArgs | string;
  bottom?: BorderVisualArgs | string;
  left?: BorderVisualArgs | string;
  right?: BorderVisualArgs | string;
  all?: BorderVisualArgs | string;
};

export type OutlineArgs = {
  width?: string | number;
  style?:
    | "none"
    | "solid"
    | "dashed"
    | "dotted"
    | "double"
    | "groove"
    | "ridge"
    | "inset"
    | "outset";
  color?: string;
};

export type BorderRadiusArgs = {
  all?: string | number;
  topLeft?: string | number;
  topRight?: string | number;
  bottomLeft?: string | number;
  bottomRight?: string | number;
};

export type FontArgs = {
  size?: string | number;
  family?: string;
  weight?: "normal" | "bold" | "bolder" | "lighter" | number;
  style?: "normal" | "italic" | "oblique";
  lineHeight?: string | number;
  letterSpacing?: string | number;
  transform?:
    | "none"
    | "capitalize"
    | "uppercase"
    | "lowercase"
    | "full-width"
    | "full-size-kana";
  textAlign?: "left" | "right" | "center" | "justify" | "justify-all";
};

export type LinearGradientArgs = {
  direction?:
    | "to top"
    | "to top right"
    | "to right"
    | "to bottom right"
    | "to bottom"
    | "to bottom left"
    | "to left"
    | "to top left"
    | number;

  stops: {
    color: string;
    position?: string;
  }[];
};

export type BoxShadowVisualArgs = {
  inset?: boolean;
  offsetX?: string | number;
  offsetY?: string | number;
  blurRadius?: string | number;
  spreadRadius?: string | number;
  color?: string;
};

function paddingMarginFromOptions(ret: object, property: string, options: any) {
  genPropertyForPx(ret, `${property}Left`, options.left);
  genPropertyForPx(ret, `${property}Right`, options.right);
  genPropertyForPx(ret, `${property}Top`, options.top);
  genPropertyForPx(ret, `${property}Bottom`, options.bottom);
  genPropertyForPx(ret, [`${property}Left`, `${property}Right`], options.x);
  genPropertyForPx(ret, [`${property}Top`, `${property}Bottom`], options.y);

  if (options.xy) {
    if (typeof options.xy[0] === "number") {
      options.xy[0] = `${options.xy[0]}px`;
    }
    if (typeof options.xy[1] === "number") {
      options.xy[1] = `${options.xy[1]}px`;
    }
    // @ts-ignore
    ret[`${property}`] = `${options.xy[1]} ${options.xy[0]}`;
  }
}

function displayArgsToObject(ret: object, options: GridArgs | FlexArgs) {
  genPropertyForPx(ret, "gap", options.gap);
  genPropertyForPx(ret, "alignItems", options.alignItems);
  genPropertyForPx(ret, "justifyContent", options.justifyContent);
  genPropertyForPx(ret, "alignContent", options.alignContent);
  genPropertyForPx(ret, "justifyItems", options.justifyItems);
}

function transitionStr(property: string, transition: string | TransitionArgs) {
  if (typeof transition === "string") {
    return transition;
  } else {
    let transitionStr = `${property} `;
    if (transition.duration) {
      if (typeof transition.duration === "number") {
        transition.duration = `${transition.duration}ms`;
      }
      transitionStr += `${transition.duration} `;
    }
    if (transition.function) {
      transitionStr += `${transition.function} `;
    }

    if (transition.delay) {
      if (typeof transition.delay === "number") {
        transition.delay = `${transition.delay}ms`;
      }
      transitionStr += `${transition.delay} `;
    }

    return transitionStr.trim();
  }
}

function pseudoClasses(
  ret: object,
  property: string,
  options: any,
  transform?: <T>(value: T) => string,
) {
  if (options.hover) {
    // @ts-ignore
    ret["&:hover"] = {
      [`${property}`]: transform ? transform(options.hover) : options.hover,
    };
  }
  if (options.active) {
    // @ts-ignore
    ret["&:active"] = {
      [`${property}`]: transform ? transform(options.active) : options.active,
    };
  }
  if (options.focus) {
    // @ts-ignore
    ret["&:focus"] = {
      [`${property}`]: transform ? transform(options.focus) : options.focus,
    };
  }
  if (options.disabled) {
    // @ts-ignore
    ret["&:disabled"] = {
      [`${property}`]: transform
        ? transform(options.disabled)
        : options.disabled,
    };
  }
  if (options.customSelectors) {
    options.customSelectors.forEach(
      (selector: { selector: string; style: any }) => {
        // @ts-ignore
        ret[selector.selector] = {
          [`${property}`]: transform
            ? transform(selector.style)
            : selector.style,
        };
      },
    );
  }
}

function genPropertyWithPseudoClasses(
  property: string,
  defaultValue: any,
  options: any,
  transform?: (value: any) => string,
) {
  const ret = { [`${property}`]: defaultValue };

  if (options) {
    if (options.transition) {
      // @ts-ignore
      ret["transition"] = transitionStr(property, options.transition);
    }
    pseudoClasses(ret, property, options, transform);
  }

  return ret;
}

function genPropertyForPx(
  ret: ComplexStyleRule,
  property: string | string[],
  value: any,
) {
  if (value) {
    if (typeof value === "number") value = `${value}px`;

    if (!Array.isArray(property)) {
      property = [property];
    }

    property.forEach((prop) => {
      // @ts-ignore
      ret[prop] = value;
    });

    return true;
  }
  return false;
}

function genPropertyForLineStyle(
  ret: object,
  property: string,
  lineOptions: any,
) {
  if (lineOptions) {
    if (typeof lineOptions === "string") {
      // @ts-ignore
      ret[property] = lineOptions;
      return true;
    } else {
      // @ts-ignore
      ret[property] = `${lineOptions.width || "1px"} ${
        lineOptions.style || "solid"
      } ${lineOptions.color || "black"}`;
      return true;
    }
  }
  return false;
}

export const css = {
  merge(...args: any[]) {
    return Object.assign({}, ...args);
  },

  size(options: SizeArgs) {
    const ret = {};
    genPropertyForPx(ret, "width", options.width);
    genPropertyForPx(ret, "height", options.height);
    return ret;
  },

  padding(options: PaddingMarginArgs) {
    const ret = {};
    if (genPropertyForPx(ret, "padding", options.all)) return ret;

    paddingMarginFromOptions(ret, "padding", options);

    return ret;
  },

  margin(options: PaddingMarginArgs) {
    const ret = {};
    if (genPropertyForPx(ret, "margin", options.all)) return ret;

    paddingMarginFromOptions(ret, "margin", options);

    return ret;
  },

  grid(options: GridArgs) {
    const ret = { display: "grid" };

    if (!options.template) {
      // @ts-ignore
      ret["gridAutoFlow"] = options.flow;
    } else {
      if (options.flow === "row") {
        // @ts-ignore
        ret["gridTemplateRows"] = options.template;
      } else {
        // @ts-ignore
        ret["gridTemplateColumns"] = options.template;
      }
    }

    displayArgsToObject(ret, options);

    return ret;
  },

  flex(options: FlexArgs) {
    const ret = { display: "flex" };

    genPropertyForPx(ret, "flexDirection", options.direction);

    displayArgsToObject(ret, options);

    return ret;
  },

  position(options: PositionArgs = { type: "static" }) {
    const ret = {};

    genPropertyForPx(ret, "position", options.type);

    if (options.type === "static") {
      return ret;
    }

    genPropertyForPx(ret, "top", options.top);
    genPropertyForPx(ret, "bottom", options.bottom);
    genPropertyForPx(ret, "left", options.left);
    genPropertyForPx(ret, "right", options.right);

    if (options.zIndex) {
      // @ts-ignore
      ret["zIndex"] = options.zIndex;
    }

    return ret;
  },

  border(options: BorderArgs) {
    const ret = {};
    if (genPropertyForLineStyle(ret, "border", options.all)) return ret;
    genPropertyForLineStyle(ret, "borderTop", options.top);
    genPropertyForLineStyle(ret, "borderBottom", options.bottom);
    genPropertyForLineStyle(ret, "borderLeft", options.left);
    genPropertyForLineStyle(ret, "borderRight", options.right);
    return ret;
  },

  borderRadius(options: BorderRadiusArgs) {
    const ret = {};
    if (genPropertyForPx(ret, "borderRadius", options.all)) return ret;
    genPropertyForPx(ret, "borderTopLeftRadius", options.topLeft);
    genPropertyForPx(ret, "borderTopRightRadius", options.topRight);
    genPropertyForPx(ret, "borderBottomLeftRadius", options.bottomLeft);
    genPropertyForPx(ret, "borderBottomRightRadius", options.bottomRight);
    return ret;
  },

  font(options: FontArgs) {
    const ret = {};
    genPropertyForPx(ret, "fontSize", options.size);
    genPropertyForPx(ret, "fontFamily", options.family);
    if (options.weight) {
      // @ts-ignore
      ret["fontWeight"] = options.weight;
    }
    genPropertyForPx(ret, "fontStyle", options.style);
    genPropertyForPx(ret, "lineHeight", options.lineHeight);
    genPropertyForPx(ret, "letterSpacing", options.letterSpacing);
    genPropertyForPx(ret, "textTransform", options.transform);
    genPropertyForPx(ret, "textAlign", options.textAlign);
    return ret;
  },

  linearGradient(options: LinearGradientArgs) {
    let gradientStr = "linear-gradient(";
    if (options.direction) {
      if (typeof options.direction === "number") {
        // @ts-ignore
        options.direction = `${options.direction}deg`;
      }
      gradientStr += options.direction;
    }

    gradientStr += ", ";

    options.stops.forEach((stop) => {
      gradientStr += `${stop.color}`;
      if (stop.position) {
        gradientStr += ` ${stop.position}`;
      }
      gradientStr += ", ";
    });

    gradientStr = gradientStr.slice(0, -2);

    gradientStr += ")";

    return gradientStr;
  },

  boxShadowString(value: string | BoxShadowVisualArgs | BoxShadowVisualArgs[]) {
    if (typeof value === "string") return value;

    let boxShadowStr = "";

    if (!Array.isArray(value)) {
      value = [value];
    }

    value.forEach((option) => {
      if (option.inset) {
        boxShadowStr += "inset ";
      }

      if (!option.offsetX) {
        boxShadowStr += "0px ";
      } else {
        if (typeof option.offsetX === "number") {
          option.offsetX = `${option.offsetX}px`;
        }
        boxShadowStr += `${option.offsetX} `;
      }

      if (!option.offsetY) {
        boxShadowStr += "0px ";
      } else {
        if (typeof option.offsetY === "number") {
          option.offsetY = `${option.offsetY}px`;
        }
        boxShadowStr += `${option.offsetY} `;
      }

      if (!option.blurRadius) {
        boxShadowStr += "0px ";
      } else {
        if (typeof option.blurRadius === "number") {
          option.blurRadius = `${option.blurRadius}px`;
        }
        boxShadowStr += `${option.blurRadius} `;
      }

      if (!option.spreadRadius) {
        boxShadowStr += "0px ";
      } else {
        if (typeof option.spreadRadius === "number") {
          option.spreadRadius = `${option.spreadRadius}px`;
        }
        boxShadowStr += `${option.spreadRadius} `;
      }

      if (option.color) {
        boxShadowStr += `${option.color} `;
      }

      boxShadowStr = boxShadowStr.trim();
      boxShadowStr += ", ";
    });

    if (boxShadowStr.length > 2) boxShadowStr = boxShadowStr.slice(0, -2);

    return boxShadowStr;
  },

  color(value: string, options?: PseudoArgs<string>) {
    return genPropertyWithPseudoClasses("color", value, options);
  },

  backgroundColor(value: string, options?: PseudoArgs<string>) {
    return genPropertyWithPseudoClasses("background-color", value, options);
  },

  background(value: string, options?: PseudoArgs<string>) {
    return genPropertyWithPseudoClasses("background", value, options);
  },

  boxShadow(
    value: string | BoxShadowVisualArgs | BoxShadowVisualArgs[],
    options?: PseudoArgs<string | BoxShadowVisualArgs | BoxShadowVisualArgs[]>,
  ) {
    return genPropertyWithPseudoClasses(
      "box-shadow",
      this.boxShadowString(value),
      options,
      (value: any) => this.boxShadowString(value),
    );
  },

  opacity(value: number | string, options?: PseudoArgs<number | string>) {
    return genPropertyWithPseudoClasses("opacity", value, options);
  },

  outline(options: string | OutlineArgs) {
    const ret = {};
    genPropertyForLineStyle(ret, "outline", options);
    return ret;
  },

  transform(value: string) {
    return { transform: value };
  },

  setBySelector(selector: string, ...args: any[]) {
    return {
      [selector]: this.merge(...args),
    };
  },

  setByName(name: string, value: any) {
    return {
      [name]: value,
    };
  },
};
