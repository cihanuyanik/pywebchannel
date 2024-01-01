/* eslint-disable */
import type { Component } from 'solid-js'
import type { FlexRowProperties } from '../patterns/flex-row';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface FlexRowProps extends FlexRowProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof FlexRowProperties | 'display'> {}

/** A flex container that aligns items horizontally */
export declare const FlexRow: Component<FlexRowProps>