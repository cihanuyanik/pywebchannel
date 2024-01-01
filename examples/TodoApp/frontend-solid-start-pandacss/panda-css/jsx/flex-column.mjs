import { createMemo, mergeProps, splitProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { mergeCss } from '../css/css.mjs';
import { getFlexColumnStyle } from '../patterns/flex-column.mjs';
import { styled } from './factory.mjs';

export const FlexColumn = /* @__PURE__ */ function FlexColumn(props) {
  const [patternProps, restProps] = splitProps(props, ["reverse","wrap","align","justify"])

const styleProps = getFlexColumnStyle(patternProps)        
const mergedProps = mergeProps(styleProps, restProps)

return createComponent(styled.div, mergedProps)
}