import { JSX, onMount } from "solid-js";
import ErrorImage from "/src/assets/error.png";
import WarningImage from "/src/assets/warning.png";
import InfoImage from "/src/assets/info.png";
import SuccessImage from "/src/assets/success.png";
import QuestionImage from "/src/assets/question.png";
import { Center, FlexRow } from "../../../panda-css/jsx";
import { float } from "../../../panda-css/patterns";
import { DialogType } from "~/stores/messageBoxStore";

export type DialogRef = {
  showModal: () => void;
  close: () => void;
  addEventListener: (event: string, callback: () => void) => void;
  removeEventListener: (event: string, callback: () => void) => void;
};

type DialogProps = {
  children?: JSX.Element | JSX.Element[];
  ref?: (el: DialogRef) => void;
};

export const Dialog = (props: DialogProps) => {
  let dialogRef: HTMLDialogElement;

  onMount(() => {
    const dialogHandler: DialogRef = {
      showModal() {
        dialogRef.showModal();
        dialogRef.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 250,
        });
      },
      close() {
        dialogRef.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 250,
        }).onfinish = () => {
          dialogRef.close();
        };
      },
      addEventListener(event: string, callback: () => void) {
        dialogRef.addEventListener(event, callback);
      },
      removeEventListener(event: string, callback: () => void) {
        dialogRef.removeEventListener(event, callback);
      },
    };
    props.ref?.(dialogHandler);
  });

  return (
    <dialog
      ref={dialogRef!}
      class={float({
        placement: "middle-center",
        width: "400px",

        outline: "none",
        border: "none",
        rounded: "xl",
        display: "hidden",

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
    <Center height={"36px"} width={"full"}>
      <p>{props.title}</p>
    </Center>
  );
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
    <FlexRow
      gap={2}
      justify={"stretch"}
      width={"full"}
      paddingX={1}
      paddingY={3}
      background={"tertiary"}
      fontSize={"medium"}
      border={"3px solid token(colors.secondaryDarker)"}
    >
      <img
        src={iconMap[props.type]}
        alt={props.type}
        height={"70px"}
        width={"70px"}
      />
      <p>{props.message}</p>
    </FlexRow>
  );
}

export function Controls(props: { children: JSX.Element | JSX.Element[] }) {
  return (
    <FlexRow width={"full"} padding={1} gap={1}>
      {props.children}
    </FlexRow>
  );
}
