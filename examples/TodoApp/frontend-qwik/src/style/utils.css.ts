import type { ComplexStyleRule } from "@vanilla-extract/css";
import { style } from "@vanilla-extract/css";
// @ts-ignore
export type SizeArgs = Partial<Pick<ComplexStyleRule, "width" | "height">>;

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
  flow: "row" | "column";
  template?: string;
  gap?: string | number;
  alignItems?: "stretch" | "center" | "start" | "end";
  justifyContent?: "stretch" | "center" | "start" | "end" | "space-around" | "space-between";
  alignContent?: "stretch" | "center" | "start" | "end" | "space-around" | "space-between" | "space-evenly";
  justifyItems?: "stretch" | "center" | "start" | "end";
};

export type FlexArgs = {
  direction: "row" | "column";
  gap?: string | number;
  alignItems?: "stretch" | "center" | "start" | "end";
  justifyContent?: "stretch" | "center" | "start" | "end" | "space-around" | "space-between";
  alignContent?: "stretch" | "center" | "start" | "end" | "space-around" | "space-between" | "space-evenly";
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
  style?: "none" | "solid" | "dashed" | "dotted" | "double" | "groove" | "ridge" | "inset" | "outset";
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
  transform?: "none" | "capitalize" | "uppercase" | "lowercase" | "full-width" | "full-size-kana";
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

export function linearGradient(options: LinearGradientArgs) {
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
}

export function boxShadowString(value: string | BoxShadowVisualArgs | BoxShadowVisualArgs[]) {
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
}

export function transitionStr(property: string, transition: string | TransitionArgs) {
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

export class StyleBuilder {
  private style: ComplexStyleRule;

  constructor() {
    this.style = {} as ComplexStyleRule;
  }

  private genPropertyForPx(property: string | string[], value: any) {
    if (value) {
      if (typeof value === "number") value = `${value}px`;

      if (!Array.isArray(property)) {
        property = [property];
      }

      property.forEach((prop) => {
        // @ts-ignore
        this.style[prop] = value;
      });

      return true;
    }
    return false;
  }

  private pseudoClasses(ret: object, property: string, options: any, transform?: <T>(value: T) => string) {
    if (options.hover) {
      // @ts-ignore
      ret["&:hover"] = { [`${property}`]: transform ? transform(options.hover) : options.hover };
    }
    if (options.active) {
      // @ts-ignore
      ret["&:active"] = { [`${property}`]: transform ? transform(options.active) : options.active };
    }
    if (options.focus) {
      // @ts-ignore
      ret["&:focus"] = { [`${property}`]: transform ? transform(options.focus) : options.focus };
    }
    if (options.disabled) {
      // @ts-ignore
      ret["&:disabled"] = { [`${property}`]: transform ? transform(options.disabled) : options.disabled };
    }
    if (options.customSelectors) {
      options.customSelectors.forEach((selector: { selector: string; style: any }) => {
        // @ts-ignore
        ret[selector.selector] = { [`${property}`]: transform ? transform(selector.style) : selector.style };
      });
    }
  }

  private genPropertyWithPseudoClasses(
    property: string,
    defaultValue: any,
    options: any,
    transform?: (value: any) => string
  ) {
    const ret = { [`${property}`]: defaultValue };

    if (options) {
      if (options.transition) {
        // @ts-ignore
        ret["transition"] = transitionStr(property, options.transition);
      }
      this.pseudoClasses(ret, property, options, transform);
    }

    return ret;
  }

  private genPropertyForLineStyle(property: string, lineOptions: any) {
    if (lineOptions) {
      if (typeof lineOptions === "string") {
        // @ts-ignore
        this.style[property] = lineOptions;
        return true;
      } else {
        // @ts-ignore
        this.style[property] = `${lineOptions.width || "1px"} ${lineOptions.style || "solid"} ${
          lineOptions.color || "black"
        }`;
        return true;
      }
    }
    return false;
  }

  private paddingMarginFromOptions(property: string, options: any) {
    this.genPropertyForPx(`${property}Left`, options.left);
    this.genPropertyForPx(`${property}Right`, options.right);
    this.genPropertyForPx(`${property}Top`, options.top);
    this.genPropertyForPx(`${property}Bottom`, options.bottom);
    this.genPropertyForPx([`${property}Left`, `${property}Right`], options.x);
    this.genPropertyForPx([`${property}Top`, `${property}Bottom`], options.y);

    if (options.xy) {
      if (typeof options.xy[0] === "number") {
        options.xy[0] = `${options.xy[0]}px`;
      }
      if (typeof options.xy[1] === "number") {
        options.xy[1] = `${options.xy[1]}px`;
      }
      // @ts-ignore
      this.style[`${property}`] = `${options.xy[1]} ${options.xy[0]}`;
    }
  }

  private displayArgsToObject(options: GridArgs | FlexArgs) {
    this.genPropertyForPx("gap", options.gap);
    this.genPropertyForPx("alignItems", options.alignItems);
    this.genPropertyForPx("justifyContent", options.justifyContent);
    this.genPropertyForPx("alignContent", options.alignContent);
    this.genPropertyForPx("justifyItems", options.justifyItems);
  }

  build(className: string) {
    return style(this.style, className);
  }

  get() {
    return this.style;
  }

  combine(rule: ComplexStyleRule) {
    Object.getOwnPropertyNames(rule).forEach((key) => {
      // @ts-ignore
      if (this.style[key] !== undefined) {
        // if it is an object
        // @ts-ignore
        if (typeof this.style[key] === "object") {
          // @ts-ignore
          this.style[key] = { ...this.style[key], ...rule[key] };
        } else if (key === "transition") {
          // @ts-ignore
          this.style[key] += `, ${rule[key]}`;
        }
      } else {
        // @ts-ignore
        this.style[key] = rule[key];
      }
    });

    return this;
  }

  // @ts-ignore
  size(options: SizeArgs) {
    this.genPropertyForPx("width", options.width);
    this.genPropertyForPx("height", options.height);
    return this;
  }

  padding(options: string | PaddingMarginArgs) {
    if (typeof options === "string") {
      // @ts-ignore
      this.style["padding"] = options;
      return this;
    }

    if (this.genPropertyForPx("padding", options.all)) return this;

    this.paddingMarginFromOptions("padding", options);

    return this;
  }

  margin(options: string | PaddingMarginArgs) {
    if (typeof options === "string") {
      // @ts-ignore
      this.style["margin"] = options;
      return this;
    }

    if (this.genPropertyForPx("margin", options.all)) return this;

    this.paddingMarginFromOptions("margin", options);

    return this;
  }

  grid(options: GridArgs) {
    // @ts-ignore
    this.style["display"] = "grid";

    if (!options.template) {
      // @ts-ignore
      this.style["gridAutoFlow"] = options.flow;
    } else {
      if (options.flow === "row") {
        // @ts-ignore
        this.style["gridTemplateRows"] = options.template;
      } else {
        // @ts-ignore
        this.style["gridTemplateColumns"] = options.template;
      }
    }

    this.displayArgsToObject(options);

    return this;
  }

  flex(options: FlexArgs) {
    // @ts-ignore
    this.style["display"] = "flex";

    this.genPropertyForPx("flexDirection", options.direction);

    this.displayArgsToObject(options);

    return this;
  }

  position(options: PositionArgs = { type: "static" }) {
    this.genPropertyForPx("position", options.type);

    if (options.type === "static") {
      return this;
    }

    this.genPropertyForPx("top", options.top);
    this.genPropertyForPx("bottom", options.bottom);
    this.genPropertyForPx("left", options.left);
    this.genPropertyForPx("right", options.right);

    if (options.zIndex) {
      // @ts-ignore
      this.style["zIndex"] = options.zIndex;
    }

    return this;
  }

  outline(options: string | OutlineArgs) {
    this.genPropertyForLineStyle("outline", options);
    return this;
  }

  border(options: string | BorderArgs) {
    if (typeof options === "string") {
      // @ts-ignore
      this.style["border"] = options;
      return this;
    }

    if (this.genPropertyForLineStyle("border", options.all)) return this;
    this.genPropertyForLineStyle("borderTop", options.top);
    this.genPropertyForLineStyle("borderBottom", options.bottom);
    this.genPropertyForLineStyle("borderLeft", options.left);
    this.genPropertyForLineStyle("borderRight", options.right);
    return this;
  }

  borderRadius(options: string | BorderRadiusArgs) {
    if (typeof options === "string") {
      // @ts-ignore
      this.style["borderRadius"] = options;
      return this;
    }

    if (this.genPropertyForPx("borderRadius", options.all)) return this;
    this.genPropertyForPx("borderTopLeftRadius", options.topLeft);
    this.genPropertyForPx("borderTopRightRadius", options.topRight);
    this.genPropertyForPx("borderBottomLeftRadius", options.bottomLeft);
    this.genPropertyForPx("borderBottomRightRadius", options.bottomRight);
    return this;
  }

  font(options: FontArgs) {
    this.genPropertyForPx("fontSize", options.size);
    this.genPropertyForPx("fontFamily", options.family);
    if (options.weight) {
      // @ts-ignore
      this.style["fontWeight"] = options.weight;
    }
    this.genPropertyForPx("fontStyle", options.style);
    this.genPropertyForPx("lineHeight", options.lineHeight);
    this.genPropertyForPx("letterSpacing", options.letterSpacing);
    this.genPropertyForPx("textTransform", options.transform);
    this.genPropertyForPx("textAlign", options.textAlign);
    return this;
  }

  color(value: string, options?: PseudoArgs<string>) {
    this.combine(this.genPropertyWithPseudoClasses("color", value, options));
    return this;
  }

  backgroundColor(value: string, options?: PseudoArgs<string>) {
    this.combine(this.genPropertyWithPseudoClasses("background-color", value, options));
    return this;
  }

  background(value: string, options?: PseudoArgs<string>) {
    this.combine(this.genPropertyWithPseudoClasses("background", value, options));
    return this;
  }

  scale(value: number, options?: PseudoArgs<number>) {
    this.combine(this.genPropertyWithPseudoClasses("scale", value, options));
    return this;
  }

  opacity(value: number | string, options?: PseudoArgs<number | string>) {
    this.combine(this.genPropertyWithPseudoClasses("opacity", value, options));
    return this;
  }

  boxShadow(
    value: string | BoxShadowVisualArgs | BoxShadowVisualArgs[],
    options?: PseudoArgs<string | BoxShadowVisualArgs | BoxShadowVisualArgs[]>
  ) {
    this.combine(
      this.genPropertyWithPseudoClasses("box-shadow", boxShadowString(value), options, (value: any) =>
        boxShadowString(value)
      )
    );

    return this;
  }
}
