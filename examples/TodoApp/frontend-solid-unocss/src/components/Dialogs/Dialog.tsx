import { JSX } from "solid-js";
import ErrorImage from "/src/assets/error.png";
import WarningImage from "/src/assets/warning.png";
import InfoImage from "/src/assets/info.png";
import SuccessImage from "/src/assets/success.png";
import QuestionImage from "/src/assets/question.png";
import { Tick } from "../icons/Tick";
import { messageBox } from "./MessageBox";

type DialogProps = {
  children?: JSX.Element | JSX.Element[];
  ref?: (el: HTMLDialogElement) => void;
};

export const Dialog = (props: DialogProps) => {
  return (
    <dialog
      ref={props.ref}
      position={"absolute top-50% left-50% z-9999"}
      // @ts-ignore
      translate={"x-[-50%] y-[-50%]"}
      w={"400px"}
      outline={"none"}
      border={"none"}
      rounded={"10px"}
      color={"text"}
      bg={"transparent [&::backdrop]:([rgba(0,0,0,0.5)])"}
      shadow={"primaryDarker [0_0_10px_8px]"}
      font={"bold size-18px"}
    >
      {props.children}
    </dialog>
  );
};

export function Title(props: { title: string }) {
  return (
    <div
      h={"36px"}
      grid={"row content-center justify-center"}
      border-b={"3px solid secondaryDarker"}
    >
      <p>{props.title}</p>
    </div>
  );
}

export type DialogType = "error" | "warning" | "info" | "success" | "question";

export enum DialogResult {
  OK = "OK",
  Cancel = "Cancel",
  Yes = "Yes",
  No = "No",
}

export function Content(props: { type: DialogType; message: string }) {
  const iconMap = {
    error: ErrorImage,
    warning: WarningImage,
    info: InfoImage,
    success: SuccessImage,
    question: QuestionImage,
  };

  return (
    <div
      m={"x-1"}
      p={"x-1 y-3"}
      border-b={"3px solid secondaryDarker"}
      bg={"tertiary"}
      grid={"col items-center"}
      font={"size-15px"}
    >
      <img
        h={"70px"}
        w={"70px"}
        mr={"10px"}
        src={iconMap[props.type]}
        alt={props.type}
      />
      <div>{props.message}</div>
    </div>
  );
}

export function Controls(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div
      flex={"~ row items-center content-center gap-1"}
      p={"1"}
    >
      {props.children}
    </div>
  );
}

export function Button(props: {
  onClick: () => void;
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <button
      h={"26px"}
      rounded={"1"}
      font={"bold size-15px"}
      flex={"1 ~ row items-center justify-center gap-1"}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
