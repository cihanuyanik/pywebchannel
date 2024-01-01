import { mapObject } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const flexRowConfig = {
transform(props) {
  const { reverse, wrap, align, justify, ...rest } = props;
  return {
    display: "flex",
    flexDirection: reverse ? "row-reverse" : "row",
    flexWrap: wrap ? "wrap" : "nowrap",
    alignItems: align || "center",
    justifyContent: justify || "center",
    ...rest
  };
}}

export const getFlexRowStyle = (styles = {}) => flexRowConfig.transform(styles, { map: mapObject })

export const flexRow = (styles) => css(getFlexRowStyle(styles))
flexRow.raw = getFlexRowStyle