import { mapObject } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const flexColumnConfig = {
transform(props) {
  const { reverse, wrap, align, justify, ...rest } = props;
  return {
    display: "flex",
    flexDirection: reverse ? "column-reverse" : "column",
    flexWrap: wrap ? "wrap" : "nowrap",
    alignItems: align || "center",
    justifyContent: justify || "center",
    ...rest
  };
}}

export const getFlexColumnStyle = (styles = {}) => flexColumnConfig.transform(styles, { map: mapObject })

export const flexColumn = (styles) => css(getFlexColumnStyle(styles))
flexColumn.raw = getFlexColumnStyle