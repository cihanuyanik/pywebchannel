/* eslint-disable */
import type { Component } from 'solid-js'
import type { ScrollableProperties } from '../patterns/scrollable';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface ScrollableProps extends ScrollableProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof ScrollableProperties | 'overflow'> {}

/** A container that allows for scrolling */
export declare const Scrollable: Component<ScrollableProps>