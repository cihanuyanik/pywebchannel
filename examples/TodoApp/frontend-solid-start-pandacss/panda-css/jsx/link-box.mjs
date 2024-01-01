import { createMemo, mergeProps, splitProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { mergeCss } from '../css/css.mjs';
import { getLinkBoxStyle } from '../patterns/link-box.mjs';
import { styled } from './factory.mjs';

export const LinkBox = /* @__PURE__ */ function LinkBox(props) {
  const [patternProps, restProps] = splitProps(props, [])

const styleProps = getLinkBoxStyle(patternProps)        
const mergedProps = mergeProps(styleProps, restProps)

return createComponent(styled.div, mergedProps)
}