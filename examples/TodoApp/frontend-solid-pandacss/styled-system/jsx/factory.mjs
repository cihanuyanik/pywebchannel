import { Dynamic } from 'solid-js/web'
import { createMemo, mergeProps, splitProps } from 'solid-js'
import { createComponent } from 'solid-js/web'
import { defaultShouldForwardProp, composeShouldForwardProps, composeCvaFn, getDisplayName } from './factory-helper.mjs';
import { isCssProperty } from './is-valid-prop.mjs';
import { css, cx, cva } from '../css/index.mjs';
import { normalizeHTMLProps } from '../helpers.mjs';

function styledFn(element, configOrCva = {}, options = {}) {
  const cvaFn = configOrCva.__cva__ || configOrCva.__recipe__ ? configOrCva : cva(configOrCva)

  const forwardFn = options.shouldForwardProp || defaultShouldForwardProp
  const shouldForwardProp = (prop) => forwardFn(prop, cvaFn.variantKeys)

  const defaultProps = Object.assign(
    options.dataAttr && configOrCva.__name__ ? { 'data-recipe': configOrCva.__name__ } : {},
    options.defaultProps,
  )

  const StyledComponent = (props) => {
    const mergedProps = mergeProps({ as: element.__base__ || element }, defaultProps, props)

    const __cvaFn__ = composeCvaFn(Dynamic.__cva__, cvaFn)
    const __shouldForwardProps__ = composeShouldForwardProps(Dynamic, shouldForwardProp)

    const forwardedKeys = createMemo(() =>
      Object.keys(props).filter((prop) => !normalizeHTMLProps.keys.includes(prop) && shouldForwardProp(prop)),
    )

    const [localProps, htmlProps, forwardedProps, restProps] = splitProps(
      mergedProps,
      ['as', 'class', 'className'],
      normalizeHTMLProps.keys,
      forwardedKeys()
    )

    const cssPropertyKeys = createMemo(() => Object.keys(restProps).filter((prop) => isCssProperty(prop)))

    const [variantProps, styleProps, elementProps] = splitProps(
      restProps,
      __cvaFn__.variantKeys,
      cssPropertyKeys(),
    )

    function recipeClass() {
      const { css: cssStyles, ...propStyles } = styleProps
      const compoundVariantStyles = __cvaFn__.__getCompoundVariantCss__?.(variantProps);
      return cx(__cvaFn__(variantProps, false), css(compoundVariantStyles, propStyles, cssStyles), localProps.class, localProps.className)
    }

    function cvaClass() {
      const { css: cssStyles, ...propStyles } = styleProps
      const cvaStyles = __cvaFn__.raw(variantProps)
      return cx(css(cvaStyles, propStyles, cssStyles), localProps.class, localProps.className)
    }

    const classes = configOrCva.__recipe__ ? recipeClass : cvaClass

    if (forwardedProps.className) {
      delete forwardedProps.className
    }

    return createComponent(
      Dynamic,
      mergeProps(
        forwardedProps,
        elementProps,
        normalizeHTMLProps(htmlProps),
        {
          get component() {
            return localProps.as
          },
          get class() {
            return classes()
          }
        },
      )
    )
  }

  const name = getDisplayName(element)

  StyledComponent.displayName = `styled.${name}`
  StyledComponent.__cva__ = cvaFn
  StyledComponent.__base__ = element
  StyledComponent.__shouldForwardProps__ = shouldForwardProp

  return StyledComponent
}

function createJsxFactory() {
  const cache = new Map()

  return new Proxy(styledFn, {
    apply(_, __, args) {
      return styledFn(...args)
    },
    get(_, el) {
      if (!cache.has(el)) {
        cache.set(el, styledFn(el))
      }
      return cache.get(el)
    },
  })
}

export const styled = /* @__PURE__ */ createJsxFactory()