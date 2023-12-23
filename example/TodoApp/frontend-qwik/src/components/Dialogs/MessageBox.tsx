import type { QRL } from "@builder.io/qwik";
import { $, component$, createContextId, useContext } from "@builder.io/qwik";
import ErrorImage from "~/media/assets/error.png?jsx";
import WarningImage from "~/media/assets/warning.png?jsx";
import InfoImage from "~/media/assets/info.png?jsx";
import SuccessImage from "~/media/assets/success.png?jsx";
import Tick from "~/media/icons/Tick";
import { button, controls, dialog, imageMessage, messageBoxContent, title } from "~/components/Dialogs/Dialog.css";

export type MessageBoxStore = {
  dialogRef: HTMLDialogElement | null;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  error: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  warning: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  info: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  success: QRL<(this: MessageBoxStore, message: string, title?: string) => void>;
  close: QRL<(this: MessageBoxStore) => void>;
};

export const createMessageBoxStore = (): MessageBoxStore => {
  return {
    dialogRef: null,
    type: "error",
    title: "",
    message: "",

    error: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "error";
      this.message = message;
      this.title = title === "" ? "Error" : title;
      this.dialogRef?.showModal();
    }),

    warning: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "warning";
      this.message = message;
      this.title = title === "" ? "Warning" : title;
      this.dialogRef?.showModal();
    }),

    info: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "info";
      this.message = message;
      this.title = title === "" ? "Information" : title;
      this.dialogRef?.showModal();
    }),

    success: $(function (this: MessageBoxStore, message: string, title: string = "") {
      this.type = "success";
      this.message = message;
      this.title = title === "" ? "Successful" : title;
      this.dialogRef?.showModal();
    }),

    close: $(function (this: MessageBoxStore) {
      this.dialogRef?.close();
    })
  };
};

export const MessageBoxContext = createContextId<MessageBoxStore>("MessageBox");

const iconMap = {
  error: <ErrorImage />,
  warning: <WarningImage />,
  info: <InfoImage />,
  success: <SuccessImage />
};

export const MessageBox = component$(() => {
  const messageBox = useContext(MessageBoxContext);

  return (
    <dialog ref={(el) => (messageBox.dialogRef = el)} class={dialog}>
      <div class={messageBoxContent}>
        <div class={title}>
          <p>{messageBox.title}</p>
        </div>
        <div class={imageMessage}>
          {iconMap[messageBox.type]}
          <div>{messageBox.message}</div>
        </div>
        <div class={controls}>
          <button class={button} onClick$={() => messageBox.close()}>
            OK <Tick />
          </button>
        </div>
      </div>
    </dialog>
  );
});
