/* eslint-disable */
import type { SystemStyleObject, ConditionalValue } from '../types/index';
import type { Properties } from '../types/csstype';
import type { PropertyValue } from '../types/prop-type';
import type { DistributiveOmit } from '../types/system-types';
import type { Tokens } from '../tokens/index';

export interface FlexRowProperties {
   reverse?: ConditionalValue<boolean>
	wrap?: ConditionalValue<boolean>
	align?: ConditionalValue<"center" | "start" | "end" | "flex-start" | "flex-end" | "self-start" | "self-end" | "baseline" | "first baseline" | "last baseline" | "safe center" | "unsafe center" | "between" | "around" | "stretch" | "normal">
	justify?: ConditionalValue<"center" | "start" | "end" | "left" | "right" | "normal" | "between" | "around" | "evenly" | "stretch" | "safe center" | "unsafe center">
}


interface FlexRowStyles extends FlexRowProperties, DistributiveOmit<SystemStyleObject, keyof FlexRowProperties | 'display'> {}

interface FlexRowPatternFn {
  (styles?: FlexRowStyles): string
  raw: (styles?: FlexRowStyles) => SystemStyleObject
}

/** A flex container that aligns items horizontally */
export declare const flexRow: FlexRowPatternFn;
