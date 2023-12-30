/* eslint-disable */
import type { Component } from 'solid-js'
import type { FlexColumnProperties } from '../patterns/flex-column';
import type { HTMLStyledProps } from '../types/jsx';
import type { DistributiveOmit } from '../types/system-types';

export interface FlexColumnProps extends FlexColumnProperties, DistributiveOmit<HTMLStyledProps<'div'>, keyof FlexColumnProperties | 'display'> {}

/** A flex container that aligns items vertically */
export declare const FlexColumn: Component<FlexColumnProps>