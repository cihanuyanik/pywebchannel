import { JSX } from "solid-js";
import ErrorImage from "/src/assets/error.png";
import WarningImage from "/src/assets/warning.png";
import InfoImage from "/src/assets/info.png";
import SuccessImage from "/src/assets/success.png";
import QuestionImage from "/src/assets/question.png";
import { css } from "../../../styled-system/css";

type DialogProps = {
  children?: JSX.Element | JSX.Element[];
  ref?: (el: HTMLDialogElement) => void;
};

export const Dialog = (props: DialogProps) => {
  return (
    <dialog
      ref={props.ref}
      class={css({
        position: "absolute",
        top: "50%",
        left: "50%",
        zIndex: "9999",
        transform: "translate(-50%, -50%)",
        width: "400px",
        outline: "none",
        border: "none",
        rounded: "xl",

        color: "text",
        background: "transparent",
        "&::backdrop": {
          background: "rgba(0,0,0,0.5)",
        },
        boxShadow: "0 0 10px 8px token(colors.primaryDarker)",
        fontWeight: "bold",
        fontSize: "18px",
      })}
    >
      {props.children}
    </dialog>
  );
};

export function Title(props: { title: string }) {
  return (
    <div
      class={css({
        height: "36px",
        borderBottom: "3px solid token(colors.secondaryDarker)",
        display: "grid",
        gridAutoFlow: "row",
        placeContent: "center",
        placeItems: "center",
      })}
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
      class={css({
        display: "grid",
        gridAutoFlow: "column",
        alignItems: "center",
        paddingX: "1",
        paddingY: "3",
        marginX: "1",
        background: "tertiary",
        fontSize: "15px",
        borderBottom: "3px solid token(colors.secondaryDarker)",

        "& img": {
          height: "70px",
          width: "70px",
          marginRight: "10px",
        },
      })}
    >
      <img src={iconMap[props.type]} alt={props.type} />
      <div>{props.message}</div>
    </div>
  );
}

export function Controls(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div
      class={css({
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "1",
        padding: "1",
      })}
    >
      {props.children}
    </div>
  );
}
