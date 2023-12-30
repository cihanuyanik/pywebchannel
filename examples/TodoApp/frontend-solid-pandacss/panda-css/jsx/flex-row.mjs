import { createMemo, mergeProps, splitProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { mergeCss } from '../css/css.mjs';
import { getFlexRowStyle } from '../patterns/flex-row.mjs';
import { styled } from './factory.mjs';

export const FlexRow = /* @__PURE__ */ function FlexRow(props) {
  const [patternProps, restProps] = splitProps(props, ["reverse","wrap","align","justify"])

const styleProps = getFlexRowStyle(patternProps)        
const mergedProps = mergeProps(styleProps, restProps)

return createComponent(styled.div, mergedProps)
}